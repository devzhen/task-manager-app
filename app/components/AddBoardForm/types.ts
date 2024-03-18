export type AddBoardFormInputs = {
  boardId: string | null;
  name: string;
  tags: {
    id: string;
    name: string;
    color: string | undefined;
    fontColor: string | undefined;
    isNew: boolean;
  }[];
  statuses: {
    id: string;
    name: string;
    color: string | undefined;
    position: number;
    isNew: boolean;
  }[];
  deletedStatuses: { id: string }[];
  deletedTags: { id: string }[];
};
