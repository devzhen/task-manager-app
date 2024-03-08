import { useEffect, useRef } from 'react';

import { FAKE_CARD_ID, STATUSES } from '@/app/constants';
import type { CardLayoutType, CardType, StateType } from '@/app/types';

import Card from '../Card';
import FakeCard from '../FakeCard';

import styles from './StatusRow.module.css';

type StatusRowProps = {
  cards: CardType[];
  color: string;
  currentHoveredState: StateType['hoveredCard'];
  name: string;
  onDragEnd: (e: DragEvent) => void;
  onDragOver: (e: DragEvent, container: HTMLDivElement | null, layouts: CardLayoutType[]) => void;
  onDragStart: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  status: keyof typeof STATUSES;
};

export default function StatusRow(props: StatusRowProps) {
  const {
    cards,
    color,
    currentHoveredState,
    name,
    onDragEnd,
    onDragOver,
    onDragStart,
    onDrop,
    status,
  } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);

  const layoutsObj = useRef<Record<string, CardLayoutType>>({});
  const layoutsArr = useRef<CardLayoutType[]>([]);

  const onCardLayout = (layout: CardLayoutType) => {
    layoutsObj.current[layout.id] = layout;
    layoutsArr.current = Object.values(layoutsObj.current).sort((a, b) => a.top - b.top);
  };

  const onDragOverHandler = (e: DragEvent) => {
    onDragOver(e, containerRef.current, layoutsArr.current);
  };

  useEffect(() => {
    layoutsObj.current = {};
    layoutsArr.current = [];
  }, [cards.length]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ backgroundColor: color }} />
        <span>{name} (0)</span>
      </div>
      <div
        ref={containerRef}
        className={styles.cardWrappers}
        data-role="drop-container"
        onDragOver={onDragOverHandler as VoidFunction}
        onDrop={onDrop as VoidFunction}
      >
        {cards.map((card, index) => {
          return (
            <Card
              hovered={card.id === currentHoveredState.id}
              id={card.id}
              index={index}
              key={card.order}
              name={card.name}
              onDragEnd={onDragEnd}
              onDragStart={onDragStart}
              onLayout={onCardLayout}
              status={card.status}
            />
          );
        })}
        <FakeCard
          hovered={`${FAKE_CARD_ID}-${status}` === currentHoveredState.id}
          id={`${FAKE_CARD_ID}-${status}`}
          index={cards.length}
          onLayout={onCardLayout}
          status={status}
        />
      </div>
    </div>
  );
}
