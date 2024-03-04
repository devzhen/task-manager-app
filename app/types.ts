import { BOARDS } from './constants';

export type BoardType = (typeof BOARDS)[keyof typeof BOARDS];
