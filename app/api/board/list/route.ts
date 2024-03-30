import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';
import { NextResponse } from 'next/server';

import { USER_ROLE } from '@/app/constants';
import constructResponseError from '@/app/utils/constructResponseError';
import getUserFromCookieToken from '@/app/utils/getUserFromCookieToken';

export const GET = async () => {
  const prisma = new PrismaClient();

  try {
    const user = getUserFromCookieToken();

    if (!user) {
      throw createError(401, `Authentication Failed`);
    }

    if (user.role === USER_ROLE.admin) {
      const boards = await prisma.board.findMany({
        include: {
          _count: {
            select: {
              cards: true,
              tags: true,
              statuses: true,
            },
          },
        },
      });

      return NextResponse.json(boards);
    }

    const userBoards = await prisma.userBoard.findMany({
      where: {
        userId: user.id,
      },
      select: {
        board: {
          include: {
            _count: {
              select: {
                cards: true,
                tags: true,
                statuses: true,
              },
            },
          },
        },
      },
      orderBy: [{ board: { orderId: 'asc' } }],
    });

    return NextResponse.json(userBoards.map((item) => item.board));
  } catch (error) {
    return constructResponseError(error);
  } finally {
    await prisma.$disconnect;
  }
};
