'use client';

import { useRouter } from 'next/navigation';
import { all, any, assocPath, clone, compose, equals, insert, isNil, pathOr, remove } from 'ramda';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { FAKE_CARD_ID, ROUTES } from '@/app/constants';
import usePrevious from '@/app/hooks/usePrevious';
import type {
  CardLayoutType,
  CardType,
  CardsByStatusReturnType,
  StatusData,
  StatusType,
  UpdateCardPositionBodyType,
} from '@/app/types';

import ButtonAddCard from '../ButtonAddCard';
import Card from '../Card';
import FakeCard from '../FakeCard';
import { DraggableContext } from '../StatusWrapper';

import styles from './StatusColumn.module.css';

type StatusColumnProps = {
  boardId: string;
  initialData: StatusData;
  shouldShowAddCardButton: boolean;
  fetchCardsByStatus: ({
    boardId,
    statusId,
    page,
    perPage,
  }: {
    boardId: string;
    statusId: string;
    page: number;
    perPage?: number;
  }) => Promise<CardsByStatusReturnType>;
  total: number;
  status: StatusType;
  updateCardPosition: (data: UpdateCardPositionBodyType) => Promise<void>;
};

export default function StatusColumn(props: StatusColumnProps) {
  const {
    boardId,
    initialData,
    shouldShowAddCardButton,
    fetchCardsByStatus,
    total,
    status,
    updateCardPosition,
  } = props;

  const router = useRouter();

  // Loading state
  const [isFetchingNewData, setIsFetchingNewData] = useState(false);

  // Status column
  const [statusData, setStatusData] = useState<StatusData>(initialData);
  const cardsLengthPrev = usePrevious(statusData.cards.length);
  const statusDataRef = useRef(statusData);

  // Scroll container
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Layouts
  const layoutsObj = useRef<Record<string, CardLayoutType>>({});
  const layoutsArr = useRef<CardLayoutType[]>([]);

  // Draggable state
  const {
    currentDraggable,
    currentHighlighted,
    setCurrentDraggable,
    setCurrentHighlighted,
    dragState,
    updateDraggableState,
  } = useContext(DraggableContext);

  // Scroll to id
  const scrollToId = useRef<string | null>(null);

  /**
   * On card layout
   */
  const onCardLayout = (layout: CardLayoutType) => {
    layoutsObj.current[layout.id] = layout;
    layoutsArr.current = Object.values(layoutsObj.current).sort((a, b) => a.top - b.top);
  };

  /**
   * Fetch more cards
   */
  const fetchMore = async () => {
    if (!containerRef.current) {
      return;
    }

    // Fetch more cards
    if (statusData.hasMore) {
      try {
        setIsFetchingNewData(true);

        const res = await fetchCardsByStatus({
          boardId,
          statusId: status.id,
          page: statusData.page + 1,
        });

        const existedCards = pathOr<CardType[]>([], ['cards'], statusData);
        const additionalCards = pathOr<CardType[]>([], ['cards'], res);
        const cards = [...existedCards, ...additionalCards];

        scrollToId.current = additionalCards[0]?.id;

        const newData = compose(
          assocPath(['cards'], cards),
          assocPath(['total'], res.total),
          assocPath(['page'], res.page),
          assocPath(['hasMore'], res.hasMore),
        )(statusData) as StatusData;

        setStatusData((prev) => ({ ...prev, ...newData }));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('fetchMoreCards error', err);
      } finally {
        setIsFetchingNewData(false);
      }
    }
  };

  /**
   * Find nearest element id
   */
  const findInsertBeforeElement = ({ y, layouts }: { y: number; layouts: CardLayoutType[] }) => {
    const insertBeforeElement: {
      beforeId: string | null;
      beforeIndex: number | null;
      previousCardId: string | null;
    } = {
      beforeId: null,
      beforeIndex: null,
      previousCardId: null,
    };

    for (let i = 0; i < layouts.length; i++) {
      const layout = layouts[i];

      if (layout.id === currentDraggable?.id) {
        continue;
      }

      if (y <= layout.middle) {
        insertBeforeElement.beforeId = layout.id;
        insertBeforeElement.beforeIndex = layout.index;
        insertBeforeElement.previousCardId = layouts[i - 1]?.id || null;

        break;
      }
    }

    return insertBeforeElement;
  };

  /**
   * On drag start handler
   */
  const onDragStartHandler = (card: CardType) => () => {
    setCurrentDraggable(card);
  };

  /**
   * On drag over handler
   */
  const onDragOverHandler = (e: DragEvent) => {
    e.preventDefault();

    if (!containerRef.current) {
      return;
    }

    const { beforeId, beforeIndex, previousCardId } = findInsertBeforeElement({
      y: e.pageY + containerRef.current.scrollTop,
      layouts: layoutsArr.current,
    });

    if (!beforeId) {
      return;
    }

    if (previousCardId === currentDraggable?.id) {
      return;
    }

    setCurrentHighlighted({
      id: beforeId,
      index: beforeIndex,
    });
  };

  /**
   * On drag leave handler
   */
  const onDragLeaveHandler = () => {
    if (currentHighlighted?.id) {
      setCurrentHighlighted(null);
    }
  };

  /**
   * On drag end handler
   */
  const onDragEndHandler = () => {
    if (currentHighlighted?.id) {
      setCurrentHighlighted(null);
    }
  };

  /**
   * On drop handler
   */
  const onDropHandler = () => {
    if (isNil(currentHighlighted?.index) || isNil(currentDraggable)) {
      return;
    }

    const card = clone(currentDraggable);
    card.status = status;
    card.statusId = status.id;

    updateDraggableState({
      insert: {
        statusId: status.id,
        beforeId: currentHighlighted.id,
        card,
      },
      remove: {
        id: currentDraggable.id,
        statusId: currentDraggable.statusId,
      },
    });
  };

  const updateStatusCards = () => {
    if (!dragState) {
      return;
    }

    const {
      insert: { card, statusId: insertStatusId, beforeId: insertBeforeId },
      remove: { statusId: removeStatusId, id: removeId },
    } = dragState;

    let cards = clone(statusDataRef.current.cards);
    let isAffected = false;
    let position;

    // Insert card
    if (status.id === insertStatusId && !isNil(insertBeforeId) && !isNil(card)) {
      const insertIndex =
        insertBeforeId.indexOf(FAKE_CARD_ID) !== -1
          ? cards.length
          : cards.findIndex((item) => item.id === insertBeforeId);

      position = insertIndex + 1;

      if (insertIndex !== -1) {
        cards = insert(insertIndex, { ...card, inserted: true }, cards);
        isAffected = true;
      }
    }

    // Remove card
    if (status.id === removeStatusId) {
      const removeIndex = cards.findIndex((item) => item.id === removeId && item.inserted !== true);

      if (removeIndex !== -1) {
        cards = remove(removeIndex, 1, cards);
        isAffected = true;
      }
    }

    // Update data
    if (isAffected) {
      const newCards = cards.map((item, index) => {
        item.position = index + 1;
        item.inserted = false;

        return item;
      });

      setStatusData(() => ({
        ...statusDataRef.current,
        cards: newCards,
      }));

      if (!isNil(dragState.insert.card) && !isNil(dragState.remove.statusId) && !isNil(position)) {
        updateCardPosition({
          boardId,
          cardId: dragState.insert.card.id,
          oldStatusId: dragState.remove.statusId,
          newStatusId: status.id,
          position: position > newCards.length ? newCards.length : position,
        });
      }

      updateDraggableState(null);
    }
  };

  /**
   * On card click
   */
  const onCardClick = (id: string) => () => {
    router.push(ROUTES.showCard.replace('[cardId]', id).replace('[boardId]', boardId));
  };

  /**
   * On scroll handler
   */
  const onScrollHandler = () => {
    if (!containerRef.current) {
      return;
    }

    // If scrolled to the bottom
    if (
      containerRef.current.scrollTop ===
      containerRef.current.scrollHeight - containerRef.current.offsetHeight
    ) {
      fetchMore();
    }
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    statusDataRef.current = statusData;
  }, [statusData]);

  /**
   * Lifecycle
   */
  useLayoutEffect(() => {
    if (!isNil(dragState)) {
      updateStatusCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragState]);

  /**
   * Lifecycle
   */
  useLayoutEffect(() => {
    layoutsObj.current = {};
    layoutsArr.current = [];
  }, [statusData.cards.length]);

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    // For big screens - fetch more cards
    const hasScroll = containerRef.current.scrollHeight > containerRef.current.offsetHeight;

    const firstBatchCondition = all(equals(true))([
      isNil(cardsLengthPrev),
      !isNil(statusData.cards.length),
      equals(hasScroll, false),
    ]);

    const nextBatchCondition = all(equals(true))([
      !isNil(cardsLengthPrev) && cardsLengthPrev < statusData.cards.length,
      equals(hasScroll, false),
    ]);

    const fetchCondition = any(equals(true))([firstBatchCondition, nextBatchCondition]);

    if (fetchCondition) {
      fetchMore();
    }

    // Scroll to a first newly added element
    if (!fetchCondition && scrollToId.current) {
      const element = containerRef.current.querySelector(`[data-id="${scrollToId.current}"]`);

      element?.scrollIntoView();

      scrollToId.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsLengthPrev, statusData.cards.length]);

  const scrollTop = containerRef.current?.scrollTop || 0;

  const fakeCardId = `${FAKE_CARD_ID}-${status.name}`;

  return (
    <div className={styles.container} data-status-id={status.id} data-status-name={status.name}>
      <div className={styles.header}>
        <div style={{ backgroundColor: status.color }} />
        <span>
          {status.name} ({total})
        </span>
      </div>
      <div
        ref={containerRef}
        className={styles.cardWrappers}
        data-role="drop-container"
        onDragOver={onDragOverHandler as VoidFunction}
        onDragLeave={onDragLeaveHandler as VoidFunction}
        onDrop={onDropHandler as VoidFunction}
        onScroll={onScrollHandler}
      >
        {shouldShowAddCardButton && <ButtonAddCard stickyPosition boardId={boardId} />}
        {statusData.cards.map((card, index) => {
          return (
            <Card
              key={card.id}
              attachments={card.attachments}
              description={card.description}
              highlighted={card.id === currentHighlighted?.id}
              id={card.id}
              index={index}
              onClick={onCardClick(card.id)}
              onDragStart={onDragStartHandler(card)}
              onDragEnd={onDragEndHandler}
              onLayout={onCardLayout}
              parentScrollTop={scrollTop}
              position={card.position}
              status={card.status}
              tags={card.tags}
              title={card.title}
            />
          );
        })}
        {isFetchingNewData && (
          <p className={styles.loadingText}>
            <FormattedMessage id="loading" />
          </p>
        )}
        <FakeCard
          highlighted={fakeCardId === currentHighlighted?.id}
          id={fakeCardId}
          index={statusData.cards.length}
          onLayout={onCardLayout}
          parentScrollTop={scrollTop}
          status={status}
        />
      </div>
    </div>
  );
}
