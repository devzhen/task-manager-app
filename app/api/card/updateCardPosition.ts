'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';
import type { UpdateCardPositionBodyType } from '@/app/types';

/**
 * Add card
 */
const updateCardPosition = async (data: UpdateCardPositionBodyType) => {
  try {
    // Make fetch request
    const url = new URL(`${API_HOST}/api/card/update-position`);
    const res = await fetch(url.toString(), {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        Cookie: cookies().toString(),
      },
    });

    const json = await res.json();
    if (json && 'error' in json && 'message' in json) {
      throw new Error(json.message);
    }
    revalidateTag(NEXT_REVALIDATE_TAGS.cards);
    revalidateTag(NEXT_REVALIDATE_TAGS.card);
    revalidateTag(NEXT_REVALIDATE_TAGS.boardMeta);

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('updateCardPosition error - ', err);

    throw err;
  }
};

export default updateCardPosition;
