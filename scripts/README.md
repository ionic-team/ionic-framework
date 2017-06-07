# Development

## Getting Started

All of these commands require you to run `npm install` first. To see a full list of the gulp commands, run `gulp`.


### Committing

Please follow the commit message format in [CONTRIBUTING.md](https://github.com/ionic-team/ionic/blob/master/.github/CONTRIBUTING.md#commit-message-format).


### Installing Nightly Version

The latest nightly version can be installed via npm.

1. Run `npm install --save ionic-angular@nightly`
2. Your `package.json` file's `dependencies` will be updated with the nightly version.
3. Restart any `watch` or `serve` commands that may be already running.


### Building Ionic Source

Run `gulp build` or `gulp watch` to watch for changes.


### Building & Running e2e Tests

#### Development

1. Run `gulp e2e.watch --folder nav/basic` to watch for changes, where `nav` is the component, and `basic` is the test name
2. The browser will launch just like when using `ionic serve`. Make changes to an app in the `src` directory and the app will rebuild.

#### Validation

The following commands take longer to run because they use AoT compilation. They should really only be used to validate that our components work with AoT, and fix them if not.

1. Run `gulp e2e.prod` to bundle all e2e tests.

##### Flags

- `--f | -folder` will run the command with a test folder.
- `--debug` will run the `ionic-app-scripts` command with debug output printed.


### Building & Running API Demos

#### Development

1. Run `gulp demos` or `gulp demos.watch` to watch for changes.
2. Navigate to `http://localhost:8000/dist/demos`

#### Validation

The following commands take longer to run because they use AoT compilation. They should really only be used to validate that our components work with AoT, and fix them if not.

1. Run `gulp demos.prod` to bundle all demos tests. Folder is optional, see the flags section below.
2. Run `gulp demos.watchProd` with a folder passed to watch a test. Folder is required, see the flags section below.
3. Navigate to `http://localhost:8000/dist/demos`

##### Flags

- `--f | -folder` will run the command with a test folder. For example, `gulp demos.watchProd --f=alert` will build the test in `demos/alert/`.
- `--debug` will run the `ionic-app-scripts` command with debug output printed.


### Building API Docs

1. `gulp docs` to build the nightly version
2. `gulp docs --doc-version=2.0.0` to build a specific API version


### Developing against Ionic locally

From `ionic` directory:

1. `npm run link`

From your app directory:

1. `npm link ionic-angular`
2. `ionic serve` or `ionic run` or `ionic emulate`

To remove the linked version of `ionic-angular` do `npm rm ionic-angular`, and then reinstall using `npm install ionic-angular`.


### Running Snapshot

Snapshot compares to a base snapshot made on Mac OS with retina screen (2560x1600).
It does not work for windows, linux, or non retina macs.

#### Setup (Mac OS X Only)

1. Install Java JDK: `brew cask install java`
2. Install [Protractor](https://angular.github.io/protractor/#/): `npm install -g protractor@2.5.1`
3. Run `webdriver-manager update`
4. Export `IONIC_SNAPSHOT_KEY` (get from someone)

#### Commands

- `gulp snapshot` will run the `gulp e2e.prod` task with AoT compilation.
- `gulp snapshot.skipBuild` will skip the `gulp e2e.prod` task with AoT compilation.
- `gulp e2e.prod` followed by `gulp snapshot.skipBuild` is considered best practice

#### Flags

- `--f | -folder` will run the command with a test folder. For example, `gulp snapshot --f=action-sheet/basic` will run snapshot for the test at `src/components/action-sheet/test/basic`.

- `--concurrency` determines the number of tests to build at a time. By default, 2 tests are built concurrently. If using a quad-core (or more) CPU, it is often beneficial to run with `--concurrency 8` for example.

- `--dev` runs a dev build when building the e2e tests. This build takes much less time than a production build, so it is advisable to use this when doing quick validation.

#### Errors

If you are having getting an error running snapshot such as `SessionNotCreatedError: session not created exception` or `UnknownError: Connection refused` the solution is to download the chromedriver from here: http://chromedriver.storage.googleapis.com/index.html?path=2.24/ and then move it into your `protractor/selenium` folder

Running `webdriver-manager help` should show you what directory the webdriver is at under the options. For example, yours may be at `/usr/local/lib/node_modules/protractor/selenium` or if you use nvm `/Users/{username}/.nvm/versions/node/v7.5.0/lib/node_modules/protractor/selenium`.

### Running Tests

1. `gulp validate`


### Running Sass Linter

**Requires Ruby. Skip this step entirely if you are unable to install Ruby.**

1. See the [Sass Guidelines](https://github.com/ionic-team/ionic/blob/master/.github/CONTRIBUTING.md#sass-changes) for editing the Sass.
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
5. Sit back and have some beer :beers: (or wine :wine_glass:)

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

Ionic Component demos are automatically compiled and deployed to the [ionic staging site](http://ionic-site-staging.herokuapp.com/) on every commit in [ionic-preview-app](https://github.com/ionic-team/ionic-preview-app). No action is necessary.

If you'd like to manually update the demos, follow the steps on the preview app for [running locally on the site](https://github.com/ionic-team/ionic-preview-app#running-locally-on-the-site).


### Releasing API Demos

Ionic API demos are automatically compiled and deployed to the [ionic staging site](http://ionic-site-staging.herokuapp.com/) on every commit. No action is necessary.

If you'd like to manually update the demos, clone the [`ionic-site`](https://github.com/ionic-team/ionic-site) repo as a sibling of `ionic`. From `ionic` run `gulp demos` and then `gulp docs`, and it'll compile and copy the demos to the `ionic-site` repo, ready for testing.
