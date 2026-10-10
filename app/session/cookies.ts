// The only place that knows the Session cookie names. The backend sets both on
// sign-in (ADR-0001) and on refresh (ADR-0002); the frontend reads them,
// hands refreshed ones to the rest of the request, and clears both.
const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

interface IReadableCookies {
  get(name: string): { value: string } | undefined;
}

export interface IWritableCookies {
  set(
    name: string,
    value: string,
    options: {
      path: string;
      domain?: string;
      maxAge: number;
      httpOnly: boolean;
    },
  ): unknown;
}

/** A request's cookies, which the proxy may change for the rest of the request. */
export interface IRequestCookies extends IReadableCookies {
  set(name: string, value: string): unknown;
  delete(name: string): unknown;
}

export interface ISessionTokens {
  accessToken: string;
  refreshToken: string;
}

export const readAccessToken = (cookies: IReadableCookies) =>
  cookies.get(ACCESS_TOKEN_COOKIE)?.value || undefined;

export const readRefreshToken = (cookies: IReadableCookies) =>
  cookies.get(REFRESH_TOKEN_COOKIE)?.value || undefined;

/** Picks both tokens out of the backend's `Set-Cookie` headers, if both are there. */
export const readTokensFromSetCookie = (
  setCookie: string[],
): ISessionTokens | undefined => {
  const values = new Map<string, string>();

  for (const header of setCookie) {
    const [pair] = header.split(';');
    const [name, ...value] = pair.split('=');
    if (!value.length) continue;
    values.set(name.trim(), decodeURIComponent(value.join('=').trim()));
  }

  const accessToken = values.get(ACCESS_TOKEN_COOKIE);
  const refreshToken = values.get(REFRESH_TOKEN_COOKIE);

  return accessToken && refreshToken
    ? { accessToken, refreshToken }
    : undefined;
};

/** Makes the rest of the request see these tokens, or no Session when none are given. */
export const replaceRequestTokens = (
  cookies: IRequestCookies,
  tokens?: ISessionTokens,
) => {
  if (tokens) {
    cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken);
    cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken);
    return;
  }

  cookies.delete(ACCESS_TOKEN_COOKIE);
  cookies.delete(REFRESH_TOKEN_COOKIE);
};

/**
 * Expires both Session cookies. `domain` must match the backend's
 * `COOKIE_DOMAIN`, otherwise the browser treats ours as a different cookie and
 * keeps the backend's one.
 */
export const clearSessionCookies = (
  cookies: IWritableCookies,
  domain?: string,
) => {
  for (const name of [ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE]) {
    cookies.set(name, '', {
      path: '/',
      ...(domain ? { domain } : {}),
      maxAge: 0,
      httpOnly: true,
    });
  }
};
