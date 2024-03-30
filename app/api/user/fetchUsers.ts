'use server';

import { cookies } from 'next/headers';

import { API_HOST } from '@/app/constants';

const fetchUsers = async () => {
  try {
    const url = new URL(`${API_HOST}/api/user/list`);
    const res = await fetch(url.toString(), {
      headers: {
        Cookie: cookies().toString(),
      },
    });

    const json = await res.json();

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('fetchUsers error - ', err);

    throw err;
  }
};

export default fetchUsers;
