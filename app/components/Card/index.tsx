import { useEffect, useRef } from 'react';

import { STATUSES } from '@/app/constants';
import type { CardLayoutType } from '@/app/types';
import getCoords from '@/app/utils/getCoords';

import styles from './Card.module.css';

type CardProps = {
  hovered: boolean;
  id: string;
  index: number;
  name: string;
  onDragEnd: (e: DragEvent) => void;
  onDragStart: (e: DragEvent) => void;
  onLayout: (layout: CardLayoutType) => void;
  status: keyof typeof STATUSES;
};

export default function Card(props: CardProps) {
  const { name, id, status, index, onDragStart, hovered, onDragEnd, onLayout } = props;

  const ref = useRef<HTMLDivElement | null>(null);

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
  if (hovered) {
    classes.push(styles.containerActive);
  }

  useEffect(() => {
    if (ref.current) {
      const coords = getCoords(ref.current);

      const layout = {
        id,
        top: coords.top,
        middle: coords.middle,
        bottom: coords.bottom,
        index,
        status,
      };

      onLayout(layout);
    }
  }, [index, id, status, onLayout]);

  return (
    <div
      ref={ref}
      className={classes.join(' ')}
      data-id={id}
      data-role="card"
      data-index={index}
      data-status={status}
      draggable
      onDragStart={onDragStartHandler as VoidFunction}
      onDragEnd={onDragEnd as VoidFunction}
      style={{ backgroundColor: color }}
    >
      <img src={`https://placehold.co/70x70.png?text=${id}`} alt="" />
      {name}
    </div>
  );
}
