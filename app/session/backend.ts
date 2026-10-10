import { ISessionTokens, readTokensFromSetCookie } from './cookies';

import { API_URL } from '@/app/utils/config';

export type TRefreshResult =
  | { type: 'refreshed'; tokens: ISessionTokens; setCookie: string[] }
  | { type: 'rejected' }
  | { type: 'unavailable' };

interface ISessionBackendDeps {
  baseUrl: string | undefined;
  fetch?: typeof fetch;
}

const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
// Every request waits on a refresh, so a hanging backend must not hang the app.
const TIMEOUT_MS = 5000;

const REJECTED: TRefreshResult = { type: 'rejected' };
const UNAVAILABLE: TRefreshResult = { type: 'unavailable' };

/**
 * The backend's Session endpoints. Both are authenticated by the refresh
 * token, sent as `Bearer` like every other backend call.
 */
export const createSessionBackend = ({
  baseUrl,
  fetch: fetchFn = fetch,
}: ISessionBackendDeps) => {
  const post = (path: string, refreshToken: string) =>
    fetchFn(`${baseUrl}/auth/${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${refreshToken}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

  return {
    /**
     * Rotates the tokens. `rejected` means the Session is over; `unavailable`
     * means we couldn't tell, so the caller keeps what it has.
     */
    async refresh(refreshToken: string): Promise<TRefreshResult> {
      let res: Response;

      try {
        res = await post('refresh', refreshToken);
      } catch (error) {
        console.error(error);
        return UNAVAILABLE;
      }

      // Only the headers matter; release the connection.
      void res.body?.cancel();

      if (res.status === HTTP_UNAUTHORIZED || res.status === HTTP_FORBIDDEN) {
        return REJECTED;
      }

      if (!res.ok) return UNAVAILABLE;

      const setCookie = res.headers.getSetCookie();
      const tokens = readTokensFromSetCookie(setCookie);

      return tokens ? { type: 'refreshed', tokens, setCookie } : UNAVAILABLE;
    },

    /** Ends the Session on the backend. Best effort: sign-out clears the cookies either way. */
    async signOut(refreshToken: string): Promise<void> {
      try {
        const res = await post('signout', refreshToken);
        void res.body?.cancel();
      } catch (error) {
        console.error(error);
      }
    },
  };
};

export const sessionBackend = createSessionBackend({ baseUrl: API_URL });
