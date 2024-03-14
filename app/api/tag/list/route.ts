import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { STATUSES } from '@/app/constants';
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

    const currentBoard = await prisma.boards.findUnique({
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

    const cardsRes = await prisma.cards.findMany({
      where: {
        boardId: board,
      },
      orderBy: [{ position: 'asc' }],
      include: {
        attachments: true,
        tags: true,
      },
    });
    */
    const boards: CardType[] = await prisma.$queryRaw`
      SELECT 
        "Cards".*,
        ARRAY(
          SELECT json_build_object(
            'id', "Tags".id, 
            'name', "Tags".name, 
            'color', "Tags".color, 
            'fontColor', "Tags"."fontColor",
            'cardId', "Tags"."cardId",
            'createdAt', "Tags"."createdAt"
          )
          FROM "Tags" 
          WHERE "Cards".id = "Tags"."cardId"
      ) AS tags,
      ARRAY(
        SELECT json_build_object(
          'id', "Attachments".id, 
          'name', "Attachments".name, 
          'url', "Attachments".url,
          'cardId', "Attachments"."cardId",
          'createdAt', "Attachments"."createdAt"
        )
        FROM "Attachments" 
        WHERE "Cards".id = "Attachments"."cardId"
      ) AS attachments
      FROM 
        "Cards"
      WHERE 
        "Cards"."boardId"::text = ${board}
      ORDER BY
        "Cards".position;
    `;

    let total = 0;

    const cards = {} as Record<keyof typeof STATUSES, CardType[]>;

    for (let i = 0; i < boards.length; i++) {
      const card = boards[i] as CardType;
      const cardStatus = card.status as keyof typeof STATUSES;

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
