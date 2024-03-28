'use server';

import { API_HOST } from '@/app/constants';
import type { LoginInputs } from '@/app/types';

const logIn = async (inputs: LoginInputs) => {
  try {
    const url = new URL(`${API_HOST}/api/auth/login`);
    const res = await fetch(url.toString(), {
      method: 'POST',
      body: JSON.stringify(inputs),
    });

    const json = await res.json();

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('addBoard error - ', err);

    throw err;
  }
};

export default logIn;
