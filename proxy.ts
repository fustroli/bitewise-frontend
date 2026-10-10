import { applyRenewal, renewSession } from '@/app/session/renewal';
import { decideRoute, readAccessToken } from '@/app/session';

import { COOKIE_DOMAIN } from '@/app/utils/config';
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

  // `request.cookies` now holds the renewed tokens; pass them on to the render.
  const response =
    decision.type === 'redirect'
      ? NextResponse.redirect(new URL(decision.url, request.url))
      : NextResponse.next({ request: { headers: request.headers } });

  applyRenewal(response, renewal, COOKIE_DOMAIN);

  return response;
}
