'use server';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';
import type { CardType } from '@/app/types';

/**
 * Fetch cards
 */
const fetchCards = async (
  boardId: string,
): Promise<{
  cards: Record<string, CardType[]>;
  total: number;
} | null> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set('board', boardId);
    const url = new URL(`${API_HOST}/api/card/list?${searchParams.toString()}`);

    const res = await fetch(url.toString(), { next: { tags: [NEXT_REVALIDATE_TAGS.cards] } });

    const json = await res.json();
    if (json && 'error' in json && 'message' in json) {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('fetchCards error - ', err);

    throw err;
  }
};

export default fetchCards;
