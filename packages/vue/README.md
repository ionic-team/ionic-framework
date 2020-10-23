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

2. Build `@ionic/vue`:

```shell
npm run build
````

## Tests

* E2E Tests are found in the `packages/vue/test-app/tests` directory and use Cypress.
* When making changes to `@ionic/vue` or `@ionic/vue-router` you can run `npm run sync` in the `test-app` directory to ensure that the test application is using your built changes. Be sure to build in the `vue` and `vue-router` directories first.
* Tests can be run in headless mode by running `npm run cypress`.
* If you want to open the Cypress test runner, you can run `node_modules/.bin/cypress open`.
* Bug fix and feature PRs should have new tests verifying the PR functionality.

## Contributing

See our [Contributing Guide](https://github.com/ionic-team/ionic-framework/blob/master/.github/CONTRIBUTING.md).

## Need Help?

Post your question on the [Ionic Forum](http://forum.ionicframework.com/).