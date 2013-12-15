<a href="https://travis-ci.org/driftyco/ionic"><img src="https://travis-ci.org/driftyco/ionic.png?branch=master" data-bindattr-164="164" title="Build Status Images"></a>

The best place to start with Ionic is our [documentation page](http://ionicframework.com/docs/).

Note: __Ionic is Alpha software__ and currently best supports iOS 6+ and Android 4.1+ (though we are working on Android performance improvements). Ionic is changing quickly as we work towards the beta.

# What is Ionic?

Ionic is the open source HTML5 Mobile Framework for building amazing, cross-platform hybrid native apps with HTML, JavaScript, and CSS.

We built Ionic because we wanted a framework that focused on building hybrid native apps, rather than mobile websites. We wanted this framework to be obsessive about great design and performance. A framework that left the past behind and focused on the future where mobile devices could make HTML5 feel native.

It's important to realize that Ionic is not a replacement for frameworks used for building mobile web apps. There are a lot
of great solutions that work well for websites, like [jQuery Mobile](http://jquerymobile.com/).

Ionic is also not a good solution if you need to support older generation devices. Our [compatibility](http://ionicframework.com/docs/#browser-support) *starts* at iOS 6 and Android 4.1. We will never support versions earlier than those. This is a framework for the future. Learn more, [Where does the Ionic Framework fit in?](http://ionicframework.com/blog/where-does-the-ionic-framework-fit-in/)


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

The source files are in the `dist/` folder. You can just grab the `dist/js/ionic.js`, `dist/js/ionic-angular.js`, and `dist/ionic.css` files and
you'll be good to go. For most cases, you'll need AngularJS as well, which we bundle a current 1.2.x version in `dist/js/angular`.

## Running examples

You will first have to install dependencies by running:

    npm install

Make sure that you have [npm](https://github.com/isaacs/npm) already installed.

Ionic comes with many interesting examples showing the power of the framework. To
check them out, navigate into the source folder, and start a web server. The easiest
way is to use Python:

    python -m SimpleHTTPServer 8000

    node_modules/grunt-cli/bin/grunt watch

    http://localhost:8000/examples/starters/

    http://localhost:8000/test/


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

+ <https://twitter.com/helloimben>
+ <https://github.com/bensperry>

**Adam Bradley**

+ <https://twitter.com/adamdbradley>
+ <https://github.com/adamdbradley>


## LICENSE

Ionic is licensed under the MIT Open Source license. For more information, see the LICENSE file in this repository.
