[![Circle CI](https://circleci.com/gh/driftyco/ionic.svg?style=svg)](https://circleci.com/gh/driftyco/ionic)

[![NPM](https://nodei.co/npm/ionic.png?stars&downloads)](https://nodei.co/npm/ionic/)

Looking for our [documentation?](http://ionicframework.com/docs/).

# What is Ionic?

[Ionic](http://ionicframework.com/) is the open source HTML5 Mobile Framework for building amazing, cross-platform hybrid native apps and mobile websites with HTML, JavaScript, and CSS. If you know how to build or design websites, you will be able to build a real mobile app with Ionic!

We built Ionic because we wanted a framework that focused on building high quality hybrid native apps and mobile web apps using open web technologies we loved. The same technology the world has been using for decades to build websites, desktop applications, and now mobile and tablet apps. We wanted this framework to be obsessive about great design and performance, and work on multiple platforms without changing a thing.

We rejected the idea that web mobile apps had to be clunky, slow, and non-native. We believed that we could bring the best of the web together with the best of the native platforms without sacricificing the power, accessibility, and portability of the open web.

Above all, we built Ionic to be the easiest way for the next generation of developers to get into mobile and start building apps that compete with the best on the app store, and do it affordably. 

Today, Ionic powers over 1.5 million mobile apps and websites (and even some desktop apps!), built by small startups up to Fortune 50 companies. Ionic developers come from hundreds of countries around the world, and have helped build a community that boasts hundreds of monthly meetings, conference talks, and workshops; an incredibly active [forum](http://forum.ionicframework.com) and [Theme and Plugin Marketplace](https://market.ionic.io); and some pretty [amazing apps](http://showcase.ionicframework.com/).

## Quick Start

To start using ionic, you have two options: copy over the built JS and CSS files, or
use the `ionic` tool ([ionic-cli](https://github.com/driftyco/ionic-cli)) which can be installed through npm (recommended): _(You may need to prefix the command with `sudo` depending on your OS and setup.)_

Additionally, we have a desktop GUI tool that we recently released called [Ionic Lab](http://lab.ionic.io). If you try it, let us know what you think!

To get started with the CLI flow, fire up your terminal and run:

```bash
npm install -g ionic
```

Then, you can start a new ionic project by running:

```bash
ionic start myproject
```

### Manual Start

If you'd rather do everything by hand, you can grab all the files for Ionic below:

- Download the latest **stable** release from:
  * The `release` folder of this repository
  * Ionic CDN: [Latest Release](http://code.ionicframework.com/)
  * Using bower: `bower install ionic`
  * For [Meteor](https://www.meteor.com/) applications: `meteor add driftyco:ionic`
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
* Read our [Blog](http://blog.ionic.io/)
* Have a feature request or find a bug? [Submit an issue](http://ionicframework.com/submit-issue/)
* Join our Community Slack Group! [Ionic Worldwide](http://ionicworldwide.herokuapp.com/)

## Authors

Originally created by [Adam Bradley](https://twitter.com/adamdbradley), [Ben Sperry](https://twitter.com/benjsperry), and [Max Lynch](https://twitter.com/maxlynch), Ionic has seen hundreds of great [contributors](https://github.com/driftyco/ionic/graphs/contributors) from around the world, including Ionic Team Members [Perry Govier](https://twitter.com/perrygovier), [Mike Hartington](https://twitter.com/mhartington), and [Tim Lancina](https://twitter.com/dopernicus).

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

* Documentation is generated into `./../ionic-site`.  To test documentation properly, follow these steps:
  1. Clone ionic-site into `./../ionic-site`
    - `git clone git@github.com:driftyco/ionic-site ./../ionic-site`
  2. Start jekyll, telling it to rebuild whenever the site changes
    - `cd ./../ionic-site && jekyll serve -w`
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

* Uses these [commit conventions](https://github.com/ajoslin/conventional-changelog)

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
