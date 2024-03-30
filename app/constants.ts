export const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

export const NEXT_REVALIDATE_TAGS = {
  card: 'card',
  cards: 'cards',
  boards: 'boards',
  board: 'board',
  boardMeta: 'boardMeta',
};

export const LOCALE = {
  enUS: 'en-US',
  frFr: 'fr-FR',
};

export const DEFAULT_LOCALE = LOCALE.enUS;

export const PROTECTED_API_ROUTES = ['/board', '/card', '/tag', 'attachment'];

export const ROUTES = {
  addBoard: '/boards/add',
  editBoard: '/boards/edit/[boardId]',
  showBoard: '/boards/[boardId]',
  addCard: '/cards/[boardId]/add',
  showCard: '/cards/[boardId]/show/[cardId]',
  login: '/auth/login',
  users: '/users',
  WITH_AUTHENTICATION: ['/boards', '/cards'],
  WITHOUT_AUTHENTICATION: ['/auth'],
};

export const PAGINATION = {
  perPage: 10,
};

export const USER_ROLE = {
  admin: 'admin',
  member: 'member',
};

export const VALIDATION = {
  auth: {
    minPasswordLength: 8,
  },
  card: {
    titleMinLength: 3,
    attachmentMaxSize: 4500000,
  },
};

export const BOARD_NAME_MIN_LENGTH = 3;

export const STATUSES = {
  backlog: 'Backlog',
  inProgress: 'In Progress',
  inReview: 'In Review',
  completed: 'Completed',
} as const;

export const CUSTOM_DRAG_EVENT = {
  dragStart: 'dragStart',
  dragEnd: 'dragEnd',
};

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
    color: '#1810ec40',
    fontColor: '#6881c9',
  },
  frontEnd: {
    name: 'Front end',
    color: '#0bf12b33',
    fontColor: '#00b300',
  },
  concept: {
    name: 'Concept',
    color: '#f5160936',
    fontColor: '#ff1919',
  },
  design: {
    name: 'Design',
    color: '#f8e71c61',
    fontColor: '#ebb20cff',
  },
};
