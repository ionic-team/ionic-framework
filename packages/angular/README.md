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
    cd dist
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
    ng new my-app --style=css --ssr=false --zoneless=false
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

**Note:** This directory exposes internal APIs and is only accessed in the `standalone` and `src` submodules. Ionic developers should never import directly from `@ionic/angular/common`. Instead, they should import from `@ionic/angular` or `@ionic/angular/standalone`.

**standalone**

This is where the standalone component implementations live. It was added as a separate entry point to avoid any lazy loaded logic from accidentally being pulled in to the final build. Having a separate directory allows the lazy loaded implementation to remain accessible from `@ionic/angular` for backwards compatibility.

Ionic developers can access this by importing from `@ionic/angular/standalone`.

**src**

This is where the lazy loaded component implementations live.

Ionic developers can access this by importing from `@ionic/angular`.
