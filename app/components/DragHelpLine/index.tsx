import styles from './DragHelpLine.module.css';

type DragHelpLineProps = {
  hoveredCardId: string;
  currentHoveredCardId: undefined | string;
  order: number;
};

export default function DragHelpLine(props: DragHelpLineProps) {
  const { hoveredCardId, currentHoveredCardId, order } = props;

  const containerStyles = [styles.container];
  const lineStyles = [styles.line];
  if (currentHoveredCardId && hoveredCardId === currentHoveredCardId) {
    containerStyles.push(styles.containerActive);
    lineStyles.push(styles.lineActive);
  }

  return (
    <div
      className={containerStyles.join(' ')}
      data-role="line"
      data-line-for={hoveredCardId}
      data-order={order}
    >
      <div className={lineStyles.join(' ')} />
    </div>
  );
}
