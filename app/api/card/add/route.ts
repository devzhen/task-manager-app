import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { T, assoc, cond, equals } from 'ramda';

type CardInputType = {
  title: string;
  description: string;
  boardId: string;
  statusId: string;
  position: number;
};

export const POST = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  try {
    const body = await req.formData();

    const requiredFields = ['boardId', 'statusId', 'title'];
    for (const field of requiredFields) {
      if (!body.get(field)) {
        return NextResponse.json(
          { error: `The required body param '${field}' was not provided` },
          { status: 422 },
        );
      }
    }

    // Construct data
    let data = { position: 0 } as CardInputType;
    const tags: string[] = [];
    const attachments: File[] = [];
    const attachmentsPosition: string[] = [];
    for (const [key, value] of body.entries()) {
      cond([
        [equals('attachments[]'), () => attachments.push(value as File)],
        [equals('attachmentsPosition[]'), () => attachmentsPosition.push(value as string)],
        [equals('tags[]'), () => tags.push(value as string)],
        [
          T,
          (keyVal: string) => {
            data = assoc(keyVal, value, data);
          },
        ],
      ])(key);
    }

    // Transaction
    const createdCard = await prisma.$transaction(async (tx) => {
      // Update cards position
      await tx.card.updateMany({
        data: {
          position: {
            increment: 1,
          },
        },
        where: {
          statusId: data.statusId,
        },
      });

      // Create card
      const card = await tx.card.create({
        data,
      });

      // Create tags
      const tagData = [];
      for (const tag of tags) {
        tagData.push({ cardId: card.id, boardId: data.boardId, tagId: tag });
      }
      await tx.tagLinker.createMany({
        data: tagData,
      });

      // TODO: add upload to vercel-blob
      // Create attachments
      const attachmentData = [];
      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        const position = attachmentsPosition[i];

        attachmentData.push({
          cardId: card.id,
          name: attachment.name,
          url: 'https://placehold.co/600x600.png?text=Hello\nWorld',
          position: parseInt(position),
        });
      }
      await tx.attachment.createMany({
        data: attachmentData,
      });

      // Get new card
      const created = await tx.card.findUnique({
        where: {
          id: card.id,
        },
        include: {
          attachments: true,
          tags: true,
          status: true,
        },
      });

      return created;
    });

    return NextResponse.json(createdCard);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
