import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

import { STATUSES } from '@/app/constants';
import type { CardType } from '@/app/types';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const board = searchParams.get('board');

  try {
    if (!board) {
      return new Response(`The required query param 'board' was not provided`, {
        status: 500,
      });
    }

    const res = await sql<CardType>`
      SELECT 
        Cards.*, 
        ARRAY(
            SELECT json_build_object(
              'id', Tags.id, 
              'name', Tags.name, 
              'color', Tags.color, 
              'fontColor', Tags.fontcolor,
              'cardId', Tags.cardid,
              'created', Tags.created
            )
            FROM Tags 
            WHERE Cards.id = Tags.cardId
        ) AS tags,
        ARRAY(
            SELECT json_build_object(
              'id', Attachments.id, 
              'name', Attachments.name, 
              'url', Attachments.url,
              'cardId', Attachments.cardid,
              'created', Attachments.created
            )
            FROM Attachments 
            WHERE Cards.id = Attachments.cardId
        ) AS attachments
      FROM 
        Cards
      WHERE 
        Cards.boardid = ${board};
    `;

    const acc = {} as Record<keyof typeof STATUSES, CardType[]>;

    for (let i = 0; i < res.rows.length; i++) {
      const card = res.rows[i];

      const prev = acc[card.status] || [];

      acc[card.status] = [...prev, card];
    }

    return NextResponse.json(acc);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }
};
