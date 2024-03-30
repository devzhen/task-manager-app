import { pathOr } from 'ramda';

import logOut from '@/app/api/auth/logout';
import fetchUser from '@/app/api/user/fetchUser';
import fetchUsers from '@/app/api/user/fetchUsers';
import type { UserType } from '@/app/types';

import User from '../User';

import styles from './Header.module.css';

export default async function Header() {
  const [userRes, usersRes] = await Promise.allSettled<[UserType, UserType[]]>([
    fetchUser(),
    fetchUsers(),
  ]);

  const user = pathOr<UserType | null>(null, ['value'], userRes);
  const users = pathOr<UserType[]>([], ['value'], usersRes);

  return (
    <header className={styles.header}>
      <div />
      <span>
        <span>Tasks</span>&nbsp;<span className={styles.background}>Manager App</span>
      </span>
      <User logout={logOut} user={user} users={users} />
    </header>
  );
}
