import type { PrismaClient, User } from '@prisma/client';
import { omit } from 'ramda';

export default function Users(prismaUser: PrismaClient['user']) {
  return Object.assign(prismaUser, {
    /**
     * Find many, exclude password
     */
    async findManyWithoutPassword({
      exceptId,
    }: {
      exceptId: string;
    }): Promise<Omit<User, 'password'>[]> {
      const users = await prismaUser.findMany({
        where: {
          NOT: {
            id: exceptId,
          },
        },
      });

      return users.map((user) => omit(['password'], user));
    },

    /**
     * Find one, exclude password
     */
    async findOneWithoutPassword(userId: string): Promise<Omit<User, 'password'> | null> {
      const userEntity = await prismaUser.findUnique({
        where: { id: userId },
      });

      if (!userEntity) {
        return null;
      }

      return omit<User, 'password'>(['password'], userEntity);
    },
  });
}
