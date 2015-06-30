# Ionic 2

Ionic 2 is the next generation of [Ionic](http://ionicframework.com/), the popular open-source mobile app development SDK that makes it easy to build top quality mobile apps with web technologies.

Ionic 2 is based on the new 2.x version of AngularJS, and comes with many significant performance, usability,
and feature improvements.

For a quick intro to Ionic 2, see the [guide](GUIDE.md).

#### Building & Running

1. Run `npm install`.
2. In the `ionic2` working directory, run `gulp watch`. This will transpile the Ionic project files to es5 (using the 'system' module format), bundle them, build out all the Ionic examples, and watch for future changes.  In `dist/js/es6/ionic` you will find clean es6 Ionic files (no @Annotations), and in `dist/js/es5/ionic` you will find all of the Babel-transpiled es5 Ionic project files. The Ionic bundle is located at `dist/js/ionic.bundle.js` and the examples are located in `dist/examples`.
3. Go to [http://localhost:8000/dist/examples/](http://localhost:8000/dist/examples/)
4. Stay cool
