# Backend reads throw, mutations return results

Calls to the backend go through one server-only gateway that always yields `{ ok: true, data } | { ok: false, status, message }`. Reads are plain server-only functions (not server actions, since only Server Components call them) that throw on failure so `error.tsx` handles it; mutations are server actions that return the result object to the client. We split it this way because Next.js strips thrown error messages from server actions in production builds, so throwing would hide backend messages from the user, while making Server Component reads handle a result they can't render anything useful for would just push boilerplate onto every page.

## Considered Options

- **Throw everywhere** (the previous `apiRequest` behaviour): loses backend error messages in production toasts.
- **Return results everywhere**: every Server Component re-implements "on failure, show the error page".

## Consequences

- Sign-in and sign-up stay direct browser → backend calls, outside the gateway: the backend sets the `accessToken` cookie on that response.
- Nothing in `'use server'` files may forward arbitrary endpoints; the gateway itself is `import 'server-only'`.
