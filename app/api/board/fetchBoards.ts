'use server';

import { revalidateTag } from 'next/cache';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';
import type { BoardType } from '@/app/types';

type FetchBoardsArguments = {
  revalidateAllTags?: boolean;
};

// Fetch available boards
const fetchBoards = async (options: FetchBoardsArguments = {}): Promise<BoardType[]> => {
  const { revalidateAllTags } = options;

  // Revalidation
  if (revalidateAllTags) {
    for (const tag of Object.values(NEXT_REVALIDATE_TAGS)) {
      revalidateTag(tag);
    }
  }

  try {
    const url = new URL(`${API_HOST}/api/board/list`);
    const response = await fetch(url.toString(), { next: { tags: [NEXT_REVALIDATE_TAGS.boards] } });
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
