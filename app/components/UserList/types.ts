import type { UserType } from '@/app/types';

export type UserInputs = {
  users: (UserType & { isNew?: boolean; isUpdated?: boolean; isDeleted?: boolean })[];
};
