# Module boundaries are enforced by ESLint

The module architecture is machine-checked by `eslint-plugin-boundaries` in `bun run lint`, as errors. Every file under `app/` and `proxy.ts` is one of three element types:

- **shared**: `app/{assets,components,hooks,i18n,lib,providers,session,utils}`. Imports only shared code.
- **module**: a folder under `app/(modules)/[lang]/dashboard/(modules)/`, named by its folder. Imports shared code, itself, and the modules it is allowed:

  | Module            | May import                                     |
  | ----------------- | ---------------------------------------------- |
  | `meal-plans`      | `meals`, `_resource-table`, `_nutrition`       |
  | `meals`           | `ingredients`, `_resource-table`, `_nutrition` |
  | `ingredients`     | `_resource-table`                              |
  | `_nutrition`      | `ingredients`                                  |
  | `profile`         | `_user`, `_body-metrics`                       |
  | `_body-metrics`   | `_user`                                        |
  | `_user`           | —                                              |
  | `_resource-table` | —                                              |

  A leading underscore means "not a route", not "leaf": `_nutrition` depends on `ingredients` for units.

- **route**: everything else (app root files, `(auth)`, the rest of `[lang]`, `proxy.ts`). Routes are composition roots and may import anything.

Anything not allowed is disallowed: shared → module or route, module → route, and module → an unlisted module. `import type` and test files follow the same rules. A new dashboard module must be added to `MODULE_DEPENDENCIES` in `eslint.config.mjs`, or every file in it fails lint. Within a module anything goes, and an allowed edge may reach any file of the target module (e.g. `meals → ingredients/api`).

## Considered Options

- **`no-restricted-imports` blocks** (what we had): each one forbids a single path pattern, so the allowed graph lived only in people's heads, and a new module or edge was unchecked until someone added a block.
- **dependency-cruiser**: also checks the graph and adds cycle detection and graph output, but runs as a separate command with no in-editor feedback. It can still be added later for graphs or cycles.
- **eslint-plugin-boundaries** (chosen): the allowlist is the config, errors show in the editor, and it runs inside the existing `bun run lint` at no noticeable cost.

## Consequences

- `@/` imports are resolved with `eslint-import-resolver-typescript`; without it they are unclassified and silently skipped.
- Element patterns are micromatch globs, so `(modules)` and `[lang]` must be escaped.
- Public-API barrels per module are a non-goal (see `0004`); deep imports along an allowed edge are fine.
