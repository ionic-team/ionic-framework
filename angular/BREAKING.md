
# Breaking Changes

## Migrating

### Migration Guide

If you aren't sure where to start in upgrading to v4, we recommend reading through our [migration guide](https://ionicframework.com/docs/building/migration) first.

### Migration Linter

Looking for a tool that automatically warns (and sometimes fixes) the breaking changes listed? Check out our [migration linter](https://github.com/ionic-team/v4-migration-tslint)!


## Components

A list of the breaking changes introduced to each component in Ionic Angular v4.

- [Action Sheet](#action-sheet)
- [Alert](#alert)
- [Back Button](#back-button)
- [Button](#button)
- [Colors](#colors)
- [Component Imports](#component-imports)
- [Content](#content)
- [Datetime](#datetime)
- [Dynamic Mode](#dynamic-mode)
- [FAB](#fab)
- [Fixed Content](#fixed-content)
- [Grid](#grid)
- [Icon](#icon)
- [Infinite Scroll](#infinite-scroll)
- [Item](#item)
- [Item Divider](#item-divider)
- [Item Options](#item-options)
- [Item Sliding](#item-sliding)
- [Label](#label)
- [List Header](#list-header)
- [Loading](#loading)
- [Menu](#menu)
- [Menu Toggle](#menu-toggle)
- [Modal](#modal)
- [Nav](#nav)
- [Navbar](#navbar)
- [Option](#option)
- [Overlays](#overlays)
- [Popover](#popover)
- [Radio](#radio)
- [Range](#range)
- [Refresher](#refresher)
- [Scroll](#scroll)
- [Segment Button](#segment-button)
- [Select](#select)
- [Show When / Hide When](#show-when--hide-when)
- [Spinner](#spinner)
- [Tabs](#tabs)
- [Text / Typography](#text--typography)
- [Theming](#theming)
- [Toast](#toast)
- [Toolbar](#toolbar)


## Action Sheet

The `title`, `subTitle` and `enableBackdropDismiss` properties has been renamed to `header`, `subHeader` and `backdropDismiss` respectively.

**Old Usage Example:**

```js
const actionSheet = await actionSheetCtrl.create({
  title: 'This is the title',
  subTitle: 'this is the sub title',
  enableBackdropDismiss: false
});
await actionSheet.present();
```

**New Usage Example:**

```js
const actionSheet = await actionSheetCtrl.create({
  header: 'This is the title',
  subHeader: 'this is the sub title',
  backdropDismiss: false
});
await actionSheet.present();
```


## Alert

The `title`, `subTitle` and `enableBackdropDismiss` properties has been renamed to `header`, `subHeader` and `backdropDismiss` respectively.

**Old Usage Example:**

```js
const alert = await alertCtrl.create({
  title: 'This is the title',
  subTitle: 'this is the sub title',
  enableBackdropDismiss: false
});
await alert.present();
```

**New Usage Example:**

```js
const alert = await alertCtrl.create({
  header: 'This is the title',
  subHeader: 'this is the sub title',
  backdropDismiss: false
});
await alert.present();
```


## Back Button

The back button is no longer added by default to a navigation bar. It should be explicitly written in a toolbar:

**Old Usage Example:**

```html
<ion-navbar>
  <ion-title>Back Button Example</ion-title>
</ion-navbar>
```

**New Usage Example:**

```html
<ion-toolbar>
  <ion-buttons slot="start">
    <ion-back-button></ion-back-button>
  </ion-buttons>
  <ion-title>Back Button Example</ion-title>
</ion-toolbar>
```

See the [back button documentation](https://github.com/ionic-team/ionic/blob/master/core/src/components/back-button) for more usage examples.

## Button

### Markup Changed

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

### Attributes Renamed

Previously to style icons inside of a button the following attributes were used: `icon-left`, `icon-right`, (and with the added support of RTL) `icon-start`, `icon-end`.

These have been renamed to the following, and moved from the button element to the icon itself:

| Old Property              | New Property   | Property Behavior                                                     |
|---------------------------|----------------|-----------------------------------------------------------------------|
| `icon-left`, `icon-start` | `slot="start"` | Positions to the left of the button in LTR, and to the right in RTL.  |
| `icon-right`, `icon-end`  | `slot="end"`   | Positions to the right of the button in LTR, and to the left in RTL.  |

In addition, several sets of mutually exclusive boolean attributes have been combined into a single string attribute.

The `small` and `large` attributes are now combined under the `size` attribute. The `clear`, `outline`, and `solid` attributes have been combined under `fill`. The `full` and `block` attributes have been combined under `expand`. And, lastly, the `round` attribute is now used under `shape`.

| Old Property                | New Property | Property Behavior           |
| --------------------------- | ------------ | --------------------------- |
| `small`, `large`            | `size`       | Sets the button size.       |
| `clear`, `outline`, `solid` | `fill`       | Sets the button fill style. |
| `full`, `block`             | `expand`     | Sets the button width.      |
| `round`                     | `shape`      | Sets the button shape.      |


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

<ion-button large>
  Large Button
</ion-button>

<ion-button outline>
  Outline Button
</ion-button>

<ion-button full>
  Full-width Button
</ion-button>

<ion-button round>
  Round Button
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

<ion-button size="large">
  Large Button
</ion-button>

<ion-button fill="outline">
  Outline Button
</ion-button>

<ion-button expand="full">
  Full-width Button
</ion-button>

<ion-button shape="round">
  Round Button
</ion-button>
```


## Colors

The default Ionic theme colors have changed. Previously we had:

```
primary:         #327eff
secondary:       #32db64
danger:          #f53d3d
light:           #f4f4f4
dark:            #222
```

Some of their values have changed, and we now include more colors by default:

```
primary:         #3880ff
secondary:       #0cd1e8
tertiary:        #7044ff
success:         #10dc60
warning:         #ffce00
danger:          #f04141
light:           #f4f5f8
medium:          #989aa2
dark:            #222428
```

The `secondary` color saw the largest change. If you were previously using our `secondary` color we recommend switching to `success` instead.


## Component Imports

For consistency with other frameworks and the rest of APIs and tooling, the exported
Ionic components are now prefixed with `Ion`:

```diff
- import { Input, List, Slides } from 'ionic-angular';
+ import { IonInput, IonList, IonSlides } from '@ionic/angular';
```


## Content

Content is now a drop-in replacement for `ion-scroll`. This makes `ion-content` much more flexible. It can be used anywhere, even nested.

### Method Removed

The `resize` method has been removed from Content. In Ionic 4, the `ion-content` is based on a flex layout. This means the content size will automatically adjust without requiring a call to `resize()`.


### Attributes Renamed


| Old Property | New Property          | Property Behavior |
|--------------|-----------------------|-------------------------------------------------------------------------|
| no-bounce    | forceOverflow="false" | If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce. |


## Datetime

The Datetime classes and interfaces have changed capitalization from `DateTime` to `Datetime`. This is more consistent with other components and their tags.

**Old Usage Example:**

```javascript
import { DateTime } from 'ionic-angular';
```

**New Usage Example:**

```javascript
import { Datetime } from '@ionic/angular';
```


## Dynamic Mode

Components are no longer able to have their mode changed dynamically. You can change the mode before the first render, but after that it will not style properly because only the initial mode's styles are included.


## Events

Events now emit as a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) interface that extends the [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) interface. This interface includes a `detail` property that holds any data passed when the event is triggered.

This allows you to still get the details of the event. For example, to get the target where the event was dispatched, such as a button that was clicked, you can read in the value of `event.target`.

**Old Usage Example:**

```html
<ion-select (ionChange)="onSelectChange($event)">
```

```typescript
onSelectChange(event) {
  const value = event.value;
  console.log('Select value is', value);
}
```

**New Usage Example:**

```typescript
onSelectChange(event: CustomEvent) {
  const value = event.detail.value;
  console.log('Select value is', value);
}
```


## FAB

### Markup Changed

Buttons inside of an `<ion-fab>` container should now be written as an `<ion-fab-button>` element. Ionic will determine when to render an anchor tag based on the presence of an `href` attribute.

**Old Usage Example:**

```html
<ion-fab top right edge>
  <button ion-fab>
    <ion-icon name="add"></ion-icon>
  </button>
  <ion-fab-list>
    <button ion-fab>
      <ion-icon name="logo-facebook"></ion-icon>
    </button>
    <button ion-fab>
      <ion-icon name="logo-twitter"></ion-icon>
    </button>
    <button ion-fab>
      <ion-icon name="logo-vimeo"></ion-icon>
    </button>
    <button ion-fab>
      <ion-icon name="logo-googleplus"></ion-icon>
    </button>
  </ion-fab-list>
</ion-fab>
```

**New Usage Example:**

```html
<ion-fab vertical="top" horizontal="end" edge>
  <ion-fab-button>
    <ion-icon name="add"></ion-icon>
  </ion-fab-button>
  <ion-fab-list>
    <ion-fab-button>
      <ion-icon name="logo-facebook"></ion-icon>
    </ion-fab-button>
    <ion-fab-button>
      <ion-icon name="logo-twitter"></ion-icon>
    </ion-fab-button>
    <ion-fab-button>
      <ion-icon name="logo-vimeo"></ion-icon>
    </ion-fab-button>
    <ion-fab-button>
      <ion-icon name="logo-googleplus"></ion-icon>
    </ion-fab-button>
  </ion-fab-list>
</ion-fab>
```

### Attributes Renamed

The mutually exclusive boolean attributes to position the fab have been combined into two single string attributes.

The attributes to align the fab horizontally are now combined under the `horizontal` attribute and the attributes to align the fab vertically are now combined under the `vertical` attribute:

| Old Property | New Property         | Property Behavior                                                       |
|--------------|----------------------|-------------------------------------------------------------------------|
| left         | Removed, see `start` |                                                                         |
| right        | Removed, see `end`   |                                                                         |
| center       | `horizontal="center"`| Positions to the center of the viewport.                                |
| start        | `horizontal="start"` | Positions to the left of the viewport in LTR, and to the right in RTL.  |
| end          | `horizontal="end"`   | Positions to the right of the viewport in LTR, and to the left in RTL.  |
| top          | `vertical="top"`     | Positions at the top of the viewport.                                   |
| bottom       | `vertical="bottom"`  | Positions at the bottom of the viewport.                                |
| middle       | `vertical="center"`  | Positions at the center of the viewport.                                |

_Note that `middle` has been changed to `center` for the vertical positioning._

**Old Usage Example:**

```html
<ion-fab top right edge>
  <!-- fab buttons and lists -->
</ion-fab>

<ion-fab center middle>
  <!-- fab buttons and lists -->
</ion-fab>
```

**New Usage Example:**

```html
<ion-fab vertical="top" horizontal="end" edge>
  <!-- fab buttons and lists -->
</ion-fab>

<ion-fab vertical="center" horizontal="center">
  <!-- fab buttons and lists -->
</ion-fab>
```

## Fixed Content

The `<ion-fab>` container was previously placed inside of the fixed content by default. Now, any fixed content should use the `fixed` slot.

**Old Usage Example:**

```html
<ion-content>
  <ion-fab top right edge>
    <!-- fab buttons and lists -->
  </ion-fab>
  Scrollable Content
</ion-content>
```

**New Usage Example:**

```html
<ion-fab vertical="top" horizontal="end" edge slot="fixed">
  <!-- fab buttons and lists -->
</ion-fab>
<ion-content>
  Scrollable Content
</ion-content>
```

## Grid

### Markup Changed

The Grid has been refactored in order to support css variables and a dynamic number of columns. The following column attributes have been changed.

_In the following examples, `{breakpoint}` refers to the optional screen breakpoint (xs, sm, md, lg, xl) and `{value}` refers to the number of columns (`auto` or a number between `1` and `12`)._

- `col-{breakpoint}-{value}` attributes have been renamed to `size-{breakpoint}=“{value}”`
- `offset-{breakpoint}-{value}` attributes have been renamed to `offset-{breakpoint}=“{value}”`
- `push-{breakpoint}-{value}` attributes have been renamed to `push-{breakpoint}=“{value}”`
- `pull-{breakpoint}-{value}` attributes have been renamed to `pull-{breakpoint}=“{value}”`

Customizing the padding and width of a grid should now be done with css variables. For more information, see [Grid Layout](https://github.com/ionic-team/ionic-docs/blob/master/src/content/layout/grid.md).

## Icon

### Fonts Removed

Icons have been refactored to use SVGs instead of fonts. Ionic will only fetch the SVG for the icon when it is needed, instead of having a large font file that is always loaded in.

If any `CSS` is being overridden for an icon it will need to change to override the SVG itself. Below is a usage example of the differences in changing the icon color.

**Old Usage Example:**

```css
.icon {
  color: #000;
}
```

**New Usage Example:**

```css
ion-icon {
  fill: #000;
}
```

_Note: we are no longer adding the `icon` class to an `ion-icon`, so the element should be targeted instead._


### Property Removed

The `isActive` property has been removed. It only worked for `ios` icons previously. If you would like to switch between an outline and solid icon you should set it in the `name`, or `ios`/`md` attribute and then change it when needed.

## Infinite Scroll

### Method Removed

The `enable()` method has been removed in favor of using the `disabled` property on the `ion-infinite-scroll` element.

**Old Usage Example:**

```html
<ion-infinite-scroll (ionInfinite)="doInfinite($event)">
  <ion-infinite-scroll-content></ion-infinite-scroll-content>
</ion-infinite-scroll>
```

```javascript
doInfinite(infiniteScroll) {
  console.log('Begin async operation');

  setTimeout(() => {
    console.log('Async operation has ended');
    infiniteScroll.complete();

    // To disable the infinite scroll
    infiniteScroll.enable(false);
  }, 500);
}
```

**New Usage Example:**

```html
<ion-infinite-scroll (ionInfinite)="doInfinite($event)">
  <ion-infinite-scroll-content></ion-infinite-scroll-content>
</ion-infinite-scroll>
```

```javascript
doInfinite(event) {
  console.log('Begin async operation');

  setTimeout(() => {
    console.log('Async operation has ended');
    event.target.complete();

    // To disable the infinite scroll
    event.target.disabled = true;
  }, 500);
}
```


## Item

### Markup Changed

Item should now be written as an `<ion-item>` element. Ionic will determine when to render an anchor tag based on the presence of an `href` attribute, and a button tag based on the presence of an `onclick` or `button` attribute. Otherwise, it will render a div.

**Old Usage Example:**

```html
<ion-item>
  Default Item
</ion-item>

<button ion-item (click)="doSomething()">
  Button Item
</button>

<a ion-item href="#">
  Anchor Item
</a>
```

**New Usage Example:**

```html
<ion-item>
  <ion-label>
    Default Item
  </ion-label>
</ion-item>

<ion-item button (click)="doSomething()">
  <ion-label>
    Button Item
  </ion-label>
</ion-item>

<ion-item href="#">
  <ion-label>
    Anchor Item
  </ion-label>
</ion-item>
```

### Label Required

Previously an `ion-label` would automatically get added to an `ion-item` if one wasn't provided. Now an `ion-label` should always be added in the item component.

```html
<ion-item>
  <ion-label>
    Item Label
  </ion-label>
</ion-item>
```

### Attributes Renamed

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

### Detail Push

The attributes to show/hide the detail arrows on items have been converted to a single property and value. Instead of writing `detail-push` or `detail-none` to show/hide the arrow, it should be written `detail`/`detail="true"` or `detail="false"`.

**Old Usage Example:**

```html
<button ion-item detail-none>
  <ion-label>Item Label</ion-label>
</button>

<ion-item detail-push>
  <ion-label>Item Label</ion-label>
</ion-item>
```

**New Usage Example:**

```html
<ion-item button detail="false">
  <ion-label>Item Label</ion-label>
</ion-item>

<ion-item detail>
  <ion-label>Item Label</ion-label>
</ion-item>
```

By default, items that render buttons or anchor tags will show the arrow in `ios` mode.

## Item Divider

### Label Required

Previously an `ion-label` would automatically get added to an `ion-item-divider` if one wasn't provided. Now an `ion-label` should always be added around the text.

```html
<ion-item-divider>
  <ion-label>Item Divider Label</ion-label>
</ion-item-divider>
```


## Item Options

### Attributes Renamed

Previously to position the item options inside of an `ion-item-sliding` the `side` attribute would be used with one of the following values: `"left"`, `"right"`.

These values have been renamed to `"start"` and `"end"` to better align with our support for RTL.


| Old Value       | New Value       |
|-----------------|-----------------|
| `side="left"`   | `side="start"`  |
| `side="right"`  | `side="end"`    |


## Item Sliding

### Markup Changed

The option component should now be written as an `ion-item-option`. Previously it was written as a `button` with an `ion-button` directive. The `ion-item-option` element will render a native button element inside of it.

**Old Usage Example:**

```html
<ion-item-sliding>
  <ion-item>
    Item 1
  </ion-item>
  <ion-item-options side="right">
    <button ion-button expandable>
      <ion-icon name="star"></ion-icon>
    </button>
  </ion-item-options>
</ion-item-sliding>
```

**New Usage Example:**

```html
<ion-item-sliding>
  <ion-item>
    <ion-label>Item 1</ion-label>
  </ion-item>
  <ion-item-options side="end">
    <ion-item-option expandable>
      <ion-icon name="star"></ion-icon>
    </ion-item-option>
  </ion-item-options>
</ion-item-sliding>
```

### Method Renamed

The `getSlidingPercent` method has been renamed to `getSlidingRatio` since the function is returning a ratio of the open amount of the item compared to the width of the options.

### Arguments Changed

The `ionDrag` event no longer gets the sliding item as an argument. It now takes an event with a property `details` which contains two properties `amount` and `ratio` reflecting the absolute and ratio values of the sliding action respectively.

**Old Usage Example:**

```typescript
dragged(item: ItemSliding) {
  console.log(item.getSlidingPercent());
  console.log(item.getOpenAmount());
}
```

**New Usage Example:**
```typescript
dragged(ev: { details: { amount: number, ratio: number } }) {
  console.log(ev.details.ratio);
  console.log(ev.details.amount);
}
```

## Label

### Attributes Renamed

The attributes to set label position in an item are now combined under the `position` attribute:

| Old Property | New Property         | Property Behavior                                                            |
|--------------|----------------------|------------------------------------------------------------------------------|
| fixed        | `position="fixed"`   | A persistent label that sits next the input.                                 |
| floating     | `position="floating"`| A label that will float above the input if the input is empty or loses focus.|
| stacked      | `position="stacked"` | A stacked label will always appear on top of the input.                      |

**Old Usage Example:**

```html
<ion-item>
  <ion-label floating>Floating Label</ion-label>
  <!-- input -->
</ion-item>

<ion-item>
  <ion-label fixed>Fixed Label</ion-label>
  <!-- input -->
</ion-item>
```

**New Usage Example:**

```html
<ion-item>
  <ion-label position="floating">Floating Label</ion-label>
  <!-- input -->
</ion-item>

<ion-item>
  <ion-label position="fixed">Fixed Label</ion-label>
  <!-- input -->
</ion-item>
```


## List Header

### Label Required

Previously an `ion-label` would automatically get added to an `ion-list-header` if one wasn't provided. Now an `ion-label` should always be added around the text.

```html
<ion-list-header>
  <ion-label>List Header Label</ion-label>
</ion-list-header>
```

## Loading

See [Overlays](#overlays).


## Menu

### Properties Renamed

- The `swipeEnabled` property has been renamed to `swipeGesture`.
- The `content` prop has been renamed to `contentId` and it points to the DOM id of the content.

**Old Usage Example:**

```html
<ion-menu swipeEnabled="false" content="nav"> </ion-menu>

<ion-nav #nav></ion-nav>
```

**New Usage Example:**

```html
<ion-menu swipeGesture="false" contentId="nav"> </ion-menu>

<ion-nav id="nav"></ion-nav>
```


### Events Renamed

- `ionClose` was renamed to `ionDidClose`
- `ionOpen` was renamed to `ionDidOpen`


## Menu Toggle

### Markup Changed

The `menuToggle` attribute should not be added to an element anymore. Elements that should toggle a menu should be wrapped in an `ion-menu-toggle` element.

**Old Usage Example:**

```html
<button ion-button menuToggle>
  Toggle Menu
</button>
```

**New Usage Example:**

```html
<ion-menu-toggle>
  <ion-button>
    Toggle Menu
  </ion-button>
</ion-menu-toggle>
```

## Modal

### Arguments Changed

The component is no longer the first argument in the `create` method. Instead, a single argument of type `ModalOptions` is passed in with a `component` property and the value is the component as part of the passed object.

**Old Usage Example:**

```javascript
import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { ModalPage } from './modal-page';

@Component({
  ...
})
export class MyPage {

  constructor(public modalCtrl: ModalController) { }

  presentModal() {
    const modal = this.modalCtrl.create(ModalPage);
    modal.present();
  }
}
```

**New Usage Example:**

```javascript
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ModalPage } from './modal-page';

@Component({
  ...
})
export class MyPage {

  constructor(public modalCtrl: ModalController) { }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalPage
    });
    return await modal.present();
  }
}
```

## Nav

### Method Renamed

- The `remove` method has been renamed to `removeIndex` to avoid conflicts with HTML and be more descriptive as to what it does.
- The `getActiveChildNavs` method has been renamed to `getChildNavs`.

### Prop Renamed

- The `swipeBackEnabled` prop has been renamed to `swipeGesture`.


## Navbar

The `<ion-navbar>` component has been removed in favor of always using an `<ion-toolbar>` with an explicit back button:

**Old Usage Example:**

```html
<ion-navbar>
  <ion-title>My Navigation Bar</ion-title>
</ion-navbar>
```

**New Usage Example:**

```html
<ion-toolbar>
  <ion-buttons slot="start">
    <ion-back-button></ion-back-button>
  </ion-buttons>
  <ion-title>My Navigation Bar</ion-title>
</ion-toolbar>
```

See the [back button](#back-button) changes for more information.


## Option

### Markup Changed

Select's option element should now be written as `<ion-select-option>`. This makes it more obvious that the element should only be used with a Select.

**Old Usage Example:**

```html
<ion-select>
  <ion-option>Option 1</ion-option>
  <ion-option>Option 2</ion-option>
  <ion-option>Option 3</ion-option>
</ion-select>
```

**New Usage Example:**

```html
<ion-select>
  <ion-select-option>Option 1</ion-select-option>
  <ion-select-option>Option 2</ion-select-option>
  <ion-select-option>Option 3</ion-select-option>
</ion-select>
```

### Class Renamed

The class has been renamed from `Option` to `SelectOption` to keep it consistent with the element tag name.


## Overlays

### Markup Changed

All overlays should now use `async`/`await`. This includes Action Sheet, Alert, Loading, Modal, Popover, and Toast. In addition, the `enableBackdropDismiss` property has been renamed to `backdropDismiss`.

**Old Usage Example:**

```javascript
presentPopover(ev: any) {
  const popover = this.popoverController.create({
    component: PopoverComponent,
    event: event,
    translucent: true,
    enableBackdropDismiss: false
  });
  popover.present();
}
```

**New Usage Example:**

```javascript
async presentPopover(ev: any) {
  const popover = await this.popoverController.create({
    component: PopoverComponent,
    event: event,
    translucent: true,
    backdropDismiss: false
  });
  return await popover.present();
}
```


### Property Removed

The `dismissOnPageChange` property of the create was removed from Loading & Toast. All of the navigation API is promise based and there are global events (`ionNavWillChange`, `ionNavDidChange`) that you can listen to in order to detect when navigation occurs.

**Old Usage Example:**

```javascript
openLoading() {
  let loading = this.loadingCtrl.create({
    content: 'Loading...',
    dismissOnPageChange: true
  });
}
```

**New Usage Example:**

```javascript
async openLoading() {
  let loading = this.loadingCtrl.create({
    content: 'Loading...'
  });

  await loading.present();

  const { role, data } = await loading.onDidDismiss();

  console.log('Loading dismissed!');
}
```


## Popover

See [Overlays](#overlays).


## Radio

### Slot Required

Previously radio was positioned inside of an item automatically or by using `item-left`/`item-right`. It is now required to have a `slot` to be positioned properly in an item.

**Old Usage Example:**

```html
<ion-item>
  <ion-label>Apple</ion-label>
  <ion-radio value="apple"></ion-radio>
</ion-item>

<ion-item>
  <ion-label>Grape, checked, disabled</ion-label>
  <ion-radio item-left value="grape" checked disabled></ion-radio>
</ion-item>

<ion-item>
  <ion-label>Cherry</ion-label>
  <ion-radio item-right color="danger" value="cherry"></ion-radio>
</ion-item>
```

**New Usage Example:**

```html
<ion-item>
  <ion-label>Apple</ion-label>
  <ion-radio slot="start" value="apple"></ion-radio>
</ion-item>

<ion-item>
  <ion-label>Grape, checked, disabled</ion-label>
  <ion-radio slot="start" value="grape" checked disabled></ion-radio>
</ion-item>

<ion-item>
  <ion-label>Cherry</ion-label>
  <ion-radio slot="end" color="danger" value="cherry"></ion-radio>
</ion-item>
```

### Radio Group

Radio group has been changed to an element. It should now be wrapped around any `<ion-radio>` elements as `<ion-radio-group>`.

**Old Usage Example:**

```html
<ion-list radio-group>
  <ion-item>
    <ion-label>Apple</ion-label>
    <ion-radio value="apple"></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>Grape, checked, disabled</ion-label>
    <ion-radio value="grape" checked disabled></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>Cherry</ion-label>
    <ion-radio color="danger" value="cherry"></ion-radio>
  </ion-item>
</ion-list>
```

**New Usage Example:**

```html
<ion-list>
  <ion-radio-group>
    <ion-item>
      <ion-label>Apple</ion-label>
      <ion-radio slot="start" value="apple"></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Grape, checked, disabled</ion-label>
      <ion-radio slot="start" value="grape" checked disabled></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Cherry</ion-label>
      <ion-radio slot="start" color="danger" value="cherry"></ion-radio>
    </ion-item>
  </ion-radio-group>
</ion-list>
```


## Range

### Attributes Renamed

Previously to place content inside of a range the following attributes were used: `range-left`, `range-right`, (and with the added support of RTL) `range-start`, `range-end`.

These have been renamed to the following:

| Old Property                | New Property   | Property Behavior                                                     |
|-----------------------------|----------------|-----------------------------------------------------------------------|
| `range-left`, `range-start` | `slot="start"` | Positions to the left of the range in LTR, and to the right in RTL.   |
| `range-right`, `range-end`  | `slot="end"`   | Positions to the right of the range in LTR, and to the left in RTL.   |


**Old Usage Example:**

```html
<ion-range>
  <ion-icon name="sunny" range-left></ion-icon>
  <ion-icon name="sunny" range-right></ion-icon>
</ion-range>

<ion-range>
  <ion-icon name="sunny" range-start></ion-icon>
  <ion-icon name="sunny" range-end></ion-icon>
</ion-range>
```

**New Usage Example:**

```html
<ion-range>
  <ion-icon name="sunny" slot="start"></ion-icon>
  <ion-icon name="sunny" slot="end"></ion-icon>
</ion-range>
```


## Refresher

The `enabled` property (with a default value of `true`) has been renamed to `disabled` (with a default value of `false`).

**Old Usage Example:**

```html
<ion-refresher enabled="false">
  ...
</ion-refresher>
```

**New Usage Example:**

```html
<ion-refresher disabled="true">
  ...
</ion-refresher>
```

## Scroll

`ion-scroll` has been removed in favor of using `ion-content`:

```diff
- <ion-scroll scrollX="true">
+ <ion-content scrollX="true">
```

Another very good option is to style a `div` to become scrollable using CSS:

```css
div.scrollable {
  overflow: scroll
}
```


## Segment Button

Segment Button text is now required to be wrapped in an `ion-label`.

*Old usage:*

```html
<ion-segment-button>
  Item One
</ion-segment-button>
```

*New usage:*

```html
<ion-segment-button>
  <ion-label>Item One</ion-label>
</ion-segment-button>
```


## Select

The `selectOptions` property was renamed to `interfaceOptions` since it directly correlates with the `interface` property.

**Old Usage Example:**

```html
<ion-select [selectOptions]="customOptions">
  ...
</ion-select>
```

```ts
this.customOptions = {
  title: 'Pizza Toppings',
  subTitle: 'Select your toppings'
};
```

**New Usage Example:**

```html
<ion-select [interfaceOptions]="customOptions">
  ...
</ion-select>
```

```ts
this.customOptions = {
  title: 'Pizza Toppings',
  subTitle: 'Select your toppings'
};
```

## Show When / Hide When

The `showWhen` and `hideWhen` directives (`ion-show-when` and `ion-hide-when` components) have been removed in v4 in favor of using CSS and [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries) to accomplish the desired look.

### Media Query Examples

Examples of media queries in CSS:

```css
/* targeting only portrait orientation */
@media (orientation: portrait) {
  /* CSS to apply when orientation is portrait goes here */
}

/* targeting only landscape orientation */
@media (orientation: landscape) {
  /* CSS to apply when orientation is landscape goes here */
}

/* targeting minimum width */
@media (min-width: 300px) {
  /* CSS to apply when the minimum width is 300px goes here */
}

/* targeting both minimum width and maximum width */
@media (min-width: 300px) and (max-width: 600px) {
  /* CSS to apply when the minimum width is 300px and maximum width is 600px goes here */
}
```

### Showing and Hiding by Breakpoint

The default breakpoints used by Ionic can be used internally if desired:

| Breakpoint | Screen Width |
| -----------| -------------|
| `xs`       | `0`          |
| `sm`       | `576px`      |
| `md`       | `768px`      |
| `lg`       | `992px`      |
| `xl`       | `1200px`     |

For example, to hide all `h3` elements when the minimum breakpoint is `sm`, the following CSS can be used:

```css
/* Hide all h3 elements when the minimum width is 576px (sm breakpoint) */
@media (min-width: 576px) {
  h3 {
    display: none;
  }
}
```

You can even create your own reusable classes for this, such as the following:

```css
/* Hide all elements with the .hide-xs-up class when the minimum width is 0px (xs breakpoint) */
@media (min-width: 0px) {
  .hide-xs-up {
    display: none;
  }
}

/* Hide all elements with the .hide-sm-up class when the minimum width is 576px (sm breakpoint) */
@media (min-width: 576px) {
  .hide-sm-up {
    display: none;
  }
}

/* Repeat above for the other breakpoints */
```

This can also be combined to only show specific elements when there is a min width:

```css
@media (min-width: 0px) {
  /* Hide all elements with the .hide-xs-up class when the minimum width is 0px (xs breakpoint) */
  .hide-xs-up {
    display: none;
  }

  /* Show all elements with the .show-xs-up class when the minimum width is 0px (xs breakpoint) */
  .show-xs-up {
    display: block;
  }
}

@media (min-width: 576px) {
  /* Hide all elements with the .hide-sm-up class when the minimum width is 576px (sm breakpoint) */
  .hide-sm-up {
    display: none;
  }

  /* Show all elements with the .show-sm-up class when the minimum width is 576px (sm breakpoint) */
  .show-sm-up {
    display: block;
  }
}

/* Repeat above for the other breakpoints */
```

If you'd only like to show the element when it is in that specific breakpoint, but don't want to add multiple classes to achieve it, you can combine `min-width` and `max-width` to target specific breakpoints:

```css
@media (min-width: 0px) and (max-width: 575px) {
  /* Hide all elements with the .hide-xs-only class when the minimum width is 0px (xs breakpoint) and the maximum width is 575px (right before sm breakpoint) */
  .show-xs-only {
    display: block;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  /* Hide all elements with the .hide-sm-only class when the minimum width is 576px (sm breakpoint) and the maximum width is 767px (right before md breakpoint) */
  .show-sm-only {
    display: block;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  /* Hide all elements with the .hide-md-only class when the minimum width is 768px (md breakpoint) and the maximum width is 991px (right before lg breakpoint) */
  .show-md-only {
    display: block;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  /* Hide all elements with the .hide-lg-only class when the minimum width is 992px (lg breakpoint) and the maximum width is 1199px (right before xl breakpoint) */
  .show-lg-only {
    display: block;
  }
}

/* Not necessary for xl since there isn't a larger breakpoint, can use the show-xl-up */
```

### Showing and Hiding by Mode

Styling based on the mode can be achieved by targeting an element with the mode class as the parent.

For example, to hide all `h3` elements when the mode is `md`, the following CSS can be used:

```css
/* Hide all h3 elements when the mode is md */
.md h3 {
  display: none;
}
```

Similar to breakpoints, a class can be created to make this easier. For example, to hide all elements with the `.hide-ios` class in `ios` mode:

```css
/* Hide all elements when the mode is ios and they have the .hide-ios class */
.ios .hide-ios {
  display: none;
}
```

### Showing and Hiding by Platform

Styling based on the platform is similar to styling by mode and can be achieved by targeting an element with the class `plt-{PLATFORM}` where {PLATFORM} is the name of the platform to be styled, from the following list:

```
ipad
iphone
ios
android
phablet
tablet
cordova
capacitor
electron
pwa
mobile
desktop
hybrid
```

For example, to hide all `h3` elements when the platform is `desktop`, the following CSS can be used:

```css
/* Hide all h3 elements when the platform is desktop */
.plt-desktop h3 {
  display: none;
}
```


## Spinner

### Name Changed

The `ios` and `ios-small` spinner's have been renamed to `lines` and `lines-small`, respectively. This also applies to any components that use spinner: `ion-loading`, `ion-infinite-scroll`, `ion-refresher`.

**Old Usage Example:**

```html
<ion-spinner name="ios"></ion-spinner>

<ion-spinner name="ios-small"></ion-spinner>
```

**New Usage Example:**

```html
<ion-spinner name="lines"></ion-spinner>

<ion-spinner name="lines-small"></ion-spinner>
```


## Tabs

Tabs has been completely refactored for Ionic 4. In Ionic 3 there was a lot of magic going on behind the scenes to style and generate the tab bar and buttons. While this made it easy to get up and running using tabs in Ionic, it made it more difficult to customize the tabs.

We decided to rethink the tabs implementation to make it more flexible and easier to theme for your application. In order to accomplish this, there had to be some changes to the markup.


### `ion-tabs`

The general usage of the `ion-tabs` element hasn't changed too drastically. Its purpose is still mostly the same - it wraps the entire layout.

#### Properties Removed

The attributes to position the tabs, change the tab layout, enable the tab highlight and hide the tabs have been removed. Instead customize this content in the [ion-tab-button](#ion-tab-button).

**Old Usage Example:**

```html
<ion-tabs tabsLayout="icon-top" tabsPlacement="bottom" tabsHighlight="true" hidden>
  ...
</ion-tabs>
```

**New Usage Example:**

```html
<ion-tabs>
  ...
</ion-tabs>
```


### `ion-tab`

The `ion-tab` has been removed in the Angular version of Ionic 4. You should use the Angular router with an [ion-tab-button](#ion-tab-button) that has a `tab` property.

```typescript
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: '../tab1/tab1.module#Tab1PageModule'
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: '../tab2/tab2.module#Tab2PageModule'
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: '../tab3/tab3.module#Tab3PageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];
```

```html
<ion-tabs>
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="tab1">
      <ion-icon name="flash"></ion-icon>
      <ion-label>Tab One</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="tab2">
      <ion-icon name="apps"></ion-icon>
      <ion-label>Tab Two</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="tab3">
      <ion-icon name="send"></ion-icon>
      <ion-label>Tab Three</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
```

### `ion-tab-bar`

A new element, `ion-tab-bar`, creates the tab bar that will contain the tab buttons and allow for full customization. It requires `slot` to be placed properly above or below the content.

### `ion-tab-button`

A new element, `ion-tab-button`, is used to create each button in the tab bar. These could be static links to different routes, buttons with click handlers on them, or link to whole tab views.

You can add `<ion-label>` and `<ion-icon>` inside of an `<ion-tab-button>`. An `<ion-tab-button>` should be wrapped by an `<ion-tab-bar>`.

The tab attribute defines the route to be shown upon clicking on this tab.

**Old Usage Example:**

```html
<ion-tabs>
  <ion-tab tabTitle="Map" tabIcon="map" tabBadge="2" tabBadgeStyle="danger" enabled="false"></ion-tab>
</ion-tabs>
```

**New Usage Example:**

```html
<ion-tabs>
  <ion-tab-bar>
    <!-- A route to <current-route>/map must exist -->
    <ion-tab-button tab="map" disabled="true">
      <ion-icon name="map"></ion-icon>
      <ion-label>Map</ion-label>
      <ion-badge color="danger">2</ion-badge>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
```

See more usage examples in the [Tabs](https://github.com/ionic-team/ionic/blob/master/core/src/components/tabs) documentation.


## Text / Typography

### Markup Changed

Typography should now be written as an `<ion-text>` element. Previously the `ion-text` attribute could be added to any HTML element to set its color. It should now be used as a wrapper around the HTML elements to style.

**Old Usage Example:**

```html
<h1 ion-text color="secondary">H1: The quick brown fox jumps over the lazy dog</h1>

<h2 ion-text color="primary">H2: The quick brown fox jumps over the lazy dog</h2>

<h3 ion-text color="light">H3: The quick brown fox jumps over the lazy dog</h3>

<p>
  I saw a werewolf with a Chinese menu in his hand.
  Walking through the <sub ion-text color="danger">streets</sub> of Soho in the rain.
  He <i ion-text color="primary">was</i> looking for a place called Lee Ho Fook's.
  Gonna get a <a ion-text color="secondary">big dish of beef chow mein.</a>
</p>
```

**New Usage Example:**

```html
<ion-text color="secondary">
  <h1>H1: The quick brown fox jumps over the lazy dog</h1>
</ion-text>

<ion-text color="primary">
  <h2>H2: The quick brown fox jumps over the lazy dog</h2>
</ion-text>

<ion-text color="light">
  <h3>H3: The quick brown fox jumps over the lazy dog</h3>
</ion-text>

<p>
  I saw a werewolf with a Chinese menu in his hand.
  Walking through the <ion-text color="danger"><sub>streets</sub></ion-text> of Soho in the rain.
  He <ion-text color="primary"><i>was</i></ion-text> looking for a place called Lee Ho Fook's.
  Gonna get a <ion-text color="secondary"><a>big dish of beef chow mein.</a></ion-text>
</p>
```


## Theming

### Global CSS

Many of the components in Ionic 4 have self-contained styles thanks to [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

However, there are still global styles that need to be included in order for an Ionic app to look and behave properly. The global styles include normalizing elements, typography, colors, and more.

#### Basic CSS Files

The basic set of CSS files should be included to ensure the Ionic application behaves natively.

- **core.css**
Contains styles for the font, structure, and the `color` property for all Ionic components.

- **normalize.css**
Normalizes the CSS differences between browsers, it's based on https://necolas.github.io/normalize.css/

- **structure.css**
Applies styles to the `<html>` element and defaults `box-sizing` to `border-box`. It's used to ensure scrolling behaves natively on mobile devices.

- **typography.css**
Changes the `font-family` of the whole page based on the mode selected (iOS or Material Design). It also applies global styles to native HTML elements.


#### Additional CSS Files

The following set of CSS files are optional and can safely be commented out if the application is not using any of the features.

- **padding.css**
Adds utility attributes that allow adding `padding` and `margin` attributes to any element. See [content space](https://ionicframework.com/docs/layout/css-utilities#content-space) for what this includes.

- **float-elements.css**
Adds utility attributes that allow adding `float` attributes to any element. See [element placement](https://ionicframework.com/docs/layout/css-utilities/#element-placement) for what this includes.

- **text-alignment.css**
Adds utility attributes that allow adding text alignment attributes to any element. See [text alignment](https://ionicframework.com/docs/layout/css-utilities/#text-alignment) for what this includes.

- **text-transformation.css**
Adds utility attributes that allow adding text transformation attributes to any element. See [text transformation](https://ionicframework.com/docs/layout/css-utilities/#text-transformation) for what this includes.

- **flex-utils.css**
Adds utility attributes that allow adding flex container and item attributes to any element. See [flex properties](https://ionicframework.com/docs/layout/css-utilities/#flex-properties) for what this includes.


#### Including the CSS Files

Official Ionic starters are already properly configured so the following steps are not needed.

#### Testing

To include the stylesheet for testing such as in a Plunker, Codepen, or anywhere else:

```html
<link rel="stylesheet" href="https://unpkg.com/@ionic/angular/css/ionic.min.css"/>
```

#### Production

To use the css in production, we recommend importing it into a global file, such as `app/global.scss`:

```css
/** Basic CSS for Ionic Apps */
@import "~@ionic/angular/css/core.css";
@import "~@ionic/angular/css/normalize.css";
@import "~@ionic/angular/css/structure.css";
@import "~@ionic/angular/css/typography.css";

/** Optional CSS utilities that can be commented out */
@import "~@ionic/angular/css/padding.css";
@import "~@ionic/angular/css/float-elements.css";
@import "~@ionic/angular/css/text-alignment.css";
@import "~@ionic/angular/css/text-transformation.css";
@import "~@ionic/angular/css/flex-utils.css";
```


### CSS Utilities

#### Padding

Previously to add padding to the left and right side of elements, the `padding-left` and `padding-right` attributes, respectively, would be added to the element.

These attributes have been renamed to `padding-start` and `padding-end` to better align with our support for RTL.

#### Margin

Previously to add margin to the left and right side of elements, the `margin-left` and `margin-right` attributes, respectively, would be added to the element.

These attributes have been removed in favor of using the `margin-start` and `margin-end` attributes to better align with our support for RTL.


### Including Sass

Previously all `scss` files in the `src` directory were imported. Now each `scss` file should be included for the component via Angular's `styleUrls` metadata. View [Angular's Component Styles](https://angular.io/guide/component-styles) for more information.

This means that any styles wrapped with a page should now be removed since they will automatically be scoped to the component.

**Old Usage Example:**

```scss
page-schedule {
  p {
    color: red;
  }
}
```

**New Usage Example:**

```scss
p {
  color: red;
}
```


### Sass Variables

Sass variables should no longer be used to change Ionic components. We have built Ionic to be customizable using CSS variables, instead.

For more information on theming, check out the [theming documentation](https://ionicframework.com/docs/theming/basics).


## Toast

See [Overlays](#overlays).


## Toolbar

### Menu Toggle

Previously if a `menuToggle` directive was added to an Ionic `button` in a toolbar, it would be positioned outside of the `ion-buttons` element. Since menu toggle is simply a wrapper to a button now, it should be placed inside of the `ion-buttons` element.

**Old Usage Example:**

```html
<ion-toolbar>
  <button ion-button menuToggle>
    <ion-icon name="menu"></ion-icon>
  </button>
  <ion-title>Left side menu toggle</ion-title>
</ion-toolbar>
```

**New Usage Example:**

```html
<ion-toolbar>
  <ion-buttons slot="start">
    <ion-menu-toggle>
      <ion-button>
        <ion-icon slot="icon-only" name="menu"></ion-icon>
      </ion-button>
    </ion-menu-toggle>
  </ion-buttons>
  <ion-title>Left side menu toggle</ion-title>
</ion-toolbar>
```

### Attributes Renamed

Previously to positions buttons inside of a toolbar the following attributes were used: `start`, `left`, `right`, `end`.

These have been renamed to the following:

| Old Property | New Property       | Property Behavior                                                                                        |
|--------------|--------------------|----------------------------------------------------------------------------------------------------------|
| `start`      | `slot="secondary"` | Positions element to the `left` of the content in `ios` mode, and directly to the `right` in `md` mode.  |
| `end`        | `slot="primary"`   | Positions element to the `right` of the content in `ios` mode, and to the far `right` in `md` mode.      |
| `left`       | `slot="start"`     | Positions to the `left` of the content in LTR, and to the `right` in RTL.                                |
| `right`      | `slot="end"`       | Positions to the `right` of the content in LTR, and to the `left` in RTL.                                |

**Old Usage Example:**

```html
<ion-toolbar>
  <ion-buttons left>
    <button ion-button>Left</button>
  </ion-buttons>
  <ion-buttons start>
    <button ion-button>Secondary</button>
  </ion-buttons>

  <ion-title>
    Title
  </ion-title>

  <ion-buttons end>
    <button ion-button>Primary</button>
  </ion-buttons>
  <ion-buttons right>
    <button ion-button>Right</button>
  </ion-buttons>
</ion-toolbar>
```

**New Usage Example:**

```html
<ion-toolbar>
  <ion-buttons slot="start">
    <ion-button>Left</ion-button>
  </ion-buttons>
  <ion-buttons slot="secondary">
    <ion-button>Secondary</ion-button>
  </ion-buttons>

  <ion-title>
    Title
  </ion-title>

  <ion-buttons slot="primary">
    <ion-button>Primary</ion-button>
  </ion-buttons>
  <ion-buttons slot="end">
    <ion-button>Right</ion-button>
  </ion-buttons>
</ion-toolbar>
```
