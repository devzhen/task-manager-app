'use server';

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { isNil } from 'ramda';

import type { UserType } from '../types';

const getUserFromCookieToken = (): UserType | null => {
  let decodedUser = null;

  const token = cookies().get('token')?.value;

  if (isNil(token)) {
    return decodedUser;
  }

  jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err, decoded) => {
    if (err) {
      decodedUser = null;
    }

    decodedUser = decoded;
  });

  return decodedUser;
};

export default getUserFromCookieToken;
