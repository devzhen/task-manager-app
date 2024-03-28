import { PrismaClient } from '@prisma/client';
import type { HttpError } from 'http-errors';
import createError from 'http-errors';
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

    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({
      error: (error as HttpError).message,
      statusCode: (error as HttpError).statusCode || 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
