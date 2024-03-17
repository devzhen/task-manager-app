'use server';

import { revalidateTag } from 'next/cache';

import { API_HOST, NEXT_REVALIDATE_TAGS } from '@/app/constants';

/**
 * Add card
 */
const addCard = async (formData: FormData) => {
  try {
    const url = new URL(`${API_HOST}/api/card/add`);
    const res = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    if ('error' in json) {
      throw json.error;
    }

    revalidateTag(NEXT_REVALIDATE_TAGS.cards);

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('addCard error - ', err);

    throw err;
  }
};

export default addCard;
