import { IncomingMessage } from 'http';
import { NextResponse } from 'next/server';
import absoluteUrl from 'next-absolute-url';

export function middleware(request: Request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', absoluteUrl(request as unknown as IncomingMessage).origin);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
