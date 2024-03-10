import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const basicAuth = req.headers.get('Authorization');

  if (basicAuth !== process.env.API_AUTH_TOKEN) {
    return NextResponse.json({ error: 'Auth Required' }, { status: 401 });
  }

  try {
    await sql`DROP TABLE IF EXISTS Statuses CASCADE;`;
    const result = await sql`
      CREATE TABLE Statuses ( 
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name varchar(255),
        UNIQUE(name)
      );`;

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }
}