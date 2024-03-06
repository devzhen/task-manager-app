import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const basicAuth = req.headers.get('Authorization');

  if (basicAuth !== process.env.API_AUTH_TOKEN) {
    return NextResponse.json({ error: 'Auth Required' }, { status: 401 });
  }

  try {
    await sql`
        INSERT INTO Boards 
          (name, href) 
        VALUES 
          ('Home board', '/');`;
    await new Promise((res) => setTimeout(res, 1000));
    await sql`
        INSERT INTO Boards 
          (name, href) 
        VALUES 
          ('Design board', '/');`;
    await new Promise((res) => setTimeout(res, 1000));
    await sql`
        INSERT INTO Boards 
          (name, href) 
        VALUES 
          ('Learning board', '/');`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const boards = await sql`SELECT * FROM Boards;`;
  return NextResponse.json({ boards }, { status: 200 });
}
