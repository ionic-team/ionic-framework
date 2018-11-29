# ion-badge

Badges are inline block elements that usually appear near another element. Typically they contain a number or other characters. They can be used as a notification that there are additional items associated with an element and indicate how many items there are.


<!-- Auto Generated Below -->


## Usage

### Angular/javascript

```html
<!-- Default -->
<ion-badge>99</ion-badge>

<!-- Colors -->
<ion-badge color="primary">11</ion-badge>
<ion-badge color="secondary">22</ion-badge>
<ion-badge color="tertiary">33</ion-badge>
<ion-badge color="success">44</ion-badge>
<ion-badge color="warning">55</ion-badge>
<ion-badge color="danger">66</ion-badge>
<ion-badge color="light">77</ion-badge>
<ion-badge color="medium">88</ion-badge>
<ion-badge color="dark">99</ion-badge>

<!-- Item with badge on left and right -->
<ion-item>
  <ion-badge slot="start">11</ion-badge>
  <ion-label>My Item</ion-label>
  <ion-badge slot="end">22</ion-badge>
</ion-item>
```



## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                            | Type                  | Default     |
| -------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `color`  | `color`   | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` | `undefined` |
| `mode`   | `mode`    | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`       | `undefined` |


## CSS Custom Properties

| Name               | Description                 |
| ------------------ | --------------------------- |
| `--background`     | Background of the badge     |
| `--color`          | Text color of the badge     |
| `--padding-bottom` | Padding bottom of the badge |
| `--padding-end`    | Padding end of the badge    |
| `--padding-start`  | Padding start of the badge  |
| `--padding-top`    | Padding top of the badge    |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
