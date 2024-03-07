import { BOARDS, STATUSES } from './constants';

export type BoardType = (typeof BOARDS)[keyof typeof BOARDS];

export type CardType = {
  id: string;
  name: string;
  status: keyof typeof STATUSES;
  order: number;
};

export type StatusesCardType = {
  [STATUSES.backlog.value]: CardType[];
  [STATUSES.inProgress.value]: CardType[];
  [STATUSES.inReview.value]: CardType[];
  [STATUSES.completed.value]: CardType[];
};
