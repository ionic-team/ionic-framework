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

Every breaking change is one of three kinds:

- Auto-fix: a deterministic edit that preserves behavior, applied for you.
- Report-only: a change that needs judgement (semantic rework, a dialect
  choice). The tool finds it and explains it, but won't rewrite it.
- Experimental: an edit that is correct but whose consequence is a judgement
  call, so it only runs with `--experimental`. A report-only migration covers
  the same change by default.

### Coverage

Each major upgrade has its own page, listing every change the tool covers,
whether it is auto-fixed, report-only, or experimental, and the changes left for
you to make by hand:

- [v8 to v9](./docs/v9.md)

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

These hold for every major. What a given upgrade can't reach is on its own page
under [`docs/`](./docs).

- Single-shot. A project migrator isn't idempotent, and an import rewrite in
  particular will corrupt already-migrated code if you re-run it. The version
  gate prevents that once the `@ionic/*` bump has landed.
- Only `.ts` and `.tsx` are loaded into `ts-morph`, so `.js`/`.jsx` files and
  Angular inline templates (a `template:` string in a decorator) get the
  text-scan migrations but not the AST-based ones.
- The template scanner is best-effort, not a full HTML parser.
- Stylesheet scanning covers `.css` and `.scss` files. Styles inlined in a
  component decorator's `styles` array aren't read.

## Extending

Add a migration by dropping a file under `src/migrations/v<major>/` that exports
a `Migration` (see `src/types.ts`) and registering it in
`src/migrations/index.ts`. Give it a `detect()` and, when the change is safe to
automate, a `fix()`, plus `fromMajor`/`toMajor` for version scoping and a
fixture-backed test. The engine handles selection, ordering, git safety,
formatting, and reporting.

Then add a row to that major's page under [`docs/`](./docs), creating
`docs/v<major>.md` if it's the first migration for a new one. That page is what
tells someone whether an upgrade is covered, so it's part of the migration, not
an afterthought.

## Development

```sh
npm test          # Vitest
npm run lint      # tsc --noEmit
npm run build     # emit dist/
```
