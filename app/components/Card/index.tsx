import { useDrag } from 'react-dnd';

import { STATUSES } from '@/app/constants';

import styles from './Card.module.css';

type CardProps = {
  id: string;
  name: string;
  status: keyof typeof STATUSES;
  index: number;
};

export default function Card(props: CardProps) {
  const { name, id, status, index } = props;

  const [, drag] = useDrag(() => ({
    type: 'card',
    item: { name, id, status, index },
  }));

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

  return (
    <div
      ref={drag}
      className={styles.container}
      data-id={id}
      data-role="card"
      data-index={index}
      style={{ backgroundColor: color }}
    >
      {name}
    </div>
  );
}
