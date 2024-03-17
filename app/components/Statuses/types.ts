export type StatusesStateType = {
  isInitialized: boolean;
  currentDraggable: {
    id: string;
    status: {
      id: string;
      name: string;
    };
    index: number;
  };
  currentDroppable: {
    status: {
      id: string;
      name: string;
    };
  };
  hoveredCard: {
    insertBeforeId: string;
    insertBeforeIndex: number;
  };
};

export type CardLayoutType = {
  id: string;
  top: number;
  middle: number;
  bottom: number;
  index: number;
  status: StatusesStateType['currentDraggable']['status'];
};
