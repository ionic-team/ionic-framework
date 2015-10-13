# Ionic 2: Developer Preview

Ionic 2 is the next generation of [Ionic](http://ionicframework.com/), the open-source mobile app development SDK that makes it easy to build top quality mobile apps with web technologies.

Ionic 2 is based on the new [2.x version of AngularJS](https://angular.io/), and comes with many significant performance, usability, and feature improvements.

[Ionic 2 Starter](https://github.com/driftyco/ionic2-starter)


### Current Angular 2 known issues:

- Angular 2 is still in alpha and is not production ready
- Angular team has first focused on developing what the core of Angular 2 "is"
- Angular 2 filesize has not been optimized for minification yet
- Angular 2 bootstrap time has not been optimized yet
- As Angular 2 reaches beta there will be significant performance improvements


### ES6/Typescript

- Ionic's source is written using [Typescript](http://www.typescriptlang.org/)
- Ionic apps can be written in ES6
- Typescript is an optional feature to be used at the developers discretion
- Ionic 2 starters come with the necessary build tools to transpile ES6/Typescript


### CSS Attribute Selectors:

- Simple
- Smaller markup
- Easier to read and understand
- [Not an issue](https://twitter.com/paul_irish/status/311610425617838081) for today's mobile browsers
- No performance impacts have been found


### Ionic 2 Starter Project

[https://github.com/driftyco/ionic2-starter](https://github.com/driftyco/ionic2-starter)


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

### Distribution

 - [npm: ionic-framework](https://www.npmjs.com/package/ionic-framework)
