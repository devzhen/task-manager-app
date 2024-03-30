import { PrismaClient } from '@prisma/client';
import type { HttpError } from 'http-errors';
import createError from 'http-errors';
import { NextResponse } from 'next/server';

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
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ board: { orderId: 'asc' } }],
    });

    return NextResponse.json(userBoards.map((item) => item.board));
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as HttpError).message,
        status: (error as HttpError).statusCode || 500,
      },
      { status: (error as HttpError).statusCode || 500 },
    );
  } finally {
    await prisma.$disconnect;
  }
};
