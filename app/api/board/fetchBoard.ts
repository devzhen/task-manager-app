'use server';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';
import type { BoardType } from '@/app/types';

// Fetch board
const fetchBoards = async (boardId: string): Promise<BoardType> => {
  let board = {} as BoardType;

  try {
    const url = new URL(`${API_HOST}/api/board/show?boardId=${boardId}`);
    const response = await fetch(url.toString(), { next: { tags: [NEXT_REVALIDATE_TAGS.board] } });
    board = await response.json();

    if ('error' in board) {
      // eslint-disable-next-line no-console
      console.log('Fetch board error - ', board.error);
      board = {} as BoardType;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Fetch boards error - ', err);
  } finally {
    return board;
  }
};

export default fetchBoards;
