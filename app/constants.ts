import { v4 as uuid } from 'uuid';

const firstBoardUUID = uuid();
const secondBoardUUID = uuid();
const thirdBoardUUID = uuid();

export const BOARDS = {
  [firstBoardUUID]: {
    id: firstBoardUUID,
    name: 'Home board',
    href: '/',
    created: '',
  },
  [secondBoardUUID]: {
    id: secondBoardUUID,
    name: 'Design board',
    href: '/',
    created: '',
  },
  [thirdBoardUUID]: {
    id: thirdBoardUUID,
    name: 'Learning board',
    href: '/',
    created: '',
  },
} as const;

export const BOARD_NAME_MIN_LENGTH = 3;

export const STATUSES = {
  backlog: {
    value: 'backlog',
    name: 'Backlog',
    color: '#191b1f',
  },
  inProgress: {
    value: 'inProgress',
    name: 'In Progress',
    color: '#eccf60',
  },
  inReview: {
    value: 'inReview',
    name: 'In Review',
    color: '#ad89ed',
  },
  completed: {
    value: 'completed',
    name: 'Completed',
    color: '#8fd68f',
  },
} as const;
