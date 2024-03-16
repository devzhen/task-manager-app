export const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

export const NEXT_REVALIDATE_TAGS = {
  cards: 'cards',
  boards: 'boards',
  board: 'board',
};

export const ROUTES = {
  addBoard: '/boards/add',
  editBoard: '/boards/edit',
};

export const BOARD_NAME_MIN_LENGTH = 3;

export const STATUSES = {
  backlog: 'backlog',
  inProgress: 'inProgress',
  inReview: 'inReview',
  completed: 'completed',
} as const;

export const STATUSES_OBJ = {
  [STATUSES.backlog]: {
    value: STATUSES.backlog,
    name: 'Backlog',
    color: '#191b1f',
  },
  [STATUSES.inProgress]: {
    value: STATUSES.inProgress,
    name: 'In Progress',
    color: '#eccf60',
  },
  [STATUSES.inReview]: {
    value: STATUSES.inReview,
    name: 'In Review',
    color: '#ad89ed',
  },
  [STATUSES.completed]: {
    value: STATUSES.completed,
    name: 'Completed',
    color: '#8fd68f',
  },
} as const;

export const FAKE_CARD_ID = 'fake-card-id';

export const TAGS = {
  technical: {
    name: 'Technical',
    color: '#dfe5f8',
    fontColor: '#6881c9',
  },
  frontEnd: {
    name: 'Front end',
    color: '#e6fce9',
    fontColor: '#00b300',
  },
  concept: {
    name: 'Concept',
    color: '#ff9999',
    fontColor: '#ff1919',
  },
  design: {
    name: 'Design',
    color: '#ffdc73',
    fontColor: '#a67c00',
  },
};

export const TASK_TITLE_MIN_LENGTH = 3;
export const TASK_ATTACHMENT_MAX_SIZE = 4500000;
