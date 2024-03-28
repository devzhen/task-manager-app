import { PrismaClient } from '@prisma/client';
import type { HttpError } from 'http-errors';
import createError from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { validate } from 'uuid';

export const GET = async (request: NextRequest) => {
  const boardId = request.nextUrl.searchParams.get('boardId');

  const prisma = new PrismaClient();

  try {
    if (!boardId || !validate(boardId)) {
      throw createError(422, `The required query param 'boardId' was not provided`);
    }

    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        statuses: {
          orderBy: {
            position: 'asc',
          },
        },
        tags: true,
      },
    });

    return NextResponse.json(board);
  } catch (error) {
    return NextResponse.json({
      error: (error as HttpError).message,
      status: (error as HttpError).statusCode || 500,
    });
  } finally {
    await prisma.$disconnect();
  }
};
