# Angular E2E Test Apps

Ionic Framework supports multiple versions of Angular. As a result, we need to verify that Ionic works correctly with each of these Angular versions.

## Syncing Local Changes

The Angular test app supports syncing your locally built changes for validation.

1. Build the `core` and `packages/angular` directories using `npm run build`.
2. [Build the Angular test app](#test-app-build-structure).
3. Navigate to the built test app directory (e.g. `packages/angular/test/build/ng14`).
4. Install dependencies using `npm install`.
5. Sync your local changes using `npm run sync`.

From here you can either build the application or start a local dev server. When re-syncing changes, you will need to [wipe or disable the application cache](#application-cache).

## Application Cache

Angular CLI creates a cache of several files on disk by default in the `.angular` directory. This decreases the time taken to build the test application. However, the cache makes it difficult to quickly sync and check local changes of Ionic. As a result, the `.angular` cache is disabled by default in the test app projects.

See https://angular.io/cli/cache for more information.

### Disable Cache

```shell
ng cache disable
```

> [!NOTE]
> You may need to manually remove the `.angular` directory once after running this command.

### Enable Cache

```shell
ng cache enable
```

> [!NOTE]
> You will need to delete the `.angular` cache and restart the dev server every time you want to sync local changes of Ionic.

## Test App Build Structure

> [!NOTE]
> Please confirm your current directory as `packages/angular/test` before proceeding with any of the following commands.

Unlike other test applications, these test apps are broken up into multiple directories. These directories are then combined to create a single application. This allows us to share common application code, tests, etc so that each app is being tested the same way. Below details the different pieces that help create a single test application.

**apps** - This directory contains partial applications for each version of Angular we want to test. Typically these directories contain new `package.json` files, `angular.json` files, and more. If you have code that is specific to a particular version of Angular, put it in this directory.

**base** - This directory contains the base application that each test app will use. This is where tests, application logic, and more live. If you have code that needs to be run on every test app, put it in this directory.

**build** - When the `apps` and `base` directories are merged, the final result is put in this directory. The `build` directory should never be committed to git.

**build.sh** - This is the script that merges the `apps` and `base` directories and places the built application in the `build` directory.

Usage:

```shell
# Build a test app using apps/ng14 as a reference
./build.sh ng14
```

## How to modify test apps

To add new tests, components, or pages, modify the `base` project. This ensures that tests are run for every tested version.

If you want to add a version-specific change, add the change inside of the appropriate projects in `apps`. Be sure to replicate the directory structure. For example, if you are adding a new E2E test file called `test.spec.ts` in `apps/ng14`, make sure you place the file in `apps/ng14/e2e/src/test.spec.ts`.

### Version-specific tests

If you need to add E2E tests that are only run on a specific version of the JS Framework, replicate the `VersionTest` component on each partial application. This ensures that tests for framework version X do not get run for framework version Y.

### Testing Lazy Loaded Ionic Components

Tests for lazy loaded Ionic UI components should only be added under the `/lazy` route. This ensures the `IonicModule` is added.

### Testing Standalone Ionic Components

Tests for standalone Ionic UI components should only be added under the `/standalone` route. This allows for an isolated environment where the lazy loaded `IonicModule` is not initialized. The standalone components use Stencil's custom element bundle instead of the lazy loaded bundle. If `IonicModule` is initialized then the Stencil components will fall back to using the lazy loaded implementation instead of the custom elements bundle implementation.

## Adding New Test Apps

As we add support for new versions of Angular, we will also need to update this directory to test against new applications. The following steps can serve as a guide for adding new apps:

1. Navigate to the built app for the most recent version of Angular that Ionic tests.
2. Update the application by following the steps on https://update.angular.io/.
3. Make note of any files that changed during the upgrade (`package.json`, `package-lock.json`, `angular.json`, etc).
4. Copy the changed files to a new directory in `apps`.
5. Add a new entry to the matrix for `test-core-angular` in `./github/workflows/build.yml`. This will allow the new test app to run against all PRs.
6. Commit these changes and push.

Example:

In this example, we are going to add the Angular 14 test app.

1. Build the Angular 13 test app using `./build.sh ng13`.
2. Navigate to `build/ng13`.
3. Perform the upgrade steps on https://update.angular.io/. The "From" field should say "13.0" and the "To" field should say "14.0".

Note: You may encounter some other peer dependency issues not covered by the Angular Upgrade Guide. These peer dependency issues can be resolved manually by updating the installed version of each dependency.

4. Observe that the output of the Angular upgrade indicates that the following files were modified:

`angular.json`
`package-lock.json`
`package.json`
`tsconfig.json`
`src/app/form/form.component.ts`
`src/app/modal-example/modal-example.component.ts`

5. Create a directory in `apps` named `ng14`.
6. Copy the modified files to the `apps/ng14` directory.
7. Open `./github/workflows/build.yml` and find the `test-angular-e2e` job.
8. Find the `apps` field under `matrix`.
9. Add "ng14" to the `apps` field.
10. Commit these changes and push.
