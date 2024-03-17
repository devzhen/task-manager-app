import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const boardId = request.nextUrl.searchParams.get('boardId');

  const prisma = new PrismaClient();

  try {
    if (!boardId) {
      return NextResponse.json(
        { error: `The required query param 'boardId' was not provided` },
        { status: 422 },
      );
    }

    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        statuses: {
          orderBy: {
            position: 'asc',
          },
        },
        tags: true,
      },
    });

    return NextResponse.json(board);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
