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


### Running Snapshot

1. Install [Protractor](https://angular.github.io/protractor/#/): `npm install -g protractor`
2. Export `IONIC_SNAPSHOT_KEY` (get from someone)
3. Run `gulp snapshot`


### Running Tests

1. `gulp karma`


# Releasing

### Releasing Ionic Source

1. Pull latest code
2. Bump version in package.json
3. `gulp publish`
4. Sit back and have a beer :beer: (or wine :wine_glass:)

### Releasing Component Demos
See [ionic-preview-app](https://github.com/driftyco/ionic-preview-app#updating-ionic-site)

### Releasing API Demos
TODO
