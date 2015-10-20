# Ionic 2: Developer Preview

Ionic 2 is the next generation of [Ionic](http://ionicframework.com/), the open-source mobile app development SDK that makes it easy to build top quality mobile apps with web technologies.

Ionic 2 is based on the new [2.x version of AngularJS](https://angular.io/), and comes with many significant performance, usability, and feature improvements.

[Ionic 2 Starter](https://github.com/driftyco/ionic2-starter)

### Try Ionic 2

To try Ionic 2 today, visit the [http://ionicframework.com/docs/v2/getting-started/](Getting Started) page. We would love any feedback you have or to know when you encounter issues, by filing an issue report on this repo.


### Ionic 2 Starter Project

Here is an example of a complete Ionic 2 starter app:

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
