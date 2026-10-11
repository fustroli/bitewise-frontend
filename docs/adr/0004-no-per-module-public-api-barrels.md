# No per-module public-API barrels

Dashboard modules have no single entry point. Another module, or a route, imports a module's subfolders directly (`meals/api`, `ingredients/interfaces`, `_user/context`), and occasionally a single file (`_resource-table/components/ResourcePage`). `eslint-plugin-boundaries` checks only which module may import which (see `0003`), not how deep an import goes.

Decided in #60.

## Considered Options

- **One barrel per module, enforced as the only entry point**: rejected. The `api/` folders import `server-only` and `resource/form.ts` and the components are `'use client'`, so one barrel would pull `server-only` into client bundles. Each module would need two entries (`index.ts` and `server.ts`), which doubles the surface the barrel was meant to shrink. Barrels that mix `'use client'` and server exports are a known friction point in Next (slower dev compiles, harder tree-shaking), and the change touches every module for little gain. Cross-module imports already land almost entirely on subfolder indexes.
- **Limit cross-module imports to `<module>/<subfolder>`**: not adopted for now. Only a handful of single-file imports exist, so the rule would not yet pay for itself.
- **No entry-point rule** (chosen): `MODULE_DEPENDENCIES` already fixes the allowed edges, which is where coupling actually matters.

## Consequences

- An allowed edge may reach any file of the target module. Prefer a subfolder's `index.ts` when one exists.
- Revisit if modules start depending on each other's internals (deep single-file imports multiplying), or if a module needs a stable surface for something outside this app.
