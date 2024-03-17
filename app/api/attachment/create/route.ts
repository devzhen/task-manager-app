import { PrismaClient } from '@prisma/client';
import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let fileUrl = '';

  const prisma = new PrismaClient();

  try {
    const formData = await request.formData();
    const cardId = formData.get('cardId') as string;
    const file = formData.get('file') as File;

    if (!cardId) {
      return NextResponse.json(
        { error: `The required body param 'cardId' was not provided` },
        {
          status: 422,
        },
      );
    }

    const currentBoard = await prisma.card.findUnique({
      where: {
        id: cardId,
      },
    });
    if (!currentBoard) {
      return NextResponse.json(
        { error: `The card with the id - '${cardId}' was not found` },
        { status: 422 },
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: `The required body param 'file' was not provided` },
        {
          status: 422,
        },
      );
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

    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
