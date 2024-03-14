import { API_HOST } from '@/app/constants';
import type { BoardType } from '@/app/types';

// Fetch available boards
const fetchBoards = async (boardId: string): Promise<BoardType> => {
  'use server';

  let board = {} as BoardType;

  try {
    const url = new URL(`${API_HOST}/api/board/show?boardId=${boardId}`);
    const response = await fetch(url.toString());
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
