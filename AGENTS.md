# Algotiqa GUI — OpenCode instructions

## Quick start

```bash
npm install
npm start                # ng serve --host algotiqa --port 8080  (NOT localhost:4200)
npm run build            # ng build → dist/gui/   (default config: production)
npm run watch            # ng build --watch --configuration development
npm test                 # ng test  (Vitest via @angular/build:unit-test)
npm run vendor:asciidoctor  # rebuild src/assets/js/asciidoctor.min.js from tools/asciidoctor/
```

- `README.md` is the unmodified Angular CLI template and is stale (mentions Karma/4200) — trust `package.json`/`angular.json`.
- No lint/typecheck scripts. Closest to typechecking: `npm run build` (strict templates on).
- Production build enforces style budgets: component SCSS over **4kb fails the build** (warning at 2kb).
- CI (`.github/workflows/release.yaml`) only runs on `v*.*.*` tags: builds the Docker image and pushes it to GHCR. No lint/test in CI.

## Architecture

- **Angular 22** (zone.js, not zoneless), standalone components, **`bootstrapApplication`** in `src/main.ts` (no `AppModule`). App services are registered in `main.ts`; `src/app/service/abstract-subscriber.ts` is the base class for event-bus subscribers.
- `src/routes.ts` — flat route table; URL constants in `src/app/model/urls.ts`.
- **Named `right` router outlet**: create/edit/view panels render in `outlet: 'right'` (see `routes.ts` and `AbstractPanel.openRightPanel()`). Add new edit panels there, not to the primary outlet.
- **Layout**: `src/app/layout/header-panel` and `src/app/layout/main-panel` (contains `left-panel`, `right-panel`, `work-panel`). Feature panels nest under `work-panel/{admin,inventory,portfolio,tool,home,unknown}`; routed modules live in `src/app/module/{doc-editor,help-viewer,performance-metrics,quality-analyzer,correlation-matrix,simulator,trade-analyzer}`.
- **OIDC auth** via `angular-auth-oidc-client`; config in `src/authentication.ts` — Keycloak authority `https://algotiqa:8443/auth/realms/algotiqa`, clientId `algotiqa-frontend`, `secureRoutes: 'https://algotiqa:8443/'`.
- **Localization**: `src/assets/lang/{en,it}/application.yaml`, fetched at runtime by `LabelService` as `assets/lang/<lang>/application.yaml`.
- **Help system**: `HelpService` serves AsciiDoc pages from `src/assets/lang/en/help/` (index in `help/index.yaml`, **English only**), rendered by the vendored asciidoctor bundle.
- **Global scripts/styles** (declared in `angular.json`, not imported): `apexcharts`, `jquery`, `trumbowyg` (+ its CSS), `src/assets/js/asciidoctor.min.js`. `ng-apexcharts`/`trumbowyg` rely on these globals. The asciidoctor bundle is committed; regenerate it with `npm run vendor:asciidoctor` after changing `tools/asciidoctor/`.

## Backend URL & deploy

- The backend URL `algotiqa:8443` is **hardcoded in the source** (e.g. `src/authentication.ts`) and ends up in the built `main-*.js`.
- In the Docker image (`Dockerfile` → nginx), `start.sh` rewrites `algotiqa:8443` → `$ALGO_HOST` inside the built JS at container startup. Don't "fix" the hardcoded host — that's the mechanism.

## Conventions

- 2-space indent, single quotes in TS (`.editorconfig`); SCSS for component styles.
- **ELv2 license header** on every source file — preserve it on new files (copy the header block from any existing `.ts`).
- Panels extend `AbstractPanel` (`src/app/component/abstract.panel.ts`): it calls `this.init()` from `ngOnInit` and `this.destroy()`/`this.viewInit()` hooks. Localization helpers: `loc()`, `mod()`, `button()`, `menu()`, `map()`, `labelMap()` — YAML keys prefixed `page.<pageCode>.*`, `model.*`, `button.*`, `menu-button.*`, `map.*`.
- tsconfig is **strict**: `strict`, `strictTemplates`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`. Index-signature access needs bracket notation; templates must be type-correct.
- Icons: `<mat-icon>` uses the **Material Icons** font; some templates use Material Symbols via `<span class="material-symbols-outlined">`. **Both** fonts are loaded in `src/index.html` — do not remove either.

## Reusable components

- `src/app/component/button/` — one wrapper per action (back, chart, connect, create, …), each wrapping `<flat-button>` with icon+label. Bind `(click)` on the custom element (native event bubbling): `<create-button (click)="onCreateClick()" [disabled]="disCreate"></create-button>`.
- `src/app/component/form/` — inputs, selects (`select-required`/`select-optional`), pickers, `*-selector` domain dropdowns (broker/data/instrument/preset/root/period/timeframe/text), `file-uploader`, `confirmation-dialog`, `chip-text-set`, `flat-button`, `error-state-matcher`, `drag-n-drop.directive`.
- `src/app/component/panel/` — `list-panel` (with `<list-buttons>`/`<list-left>`/`<list-content>` slots), `flex-table` (sort/filter/selection), `flex-tree`, `simple-table` (read-only), `module-title`/`right-title`.

## Known bugs & gotchas

- **`app.component.spec.ts` is broken**: it uses `declarations: [AppComponent]`, but `AppComponent` is standalone — should be `imports: [AppComponent]`. It is the only spec file. Expect `npm test` to fail on it.
- **`select-required` binding-order issue**: Angular binds `[key]` before `[list]`/`[map]`, so the `set key()` setter (`select-required.ts:88`) calls `formControl.setValue()` before options exist — an initial value may not render. The setter does not defer to `ngOnInit`.
- **`@HostBinding('style.pointer-events')` hack**: `flat-button` and the button wrappers set `pointer-events: none` on the host when `disabled`. Prefer native `<button disabled>` for new components rather than replicating the hack.
- **ViewEncapsulation is Emulated** (default): a component's SCSS cannot reach into Angular Material internals — use `:host ::ng-deep` for those overrides.
- **Custom-element components** (`<list-content>`, `<flex-table>`, `<list-buttons>`, …) are `display: inline` by default; without an explicit `:host { display: flex|block }` they break the flex layout chain (height constraints and scrollbars won't propagate).
- **`SidebarMenuModule`** (`src/app/component/sidebar-menu/sidebar.module.ts`) is the **only `@NgModule`** in the repo; its 4 declared components are `standalone: false`. Everything else is standalone.

## Tests

- Single spec: `src/app/layout/app.component.spec.ts` (broken — see above).
- Test builder is `@angular/build:unit-test` with **runner: vitest** (`angular.json`); `tsconfig.spec.json` uses `vitest/globals`. Karma packages still sit in `package.json` but are unused.
- Run a focused spec with: `npx ng test --include='**/app.component.spec.ts'` (single run: add `--watch=false`).
