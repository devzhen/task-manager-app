import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { T as ramdaTrue, assoc, cond, equals } from 'ramda';

type CardInputType = {
  id: string;
  boardId: string;
  title: string;
  description: string;
  statusId: string;
};

export const PUT = async (req: NextRequest) => {
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
    let data = {} as CardInputType;
    const tags: string[] = [];
    const deletedTags: string[] = [];
    const attachments: File[] = [];
    const attachmentsPosition: string[] = [];
    const deletedAttachments: string[] = [];

    for (const [key, value] of body.entries()) {
      cond([
        [equals('attachments[]'), () => attachments.push(value as File)],
        [equals('deletedAttachments[]'), () => deletedAttachments.push(value as string)],
        [equals('attachmentsPosition[]'), () => attachmentsPosition.push(value as string)],
        [equals('tags[]'), () => tags.push(value as string)],
        [equals('deletedTags[]'), () => deletedTags.push(value as string)],
        [
          ramdaTrue,
          (keyVal: string) => {
            data = assoc(keyVal, value, data);
          },
        ],
      ])(key);
    }

    const currentCard = prisma.card.findUnique({
      where: {
        id: data.id,
      },
    });
    if (!currentCard) {
      return NextResponse.json({ error: `The card is not existed` }, { status: 422 });
    }

    // Transaction
    const updatedCard = await prisma.$transaction(async (tx) => {
      // Create card
      const card = await tx.card.update({
        data: {
          title: data.title,
          description: data.description,
          statusId: data.statusId,
        },
        where: {
          id: data.id,
        },
      });

      // Delete tagLinkers
      for (const tag of deletedTags) {
        await tx.tagLinker.deleteMany({
          where: {
            tagId: tag,
            cardId: card.id,
            boardId: data.boardId,
          },
        });
      }

      // Create tags
      const tagData = [];
      for (const tag of tags) {
        tagData.push({ cardId: card.id, boardId: data.boardId, tagId: tag });
      }
      await tx.tagLinker.createMany({
        data: tagData,
      });

      // Delete attachments
      for (const id of deletedAttachments) {
        await tx.attachment.deleteMany({
          where: {
            id,
          },
        });
      }

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

    return NextResponse.json(updatedCard);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
