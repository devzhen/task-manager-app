import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { AddBoardFormInputs } from '@/app/components/AddBoardForm/types';

export const POST = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  try {
    const { name, statuses, tags } = (await req.json()) as AddBoardFormInputs;

    if (!name) {
      return NextResponse.json(
        { error: `The required body param 'name' was not provided` },
        { status: 422 },
      );
    }

    if (!statuses || statuses.length === 0) {
      return NextResponse.json(
        { error: `The required body param 'statuses' was not provided` },
        { status: 422 },
      );
    }

    // Transaction
    const createdBoard = await prisma.$transaction(async (tx) => {
      // Create board
      const board = await tx.board.create({ data: { name } });

      // Create tags
      const tagData = [];
      for (const tag of tags) {
        tagData.push({
          boardId: board.id,
          color: tag.color as string,
          fontColor: tag.fontColor as string,
          name: tag.name,
        });
      }
      await tx.tag.createMany({
        data: tagData,
      });

      // Create statuses
      const statusData = [];
      for (const status of statuses) {
        statusData.push({
          boardId: board.id,
          name: status.name,
          color: status.color as string,
          position: status.position,
        });
      }
      await tx.status.createMany({
        data: statusData,
      });

      // Get new board
      const created = await tx.board.findUnique({
        where: {
          id: board.id,
        },
        include: {
          tags: true,
          statuses: true,
        },
      });

      return created;
    });

    return NextResponse.json(createdBoard);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
