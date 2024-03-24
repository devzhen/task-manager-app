import type { DraggableState } from './types';

export const initialDraggableState: DraggableState = {
  initialized: false,
  draggable: {
    cardId: null,
    index: null,
    statusId: null,
    card: null,
  },
  highlighted: {
    cardId: null,
    index: null,
    statusId: null,
  },
};
