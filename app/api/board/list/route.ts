import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';
import { NextResponse } from 'next/server';

import constructResponseError from '@/app/utils/constructResponseError';
import getUserFromCookieToken from '@/app/utils/getUserFromCookieToken';

export const GET = async () => {
  const prisma = new PrismaClient();

  try {
    const user = getUserFromCookieToken();

    if (!user) {
      throw createError(401, `Authentication Failed`);
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
