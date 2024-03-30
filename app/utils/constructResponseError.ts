'use server';

import type { HttpError } from 'http-errors';
import { NextResponse } from 'next/server';

const constructResponseError = (error: unknown) => {
  return NextResponse.json(
    {
      error: (error as HttpError).message,
      status: (error as HttpError).statusCode || 500,
    },
    { status: (error as HttpError).statusCode || 500 },
  );
};

export default constructResponseError;
