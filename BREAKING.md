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

- [Components](#version-9x-components)
  - [Button](#version-9x-button)
  - [Card](#version-9x-card)
  - [Chip](#version-9x-chip)
  - [Grid](#version-9x-grid)
  - [Textarea](#version-9x-textarea)

<h2 id="version-9x-components">Components</h2>

<h4 id="version-9x-button">Button</h4>

- The `border-radius` of the `ios` and `md` button now defaults to `6px` and `999px` instead of `14px` and `4px`, respectively, in accordance with the iOS and Material Design 3 guidelines. To revert to the previous appearance, set the `shape` to `"soft"` for `md` and override the `--border-radius` CSS variable for `ios` to `14px`, or set it to a different value entirely.

<h4 id="version-9x-card">Card</h4>

- The `border-radius` of the `ios` and `md` card now defaults to `14px` and `12px` instead of `8px` and `4px`, respectively, in accordance with the iOS and Material Design 3 guidelines. To revert to the previous appearance, set the `shape` to `"soft"`, or override the `--border-radius` CSS variable to specify a different value.

<h4 id="version-9x-chip">Chip</h4>

- The `border-radius` of the `ios` and `md` chip now defaults to `10px` and `8px`, respectively, instead of `16px` in accordance with the iOS and Material Design 3 guidelines. To revert to the previous appearance, set the `shape` to `"round"`, or override the `--border-radius` CSS variable to specify a different value.

<h4 id="version-9x-grid">Grid</h4>

- The properties `pull` and `push` have been deprecated and no longer work. A similar look can be achieved with the newly added property `order`.

<h4 id="version-9x-radio-group">Radio Group</h4>

- Converted `ion-radio-group` to use [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).<br/>
If you were targeting the internals of `ion-radio-group` in your CSS, you will need to target the `supporting-text`, `helper-text` or `error-text` [Shadow Parts](https://ionicframework.com/docs/theming/css-shadow-parts) instead, or use the provided CSS Variables.<br/>
Additionally, the `radio-group-wrapper` div element has been removed, causing slotted elements to be direct children of the `ion-radio-group`.

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

<h4 id="version-9x-textarea">Textarea</h4>

Converted `ion-textarea` to use [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

If you were targeting the internals of `ion-textarea` in your CSS, you will need to target the `container`, `label`, `native`, `supporting-text`, `helper-text`, `error-text`, `counter`, or `bottom` [Shadow Parts](https://ionicframework.com/docs/theming/css-shadow-parts) instead, or use the provided CSS Variables.
