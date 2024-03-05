import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await sql`CREATE TABLE Boards ( 
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name varchar(255), 
        href varchar(255)
      );`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
