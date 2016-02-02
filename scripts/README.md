# Development


### Building & Running Ionic Source

1. `npm install`
2. `gulp watch`
3. Go to [http://localhost:8000/dist/e2e/](http://localhost:8000/dist/e2e/)
4. Stay cool


### Building & Running Component Demos

1. Clone the `ionic-site` repo in `ionic2/dist/`: `git clone git@github.com:driftyco/ionic-site.git`
 * You may need to remove the existing directory first: `rm -rf ionic2/dist/ionic-site`
2. Run `gulp watch:demos` from the top level directory
3. Navigate to `ionic2/dist/ionic-site` and run `npm install`
4. Run `gulp watch` in this directory
5. A browser should launch at `http://localhost:3000` at which point you can navigate to `http://localhost:3000/docs/v2/components/`


### Building & Running API Demos

1. Follow the steps for [Building & Running Ionic Source](#building--running-ionic-source)
2. Run `gulp demos`
3. Run `gulp watch:demos`
4. Navigate to `http://localhost:8000/dist/demos`


### Building API Docs

1. `gulp docs` to build the nightly version
2. `gulp docs --doc-version=2.0.0` to build a specific API version


### Building NPM Module for Local Testing

From `ionic` repo root directory:

1. `gulp package --strip-debug false`
2. `cd dist`
3. `sudo npm link`
4. After ionic changes: `gulp transpile.no-typecheck --strip-debug false`

From Testing App root directory:

1. `npm link ionic-framework`
2. `ionic serve` or `ionic run` or whatever

When done:

1. In testing app, `npm uninstall ionic-framework`
2. In ionic repo, `sudo gulp clean`


### Running Snapshot

1. Install [Protractor](https://angular.github.io/protractor/#/): `npm install -g protractor`
2. Export `IONIC_SNAPSHOT_KEY` (get from someone)
3. Run `gulp snapshot`


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
