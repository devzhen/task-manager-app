import styles from './page.module.css';

export default async function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2>Edit board</h2>
        <div className={styles.messageContainer}>
          <div className={styles.loader} />
        </div>
      </div>
    </div>
  );
}
