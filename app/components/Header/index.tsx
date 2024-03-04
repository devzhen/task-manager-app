import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <span>Tasks</span>&nbsp;&nbsp;<span>Manager App</span>
    </header>
  );
}
