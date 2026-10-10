import {
  ESignOutReason,
  endSession,
  readRefreshToken,
  readSignOutReason,
} from '@/app/session';
import { NextRequest, NextResponse } from 'next/server';

import { COOKIE_DOMAIN } from '@/app/utils/config';
import { cookies } from 'next/headers';
import { sessionBackend } from '@/app/session/backend';

const SEE_OTHER = 303;

// GET for redirects (gateway 401, account deletion), POST for the logout
// button. Never link here with <Link>: prefetching would sign the user out.
async function signOut(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = readRefreshToken(cookieStore);
  const reason = readSignOutReason(request.nextUrl.searchParams);

  // Revoke the refresh token too, or it would outlive the cookies. A deleted
  // account's Sessions are already gone.
  if (refreshToken && reason !== ESignOutReason.ACCOUNT_DELETED) {
    await sessionBackend.signOut(refreshToken);
  }

  const target = endSession(cookieStore, { domain: COOKIE_DOMAIN, reason });

  // 303 so a POST continues as a GET to the sign-in page.
  return NextResponse.redirect(new URL(target, request.url), SEE_OTHER);
}

export { signOut as GET, signOut as POST };
