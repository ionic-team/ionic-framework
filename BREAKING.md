# Breaking Changes

This is a comprehensive list of the breaking changes introduced in the major version releases of Ionic Framework.

## Versions

- [Version 8.x](#version-8x)
- [Version 7.x](./BREAKING_ARCHIVE/v7.md)
- [Version 6.x](./BREAKING_ARCHIVE/v6.md)
- [Version 5.x](./BREAKING_ARCHIVE/v5.md)
- [Version 4.x](./BREAKING_ARCHIVE/v4.md)
- [Legacy](https://github.com/ionic-team/ionic-v3/blob/master/CHANGELOG.md)

## Version 8.x

- [Browser and Platform Support](#version-8x-browser-platform-support)
- [Dark Mode](#version-8x-dark-mode)
- [Global Styles](#version-8x-global-styles)
- [Haptics](#version-8x-haptics)
- [Components](#version-8x-components)
  - [Button](#version-8x-button)
  - [Checkbox](#version-8x-checkbox)
  - [Content](#version-8x-content)
  - [Datetime](#version-8x-datetime)
  - [Input](#version-8x-input)
  - [Item](#version-8x-item)
  - [Modal](#version-8x-modal)
  - [Nav](#version-8x-nav)
  - [Picker](#version-8x-picker)
  - [Progress bar](#version-8x-progress-bar)
  - [Radio](#version-8x-radio)
  - [Range](#version-8x-range)
  - [Searchbar](#version-8x-searchbar)
  - [Select](#version-8x-select)
  - [Textarea](#version-8x-textarea)
  - [Toggle](#version-8x-toggle)
- [Framework Specific](#version-8x-framework-specific)
  - [Angular](#version-8x-angular)

<h2 id="version-8x-browser-platform-support">Browser and Platform Support</h2>

This section details the desktop browser, JavaScript framework, and mobile platform versions that are supported by Ionic 8.

**Minimum Browser Versions**
| Desktop Browser | Supported Versions |
| --------------- | ----------------- |
| Chrome          | 89+               |
| Safari          | 15+               |
| Firefox         | 75+               |
| Edge            | 89+               |

**Minimum JavaScript Framework Versions**
| Framework | Supported Version     |
| --------- | --------------------- |
| Angular   | 16+                   |
| React     | 17+                   |
| Vue       | 3.0.6+                |

**Minimum Mobile Platform Versions**
| Platform | Supported Version      |
| -------- | ---------------------- |
| iOS      | 15+                    |
| Android  | 5.1+ with Chromium 89+ |

Ionic Framework v8 removes backwards support for CSS Animations in favor of the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API). All minimum browser versions listed above support the Web Animations API.

<h2 id="version-8x-dark-mode">Dark Mode</h2>


In previous versions, it was recommended to define the dark palette in the following way:

```css
@media (prefers-color-scheme: dark) {
  body {
    /* global app variables */
  }

  .ios body {
    /* global ios app variables */
  }

  .md body {
    /* global md app variables */
  }
}
```

In Ionic Framework version 8, the dark palette is being distributed via css files that can be imported. Below is an example of importing a dark palette file in Angular:

```css
/* @import '@ionic/angular/css/palettes/dark.always.css'; */
/* @import "@ionic/angular/css/palettes/dark.class.css"; */
@import "@ionic/angular/css/palettes/dark.system.css";
```

By importing the `dark.system.css` file, the dark palette variables will be defined like the following:

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* global app variables */
  }

  :root.ios {
    /* global ios app variables */
  }

  :root.md {
    /* global md app variables */
  }
}
```

Notice that the dark palette is now applied to the `:root` selector instead of the `body` selector. The [`:root`](https://developer.mozilla.org/en-US/docs/Web/CSS/:root) selector represents the `<html>` element and is identical to the selector `html`, except that its specificity is higher.

While migrating to include the new dark palette files is unlikely to cause breaking changes, these new selectors can lead to unexpected overrides if custom CSS variables are being set on the `body` element. We recommend updating any instances where global application variables are set to target the `:root` selector instead.

For more information on the new dark palette files, refer to the [Dark Mode documentation](https://ionicframework.com/docs/theming/dark-mode).

<h2 id="version-8x-global-styles">Global Styles</h2>

<h4 id="version-8x-text-color">Text Color</h4>

The `core.css` file has been updated to set the text color on the `body` element:

```diff
body {
+  color: var(--ion-text-color);
}
```

This allows components to inherit the color properly when used outside of Ionic Framework and is required for custom themes to work properly. However, it may have unintentional side effects in apps if the color was not expected to inherit.

<h4 id="version-8x-dynamic-font">Dynamic Font</h4>

The `core.css` file has been updated to enable dynamic font scaling by default.

The `--ion-default-dynamic-font` variable has been removed and replaced with `--ion-dynamic-font`.

Developers who had previously chosen dynamic font scaling by activating it in their global stylesheets can revert to the default setting by removing their custom CSS. In doing so, their application will seamlessly continue utilizing dynamic font scaling as it did before. It's essential to note that altering the font-size of the html element should be avoided, as it may disrupt the proper functioning of dynamic font scaling.

Developers who want to disable dynamic font scaling can set `--ion-dynamic-font: initial;` in their global stylesheets. However, this is not recommended because it may introduce accessibility challenges for users who depend on enlarged font sizes.

For more information on the dynamic font, refer to the [Dynamic Font Scaling documentation](https://ionicframework.com/docs/layout/dynamic-font-scaling).

<h2 id="version-8x-haptics">Haptics</h2>

- Support for the Cordova Haptics plugin has been removed. Components that integrate with haptics, such as `ion-picker` and `ion-toggle`, will continue to function but will no longer play haptics in Cordova environments. Developers should migrate to Capacitor to continue to have haptics in these components.

<h2 id="version-8x-components">Components</h2>

<h4 id="version-8x-button">Button</h4>

- Button text now wraps by default. If this behavior is not desired, add the `ion-text-nowrap` class from the [CSS Utilities](https://ionicframework.com/docs/layout/css-utilities).

<h4 id="version-8x-checkbox">Checkbox</h4>

 The `legacy` property and support for the legacy syntax, which involved placing an `ion-checkbox` inside of an `ion-item` with an `ion-label`, have been removed. For more information on migrating from the legacy checkbox syntax, refer to the [Checkbox documentation](https://ionicframework.com/docs/api/checkbox#migrating-from-legacy-checkbox-syntax).

<h4 id="version-8x-content">Content</h4>

- Content no longer sets the `--background` custom property when the `.outer-content` class is set on the host.

<h4 id="version-8x-datetime">Datetime</h4>

- The CSS shadow part for `month-year-button` has been changed to target a `button` element instead of `ion-item`. Developers should verify their UI renders as expected for the month/year toggle button inside of `ion-datetime`.
   - Developers using the CSS variables available on `ion-item` will need to migrate their CSS to use CSS properties. For example:
      ```diff
      ion-datetime::part(month-year-button) {
      -  --background: red;

      +  background: red;
      }
      ```

<h4 id="version-8x-input">Input</h4>

- `size` has been removed from the `ion-input` component. Developers should use CSS to specify the visible width of the input.
- `accept` has been removed from the `ion-input` component. This was previously used in conjunction with the `type="file"`. However, the `file` value for `type` is not a valid value in Ionic Framework.
- The `legacy` property and support for the legacy syntax, which involved placing an `ion-input` inside of an `ion-item` with an `ion-label`, have been removed. For more information on migrating from the legacy input syntax, refer to the [Input documentation](https://ionicframework.com/docs/api/input#migrating-from-legacy-input-syntax).

<h4 id="version-8x-item">Item</h4>

- The `helper` slot has been removed. Developers should use the `helperText` property on `ion-input` and `ion-textarea`.
- The `error` slot has been removed. Developers should use the `errorText` property on `ion-input` and `ion-textarea`.
- Counter functionality has been removed including the `counter` and `counterFormatter` properties. Developers should use the properties of the same name on `ion-input` and `ion-textarea`.
- The `fill` property has been removed. Developers should use the property of the same name on `ion-input`, `ion-select`, and `ion-textarea`.
- The `shape` property has been removed. Developers should use the property of the same name on `ion-input`, `ion-select`, and `ion-textarea`.
- Item no longer automatically delegates focus to the first focusable element. While most developers should not need to make any changes to account for this update, usages of `ion-item` with interactive elements such as form controls (inputs, textareas, etc) should be evaluated to verify that interactions still work as expected.

<h5>CSS variables</h4>

The following deprecated CSS variables have been removed: `--highlight-height`, `--highlight-color-focused`, `--highlight-color-valid`, and `--highlight-color-invalid`. These variables were used on the bottom border highlight of an item when the form control inside of that item was focused. The form control syntax was [simplified in v7](https://ionic.io/blog/ionic-7-is-here#simplified-form-control-syntax) so that inputs, selects, and textareas would no longer be required to be used inside of an item.

If you have not yet migrated to the modern form control syntax, migration guides for each of the form controls that added a highlight to item can be found below:
- [Input migration documentation](https://ionicframework.com/docs/api/input#migrating-from-legacy-input-syntax)
- [Select migration documentation](https://ionicframework.com/docs/api/select#migrating-from-legacy-select-syntax)
- [Textarea migration documentation](https://ionicframework.com/docs/api/textarea#migrating-from-legacy-textarea-syntax)

Once all form controls are using the modern syntax, the same variables can be used to customize them from the form control itself:

| Name                        | Description                             |
| ----------------------------| ----------------------------------------|
| `--highlight-color-focused` | The color of the highlight when focused |
| `--highlight-color-invalid` | The color of the highlight when invalid |
| `--highlight-color-valid`   | The color of the highlight when valid   |
| `--highlight-height`        | The height of the highlight indicator   |

The following styles for item:

```css
ion-item {
  --highlight-color-focused: purple;
  --highlight-color-valid: blue;
  --highlight-color-invalid: orange;
  --highlight-height: 6px;
}
```

will instead be applied on the form controls:

```css
ion-input,
ion-textarea,
ion-select {
  --highlight-color-focused: purple;
  --highlight-color-valid: blue;
  --highlight-color-invalid: orange;
  --highlight-height: 6px;
}
```

> [!NOTE]
> The input and textarea components are scoped, which means they will automatically scope their CSS by appending each of the styles with an additional class at runtime. Overriding scoped selectors in CSS requires a [higher specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) selector. Targeting the `ion-input` or `ion-textarea` for customization will not work; therefore we recommend adding a class and customizing it that way.

<h4 id="version-8x-modal">Modal</h4>

- Detection for Capacitor <= 2 with applying status bar styles has been removed. Developers should ensure they are using Capacitor 3 or later when using the card modal presentation.

<h4 id="version-8x-nav">Nav</h4>

- `getLength` returns `Promise<number>` instead of `<number>`. This method was not previously available in Nav's TypeScript interface, but developers could still access it by casting Nav as `any`. Developers should ensure they `await` their `getLength` call before accessing the returned value.

<h4 id="version-8x-picker">Picker</h4>

- `ion-picker` and `ion-picker-column` have been renamed to `ion-picker-legacy` and `ion-picker-legacy-column`, respectively. This change was made to accommodate the new inline picker component while allowing developers to continue to use the legacy picker during this migration period.
  - Only the component names have been changed. Usages such as `ion-picker` or `IonPicker` should be changed to `ion-picker-legacy` and `IonPickerLegacy`, respectively.
  - Non-component usages such as `pickerController` or `useIonPicker` remain unchanged. The new picker displays inline with your page content and does not have equivalents for these non-component usages.

<h4 id="version-8x-progress-bar">Progress bar</h4>

- The `--buffer-background` CSS variable has been removed. Use `--background` instead.

<h4 id="version-8x-toast">Toast</h4>

- `cssClass` has been removed from the `ToastButton` interface. This was previously used to apply a custom class to the toast buttons. Developers can use the "button" shadow part to style the buttons.

For more information on styling toast buttons, refer to the [Toast Theming documentation](https://ionicframework.com/docs/api/toast#theming).

<h4 id="version-8x-radio">Radio</h4>

- The `legacy` property and support for the legacy syntax, which involved placing an `ion-radio` inside of an `ion-item` with an `ion-label`, have been removed. For more information on migrating from the legacy radio syntax, refer to the [Radio documentation](https://ionicframework.com/docs/api/radio#migrating-from-legacy-radio-syntax).

<h4 id="version-8x-range">Range</h4>

- The `legacy` property and support for the legacy syntax, which involved placing an `ion-range` inside of an `ion-item` with an `ion-label`, have been removed. Ionic will also no longer attempt to automatically associate form controls with sibling `<label>` elements as these label elements are now used inside the form control. Developers should provide a label (either visible text or `aria-label`) directly to the form control. For more information on migrating from the legacy range syntax, refer to the [Range documentation](https://ionicframework.com/docs/api/range#migrating-from-legacy-range-syntax).

<h4 id="version-8x-searchbar">Searchbar</h4>

- The `autocapitalize` property now defaults to `'off'`.

<h4 id="version-8x-select">Select</h4>

- The `legacy` property and support for the legacy syntax, which involved placing an `ion-select` inside of an `ion-item` with an `ion-label`, have been removed. Ionic will also no longer attempt to automatically associate form controls with sibling `<label>` elements as these label elements are now used inside the form control. Developers should provide a label (either visible text or `aria-label`) directly to the form control. For more information on migrating from the legacy select syntax, refer to the [Select documentation](https://ionicframework.com/docs/api/select#migrating-from-legacy-select-syntax).

<h4 id="version-8x-textarea">Textarea</h4>

- The `legacy` property and support for the legacy syntax, which involved placing an `ion-textarea` inside of an `ion-item` with an `ion-label`, have been removed. For more information on migrating from the legacy textarea syntax, refer to the [Textarea documentation](https://ionicframework.com/docs/api/textarea#migrating-from-legacy-textarea-syntax).

<h4 id="version-8x-toggle">Toggle</h4>

- The `legacy` property and support for the legacy syntax, which involved placing an `ion-toggle` inside of an `ion-item` with an `ion-label`, have been removed. For more information on migrating from the legacy toggle syntax, refer to the [Toggle documentation](https://ionicframework.com/docs/api/toggle#migrating-from-legacy-toggle-syntax).

<h2 id="version-8x-framework-specific">Framework Specific</h2>

<h4 id="version-8x-angular">Angular</h4>

- The `IonBackButtonDelegate` class has been removed in favor of `IonBackButton`.

  ```diff
  - import { IonBackButtonDelegate } from '@ionic/angular';
  + import { IonBackButton } from '@ionic/angular';
  ```
