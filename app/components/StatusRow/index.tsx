import { STATUSES } from '@/app/constants';
import type { CardType, StateType } from '@/app/types';

import Card from '../Card';

import styles from './StatusRow.module.css';

type StatusRowProps = {
  name: string;
  color: string;
  cards: CardType[];
  status: keyof typeof STATUSES;
  onDragStart: (e: DragEvent) => void;
  onDragEnd: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  currentHoveredState: StateType['hoveredCard'];
};

export default function StatusRow(props: StatusRowProps) {
  const { name, color, cards, onDragStart, onDragOver, onDrop, currentHoveredState, onDragEnd } =
    props;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ backgroundColor: color }} />
        <span>{name} (0)</span>
      </div>
      <div
        className={styles.cardWrappers}
        data-role="drop-container"
        onDragOver={onDragOver as VoidFunction}
        onDrop={onDrop as VoidFunction}
      >
        {cards.map((card, index) => {
          return (
            <Card
              key={card.order}
              name={card.name}
              id={card.id}
              status={card.status}
              index={index}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              hovered={card.id === currentHoveredState.id}
              hoveredPosition={currentHoveredState.position}
            />
          );
        })}
      </div>
    </div>
  );
}
