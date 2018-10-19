# ion-tabbar

Tabbar is the UI component that implements the array of button of `ion-tabs`. It's provided by default when `ion-tabs` is used, though, this "implicit" tabbar can not be customized.

In order to have a custom tabbar, it should be provided in user's markup as direct children of `ion-tabs`:

```html
<style>
  ion-tabbar {
    font-size: 20px;
  }
</style>

<ion-tabs>
  <!-- User tabs  -->
  <ion-tab></ion-tab>
  <ion-tab></ion-tab>

  <!-- User provided ion-tabbar that can be customized -->
  <ion-tabbar color="dark" layout="icon-only">
</ion-tabs>
```


<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                                                                                                                                                                                                                            | Type                                                                                       |
| ------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `color`       | `color`       | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`                                                                      |
| `highlight`   | `highlight`   | If `true`, show the tab highlight bar under the selected tab.                                                                                                                                                                                                          | `boolean`                                                                                  |
| `layout`      | `layout`      | Set the layout of the text and icon in the tabbar. Available options: `"icon-top"`, `"icon-start"`, `"icon-end"`, `"icon-bottom"`, `"icon-hide"`, `"label-hide"`.                                                                                                      | `"icon-bottom" \| "icon-end" \| "icon-hide" \| "icon-start" \| "icon-top" \| "label-hide"` |
| `mode`        | `mode`        | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `"ios" \| "md"`                                                                            |
| `placement`   | `placement`   | Set the position of the tabbar, relative to the content. Available options: `"top"`, `"bottom"`.                                                                                                                                                                       | `"bottom" \| "top"`                                                                        |
| `selectedTab` | --            | The selected tab component                                                                                                                                                                                                                                             | `HTMLIonTabElement \| undefined`                                                           |
| `tabs`        | --            | The tabs to render                                                                                                                                                                                                                                                     | `HTMLIonTabElement[]`                                                                      |
| `translucent` | `translucent` | If `true`, the tabbar will be translucent. Defaults to `false`.                                                                                                                                                                                                        | `boolean`                                                                                  |


## Events

| Event            | Description                         |
| ---------------- | ----------------------------------- |
| `ionTabbarClick` | Emitted when the tab bar is clicked |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
