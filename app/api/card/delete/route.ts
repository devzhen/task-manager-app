import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const DELETE = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  try {
    const body = await req.json();

    if (!body.cardId) {
      return NextResponse.json(
        { error: `The required body param 'cardId' was not provided` },
        { status: 422 },
      );
    }

    const card = await prisma.card.findUnique({
      where: {
        id: body.cardId,
      },
    });

    if (!card) {
      return NextResponse.json(
        { error: `The card with the id - '${body.cardId}' was not found` },
        { status: 422 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await Promise.all([
        tx.attachment.deleteMany({
          where: {
            cardId: body.cardId,
          },
        }),
        tx.tagLinker.deleteMany({
          where: {
            cardId: body.cardId,
          },
        }),
      ]);

      await tx.card.delete({
        where: {
          id: body.cardId,
        },
      });
    });

    return NextResponse.json(card);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
