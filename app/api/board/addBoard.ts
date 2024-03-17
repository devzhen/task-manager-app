'use server';

import { revalidateTag } from 'next/cache';

import type { AddBoardFormInputs } from '@/app/components/AddBoardForm/types';
import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';

/**
 * Add card
 */
const addBoard = async (data: AddBoardFormInputs) => {
  try {
    const url = new URL(`${API_HOST}/api/board/add`);
    const res = await fetch(url.toString(), {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (json && 'error' in json && 'message' in json) {
      throw new Error(json.message);
    }
    revalidateTag(NEXT_REVALIDATE_TAGS.boards);

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('addBoard error - ', err);

    throw err;
  }
};

export default addBoard;
