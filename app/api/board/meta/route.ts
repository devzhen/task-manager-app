import { PrismaClient } from '@prisma/client';
import type { HttpError } from 'http-errors';
import createError from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { assoc, compose, omit, path } from 'ramda';

export const GET = async (request: NextRequest) => {
  const prisma = new PrismaClient();

  const boardId = request.nextUrl.searchParams.get('boardId');

  try {
    if (!boardId) {
      throw createError(422, `The required query param 'boardId' was not provided`);
    }

    const meta = await prisma.$transaction(async (tx) => {
      const boardMeta = await tx.board.findUnique({
        where: {
          id: boardId,
        },
        include: {
          _count: {
            select: {
              cards: true,
              tags: true,
              statuses: true,
            },
          },
        },
      });

      let finalObj = { ...boardMeta };
      const count = path(['_count'], boardMeta);

      finalObj = compose(assoc('count', count), omit(['_count']))(finalObj);

      const statusMeta = await prisma.status.findMany({
        where: {
          boardId,
        },
        include: {
          _count: {
            select: { cards: true },
          },
        },
      });

      let statuses = {};
      for (const status of statusMeta) {
        const countCards = path(['_count', 'cards'], status);
        statuses = assoc(status.name, countCards, statuses);
      }

      finalObj = assoc('statuses', statuses, finalObj);

      return finalObj;
    });

    return NextResponse.json(meta);
  } catch (error) {
    return NextResponse.json({
      error: (error as HttpError).message,
      status: (error as HttpError).statusCode || 500,
    });
  } finally {
    await prisma.$disconnect;
  }
};
