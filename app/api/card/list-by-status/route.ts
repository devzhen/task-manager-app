import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';
import type { HttpError } from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { assocPath, compose, path as ramdaPath } from 'ramda';

import { PAGINATION } from '@/app/constants';
import type { CardType } from '@/app/types';

type QueryResult = {
  queryResult: {
    total: number;
    cards: CardType[];
    hasMore: boolean;
  }[];
};

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const boardId = searchParams.get('boardId');
  const statusId = searchParams.get('statusId');

  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam) : 1;

  const prePageParam = searchParams.get('perPage');
  const perPage = prePageParam ? parseInt(prePageParam) : PAGINATION.perPage;

  const offset = (page - 1) * perPage;

  const prisma = new PrismaClient();

  try {
    if (!boardId) {
      throw createError(422, `The required query param 'boardId' was not provided`);
    }
    if (!statusId) {
      throw createError(422, `The required query param 'statusId' was not provided`);
    }

    const currentBoard = await prisma.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        statuses: true,
      },
    });

    if (!currentBoard) {
      throw createError(422, `The board with the id - '${boardId}' was not found`);
    }

    if (!currentBoard.statuses.map((item) => item.id).includes(statusId)) {
      throw createError(
        422,
        `The current status - '${statusId}' was not found in the board - ${statusId}.`,
      );
    }

    const result: [QueryResult] = await prisma.$queryRaw`
      SELECT json_agg(json_build_object(
        'page', ${page},
        'total', count_of_records, 
        'cards', cards,
        'hasMore', get_has_more_cards_by_status_id(${boardId}, ${statusId}, ${perPage}, ${offset})
      )) AS "queryResult"
      FROM (
          SELECT
              (SELECT get_cards_count_by_status_id(${boardId}, ${statusId})) AS count_of_records,
              COALESCE(json_agg(cards.*), '[]') AS cards
          FROM
              get_cards_by_status_id(${boardId}, ${statusId}, ${perPage}, ${offset}) AS cards
      ) AS subquery;
    `;

    return NextResponse.json(
      compose(
        assocPath(['boardId'], boardId),
        assocPath(['statusId'], statusId),
        assocPath(['perPage'], perPage),
        assocPath(['page'], page),
        ramdaPath(['0', 'queryResult', '0']),
      )(result),
    );
  } catch (error) {
    return NextResponse.json({
      error: (error as HttpError).message,
      status: (error as HttpError).statusCode || 500,
    });
  } finally {
    await prisma.$disconnect();
  }
};
