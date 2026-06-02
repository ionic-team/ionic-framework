# Breaking Changes

This is a comprehensive list of the breaking changes introduced in the major version releases of Ionic Framework.

## Versions

- [Version 9.x](#version-9x)
- [Version 8.x](./BREAKING_ARCHIVE/v8.md)
- [Version 7.x](./BREAKING_ARCHIVE/v7.md)
- [Version 6.x](./BREAKING_ARCHIVE/v6.md)
- [Version 5.x](./BREAKING_ARCHIVE/v5.md)
- [Version 4.x](./BREAKING_ARCHIVE/v4.md)
- [Legacy](https://github.com/ionic-team/ionic-v3/blob/master/CHANGELOG.md)

## Version 9.x

- [Global Styles](#version-9x-global-styles)
- [Components](#version-9x-components)
  - [Button](#version-9x-button)
  - [Card](#version-9x-card)
  - [Chip](#version-9x-chip)
  - [Content](#version-9x-content)
  - [Datetime](#version-9x-datetime)
  - [Grid](#version-9x-grid)
  - [Image](#version-9x-image)
  - [Input Otp](#version-9x-input-otp)
  - [Item Divider](#version-9x-item-divider)
  - [Radio Group](#version-9x-radio-group)
  - [Spinner](#version-9x-spinner)
  - [Text](#version-9x-text)
  - [Textarea](#version-9x-textarea)
  - [Thumbnail](#version-9x-thumbnail)

<h2 id="version-9x-global-styles">Global Styles</h2>

<h4 id="version-9x-color-steps">Color Steps</h4>

- The deprecated color step CSS variables, `--ion-color-step-[number]`, have been removed and should be replaced with either `--ion-background-color-step-[number]` or `--ion-text-color-step-[number]` depending on the specific use case, as outlined in the [migration guide](https://ionicframework.com/docs/updating/8-0#step-color-tokens).

<h2 id="version-9x-components">Components</h2>

<h4 id="version-9x-button">Button</h4>

- The `border-radius` of the `ios` and `md` button now defaults to `6px` and `999px` instead of `14px` and `4px`, respectively, in accordance with the iOS and Material Design 3 guidelines. To revert to the previous appearance, set the `shape` to `"soft"` for `md` and override the `--border-radius` CSS variable for `ios` to `14px`, or set it to a different value entirely.

<h4 id="version-9x-card">Card</h4>

- **ion-card**: The `border-radius` of the `ios` and `md` card now defaults to `14px` and `12px` instead of `8px` and `4px`, respectively, in accordance with the iOS and Material Design 3 guidelines. To revert to the previous appearance, set the `shape` to `"soft"`, or override the `--border-radius` CSS variable to specify a different value.

- **ion-card-content**: The `ion-card-content` component has been updated to Shadow DOM. With this update, all card-related components now use Shadow DOM for style encapsulation. The default styles for heading elements inside `ion-card-content` have been removed. If you need custom styling for headings, you can add your own CSS targeting these elements. For example:

  ```css
  ion-card-content h1 {
    margin-top: 0;
    margin-bottom: 2px;

    font-size: 1.5rem;
  }

  ion-card-content h2 {
    margin-top: 2px;
    margin-bottom: 2px;

    font-size: 1rem;
  }

  ion-card-content h3,
  ion-card-content h4,
  ion-card-content h5,
  ion-card-content h6 {
    margin-top: 2px;
    margin-bottom: 2px;

    font-size: 0.875rem;
  }
  ```

<h4 id="version-9x-chip">Chip</h4>

- Component CSS variables have been removed. The component now utilizes the centralized Ionic Theming system. Global updates should be managed via the theme tokens file, while component-specific overrides are handled through localized CSS variables.
   - `--color` is replaced by `IonChip.hue.bold.solid.default` for global styles and `--ion-chip-hue-bold-solid-default-color` for component-specific styles if the chip has a bold hue and solid fill.
   - `--color` is replaced by `IonChip.hue.bold.outline.default` for global styles and `--ion-chip-hue-bold-outline-default-color` for component-specific styles if the chip has a bold hue and outline fill.
   - `--color` is replaced by `IonChip.hue.subtle.solid.default` for global styles and `--ion-chip-hue-subtle-solid-default-color` for component-specific styles if the chip has a subtle hue and solid fill.
   - `--color` is replaced by `IonChip.hue.subtle.outline.default` for global styles and `--ion-chip-hue-subtle-outline-default-color` for component-specific styles if the chip has a subtle hue and outline fill.
- The `outline` property has been deprecated. To achieve an outlined chip, set the `fill` property to `"outline"`. The class `.chip-outline` has also been updated to `.chip-fill-outline` for clarity.
- Specific theme classes (e.g., `ion-chip.md`) are no longer supported. Style modifications based on the active theme must be implemented using theme tokens rather than direct class targeting.
- The `border-radius` of the `ios` and `md` chip now defaults to `10px` and `8px`, respectively, instead of `16px` in accordance with the iOS and Material Design 3 guidelines. To revert to the previous appearance, set the `shape` to `"round"`, or override the `IonChip.shape.round.border.radius` to specify a different value for global styles and `--ion-chip-shape-round-border-radius` for component-specific styles.

<h4 id="version-9x-content">Content</h4>

The following breaking changes apply to `ion-content`:

1. `--background` and `--color` CSS variables have been replaced.
2. `--padding-*` CSS variables are no longer part of the documented public API (but remain functional).
3. `--keyboard-offset`, `--offset-top`, and `--offset-bottom` have been renamed to the `--internal-*` namespace with no replacement.
4. Theme classes (`ion-content.md`, `ion-content.ios`) are no longer supported.

<h5>Removed CSS variables</h5>

`--background` and `--color` have been removed. Use the new token structure for global styles, or the corresponding CSS variable for component-specific overrides:

| Old (8.x) | New token (global) | New CSS variable (component-specific) |
|---|---|---|
| `--background` | `IonContent.background` | `--ion-content-default-background` |
| `--color` | `IonContent.color` | `--ion-content-default-color` |

<h5>Padding variables</h5>

New code should use the token-based API:

| Old (8.x) | New token (global) | New CSS variable (component-specific) |
|---|---|---|
| `--padding-top` | `IonContent.padding.top` | `--ion-content-padding-top` |
| `--padding-end` | `IonContent.padding.end` | `--ion-content-padding-end` |
| `--padding-bottom` | `IonContent.padding.bottom` | `--ion-content-padding-bottom` |
| `--padding-start` | `IonContent.padding.start` | `--ion-content-padding-start` |

> [!NOTE]
> The `--padding-*` overrides and `.ion-padding`, `.ion-padding-*` utility classes in `css/padding.scss` continue to work — `ion-content` honors them as a fallback when the new token is unset. They are no longer part of the documented public API (only `--ion-content-padding-*` is listed in `core/api.txt`), but existing usage will not break.

<h5>Internal-only variables</h5>

The following CSS variables were previously documented `@prop`s on `ion-content` and have been renamed to the `--internal-*` namespace, removing them from the public API:

| Old (8.x) | New |
|---|---|
| `--keyboard-offset` | `--internal-keyboard-offset` |
| `--offset-top` | `--internal-offset-top` |
| `--offset-bottom` | `--internal-offset-bottom` |

These are managed by `ion-content` itself (keyboard avoidance and header/footer offsets) and were never intended for consumer override. There is no replacement — any code that was setting them directly should be removed.

<h5>Theme classes</h5>

Remove any instances that target the theme classes: `ion-content.md`, `ion-content.ios`.

<h4 id="version-9x-datetime">Datetime</h4>

- The `ion-buttons` component has been removed from the internal implementation of `ion-datetime` and is no longer required when passing custom buttons to the `slot="buttons"`. When providing custom buttons, use a `div` element instead of `ion-buttons`. While existing code using `ion-buttons` may continue to work visually, future updates to the `ion-buttons` component may cause any styles you rely on to break.

<h4 id="version-9x-grid">Grid</h4>

- The properties `pull` and `push` have been deprecated and no longer work. A similar look can be achieved with the newly added property `order`.

<h5>Example 1: Swap two columns</h5>

**Version up to 8.x**

```html
<ion-grid>
  <ion-row>
    <ion-col push="4">1</ion-col>
    <ion-col pull="4">2</ion-col>
    <ion-col>3</ion-col>
  </ion-row>
</ion-grid>
```

**Version 9.x+**

```html
<ion-grid>
  <ion-row>
    <ion-col order="2">1</ion-col>
    <ion-col order="1">2</ion-col>
    <ion-col order="3">3</ion-col>
  </ion-row>
</ion-grid>
```

<h5>Example 2: Reorder columns with specific sizes</h5>

To reorder two columns where column 1 has `size="9" push="3"` and column 2 has `size="3" pull="9"`:

**Version up to 8.x**

```html
<ion-grid>
  <ion-row>
    <ion-col push="3">1</ion-col>
    <ion-col pull="9">2</ion-col>
  </ion-row>
</ion-grid>
```

**Version 9.x+**

```html
<ion-grid>
  <ion-row>
    <ion-col order="2">1</ion-col>
    <ion-col size="3" order="1">2</ion-col>
  </ion-row>
</ion-grid>
```

<h5>Example 3: Push</h5>

```html
<ion-grid>
  <ion-row>
    <ion-col size="auto" push="1">
      <div>ion-col push 1</div>
    </ion-col>
    <ion-col size="auto" push="1">
      <div>ion-col push 1</div>
    </ion-col>
  </ion-row>
</ion-grid>
```

**Version 9.x+**

```html
<ion-grid>
  <ion-row>
    <ion-col size="auto" offset="1">
      <div>ion-col size="auto" offset="1"</div>
    </ion-col>
    <ion-col size="auto">
      <div>ion-col size="auto"</div>
    </ion-col>
  </ion-row>
</ion-grid>
```

<h5>Example 4: Push and Pull</h5>

```html
<ion-grid>
  <ion-row>
    <ion-col size="3" size-md="6" push="9" push-md="6">
      <div>ion-col size="3" size-md="6" push="9" push-md="6"</div>
    </ion-col>
    <ion-col size="9" size-md="6" pull="3" pull-md="6">
      <div>ion-col size="9" size-md="6" pull="3" pull-md="6"</div>
    </ion-col>
  </ion-row>
</ion-grid>
```

**Version 9.x+**

```html
<ion-grid>
  <ion-row>
    <ion-col size="auto" order="2" order-md="2">
      <div>ion-col size="auto" order="2" order-md="2"</div>
    </ion-col>
    <ion-col size="auto" order="1" order-md="1">
      <div>ion-col size="auto" order="1" order-md="1"</div>
    </ion-col>
  </ion-row>
</ion-grid>
```

<h4 id="version-9x-image">Image</h4>

The following breaking changes apply to `ion-img`:

1. Theme classes (`ion-img.md`, `ion-img.ios`) are no longer supported.

<h5>Theme classes</h5>

Remove any instances that target the theme classes: `ion-img.md`, `ion-img.ios`.

<h4 id="version-9x-input-otp">Input Otp</h4>

Converted `ion-input-otp` to use [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

If you were targeting the internals of `ion-input-otp` in your CSS, you will need to target the `group`, `container`, `native`, `separator` or `description` [Shadow Parts](https://ionicframework.com/docs/theming/css-shadow-parts) instead, or use the provided CSS Variables.

<h4 id="version-9x-item-divider">Item Divider</h4>

- Component CSS variables have been removed. The component now utilizes the centralized Ionic Theming system. Global updates should be managed via the theme tokens file, while component-specific overrides are handled through localized CSS variables.
   - `--background` is replaced by `IonItemDivider.background` for global styles and `--ion-item-divider-background` for component-specific overrides.
   - `--color` is replaced by `IonItemDivider.color` for global styles and `--ion-item-divider-color` for component-specific overrides.
   - `--padding-top` is replaced by `IonItemDivider.padding.top` for global styles and `--ion-item-divider-padding-top` for component-specific overrides.
   - `--padding-end` is replaced by `IonItemDivider.padding.end` for global styles and `--ion-item-divider-padding-end` for component-specific overrides.
   - `--padding-bottom` is replaced by `IonItemDivider.padding.bottom` for global styles and `--ion-item-divider-padding-bottom` for component-specific overrides.
   - `--padding-start` is replaced by `IonItemDivider.padding.start` for global styles and `--ion-item-divider-padding-start` for component-specific overrides.
   - `--inner-padding-top` is replaced by `IonItemDivider.inner.padding.top` for global styles and `--ion-item-divider-inner-padding-top` for component-specific overrides.
   - `--inner-padding-end` is replaced by `IonItemDivider.inner.padding.end` for global styles and `--ion-item-divider-inner-padding-end` for component-specific overrides.
   - `--inner-padding-bottom` is replaced by `IonItemDivider.inner.padding.bottom` for global styles and `--ion-item-divider-inner-padding-bottom` for component-specific overrides.
   - `--inner-padding-start` is replaced by `IonItemDivider.inner.padding.start` for global styles and `--ion-item-divider-inner-padding-start` for component-specific overrides.
- Specific theme classes (e.g., `ion-item-divider.md`) are no longer supported. Style modifications based on the active theme must be implemented using theme tokens rather than direct class targeting.

<h4 id="version-9x-radio-group">Radio Group</h4>

Converted `ion-radio-group` to use [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

If you were targeting the internals of `ion-radio-group` in your CSS, you will need to target the `supporting-text`, `helper-text` or `error-text` [Shadow Parts](https://ionicframework.com/docs/theming/css-shadow-parts) instead, or use the provided CSS Variables.

Additionally, the `radio-group-wrapper` div element has been removed, causing slotted elements to be direct children of the `ion-radio-group`.

<h4 id="version-9x-spinner">Spinner</h4>

- Component CSS variables have been removed. The component now utilizes the centralized Ionic Theming system. Global updates should be managed via the theme tokens file, while component-specific overrides are handled through localized CSS variables.
   - `--color` is replaced by `IonSpinner.color` for global styles and
`--ion-spinner-color` for component-specific styles.
- CSS classes now include the property name to improve clarity.
  - `.spinner-[spinner-name]` → `.spinner-name-[spinner-name]`
- Specific theme classes (e.g., `ion-spinner.md`) are no longer supported. Style modifications based on the active theme must be implemented using theme tokens rather than direct class targeting.

<h4 id="version-9x-text">Text</h4>

The following breaking changes apply to `ion-text`:

1. The color applied by the `color` prop is now driven by the centralized Ionic Theming system, scoped to the new `hue` property.
2. Theme classes (`ion-text.md`, `ion-text.ios`) are no longer supported.

<h5>New `hue` property and color tokens</h5>

A new `hue` property selects between vibrant and muted color variants. It defaults to `"bold"`, which preserves prior behavior when `color` is set.

When `color` is set, the text color now reads from a token instead of `--ion-color-base` directly. Global overrides should use the theme tokens; component-specific overrides use the corresponding CSS variables:

| Hue | Token (global) | CSS variable (component-specific) |
|---|---|---|
| `bold` | `IonText.hue.bold.semantic.default.color` | `--ion-text-hue-bold-semantic-default-color` |
| `subtle` | `IonText.hue.subtle.semantic.default.color` | `--ion-text-hue-subtle-semantic-default-color` |

<h5>Theme classes</h5>

Remove any instances that target the theme classes: `ion-text.md`, `ion-text.ios`.

<h4 id="version-9x-textarea">Textarea</h4>

Converted `ion-textarea` to use [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

If you were targeting the internals of `ion-textarea` in your CSS, you will need to target the `wrapper`, `container`, `label`, `native`, `supporting-text`, `helper-text`, `error-text`, `counter`, or `bottom` [Shadow Parts](https://ionicframework.com/docs/theming/css-shadow-parts) instead, or use the provided CSS Variables.

<h4 id="version-9x-thumbnail">Thumbnail</h4>

The following breaking changes apply to `ion-thumbnail`:

1. `--size` has been split into separate `--ion-thumbnail-width` and `--ion-thumbnail-height` CSS variables. <sup>[1](#version-9x-thumbnail-replaced-css-variables)</sup>
2. `--border-radius` has been replaced. <sup>[1](#version-9x-thumbnail-replaced-css-variables)</sup>
3. Theme classes (`ion-thumbnail.md`, `ion-thumbnail.ios`) are no longer supported. <sup>[2](#version-9x-thumbnail-theme-classes)</sup>

<h5 id="version-9x-thumbnail-replaced-css-variables">Replaced CSS variables</h5>

`--size` and `--border-radius` have been replaced. Use the new token structure for global styles, or the corresponding CSS variable for component-specific overrides:

| Old (8.x) | New token (global) | New CSS variable (component-specific) |
|---|---|---|
| `--size` | `IonThumbnail.width` | `--ion-thumbnail-width` |
| `--size` | `IonThumbnail.height` | `--ion-thumbnail-height` |
| `--border-radius` | `IonThumbnail.border.radius` | `--ion-thumbnail-border-radius` |

> [!NOTE]
> Code that previously set `--size: 48px` on `ion-thumbnail` must now set both `--ion-thumbnail-width: 48px` and `--ion-thumbnail-height: 48px`.

<h5 id="version-9x-thumbnail-slotted">Slotted inside `ion-item` or `ion-item-divider`</h5>

When `ion-thumbnail` is slotted inside a parent component, the parent owns the sizing.

Use the **parent's** thumbnail tokens instead:

| Context | New token (global) | New CSS variable (component-specific) |
|---|---|---|
| Inside `ion-item` | `IonItem.thumbnail.width` / `IonItem.thumbnail.height` | `--ion-item-thumbnail-width` / `--ion-item-thumbnail-height` |
| Inside `ion-item-divider` | `IonItemDivider.thumbnail.width` / `IonItemDivider.thumbnail.height` | `--ion-item-divider-thumbnail-width` / `--ion-item-divider-thumbnail-height` |

<h5>Theme classes</h5>

Remove any instances that target the theme classes: `ion-thumbnail.md`, `ion-thumbnail.ios`.
