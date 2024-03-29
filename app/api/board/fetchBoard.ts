'use server';

import { cookies } from 'next/headers';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';
import type { BoardType } from '@/app/types';

// Fetch board
const fetchBoards = async (boardId: string): Promise<BoardType> => {
  try {
    const url = new URL(`${API_HOST}/api/board/show?boardId=${boardId}`);
    const response = await fetch(url.toString(), {
      next: { tags: [NEXT_REVALIDATE_TAGS.board] },
      headers: {
        Cookie: cookies().toString(),
      },
    });
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

export default fetchBoards;
