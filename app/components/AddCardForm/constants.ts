import type { BoardType } from '@/app/types';

export const createInitialFormValues = (board: BoardType) => {
  const status = board.statuses[0];

  return {
    title: '',
    description: '',
    status: { ...status, label: status.name, value: status.id },
    tags: [],
    attachments: [],
  };
};
