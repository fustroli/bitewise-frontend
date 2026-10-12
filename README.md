# BiteWise Frontend

Web app where a user records ingredients, composes meals from them, and groups meals into meal plans, with nutrition totals at each level.

## Features

- Ingredients, meals and meal plans: list, search, sort, page, add, edit, duplicate, delete
- Nutrition totals for meal ingredients, meals and meal plans
- Compare up to 3 ingredients, meals or meal plans side by side
- Draft meal plan: a single scratchpad day kept in the browser
- Body metrics: BMI, body fat, maintenance calories and calorie targets from profile stats
- Locales: `en`, `de`, `es`, `fr`, `hu`

## Stack

Next.js 16 (App Router), React, TypeScript, Tailwind CSS 3, shadcn/ui, React Hook Form + Zod, Vitest, Bun.

## Getting started

Requires [Bun](https://bun.sh).

```bash
bun install
```

Set env vars in `.env.local`:

| Variable              | Purpose                                                              |
| --------------------- | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend base URL (inlined at build time)                             |
| `COOKIE_DOMAIN`       | Server-only; same as the backend's `COOKIE_DOMAIN` (empty locally)   |

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `bun run dev`   | Start dev server                 |
| `bun run build` | Production build                 |
| `bun run start` | Start production server          |
| `bun run lint`  | ESLint (auto-fix)                |
| `bun run test`  | Vitest, single run               |

## Project layout

- `app/(modules)/[lang]/` locale-aware routes (dashboard and its feature modules)
- `app/(modules)/(auth)/` sign in / sign up, `/signout`
- `app/session/` session cookies, proxy routing decision, renewal, sign-out
- `app/components/`, `app/utils/`, `app/hooks/`, `app/providers/` shared code
- `app/i18n/` settings and dictionaries

Module boundaries are enforced by ESLint (`eslint-plugin-boundaries`); a new dashboard module must be registered in `eslint.config.mjs`.

## Docs

- [`CLAUDE.md`](CLAUDE.md) architecture and conventions
- [`CONTEXT.md`](CONTEXT.md) domain language
- [`docs/adr/`](docs/adr) architecture decision records

## Deployment

Deployed to EC2 via AWS CodePipeline/CodeBuild/CodeDeploy (`buildspec.yml`, `appspec.yml`, `scripts/`), running under `pm2` as `bitewise-frontend` on port 3000. A `Dockerfile` is also provided.
