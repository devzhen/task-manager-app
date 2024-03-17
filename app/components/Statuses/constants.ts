import type { StatusesStateType } from './types';

export const initialState: StatusesStateType = {
  isInitialized: false,
  currentDraggable: {
    id: '',
    status: {
      id: '',
      name: '',
    },
    index: 0,
  },
  currentDroppable: {
    status: {
      id: '',
      name: '',
    },
  },
  hoveredCard: {
    insertBeforeId: '',
    insertBeforeIndex: 0,
  },
};
