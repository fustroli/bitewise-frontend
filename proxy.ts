import { hasLocale, isRootPath } from '@/app/utils/helpers';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getLocale } from '@/app/i18n/helpers';
import { locales } from '@/app/i18n/settings';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (hasLocale(pathname, locales)) return;

  const token = request.cookies.get('accessToken');
  const locale = getLocale(request);

  if (!token && !isRootPath(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isRootPath(pathname) && token) {
    return NextResponse.redirect(new URL(`${locale}/dashboard/`, request.url));
  }

  if (pathname.startsWith('/dashboard')) {
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}
