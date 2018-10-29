# ion-tab-bar

Tab bar is the UI component that implements the array of button of `ion-tabs`. It's provided by default when `ion-tabs` is used, though, this "implicit" tab bar can not be customized.

In order to have a custom tab bar, it should be provided in user's markup as direct children of `ion-tabs`:

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

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type                                                                                       |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`                                                                      |
| `disabled` | `disabled` | The selected tab component                                                                                                                                                                                                                                             | `boolean`                                                                                  |
| `href`     | `href`     | The URL which will be used as the `href` within this tab's button anchor.                                                                                                                                                                                              | `string \| undefined`                                                                      |
| `layout`   | `layout`   | Set the layout of the text and icon in the tabbar.                                                                                                                                                                                                                     | `"icon-bottom" \| "icon-end" \| "icon-hide" \| "icon-start" \| "icon-top" \| "label-hide"` |
| `mode`     | `mode`     | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `"ios" \| "md"`                                                                            |
| `tab`      | `tab`      | A tab id must be provided for each `ion-tab`. It's used internally to reference the selected tab or by the router to switch between them.                                                                                                                              | `string \| undefined`                                                                      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
