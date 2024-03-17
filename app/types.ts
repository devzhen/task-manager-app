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
  name: string;
  color: string;
  createdAt: Date;
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
