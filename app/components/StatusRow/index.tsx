import { useEffect, useRef } from 'react';

import { FAKE_CARD_ID } from '@/app/constants';
import type { CardLayoutType, CardType, StateType, StatusType } from '@/app/types';

import Card from '../Card';
import FakeCard from '../FakeCard';

import styles from './StatusRow.module.css';

type StatusRowProps = {
  boardId: string;
  cards: CardType[];
  currentHoveredState: StateType['hoveredCard'];
  onCardClick: (id: string) => void;
  onDragEnd: (e: DragEvent) => void;
  onDragOver: (e: DragEvent, container: HTMLDivElement | null, layouts: CardLayoutType[]) => void;
  onDragStart: (card: CardType, index: number) => (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  status: StatusType;
  totalCards: number;
};

export default function StatusRow(props: StatusRowProps) {
  const {
    boardId,
    cards,
    currentHoveredState,
    onDragEnd,
    onDragOver,
    onDragStart,
    onDrop,
    status,
    onCardClick,
    totalCards,
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

  const scrollTop = containerRef.current?.scrollTop || 0;

  const fakeCardId = `${FAKE_CARD_ID}-${status.name}`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ backgroundColor: status.color }} />
        <span>
          {status.name} ({cards.length})
        </span>
      </div>
      {totalCards !== 0 && (
        <div
          ref={containerRef}
          className={styles.cardWrappers}
          data-role="drop-container"
          onDragOver={onDragOverHandler as VoidFunction}
          onDrop={onDrop as VoidFunction}
        >
          {cards.map((card, index) => {
            // {index === 0 && <ButtonAddCard stickyPosition boardId={boardId} />}
            return (
              <Card
                key={card.id}
                attachments={card.attachments}
                description={card.description}
                hovered={card.id === currentHoveredState.insertBeforeId}
                id={card.id}
                index={index}
                onClick={onCardClick}
                onDragEnd={onDragEnd}
                onDragStart={onDragStart(card, index)}
                onLayout={onCardLayout}
                parentScrollTop={scrollTop}
                status={card.status}
                tags={card.tags}
                title={card.title}
              />
            );
          })}
          <FakeCard
            hovered={fakeCardId === currentHoveredState.insertBeforeId}
            id={fakeCardId}
            index={cards.length}
            onLayout={onCardLayout}
            parentScrollTop={scrollTop}
            status={status}
          />
        </div>
      )}
    </div>
  );
}
