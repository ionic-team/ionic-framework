
# Breaking Changes

A list of the breaking changes introduced in Ionic Angular v4.

- [Dynamic Mode](#dynamic-mode)
- [Button](#button)
- [FAB](#fab)
- [Fixed Content](#fixed-content)
- [Icon](#icon)
- [Item](#item)
- [Segment](#segment)
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

### Icon Attributes Renamed

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

Previously an `ion-label` would automatically get added to an `ion-item` if one wasn't provided. Now an `ion-label` should always be added if the item is used to display text.

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

## Segment

The markup hasn't changed for Segments, but now writing `<ion-segment-button>` will render a native button element inside of it.


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
