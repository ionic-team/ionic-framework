# @ionic/vue-router

Routing integration for `@ionic/vue` applications.

## Building

1. Install dependencies:

```shell
npm install
```

2. Run build script:

```shell
npm run build
````

### Re-build on changes

Running `npm run bundle.watch` will cause `@ionic/vue-router` to be re-compiled whenever the source files change. Note that if you have not yet built the project a full build using `npm run build` must be done prior to running `npm run bundle.watch`.

### Linking Local `@ionic/vue` Dependency

Use [npm link](https://docs.npmjs.com/cli/v6/commands/npm-link) to link the local `@ionic/vue` output to your local `@ionic/vue-router`. This allows you to use any `@ionic/vue` changes you have made when working on `@ionic/vue-router`.

Example:

```
cd ../vue && npm link
cd ../vue-router && npm link @ionic/vue
```

## Tests

* Tests are found in the `__tests__` directory and use Jest.
* Tests can be run using `npm run test.spec`
* Bug fix and feature PRs should have new tests verifying the PR functionality.

## Contributing

See our [Contributing Guide](https://github.com/ionic-team/ionic-framework/blob/main/.github/CONTRIBUTING.md).

## Need Help?

Post your question on the [Ionic Forum](http://forum.ionicframework.com/).