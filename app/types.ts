import { STATUSES } from './constants';

export type BoardType = {
  id: string;
  name: string;
  createdAt: string;
  protected: boolean;
  statuses: StatusType[];
  tags: TagType[];
};

export type StatusType = {
  id: string;
  name: keyof typeof STATUSES;
  createdAt: string;
  position: number;
};

export type TagType = {
  id: string;
  name: string;
  color: string;
  fontColor: string;
  cardId: string;
};

export type CardType = {
  id: string;
  title: string;
  description?: string;
  status: StatusType;
  attachments: AttachmentType[];
  position: number;
  tags: TagType[];
  statusId: string;
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
    status: StatusType;
    index: number;
  };
  currentDroppable: {
    status: StatusType;
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
  status: StatusType;
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

export type FormAttachment = File & {
  id: string;
  url: string;
  position: number;
  willBeRemoved?: boolean;
};
export type AddCardFormInputs = {
  title: string;
  description: string;
  status: StatusType;
  tags: (TagType & { label: string })[];
  attachments: FormAttachment[];
};
