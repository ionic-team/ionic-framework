
#### Building & Running

_** WARNING: This is a temporary hack **_

1. At the root of your `ionic2` directory/repo, run: `gulp update.angular`. This will get the latest version of Angular2 master and install it as a sibling directory `../angular` to wherever your `ionic2` directory is. (It'll take a while to npm install angular2, so go grab a beer).
2. In the `ionic2` working directory, run `gulp watch`. This will copy ionic2 components and test files to the correct angular directories as you're developing.
3. In another terminal, `cd` into the `../angular` directory, and run `gulp serve.js.dev`. This will build out ionic examples too.
4. Go to [http://localhost:8000/examples/src/ionic/](http://localhost:8000/examples/src/ionic/)
5. Stay cool

_** WARNING: This is a temporary hack **_


#### Things you'll probably need to fix

- `@Decorator` is now just `@Directive`
- Components must use an element selector
- NgElement is not longer a thing, it's now ElementRef. Stuff needs to be fixed.
- All `main.js` test files were renamed to `index.js` to work with angular's build
- imports that are relative paths should start with `./`. For example, instead of `path/module` it should be `./path/module`
- `Component`, `Directive` and `View` should NOT be imported from `angular2/angular2`. You'll probably get "No Directive annotation found on Content" when the wrong import is referenced.
- Import those instead from:

```
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
```

