'use server';

import { cookies } from 'next/headers';

import { API_HOST } from '@/app/constants';

const getUser = async () => {
  try {
    const url = new URL(`${API_HOST}/api/user/show`);
    const res = await fetch(url.toString(), {
      headers: {
        Cookie: cookies().toString(),
      },
    });

    const json = await res.json();

    return json?.user;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('getUser error - ', err);

    throw err;
  }
};

export default getUser;
