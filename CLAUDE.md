# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commands

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint (auto-fix)
```

There is no test suite configured in this repo (no Vitest/Jest/Playwright).

## Architecture

**Next.js 16 App Router**, no `src/` — routes live directly under `app/`.
Locale-aware routes sit under `app/(modules)/[lang]/`; the unauthenticated
auth flow sits under `app/(modules)/(auth)/`. `middleware.ts` handles locale
detection/redirects and gates `/dashboard` routes behind an `accessToken`
cookie.

### Key directories

| Path                          | Purpose                                              |
| ------------------------------ | ----------------------------------------------------- |
| `app/(modules)/[lang]/`        | Locale-aware routes (dashboard, etc.)                |
| `app/(modules)/(auth)/`        | Auth routes (sign in / sign up)                      |
| `app/components/`              | Shared components (`ui/`, `form/`, `Table/`, `buttons/`, `dialogs/`, `icons/`, `Typography/`) |
| `app/utils/`                   | Shared config, helpers, constants, enums, interfaces |
| `app/hooks/`                   | Shared custom hooks                                  |
| `app/providers/`                | React context providers (theme, dictionary)          |
| `app/i18n/`                     | i18n settings + `locales/` (`en`, `de`, `es`, `fr`, `hu`) |
| `app/api/`                      | Route handlers (e.g. `logout`)                       |

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
`app/(modules)/[lang]/dashboard/(modules)/{profile,ingredients,meals,meal-plans,_user}/`.

### API layer

- `app/utils/helpers/api.server.helpers.ts` — `apiRequest<T>()`, server-only,
  used from `actions/`/`api/` files; reads the `accessToken` cookie, throws on
  non-OK responses
- `app/utils/helpers/api.client.helpers.ts` — axios-based `handleAxiosError()`
  for client-side calls
- Response type: `IApiResponse<T>` (`app/(modules)/[lang]/dashboard/interfaces`)

### State management

No global state library (no Zustand/Redux, no React Query/SWR). State is
handled with local component state and React context (see `app/providers/`
and the `_user` module's `provider/`/`context/`).

### Forms

- React Hook Form + Zod resolver
- Schemas defined in each module's `validations/`

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

- `buildspec.yml` — CodeBuild: `npm ci`, `npm run build`
- `appspec.yml` — CodeDeploy: deploys to `/home/ubuntu/bitewise-frontend`,
  runs `scripts/{stop,install_dependencies,start,validate}.sh`
- The app runs under `pm2` as `bitewise-frontend` on port 3000
  (`--max-old-space-size=256`, sized for a t3.micro)

## Environment setup

Copy `.env.local` and set required env vars (e.g. `API_URL`).
