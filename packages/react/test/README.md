# React E2E Test Apps

Ionic Framework supports multiple versions of React. As a result, we need to verify that Ionic works correctly with each of these React versions.

## Syncing Local Changes

The React test app supports syncing your locally built changes for validation.

1. Build the `core`, `packages/react`, and `packages/react-router` directories using `npm run build`.
2. [Build the React test app](#test-app-build-structure).
3. Navigate to the built test app.
4. Install dependencies using `npm install`.
5. Sync your local changes using `npm run sync`.

From here you can either build the application or start a local dev server. When re-syncing changes, you will need to wipe the build cache in `node_modules/.cache` and restart the dev server/re-build.

## Test App Build Structure

Unlike other test applications, these test apps are broken up into multiple directories. These directories are then combined to create a single application. This allows us to share common application code, tests, etc so that each app is being tested the same way. Below details the different pieces that help create a single test application.

**apps** - This directory contains partial applications for each version of React we want to test. Typically these directories contain new `package.json` files, `cypress.config.ts` files, and more. If you have code that is specific to a particular version of React, put it in this directory.

**base** - This directory contains the base application that each test app will use. This is where tests, application logic, and more live. If you have code that needs to be run on every test app, put it in this directory.

**build** - When the `apps` and `base` directories are merged, the final result is put in this directory. The `build` directory should never be committed to git.

**build.sh** - This is the script that merges the `apps` and `base` directories and places the built application in the `build` directory.

Usage:

```shell
# Build a test app using apps/react17 as a reference
./build.sh react17
```

## How to modify test apps

To add new tests, components, or pages, modify the `base` project. This ensures that tests are run for every tested version.

If you want to add a version-specific change, add the change inside of the appropriate projects in `apps`. Be sure to replicate the directory structure. For example, if you are adding a new E2E test file called `test.e2e.ts` in `apps/react17`, make sure you place the file in `apps/react17/tests/e2e/test.e2e.ts`.

### Version-specific tests

If you need to add E2E tests that are only run on a specific version of the JS Framework, replicate the `VersionTest` component on each partial application. This ensures that tests for framework version X do not get run for framework version Y.

## Adding New Test Apps

As we add support for new versions of React, we will also need to update this directory to test against new applications. The following steps can serve as a guide for adding new apps:

1. Navigate to the built app for the most recent version of React that Ionic tests.
2. Update the application to the latest version of React.
3. Make note of any files that changed during the upgrade (`package.json`, `package-lock.json`, etc).
4. Copy the changed files to a new directory in `apps`.
5. Add a new entry to the matrix for `test-react-e2e` in `./github/workflows/build.yml`. This will allow the new test app to run against all PRs.
6. Commit these changes and push.
