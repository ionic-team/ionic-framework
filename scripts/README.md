# Development

## Getting Started

All of these commands require you to run `npm install` first.  Add the `--typecheck` flag to generate type definitions (`.d.ts`) and do type checking, but keep in mind builds and rebuilds when watching will be significantly slower (~1min and ~1s respectively, vs ~20s and ~200ms without typechecking).

### Installing Nightly Version

The latest nightly version can be installed via npm.

1. Run `npm install --save ionic-angular@nightly`
2. Your `package.json` file's `dependencies` will be updated with the nightly version.
3. Restart any `watch` or `serve` commands that may be already running.


### Building Ionic Source

Run `gulp build` or `gulp watch` to watch for changes.


### Building & Running e2e Tests

1. Run `gulp e2e` or `gulp watch.e2e` to watch for changes.
2. Navigate to `http://localhost:8000/dist/e2e`


### Building & Running API Demos

1. Run `gulp demos` or `gulp watch.demos` to watch for changes.
2. Navigate to `http://localhost:8000/dist/demos`


### Building API Docs

1. `gulp docs` to build the nightly version
2. `gulp docs --doc-version=2.0.0` to build a specific API version


### Developing against Ionic locally

From `ionic` directory:

1. `gulp package build` or (`gulp package watch`, then open another terminal for step 2)
2. `cd dist`
3. `npm link` (may require `sudo`)

From your app directory:

1. `npm link ionic-angular`
2. `ionic serve` or `ionic run` or `ionic emulate`

To remove the linked version of `ionic-angular` do `npm rm ionic-angular`, and then reinstall using `npm install ionic-angular`.


### Running Snapshot

1. Install [Protractor](https://angular.github.io/protractor/#/): `npm install -g protractor@2.5.1`
2. Run `webdriver-manager update`
3. Export `IONIC_SNAPSHOT_KEY` (get from someone)
4. Run `gulp snapshot`


### Running Tests

1. `gulp karma`

### Running Sass Linter

1. See the [Sass Guidelines](https://github.com/driftyco/ionic/blob/2.0/CONTRIBUTING.md#sass-guidelines) for editing Sass and running the linter.

# Releasing

### Releasing Ionic Source

1. Run `gulp prerelease`
  - Pulls latest
  - updates package.json minor version
  - updates changelog
  - builds npm package files into dist

2. Verify that changelog changes and package.json update are correct (`git status` && `git diff`)
3. Run [snapshot](#running-snapshot) & update if necessary
4. Commit and push
5. Run `gulp release`
  - publishes to npm
  - Creates a new tag and release on Github

6. Sit back and have a beer :beer: (or wine :wine_glass:)


### Publish a nightly release
1. Run `gulp publish.nightly`
  - Pulls latest
  - builds npm package files into dist
  - updates package.json to a nightly version for publish: 0.1.0-beta.0 results in 0.1.0-beta.0-r8e7684t
  - publishes to NPM using the nightly tag
2. `npm install ionic-angular@nightly` will now install the latest nightly release


### Releasing Component Demos

Ionic Component demos are automatically compiled and deployed to the [ionic staging site](http://ionic-site-staging.herokuapp.com/) on every commit in [ionic-preview-app](https://github.com/driftyco/ionic-preview-app). No action is necessary.

If you'd like to manually update the demos, follow the steps on the preview app for [running locally on the site](https://github.com/driftyco/ionic-preview-app#running-locally-on-the-site).


### Releasing API Demos

Ionic API demos are automatically compiled and deployed to the [ionic staging site](http://ionic-site-staging.herokuapp.com/) on every commit. No action is necessary.

If you'd like to manually update the demos, clone the [`ionic-site`](https://github.com/driftyco/ionic-site) repo as a sibling of `ionic`. From `ionic` run `gulp demos` and then `gulp docs`, and it'll compile and copy the demos to the `ionic-site` repo, ready for testing.
