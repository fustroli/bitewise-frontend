import { decideRoute, readAccessToken } from '@/app/session';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getLocale } from '@/app/i18n/helpers';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function proxy(request: NextRequest) {
  const decision = decideRoute({
    pathname: request.nextUrl.pathname,
    hasToken: Boolean(readAccessToken(request.cookies)),
    preferredLocale: getLocale(request),
  });

  if (decision.type === 'redirect') {
    return NextResponse.redirect(new URL(decision.url, request.url));
  }

  return NextResponse.next();
}
