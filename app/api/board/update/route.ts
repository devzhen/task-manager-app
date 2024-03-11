import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

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

    const board = res.rows[0];

    return NextResponse.json({ board });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
