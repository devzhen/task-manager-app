import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { LOCALE, DEFAULT_LOCALE, ROUTES, PROTECTED_API_ROUTES } from './app/constants';

function getLocale(request: NextRequest) {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const languages = new Negotiator({ headers }).languages();

  return match(languages, Object.values(LOCALE), DEFAULT_LOCALE);
}

export function middleware(request: NextRequest) {
  let locale = '';
  let shouldRedirect = false;

  const { pathname } = request.nextUrl;

  // Auth token
  const token = request.cookies.get('token')?.value || '';

  // Api routes
  if (pathname.startsWith('/api')) {
    for (const route of PROTECTED_API_ROUTES) {
      if (pathname.indexOf(route) !== -1 && !token) {
        request.nextUrl.pathname = ROUTES.login;

        return Response.json(
          { success: false, error: 'Authentication Failed', statusCode: 401 },
          { status: 401 },
        );
      }
    }
  }

  // Not api routes
  if (!pathname.startsWith('/api')) {
    Object.values(LOCALE).forEach((item) => {
      if (pathname.startsWith(`/${item}/`) || pathname === `/${item}`) {
        locale = item;
      }
    });

    if (!locale) {
      locale = getLocale(request);

      request.nextUrl.pathname = `/${locale}${pathname}`;

      shouldRedirect = true;
    }

    // Must be authenticated
    for (const route of ROUTES.WITH_AUTHENTICATION) {
      if (pathname.indexOf(route) !== -1 && !token) {
        request.nextUrl.pathname = `/${locale}${ROUTES.login}`;
        shouldRedirect = true;
      }
    }

    // Have already been authenticated
    for (const route of ROUTES.WITHOUT_AUTHENTICATION) {
      if (pathname.indexOf(route) !== -1 && token) {
        request.nextUrl.pathname = `/${locale}/boards`;
        shouldRedirect = true;
      }
    }

    if (shouldRedirect) {
      return NextResponse.redirect(request.nextUrl);
    }
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // '/((?!_next).*)',
    '/((?!static|.*\\..*|_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
