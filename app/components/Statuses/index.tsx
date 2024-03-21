'use client';

import { useRouter } from 'next/navigation';
import assocPath from 'ramda/es/assocPath';
import ramdaClone from 'ramda/es/clone';
import compose from 'ramda/es/compose';
import isEmpty from 'ramda/es/isEmpty';
import path from 'ramda/es/path';
import { useEffect, useRef, useState } from 'react';

import updateMany from '@/app/api/card/updateMany';
import { ROUTES } from '@/app/constants';
import usePrevious from '@/app/hooks/usePrevious';
import type {
  BoardCardsByStatusResponseType,
  BoardType,
  CardType,
  NonEmptyArray,
  StatusType,
  UpdateCardBodyType,
  UpdateCardMultipleBodyType,
} from '@/app/types';
import deleteCardFromBoard from '@/app/utils/deleteCardFromBoard';
import insertCardToBoard from '@/app/utils/insertCardToBoard';
import markCardAsWillBeRemoved from '@/app/utils/markCardAsWillBeRemoved';
import updateCardsPositionProperty from '@/app/utils/updateCardsPositionProperty';

import CardsEmptyState from '../CardsEmptyState';
import StatusRow from '../StatusRow';

import { initialState } from './constants';
import styles from './Statuses.module.css';
import type { CardLayoutType, StatusesStateType } from './types';

type StatusesProps = {
  initialStatuses: BoardCardsByStatusResponseType['statuses'];
  total: number;
  board: BoardType;
};

export default function Statuses(props: StatusesProps) {
  const { initialStatuses, total, board } = props;

  const router = useRouter();

  const updateCardsObj = useRef<Record<string, UpdateCardBodyType>>({});

  const [statuses, setStatuses] =
    useState<BoardCardsByStatusResponseType['statuses']>(initialStatuses);
  const statusesRef = useRef(statuses);

  const [state, setState] = useState<StatusesStateType>(initialState);
  const stateRef = useRef(state);

  const currentDraggableIdPrev = usePrevious(state.currentDraggable.id);

  /**
   * On drag start handler
   */
  const onDragStartHandler = (card: CardType, index: number) => () => {
    setState((prev) => ({
      ...prev,
      isInitialized: true,
      currentDraggable: {
        id: card.id,
        status: card.status,
        index,
      },
    }));
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
      insertBeforeStatus: StatusesStateType['currentDraggable']['status'] | null;
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
    (status: StatusType) =>
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
        insertBeforeStatus?.name === state.currentDraggable.status.name &&
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
  const onDropHandler = (newStatus: StatusType) => () => {
    if (!state.hoveredCard.insertBeforeId) {
      return;
    }

    let clone = ramdaClone(statusesRef.current);

    const oldStatus = stateRef.current.currentDraggable.status;
    const oldIndex = stateRef.current.currentDraggable.index;

    const card = compose(
      assocPath(['status'], newStatus),
      assocPath(['oldStatus'], oldStatus),
      path([oldStatus.name, oldIndex]),
    )(clone) as CardType;

    // TODO: remove
    // console.log('prev', clone);
    // console.log('meta', { oldStatus, oldIndex, newStatus, card });

    // Mark an old card as will be removed.
    clone = markCardAsWillBeRemoved({
      statusesObj: clone,
      status: oldStatus,
      id: stateRef.current.currentDraggable.id,
    });

    // Insert to a new board
    clone = insertCardToBoard({
      statusesObj: clone,
      status: newStatus,
      insertBeforeId: state.hoveredCard.insertBeforeId,
      card,
    });

    // Delete from a previous board
    clone = deleteCardFromBoard({
      statusesObj: clone,
      status: oldStatus,
    });

    // Update cards position property
    clone = updateCardsPositionProperty(clone, updateCardsObj.current);

    // TODO: remove
    // console.log('next', clone, '\n\n');

    setStatuses(clone);
    setState(initialState);
  };

  /**
   * ON card click handler
   */
  const onCardClick = (id: string) => {
    router.push(ROUTES.showCard.replace('[boardId]', board.id).replace('[cardId]', id));
  };

  /**
   * Update cards position
   */
  const updateCardsPositions = () => {
    if (updateCardsObj.current) {
      const ids = Object.keys(updateCardsObj.current) as NonEmptyArray<string>;
      if (isEmpty(ids)) {
        return;
      }

      const data: UpdateCardMultipleBodyType = {
        ids,
        fields: [],
        values: [],
      };

      for (const id of ids) {
        const fields = updateCardsObj.current[id].fields;
        const values = updateCardsObj.current[id].values;

        if (isEmpty(fields) || isEmpty(values)) {
          return;
        }

        data.fields = fields;

        const obj: Record<string, string | number> = {};

        fields.forEach((field, index) => {
          obj[field] = values[index];
        });

        data.values.push(obj);
      }

      updateMany(data);

      updateCardsObj.current = {};
    }
  };

  useEffect(() => {
    statusesRef.current = statuses;
    stateRef.current = state;
  }, [statuses, state]);

  useEffect(() => {
    updateCardsPositions();
  }, [statuses]);

  useEffect(() => {
    if (currentDraggableIdPrev && !state.currentDraggable.id) {
      const element = document.querySelector(`[data-id="${currentDraggableIdPrev}"]`);

      const nextElement = element?.nextElementSibling;

      if (nextElement && 'scrollIntoView' in nextElement) {
        nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentDraggableIdPrev, state.currentDraggable.id]);

  return (
    <div className={styles.container} id="board-statuses">
      {board.statuses.map((status, index) => {
        return (
          <StatusRow
            boardId={board.id}
            cards={statuses?.[status.name].cards || []}
            currentHoveredState={state.hoveredCard}
            key={status.name}
            onCardClick={onCardClick}
            onDragEnd={onDragEndHandler}
            onDragOver={onDragOverHandler(status)}
            onDragStart={onDragStartHandler}
            onDrop={onDropHandler(status)}
            shouldShowAddCardButton={index === 0}
            status={status}
            totalCards={total}
          />
        );
      })}
      {total === 0 && <CardsEmptyState boardId={board.id} />}
    </div>
  );
}
