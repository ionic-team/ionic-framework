# Preview Changes

## Build

### 1. Clone ionic

    git clone https://github.com/ionic-team/ionic-framework.git
    cd ionic-framework

### 2. Run `npm install`

    cd core
    npm install

Notice that `@ionic/core` lives in `core`.

### 3. Run `npm start`

Make sure you are inside the `core` directory.

    npm start

With the `start` command, Ionic components will be built with [Stencil](https://stenciljs.com/), changes to source files are watched, a local http server will startup, and [http://localhost:3333/](http://localhost:3333/) will open in a browser.

### 4. Preview

Navigate to [http://localhost:3333/src/components/](http://localhost:3333/src/components/). Each component has small e2e apps found in the `test` directory, for example: [http://localhost:3333/src/components/button/test/basic](http://localhost:3333/src/components/button/test/basic)

As changes are made in an editor to source files, the e2e app will live-reload.
