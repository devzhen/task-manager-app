import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { HttpError } from 'http-errors';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { LoginInputs } from '@/app/types';

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();

  try {
    const body = (await req.json()) as LoginInputs;

    if (!body.email) {
      throw createError(422, `The required body param 'email' was not provided`);
    }

    if (!body.password) {
      throw createError(422, `The required body param 'password' was not provided`);
    }

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      throw createError(404, `The user with the email - '${body.email}' was not found`);
    }

    const passwordMatches = await bcrypt.compare(body.password, user.password);
    if (!passwordMatches) {
      throw createError(403, `The password is incorrect`);
    }

    const token = await jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_TOKEN_SECRET as string,
      {
        expiresIn: '1d',
      },
    );

    return NextResponse.json({
      message: 'Logged in successfully',
      success: true,
      token,
    });
  } catch (error) {
    return NextResponse.json({
      error: (error as HttpError).message,
      statusCode: (error as HttpError).statusCode || 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
