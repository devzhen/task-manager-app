'use server';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';
import type { StatusesCardType } from '@/app/types';

/**
 * Fetch card
 */
const fetchCard = async (
  cardIdId: string,
): Promise<{
  cards: StatusesCardType;
  total: number;
} | null> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set('card', cardIdId);
    const url = new URL(`${API_HOST}/api/card/show?${searchParams.toString()}`);

    const res = await fetch(url.toString(), { next: { tags: [NEXT_REVALIDATE_TAGS.cards] } });

    const json = await res.json();
    if ('error' in json) {
      throw json.error;
    }

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('fetchCard error - ', err);

    return null;
  }
};

export default fetchCard;
