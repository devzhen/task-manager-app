import { v4 as uuid } from 'uuid';

import { STATUSES, STATUSES_OBJ } from '@/app/constants';

export const initialFormValues = {
  name: '',
  statuses: [
    {
      id: uuid(),
      name: STATUSES.backlog,
      position: 1,
      color: STATUSES_OBJ[STATUSES.backlog].color,
      isNew: false,
    },
    {
      id: uuid(),
      name: STATUSES.inReview,
      position: 2,
      color: STATUSES_OBJ[STATUSES.inReview].color,
      isNew: false,
    },
    {
      id: uuid(),
      name: STATUSES.inProgress,
      position: 3,
      color: STATUSES_OBJ[STATUSES.inProgress].color,
      isNew: false,
    },
    {
      id: uuid(),
      name: STATUSES.completed,
      position: 4,
      color: STATUSES_OBJ[STATUSES.completed].color,
      isNew: false,
    },
  ],
  tags: [
    {
      id: uuid(),
      name: 'Front end',
      color: '#e6fce9',
      fontColor: '#00b300',
      isNew: false,
    },
    {
      id: uuid(),
      name: 'Design',
      color: '#ffdc73',
      fontColor: '#a67c00',
      isNew: false,
    },
    {
      id: uuid(),
      name: 'Technical',
      color: '#dfe5f8',
      fontColor: '#6881c9',
      isNew: false,
    },
    {
      id: uuid(),
      name: 'Concept',
      color: '#ff9999',
      fontColor: '#ff1919',
      isNew: false,
    },
  ],
};
