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

// TODO: remove
export const tempCards = {
  [STATUSES.backlog]: [
    {
      id: 'id-1',
      name: 'Backlog 1',
      status: STATUSES.backlog,
      order: 1,
    },
    {
      id: 'id-2',
      name: 'Backlog 2',
      status: STATUSES.backlog,
      order: 2,
    },
    {
      id: 'id-3',
      name: 'Backlog 3',
      status: STATUSES.backlog,
      order: 3,
    },
    {
      id: 'id-4',
      name: 'Backlog 4',
      status: STATUSES.backlog,
      order: 4,
    },
    {
      id: 'id-5',
      name: 'Backlog 5',
      status: STATUSES.backlog,
      order: 5,
    },
    {
      id: 'id-6',
      name: 'Backlog 6',
      status: STATUSES.backlog,
      order: 6,
    },
  ],
  [STATUSES.inProgress]: [
    {
      id: 'id-11',
      name: 'In Progress 11',
      status: STATUSES.inProgress,
      order: 1,
    },
    {
      id: 'id-22',
      name: 'In Progress 22',
      status: STATUSES.inProgress,
      order: 2,
    },
    {
      id: 'id-33',
      name: 'In Progress 33',
      status: STATUSES.inProgress,
      order: 3,
    },
    {
      id: 'id-44',
      name: 'In Progress 44',
      status: STATUSES.inProgress,
      order: 4,
    },
    {
      id: 'id-55',
      name: 'In Progress 55',
      status: STATUSES.inProgress,
      order: 5,
    },
    {
      id: 'id-66',
      name: 'In Progress 66',
      status: STATUSES.inProgress,
      order: 6,
    },
  ],
  [STATUSES.inReview]: [
    {
      id: 'id-111',
      name: 'In Review 111',
      status: STATUSES.inReview,
      order: 1,
    },
    {
      id: 'id-222',
      name: 'In Review 222',
      status: STATUSES.inReview,
      order: 2,
    },
    {
      id: 'id-333',
      name: 'In Review 333',
      status: STATUSES.inReview,
      order: 3,
    },
    {
      id: 'id-444',
      name: 'In Review 444',
      status: STATUSES.inReview,
      order: 4,
    },
    {
      id: 'id-555',
      name: 'In Review 555',
      status: STATUSES.inReview,
      order: 5,
    },
    {
      id: 'id-666',
      name: 'In Review 666',
      status: STATUSES.inReview,
      order: 6,
    },
  ],
  [STATUSES.completed]: [
    {
      id: 'id-1111',
      name: 'Completed 1111',
      status: STATUSES.completed,
      order: 1,
    },
    {
      id: 'id-2222',
      name: 'Completed 2222',
      status: STATUSES.completed,
      order: 2,
    },
    {
      id: 'id-3333',
      name: 'Completed 3333',
      status: STATUSES.completed,
      order: 3,
    },
    {
      id: 'id-4444',
      name: 'Completed 4444',
      status: STATUSES.completed,
      order: 4,
    },
    {
      id: 'id-5555',
      name: 'Completed 5555',
      status: STATUSES.completed,
      order: 5,
    },
    {
      id: 'id-6666',
      name: 'Completed 6666',
      status: STATUSES.completed,
      order: 6,
    },
  ],
};
