// The only place that knows the Session cookie names. The backend sets both on
// sign-in (ADR-0001); the frontend reads the access token and clears both.
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

export const readAccessToken = (cookies: IReadableCookies) =>
  cookies.get(ACCESS_TOKEN_COOKIE)?.value || undefined;

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
