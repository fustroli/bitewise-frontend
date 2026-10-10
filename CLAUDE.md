# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commands

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint (auto-fix)
npm test        # Run Vitest once (*.test.ts, *.test.tsx)
```

## Architecture

**Next.js 16 App Router**, no `src/` — routes live directly under `app/`.
Locale-aware routes sit under `app/(modules)/[lang]/`; the unauthenticated
auth flow sits under `app/(modules)/(auth)/`. `proxy.ts` only translates the
request into the Session module's `decideRoute()` and its answer back.

### Session

`app/session/` owns the Session (see `CONTEXT.md`): the cookie names (never
spell them elsewhere), reading the token (`./server` → the gateway's token
source), the proxy's routing decision, and ending a Session. Every Session
ends at the `/signout` route handler (GET/POST), which clears both cookies
with `COOKIE_DOMAIN` and redirects to `/` (`?reason=expired` shows a notice).
Link to it with `signOutUrl()` via a form POST or `redirect()`, never a
`<Link>` (prefetch would sign the user out). `/signout` also revokes the
refresh token on the backend.

The proxy renews the Session before each request (`./renewal`, see
`docs/adr/0002-proxy-renews-the-session.md`): an access token that is missing
or expires within a minute is refreshed with the refresh token, the new tokens
go to the rest of the request and the browser. Concurrent requests share one
refresh, since the backend treats a reused refresh token as theft.

### Key directories

| Path                          | Purpose                                              |
| ------------------------------ | ----------------------------------------------------- |
| `app/(modules)/[lang]/`        | Locale-aware routes (dashboard, etc.)                |
| `app/(modules)/(auth)/`        | Auth routes (sign in / sign up, `/signout`)          |
| `app/session/`                 | Session module (cookies, routing decision, sign-out) |
| `app/components/`              | Shared components (`ui/`, `form/`, `Table/`, `buttons/`, `dialogs/`, `icons/`, `Typography/`) |
| `app/utils/`                   | Shared config, helpers, constants, enums, interfaces |
| `app/hooks/`                   | Shared custom hooks                                  |
| `app/providers/`                | React context providers (theme, dictionary)          |
| `app/i18n/`                     | i18n settings + `locales/` (`en`, `de`, `es`, `fr`, `hu`) |

### Module structure

Each route module under `app/(modules)/.../<module>/` follows this pattern
(not every module has every folder):

```
components/    # Module UI
actions/       # Server actions
api/           # API calls
constants/
interfaces/
validations/   # Zod schemas
enum/
helpers/
```

Nested feature modules live under a route's own `(modules)/` folder, e.g.
`app/(modules)/[lang]/dashboard/(modules)/{profile,ingredients,meals,meal-plans,_user,_resource-table,_nutrition}/`.

### Resource tables

Ingredients, Meals and Meal plans list pages go through the `_resource-table`
module (list page, sort, paging, row-actions menu, add/edit dialog). Each
resource keeps two halves in its `resource/` folder: `list.tsx` (server:
fetch, columns, row renderer, page size, form-data loader) and `form.ts`
(`'use client'`: schema, defaults, fields, server actions, bound via
`createResourceForm`). They are split because Next can't pass functions from
server to client. Table/dialog strings live under `resourceTable` and
`resources.<key>` in the dictionaries.

### Nutrition

The `_nutrition` module computes Nutrition (see `CONTEXT.md`) for a Meal
ingredient, Meal and Meal plan from the per-ingredient values the backend
sends, at full precision; `formatNutrition()` rounds only for display. Table
cells select and format, never compute.

### API layer

See `docs/adr/0001-reads-throw-mutations-return-results.md`.

- `app/utils/helpers/server/` (`import 'server-only'`) — the backend gateway
  `request<T>(endpoint, method, body?, params?, options?)`. Returns
  `TApiResult<T>` = `{ ok: true, data } | { ok: false, status, message }`;
  on a missing token or 401 redirects to `/signout?reason=expired`, unless
  `{ unauthorizedIsResult: true }` (a 401 meaning a wrong credential, e.g.
  change-password). Also `unwrap()` and
  `refreshDashboardOnSuccess()`.
- Reads live in each module's `api/` (server-only, not `'use server'`) and
  `unwrap()` the result, so failures throw to `error.tsx`.
- Changes live in each module's `actions/` (`'use server'`) and return the
  `TApiResult`; clients show it with `toastResult(result, successText)` from
  `app/utils/helpers/client`.
- `app/utils/helpers` (index) holds only helpers safe everywhere; client-only
  ones (`toastResult`, axios `handleAxiosError`, image) are in `./client`.
- Sign-in/sign-up stay direct browser → backend axios calls.

### State management

No global state library (no Zustand/Redux, no React Query/SWR). State is
handled with local component state and React context (see `app/providers/`
and the `_user` module's `provider/`/`context/`).

### Forms

- React Hook Form + Zod resolver
- Schemas defined in each module's `validations/`
- Shared fields (`app/components/form/`) take `control` and `name`; the form
  type is inferred from `control`, so a wrong `name` doesn't compile. One
  component per field kind, all built on `FieldFrame` (label, control, error,
  adornment). An emptied number field is `null`, never `0`.
- ESLint `no-restricted-imports` keeps dependencies one-way: `app/components`,
  `app/utils`, `app/hooks` never import from `app/(modules)`; `_user` never
  from `profile`; `profile` never from `(auth)`.

## Naming conventions (enforced by ESLint)

| Kind         | Convention              | Example    |
| ------------ | ------------------------ | ---------- |
| Interfaces   | PascalCase + `I` prefix  | `IUser`    |
| Type aliases | PascalCase + `T` prefix  | `TProduct` |
| Enums        | PascalCase + `E` prefix  | `EStatus`  |
| Enum members | UPPER_CASE                | `ACTIVE`   |
| Variables    | camelCase / UPPER_CASE / PascalCase | |
| Functions    | camelCase / PascalCase   |            |

- `@typescript-eslint/no-explicit-any` is off — `any` is allowed
- No unused imports/vars — auto-removed/flagged by `eslint-plugin-unused-imports`
- `no-magic-numbers` is a warning (array indexes ignored)
- `no-console` allows `warn`/`error` only

## Styling

Tailwind CSS (v3), shadcn/ui (`new-york` style, `stone` base color) configured
via `components.json`:

- Aliases: `@/components`, `@/app/lib/utils`, `@/app/components/ui`, `@/app/lib`, `@/app/hooks`
- `app/components/ui/` is generated shadcn output — excluded from ESLint, avoid
  hand-editing beyond what shadcn generates
- Tailwind class order enforced by `eslint-plugin-tailwindcss`
- Icons via `lucide-react`

## Deployment

Deployed to an EC2 instance via AWS CodePipeline/CodeBuild/CodeDeploy:

- `buildspec.yml` — CodeBuild: `npm ci`, writes `.env.production` from the
  CodeBuild env (`COOKIE_DOMAIN`), `npm run build`
- `appspec.yml` — CodeDeploy: deploys to `/home/ubuntu/bitewise-frontend`,
  runs `scripts/{stop,install_dependencies,start,validate}.sh`
- The app runs under `pm2` as `bitewise-frontend` on port 3000
  (`--max-old-space-size=256`, sized for a t3.micro)

## Environment setup

Copy `.env.local` and set required env vars:

- `NEXT_PUBLIC_API_URL` — backend base URL (inlined at build time)
- `COOKIE_DOMAIN` — server-only; same value as the backend's `COOKIE_DOMAIN`
  (empty locally), so sign-out clears the backend's cookies

## Agent skills

### Issue tracker

GitHub Issues on `fustroli/bitewise-frontend` via `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.
