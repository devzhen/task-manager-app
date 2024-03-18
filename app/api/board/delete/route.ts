import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const DELETE = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  try {
    const { id } = (await req.json()) as { id: string };

    if (!id) {
      return NextResponse.json(
        { error: `The required body param 'id' was not provided` },
        { status: 422 },
      );
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
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
