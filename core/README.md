# @ionic/core

[Ionic](https://ionicframework.com/) is an open source App Development Framework that makes it easy to build top quality Native and Progressive Web Apps with web technologies.

The Ionic Core package contains the Web Components that make up the reusable UI building blocks of Ionic Framework. These components are designed to be used in traditional frontend view libraries/frameworks (such as [Stencil](https://stenciljs.com/), React, Angular, or Vue), or on their own through traditional JavaScript in the browser.


## Features

* Tiny, highly optimized components built with [Stencil](https://stenciljs.com/)
* Styling for both iOS and Material Design
* No build or compiling required
* Simply add the static files to any project
* Lazy-loaded components without configuration
* Asynchronous rendering
* Theming through CSS Variables


## How to use

### Vanilla HTML

Easiest way to start using Ionic Core is by adding a script tag to the CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.js"></script>
<link href="https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css" rel="stylesheet">
```

Any Ionic component added to the webpage will automatically load. This includes writing the component tag directly in HTML, or using JavaScript such as `document.createElement('ion-toggle')`.

Additionally, within this package is a `dist/ionic.js` file and accompanying `dist/ionic/` directory. These are the same files which are used by the CDN, and they're available in this package so they can be apart of an app's local development.


## Framework Bindings

The `@ionic/core` package can be used in simple HTML, or by vanilla JavaScript without any framework at all. Ionic also has packages that make it easier to integrate Ionic into a framework's traditional ecosystem and patterns. (However, at the lowest-level framework bindings are still just using Ionic Core and Web Components).

* [@ionic/angular](https://www.npmjs.com/package/@ionic/angular)


## Custom Elements Build

In addition to the default, self lazy-loading components built by Stencil, this package also comes with each component exported as a stand-alone custom element within `@ionic/core/components`. Each component extends `HTMLElement`, and does not lazy-load itself. Instead, this package is useful for projects already using a bundler such as Webpack or Rollup. While all components are available to be imported, the custom elements build also ensures bundlers only import what's used, and tree-shakes any unused components.

Below is an example of importing `ion-badge`, and initializing Ionic so it is able to correctly load the "mode", such as Material Design or iOS. Additionally, the `initialize({...})` function can receive the Ionic config.

```typescript
import { defineCustomElement } from "@ionic/core/components/ion-badge.js";
import { initialize } from "@ionic/core/components";

// Initializes the Ionic config and `mode` behavior
initialize();

//  Defines the `ion-badge` web component
defineCustomElement();
```

Notice how we import from `@ionic/core/components` as opposed to `@ionic/core`. This helps bundlers pull in only the code that is needed.

The `defineCustomElement` function will automatically define the component as well as any child components that may be required.

For example, if you wanted to use `ion-modal`, you would do the following:

```typescript
import { defineCustomElement } from "@ionic/core/components/ion-modal.js";
import { initialize } from "@ionic/core/components";

// Initializes the Ionic config and `mode` behavior
initialize();

//  Defines the `ion-modal` and child `ion-backdrop` web components.
defineCustomElement();
```

The `defineCustomElement` function will define `ion-modal`, but it will also define `ion-backdrop`, which is a component that `ion-modal` uses internally.

### Using Overlay Controllers

When using an overlay controller, developers will need to define the overlay component before it can be used. Below is an example of using `modalController`:

```typescript
import { defineCustomElement } from '@ionic/core/components/ion-modal.js';
import { initialize, modalController } from '@ionic/core/components';

initialize();
defineCustomElement();

const showModal = async () => {
  const modal = await modalController.create({ ... });
  
  ...
}
```

## How to contribute

[Check out the CONTRIBUTE guide](/.github/CONTRIBUTING.md)

## Related

* [Ionic Documentation](https://ionicframework.com/docs/)
* [Ionic Forum](https://forum.ionicframework.com/)
* [Ionicons](http://ionicons.com/)
* [Stencil](https://stenciljs.com/)
* [Stencil Worldwide Slack](https://stencil-worldwide.slack.com/)
* [Capacitor](https://capacitor.ionicframework.com/)


## License

* [MIT](https://raw.githubusercontent.com/ionic-team/ionic/master/LICENSE)
