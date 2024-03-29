'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

    if ('success' in json && 'token' in json) {
      cookies().set({
        name: 'token',
        value: json.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return redirect('/');
    }

    return json;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('logIn error - ', err);

    throw err;
  }
};

export default logIn;
