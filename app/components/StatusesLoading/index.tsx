import styles from './StatusesLoading.module.css';

export default function StatusesLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.loader} />
    </div>
  );
}
