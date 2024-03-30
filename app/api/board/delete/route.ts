import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import constructResponseError from '@/app/utils/constructResponseError';

export const DELETE = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  try {
    const { id } = (await req.json()) as { id: string };

    if (!id) {
      throw createError(422, `The required body param 'id' was not provided`);
    }

    // Transaction
    const deletedBoard = await prisma.$transaction(async (tx) => {
      const board = await tx.board.findUnique({ where: { id } });

      await Promise.all([
        tx.userBoard.deleteMany({
          where: {
            boardId: id,
          },
        }),
        tx.tagLinker.deleteMany({
          where: {
            boardId: id,
          },
        }),
        tx.card.deleteMany({
          where: {
            boardId: id,
          },
        }),
      ]);

      await Promise.all([
        tx.tag.deleteMany({
          where: {
            boardId: id,
          },
        }),
        tx.status.deleteMany({
          where: {
            boardId: id,
          },
        }),
      ]);

      await tx.board.delete({
        where: {
          id,
        },
      });

      return board;
    });

    return NextResponse.json(deletedBoard);
  } catch (error) {
    return constructResponseError(error);
  } finally {
    await prisma.$disconnect();
  }
};
