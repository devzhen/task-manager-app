import { PrismaClient } from '@prisma/client';
import type { HttpError } from 'http-errors';
import createError from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const cardId = searchParams.get('card');

  const prisma = new PrismaClient();

  try {
    if (!cardId) {
      throw createError(422, `The required query param 'card' was not provided`);
    }

    // Get a card
    const card = await prisma.card.findUnique({
      where: {
        id: cardId,
      },
      include: {
        attachments: true,
        tags: {
          include: {
            tag: true,
          },
        },
        status: true,
      },
    });

    if (!card) {
      throw createError(422, `The card with the id - '${card}' was not found`);
    }

    return NextResponse.json(card);
  } catch (error) {
    return NextResponse.json({
      error: (error as HttpError).message,
      status: (error as HttpError).statusCode || 500,
    });
  } finally {
    await prisma.$disconnect();
  }
};
