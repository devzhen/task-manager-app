import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const basicAuth = request.headers.get('Authorization');

    if (basicAuth !== process.env.API_AUTH_TOKEN) {
      return NextResponse.json({ error: 'Auth Required' }, { status: 401 });
    }

    await sql`DROP TABLE IF EXISTS Attachments CASCADE;`;
    const result = await sql`
        CREATE TABLE Attachments ( 
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          name varchar(255) NOT NULL, 
          url varchar(255) NOT NULL, 
          cardId uuid NOT NULL,
          created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_cardId
            FOREIGN KEY(cardId) 
              REFERENCES Cards(id)
        );`;

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }
}
