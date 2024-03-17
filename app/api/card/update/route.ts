import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { UpdateCardBodyType } from '@/app/types';

/**
 * PUT body example
 *  {
      "id": "d13cdb99-0ce7-49e3-9aeb-1bd999d0c311",
      "fields": ["position"],
      "values": [10]
    }
 */
export const PUT = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  try {
    const body = (await req.json()) as UpdateCardBodyType;

    if (!body.id) {
      return NextResponse.json(
        { error: `The required query param 'id' was not provided` },
        { status: 422 },
      );
    }

    if (!body.fields) {
      return NextResponse.json(
        { error: `The required query param 'fields' was not provided` },
        { status: 422 },
      );
    }

    if (!body.values) {
      return NextResponse.json(
        { error: `The required query param 'body' was not provided` },
        { status: 422 },
      );
    }

    const data: Record<string, string | number> = {};
    body.fields.forEach(async (field, index) => {
      const value = body.values[index];

      data[field] = value;
    });

    const updatedCard = await prisma.card.update({
      where: {
        id: body.id,
      },
      data,
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
