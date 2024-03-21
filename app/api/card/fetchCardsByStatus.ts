'use server';

import { API_HOST, NEXT_REVALIDATE_TAGS, PAGINATION } from '@/app/constants';
import type { ApiResponseType, CardsByStatusReturnType } from '@/app/types';

/**
 * Fetch cards by a status
 */
const fetchCardsByStatus = async ({
  boardId,
  statusId,
  page,
  perPage = PAGINATION.perPage,
}: {
  boardId: string;
  statusId: string;
  page: number;
  perPage?: number;
}): Promise<CardsByStatusReturnType> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set('boardId', boardId);
    searchParams.set('statusId', statusId);
    searchParams.set('page', `${page}`);
    if (perPage) {
      searchParams.set('perPage', `${perPage}`);
    }
    const url = new URL(`${API_HOST}/api/list-by-status/?${searchParams.toString()}`);

    const res = await fetch(url.toString(), { next: { tags: [NEXT_REVALIDATE_TAGS.cards] } });

    const json: ApiResponseType<CardsByStatusReturnType> = await res.json();

    if (!json) {
      throw new Error(`The response is - ${json}`);
    }

    if ('error' in json && 'message' in json) {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('fetchCardsByStatus error - ', err);

    throw err;
  }
};

export default fetchCardsByStatus;
