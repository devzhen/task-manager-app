'use server';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';
import type { StatusesCardType } from '@/app/types';

/**
 * Fetch cards
 */
const fetchCards = async (
  boardId: string,
): Promise<{
  cards: StatusesCardType;
  total: number;
} | null> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set('board', boardId);
    const url = new URL(`${API_HOST}/api/card/list?${searchParams.toString()}`);

    const res = await fetch(url.toString(), { next: { tags: [NEXT_REVALIDATE_TAGS.cards] } });

    const json = await res.json();
    if ('error' in json) {
      throw json.error;
    }

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('fetchCards error - ', err);

    return null;
  }
};

export default fetchCards;
