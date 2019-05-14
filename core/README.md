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
<link href="https://unpkg.com/@ionic/core@4.4.0/css/ionic.bundle.css" rel="stylesheet">
<script src="https://unpkg.com/@ionic/core@4.4.0/dist/ionic.js"></script>
```

Any Ionic component added to the webpage will automatically load. This includes writing the component tag directly in HTML, or using JavaScript such as `document.createElement('ion-toggle')`.

Additionally, within this package is a `dist/ionic.js` file and accompanying `dist/ionic/` directory. These are the same files which are used by the CDN, and they're available in this package so they can be apart of an app's local development.


## Framework Bindings

The `@ionic/core` package can by used in simple HTML, or by vanilla JavaScript without any framework at all. Ionic also has packages that make it easier to integrate Ionic into a framework's traditional ecosystem and patterns. (However, at the lowest-level framework bindings are still just using Ionic Core and Web Components).

* [@ionic/angular](https://www.npmjs.com/package/@ionic/angular)


## How to contribute

[Check out the CONTRIBUTE guide](CONTRIBUTING.md)

## Related

* [Ionic Documentation](https://ionicframework.com/docs/)
* [Ionic Worldwide Slack](http://ionicworldwide.herokuapp.com/)
* [Ionic Forum](https://forum.ionicframework.com/)
* [Ionicons](http://ionicons.com/)
* [Stencil](https://stenciljs.com/)
* [Stencil Worldwide Slack](https://stencil-worldwide.herokuapp.com/)
* [Capacitor](https://capacitor.ionicframework.com/)


## License

* [MIT](https://raw.githubusercontent.com/ionic-team/ionic/master/LICENSE)
