# The proxy renews the Session

The access token lives 1 hour, the refresh token 7 days, both as httpOnly cookies the backend sets. The proxy renews the Session before every request: when the access token is missing or expires within a minute and a refresh token is present, it calls `POST /auth/refresh` with the refresh token as `Bearer`, puts the new tokens on the request so the render and server actions see them, and forwards the backend's `Set-Cookie` headers to the browser verbatim. A rejected refresh (401/403) clears both cookies; an unreachable backend leaves them alone.

The proxy is the only place that can do both halves: a Server Component render can't set cookies, so a gateway retry on 401 could call the backend but never hand the new tokens to the browser, and the browser can't refresh because the tokens are httpOnly and every backend call goes through the Next server.

## Considered Options

- **Gateway retries on 401**: can't persist the new cookies during a render; the next request would refresh again with the now rotated-away token.
- **Browser calls refresh**: needs a client timer or interceptor on every page, and still leaves server renders with the old token in between.

## Consequences

- The backend rotates the refresh token on use and treats reuse as theft (backend #19). Parallel requests, and requests sent before the browser stores the new cookies, carry the old token, so the proxy shares one refresh per token for 30 seconds. That sharing is in-process memory: it holds while the app runs as a single process (`pm2`, one instance).
- `/signout` is never renewed. It calls `POST /auth/signout` with the refresh token (best effort) before clearing the cookies, so the Session also ends on the backend.
- A gateway 401 still means the Session is over and goes to `/signout?reason=expired`.
