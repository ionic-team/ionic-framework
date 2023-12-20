# Breaking Changes

This is a comprehensive list of the breaking changes introduced in the major version releases of Ionic Framework.

## Versions

- [Version 7.x](#version-7x)
- [Version 6.x](./BREAKING_ARCHIVE/v6.md)
- [Version 5.x](./BREAKING_ARCHIVE/v5.md)
- [Version 4.x](./BREAKING_ARCHIVE/v4.md)
- [Legacy](https://github.com/ionic-team/ionic-v3/blob/master/CHANGELOG.md)

## Version 7.x

- [Browser and Platform Support](#version-7x-browser-platform-support)
- [Components](#version-7x-components)
  - [Accordion Group](#version-7x-accordion-group)
  - [Action Sheet](#version-7x-action-sheet)
  - [Back Button](#version-7x-back-button)
  - [Button](#version-7x-button)
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
- [Config](#version-7x-config)
- [Types](#version-7x-types)
  - [Overlay Attribute Interfaces](#version-7x-overlay-attribute-interfaces)
- [JavaScript Frameworks](#version-7x-javascript-frameworks)
  - [Angular](#version-7x-angular)
  - [React](#version-7x-react)
  - [Vue](#version-7x-vue)
- [CSS Utilities](#version-7x-css-utilities)
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

<h4 id="version-7x-button">Button</h4>

- Button is updated to align with the design specification for iOS.

**Design tokens**

| Token                              | Previous Value | New Value |
| ---------------------------------- | -------------- | --------- |
| `$button-ios-letter-spacing`       | `-0.03em`      | `0`       |
| `$button-ios-clear-letter-spacing` | `0`            | Removed   |
| `$button-ios-height`               | `2.8em`        | `3.1em`   |
| `$button-ios-border-radius`        | `10px`         | `14px`    |
| `$button-ios-large-height`         | `2.8em`        | `3.1em`   |
| `$button-ios-large-border-radius`  | `12px`         | `16px`    |

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

- `ionChange` is no longer emitted when the `value` of `ion-input` is modified externally. `ionChange` is only emitted from user committed changes, such as typing in the input and the input losing focus, clicking the clear action within the input, or pressing the "Enter" key.

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

- `ionChange` is no longer emitted when the `value` of `ion-searchbar` is modified externally. `ionChange` is only emitted from user committed changes, such as typing in the searchbar and the searchbar losing focus or pressing the "Enter" key.

  - If your application requires immediate feedback based on the user typing actively in the searchbar, consider migrating your event listeners to using `ionInput` instead.

- The `debounce` property has been updated to control the timing in milliseconds to delay the event emission of the `ionInput` event after each keystroke. Previously it would delay the event emission of `ionChange`.

- The `debounce` property's default value has changed from 250 to `undefined`. If `debounce` is undefined, the `ionInput` event will fire immediately.

- The `detail` payload for the `ionInput` event now contains an object with the current `value` as well as the native event that triggered `ionInput`.

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

<h2 id="version-7x-config">Config</h2>

- `innerHTMLTemplatesEnabled` defaults to `false`. Developers who wish to use the `innerHTML` functionality inside of `ion-alert`, `ion-infinite-scroll-content`, `ion-loading`, `ion-refresher-content`, and `ion-toast` must set this config to `true` and properly sanitize their content.

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

<h2 id="version-7x-css-utilities">CSS Utilities</h2>

<h4 id="version-7x-hidden-attribute">`hidden` attribute</h4>

The `[hidden]` attribute has been removed from Ionic's global stylesheet. The `[hidden]` attribute can continue to be used, but developers will get the [native `hidden` implementation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) instead. The main difference is that the native implementation is easier to override using `display` than Ionic's implementation.

Developers can add the following CSS to their global stylesheet if they need the old behavior:

```css
[hidden] {
  display: none !important;
}
```
