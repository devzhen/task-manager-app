import { API_HOST } from '@/app/constants';
import type { BoardType } from '@/app/types';

// Fetch available boards
const fetchBoards = async (): Promise<BoardType[]> => {
  'use server';

  let boards: BoardType[] = [];

  try {
    const url = new URL(`${API_HOST}/api/board/list`);
    const response = await fetch(url.toString(), { cache: 'no-store' });
    boards = await response.json();

    if ('error' in boards) {
      // eslint-disable-next-line no-console
      console.log('Fetch boards error - ', boards.error);
      boards = [];
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Fetch boards error - ', err);
  } finally {
    return boards;
  }
};

export default fetchBoards;
