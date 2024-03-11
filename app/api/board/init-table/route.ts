import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const basicAuth = req.headers.get('Authorization');

  if (basicAuth !== process.env.API_AUTH_TOKEN) {
    return NextResponse.json({ error: 'Auth Required' }, { status: 401 });
  }

  try {
    await sql`TRUNCATE Boards CASCADE;`;
    await sql`
        INSERT INTO Boards 
          (name, protected) 
        VALUES 
          ('Home board', TRUE);`;
    await new Promise((res) => setTimeout(res, 1000));
    await sql`
        INSERT INTO Boards 
          (name, protected) 
        VALUES 
          ('Design board', FALSE);`;
    await new Promise((res) => setTimeout(res, 1000));
    await sql`
        INSERT INTO Boards 
          (name, protected) 
        VALUES 
          ('Learning board', FALSE);`;

    const boards = await sql`SELECT * FROM Boards;`;
    return NextResponse.json({ boards }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }
}
