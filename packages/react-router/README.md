## @ionic/react-router

Routing integration for `@ionic/react` applications.

## Building

1. Install dependencies in `@ionic/core`:

```shell
cd core && pnpm install
```

2. Build `@ionic/core`. This will generate React component bindings in the `packages/react` directory:

```shell
pnpm build
```

> [!WARNING]
> If you are receiving errors about missing packages, you may need to run `pnpm install --force` to force the installation of the missing packages.

3. Install dependencies in `@ionic/react`:

```shell
cd packages/react && pnpm install
```

4. Build `@ionic/react`:

```shell
pnpm build
```

> [!WARNING]
> If you are receiving errors about missing packages, you may need to run `pnpm install --force` to force the installation of the missing packages.

5. Install dependencies in `@ionic/react-router`:

```shell
cd packages/react-router && pnpm install
```

6. Build `@ionic/react-router`:

```shell
pnpm build
```

> [!WARNING]
> If you are receiving errors about missing packages, you may need to run `pnpm install --force` to force the installation of the missing packages.
