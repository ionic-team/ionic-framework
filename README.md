[![Circle CI](https://circleci.com/gh/driftyco/ionic.svg?style=svg)](https://circleci.com/gh/driftyco/ionic)


[![Issues Ready](https://badge.waffle.io/driftyco/ionic.png?label=ready&title=Ready)](https://waffle.io/driftyco/ionic)

The best place to start with Ionic is our [documentation page](http://ionicframework.com/docs/).

Ionic currently best supports iOS 7+ and Android 4.1+.

# What is Ionic?

Ionic is the open source HTML5 Mobile Framework for building amazing, cross-platform hybrid native apps with HTML, JavaScript, and CSS.

![Ionic GUI](http://ionicframework.com/img/gui_screen.jpg)

We built Ionic because we wanted a framework that focused on building hybrid native apps, rather than mobile websites. We wanted this framework to be obsessive about great design and performance. A framework that left the past behind and focused on the future where mobile devices could make HTML5 feel native.

It's important to realize that Ionic is not a replacement for frameworks used for building mobile web apps. There are a lot
of great solutions that work well for websites, like [jQuery Mobile](http://jquerymobile.com/).

Ionic is also not a good solution if you need to support older generation devices. Our compatibility *starts* at iOS 6 and Android 4.1. We will never support versions earlier than those. This is a framework for the future. Learn more: [Where does the Ionic Framework fit in?](http://ionicframework.com/blog/where-does-the-ionic-framework-fit-in/)

## Quick Start

To start using ionic, you have two options: copy over the built JS and CSS files, or
use the `ionic` tool ([ionic-cli](https://github.com/driftyco/ionic-cli)) which can be installed through npm: _(You may need to prefix the command with `sudo` depending on your OS and setup.)_

```bash
$ npm install -g ionic
```

Then, you can start a new ionic project by running:

```bash
$ ionic start myproject
```

### Manual Start

- Download the latest **stable** release from:
  * The `release` folder of this repository
  * Ionic CDN: [Latest Release](http://code.ionicframework.com/)
  * Using bower: `bower install ionic`
- Download the **bleeding edge just-from-master release** from:
  * Ionic CDN: [Nightly Build](http://code.ionicframework.com/#nightly)
  * Using bower: `bower install driftyco/ionic-bower#master`

Once you have a release, use `js/ionic.js`, `js/ionic-angular.js`, and `css/ionic.css`.

For most cases, you'll need AngularJS as well.  This is bundled in `js/angular/` and `js/angular-ui-router/`.


## Demos

 - [Ionic Codepen.io Demos](http://codepen.io/ionic/public-list)


## Community

* Follow [@ionicframework on Twitter](https://twitter.com/ionicframework)
* Subscribe to the [Ionic Newsletter](http://ionicframework.com/subscribe/)
* Have a question that's not a feature request or bug report? [Discuss on the Ionic Forum](http://forum.ionicframework.com/)
* Read our [Blog](http://ionicframework.com/blog/)
* Have a feature request or find a bug? [Submit an issue](http://ionicframework.com/submit-issue/)


## Authors

Originally created by [Adam Bradley](http://twitter.com/adamdbradley), [Ben Sperry](http://twitter.com/benjsperry), and [Max Lynch](http://twitter.com/maxlynch), Ionic has seen hundreds of great [contributors](https://github.com/driftyco/ionic/graphs/contributors) from around the world, including Ionic Team Members [Perry Govier](http://twitter.com/perrygovier), [Mike Hartington](http://twitter.com/mhartington), and [Tim Lancina](http://twitter.com/dopernicus).

## Development

* `npm install && npm install -g gulp protractor` to setup
* (if you wish to run end-to-end tests): `webdriver-manager update --chrome` to install the webdriver.
* `gulp` or `gulp build` to build
* `gulp docs` to generate docs (read Documentation below for how to test docs locally).
* `gulp build --release` to build with minification & strip debugs
* `gulp watch` to watch and rebuild on change
* `gulp karma` to test one-time
* `gulp karma-watch` to test and re-run on source change
* `gulp snapshot` to test e2e tests locally (run `gulp demos` first to generate e2e tests). Be sure to run `./node_modules/.bin/webdriver-manager update --chrome` to first install the chrome webdriver dependency.

### Documentation

* Documentation is generated into `dist/ionic-site`.  To test documentation properly, follow these steps:
  1. Clone ionic-site into `./dist/ionic-site`
    - `git clone git@github.com:driftyco/ionic-site dist/ionic-site`
  2. Start jekyll, telling it to rebuild whenever the site changes
    - `cd dist/ionic-site && jekyll serve -w`
  3. Go back to project root and build the docs
    - `gulp docs [--doc-version=(versionName|nightly)]`
  4. Open localhost:4000 and see your changes! Re-run `gulp docs` again whenever you change something, and jekyll will update the site

### Demos / Kitchen Sink

* The demo site is generated into `dist/ionic-demo`. To test the demos, follow these steps:
  1. Run `gulp demos [--demo-version=(versionName|nightly)]`
  2. Start an http server from `dist/ionic-demo`:
    - `cd dist/ionic-demo && python -m SimpleHTTPServer`
  3. Navigate to `http://localhost:8000/{versionName|nightly}` and use the demos
  4. Run `gulp demos` again whenever you change the demos

### Commit Conventions

* Uses these [commit conventions](http://github.com/ajoslin/conventional-changelog)

### Pushing New Release of Ionic

- Almost all of the logic for releasing Ionic is done on the Travis server
- To push a new release:
  1. Update package.json version to new version
  2. Generate changelog with `gulp changelog`
  3. Go through the changelog, and fix any mistakes or clarify any unclear commit messages
  4. Commit package.json and CHANGELOG.md and push to master
- Travis will detect that this commit changed the version in package.json and push out all necessary for this new release (tags, release files, site config, ...)

## LICENSE

Ionic is licensed under the MIT Open Source license. For more information, see the LICENSE file in this repository.
