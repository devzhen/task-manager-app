'use client'; // TODO: remove

import styles from './Header.module.css';

export default function Header({ logout }: { logout: () => void }) {
  return (
    <header className={styles.header}>
      <span>Tasks</span>&nbsp;&nbsp;<span>Manager App</span>
      <button onClick={() => logout()} style={{ color: '#fff', marginLeft: 30 }}>
        Log out
      </button>
    </header>
  );
}
