# @ionic/angular

Ionic Angular specific building blocks on top of [@ionic/core](https://www.npmjs.com/package/@ionic/core) components.


## Related

* [Ionic Core Components](https://www.npmjs.com/package/@ionic/core)
* [Ionic Documentation](https://ionicframework.com/docs/)
* [Ionic Discord](https://ionic.link/discord)
* [Ionic Forum](https://forum.ionicframework.com/)
* [Ionicons](http://ionicons.com/)
* [Stencil](https://stenciljs.com/)
* [Capacitor](https://capacitor.ionicframework.com/)


## License

* [MIT](https://raw.githubusercontent.com/ionic-team/ionic/main/LICENSE)

## Testing Local Ionic Framework with `ng add`

This guide shows you how to test the local Ionic Framework build with a new Angular application using `ng add`. This is useful for development and testing changes before publishing.

### Prerequisites

- Node.js and npm installed
- Angular CLI installed globally (`npm install -g @angular/cli`)

### Build Local Ionic Framework

1. Clone the repository (if not already done):
    ```sh
    git clone https://github.com/ionic-team/ionic-framework.git
    cd ionic-framework
    ```

2. Pull the latest from `main`
    ```sh
    git pull origin main
    ```

3. Install dependencies and build the `core` package:
    ```sh
    cd core
    npm install
    npm run build
    ```

4. Install dependencies, sync the `core` build and build the Angular package:
    ```sh
    cd ../packages/angular
    npm install
    npm run sync
    npm run build
    ```

5. Create a tarball:
    ```sh
    npm pack
    ```

6. Copy the tarball to Downloads:
    ```sh
    cp ionic-angular-*.tgz ~/Downloads/ionic-angular.tgz
    ```

### Test with New Angular App

7. Create a new Angular app:
    ```sh
    # Change to whichever directory you want the app in
    cd ~/Documents/
    ng new my-app --style=css --ssr=false
    cd my-app
    ```

8. Install the local `@ionic/angular` package:
    ```sh
    npm install ~/Downloads/ionic-angular.tgz
    ```

9. Run `ng add`:
    ```sh
    ng add @ionic/angular --skip-confirmation
    ```

10. Serve the app:
    ```sh
    ng serve
    ```

The local Ionic Framework build is now active in the Angular app. Changes to the Ionic source code require rebuilding the packages and reinstalling the tarball to see updates.

## Project Structure

**common**

This is where logic that is shared between lazy loaded and standalone components live. For example, the lazy loaded IonPopover and standalone IonPopover components extend from a base IonPopover implementation that exists in this directory.

**Note:** This directory exposes internal APIs and is only accessed in the `standalone` and `lazy` submodules. Ionic developers should never import directly from `@ionic/angular/common`. Instead, they should import from `@ionic/angular` or `@ionic/angular/lazy`.

**standalone**

This is where the standalone component implementations live. It was added as a separate entry point to avoid any lazy loaded logic from accidentally being pulled in to the final build. Having a separate directory allows the lazy loaded implementation to remain accessible from `@ionic/angular/lazy` for backwards compatibility.

Ionic developers can access this by importing from `@ionic/angular`.

**lazy**

This is where the lazy loaded component implementations live.

Ionic developers can access this by importing from `@ionic/angular/lazy`.

> [!CAUTION]
> The lazy loaded build, including `IonicModule`, is deprecated and will be removed in a future major version. New code should use the standalone components and `provideIonicAngular()` imported from `@ionic/angular`.

## Change Detection Strategy

Every `@Component` in `src` must declare `changeDetection` explicitly, and `npm run test` enforces it. See the [Change Detection guide](https://github.com/ionic-team/ionic-framework/blob/main/docs/angular/change-detection.md).

## Package Validation

`npm run validate` executes several subtasks: installs node modules, lints, builds the package, and runs package tests. `npm run test` can also run the package tests directly. For E2E tests, see [Angular Testing documentation](/docs/angular/testing.md).

### Testing Package Exports

To check that all exports from `package.json` point to files that exist, and that all Ionic components have exports, run `node ./scripts/verify-exports.js` or `npm run test.package`.

### Testing Code Splitting

If an app imports standalone components from `@ionic/angular`, esbuild bundles them together, so a landing page could include components it never uses. If components are instead imported from `@ionic/angular/<component-name>`, esbuild is able to bundle pages with only the components they need. The app in `packages/angular/test/code-split` is used to verify that this code splitting is working.

To run the test, run `node ./scripts/test-code-split.js` or run `npm run test.code-split`. This builds the code-split app and checks if `IonToggle` is excluded from the landing page's bundle.

### Testing Schematics

The schematics files are used when Ionic-Angular is added to a project with `ng add`. The schematics test verifies schematics are included in the package by creating a new starter app and adding the locally built Ionic-Angular package to it.

To run the test, run `node ./scripts/verify-schematics.js` or run `npm run test.schematics`.
