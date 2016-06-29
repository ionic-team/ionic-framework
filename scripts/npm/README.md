## Ionic Framework 2.x

The official npm package for [Ionic 2](http://ionicframework.com/), complete with pre-built ES5 bundles, TypeScript definitions, Sass files, CommonJS ES5 files, and more.

To get started with Ionic 2, please read the [Installation Guide](http://ionicframework.com/docs/v2/getting-started/installation/).

[Ionic 2 Documentation](http://ionicframework.com/docs/v2/)

### Source files

In the root of the package are ES5 sources in the CommonJS module format, their associated Typescript type definition files, and the Ionic Sass entry files. The Javascript sources are meant to be used by a bundler such as Webpack, SystemJS Builder, or Browserify. The type definitions provide support to Typescript tooling for things like type checking and code completion.

Usually, the only import required by the user is `ionic-angular`, as everything from Ionic is exported by the package:

```
  import { App, NavController } from 'ionic-angular';
```

### Bundles

Minified and unminified CommonJS and System.register module format bundles, as well as compiled CSS stylesheets for both Ionic iOS and Material Design are located `bundles/`. The SystemJS bundle is  primarily meant to be included in a `<script>` tag for demos, tests and Javascript playgrounds like [Plunker](http://plnkr.co/).

### Installation and More

To use Ionic 2, we recommend installing and utilizing the [Ionic CLI](http://ionicframework.com/docs/v2/getting-started/installation/) which will help you create pre-configured Ionic apps.

For full instructions on using Ionic 2, please visit the [Ionic 2 Documentation](http://ionicframework.com/docs/v2/)

