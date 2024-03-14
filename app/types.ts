import { STATUSES_OBJ, STATUSES } from './constants';

export type BoardType = {
  id: string;
  name: string;
  created: string;
  protected: boolean;
};

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
  status: {
    id: string;
    name: keyof typeof STATUSES;
    createdAt: string;
    boardId: string;
  };
  attachments: AttachmentType[];
  position: number;
  tags: TagType[];
  willBeRemoved?: boolean;
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
  status: keyof typeof STATUSES_OBJ;
};

export type AttachmentType = {
  id: string;
  name: string;
  url: string;
  cardId: string;
  created: string;
};

export type UpdateCardBodyType = {
  id: string;
  fields: FilteredKeysArray[];
  values: (string | number)[];
};

// Update cards multiple body
export type NonEmptyArray<T> = [T, ...T[]];
type CardTypeOmitted = Omit<CardType, 'id' | 'attachments' | 'tags' | 'willBeRemoved'>;
export type FilteredKeysArray = keyof CardTypeOmitted;
export type FilteredValues = {
  [K in keyof CardTypeOmitted]?: string | number;
};
export type UpdateCardMultipleBodyType = {
  ids: NonEmptyArray<string>;
  fields: FilteredKeysArray[];
  values: FilteredValues[];
};
