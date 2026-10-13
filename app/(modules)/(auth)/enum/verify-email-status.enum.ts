/** Where the `/verify-email` page is with the link's token. */
export enum EVerifyEmailStatus {
  VERIFYING = 'verifying',
  VERIFIED = 'verified',
  // Missing, unknown, expired or used: the backend's 400.
  INVALID = 'invalid',
  // Anything else (network, throttling, server): the link may still work.
  FAILED = 'failed',
}
