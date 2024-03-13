import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const prisma = new PrismaClient();

  try {
    const boards = await prisma.boards.findMany({
      orderBy: [
        {
          createdAt: 'asc',
        },
      ],
    });

    return NextResponse.json(boards);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  } finally {
    await prisma.$disconnect;
  }
};
