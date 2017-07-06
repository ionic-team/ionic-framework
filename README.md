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

#### Dynamic Mode

Components are no longer able to have their mode changed dynamically. You can change the mode before the first render, but after that it will not style properly because only the initial mode's styles are included.

#### Button

##### Markup Changed

Button should now be written as an `<ion-button>` element. Ionic will determine when to render an anchor tag based on the presence of an `href` attribute.

**Old Usage Example:**

```html
<button ion-button (click)="doSomething()">
  Default Button
</button>

<a ion-button href="#">
  Default Anchor
</a>
```

**New Usage Example:**

```html
<ion-button (click)="doSomething()">
  Default Button
</ion-button>

<ion-button href="#">
  Default Anchor
</ion-button>
```

##### Icon Attributes Renamed

Previously to style icons inside of a button the following attributes were used: `icon-left`, `icon-right`, (and with the added support of RTL) `icon-start`, `icon-end`.

These have been renamed to the following, and moved from the button element to the icon itself:

| Old Property              | New Property   | Property Behavior                                                     |
|---------------------------|----------------|-----------------------------------------------------------------------|
| `icon-left`, `icon-start` | `slot="start"` | Positions to the left of the button in LTR, and to the right in RTL.  |
| `icon-right`, `icon-end`  | `slot="end"`   | Positions to the right of the button in LTR, and to the left in RTL.  |


**Old Usage Example:**

```html
<ion-button icon-left>
  <ion-icon name="home"></ion-icon>
  Icon Left
</ion-button>

<ion-button icon-start>
  <ion-icon name="home"></ion-icon>
  Icon Left on LTR, Right on RTL
</ion-button>

<ion-button icon-right>
  Icon Right
  <ion-icon name="home"></ion-icon>
</ion-button>

<ion-button icon-end>
  Icon Right on LTR, Left on RTL
  <ion-icon name="home"></ion-icon>
</ion-button>
```

**New Usage Example:**

```html
<ion-button>
  <ion-icon slot="start" name="home"></ion-icon>
  Icon Left on LTR, Right on RTL
</ion-button>

<ion-button>
  Icon Right on LTR, Left on RTL
  <ion-icon slot="end" name="home"></ion-icon>
</ion-button>
```


#### Item

##### Label Required

Previously an `ion-label` would automatically get added to an `ion-item` if one wasn't provided. Now an `ion-label` should always be added if the item is used to display text.

```html
<ion-item>
  <ion-label>Item Label</ion-label>
</ion-item>
```

##### Attributes Renamed

Previously to position elements inside of an `ion-item` the following attributes were used: `item-left`, `item-right`, (and with the added support of RTL) `item-start`, `item-end`.

These have been renamed to the following:

| Old Property              | New Property   | Property Behavior                                                   |
|---------------------------|----------------|---------------------------------------------------------------------|
| `item-left`, `item-start` | `slot="start"` | Positions to the left of the item in LTR, and to the right in RTL.  |
| `item-right`, `item-end`  | `slot="end"`   | Positions to the right of the item in LTR, and to the left in RTL.  |


**Old Usage Example:**

```html
<ion-item>
  <div item-left>Left</div>
  <ion-label>Item Label</ion-label>
  <div item-right>Right</div>
</ion-item>

<ion-item>
  <div item-start>Left on LTR, Right on RTL</div>
  <ion-label>Item Label</ion-label>
  <div item-end>Right on LTR, Left on RTL</div>
</ion-item>
```

**New Usage Example:**

```html
<ion-item>
  <div slot="start">Left on LTR, Right on RTL</div>
  <ion-label>Item Label</ion-label>
  <div slot="end">Right on LTR, Left on RTL</div>
</ion-item>
```


#### Toolbar

##### Attributes Renamed

The attributes to position an `ion-buttons` element inside of a toolbar have been renamed, as well as the behavior attached to the name. We noticed there was some confusion behind the behavior of the `start` and `end` attributes, and with the new support for RTL we wanted to make the behavior of these match RTL. In order to do this we had to rename the old `start`/`end` to something that makes more sense with their behavior.

The names and behavior of each of the properties was previously:

| Old Property | Property Behavior                                                                                            |
|--------------|--------------------------------------------------------------------------------------------------------------|
| `start`      | Positions element to the left of the content in `ios` mode, and directly to the right in `md` and `wp` mode. |
| `end`        | Positions element to the right of the content in `ios` mode, and to the far right in `md` and `wp` mode.     |
| `left`       | Positions element to the left of all other elements.                                                         |
| `right`      | Positions element to the right of all other elements.                                                        |

The properties have been renamed to the following:

| Old Property | New Property        | Property Behavior                                                                                                |
|--------------|---------------------|------------------------------------------------------------------------------------------------------------------|
| `start`      | `slot="mode-start"` | Positions element to the `left` of the content in `ios` mode, and directly to the `right` in `md` and `wp` mode. |
| `end`        | `slot="mode-end"`   | Positions element to the `right` of the content in `ios` mode, and to the far right in `md` and `wp` mode.       |
| `left`       | `slot="start"`      | Positions element to the `left` of all other elements in `LTR`, and to the `right` in `RTL`.                     |
| `right`      | `slot="end"`        | Positions element to the `right` of all other elements in `LTR`, and to the `left` in `RTL`.                     |


### Testing

Update your `package.json` to match the following dependencies, remove the existing node_modules directory, and then run npm install:

```
  "@ionic/app-scripts": "nightly"
  "ionic-angular": "canary"
```


### Future Goals

As Ionic components migrate to the web component standard, a goal of ours is to have Ionic components easily work within all of the popular frameworks.
