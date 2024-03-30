import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';

import { USER_ROLE } from '@/app/constants';
import constructResponseError from '@/app/utils/constructResponseError';
import getUserFromCookieToken from '@/app/utils/getUserFromCookieToken';
import Users from '@/prisma/users';

export async function GET() {
  const prisma = new PrismaClient();
  const users = Users(prisma.user);

  try {
    const user = getUserFromCookieToken();

    if (!user) {
      throw createError(401, `Authentication Failed`);
    }

    if (user.role !== USER_ROLE.admin) {
      throw createError(403, `This user is not permitted to see the list of users`);
    }

    const res = await users.findManyWithoutPassword({ exceptId: user.id });

    return Response.json(res);
  } catch (error) {
    return constructResponseError(error);
  } finally {
    await prisma.$disconnect();
  }
}
