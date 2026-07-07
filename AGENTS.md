# Algotiqa GUI — OpenCode instructions

## Quick start

```bash
npm install
npm start              # ng serve --host algotiqa-server --port 8444
npm run build          # ng build → dist/gui/
npm run watch          # ng build --watch --configuration development
npm test               # ng test  (Karma + Jasmine + ChromeHeadless)
```

## Architecture

- **Angular 21**, standalone components, **no NgModules** (except `SidebarMenuModule` which has `standalone: false`)
- `src/main.ts` bootstraps `AppComponent` via `bootstrapApplication` with all providers
- `src/routes.ts` — flat route table; URL constants in `src/app/model/urls.ts`
- **OIDC auth** via `angular-auth-oidc-client`, Keycloak at `https://algotiqa-server:8443/auth/realms/algotiqa`
- Labels in `src/assets/lang/application-{en,it}.yaml` loaded by `LabelService`

## Conventions

- 2-space indent, single quotes in TS (`.editorconfig`)
- MIT/Elastic License 2.0 header on every source file
- SCSS for component styles, no CSS-in-JS
- `mat-icon` uses `material-symbols-outlined` class (loaded from Google Fonts)
- Localized strings use YAML keys, accessed via `loc()`, `button()`, `mod()`, `map()` helpers on `AbstractPanel`
- `AbstractPanel` extends `AbstractSubscriber` and calls `this.init()` from `ngOnInit`

## Key directories

| Path | Contents |
|------|----------|
| `src/app/layout/` | App shell: header, main-panel, left-panel, work-panel |
| `src/app/layout/main-panel/work-panel/admin/` | Admin panels (connections, config, import-export) |
| `src/app/layout/main-panel/work-panel/inventory/` | Inventory (data products, broker products, trading sessions, agent profiles) |
| `src/app/layout/main-panel/work-panel/portfolio/` | Portfolio (monitoring, trading-system dashboard, filtering, position-sizing) |
| `src/app/layout/main-panel/work-panel/tool/` | Tools (bias analysis, market analysis) |
| `src/app/component/form/` | Reusable form controls (25+ — select-required, date-picker, flat-button, etc.) |
| `src/app/component/button/` | Reusable action buttons (15+ — create, edit, delete, save, run, etc.) |
| `src/app/component/panel/` | Layout components (list-panel, flex-table, simple-table) |
| `src/app/model/` | Data models, URL enums, event bus types |
| `src/app/service/` | 19 services including event bus, label, session, HTTP |
| `src/app/module/` | Standalone feature modules |
| `src/assets/lang/` | YAML localization files |

## Reusable components

- **Buttons** in `component/button/` — each wraps `<flat-button>` with icon+label. Use `(click)` on the custom element (native event bubbling). Example: `<create-button (click)="onCreateClick()" [disabled]="disCreate"></create-button>`
- **Form controls** in `component/form/` — `select-required`, `input-number-required`, `input-text-required`, `date-picker`, etc.
- **List panels** in `component/panel/list-panel/` — uses `<list-panel>`, `<list-buttons>`, `<list-left>`, `<list-content>` slots
- **Tables**: `flex-table` (with sort/filter/selection) and `simple-table` (read-only)
- **FlatButton** has a `@HostBinding('style.pointer-events')` hack that disables pointer events on the host — native `<button disabled>` should be used instead

## Known bugs & gotchas

- **`select-required`** initial value not displayed: Angular's Ivy binds `[key]` before `[map]`, so `formControl.setValue()` runs before options exist. The fix defers `setValue` to `ngOnInit`. If changing this component, maintain that fix.
- **`app.component.spec.ts`** uses `declarations: [AppComponent]` but AppComponent is standalone — should use `imports: [AppComponent]`. This test will fail if run.
- **ViewEncapsulation** is Emulated (default). Styles in a component's SCSS cannot reach into third-party component internals (e.g., Angular Material). Use `:host ::ng-deep` for internal element overrides.
- **Custom elements** (`<list-content>`, `<flex-table>`, `<list-buttons>`, etc.) are `display: inline` by default. If they don't have `:host { display: flex/block }`, they break the flex layout chain — height constraints and scrollbars won't propagate through them.
- **Material Icons font** URL: `fonts.googleapis.com/icon?family=Material+Icons`. Material Symbols URL is also loaded but `mat-icon` uses `material-symbols-outlined` class (Material Icons font set).

## Tests

- Single spec file: `src/app/layout/app.component.spec.ts` (currently broken — see above)
- No CI workflow, no lint script, no typecheck script found
- Karma config is implicit (`ng test` uses Angular CLI defaults with ChromeHeadless)
