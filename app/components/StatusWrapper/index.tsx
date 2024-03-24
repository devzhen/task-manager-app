'use client';

import { isNil } from 'ramda';
import type { ReactNode } from 'react';
import { createContext, useState } from 'react';

import type { CardType } from '@/app/types';

import styles from './StatusWrapper.module.css';

type CurrentDraggableType = CardType | null;
type CurrentHighlightedType = {
  id: string | null;
  index: number | null;
} | null;
type DragStateType = {
  insert: {
    statusId: string | null;
    beforeId: string | null;
    card: CardType | null;
  };
  remove: {
    statusId: string | null;
    id: string | null;
  };
} | null;

type ContextType = {
  currentDraggable: CurrentDraggableType;
  currentHighlighted: CurrentHighlightedType;
  setCurrentDraggable: (card: CurrentDraggableType) => void;
  setCurrentHighlighted: (highlighted: CurrentHighlightedType) => void;
  dragState: DragStateType;
  updateDraggableState: (state: DragStateType) => void;
};

export const DraggableContext = createContext<ContextType>({
  currentDraggable: null,
  currentHighlighted: null,
  setCurrentDraggable: () => {},
  setCurrentHighlighted: () => {},
  dragState: null,
  updateDraggableState: () => {},
});

type StatusWrapperProps = {
  children: ReactNode;
};

export default function StatusWrapper(props: StatusWrapperProps) {
  const { children } = props;

  const [currentDraggable, setCurrentDraggable] = useState<CurrentDraggableType>(null);
  const [currentHighlighted, setCurrentHighlighted] = useState<CurrentHighlightedType>(null);
  const [dragState, setDragState] = useState<DragStateType>(null);

  /**
   * Update drag state
   */
  const updateDraggableState = (state: DragStateType) => {
    if (!isNil(currentDraggable)) {
      setCurrentDraggable(null);
    }

    if (!isNil(currentHighlighted)) {
      setCurrentHighlighted(null);
    }

    setDragState(state);
  };

  const draggableState = {
    currentDraggable,
    currentHighlighted,
    dragState,
    setCurrentDraggable,
    setCurrentHighlighted,
    updateDraggableState,
  };

  return (
    <DraggableContext.Provider value={draggableState}>
      <div className={styles.container} id="board-statusWrapper">
        {children}
      </div>
    </DraggableContext.Provider>
  );
}
