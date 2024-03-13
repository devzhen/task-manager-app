import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  const prisma = new PrismaClient({ log: ['query', 'info', 'error', 'warn'] });

  try {
    const { name } = await new Response(req.body).json();

    if (!name) {
      return NextResponse.json(
        { error: `The required body param 'name' was not provided` },
        { status: 422 },
      );
    }

    const board = await prisma.boards.create({
      data: {
        name,
      },
    });

    return NextResponse.json(board);
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
};
