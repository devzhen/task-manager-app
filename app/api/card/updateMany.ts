'use server';

import { revalidateTag } from 'next/cache';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';
import type { UpdateCardMultipleBodyType } from '@/app/types';

/**
 * Add card
 */
const updateMany = async (data: UpdateCardMultipleBodyType) => {
  try {
    // Make fetch request
    const url = new URL(`${API_HOST}/api/card/update-many`);
    const res = await fetch(url.toString(), {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (json && 'error' in json && 'message' in json) {
      throw new Error(json.message);
    }
    revalidateTag(NEXT_REVALIDATE_TAGS.board);
    revalidateTag(NEXT_REVALIDATE_TAGS.boards);
    revalidateTag(NEXT_REVALIDATE_TAGS.cards);
    revalidateTag(NEXT_REVALIDATE_TAGS.card);
    revalidateTag(NEXT_REVALIDATE_TAGS.boardMeta);

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('updateMany error - ', err);

    throw err;
  }
};

export default updateMany;
