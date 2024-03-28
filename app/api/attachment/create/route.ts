import { PrismaClient } from '@prisma/client';
import { put, del } from '@vercel/blob';
import type { HttpError } from 'http-errors';
import createError from 'http-errors';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let fileUrl = '';

  const prisma = new PrismaClient();

  try {
    const formData = await request.formData();
    const cardId = formData.get('cardId') as string;
    const file = formData.get('file') as File;

    if (!cardId) {
      throw createError(422, `The required body param 'cardId' was not provided`);
    }

    const currentCard = await prisma.card.findUnique({
      where: {
        id: cardId,
      },
    });
    if (!currentCard) {
      throw createError(422, `The card with the id - '${cardId}' was not found`);
    }

    if (!file) {
      throw createError(422, `The required body param 'file' was not provided`);
    }

    const blob = await put(file.name, file, {
      access: 'public',
    });
    fileUrl = blob.url;

    const attachment = await prisma.attachment.create({
      data: {
        name: file.name,
        url: blob.url,
        cardId: cardId,
        position: 0,
      },
    });

    return NextResponse.json({ blob, attachment });
  } catch (error) {
    if (fileUrl) {
      del(fileUrl);
    }

    return NextResponse.json({
      error: (error as HttpError).message,
      status: (error as HttpError).statusCode || 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
