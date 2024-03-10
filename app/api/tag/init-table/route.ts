import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

import { TAGS } from '@/app/constants';
import type { CardType } from '@/app/types';

export async function GET(req: Request) {
  const basicAuth = req.headers.get('Authorization');

  if (basicAuth !== process.env.API_AUTH_TOKEN) {
    return NextResponse.json({ error: 'Auth Required' }, { status: 401 });
  }

  try {
    const cardsRes = await sql<CardType>`SELECT * FROM Cards;`;
    await sql`TRUNCATE Tags CASCADE;`;
    cardsRes.rows.forEach(async (card) => {
      const number = Math.floor(Math.random() * (4 - 1) + 1);
      if (number === 1) {
        await sql`
          INSERT INTO Tags 
            (cardId, name, color, fontColor)
          VALUES
            (${card.id}, ${TAGS.concept.name}, ${TAGS.concept.color}, ${TAGS.concept.fontColor});
        `;
      }
      if (number === 2) {
        await sql`
          INSERT INTO Tags 
            (cardId, name, color, fontColor)
          VALUES
            (${card.id}, ${TAGS.frontEnd.name}, ${TAGS.frontEnd.color}, ${TAGS.frontEnd.fontColor}),
            (${card.id}, ${TAGS.technical.name}, ${TAGS.technical.color}, ${TAGS.technical.fontColor});
        `;
      }
      if (number === 3) {
        await sql`
          INSERT INTO Tags 
            (cardId, name, color, fontColor)
          VALUES
            (${card.id}, ${TAGS.design.name}, ${TAGS.design.color}, ${TAGS.design.fontColor}),
            (${card.id}, ${TAGS.frontEnd.name}, ${TAGS.frontEnd.color}, ${TAGS.frontEnd.fontColor}),
            (${card.id}, ${TAGS.technical.name}, ${TAGS.technical.color}, ${TAGS.technical.fontColor});
        `;
      }
      if (number === 4) {
        await sql`
          INSERT INTO Tags 
            (cardId, name, color, fontColor)
          VALUES
            (${card.id}, ${TAGS.concept.name}, ${TAGS.concept.color}, ${TAGS.concept.fontColor}),
            (${card.id}, ${TAGS.design.name}, ${TAGS.design.color}, ${TAGS.design.fontColor}),
            (${card.id}, ${TAGS.frontEnd.name}, ${TAGS.frontEnd.color}, ${TAGS.frontEnd.fontColor}),
            (${card.id}, ${TAGS.technical.name}, ${TAGS.technical.color}, ${TAGS.technical.fontColor});
        `;
      }
    });
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  }

  const statuses = await sql`SELECT * FROM Tags;`;
  return NextResponse.json({ statuses }, { status: 200 });
}
