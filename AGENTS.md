# AGENTS.md — GenIframe

## Commands

| Action | Command | Notes |
|---|---|---|
| Dev server | `npm start` | `localhost:4200`, HMR |
| Build | `npm run build` | Outputs to `dist/` |
| Test | `npm test` | Vitest via `@angular/build:unit-test` |
| Watch build | `npm run watch` | Dev config with watch |
| Format | `npx prettier --write .` | Uses `.prettierrc` — `singleQuote`, `printWidth:100`, `angular` parser for HTML |

No linting configured.

## Architecture

- **Angular 21** standalone components (no `NgModule`). Uses `@angular/build:application` (Vite/esbuild).
- **Entry:** `src/main.ts` → boots `App` with `appConfig` (provides router + `HttpClient`).
- **Tab-based UI** — `App` renders `DisplayPanelComponent` or `UploadPanelComponent` via `@if` control flow + `signal()`. No `RouterOutlet` usage.
- **Components:** `src/app/components/display-panel/`, `src/app/components/upload-panel/`
- **Service:** `src/app/services/upload.service.ts` — file upload logic, injected via `inject()`.
- **Routes:** `src/app/app.routes.ts` — currently empty.
- **Environment files:** `src/environments/` — swapped via Angular file replacements. Both empty objects.
- **`src/docs/`** — static HTML, not loaded by Angular.

## Conventions

- **Standalone components only.** Use `imports` in `@Component`, never `NgModule`.
- **All component files co-located** — `.ts`, `.html`, `.css` in same folder. Flat naming: `display-panel.ts`, not `display-panel.component.ts`.
- **Inject pattern** — prefer `inject()` over constructor injection (see `upload-panel.ts`).
- **Angular signals** for reactive state, `DestroyRef` for cleanup.
- **Tailwind v4** — CSS-first config via `@import 'tailwindcss'` in `src/styles.css`. No `tailwind.config.js`.
- **TS strict mode** enabled. `module: "preserve"` defers to bundler.
- **Tests** use `vitest/globals` (`describe`, `it`, `expect` available without imports). DOM via `jsdom`.

## Non-obvious

- `.prettierrc` uses `angular` parser for HTML — required for Angular template syntax. Default `html` parser will break.
- `ng test` delegates to Vitest (not Karma/Jasmine).
- `.vscode/mcp.json` enables Angular CLI MCP server for AI-assisted `ng` commands.
- `npm` is pinned to `10.9.4` by `packageManager`.
