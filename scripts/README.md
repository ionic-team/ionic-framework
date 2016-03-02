# Development

## Getting Started

All of these commands require you to run `npm install` first.  Add the `--typecheck` flag to generate type definitions (`.d.ts`) and do type checking, but keep in mind builds and rebuilds when watching will be significantly slower (~1min and ~1s respectively, vs ~20s and ~200ms without typechecking).

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


### Releasing Component Demos

(Copied from [ionic-preview-app](https://github.com/driftyco/ionic-preview-app#updating-ionic-site), check there for updates)

- Set [production mode](https://github.com/driftyco/ionic-preview-app/blob/master/app/app.ts#L11) to true
- Rebuild app
- Copy the contents of this entire repo to `ionic-site/dist/preview-app/` (`cp -R * ../path/to/ionic-site/dist/preview-app/`)


### Releasing API Demos

Ionic API demos are automatically compiled and deployed to the [ionic staging site](http://ionic-site-staging.herokuapp.com/) on every commit. No action is necessary.

If you'd like to manually update the demos, clone the [`ionic-site`](https://github.com/driftyco/ionic-site) repo as a sibling of `ionic`. From `ionic` run gulp docs, and it'll compile and copy the demos to the `ionic-site` repo, ready for testing or committing.
