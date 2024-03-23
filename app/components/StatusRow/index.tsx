import { useEffect, useRef } from 'react';

import { FAKE_CARD_ID } from '@/app/constants';
import usePrevious from '@/app/hooks/usePrevious';
import type { CardType, StatusType } from '@/app/types';

import ButtonAddCard from '../ButtonAddCard';
import Card from '../Card';
import FakeCard from '../FakeCard';
import type { CardLayoutType, StatusesStateType } from '../Statuses/types';

import styles from './StatusRow.module.css';

type StatusRowProps = {
  boardId: string;
  cards: CardType[];
  currentHoveredState: StatusesStateType['hoveredCard'];
  onCardClick: (id: string) => void;
  onDragEnd: (e: DragEvent) => void;
  onDragOver: (e: DragEvent, container: HTMLDivElement | null, layouts: CardLayoutType[]) => void;
  onDragStart: (card: CardType, index: number) => (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  shouldShowAddCardButton: boolean;
  status: StatusType;
  totalCards: number;
  hasMore: boolean;
  fetchMoreCards: () => void;
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
    shouldShowAddCardButton,
    status,
    onCardClick,
    totalCards,
    hasMore,
    fetchMoreCards,
  } = props;

  const cardsLengthPrev = usePrevious(cards.length);

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

  const fetchMore = () => {
    if (!containerRef.current) {
      return;
    }

    const hasScroll = containerRef.current.scrollHeight > containerRef.current.offsetHeight;

    // Fetch more cards
    if (!hasScroll && hasMore) {
      fetchMoreCards();
    }
  };

  useEffect(() => {
    layoutsObj.current = {};
    layoutsArr.current = [];
  }, [cards.length]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (!cardsLengthPrev && cards.length) {
      fetchMore();
    }

    if (cardsLengthPrev && cardsLengthPrev < cards.length) {
      fetchMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsLengthPrev, cards.length]);

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
          {shouldShowAddCardButton && <ButtonAddCard stickyPosition boardId={boardId} />}
          {cards.map((card, index) => {
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
