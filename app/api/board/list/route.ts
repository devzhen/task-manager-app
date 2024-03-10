import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

import type { BoardType } from '@/app/types';
import constructBoardHref from '@/app/utils/constructBoardHref';

export const GET = async () => {
  try {
    const res = await sql<BoardType>`SELECT * FROM Boards ORDER BY created`;

    const boards = res.rows.map((item) => ({
      ...item,
      href: constructBoardHref(item).href,
    }));

    return NextResponse.json(boards);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
