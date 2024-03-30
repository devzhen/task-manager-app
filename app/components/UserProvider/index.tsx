'use client';

import type { ReactNode } from 'react';
import { createContext, useState } from 'react';

import type { UserType } from '@/app/types';

type ContextType = UserType | null;

export const UserContext = createContext<ContextType>(null);

type UserProviderProps = {
  children: ReactNode;
  user: UserType | null;
};

export default function UserProvider(props: UserProviderProps) {
  const { children, user } = props;

  const [currentUser] = useState(user);

  return <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>;
}
