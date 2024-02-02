# @ionic/vue-router

Routing integration for `@ionic/vue` applications.

## Building

1. Install dependencies in `@ionic/core`:

```shell
cd core && pnpm install
```

2. Build `@ionic/core`. This will generate Vue component bindings in the `packages/vue` directory:

```shell
pnpm build
````

> [!WARNING]
> If you are receiving errors about missing packages, you may need to run `pnpm install --force` to force the installation of the missing packages.

3. Install dependencies in `@ionic/vue`:

```shell
cd packages/vue && pnpm install
```

4. Build `@ionic/vue`:

```shell
pnpm build
````

> [!WARNING]
> If you are receiving errors about missing packages, you may need to run `pnpm install --force` to force the installation of the missing packages.

5. Install dependencies in `@ionic/vue-router`:

```shell
cd packages/vue-router && pnpm install
```

6. Build `@ionic/vue-router`:

```shell
pnpm build
````

> [!WARNING]
> If you are receiving errors about missing packages, you may need to run `pnpm install --force` to force the installation of the missing packages.

## Tests

* Tests are found in the `__tests__` directory and use Jest.
* Tests can be run using `pnpm test.spec`
* Bug fix and feature PRs should have new tests verifying the PR functionality.

## Contributing

See our [Contributing Guide](https://github.com/ionic-team/ionic-framework/blob/main/.github/CONTRIBUTING.md).

## Need Help?

Post your question on the [Ionic Forum](http://forum.ionicframework.com/).