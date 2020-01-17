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
  * [Activated, Focused, Hover States](#activated--focused--hover-states)
  * [Distributed Sass](#distributed-sass)
- [Components](#components)
  * [Anchor](#anchor)
  * [Back Button](#back-button)
  * [Card](#card)
  * [Controllers](#controllers)
  * [Header / Footer](#header---footer)
  * [List Header](#list-header)
  * [Menu](#menu)
  * [Nav Link](#nav-link)
  * [Radio](#radio)
  * [Searchbar](#searchbar)
  * [Segment](#segment)
  * [Segment Button](#segment-button)
  * [Select Option](#select-option)
  * [Skeleton Text](#skeleton-text)
  * [Split Pane](#split-pane)
  * [Toast](#toast)
- [Colors](#colors)
- [Events](#events)
- [Mode](#mode)
- [Ionicons](#ionicons)


### CSS

#### CSS Utilities

We originally added CSS utility attributes for styling components because it was a quick and easy way to wrap text or add padding to an element. Once we added support for multiple frameworks as part of our "Ionic for everyone" approach, we quickly determined there were problems with using CSS attributes with frameworks that use JSX and Typescript. In order to solve this we added CSS classes. Rather than support CSS attributes in certain frameworks and classes in others, we decided to remove the CSS attributes and support what works in all of them, classes, for consistency. In addition to this, changing to classes prefixed with `ion` avoids conflict with native attributes & user's CSS. In the latest version of Ionic 4, there are deprecation warnings printed in the console to show what the new classes are, and the documentation has been updated since support for classes was added to remove all references to attributes: https://ionicframework.com/docs/layout/css-utilities.

Some examples of what's changed are below. *This is not all-inclusive, see the documentation linked above for all of the available CSS utility classes.*

```html
<ion-header text-center></ion-header>
<ion-content padding></ion-content>
<ion-label text-wrap></ion-label>
<ion-item wrap></ion-item>
```

becomes

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

The `.activated` class that gets added has been renamed to `.ion-activated` for consistency with how we add focused to elements and to avoid conflicts in users' CSS.

<!-- TODO mention some of the changes to the hover values: https://github.com/ionic-team/ionic/pull/19440 -->

#### Distributed Sass

The `scss` files have been removed from `dist/`. CSS variables should be used to theme instead.


### Components

#### Anchor

The `ion-anchor` component has been renamed to `ion-router-link` as this is a better description of which component it should be used with. This component should still only be used in vanilla and Stencil JavaScript projects. Angular projects should use an `<a>` and `routerLink` with the Angular router. See the [documentation for router-link](https://ionicframework.com/docs/api/router-link) for more information.

#### Back Button

Converted `ion-back-button` to use [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

#### Card

Converted `ion-card` to use [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).


### Controllers

The controller components (`ion-action-sheet-controller`, `ion-alert-controller`, `ion-loading-controller`, `ion-menu-controller`, `ion-modal-controller`, `ion-picker-controller`, `ion-popover-controller`, `ion-toast-controller`) have been removed from Ionic core as elements. They should be imported from `@ionic/core` instead. This will not affect projects that use Angular or React. Below is an example of the loading controller change in a JavaScript project, but this change applies to all controller elements.


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

becomes

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


#### Header / Footer

The `no-border` attribute has been removed, use `ion-no-border` class instead. See [CSS Utilities](#css-utilities) above for more information on why this change was made.


#### List Header

The list header has been redesigned to match the latest iOS spec. This may break the design of your application as the previous design had a small font size with uppercase text. The latest design includes a larger, bolder text. If the old look is desired, use custom CSS to achieve it.


#### Menu

- The `swipeEnable()` function has been removed in Angular, use `swipeGesture()` instead.
- The `side` values `left` and `right` have been removed, use `start` and `end` instead.
- Removed the `main` attribute, use `content-id` (for vanilla JS / Vue) and `contentId` (for Angular / React) instead.
  ```html
  <ion-menu>...</ion-menu>
  <ion-content main>...</ion-content>
  ```

  becomes

  ```html
  <ion-menu content-id="main"></ion-menu>
  <ion-content id="main">...</ion-content>
  ```
- The presentation type in `ios` now defaults to `"overlay"`.

#### Nav Link

The `ion-nav-push`, `ion-nav-back`, and `ion-nav-set-root` components have been removed in favor of using `ion-nav-link` with a `router-direction` property which accepts `”root”`, `“forward”`, and `“back”`. This reduces the need for maintaining multiple components when they all do the same thing with different transition directions. See the [documentation for nav-link](https://ionicframework.com/docs/api/nav-link) for more information.


#### Radio

The `ion-radio` must be used inside of an `ion-radio-group` even if there is only one `ion-radio`. Additionally, the `checked` property has been removed. Developers should set the `value` property on the parent `ion-radio-group` to match the value of the desired checked radio button.

Before

```html
<ion-radio checked>One</ion-radio>

<ion-radio-group>
  <ion-radio>One</ion-radio>
  <ion-radio checked>Two</ion-radio>
</ion-radio-group>
```

After

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

```html
<ion-searchbar show-cancel-button>
<ion-searchbar show-cancel-button="true">
<ion-searchbar show-cancel-button="false">
```

becomes

```html
<ion-searchbar show-cancel-button="focus">
<ion-searchbar show-cancel-button="focus">
<ion-searchbar show-cancel-button="never">
```

See the [Searchbar documentation](https://ionicframework.com/docs/api/searchbar#properties) for more information.

##### Inputmode

The `inputmode` property for `ion-searchbar` now defaults to `undefined`. To get the old behavior, set the inputmode property to `"search"`.


#### Segment

<!-- TODO https://gist.github.com/brandyscarney/e6cfe43c359bb2c932e12f8d615e1669 -->


#### Segment Button

The `checked` property has been removed. Developers should set the `value` property on the parent `ion-segment` to match the value of the desired checked segment button.

Before

```html
<ion-segment>
  <ion-segment-button>One</ion-segment-button>
  <ion-segment-button checked>Two</ion-segment-button>
  <ion-segment-button>Three</ion-segment-button>
</ion-segment>
```

After

```html
<ion-segment value="two">
  <ion-segment-button value="one">One</ion-segment-button>
  <ion-segment-button value="two">Two</ion-segment-button>
  <ion-segment-button value="three">Three</ion-segment-button>
</ion-segment>
```


#### Select Option

The `selected` property has been removed. Developers should set the `value` property on the parent `ion-select` to match the desired selected option.

Before

```html
<ion-select>
  <ion-select-option>One</ion-select-option>
  <ion-select-option selected>Two</ion-select-option>
</ion-select>
```

After

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
  ```html
  <ion-split-pane>
    ...
    <div main>...</div>
  </ion-split-pane>
  ```

  becomes

  ```html
  <ion-split-pane content-id="main">
    ...
    <div id="main">...</div>
  </ion-split-pane>
  ```

#### Toast

The close button properties (`showCloseButton` and `closeButtonText`) have been removed. Use the `buttons` array instead with `role: 'cancel'`. See the [usage documentation](https://ionicframework.com/docs/api/toast#usage) for more information.

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

becomes

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

This will only be a breaking change in your app if you are not using one of our starters & not overriding the defaults. If you are overriding the defaults already these will need to be manually updated if desired.


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
