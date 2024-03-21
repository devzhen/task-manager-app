import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { assocPath, compose, path as ramdaPath } from 'ramda';

import { PAGINATION } from '@/app/constants';

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
      include: {
        statuses: true,
      },
    });

    if (!currentBoard) {
      return NextResponse.json(
        { error: `The board with the id - '${board}' was not found` },
        { status: 404 },
      );
    }

    const statusQuery = currentBoard.statuses.map((item) => {
      return `
      SELECT
        '${item.name}' AS status,
        COALESCE(json_agg(cards), '[]') AS cards,
        get_has_more_cards_by_status_id('${currentBoard.id}', '${item.id}', ${PAGINATION.perPage}, 0) AS has_more,
        (SELECT * FROM get_cards_count_by_status_id('${currentBoard.id}', '${item.id}')) AS total
      FROM
        get_cards_by_status_id('${currentBoard.id}', '${item.id}', ${PAGINATION.perPage}, 0) AS cards`;
    }).join(`
      UNION ALL`);

    const sql = `
      WITH status_data AS (
        ${statusQuery}
      )
      SELECT
        jsonb_object_agg(
          status,
          jsonb_build_object(
            'cards', cards,
            'hasMore', has_more,
            'total', total
          )
        ) AS statuses,
        (SELECT SUM(total) FROM status_data) AS total
      FROM
        status_data;
    `;

    const result = await prisma.$queryRawUnsafe(sql);

    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };

    return NextResponse.json(
      compose(
        assocPath(['boardId'], currentBoard.id),
        assocPath(['cardsPerStatus'], PAGINATION.perPage),
        ramdaPath(['0']),
      )(result),
    );
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
