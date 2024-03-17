export type AddBoardFormInputs = {
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
    isNew: boolean;
  }[];
};
