import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

import type { BoardType } from '@/app/types';

export const GET = async () => {
  try {
    const res = await sql<BoardType>`SELECT * FROM Boards ORDER BY created`;

    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
