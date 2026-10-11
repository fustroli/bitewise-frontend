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
import { createHash } from 'node:crypto';

export type TSessionRenewal =
  | { type: 'unchanged' }
  | { type: 'renewed'; setCookie: string[] }
  | { type: 'ended' };

interface ISessionRenewalDeps {
  refresh: (refreshToken: string) => Promise<TRefreshResult>;
  now?: () => number;
}

interface ISharedRefresh {
  result: Promise<TRefreshResult>;
  settledAt?: number;
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
// refresh while it runs and for this long after. Kept short: until it lapses,
// a replayed old token gets the new pair instead of tripping that detection.
const SHARE_REFRESH_MS = 10_000;
// Bounds the shared refreshes a flood of made-up tokens can pile up; past it
// the oldest is dropped.
const MAX_SHARED_REFRESHES = 1000;
// The backend's refresh tokens are a few hundred characters; a cookie can
// carry about 4 KB.
const MAX_TOKEN_LENGTH = 2048;
const JWT_SHAPE = /^[\w-]+\.[\w-]+\.[\w-]+$/;

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
 * Whether a refresh token is worth sending to the backend: JWT-shaped and not
 * expired. Anything else the backend would reject, so the Session is over.
 */
export const isRefreshable = (refreshToken: string, now: number) => {
  if (refreshToken.length > MAX_TOKEN_LENGTH) return false;
  if (!JWT_SHAPE.test(refreshToken)) return false;
  const expiry = readExpiry(refreshToken);
  return expiry !== undefined && expiry > now;
};

const hash = (token: string) =>
  createHash('sha256').update(token).digest('base64url');

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
  // Keyed by the token's hash. A refresh still running has no `settledAt`;
  // settled ones are moved to the end, so they sit in settle order.
  const recent = new Map<string, ISharedRefresh>();

  const refreshOnce = (refreshToken: string) => {
    const at = now();

    for (const [key, { settledAt }] of recent) {
      if (settledAt === undefined) continue;
      if (at - settledAt <= SHARE_REFRESH_MS) break;
      recent.delete(key);
    }

    const key = hash(refreshToken);
    const shared = recent.get(key);
    if (shared) return shared.result;

    if (recent.size >= MAX_SHARED_REFRESHES) {
      recent.delete(recent.keys().next().value!);
    }

    const entry: ISharedRefresh = { result: refresh(refreshToken) };
    recent.set(key, entry);
    void entry.result.then(() => {
      if (recent.get(key) !== entry) return;
      recent.delete(key);
      recent.set(key, { ...entry, settledAt: now() });
    });
    return entry.result;
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

    if (!isRefreshable(refreshToken, now())) {
      replaceRequestTokens(cookies);
      return ENDED;
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
