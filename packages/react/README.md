## @ionic/react

These are React specific building blocks on top of [@ionic/core](https://www.npmjs.com/package/@ionic/core) components/services.

To get started, install the Ionic CLI by running `npm i -g @ionic/cli`. Then, start a new Ionic React Project by running `ionic start myapp --type=react`.

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

## Publishing a Native Application

You can now make use of all of the ionic components in your React application.
If you want to publish your app to the App Store or Google Play you will need to use the ionic cli to execute Capacitor commands to do so.

More information on this can be found here. https://ionicframework.com/docs/cli
If you want to learn more about Capacitor our dedicated site can be found here. https://capacitor.ionicframework.com/

The commands that you will need to execute are below in your project's root.

```sh
ionic init "My React App" --type=react
ionic integrations enable capacitor
```

Then run the following command to get started with either `ios` or `android` platforms.

```
ionic capacitor add <android|ios>
```

After build you build your app you will need to copy your capacitor resources into the build dir so execute the following command.

```
ionic capacitor copy
```

To open your application to build/emulate in Android Studio or Xcode run the `open` command.

```
ionic capacitor open <android|ios>
```

## Related

- [Ionic Documentation](https://ionicframework.com/docs/)
- [Ionic Forum](https://forum.ionicframework.com/)
- [Ionicons](http://ionicons.com/)
- [Capacitor](https://capacitor.ionicframework.com/)

## License

- [MIT](https://raw.githubusercontent.com/ionic-team/ionic/main/LICENSE)
