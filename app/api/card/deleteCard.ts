'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';

/**
 * Delete card
 */
const deleteCard = async ({ boardId, cardId }: { boardId: string; cardId: string }) => {
  try {
    const url = new URL(`${API_HOST}/api/card/delete`);
    const res = await fetch(url.toString(), {
      method: 'DELETE',
      body: JSON.stringify({
        cardId,
        boardId,
      }),
      headers: {
        Cookie: cookies().toString(),
      },
    });

    const json = await res.json();
    if (json && 'error' in json && 'message' in json) {
      throw new Error(json.message);
    }

    revalidateTag(NEXT_REVALIDATE_TAGS.cards);

    // return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('deleteCard error - ', err);

    throw err;
  }
};

export default deleteCard;
