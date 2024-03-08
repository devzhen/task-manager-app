import { BOARDS, STATUSES } from './constants';

export type BoardType = (typeof BOARDS)[keyof typeof BOARDS];

export type CardType = {
  id: string;
  name: string;
  status: keyof typeof STATUSES;
  order: number;
};

export type StatusesCardType = {
  [STATUSES.backlog.value]: CardType[];
  [STATUSES.inProgress.value]: CardType[];
  [STATUSES.inReview.value]: CardType[];
  [STATUSES.completed.value]: CardType[];
};

export type StateType = {
  isInitialized: boolean;
  currentDraggable: {
    id: string;
    status: keyof typeof STATUSES;
    index: number;
  };
  currentDroppable: {
    status: keyof typeof STATUSES;
  };
  hoveredCard: {
    id: string;
    position: 'top' | 'bottom';
    index: number;
  };
};
