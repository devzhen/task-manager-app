'use client';

import { usePathname } from 'next/navigation';
import assocPath from 'ramda/es/assocPath';
import ramdaClone from 'ramda/es/clone';
import compose from 'ramda/es/compose';
import insert from 'ramda/es/insert';
import path from 'ramda/es/path';
import { useEffect, useRef, useState } from 'react';

import { FAKE_CARD_ID, STATUSES, STATUSES_OBJ } from '@/app/constants';
import type { BoardType, CardLayoutType, CardType, StateType, StatusesCardType } from '@/app/types';

import StatusesLoading from '../StatusesLoading';
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

type StatusesType = {
  boards: BoardType[];
  requestUrl: string;
};

export default function Statuses(props: StatusesType) {
  const { boards, requestUrl } = props;

  const pathname = usePathname();

  const [cards, setCards] = useState<StatusesCardType>({
    [STATUSES.backlog]: [],
    [STATUSES.inProgress]: [],
    [STATUSES.inReview]: [],
    [STATUSES.completed]: [],
  });
  const cardsRef = useRef(cards);

  const [state, setState] = useState<StateType>(initialState);
  const stateRef = useRef(state);

  const [isLoading, setIsLoading] = useState(true);

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
   * Mark as will be removed
   */
  const markCardAsWillBeRemoved = ({
    cardsObj,
    status,
    id,
  }: {
    cardsObj: StatusesCardType;
    status: keyof typeof STATUSES;
    id: string;
  }) => {
    let clone = ramdaClone(cardsObj);

    const index = clone[status].findIndex((item) => item.id === id);
    if (index !== -1) {
      clone = assocPath([status, index, 'willBeRemoved'], true, clone);
    }

    return clone;
  };

  /**
   * Insert a cart to a board.
   */
  const insertCardToBoard = ({
    cardsObj,
    status,
    insertBeforeId,
    card,
  }: {
    cardsObj: StatusesCardType;
    status: keyof typeof STATUSES;
    insertBeforeId: string;
    card: CardType;
  }) => {
    const clone = ramdaClone(cardsObj);

    const isInsertBeforeFakeCard = insertBeforeId.indexOf(FAKE_CARD_ID);

    const insertionIndex =
      isInsertBeforeFakeCard === -1
        ? clone[status].findIndex((item) => item.id === insertBeforeId)
        : clone[status].length;

    if (insertionIndex !== -1) {
      clone[status] = insert(insertionIndex, card, clone[status]);
    }

    return clone;
  };

  /**
   * Delete a cart from a board.
   */
  const deleteCardFromBoard = ({
    cardsObj,
    status,
  }: {
    cardsObj: StatusesCardType;
    status: keyof typeof STATUSES;
  }) => {
    const clone = ramdaClone(cardsObj);

    clone[status] = clone[status].filter((item) => item.willBeRemoved !== true);

    return clone;
  };

  /**
   * Update cards position property
   */
  const updateCardsPositionProperty = (cardsObj: StatusesCardType) => {
    const clone = ramdaClone(cardsObj);

    const keys = Object.keys(clone);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as keyof typeof STATUSES;

      const cardsArr = clone[key];

      for (let j = 0; j < cardsArr.length; j++) {
        const card = cardsArr[j];
        card.position = j + 1;
        card.willBeRemoved = false;
      }
    }

    return clone;
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
   * Fetch cards
   */
  const fetchCards = async () => {
    try {
      const activeBoardIndex = boards.findIndex((item) => item.href === pathname);
      if (activeBoardIndex !== -1) {
        const activeBoardId = boards[activeBoardIndex].id;

        setIsLoading(true);

        const searchParams = new URLSearchParams();
        searchParams.set('board', activeBoardId);
        const url = new URL(`${requestUrl}/api/card/list?${searchParams.toString()}`);

        const res = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const json = await res.json();
        if ('error' in json) {
          throw json.error;
        }

        setCards(json);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('fetchCards error - ', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add card
   */
  const addCard = () => {};

  useEffect(() => {
    cardsRef.current = cards;
    stateRef.current = state;
  }, [cards, state]);

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards, pathname, requestUrl]);

  const classNames = [styles.container];
  if (isLoading) {
    classNames.push(styles.containerInActive);
  }

  return (
    <div className={classNames.join(' ')}>
      {Object.values(STATUSES_OBJ).map((status) => {
        return (
          <StatusRow
            name={status.name}
            key={status.name}
            color={status.color}
            status={status.value}
            cards={cards[status.value] || []}
            onDragStart={onDragStartHandler}
            onDragEnd={onDragEndHandler}
            onDragOver={onDragOverHandler(status.value)}
            onDrop={onDropHandler(status.value)}
            currentHoveredState={state.hoveredCard}
            addCard={addCard}
            isLoading={isLoading}
          />
        );
      })}
      {isLoading && <StatusesLoading />}
    </div>
  );
}
