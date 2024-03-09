import { BOARDS, STATUSES_OBJ, STATUSES } from './constants';

export type BoardType = (typeof BOARDS)[keyof typeof BOARDS];

export type TagType = {
  id: string;
  name: string;
  color: string;
  fontcolor: string;
  cardid: string;
};

export type CardType = {
  id: string;
  title: string;
  description?: string;
  status: keyof typeof STATUSES;
  position: number;
  tags: TagType[];
};

export type StatusesCardType = {
  [STATUSES.backlog]: CardType[];
  [STATUSES.inProgress]: CardType[];
  [STATUSES.inReview]: CardType[];
  [STATUSES.completed]: CardType[];
};

export type StateType = {
  isInitialized: boolean;
  currentDraggable: {
    id: string;
    status: keyof typeof STATUSES_OBJ;
    index: number;
  };
  currentDroppable: {
    status: keyof typeof STATUSES_OBJ;
  };
  hoveredCard: {
    id: string;
    index: number;
  };
};

export type CardLayoutType = {
  id: string;
  top: number;
  middle: number;
  bottom: number;
  index: number;
  status: keyof typeof STATUSES_OBJ;
};
