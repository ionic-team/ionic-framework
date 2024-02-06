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
- [Dark Theme](#version-8x-dark-theme)
- [Global Styles](#version-8x-global-styles)
- [Components](#version-8x-components)
  - [Button](#version-8x-button)
  - [Content](#version-8x-content)
  - [Datetime](#version-8x-datetime)
  - [Input](#version-8x-input)
  - [Nav](#version-8x-nav)
  - [Picker](#version-8x-picker)

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

<h2 id="version-8x-dark-theme">Dark Theme</h2>

In previous versions, it was recommended to define the dark theme in the following way:

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

In Ionic Framework version 8, the dark theme is being distributed via css files that can be imported. Below is an example of importing a dark theme file in Angular:

```css
/* @import '@ionic/angular/css/themes/dark.always.css'; */
/* @import "@ionic/angular/css/themes/dark.class.css"; */
@import "@ionic/angular/css/themes/dark.system.css";
```

By importing the `dark.system.css` file, the dark theme variables will be defined like the following:

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

Notice that the dark theme is now applied to the `:root` selector instead of the `body` selector. The [`:root`](https://developer.mozilla.org/en-US/docs/Web/CSS/:root) selector represents the `<html>` element and is identical to the selector `html`, except that its specificity is higher.

While migrating to include the new dark theme files is unlikely to cause breaking changes, these new selectors can lead to unexpected overrides if custom CSS variables are being set on the `body` element. We recommend updating any instances where global application variables are set to target the `:root` selector instead.

For more information on the new dark theme files, refer to the [Dark Mode documentation](https://ionicframework.com/docs/theming/dark-mode).

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
<h2 id="version-8x-components">Components</h2>

<h4 id="version-8x-button">Button</h4>

- Button text now wraps by default. If this behavior is not desired, add the `ion-text-nowrap` class from the [CSS Utilities](https://ionicframework.com/docs/layout/css-utilities).

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

<h4 id="version-8x-nav">Nav</h4>

- `getLength` returns `Promise<number>` instead of `<number>`. This method was not previously available in Nav's TypeScript interface, but developers could still access it by casting Nav as `any`. Developers should ensure they `await` their `getLength` call before accessing the returned value.

<h4 id="version-8x-picker">Picker</h4>

- `ion-picker` and `ion-picker-column` have been renamed to `ion-picker-legacy` and `ion-picker-legacy-column`, respectively. This change was made to accommodate the new inline picker component while allowing developers to continue to use the legacy picker during this migration period.
  - Only the component names have been changed. Usages such as `ion-picker` or `IonPicker` should be changed to `ion-picker-legacy` and `IonPickerLegacy`, respectively.
  - Non-component usages such as `pickerController` or `useIonPicker` remain unchanged. The new picker displays inline with your page content and does not have equivalents for these non-component usages.

<h4 id="version-8x-toast">Toast</h4>

- `cssClass` has been removed from the `ToastButton` interface. This was previously used to apply a custom class to the toast buttons. Developers can use the "button" shadow part to style the buttons.

For more information on styling toast buttons, refer to the [Toast Theming documentation](https://ionicframework.com/docs/api/toast#theming).
