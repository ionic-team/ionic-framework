
# Breaking Changes

A list of the breaking changes introduced in Ionic Angular v4.

- [Dynamic Mode](#dynamic-mode)
- [Button](#button)
- [Chip](#chip)
- [Cordova](#cordova)
- [Datetime](#datetime)
- [FAB](#fab)
- [Fixed Content](#fixed-content)
- [Icon](#icon)
- [Input](#Input)
- [Item](#item)
- [Nav](#nav)
- [Option](#option)
- [Radio](#radio)
- [Range](#range)
- [Segment](#segment)
- [Select](#select)
- [Toolbar](#toolbar)
- [Sass](#sass)


## Dynamic Mode

Components are no longer able to have their mode changed dynamically. You can change the mode before the first render, but after that it will not style properly because only the initial mode's styles are included.

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

## Chip

### Markup Changed

Buttons inside of an `<ion-chip>` container should now be written as an `<ion-chip-button>` element. Ionic will determine when to render an anchor tag based on the presence of an `href` attribute.

**Old Usage Example:**

```html
<ion-chip>
  <ion-label>Default</ion-label>
  <ion-button clear color="light">
    <ion-icon name="close-circle"></ion-icon>
  </ion-button>
</ion-chip>
```

**New Usage Example:**

```html
<ion-chip>
  <ion-label>Default</ion-label>
  <ion-chip-button clear color="light">
    <ion-icon name="close-circle"></ion-icon>
  </ion-chip-button>
</ion-chip>
```

## Datetime

The Datetime classes and interfaces have changed capitalization from `DateTime` to `Datetime`. This is more consistent with other components and their tags.

**Old Usage Example:**

```javascript
import { DateTime } from 'ionic-angular';
```

**New Usage Example:**

```javascript
import { Datetime } from 'ionic-angular';
```

## Cordova

Sass variables for changing the cordova statusbar have been renamed to app:

**Old Usage Example:**

```css
$cordova-ios-statusbar-padding:   20px;
$cordova-md-statusbar-padding:    20px;
```

**New Usage Example:**

```css
$app-ios-statusbar-padding:   20px;
$app-md-statusbar-padding:    20px;
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
<ion-fab top right edge>
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

### Fixed Content

The `<ion-fab>` container was previously placed inside of the fixed content by default. Now, any fixed content should go inside of the `<ion-fixed>` container.

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
<ion-fixed>
  <ion-fab top right edge>
    <!-- fab buttons and lists -->
  </ion-fab>
</ion-fixed>
<ion-content>
  Scrollable Content
</ion-content>
```

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
.icon {
  fill: #000;
}
```

## Input

The Sass variables were all renamed from having `$text-input` as the prefix to `$input`.

**Old Usage Example:**

```css
$text-input-highlight-color-valid:       #32db64;
```

**New Usage Example:**

```css
$input-highlight-color-valid:       #32db64;
```


## Item

### Markup Changed

Item should now be written as an `<ion-item>` element. Ionic will determine when to render an anchor tag based on the presence of an `href` attribute, and a button tag based on the presence of a click. Otherwise, it will render a div.

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
  Default Item
</ion-item>

<ion-item (click)="doSomething()">
  Button Item
</ion-item>

<ion-item href="#">
  Anchor Item
</ion-item>
```

### Label Required

Previously an `ion-label` would automatically get added to an `ion-item`, `ion-item-divider` and `ion-list-header` if one wasn't provided. Now an `ion-label` should always be added if the component is used to display text.

```html
<ion-item>
  <ion-label>Item Label</ion-label>
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

## Nav

### Method renamed

The `remove` method has been renamed to `removeIndex` to avoid conflicts with HTML and be more descriptive as to what it does.

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

### Class Changed

The class has been renamed from `Option` to `SelectOption` to keep it consistent with the element tag name.

## Radio

### Slot Required

Previously radio was positioned inside of an item automatically or by using `item-left`/`item-right`. It is now required to have a `slot` to be positioned properly.

** Old Usage Example **

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

** New Usage Example **

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

** Old Usage Example **

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

** New Usage Example **

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

### Windows Mode Order

Previously a radio inside of an item in Windows Platform mode would align itself to the start of the item. This has been removed, `slot` should always be used to align a radio inside of an item now.


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


## Segment

The markup hasn't changed for Segments, but now writing `<ion-segment-button>` will render a native button element inside of it.


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


## Toolbar

### Attributes Renamed

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

## Sass

### Deprecated Styles

Deprecated variables and styles have been removed.

- [e0a29db](https://github.com/ionic-team/ionic/commit/e0a29db)
- [07e4330](https://github.com/ionic-team/ionic/commit/07e4330)
- TODO continue to add what is removed here
