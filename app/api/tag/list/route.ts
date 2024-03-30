import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import constructResponseError from '@/app/utils/constructResponseError';
import getUserFromCookieToken from '@/app/utils/getUserFromCookieToken';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const board = searchParams.get('board');

  const prisma = new PrismaClient();

  try {
    const user = getUserFromCookieToken();

    if (!user) {
      throw createError(401, `Authentication Failed`);
    }

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
    return constructResponseError(error);
  } finally {
    await prisma.$disconnect();
  }
};
