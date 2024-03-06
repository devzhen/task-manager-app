import styles from './StatusRow.module.css';

type StatusRowProps = {
  name: string;
  color: string;
};

export default function StatusRow(props: StatusRowProps) {
  const { name, color } = props;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ backgroundColor: color }} />
        <span>{name} (0)</span>
      </div>
      <div className={styles.cardWrappers}>
        <div className={styles.card}>{`${name} - 1`}</div>
        <div className={styles.card}>{`${name} - 2`}</div>
        <div className={styles.card}>{`${name} - 3`}</div>
        <div className={styles.card}>{`${name} - 4`}</div>
        <div className={styles.card}>{`${name} - 5`}</div>
      </div>
    </div>
  );
}
