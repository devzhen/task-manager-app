import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const prisma = new PrismaClient();

  try {
    const boards = await prisma.board.findMany({
      orderBy: [
        {
          orderId: 'asc',
        },
      ],
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

    return NextResponse.json(boards);
  } catch (error) {
    return NextResponse.json({ error, status: 500 });
  } finally {
    await prisma.$disconnect;
  }
};
