import { IWritableCookies, clearSessionCookies } from './cookies';

export enum ESignOutReason {
  EXPIRED = 'expired',
}

const SIGN_OUT_PATH = '/signout';
const SIGN_IN_PATH = '/';
const REASON_PARAM = 'reason';

/** Where to send a Session that should end, e.g. `/signout?reason=expired`. */
export const signOutUrl = (reason?: ESignOutReason) =>
  reason ? `${SIGN_OUT_PATH}?${REASON_PARAM}=${reason}` : SIGN_OUT_PATH;

/** Only known reasons survive, so the sign-in page never echoes arbitrary input. */
export const parseSignOutReason = (
  value: string | string[] | null | undefined,
): ESignOutReason | undefined =>
  Object.values(ESignOutReason).find((reason) => reason === value);

/** Reads the reason from a `/signout` URL's query. */
export const readSignOutReason = (searchParams: URLSearchParams) =>
  parseSignOutReason(searchParams.get(REASON_PARAM));

/**
 * Ends the Session: clears both cookies and returns where to go next, the
 * sign-in page, carrying the reason if any.
 */
export const endSession = (
  cookies: IWritableCookies,
  { domain, reason }: { domain?: string; reason?: ESignOutReason },
) => {
  clearSessionCookies(cookies, domain);
  return reason ? `${SIGN_IN_PATH}?${REASON_PARAM}=${reason}` : SIGN_IN_PATH;
};
