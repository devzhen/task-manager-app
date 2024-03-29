'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { API_HOST, ROUTES } from '@/app/constants';

const logOut = async () => {
  try {
    const url = new URL(`${API_HOST}/api/auth/logout`);
    const res = await fetch(url.toString(), {
      method: 'POST',
    });

    const json = await res.json();

    if ('success' in json) {
      cookies().delete('token');

      return redirect(ROUTES.login);
    }

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('logOut error - ', err);

    throw err;
  }
};

export default logOut;
