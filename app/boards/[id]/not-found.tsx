import styles from './page.module.css';

export default function NotFound() {
  return (
    <div className="cards-wrapper">
      <div className={styles.messageContainer}>
        <h3 className={styles.notFoundMessage}>
          There are no cards for this board or the board is not existed
        </h3>
      </div>
    </div>
  );
}
