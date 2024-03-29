import { PrismaClient } from '@prisma/client';
import type { HttpError } from 'http-errors';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isNil, pathOr } from 'ramda';
import { validate } from 'uuid';

import type { UserType } from '@/app/types';

export async function GET(req: NextRequest) {
  const prisma = new PrismaClient();

  try {
    const response: { user: UserType | null } = { user: null };
    let userId = null;

    const token = req.cookies.get('token')?.value;
    if (isNil(token)) {
      return Response.json(response);
    }

    jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err, decoded) => {
      if (err) {
        return Response.json(response);
      }

      userId = pathOr(null, ['id'], decoded);
    });

    if (!userId || !validate(userId)) {
      return Response.json(response);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    response.user = user;

    return Response.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as HttpError).message,
        statusCode: (error as HttpError).statusCode || 500,
      },
      { status: (error as HttpError).statusCode || 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
