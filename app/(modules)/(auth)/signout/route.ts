import { NextRequest, NextResponse } from 'next/server';
import { endSession, readSignOutReason } from '@/app/session';

import { COOKIE_DOMAIN } from '@/app/utils/config';
import { cookies } from 'next/headers';

const SEE_OTHER = 303;

// GET for redirects (gateway 401, account deletion), POST for the logout
// button. Never link here with <Link>: prefetching would sign the user out.
async function signOut(request: NextRequest) {
  const target = endSession(await cookies(), {
    domain: COOKIE_DOMAIN,
    reason: readSignOutReason(request.nextUrl.searchParams),
  });

  // 303 so a POST continues as a GET to the sign-in page.
  return NextResponse.redirect(new URL(target, request.url), SEE_OTHER);
}

export { signOut as GET, signOut as POST };
