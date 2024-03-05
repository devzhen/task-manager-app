import { v4 as uuid } from 'uuid';

const firstBoardUUID = uuid();
const secondBoardUUID = uuid();
const thirdBoardUUID = uuid();

export const BOARDS = {
  [firstBoardUUID]: {
    id: firstBoardUUID,
    name: 'Home board',
    href: '/',
  },
  [secondBoardUUID]: {
    id: secondBoardUUID,
    name: 'Design board',
    href: '/',
  },
  [thirdBoardUUID]: {
    id: thirdBoardUUID,
    name: 'Learning board',
    href: '/',
  },
} as const;

export const BOARD_NAME_MIN_LENGTH = 3;
