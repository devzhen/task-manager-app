import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { validate } from 'uuid';

import constructResponseError from '@/app/utils/constructResponseError';
import getUserFromCookieToken from '@/app/utils/getUserFromCookieToken';

export const GET = async (request: NextRequest) => {
  const boardId = request.nextUrl.searchParams.get('boardId');

  const prisma = new PrismaClient();

  try {
    const user = getUserFromCookieToken();

    if (!user) {
      throw createError(401, `Authentication Failed`);
    }

    if (!boardId || !validate(boardId)) {
      throw createError(422, `The required query param 'boardId' was not provided`);
    }

    const userBoard = await prisma.userBoard.findFirst({
      where: {
        boardId: boardId,
        userId: user.id,
      },
      select: {
        board: {
          include: {
            statuses: {
              orderBy: {
                position: 'asc',
              },
            },
            tags: true,
          },
        },
      },
    });

    if (!userBoard) {
      throw createError(403, `This user is not permitted to this board`);
    }

    return NextResponse.json(userBoard.board);
  } catch (error) {
    return constructResponseError(error);
  } finally {
    await prisma.$disconnect();
  }
};
