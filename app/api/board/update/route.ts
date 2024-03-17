import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request) => {
  const prisma = new PrismaClient();

  try {
    const { name, id } = await new Response(req.body).json();

    if (!name || !id) {
      return NextResponse.json(
        { error: `The required body params 'name' and 'id' were not provided` },
        { status: 422 },
      );
    }

    const currentBoard = await prisma.board.findUnique({
      where: {
        id,
      },
    });
    if (!currentBoard) {
      return NextResponse.json(
        { error: `The board with the id - '${id}' was not found` },
        { status: 422 },
      );
    }

    const board = await prisma.board.update({
      data: {
        name,
      },
      where: {
        id,
      },
    });

    return NextResponse.json(board);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
