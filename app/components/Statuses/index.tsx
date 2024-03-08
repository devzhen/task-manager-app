'use client';

import assocPath from 'ramda/es/assocPath';
import ramdaClone from 'ramda/es/clone';
import compose from 'ramda/es/compose';
import insert from 'ramda/es/insert';
import path from 'ramda/es/path';
import remove from 'ramda/es/remove';
import { useEffect, useRef, useState } from 'react';

import { STATUSES } from '@/app/constants';
import type { CardLayoutType, CardType, StateType, StatusesCardType } from '@/app/types';

import StatusRow from '../StatusRow';

import styles from './Statuses.module.css';

const initialState: StateType = {
  isInitialized: false,
  currentDraggable: {
    id: '',
    status: STATUSES.inProgress.value,
    index: 0,
  },
  currentDroppable: {
    status: STATUSES.inProgress.value,
  },
  hoveredCard: {
    id: '',
    index: 0,
  },
};

export default function Statuses() {
  const [cards, setCards] = useState<StatusesCardType>({
    [STATUSES.backlog.value]: [
      {
        id: 'id-1',
        name: 'Backlog 1',
        status: STATUSES.backlog.value,
        order: 1,
      },
      // {
      //   id: 'id-2',
      //   name: 'Backlog 2',
      //   status: STATUSES.backlog.value,
      //   order: 2,
      // },
      // {
      //   id: 'id-3',
      //   name: 'Backlog 3',
      //   status: STATUSES.backlog.value,
      //   order: 3,
      // },
      // {
      //   id: 'id-4',
      //   name: 'Backlog 4',
      //   status: STATUSES.backlog.value,
      //   order: 4,
      // },
      // {
      //   id: 'id-5',
      //   name: 'Backlog 5',
      //   status: STATUSES.backlog.value,
      //   order: 5,
      // },
      // {
      //   id: 'id-6',
      //   name: 'Backlog 6',
      //   status: STATUSES.backlog.value,
      //   order: 6,
      // },
    ],
    [STATUSES.inProgress.value]: [
      {
        id: 'id-11',
        name: 'In Progress 11',
        status: STATUSES.inProgress.value,
        order: 1,
      },
      {
        id: 'id-22',
        name: 'In Progress 22',
        status: STATUSES.inProgress.value,
        order: 2,
      },
      {
        id: 'id-33',
        name: 'In Progress 33',
        status: STATUSES.inProgress.value,
        order: 3,
      },
      {
        id: 'id-44',
        name: 'In Progress 44',
        status: STATUSES.inProgress.value,
        order: 4,
      },
      {
        id: 'id-55',
        name: 'In Progress 55',
        status: STATUSES.inProgress.value,
        order: 5,
      },
      {
        id: 'id-66',
        name: 'In Progress 66',
        status: STATUSES.inProgress.value,
        order: 6,
      },
    ],
    [STATUSES.inReview.value]: [
      {
        id: 'id-111',
        name: 'In Review 111',
        status: STATUSES.inReview.value,
        order: 1,
      },
      {
        id: 'id-222',
        name: 'In Review 222',
        status: STATUSES.inReview.value,
        order: 2,
      },
      {
        id: 'id-333',
        name: 'In Review 333',
        status: STATUSES.inReview.value,
        order: 3,
      },
      {
        id: 'id-444',
        name: 'In Review 444',
        status: STATUSES.inReview.value,
        order: 4,
      },
      {
        id: 'id-555',
        name: 'In Review 555',
        status: STATUSES.inReview.value,
        order: 5,
      },
      {
        id: 'id-666',
        name: 'In Review 666',
        status: STATUSES.inReview.value,
        order: 6,
      },
    ],
    [STATUSES.completed.value]: [
      {
        id: 'id-1111',
        name: 'Completed 1111',
        status: STATUSES.completed.value,
        order: 1,
      },
      {
        id: 'id-2222',
        name: 'Completed 2222',
        status: STATUSES.completed.value,
        order: 2,
      },
      {
        id: 'id-3333',
        name: 'Completed 3333',
        status: STATUSES.completed.value,
        order: 3,
      },
      {
        id: 'id-4444',
        name: 'Completed 4444',
        status: STATUSES.completed.value,
        order: 4,
      },
      {
        id: 'id-5555',
        name: 'Completed 5555',
        status: STATUSES.completed.value,
        order: 5,
      },
      {
        id: 'id-6666',
        name: 'Completed 6666',
        status: STATUSES.completed.value,
        order: 6,
      },
    ],
  });
  const cardsRef = useRef(cards);

  const [state, setState] = useState<StateType>(initialState);
  const stateRef = useRef(state);

  /**
   * On drag start handler
   */
  const onDragStartHandler = (e: DragEvent) => {
    if (e.dataTransfer) {
      const id = e.dataTransfer.getData('id');
      const status = e.dataTransfer.getData('status') as keyof typeof STATUSES;
      const index = parseInt(e.dataTransfer.getData('index'));

      setState((prev) => ({
        ...prev,
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
  const findNearestElementId = ({ y, layouts }: { y: number; layouts: CardLayoutType[] }) => {
    const nearest: { id: string | null; index: number; status: keyof typeof STATUSES | null } = {
      id: null,
      index: 0,
      status: null,
    };

    for (let i = 0; i < layouts.length; i++) {
      const layout = layouts[i];

      if (layout.id === state.currentDraggable.id) {
        continue;
      }

      if (y <= layout.middle) {
        nearest.id = layout.id;
        nearest.index = layout.index;
        nearest.status = layout.status;

        break;
      }
    }

    return nearest;
  };

  /**
   * On drag over handler
   */
  const onDragOverHandler =
    (status: keyof typeof STATUSES) =>
    (e: DragEvent, dropContainer: HTMLDivElement | null, layouts: CardLayoutType[]) => {
      e.preventDefault();

      setState((prev) => ({
        ...prev,
        currentDroppable: {
          status,
        },
      }));

      if (!dropContainer) {
        return;
      }

      const { id, index } = findNearestElementId({
        y: e.pageY + dropContainer.scrollTop,
        layouts,
      });
      if (!id) {
        // eslint-disable-next-line no-console
        console.log(`Couldn't find a nearest card id`, id);
        return;
      }

      setState((prev) => ({
        ...prev,
        hoveredCard: {
          id,
          index,
        },
      }));
    };

  /**
   * On drop handler
   */
  const onDropHandler = (newStatus: keyof typeof STATUSES) => () => {
    const clone = ramdaClone(cardsRef.current);

    const oldStatus = stateRef.current.currentDraggable.status;
    const oldIndex = stateRef.current.currentDraggable.index;

    const newIndex = stateRef.current.hoveredCard.index;

    const item = compose(
      assocPath(['order'], newIndex),
      assocPath(['status'], newStatus),
      path([oldStatus, oldIndex]),
    )(clone) as CardType;

    console.log('prev', clone);
    console.log('meta', { oldStatus, oldIndex, newIndex, newStatus, item });

    const newCards = compose(
      (cards: StatusesCardType) => {
        cards[newStatus] = cards[newStatus].map((item, index) => ({ ...item, order: index }));
        return cards;
      },
      (cards: StatusesCardType) => {
        cards[newStatus] = insert(newIndex, item, cards[newStatus]);
        return cards;
      },
      (cards: StatusesCardType) => {
        cards[oldStatus] = cards[oldStatus].map((item, index) => ({ ...item, order: index }));
        return cards;
      },
      (cards: StatusesCardType) => {
        cards[oldStatus] = remove(oldIndex, 1, cards[oldStatus]);
        return cards;
      },
    )(clone);

    console.log('next', clone, '\n\n');

    setCards(newCards);
    setState(initialState);
  };

  useEffect(() => {
    cardsRef.current = cards;
    stateRef.current = state;
  }, [cards, state]);

  return (
    <div className={styles.container}>
      {Object.values(STATUSES).map((status) => {
        return (
          <StatusRow
            name={status.name}
            key={status.name}
            color={status.color}
            status={status.value}
            cards={cards[status.value]}
            onDragStart={onDragStartHandler}
            onDragEnd={onDragEndHandler}
            onDragOver={onDragOverHandler(status.value)}
            onDrop={onDropHandler(status.value)}
            currentHoveredState={state.hoveredCard}
          />
        );
      })}
    </div>
  );
}
