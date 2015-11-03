# Ionic 2: Alpha

Ionic 2 is the next generation of [Ionic](http://ionicframework.com/), the open-source mobile app development SDK that makes it easy to build top quality mobile apps with web technologies.

Ionic 2 is based on the new [2.x version of AngularJS](https://angular.io/), and comes with many significant performance, usability, and feature improvements.

See [Adam Bradley](http://twitter.com/adamdbradley)'s [Building apps with Ionic 2](http://adamdbradley.github.io/building-with-ionic2) slides for a quick overview of Ionic 2.

### Try Ionic 2

To try Ionic 2 today, visit the [Ionic 2 Docs](http://ionicframework.com/docs/v2/). We would love any feedback you have or to know when you encounter issues, by filing an issue report on this repo.

### Ionic 2 Examples

There are a few real Ionic 2 apps in the wild. The most complete is the [Ionic Conference App](https://github.com/driftyco/ionic-conference-app), a perfect starting point for building your own conference app.

We are also building out a number of starter projects, including the Ionic 2 starter:

[https://github.com/driftyco/ionic2-starter](https://github.com/driftyco/ionic2-starter)

## Distribution

 - [npm: ionic-framework](https://www.npmjs.com/package/ionic-framework)

## Ionic Framework Package
 The ionic-framework package comes with both frontend dependencies, located in 'dist', and a Node API, located in 'tooling'.

### Bundles:

 - `css/`
     - the Ionic CSS stylesheet
 - `fonts/`
     - Ionicons and Roboto fonts
 - `js/`
     - `ionic.js` the Ionic module, in System register format
     - `ionic.bundle.js` the Ionic bundle, contains:
          - es6-module-loader.js
          - system.js
          - angular2.dev.js
          - router.dev.js (angular2 router)
          - ionic.js
          - web-animations.min.js
     - `web-animations.min.js` web animations API polyfill

### Source files:

 - `src/es5` - Ionic ES5 source files in both CommonJS and System module formats
 - `src/es6` - Ionic ES6 source files
 - `src/ts` - Ionic TypeScript source files (typings still missing)
 - `scss` - Ionic Sass source files

---------

### Tooling

 At the moment, ionic-framework exports one function, `generate`, that can be used to scaffold new pages in an Ionic app. It is used by the [Ionic CLI's](https://github.com/driftyco/ionic-cli) `generate` command.

#### Methods

`generate(config)`

Creates the js, html, and scss file for a new page, based on the supplied [Generator](#generators).

- **config** (Object) Config object, with the following options:
  - `appDirectory` - root directory of the Ionic project
  - `generator` - which [generator](#generators) to use, default is `page`.
  - `name` - the name of the component to generate.

Example:
 ```
 var ionic = require('ionic-framework');
 ionic.generate({ appDirectory: process.cwd(), generator: 'tabs', name: 'MyTabsPage' })
 ```

#### Generators
- `page`, a blank page
- `tabs`, a page with tab navigation
 
