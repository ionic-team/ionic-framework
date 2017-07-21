# Ionic Angular v4

Ionic components will be working toward embracing web components with the following goals:

- Users continue to use Angular to develop their apps and components
- No changes to the development and build time experience
- Minimal changes to the user’s markup
- Reduce build times
- Reduce startup times
- Ionic components are loaded asynchronously by default and without added configuration

For the most part, `ionic-angular` will continue to work the same way, using the same API as previous versions. However, the implementation of some of the less complex components, such as `ion-badge`, will use the standardized web component v1 spec, which ships today in a majority of browsers. Additionally, for browsers that do not support web components, polyfills are added on-demand, which is already built into `ionic-angular` v4.

We will continue to develop and support ionic-angular v3 in the master branch. Ultimately the differences between v3 and v4 are internal, but on the surface it's the same `ionic-angular` as v3. :beers:


### Breaking Changes

See the [BREAKING](BREAKING.md) file for a full list.


### Testing

Update your `package.json` to match the following dependencies, remove the existing node_modules directory, and then run npm install:

```
"@ionic/app-scripts": "nightly"
"ionic-angular": "canary"
```