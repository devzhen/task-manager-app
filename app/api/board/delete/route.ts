import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const DELETE = async (req: Request) => {
  const prisma = new PrismaClient({ log: ['query', 'info', 'error', 'warn'] });
  try {
    const { boardId } = await new Response(req.body).json();

    if (!boardId) {
      return NextResponse.json(
        { error: `The required body param 'boardId' was not provided` },
        { status: 422 },
      );
    }

    const currentBoard = await prisma.boards.findUnique({
      where: {
        id: boardId,
      },
    });
    if (!currentBoard) {
      return NextResponse.json(
        { error: `The board with the id - '${boardId}' was not found` },
        { status: 422 },
      );
    }

    const board = await prisma.boards.delete({
      where: {
        id: boardId,
      },
    });

    return NextResponse.json(board);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
