import type json from '../dictionaries/en.json';

export type DictionaryType = typeof json;

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
  willBeRemoved?: boolean;
};

export type AttachmentType = {
  id: string;
  name: string;
  url: string;
  cardId: string;
  created: string;
  position: number;
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
