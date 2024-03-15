import styles from './page.module.css';

export default function NotFound() {
  return (
    <div className="cards-wrapper">
      <div className={styles.messageContainer}>
        <h3 className={styles.notFoundMessage}>This board is not existed</h3>
      </div>
    </div>
  );
}
