# React Router Testing

Ionic Framework supports React Router 6.4+ and 7.15+. The test apps below run Ionic routing against both React Router majors and React 18 and 19.

| App | React Router | React | Notes |
| --- | --- | --- | --- |
| `reactrouter6-react18` | 6 | 18 | Default for `test_runner.sh` |
| `reactrouter6-react19` | 6 | 19 | Pinned to React 19.0.0 |
| `reactrouter7-react19` | 7.15+ | 19 | Pinned to React 19.0.0 |

The apps don't depend on `@ionic/react` or `@ionic/react-router` directly or carry `overrides`, so `npm run sync` checks the peer ranges the package actually ships. Don't add them back, since a registry dependency needs an override that masks those ranges.

## Type Checking

Run `npm run typecheck` in `packages/react-router` to check types. The rollup build only reports type errors as warnings, so a passing build does not mean the types are clean.

The `typecheck` script runs against both supported React Router majors and fails if either does:

| Script | Config | Resolves `react-router-dom` to |
| --- | --- | --- |
| `typecheck.rr6` | `tsconfig.json` | `devDependencies`' `react-router-dom`, currently 6.x |
| `typecheck.rr7` | `tsconfig.rr7.json` | the `react-router-dom-v7` npm alias, currently 7.x |

Only one copy of a package name can live in `node_modules`, so React Router 7 is installed under the npm alias `react-router-dom-v7` and `tsconfig.rr7.json` points `react-router-dom` at it with a `paths` entry. The alias has its own `react-router` nested underneath, which is what React Router 7's `export * from 'react-router'` resolves to. A direct `react-router` import from `src/` skips the mapping and still resolves to 6.x, so an ESLint `no-restricted-imports` rule bans it.

Both majors need checking because the router props differ, `future` on 6 and `useTransitions` on 7, so code that reads either one compiles on its own major and breaks on the other. That's also why `type-tests/rr7-transition-prop.ts` only runs in the React Router 7 lane.

To bump the React Router 7 version under test, run `npm install --save-dev "react-router-dom-v7@npm:react-router-dom@^X.Y.Z"`.

## Syncing Local Changes

The React test app supports syncing your locally built changes for validation.

1. Build the `@ionic/core`, `@ionic/react`, and `@ionic/react-router` projects using `npm run build`.
2. [Build the React test app](#test-app-build-structure).
3. Navigate to the built test app.
4. Install dependencies using `npm install`.
5. Sync your local changes using `npm run sync`.

From here you can either build the application or start a local dev server. When re-syncing changes, you will need to wipe the build cache in `node_modules/.cache` and restart the dev server/re-build.

## Running the Test Suites

`packages/react-router/scripts/test_runner.sh` orchestrates the React Router test suites end to end: it builds `@ionic/core`, `@ionic/react`, and `@ionic/react-router`, builds the test app, syncs local packages, starts the dev server, and runs Cypress and Playwright in sequence. By default it uses the `reactrouter6-react18` app. Pass `--app` with any name from the table above (for example `--app reactrouter7-react19`) to test a different combination.

```shell
# Full run (build + Cypress + Playwright)
sh packages/react-router/scripts/test_runner.sh

# Reuse the existing build/<app> directory and run only Playwright
sh packages/react-router/scripts/test_runner.sh --skip-build --playwright-only

# Filter Playwright to a single spec
sh packages/react-router/scripts/test_runner.sh --playwright-only --spec swipe

# Build/sync and serve the app for manual testing (no specs run)
sh packages/react-router/scripts/test_runner.sh --serve
```

Useful flags:

| Flag | Effect |
|------|--------|
| `--skip-build` | Reuse existing `packages/react-router/test/build/<app>/` instead of rebuilding |
| `--playwright-only` | Run only the Playwright e2e suite |
| `--spec <pattern>` | Filter Playwright specs by file path |
| `--app <name>` | Pick a different app variant from `packages/react-router/test/apps/` (default `reactrouter6-react18`, or `reactrouter7-react19` to test React Router 7) |
| `--serve` | Start the dev server only and open the browser |

## Debug Logging in E2E Runs

The test app starts with `setupIonicReact({ logLevel: LogLevel.DEBUG })`, so the `StackManager` swipe-back diagnostics are on for every spec.

- Cypress prints the browser console to the terminal on failure, via `cypress-terminal-report`.
- Playwright records a trace on the first retry, so CI failures come with one. Open it with `npx playwright show-trace <path>` and read the console tab. Retries are off locally, so pass `--trace on` when you want the same thing from a local run. Don't turn tracing on by default: the recording overhead is enough to destabilize the tab lifecycle specs on React 19.

A passing run collects the same logs in the browser and throws them away, so nothing reaches your terminal. Refer to [Debug Logging](./README.md#debug-logging) for turning them on in your own app.

## Test App Build Structure

Unlike other test applications, these test apps are broken up into multiple directories. These directories are then combined to create a single application. This allows us to share common application code, tests, etc so that each app is being tested the same way. Below details the different pieces that help create a single test application.

**apps** - This directory contains partial applications for each version of React we want to test. Typically these directories contain new `package.json` files, `cypress.config.ts` files, and more. If you have code that is specific to a particular version of React, put it in this directory.

**base** - This directory contains the base application that each test app will use. This is where tests, application logic, and more live. If you have code that needs to be run on every test app, put it in this directory.

**build** - When the `apps` and `base` directories are merged, the final result is put in this directory. The `build` directory should never be committed to git.

**build.sh** - This is the script that merges the `apps` and `base` directories and places the built application in the `build` directory.

Usage:

```shell
# Build a test app using apps/reactrouter6-react18 as a reference
./build.sh reactrouter6-react18
```

## How to modify test apps

To add new tests, components, or pages, modify the `base` project. This ensures that tests are run for every tested version.

If you want to add a version-specific change, add the change inside of the appropriate projects in `apps`. Be sure to replicate the directory structure. For example, if you are adding a new E2E test file called `test.e2e.ts` in `apps/reactrouter6-react18`, make sure you place the file in `apps/reactrouter6-react18/tests/e2e/test.e2e.ts`.

### Version-specific tests

If you need to add E2E tests that are only run on a specific version of the JS Framework, replicate the `VersionTest` component on each partial application. This ensures that tests for framework version X do not get run for framework version Y.

## Adding New Test Apps

As we add support for new versions of React, we will also need to update this directory to test against new applications. The following steps can serve as a guide for adding new apps:

1. Navigate to the built app for the most recent version of React that Ionic tests.
2. Update the application to the latest version of React.
3. Make note of any files that changed during the upgrade (`package.json`, `package-lock.json`, etc).
4. Copy the changed files to a new directory in `apps`.
5. Add a new entry to the `test-react-router-e2e` matrix in both `.github/workflows/build.yml` and `.github/workflows/stencil-nightly.yml`, since the nightly workflow keeps its own copy of the matrix.
6. The Vercel preview (`build_react_router_test` in `core/scripts/vercel-build.sh`) takes the highest `reactrouter6-*` app, so a new React Router 6 app becomes the preview automatically. A new React Router major only does if you widen that `pick_app` filter.
7. Commit these changes and push.
