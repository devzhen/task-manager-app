import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { STATUSES } from '@/app/constants';
import type { CardType } from '@/app/types';

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

    /*
      !!!!!! 1.5 times slower
    */
    // const cardsRes = await prisma.card.findMany({
    //   where: {
    //     boardId: board,
    //   },
    //   orderBy: [{ position: 'asc' }],
    //   include: {
    //     attachments: true,
    //     tags: {
    //       include: {
    //         tag: true,
    //       },
    //     },
    //     status: true,
    //   },
    // });
    const cardsRes: CardType[] = await prisma.$queryRaw`
      SELECT
        "Card".*,
        ARRAY(
          SELECT json_build_object(
            'id', "TagLinker".id,
            'createdAt', "TagLinker"."createdAt",
            'name', "Tag".name,
            'color', "Tag".color,
            'fontColor', "Tag"."fontColor",
            'tagId', "Tag"."id"
          )
          FROM "TagLinker"
          JOIN "Tag" On "Tag".id = "TagLinker"."tagId"
          WHERE "Card".id = "TagLinker"."cardId"
      ) AS tags,
      ARRAY(
        SELECT json_build_object(
          'id', "Attachment".id,
          'name', "Attachment".name,
          'url', "Attachment".url,
          'cardId', "Attachment"."cardId",
          'createdAt', "Attachment"."createdAt"
        )
        FROM "Attachment"
        WHERE "Card".id = "Attachment"."cardId"
      ) AS attachments,
      (SELECT json_build_object(
          'id', "Status".id,
          'name', "Status".name,
          'boardId', "Status"."boardId",
          'createdAt', "Status"."createdAt"
        )
        FROM "Status"
        WHERE "Card"."statusId" = "Status"."id"
      ) AS status
      FROM
        "Card"
      WHERE
        "Card"."boardId"::text = ${board}
      ORDER BY
        "Card".position;
    `;

    let total = 0;

    const cards = {} as Record<keyof typeof STATUSES, CardType[]>;

    for (let i = 0; i < cardsRes.length; i++) {
      const card = cardsRes[i] as unknown as CardType;
      const cardStatus = card.status.name as keyof typeof STATUSES;

      const prev = cards[cardStatus] || [];

      cards[cardStatus] = [...prev, card];

      total = total + 1;
    }

    return NextResponse.json({ cards, total });
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
