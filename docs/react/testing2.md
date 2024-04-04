# React Test App

## Getting Started

### Setup

Make sure you are using the latest versions of node and npm. If you do not have these, [download the installer](https://nodejs.org/) for the LTS version of Node.js. This is the best way to also [install npm](https://blog.npmjs.org/post/85484771375/how-to-install-npm#_=_).

### Building Dependencies

Navigate to the `core`, `packages/react` and `packages/react-router` directories and build each of them:

```bash
npm i
npm run build
```

Then, install dependencies from this directory for this test app:

```
npm i
```

### Syncing Changes

When making changes to the React package, run the following from this directory to sync the changes:

```bash
npm run sync
```

### Previewing App

To preview this app locally, run the following from this directory:

```bash
npm start
```

### Running Tests

To run the e2e tests, run the following from this directory:

```
npm run build
npm run e2e
```
