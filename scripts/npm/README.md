## Ionic Framework Package
 The ionic-framework package comes with both Javascript and Sass frontend dependencies, located in the root of the package, and a Node API, located in `tooling/`.

### Source files:

In the root of the package are ES5 sources in the CommonJS module format, their associated Typescript type definition files, and the Ionic Sass entry files. The Javascript sources are meant to be used by a bundler such as Webpack, SystemJS Builder, or Browserify. The type definitions provide support to Typescript tooling for things like type checking and code completion.

Usually, the only Javascript file required by the user is `ionic.js`, as everything from Ionic can be imported from this file:

```
  import {App, Page} from 'ionic-framework/ionic';
```

### Bundles:

Minified and unminified CommonJS and System.register module format bundles, as well as compiled CSS stylesheets for both Ionic iOS and Material Design are located `bundles/`. These can also be used with bundlers to a certain extent, for example, using Webpack's [`externals option`](https://webpack.github.io/docs/configuration.html#externals).  The SystemJS bundle is  primarily meant to be included in a `<script>` tag for demos, tests and Javascript playgrounds like [Plunker](http://plnkr.co/).

---------

### Tooling

 At the moment, the ionic-framework module exports a single function, `generate`, that can be used to scaffold new pages in an Ionic app. It is used by the [Ionic CLI's](https://github.com/driftyco/ionic-cli) `generate` command.

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
