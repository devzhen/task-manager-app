import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const { boardId } = await new Response(req.body).json();

    if (!boardId) {
      return NextResponse.json(
        { error: `The required body param 'boardId' was not provided` },
        { status: 422 },
      );
    }

    await sql`DELETE FROM Boards WHERE id = ${boardId} RETURNING *;`;

    return NextResponse.json({ boardId });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
