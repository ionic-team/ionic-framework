# Development

### Building & Running Ionic Source

1. `npm install`
2. `gulp watch`
3. Go to [http://localhost:8000/e2e/](http://localhost:8000/e2e/)
4. Stay cool

### Building & Running Component Demos

1. Clone the `ionic-site` repo in `ionic2/dist/`: `git clone git@github.com:driftyco/ionic-site.git`
 * You may need to remove the existing directory first: `rm -rf ionic2/dist/ionic-site`
2. Run `gulp demos:all` from the top level directory
3. Navigate to `ionic2/dist/ionic-site` and run `npm install`
4. Run `gulp watch` in this directory
5. A browser should launch at `http://localhost:3000` at which point you can navigate to `http://localhost:3000/docs/v2/components/`
6. Any time you make a change to the demos repeat step 2

### Running Snapshot

1. Install [Protractor](https://angular.github.io/protractor/#/): `npm install -g protractor`
2. Export `IONIC_SNAPSHOT_KEY` (get from someone)
3. Run `gulp snapshot`

### Running Tests

1. `gulp karma`
