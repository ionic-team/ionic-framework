# ion-tab-bar

Tabbar is the UI component that implements the array of button of `ion-tabs`. It's provided by default when `ion-tabs` is used, though, this "implicit" tabbar can not be customized.

In order to have a custom tabbar, it should be provided in user's markup as direct children of `ion-tabs`:

```html
<style>
  ion-tab-bar {
    font-size: 20px;
  }
</style>

<ion-tabs>
  <!-- User tabs  -->
  <ion-tab></ion-tab>
  <ion-tab></ion-tab>

  <!-- User provided ion-tab-bar that can be customized -->
  <ion-tab-bar color="dark" layout="icon-only">
</ion-tabs>
```


<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description                                                                                                                                                                                                                                                            | Type                                                                                       |
| ---------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `color`          | `color`            | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`                                                                      |
| `highlight`      | `highlight`        | If `true`, show the tab highlight bar under the selected tab.                                                                                                                                                                                                          | `boolean`                                                                                  |
| `layout`         | `layout`           | Set the layout of the text and icon in the tabbar.                                                                                                                                                                                                                     | `"icon-bottom" \| "icon-end" \| "icon-hide" \| "icon-start" \| "icon-top" \| "label-hide"` |
| `mode`           | `mode`             | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `"ios" \| "md"`                                                                            |
| `placement`      | `placement`        | Set the position of the tabbar, relative to the content.                                                                                                                                                                                                               | `"bottom" \| "top"`                                                                        |
| `selectedViewId` | `selected-view-id` | The selected tab component                                                                                                                                                                                                                                             | `string \| undefined`                                                                      |
| `translucent`    | `translucent`      | If `true`, the tabbar will be translucent. Defaults to `false`.                                                                                                                                                                                                        | `boolean`                                                                                  |


## Events

| Event              | Description |
| ------------------ | ----------- |
| `ionTabbarChanged` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
