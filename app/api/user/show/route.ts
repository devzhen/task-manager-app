import { PrismaClient } from '@prisma/client';
import { validate } from 'uuid';

import constructResponseError from '@/app/utils/constructResponseError';
import getUserFromCookieToken from '@/app/utils/getUserFromCookieToken';

export async function GET() {
  const prisma = new PrismaClient();

  try {
    const user = getUserFromCookieToken();

    if (!user || !user.id || !validate(user.id)) {
      return Response.json({ user: null });
    }

    const userEntity = await prisma.user.findUnique({ where: { id: user.id } });

    return Response.json(userEntity);
  } catch (error) {
    return constructResponseError(error);
  } finally {
    await prisma.$disconnect();
  }
}
