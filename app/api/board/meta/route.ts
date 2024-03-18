import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { assoc, compose, omit, path } from 'ramda';

export const GET = async (request: NextRequest) => {
  const prisma = new PrismaClient();

  const boardId = request.nextUrl.searchParams.get('boardId');

  try {
    if (!boardId) {
      return NextResponse.json(
        { error: `The required query param 'boardId' was not provided` },
        { status: 422 },
      );
    }

    const meta = await prisma.$transaction(async (tx) => {
      const boardMeta = await tx.board.findUnique({
        where: {
          id: boardId,
        },
        include: {
          _count: {
            select: {
              cards: true,
              tags: true,
              statuses: true,
            },
          },
        },
      });

      let finalObj = { ...boardMeta };
      const count = path(['_count'], boardMeta);

      finalObj = compose(assoc('count', count), omit(['_count']))(finalObj);

      const statusMeta = await prisma.status.findMany({
        where: {
          boardId,
        },
        include: {
          _count: {
            select: { cards: true },
          },
        },
      });

      let statuses = {};
      for (const status of statusMeta) {
        const countCards = path(['_count', 'cards'], status);
        statuses = assoc(status.name, countCards, statuses);
      }

      finalObj = assoc('statuses', statuses, finalObj);

      return finalObj;
    });

    return NextResponse.json(meta);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  } finally {
    await prisma.$disconnect;
  }
};
