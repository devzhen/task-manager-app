'use server';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';
import type { BoardType } from '@/app/types';

// Fetch available boards
const fetchBoards = async (): Promise<BoardType[]> => {
  let boards: BoardType[] = [];

  try {
    const url = new URL(`${API_HOST}/api/board/list`);
    const response = await fetch(url.toString(), { next: { tags: [NEXT_REVALIDATE_TAGS.boards] } });
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
