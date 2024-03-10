import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

import { STATUSES } from '@/app/constants';

export async function GET(req: Request) {
  const basicAuth = req.headers.get('Authorization');

  if (basicAuth !== process.env.API_AUTH_TOKEN) {
    return NextResponse.json({ error: 'Auth Required' }, { status: 401 });
  }

  try {
    await sql`TRUNCATE Statuses CASCADE;`;
    await sql`
      INSERT INTO Statuses 
        (name)
      VALUES
        (${STATUSES.backlog}),
        (${STATUSES.inProgress}),
        (${STATUSES.inReview}),
        (${STATUSES.completed});`;
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }

  const statuses = await sql`SELECT * FROM Statuses;`;
  return NextResponse.json({ statuses }, { status: 200 });
}
