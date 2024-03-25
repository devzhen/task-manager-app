import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isNil, remove } from 'ramda';
import { validate } from 'uuid';

import type { UpdateCardPositionBodyType } from '@/app/types';

export const PUT = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  try {
    const body = (await req.json()) as UpdateCardPositionBodyType;

    const requiredFields = ['boardId', 'oldStatusId', 'cardId', 'position', 'newStatusId'];
    for (const field of requiredFields) {
      const value = body[field as keyof UpdateCardPositionBodyType];

      if (isNil(value)) {
        return NextResponse.json(
          { error: `The required body param '${field}' was not provided` },
          { status: 422 },
        );
      }

      if (field !== 'position' && !validate(value as string)) {
        return NextResponse.json(
          { error: `The body param '${field}' is not valid id - ${value}` },
          { status: 422 },
        );
      }

      if (field === 'position' && typeof value !== 'number') {
        return NextResponse.json(
          { error: `The body param '${field}' is not valid number - '${value}'` },
          { status: 422 },
        );
      }

      if (field === 'position' && (value as number) < 1) {
        return NextResponse.json(
          { error: `The body param '${field}' is incorrect - '${value}'` },
          { status: 422 },
        );
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const [oldStatus, newStatus, oldStatusCards, newStatusCards] = await Promise.all([
        tx.status.findUnique({
          where: {
            id: body.oldStatusId,
          },
        }),
        tx.status.findUnique({
          where: {
            id: body.newStatusId,
          },
        }),
        tx.card.findMany({
          where: {
            statusId: body.oldStatusId,
            boardId: body.boardId,
          },
          orderBy: [
            {
              updatedAt: 'asc',
            },
            {
              position: 'asc',
            },
          ],
        }),
        tx.card.findMany({
          where: {
            statusId: body.newStatusId,
            boardId: body.boardId,
          },
          orderBy: [
            {
              updatedAt: 'asc',
            },
            {
              position: 'asc',
            },
          ],
        }),
      ]);

      if (isNil(oldStatus) || isNil(newStatus)) {
        throw new Error('The status ids are not correct, any record was found');
      }

      const res = {
        [oldStatus?.name as string]: [],
        [newStatus?.name as string]: [
          {
            id: body.cardId,
            position: body.position > newStatusCards.length ? newStatusCards.length : body.position,
            statusName: newStatus.name,
            statusId: newStatus.id,
            title: '__DRAGGED__',
          },
        ],
      };

      // Splice into 2 array - before the new position and after the new position
      const newStatusCardsBefore = newStatusCards
        .filter((item) => item.id !== body.cardId)
        .slice(0, body.position - 1);
      const newStatusCardsAfter = newStatusCards
        .filter((item) => item.id !== body.cardId)
        .slice(body.position - 1);

      // Remove from an old status
      const index = oldStatusCards.findIndex((item) => item.id === body.cardId);
      const oldStatusCardsSpliced = index !== -1 ? remove(index, 1, oldStatusCards) : [];

      for (
        let i = 0, k = 0, t = 0;
        i < newStatusCardsBefore.length,
          k < newStatusCardsAfter.length,
          t < oldStatusCardsSpliced.length;
        i++, k++, t++
      ) {
        const cardBefore = newStatusCardsBefore[i];
        if (cardBefore) {
          res[newStatus.name].push({
            id: cardBefore.id,
            position: i + 1,
            statusName: newStatus.name,
            statusId: newStatus.id,
            title: cardBefore.title,
          });
        }

        const cardAfter = newStatusCardsAfter[k];
        if (cardAfter) {
          res[newStatus.name].push({
            id: cardAfter.id,
            position: k + 1 + body.position,
            statusName: newStatus.name,
            statusId: newStatus.id,
            title: cardAfter.title,
          });
        }

        const oldCard = oldStatusCardsSpliced[t];
        if (oldCard && newStatus.id !== oldStatus.id) {
          res[oldStatus.name].push({
            id: oldCard.id,
            position: t + 1,
            statusName: oldStatus.name,
            statusId: oldStatus.id,
            title: oldCard.title,
          });
        }
      }

      const finalArr =
        oldStatus.id === newStatus.id
          ? res[newStatus.name]
          : [...res[newStatus.name], ...res[oldStatus.name]];

      const updateSql = `
UPDATE "Card" AS Card SET
  position = Temp.position,
  "statusId" = Temp."statusId"
FROM (VALUES
    ${(() => {
      let sql = ``;
      for (let i = 0; i < finalArr.length; i++) {
        const card = finalArr[i];
        const end = i === finalArr.length - 1 ? '' : ',';

        sql = `${sql}('${card.id}', ${card.position}, uuid('${card.statusId}'))${end}\n`;
      }

      return sql;
    })()}
) AS Temp(id, position, "statusId")
WHERE Card.id::text = Temp.id;`;

      await tx.$executeRawUnsafe(updateSql);

      return res;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
