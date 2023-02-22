# Breaking Changes

This is a comprehensive list of the breaking changes introduced in the major version releases of Ionic Framework.

## Versions

- [Version 7.x](#version-7x)
- [Version 6.x](#version-6x)
- [Version 5.x](./BREAKING_ARCHIVE/v5.md)
- [Version 4.x](./BREAKING_ARCHIVE/v4.md)
- [Legacy](https://github.com/ionic-team/ionic-v3/blob/master/CHANGELOG.md)

## Version 7.x

- [Browser and Platform Support](#version-7x-browser-platform-support)
- [Components](#version-7x-components)
  - [Accordion Group](#version-7x-accordion-group)
  - [Action Sheet](#version-7x-action-sheet)
  - [Back Button](#version-7x-back-button)
  - [Card Header](#version-7x-card-header)
  - [Checkbox](#version-7x-checkbox)
  - [Datetime](#version-7x-datetime)
  - [Input](#version-7x-input)
  - [Item](#version-7x-item)
  - [Modal](#version-7x-modal)
  - [Overlays](#version-7x-overlays)
  - [Picker](#version-7x-picker)
  - [Radio Group](#version-7x-radio-group)
  - [Range](#version-7x-range)
  - [Searchbar](#version-7x-searchbar)
  - [Segment](#version-7x-segment)
  - [Select](#version-7x-select)
  - [Slides](#version-7x-slides)
  - [Textarea](#version-7x-textarea)
  - [Toggle](#version-7x-toggle)
  - [Virtual Scroll](#version-7x-virtual-scroll)
- [Types](#version-7x-types)
  - [Overlay Attribute Interfaces](#version-7x-overlay-attribute-interfaces)
- [JavaScript Frameworks](#version-7x-javascript-frameworks)
  - [Angular](#version-7x-angular)
  - [React](#version-7x-react)
  - [Vue](#version-7x-vue)
- [Utilities](#version-7x-utilities)
  - [hidden attribute](#version-7x-hidden-attribute)

<h2 id="version-7x-browser-platform-support">Browser and Platform Support</h2>

This section details the desktop browser, JavaScript framework, and mobile platform versions that are supported by Ionic 7.

**Minimum Browser Versions**
| Desktop Browser | Supported Versions |
| --------------- | ----------------- |
| Chrome          | 79+               |
| Safari          | 14+               |
| Firefox         | 70+               |
| Edge            | 79+               |

**Minimum JavaScript Framework Versions**

| Framework | Supported Version     |
| --------- | --------------------- |
| Angular   | 14+                   |
| React     | 17+                   |
| Vue       | 3.0.6+                |

**Minimum Mobile Platform Versions**

| Platform | Supported Version      |
| -------- | ---------------------- |
| iOS      | 14+                    |
| Android  | 5.1+ with Chromium 79+ |

<h2 id="version-7x-components">Components</h2>

<h4 id="version-7x-accordion-group">Accordion Group</h4>

- `ionChange` is no longer emitted when the `value` of `ion-accordion-group` is modified externally. `ionChange` is only emitted from user committed changes, such as clicking or tapping the accordion header.

- Accordion Group no longer automatically adjusts the `value` property when passed an array and `multiple="false"`. Developers should update their apps to ensure they are using the API correctly.

<h4 id="version-7x-action-sheet">Action Sheet</h4>

- Action Sheet is updated to align with the design specification.

**Design tokens**

| Token      | Previous Value | New Value |
| ---------- | -------------- | --------- |
| `--height` | `100%`         | `auto`    |

<h4 id="version-7x-back-button">Back Button</h4>

- Back Button is updated to align with the design specification for iOS.

**Design tokens**

| Token               | Previous Value | New Value |
| ------------------- | -------------- | --------- |
| `--icon-margin-end` | `-5px`         | `1px`     |
| `--icon-font-size`  | `1.85em`       | `1.6em`   |

<h4 id="version-7x-card-header">Card Header</h4>

- The card header has ben changed to a flex container with direction set to `column` (top to bottom). In `ios` mode the direction is set to `column-reverse` which results in the subtitle displaying on top of the title.

<h4 id="version-7x-checkbox">Checkbox</h4>

- `ionChange` is no longer emitted when the `checked` property of `ion-checkbox` is modified externally. `ionChange` is only emitted from user committed changes, such as clicking or tapping the checkbox.

- The `--background` and `--background-checked` CSS variables have been renamed to `--checkbox-background` and `--checkbox-background-checked` respectively.

<h4 id="version-7x-datetime">Datetime</h4>

- `ionChange` is no longer emitted when the `value` property of `ion-datetime` is modified externally. `ionChange` is only emitted from user committed changes, such as clicking or tapping a date.

- Datetime no longer automatically adjusts the `value` property when passed an array and `multiple="false"`. Developers should update their apps to ensure they are using the API correctly.

- Datetime no longer incorrectly reports the time zone when `value` is updated. Datetime does not manage time zones, so any time zone information provided is ignored.

- Passing the empty string to the `value` property will now error as it is not a valid ISO-8601 value.

- The haptics when swiping the wheel picker are now enabled only on iOS.

<h4 id="version-7x-input">Input</h4>

- `ionChange` is no longer emitted when the `value` of `ion-input` is modified externally. `ionChange` is only emitted from user committed changes, such as typing in the input and the input losing focus or from clicking the clear action within the input.

  - If your application requires immediate feedback based on the user typing actively in the input, consider migrating your event listeners to using `ionInput` instead.

- The `debounce` property has been updated to control the timing in milliseconds to delay the event emission of the `ionInput` event after each keystroke. Previously it would delay the event emission of `ionChange`.

- The `debounce` property's default value has changed from `0` to `undefined`. If `debounce` is undefined, the `ionInput` event will fire immediately.

- The `detail` payload for the `ionInput` event now contains an object with the current `value` as well as the native event that triggered `ionInput`.

**Design tokens**

| Token                   | Previous Value | New Value |
| ----------------------- | -------------- | --------- |
| `--placeholder-opacity` | `0.5`          | `0.6`     |

<h4 id="version-7x-item">Item</h4>

**Design tokens**

iOS:

| Token                 | Previous Value | New Value |
| --------------------- | -------------- | --------- |
| `$item-ios-font-size` | `17px`         | `16px`    |
| `--inner-padding-end` | `10px`         | `16px`    |
| `--padding-start`     | `20px`         | `16px`    |

<h4 id="version-7x-modal">Modal</h4>

- The `swipeToClose` property has been removed in favor of `canDismiss`.
- The `canDismiss` property now defaults to `true` and can no longer be set to `undefined`.

<h4 id="version-7x-overlays">Overlays</h4>

Ionic now listens on the `keydown` event instead of the `keyup` event when determining when to dismiss overlays via the "Escape" key. Any applications that were listening on `keyup` to suppress this behavior should listen on `keydown` instead.

<h4 id="version-7x-picker">Picker</h4>

- The `refresh` key has been removed from the `PickerColumn` interface. Developers should use the `columns` property to refresh the `ion-picker` view.

<h4 id="version-7x-radio-group">Radio Group</h4>

- `ionChange` is no longer emitted when the `value` of `ion-radio-group` is modified externally. `ionChange` is only emitted from user committed changes, such as clicking or tapping an `ion-radio` in the group.

<h4 id="version-7x-range">Range</h4>

- Range is updated to align with the design specification for supported modes.

  **Design tokens**

  iOS:

  | Token                             | Previous Value                                                                            | New Value                                                             |
  | --------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
  | `--bar-border-radius`             | `0px`                                                                                     | `$range-ios-bar-border-radius` (`2px` default)                        |
  | `--knob-size`                     | `28px`                                                                                    | `$range-ios-knob-width` (`26px` default)                              |
  | `$range-ios-bar-height`           | `2px`                                                                                     | `4px`                                                                 |
  | `$range-ios-bar-background-color` | `rgba(var(--ion-text-color-rgb, 0, 0, 0), .1)`                                            | `var(--ion-color-step-900, #e6e6e6)`                                  |
  | `$range-ios-knob-box-shadow`      | `0 3px 1px rgba(0, 0, 0, .1), 0 4px 8px rgba(0, 0, 0, .13), 0 0 0 1px rgba(0, 0, 0, .02)` | `0px 0.5px 4px rgba(0, 0, 0, 0.12), 0px 6px 13px rgba(0, 0, 0, 0.12)` |
  | `$range-ios-knob-width`           | `28px`                                                                                    | `26px`                                                                |

- `ionChange` is no longer emitted when the `value` of `ion-range` is modified externally. `ionChange` is only emitted from user committed changes, such as dragging and releasing the range knob or selecting a new value with the keyboard arrows.
  - If your application requires immediate feedback based on the user actively dragging the range knob, consider migrating your event listeners to using `ionInput` instead.

- The `debounce` property's value value has changed from `0` to `undefined`. If `debounce` is undefined, the `ionInput` event will fire immediately.

- Range no longer clamps assigned values within bounds. Developers will need to validate the value they are assigning to `ion-range` is within the `min` and `max` bounds when programmatically assigning a value. 

- The `name` property defaults to `ion-r-${rangeIds++}` where `rangeIds` is a number that is incremented for every instance of `ion-range`.

<h4 id="version-7x-searchbar">Searchbar</h4>

- `ionChange` is no longer emitted when the `value` of `ion-searchbar` is modified externally. `ionChange` is only emitted from user committed changes, such as typing in the searchbar and the searchbar losing focus.

  - If your application requires immediate feedback based on the user typing actively in the searchbar, consider migrating your event listeners to using `ionInput` instead.

- The `debounce` property has been updated to control the timing in milliseconds to delay the event emission of the `ionInput` event after each keystroke. Previously it would delay the event emission of `ionChange`.

- The `debounce` property's default value has changed from 250 to `undefined`. If `debounce` is undefined, the `ionInput` event will fire immediately.

**Design tokens**

| Token                   | Previous Value | New Value |
| ----------------------- | -------------- | --------- |
| `--placeholder-opacity` | `0.5`          | `0.6`     |


<h4 id="version-7x-segment">Segment</h4>

- `ionChange` is no longer emitted when the `value` of `ion-segment` is modified externally. `ionChange` is only emitted from user committed changes, such as clicking a segment button or dragging to activate a segment button.

- The type signature of `value` supports `string | undefined`. Previously the type signature was `string | null | undefined`.
  - Developers needing to clear the checked segment item should assign a value of `''` instead of `null`.

<h4 id="version-7x-select">Select</h4>

- `ionChange` is no longer emitted when the `value` of `ion-select` is modified externally. `ionChange` is only emitted from user committed changes, such as confirming a selected option in the select's overlay.

- The `icon` CSS Shadow Part now targets an `ion-icon` component.

**Design tokens**

| Token                   | Previous Value | New Value |
| ----------------------- | -------------- | --------- |
| `--placeholder-opacity` | `0.33`         | `0.6`     |

<h4 id="version-7x-slides">Slides</h4>

`ion-slides`, `ion-slide`, and the `IonicSwiper` plugin have been removed from Ionic.

Developers using these components will need to migrate to using Swiper.js directly, optionally using the `IonicSlides` plugin. Guides for migration and usage are linked below:

- [Angular](https://ionicframework.com/docs/angular/slides)
- [React](https://ionicframework.com/docs/react/slides)
- [Vue](https://ionicframework.com/docs/vue/slides)

<h4 id="version-7x-textarea">Textarea</h4>

- `ionChange` is no longer emitted when the `value` of `ion-textarea` is modified externally. `ionChange` is only emitted from user committed changes, such as typing in the textarea and the textarea losing focus.

  - If your application requires immediate feedback based on the user typing actively in the textarea, consider migrating your event listeners to using `ionInput` instead.

- The `debounce` property has been updated to control the timing in milliseconds to delay the event emission of the `ionInput` event after each keystroke. Previously it would delay the event emission of `ionChange`.

- The `debounce` property's default value has changed from `0` to `undefined`. If `debounce` is undefined, the `ionInput` event will fire immediately.

- `ionInput` dispatches an event detail of `null` when the textarea is cleared as a result of `clear-on-edit="true"`.

- The `detail` payload for the `ionInput` event now contains an object with the current `value` as well as the native event that triggered `ionInput`.

**Design tokens**

| Token                   | Previous Value | New Value |
| ----------------------- | -------------- | --------- |
| `--placeholder-opacity` | `0.5`          | `0.6`     |


<h4 id="version-7x-toggle">Toggle</h4>

- `ionChange` is no longer emitted when the `checked` property of `ion-toggle` is modified externally. `ionChange` is only emitted from user committed changes, such as clicking the toggle to set it on or off.

- The `--background` and `--background-checked` variables have been renamed to `--track-background` and `--track-background-checked`, respectively.

<h4 id="version-7x-virtual-scroll">Virtual Scroll</h4>

`ion-virtual-scroll` has been removed from Ionic.

Developers using the component will need to migrate to a virtual scroll solution provided by their framework:

- [Angular](https://ionicframework.com/docs/angular/virtual-scroll)
- [React](https://ionicframework.com/docs/react/virtual-scroll)
- [Vue](https://ionicframework.com/docs/vue/virtual-scroll)

Any references to the virtual scroll types from `@ionic/core` have been removed. Please remove or replace these types: `Cell`, `VirtualNode`, `CellType`, `NodeChange`, `HeaderFn`, `ItemHeightFn`, `FooterHeightFn`, `ItemRenderFn` and `DomRenderFn`.

<h2 id="version-7x-types">Types</h2>

<h4 id="version-7x-overlay-attribute-interfaces">Overlay Attribute Interfaces</h4>

`ActionSheetAttributes`, `AlertAttributes`, `AlertTextareaAttributes`, `AlertInputAttributes`, `LoadingAttributes`, `ModalAttributes`, `PickerAttributes`, `PopoverAttributes`, and `ToastAttributes` have been removed. Developers should use `{ [key: string]: any }` instead.

<h2 id="version-7x-javascript-frameworks">JavaScript Frameworks</h2>

<h4 id="version-7x-angular">Angular</h4>

- Angular v14 is now required to use `@ionic/angular` and `@ionic/angular-server`. Upgrade your project to Angular v14 by following the [Angular v14 update guide](https://update.angular.io/?l=3&v=13.0-14.0).

- `null` values on form components will no longer be converted to the empty string (`''`) or `false`. This impacts `ion-checkbox`, `ion-datetime`, `ion-input`, `ion-radio`, `ion-radio-group`, `ion-range`, `ion-searchbar`, `ion-segment`, `ion-select`, `ion-textarea`, and `ion-toggle`.

- The dev-preview `environmentInjector` property has been removed from `ion-tabs` and `ion-router-outlet`. Standalone component routing is now available without additional custom configuration. Remove the `environmentInjector` property from your `ion-tabs` and `ion-router-outlet` components.

<h4 id="version-7x-react">React</h4>

`@ionic/react` and `@ionic/react-router` no longer ship a CommonJS entry point. Instead, only an ES Module entry point is provided for improved compatibility with Vite.

<h4 id="version-7x-vue">Vue</h4>

`@ionic/vue` and `@ionic/vue-router` no longer ship a CommonJS entry point. Instead, only an ES Module entry point is provided for improved compatibility with Vite.

<h2 id="version-7x-utilities">Utilities</h2>

<h4 id="version-7x-hidden-attribute">`hidden` attribute</h4>

The `[hidden]` attribute has been removed from Ionic's global stylesheet. The `[hidden]` attribute can continue to be used, but developers will get the [native `hidden` implementation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) instead. The main difference is that the native implementation is easier to override using `display` than Ionic's implementation.

Developers can add the following CSS to their global stylesheet if they need the old behavior:

```css
[hidden] {
  display: none !important;
}
```


## Version 6.x

- [Components](#components)
  * [Datetime](#datetime)
  * [Header](#header)
  * [Icons](#icons)
  * [Input](#input)
  * [Modal](#modal)
  * [Popover](#popover)
  * [Radio](#radio)
  * [Searchbar](#searchbar)
  * [Select](#select)
  * [Tab Bar](#tab-bar)
  * [Textarea](#textarea)
  * [Toast](#toast)
  * [Toolbar](#toolbar)
- [Config](#config)
  * [Transition Shadow](#transition-shadow)
- [Angular](#angular)
  * [Config](#config-1)
- [Vue](#vue)
  * [Config](#config-2)
  * [Tabs Config](#tabs-config)
  * [Tabs Router Outlet](#tabs-router-outlet)
  * [Overlay Events](#overlay-events)
  * [Utility Function Types](#utility-function-types)
- [React](#react)
  * [Config](#config-3)
- [Browser and Platform Support](#browser-and-platform-support)


### Components

#### Datetime

The `ion-datetime` component has undergone a complete rewrite and uses a new calendar style. As a result, some of the properties no longer apply and have been removed.

- `ion-datetime` now displays the calendar inline by default, allowing for more flexibility in presentation. As a result, the `placeholder` property has been removed. Additionally, the `text` and `placeholder` Shadow Parts have been removed.

- The `--padding-bottom`, `--padding-end`, `--padding-start`, `--padding-top`, and `--placeholder-color` CSS Variables have been removed since `ion-datetime` now displays inline by default.

- The `displayFormat` and `displayTimezone` properties have been removed since `ion-datetime` now displays inline with a calendar picker. To parse the UTC string provided in the payload of the `ionChange` event, we recommend using a 3rd-party date library like [date-fns](https://date-fns.org/). Here is an example of how you can take the UTC string from `ion-datetime` and format it to whatever style you prefer:

```typescript
import { format, parseISO } from 'date-fns';

/**
 * This is provided in the event
 * payload from the `ionChange` event.
 */
const dateFromIonDatetime = '2021-06-04T14:23:00-04:00';
const formattedString = format(parseISO(dateFromIonDatetime), 'MMM d, yyyy');

console.log(formattedString); // Jun 4, 2021
```

- The `pickerOptions` and `pickerFormat` properties have been removed since `ion-datetime` now uses a calendar style rather than a wheel picker style.

- The `monthNames`, `monthShortNames`, `dayNames`, and `dayShortNames` properties have been removed. `ion-datetime` can now automatically format these values according to your devices locale thanks to the [Intl.DateTimeFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat). If you wish to force a specific locale, you can use the new `locale` property:

```html
<ion-datetime locale="fr-FR"></ion-datetime>
```

- The `open` method has been removed. To present the datetime in an overlay, you can pass it into an `ion-modal` or `ion-popover` component and call the `present` method on the overlay instance. Alternatively, you can use the `trigger` property on `ion-modal` or `ion-popover` to present the overlay on a button click:

```html
<ion-button id="open-modal">Open Datetime Modal</ion-button>
<ion-modal trigger="open-modal">
  <ion-datetime></ion-datetime>
</ion-modal>
```

#### Header

When using a collapsible large title, the last toolbar in the header with `collapse="condense"` no longer has a border. This does not affect the toolbar when the large title is collapsed.

To get the old style back, add the following CSS to your global stylesheet:

```css
ion-header.header-collapse-condense ion-toolbar:last-of-type {
  --border-width: 0 0 0.55px;
}
```

#### Icons

Ionic 6 now ships with Ionicons 6. Please be sure to review the [Ionicons 6.0.0 Changelog](https://github.com/ionic-team/ionicons/releases/tag/v6.0.0) and make any necessary changes.

#### Input

The `placeholder` property now has a type of `string | undefined` rather than `null | string | undefined`.

#### Modal

Converted `ion-modal` to use [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

If you were targeting the internals of `ion-modal` in your CSS, you will need to target the `backdrop` or `content` [Shadow Parts](https://ionicframework.com/docs/theming/css-shadow-parts) instead, or use the provided CSS Variables.

Developers dynamically creating modals using `document.createElement('ion-modal')` will now need to call `modal.remove()` after the modal has been dismissed if they want the modal to be removed from the DOM.

#### Popover

Converted `ion-popover` to use [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

If you were targeting the internals of `ion-popover` in your CSS, you will need to target the `backdrop`, `arrow`, or `content` [Shadow Parts](https://ionicframework.com/docs/theming/css-shadow-parts) instead, or use the provided CSS Variables.

Developers dynamically creating popovers using `document.createElement('ion-popover')` will now need to call `popover.remove()` after the popover has been dismissed if they want the popover to be removed from the DOM.

#### Radio

The `RadioChangeEventDetail` interface has been removed. Instead, listen for the `ionChange` event on `ion-radio-group` and use the `RadioGroupChangeEventDetail` interface.

#### Searchbar

The `showClearButton` property now defaults to `'always'` for improved usability with screen readers.

To get the old behavior, set `showClearButton` to `'focus'`.

#### Select

The `placeholder` property now has a type of `string | undefined` rather than `null | string | undefined`.

#### Tab Bar

The default iOS tab bar background color has been updated to better reflect the latest iOS styles. The new default value is:

```css
var(--ion-tab-bar-background, var(--ion-color-step-50, #f7f7f7));
```

#### Textarea

The `placeholder` property now has a type of `string | undefined` rather than `null | string | undefined`.

#### Toast

The `--white-space` CSS variable now defaults to `normal` instead of `pre-wrap`.

#### Toolbar

The default iOS toolbar background color has been updated to better reflect the latest iOS styles. The new default value is:

```css
var(--ion-toolbar-background, var(--ion-color-step-50, #f7f7f7));
```


### Config

#### Transition Shadow

The `experimentalTransitionShadow` config option has been removed. The transition shadow is now enabled when running in `ios` mode.


### Angular

#### Config

The `Config.set()` method has been removed. See https://ionicframework.com/docs/angular/config for examples on how to set config globally, per-component, and per-platform.

Additionally, the `setupConfig` function is no longer exported from `@ionic/angular`. Developers should use `IonicModule.forRoot` to set the config instead. See https://ionicframework.com/docs/angular/config for more information.

### React

#### Config

All Ionic React applications must now import `setupIonicReact` from `@ionic/react` and call it. If you are setting a custom config with `setupConfig`, pass your config directly to `setupIonicReact` instead:

**Old**
```javascript
import { setupConfig } from '@ionic/react';

setupConfig({
  mode: 'md'
})
```

**New**
```javascript
import { setupIonicReact } from '@ionic/react';

setupIonicReact({
  mode: 'md'
})
```

Note that all Ionic React applications must call `setupIonicReact` even if they are not setting custom configuration.

Additionally, the `setupConfig` function is no longer exported from `@ionic/react`.

### Vue

#### Config

The `setupConfig` function is no longer exported from `@ionic/vue`. Developers should pass their config into the `IonicVue` plugin. See https://ionicframework.com/docs/vue/config for more information.

#### Tabs Config

Support for child routes nested inside of tabs has been removed to better conform to Vue Router's best practices. Additional routes should be written as sibling routes with the parent tab as the path prefix:

**Old**
```typescript
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: 'tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1.vue'),
        children: {
          {
            path: 'view',
            component: () => import('@/views/Tab1View.vue')
          }
        }
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3.vue')
      }
    ]
  }
]
```

**New**
```typescript
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: 'tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1.vue')
      },
      {
        path: 'tab1/view',
        component: () => import('@/views/Tab1View.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3.vue')
      }
    ]
  }
]
```

In the example above `tabs/tab1/view` has been rewritten has a sibling route to `tabs/tab1`. The `path` field now includes the `tab1` prefix.

#### Tabs Router Outlet

Developers must now provide an `ion-router-outlet` inside of `ion-tabs`. Previously one was generated automatically, but this made it difficult for developers to access the properties on the generated `ion-router-outlet`.

**Old**
```html
<ion-tabs>
  <ion-tab-bar slot="bottom">
    ...
  </ion-tab-bar>
</ion-tabs>

<script>
  import { IonTabs, IonTabBar } from '@ionic/vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: { IonTabs, IonTabBar }
  });
</script>
```

**New**
```html
<ion-tabs>
  <ion-router-outlet></ion-router-outlet>
  <ion-tab-bar slot="bottom">
    ...
  </ion-tab-bar>
</ion-tabs>

<script>
  import { IonTabs, IonTabBar, IonRouterOutlet } from '@ionic/vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: { IonTabs, IonTabBar, IonRouterOutlet }
  });
</script>
```

#### Overlay Events

Overlay events `onWillPresent`, `onDidPresent`, `onWillDismiss`, and `onDidDismiss` have been removed in favor of `willPresent`, `didPresent`, `willDismiss`, and `didDismiss`.

This applies to the following components: `ion-action-sheet`, `ion-alert`, `ion-loading`, `ion-modal`, `ion-picker`, `ion-popover`, and `ion-toast`.

**Old**
```html
<ion-modal
  :is-open="modalOpenRef"
  @onWillPresent="onModalWillPresentHandler"
  @onDidPresent="onModalDidPresentHandler"
  @onWillDismiss="onModalWillDismissHandler"
  @onDidDismiss="onModalDidDismissHandler"
>
  ...
</ion-modal>
```

**New**
```html
<ion-modal
  :is-open="modalOpenRef"
  @willPresent="onModalWillPresentHandler"
  @didPresent="onModalDidPresentHandler"
  @willDismiss="onModalWillDismissHandler"
  @didDismiss="onModalDidDismissHandler"
>
  ...
</ion-modal>
```

#### Utility Function Types

- The `IonRouter` type for `useIonRouter` has been renamed to `UseIonRouterResult`.

- The `IonKeyboardRef` type for `useKeyboard` has been renamed to `UseKeyboardResult`.


### Browser and Platform Support

This section details the desktop browser, JavaScript framework, and mobile platform versions that are supported by Ionic Framework v6.

**Minimum Browser Versions**
| Desktop Browser | Supported Versions |
| --------------- | ----------------- |
| Chrome          | 60+               |
| Safari          | 13+               |
| Firefox         | 63+               |
| Edge            | 79+               |

**Minimum JavaScript Framework Versions**

| Framework | Supported Version     |
| --------- | --------------------- |
| Angular   | 12+                   |
| React     | 17+                   |
| Vue       | 3.0.6+                |

**Minimum Mobile Platform Versions**

| Platform | Supported Version                       |
| -------- | --------------------------------------- |
| iOS      | 13+                                     |
| Android  | 5.0+ with Chromium 60+ (See note below) |

Starting with Android 5.0, the webview was moved to a separate application that can be updated independently of Android. This means that most Android 5.0+ devices are going to be running a modern version of Chromium. However, there are a still a subset of Android devices whose manufacturer has locked the webview version and does not allow the webview to update. These webviews are typically stuck at the version that was available when the device initially shipped.

As a result, Ionic Framework only supports Android devices and emulators running Android 5.0+ with a webview of Chromium 60 or newer. For context, this is the version that Stencil can support with no polyfills: https://stenciljs.com/docs/browser-support
