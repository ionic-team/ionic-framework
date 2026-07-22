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
| CSS `~` prefix removal in `@ionic/angular` imports | Angular | auto |
| Add `provideZoneChangeDetection()` to a standalone bootstrap (keep Zone.js) | Angular | auto |
| NgModule bootstrap zone provider | Angular | report |
| `@ionic/react` + React Router v6 bumps, drop `@types/react-router*` | React | auto |
| `<Route exact>` removal, `component={X}` -> `element={<X />}` | React | auto |
| React Router v6: removed imports, `IonRedirect`, `render`/non-identifier `component`, `history` prop, regex paths | React | report |
| `@ionic/vue` + Vue Router 5 + Vue 3.5 bumps | Vue | auto |
| `next()` in navigation guards | Vue | report |
| `autocorrect="off"` on `ion-input`/`ion-searchbar` | all | auto |
| Legacy picker (`ion-picker-legacy`, `pickerController`, removed types) | all | report |
| `ion-img` deprecation | all | report |
| `ion-nav` router removal (`setRouteId`/`getRouteId`/`updateURL`) | all | report |

### What it can't detect

Some v9 breaks are runtime behavior changes with no reliable source signal, so
the tool leaves them out rather than guess. Check these by hand against the
[migration guide](https://ionicframework.com/docs/updating/9-0):

- `ion-modal`'s `handleBehavior` now defaults to `"cycle"`. A sheet modal with a
  handle becomes focusable and cycles its breakpoints. Set `handleBehavior="none"`
  to keep the handle inert.
- `ion-select`'s `ionChange` only fires on an actual change now, and the action
  sheet's `selected` role is gone. Code that ran on every confirmation, or read
  that role, needs a look.
- Platform detection no longer honors Capacitor 2's `isNative` flag, so a
  Capacitor 2 app reports web from `isPlatform('capacitor')` and `'hybrid'`.
  Upgrade to Capacitor 7 or later.
- In React and Vue the `swipeBackEnabled` config is read once when the outlet
  mounts. If you toggle it at runtime, move to the `swipeGesture` prop on
  `ion-router-outlet`. Setting it once at startup still works, so most apps need
  no change, which is why we don't flag it.

## How it works

1. Detect the installed framework and major version from `package.json`.
2. Select the migrations whose version range applies. A project already on the
   target major selects nothing, so a finished migration doesn't run again.
3. Apply the auto-fixes and collect the report-only findings.
4. Format the changed files with the project's own Prettier, so the AST-based
   edits come out as clean diffs. Pass `--no-format` to skip it.
5. Print a grouped summary of what was fixed and what's left for you.

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
- `ion-img` is report-only. It's a deprecation, not a v9 break.
- The template scanner is best-effort, not a full HTML parser.

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
