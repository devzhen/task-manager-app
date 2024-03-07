'use client';

import ramdaClone from 'ramda/src/clone';
import compose from 'ramda/src/compose';
import insert from 'ramda/src/insert';
import path from 'ramda/src/path';
import remove from 'ramda/src/remove';
import { useEffect, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { STATUSES } from '@/app/constants';
import { StatusesCardType } from '@/app/types';

import StatusRow from '../StatusRow';

import styles from './Statuses.module.css';

export default function Statuses() {
  const [cards, setCards] = useState<StatusesCardType>({
    [STATUSES.backlog.value]: [
      {
        id: 'id-1',
        name: 'Backlog card 1',
        status: STATUSES.backlog.value,
        order: 1,
      },
      {
        id: 'id-2',
        name: 'Backlog card 2',
        status: STATUSES.backlog.value,
        order: 2,
      },
      {
        id: 'id-3',
        name: 'Backlog card 3',
        status: STATUSES.backlog.value,
        order: 3,
      },
      {
        id: 'id-4',
        name: 'Backlog card 4',
        status: STATUSES.backlog.value,
        order: 4,
      },
      {
        id: 'id-5',
        name: 'Backlog card 1',
        status: STATUSES.backlog.value,
        order: 5,
      },
      {
        id: 'id-6',
        name: 'Backlog card 6',
        status: STATUSES.backlog.value,
        order: 6,
      },
    ],
    [STATUSES.inProgress.value]: [
      {
        id: 'id-11',
        name: 'In Progress card 1',
        status: STATUSES.inProgress.value,
        order: 1,
      },
      {
        id: 'id-22',
        name: 'In Progress card 2',
        status: STATUSES.inProgress.value,
        order: 2,
      },
      {
        id: 'id-33',
        name: 'In Progress card 3',
        status: STATUSES.inProgress.value,
        order: 3,
      },
      {
        id: 'id-44',
        name: 'In Progress card 4',
        status: STATUSES.inProgress.value,
        order: 4,
      },
      {
        id: 'id-55',
        name: 'In Progress card 1',
        status: STATUSES.inProgress.value,
        order: 5,
      },
      {
        id: 'id-66',
        name: 'In Progress card 6',
        status: STATUSES.inProgress.value,
        order: 6,
      },
    ],
    [STATUSES.inReview.value]: [
      {
        id: 'id-111',
        name: 'In Review card 1',
        status: STATUSES.inReview.value,
        order: 1,
      },
      {
        id: 'id-222',
        name: 'In Review card 2',
        status: STATUSES.inReview.value,
        order: 2,
      },
      {
        id: 'id-333',
        name: 'In Review card 3',
        status: STATUSES.inReview.value,
        order: 3,
      },
      {
        id: 'id-444',
        name: 'In Review card 4',
        status: STATUSES.inReview.value,
        order: 4,
      },
      {
        id: 'id-555',
        name: 'In Review card 1',
        status: STATUSES.inReview.value,
        order: 5,
      },
      {
        id: 'id-666',
        name: 'In Review card 6',
        status: STATUSES.inReview.value,
        order: 6,
      },
    ],
    [STATUSES.completed.value]: [
      {
        id: 'id-1111',
        name: 'Completed card 1',
        status: STATUSES.completed.value,
        order: 1,
      },
      {
        id: 'id-2222',
        name: 'Completed card 2',
        status: STATUSES.completed.value,
        order: 2,
      },
      {
        id: 'id-3333',
        name: 'Completed card 3',
        status: STATUSES.completed.value,
        order: 3,
      },
      {
        id: 'id-4444',
        name: 'Completed card 4',
        status: STATUSES.completed.value,
        order: 4,
      },
      {
        id: 'id-5555',
        name: 'Completed card 1',
        status: STATUSES.completed.value,
        order: 5,
      },
      {
        id: 'id-6666',
        name: 'Completed card 6',
        status: STATUSES.completed.value,
        order: 6,
      },
    ],
  });
  const cardsRef = useRef(cards);

  const [currentHoveredCardId, setCurrentHoveredCardId] = useState<undefined | string>();
  const currentHoveredCardIdRef = useRef(currentHoveredCardId);

  const onDropHandler = ({
    status,
    oldStatus,
    deleteIndex,
  }: {
    id: string;
    status: keyof typeof STATUSES;
    oldStatus: keyof typeof STATUSES;
    deleteIndex: number;
  }) => {
    const dragLineHelper = document.querySelector(
      `[data-line-for="${currentHoveredCardIdRef.current}"]`,
    ) as HTMLDivElement;
    const insertIndex = parseInt(dragLineHelper?.getAttribute('data-order') as string);

    setCurrentHoveredCardId(undefined);

    const clone = ramdaClone(cardsRef.current);
    const item = path([oldStatus, deleteIndex], clone);

    const newState = compose(
      (state: StatusesCardType) => {
        state[status] = insert(insertIndex, item, state[status]);
        return state;
      },
      (state: StatusesCardType) => {
        state[oldStatus] = remove(deleteIndex, 1, state[oldStatus]);
        return state;
      },
    )(clone);

    setCards(newState);
  };

  useEffect(() => {
    currentHoveredCardIdRef.current = currentHoveredCardId;
  }, [currentHoveredCardId]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        {Object.values(STATUSES).map((status) => {
          return (
            <StatusRow
              name={status.name}
              key={status.name}
              color={status.color}
              status={status.value}
              cards={cards[status.value]}
              onDrop={onDropHandler}
              currentHoveredCardId={currentHoveredCardId}
              setCurrentHoveredCardId={setCurrentHoveredCardId}
            />
          );
        })}
      </div>
    </DndProvider>
  );
}
