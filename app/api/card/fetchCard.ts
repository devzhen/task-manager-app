'use server';

import { cookies } from 'next/headers';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';
import type { CardType } from '@/app/types';

/**
 * Fetch card
 */
const fetchCard = async (cardIdId: string): Promise<CardType> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set('card', cardIdId);
    const url = new URL(`${API_HOST}/api/card/show?${searchParams.toString()}`);

    const res = await fetch(url.toString(), {
      next: { tags: [NEXT_REVALIDATE_TAGS.card] },
      headers: {
        Cookie: cookies().toString(),
      },
    });

    const json = await res.json();
    if (json && 'error' in json && 'message' in json) {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('fetchCard error - ', err);

    throw err;
  }
};

export default fetchCard;
