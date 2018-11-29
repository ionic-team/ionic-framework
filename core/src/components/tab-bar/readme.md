# ion-tab-bar

The tab bar is a UI component that contains a set of [tab buttons](../tab-button). A tab bar must be provided inside of [tabs](../tabs) to communicate with each [tab](../tab).


<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-tabs>
  <!-- Tab views -->
  <ion-tab tab="account"></ion-tab>
  <ion-tab tab="contact"></ion-tab>
  <ion-tab tab="settings"></ion-tab>

  <!-- Tab bar -->
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="account">
      <ion-icon name="person"></ion-icon>
    </ion-tab-button>
    <ion-tab-button tab="contact">
      <ion-icon name="call"></ion-icon>
    </ion-tab-button>
    <ion-tab-button tab="settings">
      <ion-icon name="settings"></ion-icon>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
```

### Javascript

```html
<ion-tabs>
  <!-- Tab views -->
  <ion-tab tab="account"></ion-tab>
  <ion-tab tab="contact"></ion-tab>
  <ion-tab tab="settings"></ion-tab>

  <!-- Tab bar -->
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="account">
      <ion-icon name="person"></ion-icon>
    </ion-tab-button>
    <ion-tab-button tab="contact">
      <ion-icon name="call"></ion-icon>
    </ion-tab-button>
    <ion-tab-button tab="settings">
      <ion-icon name="settings"></ion-icon>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
```


## Properties

| Property      | Attribute      | Description                                                                                                                                                                                                                                                            | Type                                                                                       | Default      |
| ------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------ |
| `color`       | `color`        | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`                                                                      | `undefined`  |
| `layout`      | `layout`       | Set the layout of the text and icon in the tab bar.                                                                                                                                                                                                                    | `"icon-bottom" \| "icon-end" \| "icon-hide" \| "icon-start" \| "icon-top" \| "label-hide"` | `'icon-top'` |
| `mode`        | `mode`         | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`                                                                            | `undefined`  |
| `selectedTab` | `selected-tab` | The selected tab component                                                                                                                                                                                                                                             | `string \| undefined`                                                                      | `undefined`  |
| `translucent` | `translucent`  | If `true`, the tab bar will be translucent.                                                                                                                                                                                                                            | `boolean`                                                                                  | `false`      |


## CSS Custom Properties

| Name           | Description               |
| -------------- | ------------------------- |
| `--background` | Background of the tab bar |
| `--border`     | Border of the tab bar     |
| `--color`      | Color of the tab bar      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
