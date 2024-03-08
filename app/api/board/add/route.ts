import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

import type { BoardType } from '@/app/types';
import constructBoardHref from '@/app/utils/constructBoardHref';

export const POST = async (req: Request) => {
  try {
    const { name } = await new Response(req.body).json();

    const res = await sql`
      INSERT INTO Boards 
        (name, href) 
      VALUES (${name}, '/') 
      RETURNING *;`;
    let board = res.rows[0];
    board = constructBoardHref(board as BoardType);

    return NextResponse.json({ board });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
