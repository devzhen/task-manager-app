import { v4 as uuid } from 'uuid';

const firstBoardUUID = uuid();
const secondBoardUUID = uuid();
const thirdBoardUUID = uuid();

export const BOARDS = {
  [firstBoardUUID]: {
    id: firstBoardUUID,
    name: 'Home board',
  },
  [secondBoardUUID]: {
    id: secondBoardUUID,
    name: 'Design board',
  },
  [thirdBoardUUID]: {
    id: thirdBoardUUID,
    name: 'Learning board',
  },
} as const;
