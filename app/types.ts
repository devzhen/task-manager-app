import type json from '../dictionaries/en';

export type DictionaryType = typeof json;

export type LoginInputs = {
  email: string;
  password: string;
};

export type BoardType = {
  id: string;
  name: string;
  createdAt: string;
  protected: boolean;
  statuses: StatusType[];
  tags: TagLinkerType[];
};

export type StatusType = {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  position: number;
};

export type TagLinkerType = {
  id: string;
  name: string;
  color: string;
  fontColor: string;
  cardId: string;
  tagId: string;
  tag?: {
    id: string;
    name: string;
    color: string;
    fontColor: string;
  };
};

export type CardType = {
  id: string;
  title: string;
  description?: string;
  status: StatusType;
  attachments: AttachmentType[];
  position: number;
  tags: TagLinkerType[];
  statusId: string;
  inserted?: boolean;
};

export type CardStatusHistoryType = {
  id: string;
  cardId: string;
  cardTitle: string;
  statusId: string;
  moveDate: string;
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
  position: number;
};

export type UpdateCardPositionBodyType = {
  newStatusId: string;
  cardId: string;
  insertBeforeCardId: string | null;
};

// Update cards multiple body
export type NonEmptyArray<T> = [T, ...T[]];
type CardTypeOmitted = Omit<CardType, 'id' | 'attachments' | 'tags' | 'willBeRemoved'>;
export type FilteredKeysArray = keyof CardTypeOmitted;
export type FilteredValues = {
  [K in keyof CardTypeOmitted]?: string | number;
};
export type UpdateCardMultipleBodyType = {
  ids: string[];
  fields: FilteredKeysArray[];
  values: FilteredValues[];
};

export type FormAttachment = File & {
  id: string;
  url: string;
  position: number;
  willBeRemoved: boolean;
  fromDB: boolean;
};

export type BoardMetaType = BoardType & {
  count: {
    cards: number;
    tags: number;
    statuses: number;
  };
  statuses: Record<string, number>;
};

export type CardsByStatusReturnType = StatusData & {
  boardId: string;
  statusId: string;
  perPage: number;
};

export type ApiResponseType<expectedT> =
  | expectedT
  | null
  | { error: { name: string }; message: string };

export type StatusData = {
  cards: CardType[];
  total: number;
  hasMore: boolean;
  page: number;
};

export type BoardCardsByStatusResponseType = {
  total: number;
  cardsPerStatus: number;
  boardId: string;
  statuses: Record<string, StatusData>;
};
