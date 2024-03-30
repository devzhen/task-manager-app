import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { AddBoardFormInputs } from '@/app/components/AddBoardForm/types';
import constructResponseError from '@/app/utils/constructResponseError';
import createUpdateMultipleStatusesQuery from '@/app/utils/db/createUpdateMultipleStatusesQuery';
import createUpdateMultipleTagsQuery from '@/app/utils/db/createUpdateMultipleTagsQuery';
import reduceByIsNewProperty from '@/app/utils/db/reduceByIsNewProperty';
import getUserFromCookieToken from '@/app/utils/getUserFromCookieToken';

export const PUT = async (req: NextRequest) => {
  const prisma = new PrismaClient(/* { log: ['query', 'error', 'warn', 'info'] } */);

  try {
    const user = getUserFromCookieToken();

    if (!user) {
      throw createError(401, `Authentication Failed`);
    }

    const body = (await req.json()) as AddBoardFormInputs;

    const { deletedStatuses, deletedTags, boardId, name } = body;

    if (!boardId) {
      throw createError(422, `The required body param 'boardId' was not provided`);
    }

    const statusNames = body.statuses.map((item) => item.name);
    const duplicates = statusNames.filter((item, index) => statusNames.indexOf(item) !== index);
    if (duplicates.length > 0) {
      throw createError(422, `The statuses are not unique`);
    }

    const statusObj = reduceByIsNewProperty(body.statuses, 'isNew');
    const tagObj = reduceByIsNewProperty(body.tags, 'isNew');

    const updatedData = await prisma.$transaction(async (tx) => {
      // Find user board
      const userBoard = await tx.userBoard.findFirst({
        where: {
          boardId: boardId,
          userId: user.id,
        },
      });
      if (!userBoard) {
        throw createError(403, `The board for this user was not found`);
      }

      // Delete statuses
      await tx.status.deleteMany({
        where: {
          OR: deletedStatuses,
        },
      });

      // Delete tags
      for (const tag of deletedTags) {
        await tx.tagLinker.deleteMany({
          where: {
            boardId,
            tagId: tag.id,
          },
        });

        await tx.tag.delete({
          where: {
            id: tag.id,
          },
        });
      }

      // Update statuses
      const updateStatusesQuery = createUpdateMultipleStatusesQuery(boardId, statusObj.old);
      if (updateStatusesQuery) {
        await tx.$queryRawUnsafe(updateStatusesQuery);
      }

      // Create statuses
      const statusData = statusObj.new.map((item) => ({
        name: item.name,
        color: item.color as string,
        position: item.position,
        boardId,
      }));
      await tx.status.createMany({ data: statusData });

      // Update tags
      const updateTagsQuery = createUpdateMultipleTagsQuery(boardId, tagObj.old);
      if (updateTagsQuery) {
        await tx.$queryRawUnsafe(updateTagsQuery);
      }

      // Create tags
      const tagData = tagObj.new.map((item) => ({
        name: item.name,
        color: item.color as string,
        fontColor: item.fontColor as string,
        boardId,
      }));
      await tx.tag.createMany({ data: tagData });

      // Update the board
      const board = await tx.board.update({
        data: {
          name,
        },
        where: {
          id: boardId,
        },
        include: {
          tags: true,
          statuses: true,
        },
      });

      return board;
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    return constructResponseError(error);
  } finally {
    await prisma.$disconnect();
  }
};
