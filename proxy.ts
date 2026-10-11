import { API_URL, COOKIE_DOMAIN } from '@/app/utils/config';
import {
  CSP_HEADER,
  NONCE_HEADER,
  contentSecurityPolicy,
  createNonce,
} from '@/app/utils/security/csp';
import { applyRenewal, renewSession } from '@/app/session/renewal';
import { decideRoute, readAccessToken } from '@/app/session';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getLocale } from '@/app/i18n/helpers';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function proxy(request: NextRequest) {
  const renewal = await renewSession({
    cookies: request.cookies,
    pathname: request.nextUrl.pathname,
  });

  const decision = decideRoute({
    pathname: request.nextUrl.pathname,
    hasToken: Boolean(readAccessToken(request.cookies)),
    preferredLocale: getLocale(request),
  });

  const nonce = createNonce();
  const csp = contentSecurityPolicy({
    nonce,
    apiUrl: API_URL,
    isDev: process.env.NODE_ENV === 'development',
  });

  // `request.cookies` now holds the renewed tokens; pass them on to the render
  // with the nonce, which Next reads from the CSP header.
  const headers = new Headers(request.headers);
  headers.set(NONCE_HEADER, nonce);
  headers.set(CSP_HEADER, csp);

  const response =
    decision.type === 'redirect'
      ? NextResponse.redirect(new URL(decision.url, request.url))
      : NextResponse.next({ request: { headers } });

  response.headers.set(CSP_HEADER, csp);
  applyRenewal(response, renewal, COOKIE_DOMAIN);

  return response;
}
