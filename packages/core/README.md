# @ionic/core

This contains the core stencil components for ionic based applications.

## Let's get started

### 1. Install global dependencies

- stencil
- np
- jest
- tsc
- tslint

```
npm i -g stencil np jest tsc tslint
```

### 2. Clone your ionic fork
```
git@github.com:ionic-team/ionic.git
cd ionic
```

### 3. Run `npm install`
```
npm install
cd packages/core
npm install
````

Notice that ionic-core lives in `packages/core`.

### 4. Run `npm run dev`
Make sure you are inside `packages/core`


## How to contribute

1. `npm run dev` allows you to modify the components and have live reloading, just like another ionic app.

3. When everything looks good, run  `npm run validate` to verify the tests linter and production build passes.


## More commands

- `npm run build`: build ionic-core for production.
- `npm run dev`: live reloading server for ionic developement,
- `npm run test`: runs unit tests.
- `npm run clean`: cleans dist folder.
- `npm run lint`: runs typescript linter.
- `npm run lint-fix`: tries to auto-fix linter issues.
- `npm run validate`: runs tests, linter and production build.
- `npm run deploy`: publishes a new version to NPM.
