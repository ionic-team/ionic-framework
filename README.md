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


### Changes

#### `@NgModule` Updates

What's great is that Angular already supports and works with web components! In order to enable them simply add `CUSTOM_ELEMENTS_SCHEMA` to the `schemas` property of `@NgModule`, such as:

```
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  ...
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

#### `ion-label` Required

Previously an `ion-label` would automatically get added to `ion-item` if one wasn't provided. Now an `ion-label` must always be added if the item is used to display text.

```
  <ion-item>
    <ion-label>Item's Text!</ion-label>
  </ion-item>
```


### Testing

Update your `package.json` to match the following dependencies, remove the existing node_modules directory, and then run npm install:

```
  "@ionic/app-scripts": "nightly"
  "ionic-angular": "canary"
```


### Future Goals

As Ionic components migrate to the web component standard, a goal of ours is to have Ionic components easily work within all of the popular frameworks.
