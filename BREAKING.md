
# Breaking Changes

A list of the breaking changes introduced in Ionic Angular v4.

- [Dynamic Mode](#dynamic-mode)
- [Button](#button)
- [Chip](#chip)
- [Colors](#colors)
- [Datetime](#datetime)
- [FAB](#fab)
- [Fixed Content](#fixed-content)
- [Icon](#icon)
- [Input](#Input)
- [Item](#item)
- [Item Divider](#item-divider)
- [Item Sliding](#item-sliding)
- [List Header](#list-header)
- [Menu Toggle](#menu-toggle)
- [Nav](#nav)
- [Option](#option)
- [Radio](#radio)
- [Range](#range)
- [Segment](#segment)
- [Select](#select)
- [Spinner](#spinner)
- [Text / Typography](#text--typography)
- [Theming](#theming)
- [Toolbar](#toolbar)


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

In addition, several sets of mutually exclusive boolean attributes have been combined into a single string attribute.

The `small` and `large` attributes are now combined under the `size` attribute. The `clear`, `outline`, and `solid` attributes have been combined under `fill`. And, lastly, the `full` and `block` attributes have been combined under `expand`.

| Old Property                | New Property | Property Behavior           |
| --------------------------- | ------------ | --------------------------- |
| `small`, `large`            | `size`       | Sets the button size.       |
| `clear`, `outline`, `solid` | `fill`       | Sets the button fill style. |
| `full`, `block`             | `expand`     | Sets the button width.      |


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
  <ion-chip-button fill="clear" color="light">
    <ion-icon name="close-circle"></ion-icon>
  </ion-chip-button>
</ion-chip>
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

Some of their values have changed and we now include more colors by default:

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
<ion-fab vertical="top" horizontal="right" edge>
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
| left         | `horizontal="left"`  | Positions to the left of the viewport.                                  |
| right        | `horizontal="right"` | Positions to the right of the viewport.                                 |
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
<ion-fab vertical="top" horizontal="right" edge>
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
<ion-fab vertical="top" horizontal="right" edge slot="fixed">
  <!-- fab buttons and lists -->
</ion-fab>
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

### Property Removed

The `isActive` property has been removed. It only worked for `ios` icons previously. If you would like to switch between an outline and solid icon you should set it in the `name`, or `ios`/`md` attribute and then change it when needed.

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

Item should now be written as an `<ion-item>` element. Ionic will determine when to render an anchor tag based on the presence of an `href` attribute, and a button tag based on the presence of an `onclick` or `tappable` attribute. Otherwise, it will render a div.

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

<ion-item tappable (click)="doSomething()">
  Button Item
</ion-item>

<ion-item href="#">
  Anchor Item
</ion-item>
```

### Label Required

Previously an `ion-label` would automatically get added to an `ion-item` if one wasn't provided. Now an `ion-label` should always be added if the component is used to display text.

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
<ion-item tappable detail="false">
  <ion-label>Item Label</ion-label>
</ion-item>

<ion-item detail>
  <ion-label>Item Label</ion-label>
</ion-item>
```

By default, items that render buttons or anchor tags will show the arrow in `ios` mode.

## Item Divider

### Label Required

Previously an `ion-label` would automatically get added to an `ion-item-divider` if one wasn't provided. Now an `ion-label` should always be added if the component is used to display text.

```html
<ion-item-divider>
  <ion-label>Item Divider Label</ion-label>
</ion-item-divider>
```


## Item Sliding

### Markup Changed

The option component should not be written as a `button` with an `ion-button` directive anymore. It should be written as an `ion-item-option`. This will render a native button element inside of it.

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
  <ion-item-options side="right">
    <ion-item-option expandable>
      <ion-icon name="star"></ion-icon>
    </ion-item-option>
  </ion-item-options>
</ion-item-sliding>
```

### Method Renamed

The `getSlidingPercent` method has been renamed to `getSlidingRatio` since the function is returning a ratio of the open amount of the item compared to the width of the options.


## List Header

### Label Required

Previously an `ion-label` would automatically get added to an `ion-list-header` if one wasn't provided. Now an `ion-label` should always be added if the component is used to display text.

```html
<ion-list-header>
  <ion-label>List Header Label</ion-label>
</ion-list-header>
```

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


## Nav

### Method renamed

The `remove` method has been renamed to `removeIndex` to avoid conflicts with HTML and be more descriptive as to what it does.

The `getActiveChildNavs` method has been renamed to `getChildNavs`.

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
  <ion-buttons slot="left">
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

| Old Property | New Property   | Property Behavior                                                                                                |
|--------------|----------------|------------------------------------------------------------------------------------------------------------------|
| `start`      | `slot="start"` | Positions element to the `left` of the content in `ios` mode, and directly to the `right` in `md` and `wp` mode. |
| `end`        | `slot="end"`   | Positions element to the `right` of the content in `ios` mode, and to the far `right` in `md` and `wp` mode.     |
| `left`       | `slot="left"`  | Positions element to the `left` of all other elements.                                                           |
| `right`      | `slot="right"` | Positions element to the `right` of all other elements.                                                          |

**Old Usage Example:**

```html
<ion-toolbar>
  <ion-buttons left>
    <button ion-button>Left</button>
  </ion-buttons>
  <ion-buttons start>
    <button ion-button>Start</button>
  </ion-buttons>

  <ion-title>
    Title
  </ion-title>

  <ion-buttons end>
    <button ion-button>End</button>
  </ion-buttons>
  <ion-buttons right>
    <button ion-button>Right</button>
  </ion-buttons>
</ion-toolbar>
```

**New Usage Example:**

```html
<ion-toolbar>
  <ion-buttons slot="left">
    <ion-button>Left</ion-button>
  </ion-buttons>
  <ion-buttons slot="start">
    <ion-button>Start</ion-button>
  </ion-buttons>

  <ion-title>
    Title
  </ion-title>

  <ion-buttons slot="end">
    <ion-button>End</ion-button>
  </ion-buttons>
  <ion-buttons slot="right">
    <ion-button>Right</ion-button>
  </ion-buttons>
</ion-toolbar>
```
