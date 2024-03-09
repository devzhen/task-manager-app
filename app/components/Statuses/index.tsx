'use client';

import { usePathname } from 'next/navigation';
import assocPath from 'ramda/es/assocPath';
import ramdaClone from 'ramda/es/clone';
import compose from 'ramda/es/compose';
import insert from 'ramda/es/insert';
import path from 'ramda/es/path';
import remove from 'ramda/es/remove';
import { useEffect, useRef, useState } from 'react';

import { STATUSES, STATUSES_OBJ } from '@/app/constants';
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
    id: '',
    index: 0,
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
  const findNearestElementId = ({ y, layouts }: { y: number; layouts: CardLayoutType[] }) => {
    const nearest: {
      id: string | null;
      index: number;
      status: keyof typeof STATUSES_OBJ | null;
    } = {
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

      const {
        id,
        index,
        status: nearestStatus,
      } = findNearestElementId({
        y: e.pageY + dropContainer.scrollTop,
        layouts,
      });
      if (!id) {
        // eslint-disable-next-line no-console
        console.log(`Couldn't find a nearest card id`, id);
        return;
      }

      // When sorting in the same drop area
      if (
        nearestStatus === state.currentDraggable.status &&
        index - state.currentDraggable.index === 1
      ) {
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
  const onDropHandler = (newStatus: keyof typeof STATUSES_OBJ) => () => {
    if (!state.hoveredCard.id) {
      return;
    }

    const clone = ramdaClone(cardsRef.current);

    const oldStatus = stateRef.current.currentDraggable.status;
    const oldIndex = stateRef.current.currentDraggable.index;

    const newIndex = stateRef.current.hoveredCard.index;

    const item = compose(
      assocPath(['position'], newIndex),
      assocPath(['status'], newStatus),
      path([oldStatus, oldIndex]),
    )(clone) as CardType;

    // TODO: remove
    // console.log('prev', clone);
    // console.log('meta', { oldStatus, oldIndex, newIndex, newStatus, item });

    const newCards = compose(
      (cardsArr: StatusesCardType) => {
        cardsArr[newStatus] = cardsArr[newStatus].map((card, index) => ({
          ...card,
          position: index,
        }));
        return cardsArr;
      },
      (cardsArr: StatusesCardType) => {
        cardsArr[newStatus] = insert(newIndex, item, cardsArr[newStatus]);
        return cardsArr;
      },
      (cardsArr: StatusesCardType) => {
        cardsArr[oldStatus] = cardsArr[oldStatus].map((card, index) => ({
          ...card,
          position: index,
        }));
        return cardsArr;
      },
      (cardsArr: StatusesCardType) => {
        cardsArr[oldStatus] = remove(oldIndex, 1, cardsArr[oldStatus]);
        return cardsArr;
      },
    )(clone);

    // TODO: remove
    // console.log('next', clone, '\n\n');

    setCards(newCards);
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

  return (
    <div className={styles.container}>
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
