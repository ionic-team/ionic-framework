
#### Building & Running

1. At the root of your `ionic2` directory/repo, run: `gulp update.angular`. This will get the latest version of Angular2 master and install it as a sibling directory `../angular-ionic` to wherever your `ionic2` directory is. (It'll take a while to npm install angular2, so go grab a beer).
2. Cd into the `../angular-ionic` directory and run `gulp build` to build out the Angular files. If you are on a clean install, but `../angular-ionic` already exists, run `gulp link.angular` to symlink `angular2` in your `ionic2` working directory to `../angular-ionic`.  This is for the SystemJS builder, which
 can't see below the root directory.
3. Run `npm install` and `jspm install`.  Make sure you have at least version 15.6 of JSPM.  It should not alter your `config.js` or `package.json` files, if it does, make sure you have the proper version of JSPM.
4. In the `ionic2` working directory, run `gulp build.clean`. This will transpile the Ionic project files to es5, bundle them using the [SystemJS builder](https://github.com/systemjs/builder), bundle all of Ionic's dependencies (ie Angular2 and all of its dependencies) into a separate file, and build out all the Ionic examples as well.  In `dist/js/es6/ionic` you will find clean es6 Ionic files (no @Annotations), and in `dist/js/es5/ionic` you will find all of the Babel-transpiled es5 Ionic project files. The two bundles are located at `dist/ionic.bundle.js` and `dist/dependencies.js`, and the examples are located in `dist/examples`.
5. Run `gulp watch`.
6. Go to [http://localhost:8000/dist/examples/](http://localhost:8000/dist/examples/)
7. Stay cool

Note: Once you're setup, you just need to run `gulp watch`, unless you've updated angular and want to rebuild `dependencies.js`.

#### Things you'll probably need to fix

- `@Decorator` is now just `@Directive`
- Components must use an element selector
- `NgElement` is no longer a thing, it's now `ElementRef`. Stuff needs to be fixed.
- All `main.js` test files were renamed to `index.js` to work with angular's build
- imports that are relative paths should start with `./`. For example, instead of `path/module` it should be `./path/module`
- `Component`, `Directive` and `View` should NOT be imported from `angular2/angular2`. You'll probably get "No Directive annotation found on Content" when the wrong import is referenced.
- Import those instead from:

```
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
```

