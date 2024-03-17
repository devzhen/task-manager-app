import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const cardId = searchParams.get('card');

  const prisma = new PrismaClient();

  try {
    if (!cardId) {
      return NextResponse.json(
        { error: `The required query param 'card' was not provided` },
        { status: 422 },
      );
    }

    // Get a card
    const card = await prisma.card.findUnique({
      where: {
        id: cardId,
      },
      include: {
        attachments: true,
        tags: true,
        status: true,
      },
    });

    if (!card) {
      return NextResponse.json(
        { error: `The card with the id - '${card}' was not found` },
        { status: 422 },
      );
    }

    return NextResponse.json(card);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
