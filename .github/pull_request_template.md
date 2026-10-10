## Summary

<!-- What does this PR do and why? Link the related issue/ticket. -->

Closes #

## Type of change

- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Style / UI
- [ ] Docs
- [ ] Build / deploy / config

## Changes

<!-- Key changes, grouped by module (e.g. dashboard/meals, auth, utils). -->

-

## Screenshots / recordings

<!-- Required for UI changes. Before / after, light + dark theme, mobile if relevant. -->

## How to test

<!-- Steps for the reviewer to verify manually (no automated test suite). -->

1.

## Checklist

- [ ] `npm run lint` passes with no new warnings
- [ ] `npm run build` succeeds
- [ ] Manually tested in the browser (light + dark theme, mobile width)
- [ ] New UI strings added to **all** locales (`en`, `de`, `es`, `fr`, `hu`)
- [ ] Forms validated with Zod schemas in the module's `validations/`
- [ ] Server-only API calls go through `apiRequest()`; client errors via `handleAxiosError()`
- [ ] No hand edits to generated `app/components/ui/` (shadcn) beyond shadcn output
- [ ] Auth/route changes checked against `proxy.ts` (locale redirect, `/dashboard` gating)
- [ ] New env vars documented and added to deploy config (`buildspec.yml` / Dockerfile / EC2)
- [ ] `CLAUDE.md` / README updated if architecture or commands changed

## Notes for reviewers

<!-- Risks, follow-ups, anything out of scope. -->
