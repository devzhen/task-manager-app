'use server';

import { cookies } from 'next/headers';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';
import type { ApiResponseType, BoardCardsByStatusResponseType } from '@/app/types';

/**
 * Fetch cards
 */
const fetchCards = async (boardId: string): Promise<BoardCardsByStatusResponseType> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set('board', boardId);
    const url = new URL(`${API_HOST}/api/card/list?${searchParams.toString()}`);

    const res = await fetch(url.toString(), {
      next: { tags: [NEXT_REVALIDATE_TAGS.cards] },
      headers: {
        Cookie: cookies().toString(),
      },
    });

    const json: ApiResponseType<BoardCardsByStatusResponseType> = await res.json();

    if (!json) {
      throw new Error(`The response is - ${json}`);
    }

    if ('error' in json && 'message' in json) {
      throw new Error(json.message as string);
    }

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('fetchCards error - ', err);

    throw err;
  }
};

export default fetchCards;
