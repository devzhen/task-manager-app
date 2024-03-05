import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await sql`INSERT INTO Boards 
      (name, href) 
    VALUES 
      ('Home board', '/'), 
      ('Design board', '/'), 
      ('Learning board', '/');`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const boards = await sql`SELECT * FROM Boards;`;
  return NextResponse.json({ boards }, { status: 200 });
}
