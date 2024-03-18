'use server';

import { API_HOST } from '@/app/constants';
import type { BoardMetaType } from '@/app/types';

// Fetch  board's meta
const fetchBoardMeta = async (boardId: string): Promise<BoardMetaType> => {
  try {
    const url = new URL(`${API_HOST}/api/board/meta?boardId=${boardId}`);
    const response = await fetch(url.toString());
    const json = await response.json();

    if (json && 'error' in json && 'message' in json) {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Fetch boards error - ', err);

    throw err;
  }
};

export default fetchBoardMeta;
