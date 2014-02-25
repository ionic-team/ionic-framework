<a href="https://travis-ci.org/driftyco/ionic"><img src="https://travis-ci.org/driftyco/ionic.png?branch=master" data-bindattr-164="164" title="Build Status Images"></a>

The best place to start with Ionic is our [documentation page](http://ionicframework.com/docs/).

Note: __Ionic is Alpha software__ and currently best supports iOS 6+ and Android 4.1+ (though we are working on Android performance improvements). Ionic is changing quickly as we work towards the beta.

# What is Ionic?

Ionic is the open source HTML5 Mobile Framework for building amazing, cross-platform hybrid native apps with HTML, JavaScript, and CSS. Just like this one:

![Weather Demo](http://ionicframework.com/img/weather1x.png)

We built Ionic because we wanted a framework that focused on building hybrid native apps, rather than mobile websites. We wanted this framework to be obsessive about great design and performance. A framework that left the past behind and focused on the future where mobile devices could make HTML5 feel native.

It's important to realize that Ionic is not a replacement for frameworks used for building mobile web apps. There are a lot
of great solutions that work well for websites, like [jQuery Mobile](http://jquerymobile.com/).

Ionic is also not a good solution if you need to support older generation devices. Our [compatibility](http://ionicframework.com/docs/#browser-support) *starts* at iOS 6 and Android 4.1. We will never support versions earlier than those. This is a framework for the future. Learn more: [Where does the Ionic Framework fit in?](http://ionicframework.com/blog/where-does-the-ionic-framework-fit-in/)


## Quick Start

To start using ionic, you have two options: copy over the built JS and CSS files, or
use the `ionic` tool ([ionic-cli](https://github.com/driftyco/ionic-cli)) which can be installed through npm:

```bash
$ sudo npm install -g ionic
```

Then, you can start a new ionic project by running:

```bash
$ ionic start myproject
```

### Manual Start

- Download the latest **stable** release from:
  * The release folder of this repository
  * The Ionic CDN: [Latest Release](http://code.ionicframework.com/)
  * `bower install ionic` 
- Download the **bleeding edge just-from-master release** from:
  * The Ionic CDN: [Nightly Build](http://code.ionicframework.com/#nightly)
  * Look in the [ionic-bower Repository](https://github.com/driftyco/ionic-bower) for the latest version, and do for example `bower install driftyco/ionic-bower#0.9.23-alpha-652` (`bower install ionic` will have the latest available soon)
  
Once you have a release, use `js/ionic.js`, `js/ionic-angular.js`, and `css/ionic.css`.

For most cases, you'll need AngularJS as well.  This is bundled in `js/angular/` and `js/angular-ui-router/`.


## Demos

 - [Ionic Codepen.io Demos](http://codepen.io/ionic/public-list)


## Community

* Follow [@ionicframework on Twitter](https://twitter.com/ionicframework).
* Subscribe to the [Ionic Newsletter](http://ionicframework.com/subscribe/).
* Have a question that's not a feature request or bug report? [Discuss on the Ionic Forum](http://forum.ionicframework.com/).
* Read our [Blog](http://ionicframework.com/blog/).
* Have a feature request or find a bug? [Submit an issue](https://github.com/driftyco/ionic/issues).


## Authors

**Max Lynch**

+ <https://twitter.com/maxlynch>
+ <https://github.com/mlynch>

**Ben Sperry**

+ <https://twitter.com/benjsperry>
+ <https://github.com/bensperry>

**Adam Bradley**

+ <https://twitter.com/adamdbradley>
+ <https://github.com/adamdbradley>

## Development

* `npm install` to setup
* `grunt` to jshint & build
* `grunt watch` to watch and rebuild on change
* `grunt karma:single` to test one-time
* `grunt karma:watch` to test and re-run on source change
* `grunt protractor:local` to test e2e tests locally (requires static server on port 8080)
* `grunt e2e-watch` to run end to end tests on change of files in `test/e2e/**/*`
* `grunt cloudtest` to run unit & e2e tests in the cloud

### Commit Conventions

* Uses http://github.com/ajoslin/conventional-changelog conventions

### Pushing Releases

(uses AngularJS's bash utils - when you run any script, run it with `--git-push-dryrun=true` to do 'mock' git pushes)

* Run `./scripts/release/finalize-version.sh --action=prepare` to:
  - Remove version suffix
  - Write new version to package/bower/component.json
  - Move build files to `release/`
  - Commit & tag the release
* Run `./scripts/release/finalize-version.sh --action=publish` to:
  - Push out new version
* Once new version is pushed out, run `./scripts/release/initialize-new-version.sh` (usage is shown in file), to bump to next version with bump type / version suffix / version name specified.

## LICENSE

Ionic is licensed under the MIT Open Source license. For more information, see the LICENSE file in this repository.
