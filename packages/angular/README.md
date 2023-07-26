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

## Testing ng-add in ionic

1. Pull the latest from `main`
2. Build ionic/angular: `npm run build`
3. Run `npm link` from `ionic/angular/dist` directory
4. Create a blank angular project

```
ng new add-test
// Say yes to including the router, we need it
cd add-test
```

5. To run schematics locally, we need the schematics-cli (once published, this will not be needed)

```
npm install @angular-devkit/schematics-cli
```

6. Link `@ionic/angular`

```
npm link @ionic/angular
```


7. Run the local copy of the ng-add schematic

```
$ npx schematics @ionic/angular:ng-add
```


You'll now be able to add ionic components to a vanilla Angular app setup.

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
