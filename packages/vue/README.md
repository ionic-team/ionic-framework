# @ionic/vue

Ionic Framework integration for Vue 3 apps.

## Building

1. Install dependencies in `@ionic/core`:

```shell
cd core && npm install
```

2. Build `@ionic/core`. This will generate Vue component bindings in the `packages/vue` directory:

```shell
npm run build
````

3. Install dependencies in `@ionic/vue`:

```shell
cd packages/vue && npm install
```

4. Build `@ionic/vue`:

```shell
npm run build
````

5. Install dependencies in `@ionic/vue-router`:

```shell
cd packages/vue-router && npm install
```

6. Build `@ionic/vue-router`:

```shell
npm run build
````

### Re-build on changes

Running `npm run bundle.watch` will cause `@ionic/vue` to be re-compiled whenever the source files change. Note that if you have not yet built the project a full build using `npm run build` must be done prior to running `npm run bundle.watch`.

### Linking Local `@ionic/core` Dependency

Use [npm link](https://docs.npmjs.com/cli/v6/commands/npm-link) to link the local `@ionic/core` output to your local `@ionic/vue`. This allows you to use any `@ionic/core` changes you have made when working on `@ionic/vue`.

**Linking dependencies only needs to be done once unless you delete or overwrite the `node_modules` directory.**

Example:

```
cd ../../core && npm link
cd ../packages/vue && npm link @ionic/vue
```

## Tests

Instructions for testing can be found in the [test directory](test/README.md).

## Contributing

See our [Contributing Guide](https://github.com/ionic-team/ionic-framework/blob/main/.github/CONTRIBUTING.md).

## Need Help?

Post your question on the [Ionic Forum](http://forum.ionicframework.com/).
