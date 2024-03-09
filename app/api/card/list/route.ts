import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

import { STATUSES } from '@/app/constants';
import type { CardType, TagType } from '@/app/types';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const board = searchParams.get('board');

  try {
    if (!board) {
      return new Response(`The required query param 'board' was not provided`, {
        status: 500,
      });
    }

    const res = await sql<CardType>`SELECT * FROM Cards WHERE boardId = ${board};`;
    const acc = {} as Record<keyof typeof STATUSES, CardType[]>;

    for (let i = 0; i < res.rows.length; i++) {
      const card = res.rows[i];

      const prev = acc[card.status] || [];

      const tags = await sql<TagType>`SELECT * FROM Tags WHERE cardId = ${card.id};`;
      card.tags = tags.rows;

      acc[card.status] = [...prev, card];
    }
    return NextResponse.json(acc);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }
};
