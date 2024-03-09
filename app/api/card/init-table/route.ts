import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

import { STATUSES } from '@/app/constants';
import type { BoardType } from '@/app/types';

export async function GET(req: Request) {
  const basicAuth = req.headers.get('Authorization');

  if (basicAuth !== process.env.API_AUTH_TOKEN) {
    return NextResponse.json({ error: 'Auth Required' }, { status: 401 });
  }

  try {
    await sql`TRUNCATE Cards;`;
    const boardsRes = await sql<BoardType>`SELECT * FROM Boards;`;
    boardsRes.rows.map(async (board) => {
      if (board.name === 'Home board') {
        await sql`
          INSERT INTO Cards
            (title, boardId, position, status)
          VALUES
            ('Investigate Framer-Motion for animations.', ${board.id}, 1, ${STATUSES.backlog}),
            ('Implement CRUD operations', ${board.id}, 2, ${STATUSES.backlog}),
            ('Implement the ability for users to edit tasks', ${board.id}, 1, ${STATUSES.inProgress}),
            ('Implement the ability for users to view a specific subset of tasks', ${board.id}, 2, ${STATUSES.inProgress}),
            ('Use the useEffect hook to update the number of pending tasks', ${board.id}, 3, ${STATUSES.inProgress}),
            ('Implement the ability for users to delete tasks using the mouse or keyboard', ${board.id}, 1, ${STATUSES.inReview}),
            ('Implement the ability for users to add tasks using the mouse or keyboard', ${board.id}, 2, ${STATUSES.inReview}),
            ('Create a basic App component structure and styling', ${board.id}, 1, ${STATUSES.completed}),
            ('Implement a layout according to the design', ${board.id}, 2, ${STATUSES.completed});
        `;
      }
    });
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }

  const cards = await sql`SELECT * FROM Cards;`;
  return NextResponse.json({ cards }, { status: 200 });
}
