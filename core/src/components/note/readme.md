# ion-note

Notes are text elements generally used as subtitles that provide more information. Notes are styled to appear grey by default. Notes can be used in an item as metadata text.


<!-- Auto Generated Below -->


## Usage

### Angular/javascript

```html
<!-- Default Note -->
<ion-note>Default Note</ion-note>

<!-- Note Colors -->
<ion-note color="primary">Primary Note</ion-note>
<ion-note color="secondary">Secondary Note</ion-note>
<ion-note color="danger">Danger Note</ion-note>
<ion-note color="light">Light Note</ion-note>
<ion-note color="dark">Dark Note</ion-note>

<!-- Notes in a List -->
<ion-list>
  <ion-item>
    <ion-label>Note (End)</ion-label>
    <ion-note slot="end">On</ion-note>
  </ion-item>

  <ion-item>
    <ion-note slot="start">Off</ion-note>
    <ion-label>Note (Start)</ion-label>
  </ion-item>
</ion-list>
```



## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                            | Type                  | Default     |
| -------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `color`  | `color`   | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` | `undefined` |
| `mode`   | `mode`    | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`       | `undefined` |


## CSS Custom Properties

| Name      | Description       |
| --------- | ----------------- |
| `--color` | Color of the note |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
