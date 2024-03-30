import { PrismaClient } from '@prisma/client';
import type { HttpError } from 'http-errors';
import createError from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { AddBoardFormInputs } from '@/app/components/AddBoardForm/types';
import { USER_ROLE } from '@/app/constants';
import getUserFromCookieToken from '@/app/utils/getUserFromCookieToken';

export const POST = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  try {
    const user = getUserFromCookieToken();

    if (!user) {
      throw createError(401, `Authentication Failed`);
    }

    if (user.role !== USER_ROLE.admin) {
      throw createError(403, `This user is not permitted to add boards`);
    }

    const { name, statuses, tags } = (await req.json()) as AddBoardFormInputs;

    if (!name) {
      throw createError(422, `The required body param 'name' was not provided`);
    }

    if (!statuses || statuses.length === 0) {
      throw createError(422, `The required body param 'statuses' was not provided`);
    }

    // Transaction
    const createdBoard = await prisma.$transaction(async (tx) => {
      const [board, admins] = await Promise.all([
        tx.board.create({ data: { name } }),
        await tx.user.findMany({ where: { role: USER_ROLE.admin } }),
      ]);

      // Create user board entity
      for (const admin of admins) {
        await tx.userBoard.create({
          data: {
            userId: admin.id,
            boardId: board.id,
          },
        });
      }

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
    return NextResponse.json({
      error: (error as HttpError).message,
      status: (error as HttpError).statusCode || 500,
    });
  } finally {
    await prisma.$disconnect();
  }
};
