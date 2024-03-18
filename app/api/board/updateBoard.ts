'use server';

import { revalidateTag } from 'next/cache';

import type { AddBoardFormInputs } from '@/app/components/AddBoardForm/types';
import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';

/**
 * Add card
 */
const updateBoard = async (data: AddBoardFormInputs) => {
  try {
    const url = new URL(`${API_HOST}/api/board/update`);
    const res = await fetch(url.toString(), {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (json && 'error' in json && 'message' in json) {
      throw new Error(json.message);
    }
    revalidateTag(NEXT_REVALIDATE_TAGS.boards);
    revalidateTag(NEXT_REVALIDATE_TAGS.board);
    revalidateTag(NEXT_REVALIDATE_TAGS.cards);
    revalidateTag(NEXT_REVALIDATE_TAGS.cards);

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('updateBoard error - ', err);

    throw err;
  }
};

export default updateBoard;
