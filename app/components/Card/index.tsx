import { STATUSES } from '@/app/constants';
import type { StateType } from '@/app/types';

import styles from './Card.module.css';

type CardProps = {
  id: string;
  name: string;
  status: keyof typeof STATUSES;
  index: number;
  onDragStart: (e: DragEvent) => void;
  onDragEnd: (e: DragEvent) => void;
  hovered: boolean;
  hoveredPosition: StateType['hoveredCard']['position'];
};

export default function Card(props: CardProps) {
  const { name, id, status, index, onDragStart, hovered, hoveredPosition, onDragEnd } = props;

  let color;
  if (status === 'backlog') {
    color = 'gray';
  }
  if (status === 'inProgress') {
    color = 'orange';
  }
  if (status === 'inReview') {
    color = 'blue';
  }
  if (status === 'completed') {
    color = 'green';
  }

  const onDragStartHandler = (e: DragEvent) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('id', id);
      e.dataTransfer.setData('status', status);
      e.dataTransfer.setData('index', `${index}`);
    }

    onDragStart(e);
  };

  const classes = [styles.container];
  if (hovered && hoveredPosition === 'top') {
    classes.push(styles.containerActiveTop);
  }
  if (hovered && hoveredPosition === 'bottom') {
    classes.push(styles.containerActiveBottom);
  }

  return (
    <div
      className={classes.join(' ')}
      data-id={id}
      data-role="card"
      data-index={index}
      data-status={status}
      draggable
      onDragStart={onDragStartHandler as VoidFunction}
      onDragEnd={onDragEnd as VoidFunction}
    >
      <div className={styles.content} style={{ backgroundColor: color }}>
        <img src={`https://placehold.co/70x70.png?text=${id}`} alt="" />
        {name}
      </div>
    </div>
  );
}
