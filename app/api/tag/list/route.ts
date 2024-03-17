import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const board = searchParams.get('board');

  const prisma = new PrismaClient();

  try {
    if (!board) {
      return NextResponse.json(
        { error: `The required query param 'board' was not provided` },
        { status: 422 },
      );
    }

    const currentBoard = await prisma.board.findUnique({
      where: {
        id: board,
      },
    });
    if (!currentBoard) {
      return NextResponse.json(
        { error: `The board with the id - '${board}' was not found` },
        { status: 404 },
      );
    }

    const tags = await prisma.tag.findMany({
      where: {
        boardId: board,
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
