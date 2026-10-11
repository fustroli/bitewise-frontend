// The Content-Security-Policy the proxy sets on every page (see issue #70).
// Next reads the nonce from either header and applies it to its own scripts.
// Report-Only until the avatar host is allowed in `img-src`; then enforce.
export const CSP_HEADER = 'Content-Security-Policy-Report-Only';
export const NONCE_HEADER = 'x-nonce';

export const createNonce = () =>
  Buffer.from(crypto.randomUUID()).toString('base64');

interface ICspOptions {
  nonce: string;
  apiUrl?: string;
  isDev?: boolean;
}

export const contentSecurityPolicy = ({
  nonce,
  apiUrl,
  isDev = false,
}: ICspOptions) => {
  const api = apiUrl ? ` ${new URL(apiUrl).origin}` : '';

  return [
    "default-src 'self'",
    // React needs eval for its dev-only debug stacks.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    // No nonce here: it would make browsers ignore 'unsafe-inline', which
    // Radix's inline `style` attributes need.
    "style-src 'self' 'unsafe-inline'",
    `connect-src 'self'${api}`,
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "frame-ancestors 'none'",
    `form-action 'self'${api}`,
    "base-uri 'none'",
    "object-src 'none'",
  ].join('; ');
};
