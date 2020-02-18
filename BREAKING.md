# Breaking Changes

This is a comprehensive list of the breaking changes introduced in the major version releases of Ionic Framework.

## Versions

- [Version 5.x](#version-5x)
- [Version 4.x](#version-4x)
- [Legacy](#legacy)


## Version 5.x

- [CSS](#css)
  * [CSS Utilities](#css-utilities)
  * [Display Classes](#display-classes)
  * [Activated, Focused, Hover States](#activated-focused-hover-states)
  * [Distributed Sass](#distributed-sass)
- [Components](#components)
  * [Action Sheet](#action-sheet)
  * [Anchor](#anchor)
  * [Back Button](#back-button)
  * [Button](#button)
  * [Card](#card)
  * [Controllers](#controllers)
  * [FAB Button](#fab-button)
  * [Item](#item)
  * [Header / Footer](#header---footer)
  * [List Header](#list-header)
  * [Menu](#menu)
  * [Menu Button](#menu-button)
  * [Nav Link](#nav-link)
  * [Radio](#radio)
  * [Searchbar](#searchbar)
  * [Segment](#segment)
  * [Segment Button](#segment-button)
  * [Select Option](#select-option)
  * [Skeleton Text](#skeleton-text)
  * [Split Pane](#split-pane)
  * [Toast](#toast)
  * [Tabs](#tabs)
- [Colors](#colors)
- [Events](#events)
- [Mode](#mode)
- [Ionicons](#ionicons)


### CSS

#### CSS Utilities

We originally added CSS utility attributes for styling components because it was a quick and easy way to wrap text or add padding to an element. Once we added support for multiple frameworks as part of our "Ionic for everyone" approach, we quickly determined there were problems with using CSS attributes with frameworks that use JSX and Typescript. In order to solve this we added CSS classes. Rather than support CSS attributes in certain frameworks and classes in others, we decided to remove the CSS attributes and support what works in all of them, classes, for consistency. In addition to this, changing to classes prefixed with `ion` avoids conflict with native attributes and user's CSS. In the latest version of Ionic 4, there are deprecation warnings printed in the console to show what the new classes are, and the documentation has been updated since support for classes was added to remove all references to attributes: https://ionicframework.com/docs/layout/css-utilities.

Some examples of what's changed are below. *This is not all-inclusive, see the documentation linked above for all of the available CSS utility classes.*

**Before**

```html
<ion-header text-center></ion-header>
<ion-content padding></ion-content>
<ion-label text-wrap></ion-label>
<ion-item wrap></ion-item>
```

**After**

```html
<ion-header class="ion-text-center"></ion-header>
<ion-content class="ion-padding"></ion-content>
<ion-label class="ion-text-wrap"></ion-label>
<ion-item class="ion-wrap"></ion-item>
```


#### Display Classes

The responsive display classes found in the `display.css` file have had their media queries updated to better reflect how they should work. Instead of using the maximum value of the breakpoint for `.ion-hide-{breakpoint}-down` classes it will use the minimum of that breakpoint.

The [Ionic breakpoints](https://ionicframework.com/docs/layout/css-utilities#ionic-breakpoints) are the following:


| Breakpoint Name | Width   |
| ----------------| --------|
| xs              | 0       |
| sm              | 576px   |
| md              | 768px   |
| lg              | 992px   |
| xl              | 1200px  |

Previously, if you added the class `ion-hide-md-down` to an element, it would hide the element when the screen size was `991px` (the maximum of the `md` breakpoint) or smaller. Now, using this same class will hide the element when the maximum screen size is `768px`.

Below is a table of how the media queries have changed for each class:

| Class Name          | Ionic 4                      | Ionic 5                      |
| --------------------| -----------------------------| -----------------------------|
| `.ion-hide-down`    | `@media (max-width: 575px)`  | all screen sizes             |
| `.ion-hide-sm-down` | `@media (max-width: 767px)`  | `@media (max-width: 576px)`  |
| `.ion-hide-md-down` | `@media (max-width: 991px)`  | `@media (max-width: 768px)`  |
| `.ion-hide-lg-down` | `@media (max-width: 1199px)` | `@media (max-width: 992px)`  |
| `.ion-hide-xl-down` | all screen sizes             | `@media (max-width: 1200px)` |

_Note that no changes were made to the `.ion-hide-{breakpoint}-up` classes._

See the [CSS Utilities responsive display documentation](https://ionicframework.com/docs/layout/css-utilities#responsive-display-attributes) for more information.


#### Activated, Focused, Hover States

The `.activated` class that is automatically added to clickable components has been renamed to `.ion-activated`.

The way the CSS variables are used for targeting the activated, focused and hover backgrounds have been updated on the following components:

- Action Sheet
- Back Button
- Button
- FAB Button
- Item
- Menu Button
- Segment Button
- Tab Button

Previously, in order to update any of the background colors for the states you would have to know what the opacity was set to. Using the Material Design spec as an example, it would require you to know that the hover state uses a white overlay with an opacity of `.08`. This means that if we had the following set by default:

```css
--background-hover: rgba(255, 255, 255, 0.08);
```

If you wanted to change the hover overlay to use black but still match the spec, you'd have to set it to:

```css
--background-hover: rgba(0, 0, 0, 0.08);
```

The new way adds the following variables:

```css
--background-activated-opacity
--background-focused-opacity
--background-hover-opacity
```

It also updates the Action Sheet component so that the variables will be prefixed with `button`. See the [Action Sheet](#action-sheet) section in this document for all of the new variable names.

This allows you to still have control over the opacity if desired, but when updating the state, you only have to set the main variables: `--background-activated`, `--background-focused`, `--background-hover` and the button will still match the spec. This is most important when changing the global theme, as updating the toolbar color will automatically update the hover states for all of the buttons in a toolbar, regardless of their fill and without having to know what each opacity is.


##### Examples

```css
/* Setting the button background on hover to solid red */
ion-button {
  --background-hover: red;
  --background-hover-opacity: 1;
}

/* Setting the action sheet button background on focus to an opaque green */
ion-action-sheet {
  --button-background-focus: green;
  --button-background-focus-opacity: 0.5;
}

/*
 * Setting the fab button background on hover to match the text color with
 * the default --background-hover-opacity on md
 */
.md ion-fab-button {
  --color: #222;
  --background-hover: #222;
}
```

##### Global CSS Properties

Some variables were renamed, removed or added. See the chart below for the changes.

| Old variable                            | Status  | New variable                              |
| ----------------------------------------| --------|-------------------------------------------|
| `--ion-toolbar-color-unchecked`         | renamed | `--ion-toolbar-segment-color`             |
| `--ion-toolbar-color-checked`           | renamed | `--ion-toolbar-segment-color-checked`     |
| `--ion-toolbar-background-unchecked`    | renamed | `--ion-toolbar-segment-background`        |
| `--ion-toolbar-background-checked`      | renamed | `--ion-toolbar-segment-background-checked`|
| `--ion-tab-bar-color-activated`         | renamed | `--ion-tab-bar-color-selected`            |
|                                         | added   | `--ion-toolbar-segment-indicator-color`   |
| `--ion-toolbar-color-activated`         | removed |                                           |
| `--ion-item-background-activated`       | removed |                                           |
| `--ion-item-background-focused`         | removed |                                           |
| `--ion-item-background-hover`           | removed |                                           |


#### Distributed Sass

The `scss` files have been removed from `dist/`. CSS variables should be used to theme instead.


### Components

#### Action Sheet

The following CSS variables have been renamed or added:

| Old                      | New                                        |
|--------------------------| -------------------------------------------|
|                          | `--button-background`                      |
| `--background-activated` | `--button-background-activated`            |
|                          | `--button-background-activated-opacity`    |
| `--background-selected`  | `--button-background-selected`             |
|                          | `--button-background-focused`              |
|                          | `--button-background-focused-opacity`      |
|                          | `--button-background-hover`                |
|                          | `--button-background-hover-opacity`        |
|                          | `--button-background-selected`             |
|                          | `--button-background-selected-opacity`     |
|                          | `--button-color`                           |
|                          | `--button-color-activated`                 |
|                          | `--button-color-focused`                   |
|                          | `--button-color-hover`                     |
|                          | `--button-color-selected`                  |

See the [Action Sheet CSS Custom Properties](https://ionicframework.com/docs/api/action-sheet#css-custom-properties) documentation for descriptions.


#### Anchor

The `ion-anchor` component has been renamed to `ion-router-link` as this is a better description of which component it should be used with. This component should still only be used in vanilla and Stencil JavaScript projects. Angular projects should use an `<a>` and `routerLink` with the Angular router. See the [documentation for router-link](https://ionicframework.com/docs/api/router-link) for more information.

#### Back Button

- Converted `ion-back-button` to use [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).
- [Focused, Hover States](#activated-focused-hover-states) have been updated.

#### Button

- [Activated, Focused, Hover States](#activated-focused-hover-states) have been updated.

#### Card

Converted `ion-card` to use [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).


#### Controllers

The controller components (`ion-action-sheet-controller`, `ion-alert-controller`, `ion-loading-controller`, `ion-menu-controller`, `ion-modal-controller`, `ion-picker-controller`, `ion-popover-controller`, `ion-toast-controller`) have been removed from Ionic core as elements. They should be imported from `@ionic/core` instead. This will not affect projects that use Angular or React. Below is an example of the loading controller change in a JavaScript project, but this change applies to all controller elements.

**Before**

```html
<ion-loading-controller></ion-loading-controller>

<script>
  async function presentLoading() {
    const loadingController = document.querySelector('ion-loading-controller');

    const loading = await loadingController.create({
      message: 'Hello',
      duration: 2000
    });
    await loading.present();
  }
</script>

```

**After**

```html
<script type="module">
  import { loadingController } from '@ionic/core';
  window.loadingController = loadingController;
</script>

<script>
  async function presentLoading() {
    const loading = await loadingController.create({
      message: 'Hello',
      duration: 2000
    });
    await loading.present();
  }
</script>
```

#### FAB Button

- [Activated, Focused, Hover States](#activated-focused-hover-states) have been updated.


#### Item

- [Activated, Focused, Hover States](#activated-focused-hover-states) have been updated.


#### Header / Footer

The `no-border` attribute has been removed, use `ion-no-border` class instead. See [CSS Utilities](#css-utilities) above for more information on why this change was made.


#### List Header

The list header has been redesigned to match the latest iOS spec. This may break the design of your application as the previous design had a small font size with uppercase text. The latest design includes a larger, bolder text.

In addition, any text content inside of an `<ion-list-header>` should be wrapped in an `<ion-label>` in order to get the proper styling of the new design. If the label is missing, the button alignment in the list header may look off.

**Before**

```html
<ion-list-header>
  New This Week
  <ion-button>See All</ion-button>
</ion-list-header>
```

**After**

```html
<ion-list-header>
  <ion-label>New This Week</ion-label>
  <ion-button>See All</ion-button>
</ion-list-header>
```

The button has also been updated to default to `fill="clear"` and `size="small"` when inside of a list header. If the old look of the list header or buttons is desired, use custom CSS or button properties to achieve it.

For more information see the [List Header usage](https://ionicframework.com/docs/api/list-header#usage).


#### Menu

- The `swipeEnable()` function has been removed in Angular, use `swipeGesture()` instead.
- The `side` values `left` and `right` have been removed, use `start` and `end` instead.
- Removed the `main` attribute, use `content-id` (for vanilla JS / Vue) and `contentId` (for Angular / React) instead.

  **Before**

  ```html
  <ion-menu>...</ion-menu>
  <ion-content main>...</ion-content>
  ```

  **After**

  ```html
  <ion-menu content-id="main"></ion-menu>
  <ion-content id="main">...</ion-content>
  ```
- The presentation type in `ios` now defaults to `"overlay"`.


#### Menu Button

- [Focused, Hover States](#activated-focused-hover-states) have been updated.


#### Nav Link

The `ion-nav-push`, `ion-nav-back`, and `ion-nav-set-root` components have been removed in favor of using `ion-nav-link` with a `router-direction` property which accepts `”root”`, `“forward”`, and `“back”`. This reduces the need for maintaining multiple components when they all do the same thing with different transition directions. See the [documentation for nav-link](https://ionicframework.com/docs/api/nav-link) for more information.


#### Radio

The `ion-radio` must be used inside of an `ion-radio-group` even if there is only one `ion-radio`. Additionally, the `checked` property has been removed. Developers should set the `value` property on the parent `ion-radio-group` to match the value of the desired checked radio button.

`ion-radio` no longer emits an `ionSelect` event. Developers should listen for an `ionChange` event to be emitted on `ion-radio-group` instead.

**Before**

```html
<ion-radio checked>One</ion-radio>

<ion-radio-group>
  <ion-radio>One</ion-radio>
  <ion-radio checked>Two</ion-radio>
</ion-radio-group>
```

**After**

```html
<ion-radio-group value="one">
  <ion-radio value="one">One</ion-radio>
</ion-radio-group>

<ion-radio-group value="two">
  <ion-radio value="one">One</ion-radio>
  <ion-radio value="two">Two</ion-radio>
</ion-radio-group>
```

#### Searchbar

##### Show Cancel Button

The `show-cancel-button` property of the searchbar no longer accepts boolean values. Accepted values are strings: `"focus"`, `"always"`, `"never"`.

**Before**

```html
<ion-searchbar show-cancel-button>
<ion-searchbar show-cancel-button="true">
<ion-searchbar show-cancel-button="false">
```

**After**

```html
<ion-searchbar show-cancel-button="focus">
<ion-searchbar show-cancel-button="focus">
<ion-searchbar show-cancel-button="never">
```

See the [Searchbar documentation](https://ionicframework.com/docs/api/searchbar#properties) for more information.

##### Inputmode

The `inputmode` property for `ion-searchbar` now defaults to `undefined`. To get the old behavior, set the inputmode property to `"search"`.


#### Segment

Segment was completely revamped to use the new iOS design including an all new gesture that applies for both Material Design and iOS. Due to these changes, some breaking changes were inevitably introduced in order to support the new design.

##### Renamed Events

`ion-segment` no longer emits an `ionSelect` event. Developers should listen for an `ionChange` event to be emitted on `ion-segment` instead.

##### Button States

- The activated styles and custom CSS properties have been removed. These are no longer being used in the latest spec as the indicator and ripple are used to show activation. Properties removed:
  ```
  --color-activated
  --background-activated
  ```
- The [Focused & Hover States](#activated-focused-hover-states) have been updated.

##### Indicator Color

- `--indicator-color` now applies to the checked segment button (for both `ios` and `md`)
- `--indicator-color-checked` has been removed
- The Material Design spec does not include an indicator color on non-checked buttons: https://material.io/components/tabs/
- In order to style the Segment to match the old spec, please use custom CSS. For example, to update Material Design to include a bottom line all of the time:
  ```css
  .md ion-segment::after {
      position: absolute;
      bottom: 0;
      height: 2px;
      width: 100%;
      content: '';
      background: rgba(0,0,0,0.5);
      z-index: -1;
  }
  ```

##### Background & Color

A `--background` variable has been added to style the `ion-segment` component. As a result of this, the following background variables for a child segment button must now be set on the `ion-segment-button`:

```
--background: Background of the segment button
--background-checked: Background of the checked segment button
--background-disabled: Background of the disabled segment button
--background-hover: Background of the segment button on hover
```

> Note: iOS no longer checks the button background, so setting the `--background-checked` variable may have an undesired outcome. Instead, Segment uses an indicator to slide between the buttons, showing which one is checked. See the previous section on the indicator color variables.

The above variables *will not* be inherited in the button if set on the `ion-segment`. In addition to this, all color variables should also be set on the button for consistency:

```
--color: Color of the segment button
--color-checked: Color of the checked segment button
--color-disabled: Color of the disabled segment button
--color-hover: Color of the segment button on hover
```

###### Removed variables

The following variables were removed due to the current spec no longer using them.

- `--color-checked-disabled`
- `--background-disabled`
- `--color-disabled`
- `--background-activated`
- `--color-activated`

##### Global CSS Properties

Some variables were renamed or added. See the chart below for the new names.

| Old variable                            | Status  | New variable                              |
| ----------------------------------------| --------|-------------------------------------------|
| `--ion-toolbar-color-unchecked`         | renamed | `--ion-toolbar-segment-color`             |
| `--ion-toolbar-color-checked`           | renamed | `--ion-toolbar-segment-color-checked`     |
| `--ion-toolbar-background-unchecked`    | renamed | `--ion-toolbar-segment-background`        |
| `--ion-toolbar-background-checked`      | renamed | `--ion-toolbar-segment-background-checked`|
|                                         | added   | `--ion-toolbar-segment-indicator-color`   |


#### Segment Button

The `checked` property has been removed. Developers should set the `value` property on the parent `ion-segment` to match the value of the desired checked segment button.

**Before**

```html
<ion-segment>
  <ion-segment-button>One</ion-segment-button>
  <ion-segment-button checked>Two</ion-segment-button>
  <ion-segment-button>Three</ion-segment-button>
</ion-segment>
```

**After**

```html
<ion-segment value="two">
  <ion-segment-button value="one">One</ion-segment-button>
  <ion-segment-button value="two">Two</ion-segment-button>
  <ion-segment-button value="three">Three</ion-segment-button>
</ion-segment>
```


#### Select Option

The `selected` property has been removed. Developers should set the `value` property on the parent `ion-select` to match the desired selected option.

**Before**

```html
<ion-select>
  <ion-select-option>One</ion-select-option>
  <ion-select-option selected>Two</ion-select-option>
</ion-select>
```

**After**

```html
<ion-select value="two">
  <ion-select-option value="one">One</ion-select-option>
  <ion-select-option value="two">Two</ion-select-option>
</ion-select>
```


#### Skeleton Text

The `width` property has been removed in favor of using CSS styling.


#### Split Pane
- Converted to use [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).
- Removed the `main` attribute, use `content-id` (for vanilla JS / Vue) and `contentId` (for Angular / React) instead.
  **Before**

  ```html
  <ion-split-pane>
    ...
    <div main>...</div>
  </ion-split-pane>
  ```

  **After**

  ```html
  <ion-split-pane content-id="main">
    ...
    <div id="main">...</div>
  </ion-split-pane>
  ```

#### Tabs

- [Focused State](#activated-focused-hover-states) have been updated.

#### Toast

The close button properties (`showCloseButton` and `closeButtonText`) have been removed. Use the `buttons` array instead with `role: 'cancel'`. See the [usage documentation](https://ionicframework.com/docs/api/toast#usage) for more information.

**Before**

```javascript
async presentToast() {
  const toast = await this.toastController.create({
    message: 'Your settings have been saved.',
    showCloseButton: true,
    closeButtonText: 'Close'
  });
  toast.present();
}
```

**After**

```javascript
async presentToast() {
  const toast = await this.toastController.create({
    message: 'Your settings have been saved.',
    buttons: [
      {
        text: 'Close',
        role: 'cancel',
        handler: () => {
          console.log('Close clicked');
        }
      }
    ]
  });
  toast.present();
}
```

### Colors

The default Ionic colors have been updated to the following:

```scss
primary:         #3880ff
secondary:       #3dc2ff
tertiary:        #5260ff
success:         #2dd36f
warning:         #ffc409
danger:          #eb445a
light:           #f4f5f8
medium:          #92949c
dark:            #222428
```

`primary`, `light` and `dark` have not changed. The contrast color for `warning` has been updated to `#000`.

This will only be a breaking change in your app if you are not using one of our starters and not overriding the defaults. If you are overriding the defaults already these will need to be manually updated if desired.


### Events

The `@ionic/angular` Events service has been removed.

- Use "Observables" for a similar pub/sub architecture: https://angular.io/guide/observables
- Use "Redux" for advanced state management: https://ngrx.io


### Mode

Mode is now cascaded from the parent to the child component. Previously, if you wanted to update a component and its children to use the same mode, you'd have to set it on all components. For example, if you wanted to use a `md` segment no matter the mode, you'd have to write the following:

```html
<ion-segment mode="md">
  <ion-segment-button mode="md">Button</ion-segment-button>
  <ion-segment-button mode="md">Button</ion-segment-button>
</ion-segment>
```

Now, the `mode` only needs to be set on the `ion-segment` and it will be inherited. If this behavior is not desired set a different mode on the child component.


### Ionicons

Ionicons 5 has been released! :tada: This brings many changes including a top to bottom re-draw of every icon, variants for each icon (filled, outline, and sharp), and the removal of auto-switching icons based on the platform.

For more information, check out the [Ionicons Changelog](https://github.com/ionic-team/ionicons/blob/master/CHANGELOG.md)!



--------------------------------------------------------------------------------------------------

## Version 4.x

The list of the breaking changes introduced in Ionic Angular v4 can be found in [angular/BREAKING.md](https://github.com/ionic-team/ionic/blob/master/angular/BREAKING.md).

## Legacy

For the breaking changes of the older legacy versions (versions 2.x & 3.x) of Ionic Framework, see the [v3 changelog](https://github.com/ionic-team/ionic-v3/blob/master/CHANGELOG.md).
