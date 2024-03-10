import { put, del } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let fileUrl = '';

  try {
    const formData = await request.formData();
    const cardId = formData.get('cardId') as string;
    const file = formData.get('file') as File;

    if (!cardId) {
      return NextResponse.json(
        { error: `The required body param 'cardId' was not provided` },
        {
          status: 500,
        },
      );
    }

    const res = await sql`SELECT COUNT(id) FROM Cards WHERE id = ${cardId};`;
    if (res.rows[0]?.count !== '1') {
      return NextResponse.json(
        { error: `There is no card with the id ${cardId}` },
        {
          status: 500,
        },
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: `The required body param 'file' was not provided` },
        {
          status: 500,
        },
      );
    }

    const blob = await put(file.name, file, {
      access: 'public',
    });
    fileUrl = blob.url;

    const insertRes = await sql`
      INSERT INTO Attachment
        (name, url, cardId)
      VALUES
        (${file.name}, ${blob.url}, ${cardId})
      RETURNING *;`;

    return NextResponse.json({ blob, rows: insertRes.rows });
  } catch (error) {
    if (fileUrl) {
      del(fileUrl);
    }

    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }
}
