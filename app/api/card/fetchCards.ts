import { API_HOST } from '@/app/constants';

/**
 * Fetch cards
 */
const fetchCards = async (boardId: string) => {
  'use server';

  try {
    const searchParams = new URLSearchParams();
    searchParams.set('board', boardId);
    const url = new URL(`${API_HOST}/api/card/list?${searchParams.toString()}`);

    const res = await fetch(url.toString());

    const json = await res.json();
    if ('error' in json) {
      throw json.error;
    }

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('fetchCards error - ', err);

    return undefined;
  }
};

export default fetchCards;
