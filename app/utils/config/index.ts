export const API_URL = process.env.NEXT_PUBLIC_API_URL;
// Server-only: must equal the backend's COOKIE_DOMAIN so sign-out can clear its cookies.
export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;
