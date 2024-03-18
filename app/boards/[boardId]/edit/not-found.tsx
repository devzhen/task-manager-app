import styles from './page.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2>Edit board</h2>
        <div className={styles.messageContainer}>
          <h3 className={styles.notFoundMessage}>This board is not existed</h3>
        </div>
      </div>
    </div>
  );
}
