import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { compose, defaultTo, isNil, last } from 'ramda';
import { validate } from 'uuid';

import type { CardStatusHistoryType, UpdateCardPositionBodyType } from '@/app/types';

export const PUT = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  try {
    const body = (await req.json()) as UpdateCardPositionBodyType;

    const requiredFields = ['newStatusId', 'cardId'];
    for (const field of requiredFields) {
      const value = body[field as keyof UpdateCardPositionBodyType];

      if (isNil(value)) {
        throw new Error(`The required body param '${field}' was not provided`);
      }
    }

    if (!validate(body.cardId) || !validate(body.newStatusId)) {
      throw new Error(`The body params 'cardId' or 'newStatusId' is not valid uuid`);
    }

    // If body.insertBeforeCardId === null - append to the end of a list
    const result = await prisma.$transaction(async (tx) => {
      const [newStatus, cardsHistory] = await Promise.all([
        tx.status.findUnique({ where: { id: body.newStatusId } }),
        body.insertBeforeCardId === null
          ? tx.cardStatusHistory.findMany({
              where: { statusId: body.newStatusId },
              orderBy: {
                moveDate: 'desc',
              },
            })
          : tx.cardStatusHistory.findMany({
              where: { statusId: body.newStatusId, cardId: body.insertBeforeCardId },
            }),
      ]);

      const insertBeforeCardHistory = compose(
        last,
        defaultTo([]),
      )(cardsHistory) as CardStatusHistoryType;

      if (isNil(newStatus)) {
        throw new Error(`The status with the id - '${body.newStatusId}' wasn't found`);
      }

      if (body.insertBeforeCardId !== null && isNil(insertBeforeCardHistory)) {
        throw new Error(
          `The (insert before) card with the id - '${body.insertBeforeCardId}' wasn't found`,
        );
      }

      const date = !isNil(insertBeforeCardHistory?.moveDate)
        ? new Date(insertBeforeCardHistory?.moveDate)
        : new Date();
      const dateString = date.toISOString().slice(0, 19).replace('T', ' ');

      // Update card histories placed above
      const updateOtherCardHistoriesSql = `
UPDATE "CardStatusHistory"
SET 
  "moveDate" = "moveDate" + INTERVAL '2 second'
WHERE id IN (
  SELECT 
    id
  FROM 
    "CardStatusHistory"
  WHERE 
    "moveDate" > '${dateString}' 
  AND "statusId" = '${body.newStatusId}'
  ${(() => {
    if (isNil(body.insertBeforeCardId)) {
      return '';
    }

    return `AND "cardId" != '${body.insertBeforeCardId}'`;
  })()}
  AND "cardId" != '${body.cardId}'
);
`;
      date.setSeconds(date.getSeconds() + 1);
      const dateString2 = date.toISOString().replace('T', ' ').replace('Z', '');

      // Update s current card history
      const updateCardHistorySql = `
UPDATE 
  "CardStatusHistory"
SET 
  "moveDate" = '${dateString2}', 
  "statusId" = '${body.newStatusId}'
WHERE 
  "cardId" = '${body.cardId}';
`;

      // Update s card
      const updateCardSql = `
UPDATE 
  "Card"
SET 
  "statusId" = '${body.newStatusId}'
WHERE 
  "id" = '${body.cardId}';
`;

      await Promise.all([
        tx.$executeRawUnsafe(updateOtherCardHistoriesSql),
        tx.$executeRawUnsafe(updateCardHistorySql),
        tx.$executeRawUnsafe(updateCardSql),
      ]);

      return {};
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
