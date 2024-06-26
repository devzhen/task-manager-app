import { PrismaClient } from '@prisma/client';
import { validate } from 'uuid';

import constructResponseError from '@/app/utils/constructResponseError';
import getUserFromCookieToken from '@/app/utils/getUserFromCookieToken';
import Users from '@/prisma/users';

export async function GET() {
  const prisma = new PrismaClient();
  const users = Users(prisma.user);

  try {
    const user = getUserFromCookieToken();

    if (!user || !user.id || !validate(user.id)) {
      return Response.json(null);
    }

    const userEntity = users.findOneWithoutPassword(user.id);

    return Response.json(userEntity);
  } catch (error) {
    return constructResponseError(error);
  } finally {
    await prisma.$disconnect();
  }
}
