import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { validate } from 'uuid';

import constructResponseError from '@/app/utils/constructResponseError';
import getUserFromCookieToken from '@/app/utils/getUserFromCookieToken';

export const DELETE = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  try {
    const user = getUserFromCookieToken();

    if (!user) {
      throw createError(401, `Authentication Failed`);
    }

    const body = await req.json();

    if (!body.cardId || !validate(body.cardId)) {
      throw createError(
        422,
        `The required body param 'cardId' was not provided or not a valid uuid`,
      );
    }

    const card = await prisma.card.findUnique({
      where: {
        id: body.cardId,
      },
    });

    if (!card) {
      throw createError(422, `The card with the id - '${body.cardId}' was not found`);
    }

    await prisma.$transaction(async (tx) => {
      await Promise.all([
        tx.attachment.deleteMany({
          where: {
            cardId: body.cardId,
          },
        }),
        tx.tagLinker.deleteMany({
          where: {
            cardId: body.cardId,
          },
        }),
        tx.cardStatusHistory.deleteMany({
          where: {
            cardId: body.cardId,
          },
        }),
      ]);

      await tx.card.delete({
        where: {
          id: body.cardId,
        },
      });
    });

    return NextResponse.json(card);
  } catch (error) {
    return constructResponseError(error);
  } finally {
    await prisma.$disconnect();
  }
};
