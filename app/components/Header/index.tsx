import logOut from '@/app/api/auth/logout';
import getUser from '@/app/api/user/getUser';

import User from '../User';

import styles from './Header.module.css';

export default async function Header() {
  const user = await getUser();

  return (
    <header className={styles.header}>
      <div />
      <span>
        <span>Tasks</span>&nbsp;<span className={styles.background}>Manager App</span>
      </span>
      <User logout={logOut} user={user} />
    </header>
  );
}
