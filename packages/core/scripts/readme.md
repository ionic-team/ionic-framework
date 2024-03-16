
## Build

### 1. Clone ionic

    git@github.com:ionic-team/ionic.git
    cd ionic

### 2. Run `npm install`

  cd core
  npm install


Notice that `@ionic/core` lives in `core`.

### 3. Run `npm start`

Make sure you are inside the `core` directory.

    npm start

With the `dev` command, Ionic components will be built with [Stencil](https://stenciljs.com/), changes to source files are watched, a local http server will startup, and http://localhost:3333/ will open in a browser.

### 4. Preview

Navigate to http://localhost:3333/src/components/. Each component has small e2e apps found in the `test` directory, for example: http://localhost:3333/src/components/button/test/basic

As changes are made in an editor to source files, the e2e app will live-reload.

## How to contribute

1. `npm start` allows you to modify the components and have live reloading, just like another ionic app.

2. When everything looks good, run  `npm run validate` to verify the tests linter and production build passes.


# Deploy

1. `npm run prepare.deploy`
2. Review/update changelog
3. Commit updates using the package name and version number as the commit message.
4. `npm run deploy`
5. :tada:
