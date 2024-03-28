import { PrismaClient } from '@prisma/client';
import type { HttpError } from 'http-errors';
import createError from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const board = searchParams.get('board');

  const prisma = new PrismaClient();

  try {
    if (!board) {
      throw createError(422, `The required query param 'board' was not provided`);
    }

    const currentBoard = await prisma.board.findUnique({
      where: {
        id: board,
      },
    });
    if (!currentBoard) {
      throw createError(422, `The board with the id - '${board}' was not found`);
    }

    const tags = await prisma.tag.findMany({
      where: {
        boardId: board,
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json(
      { error: (error as HttpError).message },
      { status: (error as HttpError).statusCode || 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
};
