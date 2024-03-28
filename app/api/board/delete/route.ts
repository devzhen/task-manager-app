import { PrismaClient } from '@prisma/client';
import type { HttpError } from 'http-errors';
import createError from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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
    return NextResponse.json(
      { error: (error as HttpError).message },
      { status: (error as HttpError).statusCode || 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
};
