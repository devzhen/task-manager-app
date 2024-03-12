import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

import type { UpdateCardBodyType } from '@/app/types';

export const PUT = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as UpdateCardBodyType;

    if (!body.id) {
      return NextResponse.json(
        { error: `The required query param 'id' was not provided` },
        { status: 422 },
      );
    }

    if (!body.fields) {
      return NextResponse.json(
        { error: `The required query param 'fields' was not provided` },
        { status: 422 },
      );
    }

    if (!body.values) {
      return NextResponse.json(
        { error: `The required query param 'body' was not provided` },
        { status: 422 },
      );
    }

    body.fields.forEach(async (field, index) => {
      const value = body.values[index];

      const query = `
      UPDATE Cards
        SET ${field} = '${value}'
      WHERE
        id = ${body.id};`;

      console.log(query);

      await sql`
        UPDATE Cards
          SET ${field} = '${value}'
        WHERE
          id = ${body.id};`;
    });

    const card = await sql`SELECT * FROM Cards WHERE id = ${body.id}`;

    return NextResponse.json(card);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }
};
