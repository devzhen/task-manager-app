import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

import { BoardType } from '@/app/types';
import constructBoardHref from '@/app/utils/constructBoardHref';

export const GET = async () => {
  try {
    const res = await sql`SELECT * FROM Boards`;

    const boards = res.rows.map((item) => ({
      ...item,
      href: constructBoardHref(item as BoardType).href,
    }));

    return NextResponse.json(boards);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
