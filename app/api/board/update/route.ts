import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

import type { BoardType } from '@/app/types';
import constructBoardHref from '@/app/utils/constructBoardHref';

export const PUT = async (req: Request) => {
  try {
    const { name, id } = await new Response(req.body).json();

    if (!name || !id) {
      return NextResponse.json(
        { error: `The required body params 'name' and 'id' were not provided` },
        { status: 422 },
      );
    }

    const res = await sql`UPDATE Boards SET name = ${name} WHERE id = ${id} RETURNING *;`;

    let board = res.rows[0];
    board = constructBoardHref(board as BoardType);

    return NextResponse.json({ board });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
