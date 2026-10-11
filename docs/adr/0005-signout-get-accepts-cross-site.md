# GET /signout accepts cross-site requests

`/signout` ends the Session on GET as well as POST: it revokes the refresh token on the backend and clears both cookies. GET exists for redirects, the gateway's `/signout?reason=expired` on a 401 or missing token and `/signout?reason=account-deleted` after account deletion, because `redirect()` can only issue a GET. A cross-site page can therefore sign a User out by navigating them (link, top-level redirect) to `/signout`: a sign-out CSRF. We accept that and don't guard GET by origin.

Decided in #75.

## Considered Options

- **Same-origin guard on GET** (`Sec-Fetch-Site`, falling back to `Origin` / `Referer`; a cross-site GET redirects to `/` without signing out): rejected. Fetch Metadata marks a whole redirect chain cross-site once any hop was, and a top-level GET navigation carries no `Origin` and the external page as `Referer`. So when a User opens an external or bookmarked `/dashboard` link with a dead Session, the gateway's redirect to `/signout?reason=expired` arrives looking cross-site. The guard would skip clearing the cookies, and `/` with a token still present sends the User back to the dashboard, where the gateway redirects to `/signout` again: stuck or looping on exactly the flow GET exists for. Telling such a chain apart from a forged link isn't possible from the request alone.
- **Accept it** (chosen): the impact is only a forced sign-out. The attacker gains no data and can't act as the User; the User signs in again.

## Consequences

- Any site can sign a User out of BiteWise. That's the whole exposure; revisit if signing out ever does more than end the Session.
- The rest of the CSRF posture is unchanged: server actions are POSTs that Next checks against the `Origin` header, and the logout button is a same-origin form POST.
- Never link to `/signout` with `<Link>`: prefetching a GET with side effects would sign the User out.
