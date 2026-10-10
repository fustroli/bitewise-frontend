/**
 * Why the backend sent the browser back to the sign-in page after a social
 * sign-in, as `/?error=<code>`.
 */
export enum EAuthError {
  // The email belongs to an account whose email isn't verified.
  PASSWORD_FIRST = 'password-first',
}
