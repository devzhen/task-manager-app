import { PrismaClient } from '@prisma/client';
import type { HttpError } from 'http-errors';
import createError from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { validate } from 'uuid';

export const DELETE = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  try {
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
    return NextResponse.json({
      error: (error as HttpError).message,
      status: (error as HttpError).statusCode || 500,
    });
  } finally {
    await prisma.$disconnect();
  }
};
