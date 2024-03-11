import styles from './page.module.css';

export default async function Loading() {
  return (
    <div className="cards-wrapper">
      <div className={styles.messageContainer}>
        <div className={styles.loader} />
      </div>
    </div>
  );
}
