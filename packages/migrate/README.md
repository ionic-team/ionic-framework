# @ionic/migrate

Automates and reports the breaking changes between major versions of Ionic
Framework. It scans your app, applies the changes it can make safely, and prints
a checklist of the ones you need to do by hand, each with a file and line and a
link to the docs.

It handles Angular, React, and Vue (and vanilla) from one command. New breaking
changes and future majors are added as data, not new tooling.

## Usage

Run it from the root of your app:

```sh
npx @ionic/migrate
```

Commit first. The tool edits files in place and won't write to a dirty working
tree, so git is your undo. Then review the diff and the checklist it prints.

### Options

```
--dry-run        Report what would change without writing anything
--check          Report only. Exit non-zero if any migration applies (for CI)
--experimental   Include experimental migrations
--force          Write even if the working tree is dirty or not a git repo
--no-format      Skip running the project's Prettier over changed files
--no-install     Skip reinstalling dependencies after the version bump
--from <major>   Override the detected source major version
--to <major>     Override the target major version
-h, --help       Show this help
```

## What it does

Every breaking change is one of two kinds:

- Auto-fix: a deterministic edit that preserves behavior, applied for you.
- Report-only: a change that needs judgement (semantic rework, a dialect
  choice). The tool finds it and explains it, but won't rewrite it.

### Coverage (v8 to v9)

| Change | Framework | Mode |
| --- | --- | --- |
| `@ionic/angular` -> `@ionic/angular/lazy`, `/standalone` -> `@ionic/angular` | Angular | auto |
| `@ionic/angular` package bump | Angular | auto |
| `moduleResolution: "node"` -> `"bundler"` in `tsconfig*.json` | Angular | auto |
| TypeScript raised to the 5.4 floor | Angular | auto |
| CSS `~` prefix removal in `@ionic/angular` imports | Angular | auto |
| Add `provideZoneChangeDetection()` to a standalone bootstrap (keep Zone.js) | Angular | auto |
| NgModule bootstrap zone provider | Angular | report |
| `IonicModule` deprecation (`provideIonicAngular()`) | Angular | report |
| Angular below the 18 floor | Angular | report |
| Angular 22's `OnPush` default and its Node floor | Angular | report |
| `@ionic/angular-toolkit` version bump | Angular | report |
| `@ionic/react` + React 18 + React Router v6 bumps, drop `@types/react-router*` | React | auto |
| `<Route exact>` removal, `component={X}` -> `element={<X />}` | React | auto |
| React Router v6: removed imports, `IonRedirect`, `render`/non-identifier `component`, route children, `history` prop, regex paths | React | report |
| `@ionic/vue` + Vue Router 5 + Vue 3.5 bumps | Vue | auto |
| `next()` in navigation guards | Vue | report |
| `@ionic/core` package bump | all | auto |
| `autocorrect="off"` on `ion-input`/`ion-searchbar` | all | auto |
| `browserslist` entries raised to the v9 browser floors | all | auto |
| Legacy picker (`ion-picker-legacy`, `pickerController`, removed types) | all | report |
| `ion-img` deprecation | all | report |
| `ion-nav` router removal (`setRouteId`/`getRouteId`/`updateURL`) | all | report |
| `@ionic/core` imports outside the new `exports` allowlist | all | report |
| Capacitor 2 no longer detected as a native platform | all | report |
| `ion-input`/`ion-textarea`/`ion-select` internal DOM and shadow part changes | all | report |
| `label-placement="floating"` with slotted start/end content | all | report |
| `ion-textarea` md min-height `56px` -> `72px` | all | report |
| `ion-modal` `handleBehavior` default (`"none"` -> `"cycle"`) | all | report |
| `ion-select` `ionChange` firing and the action sheet `selected` role | all | report |
| `swipeBackEnabled` config, now read once at outlet mount | all | report |

### What you check by hand

The tool can't point at the code these changes affect, so check them against the
[migration guide](https://ionicframework.com/docs/updating/9-0) yourself:

- React Router v6 needs a `/*` suffix on any route whose element contains nested
  routes or a child `IonRouterOutlet` (`path="/tabs"` -> `path="/tabs/*"`).
  Knowing which routes those are means resolving each `element` back to what it
  renders, so flagging every route without a suffix would be noise.
- Angular 22 defaults components to `OnPush`, so state mutated as a plain field
  in an Ionic lifecycle hook stops re-rendering. The report flags Angular 22 in
  `package.json`, but it doesn't find the affected components - `ng update` has a
  migration for that.

## How it works

1. Detect the installed framework and major version from `package.json`.
2. Select the migrations whose version range applies. A project already on the
   target major selects nothing, so a finished migration doesn't run again.
3. Apply the auto-fixes and collect the report-only findings.
4. Print a grouped summary of what was fixed and what's left for you.
5. Format the changed files with the project's own Prettier, so the AST-based
   edits match the surrounding style. Pass `--no-format` to skip it.
6. Reinstall dependencies (using the lockfile's package manager) so
   `node_modules` matches the bumped `package.json`. Pass `--no-install` to skip
   it, then reinstall yourself before starting the app.

Transforms use `ts-morph` to locate nodes for TypeScript and TSX, and a small
quote-aware scanner for HTML and Vue templates, so it doesn't touch string
literals, comments, or unrelated code.

## Limitations

- Single-shot. A project migrator isn't idempotent, and the standalone import
  swap in particular will corrupt already-migrated code if you re-run it. The
  version gate prevents that once the `@ionic/*` bump has landed.
- Angular zoneless is auto-fixed only for the standalone `bootstrapApplication`
  shape. NgModule apps are flagged for manual migration instead.
- Angular inline templates (a `template:` string in a decorator) and `.js`/`.jsx`
  files are report-only for template changes. The auto-fix covers external
  `.html`, `.vue`, and `.tsx`.
- The `ion-img` deprecation is report-only.
- The template scanner is best-effort, not a full HTML parser.
- The component DOM/shadow-part changes are report-only. The right replacement
  depends on what the CSS rule was doing, and `ion-select`'s `part="inner"` has
  none at all.
- Stylesheet scanning covers `.css` and `.scss` files. Styles inlined in a
  component decorator's `styles` array aren't read.
- Only a `.browserslistrc` or `browserslist` file is read, so an app that keeps
  the list in `package.json` (the CRA and Vite starters do) needs its browser
  floors raised by hand.
- Angular's `moduleResolution` fix skips a tsconfig whose `module` is CommonJS.
  TypeScript rejects `bundler` resolution there, and a Node-side config doesn't
  resolve `@ionic/angular` subpaths anyway.

## Extending

Add a migration by dropping a file under `src/migrations/v<major>/` that exports
a `Migration` (see `src/types.ts`) and registering it in
`src/migrations/index.ts`. Give it a `detect()` and, when the change is safe to
automate, a `fix()`, plus `fromMajor`/`toMajor` for version scoping and a
fixture-backed test. The engine handles selection, ordering, git safety,
formatting, and reporting.

## Development

```sh
npm test          # Vitest
npm run lint      # tsc --noEmit
npm run build     # emit dist/
```
