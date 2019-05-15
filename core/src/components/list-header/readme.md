# ion-list-header

ListHeader a header component for a list.
Unlike ItemDivider, ListHeaders are styled to be stand-out from the rest of the list items.


<!-- Auto Generated Below -->


## Usage

### Javascript

```html
<ion-list>
  <ion-list-header>
    <ion-label>Items</ion-label>
  </ion-list-header>
  <ion-item>Item 1</ion-item>
  <ion-item>Item 2</ion-item>
  <ion-item>Item 3</ion-item>
  <ion-item>Item 4</ion-item>
  <ion-item>Item 5</ion-item>
</ion-list>
```



## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                            | Type                  | Default     |
| -------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `color`  | `color`   | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` | `undefined` |
| `mode`   | `mode`    | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`       | `undefined` |


## CSS Custom Properties

| Name           | Description                   |
| -------------- | ----------------------------- |
| `--background` | Background of the list header |
| `--color`      | Color of the list header text |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
