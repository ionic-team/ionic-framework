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

1. Run `gulp e2e` or `gulp e2e.watch` with a folder passed to watch for changes.
2. Navigate to `http://localhost:8080/dist/e2e`


### Building & Running API Demos

1. Run `gulp demos` or `gulp demos.watch` with a folder passed to watch for changes.
2. Navigate to `http://localhost:80808080/dist/demos`


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

1. `gulp validate`


### Running Sass Linter

**Requires Ruby. Skip this step entirely if you are unable to install Ruby.**

1. See the [Sass Guidelines](https://github.com/driftyco/ionic/blob/master/.github/CONTRIBUTING.md#sass-changes) for editing the Sass.
2. Install the linter: `gem install scss_lint`
3. Run `gulp lint.sass` and fix any linter errors.


### Running TypeScript Linter

1. Run `gulp lint.ts` and fix any errors.


# Releasing

### Releasing Ionic Source

1. Run [snapshot](#running-snapshot) & verify all changes are intentional, update master snapshot if so
2. Run `gulp release`
  - Pulls latest from GitHub
  - Runs `gulp validate`
  - Builds npm package files into dist
  - Updates package.json version
  - Removes debug statements
  - Updates changelog
  - Publishes to npm
  - Creates a new tag and release on Github
3. Verify that the `changelog` changes are accurate and the `package.json` version is correct (`git status` && `git diff`)
4. Commit and push
5. Sit back and have a beer :beers: (or wine :wine_glass:)

### Publish a nightly release
1. Run `gulp nightly`
  - Pulls latest from GitHub
  - Runs `gulp validate`
  - Builds npm package files into dist
  - Removes debug statements
  - Publishes to npm using the `nightly` tag with the date/time of publish added to the version: `2.0.0-rc.0` results in `2.0.0-rc.0-201610131811`
2. `npm install ionic-angular@nightly` will now install the latest nightly release
3. Run `npm view ionic-angular` to see the latest nightly release


### Releasing Component Demos

Ionic Component demos are automatically compiled and deployed to the [ionic staging site](http://ionic-site-staging.herokuapp.com/) on every commit in [ionic-preview-app](https://github.com/driftyco/ionic-preview-app). No action is necessary.

If you'd like to manually update the demos, follow the steps on the preview app for [running locally on the site](https://github.com/driftyco/ionic-preview-app#running-locally-on-the-site).


### Releasing API Demos

Ionic API demos are automatically compiled and deployed to the [ionic staging site](http://ionic-site-staging.herokuapp.com/) on every commit. No action is necessary.

If you'd like to manually update the demos, clone the [`ionic-site`](https://github.com/driftyco/ionic-site) repo as a sibling of `ionic`. From `ionic` run `gulp demos` and then `gulp docs`, and it'll compile and copy the demos to the `ionic-site` repo, ready for testing.
