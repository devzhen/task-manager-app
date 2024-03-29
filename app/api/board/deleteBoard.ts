'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';

/**
 * Delete card
 */
const deleteBoard = async (id: string) => {
  try {
    const url = new URL(`${API_HOST}/api/board/delete`);
    const res = await fetch(url.toString(), {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: {
        Cookie: cookies().toString(),
      },
    });

    const json = await res.json();
    if (json && 'error' in json && 'message' in json) {
      throw new Error(json.message);
    }
    revalidateTag(NEXT_REVALIDATE_TAGS.boards);

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('deleteBoard error - ', err);

    throw err;
  }
};

export default deleteBoard;
