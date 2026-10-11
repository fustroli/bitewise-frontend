/**
 * Why the backend sent the browser back to the sign-in page after a social
 * sign-in, as `/?error=<code>`.
 */
export enum EAuthError {
  // The email belongs to an account whose email isn't verified.
  PASSWORD_FIRST = 'password-first',
  // The OAuth state didn't match (missing, expired or forged), or the user
  // cancelled on the provider's consent screen.
  OAUTH_FAILED = 'oauth-failed',
}
