import {
  IRequestCookies,
  IWritableCookies,
  clearSessionCookies,
  readAccessToken,
  readRefreshToken,
  replaceRequestTokens,
} from './cookies';
import { TRefreshResult, sessionBackend } from './backend';

import { SIGN_OUT_PATH } from './sign-out';

export type TSessionRenewal =
  | { type: 'unchanged' }
  | { type: 'renewed'; setCookie: string[] }
  | { type: 'ended' };

interface ISessionRenewalDeps {
  refresh: (refreshToken: string) => Promise<TRefreshResult>;
  now?: () => number;
}

interface IRenewalInput {
  cookies: IRequestCookies;
  pathname: string;
}

const MS_PER_SECOND = 1000;
// Renew a little early so the token doesn't expire between the proxy and the
// backend call it was renewed for.
const RENEW_BEFORE_EXPIRY_MS = 60_000;
// The backend rotates the refresh token on use and treats a second use as
// theft, ending the Session. Requests the browser sends in parallel, or before
// it has stored the new cookies, all carry the old token, so they share one
// refresh for this long.
const SHARE_REFRESH_MS = 30_000;

const UNCHANGED: TSessionRenewal = { type: 'unchanged' };
const ENDED: TSessionRenewal = { type: 'ended' };

/** The JWT's `exp` in ms, unverified: the backend verifies, we only decide when to renew. */
const readExpiry = (token: string): number | undefined => {
  try {
    const [, payload] = token.split('.');
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof exp === 'number' ? exp * MS_PER_SECOND : undefined;
  } catch {
    return undefined;
  }
};

export const needsRenewal = (accessToken: string | undefined, now: number) => {
  if (!accessToken) return true;
  const expiry = readExpiry(accessToken);
  return expiry === undefined || expiry - now < RENEW_BEFORE_EXPIRY_MS;
};

/**
 * Keeps the Session alive (ADR-0002). Run by the proxy before every request:
 * when the access token is missing or about to expire and there is a refresh
 * token, it refreshes, and the rest of the request sees the new tokens. Write
 * the outcome to the response with `applyRenewal`.
 */
export const createSessionRenewal = ({
  refresh,
  now = Date.now,
}: ISessionRenewalDeps) => {
  const recent = new Map<
    string,
    { at: number; result: Promise<TRefreshResult> }
  >();

  const refreshOnce = (refreshToken: string) => {
    const at = now();

    for (const [token, entry] of recent) {
      if (at - entry.at > SHARE_REFRESH_MS) recent.delete(token);
    }

    const shared = recent.get(refreshToken);
    if (shared) return shared.result;

    const result = refresh(refreshToken);
    recent.set(refreshToken, { at, result });
    return result;
  };

  return async ({
    cookies,
    pathname,
  }: IRenewalInput): Promise<TSessionRenewal> => {
    // Sign-out revokes the token it is sent; renewing would race its cookie clearing.
    if (pathname === SIGN_OUT_PATH) return UNCHANGED;

    const refreshToken = readRefreshToken(cookies);
    if (!refreshToken || !needsRenewal(readAccessToken(cookies), now())) {
      return UNCHANGED;
    }

    const result = await refreshOnce(refreshToken);

    switch (result.type) {
      case 'refreshed':
        replaceRequestTokens(cookies, result.tokens);
        return { type: 'renewed', setCookie: result.setCookie };
      case 'rejected':
        replaceRequestTokens(cookies);
        return ENDED;
      default:
        return UNCHANGED;
    }
  };
};

/**
 * Hands the renewal to the browser: the backend's cookies verbatim (so its
 * expiry, domain and flags stay the source of truth), or clears both.
 */
export const applyRenewal = (
  response: { headers: Headers; cookies: IWritableCookies },
  renewal: TSessionRenewal,
  domain?: string,
) => {
  if (renewal.type === 'renewed') {
    for (const header of renewal.setCookie) {
      response.headers.append('Set-Cookie', header);
    }
  }

  if (renewal.type === 'ended') clearSessionCookies(response.cookies, domain);
};

export const renewSession = createSessionRenewal({
  refresh: sessionBackend.refresh,
});
