import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const basicAuth = req.headers.get('Authorization');

  if (basicAuth !== process.env.API_AUTH_TOKEN) {
    return NextResponse.json({ error: 'Auth Required' }, { status: 401 });
  }

  try {
    await sql`DROP TABLE IF EXISTS Cards;`;
    const result = await sql`
      CREATE TABLE Cards ( 
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        title varchar(255) NOT NULL, 
        description text,
        created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        boardId uuid NOT NULL,
        position INT NOT NULL,
        status varchar(255) NOT NULL, 
        CONSTRAINT fk_boardId
          FOREIGN KEY(boardId) 
            REFERENCES Boards(id),
        CONSTRAINT fk_statusName
            FOREIGN KEY(status) 
              REFERENCES Statuses(name)
      );`;

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }
}
