'use client';

import { useRouter } from 'next/navigation';
import assocPath from 'ramda/es/assocPath';
import ramdaClone from 'ramda/es/clone';
import compose from 'ramda/es/compose';
import path from 'ramda/es/path';
import { useEffect, useRef, useState } from 'react';

import { STATUSES, STATUSES_OBJ } from '@/app/constants';
import type { CardLayoutType, CardType, StateType, StatusesCardType } from '@/app/types';
import deleteCardFromBoard from '@/app/utils/deleteCardFromBoard';
import insertCardToBoard from '@/app/utils/insertCardToBoard';
import markCardAsWillBeRemoved from '@/app/utils/markCardAsWillBeRemoved';
import updateCardsPositionProperty from '@/app/utils/updateCardsPositionProperty';

import CardsEmptyState from '../CardsEmptyState';
import StatusRow from '../StatusRow';

import styles from './Statuses.module.css';

const initialState: StateType = {
  isInitialized: false,
  currentDraggable: {
    id: '',
    status: STATUSES.backlog,
    index: 0,
  },
  currentDroppable: {
    status: STATUSES.backlog,
  },
  hoveredCard: {
    insertBeforeId: '',
    insertBeforeIndex: 0,
  },
};

type StatusesProps = {
  initialCards: StatusesCardType;
  total: number;
};

export default function Statuses(props: StatusesProps) {
  const { initialCards, total } = props;

  const router = useRouter();

  const [cards, setCards] = useState<StatusesCardType>(initialCards);
  const cardsRef = useRef(cards);

  const [state, setState] = useState<StateType>(initialState);
  const stateRef = useRef(state);

  /**
   * On drag start handler
   */
  const onDragStartHandler = (e: DragEvent) => {
    if (e.dataTransfer) {
      const id = e.dataTransfer.getData('id');
      const status = e.dataTransfer.getData('status') as keyof typeof STATUSES_OBJ;
      const index = parseInt(e.dataTransfer.getData('index'));

      setState((prev) => ({
        ...prev,
        isInitialized: true,
        currentDraggable: {
          id,
          status,
          index,
        },
      }));
    }
  };

  /**
   * Drag end handler
   */
  const onDragEndHandler = () => {
    if (state.isInitialized) {
      setState(initialState);
    }
  };

  /**
   * Find nearest element id
   */
  const findInsertBeforeElement = ({ y, layouts }: { y: number; layouts: CardLayoutType[] }) => {
    const insertBeforeElement: {
      insertBeforeId: string | null;
      insertBeforeIndex: number;
      insertBeforeStatus: keyof typeof STATUSES_OBJ | null;
    } = {
      insertBeforeId: null,
      insertBeforeIndex: 0,
      insertBeforeStatus: null,
    };

    for (let i = 0; i < layouts.length; i++) {
      const layout = layouts[i];

      if (layout.id === state.currentDraggable.id) {
        continue;
      }

      if (y <= layout.middle) {
        insertBeforeElement.insertBeforeId = layout.id;
        insertBeforeElement.insertBeforeIndex = layout.index;
        insertBeforeElement.insertBeforeStatus = layout.status;

        break;
      }
    }

    return insertBeforeElement;
  };

  /**
   * On drag over handler
   */
  const onDragOverHandler =
    (status: keyof typeof STATUSES_OBJ) =>
    (e: DragEvent, dropContainer: HTMLDivElement | null, layouts: CardLayoutType[]) => {
      e.preventDefault();

      setState((prev) => ({
        ...prev,
        currentDroppable: {
          status,
        },
        hoveredCard: initialState.hoveredCard,
      }));

      if (!dropContainer) {
        return;
      }

      const { insertBeforeId, insertBeforeIndex, insertBeforeStatus } = findInsertBeforeElement({
        y: e.pageY + dropContainer.scrollTop,
        layouts,
      });
      if (!insertBeforeId) {
        // console.log(`Couldn't find a nearest card id`, insertBeforeId);
        return;
      }

      // When sorting in the same drop area
      if (
        insertBeforeStatus === state.currentDraggable.status &&
        insertBeforeIndex - state.currentDraggable.index === 1
      ) {
        return;
      }

      setState((prev) => ({
        ...prev,
        hoveredCard: {
          insertBeforeId,
          insertBeforeIndex,
        },
      }));
    };

  /**
   * On drop handler
   */
  const onDropHandler = (newStatus: keyof typeof STATUSES_OBJ) => () => {
    if (!state.hoveredCard.insertBeforeId) {
      return;
    }

    let clone = ramdaClone(cardsRef.current);

    const oldStatus = stateRef.current.currentDraggable.status;
    const oldIndex = stateRef.current.currentDraggable.index;

    const card = compose(
      assocPath(['status'], newStatus),
      path([oldStatus, oldIndex]),
    )(clone) as CardType;

    // TODO: remove
    // console.log('prev', clone);
    // console.log('meta', { oldStatus, oldIndex, newStatus, card });

    // Mark an old card as will be removed.
    clone = markCardAsWillBeRemoved({
      cardsObj: clone,
      status: oldStatus,
      id: stateRef.current.currentDraggable.id,
    });

    // Insert to a new board
    clone = insertCardToBoard({
      cardsObj: clone,
      status: newStatus,
      insertBeforeId: state.hoveredCard.insertBeforeId,
      card,
    });

    // Delete from a previous board
    clone = deleteCardFromBoard({
      cardsObj: clone,
      status: oldStatus,
    });

    // Update cards position property
    clone = updateCardsPositionProperty(clone);

    // TODO: remove
    // console.log('next', clone, '\n\n');

    setCards(clone);
    setState(initialState);
  };

  /**
   * ON card click handler
   */
  const onCardClick = (id: string) => {
    router.push(`/cards/${id}`);
  };

  /**
   * Add card
   */
  const addCard = () => {};

  useEffect(() => {
    cardsRef.current = cards;
    stateRef.current = state;
  }, [cards, state]);

  const classNames = [styles.container];

  return (
    <div className={classNames.join(' ')}>
      {Object.values(STATUSES_OBJ).map((status) => {
        return (
          <StatusRow
            addCard={addCard}
            cards={cards?.[status.value] || []}
            color={status.color}
            currentHoveredState={state.hoveredCard}
            key={status.name}
            name={status.name}
            onCardClick={onCardClick}
            onDragEnd={onDragEndHandler}
            onDragOver={onDragOverHandler(status.value)}
            onDragStart={onDragStartHandler}
            onDrop={onDropHandler(status.value)}
            status={status.value}
            totalCards={total}
          />
        );
      })}
      {total === 0 && <CardsEmptyState addCard={addCard} />}
    </div>
  );
}
