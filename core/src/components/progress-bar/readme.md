# ion-progress-bar

`ion-progress-bar` is a component that adds a `ProgressBar`.



<!-- Auto Generated Below -->


## Usage

### Javascript

```html
<ion-progress-bar></ion-progress-bar>

<ion-progress-bar color="secondary" animation="indeterminate"></ion-progress-bar>

<ion-progress-bar color="tertiary" animation="determinate" value="50"></ion-progress-bar>
```



## Properties

| Property    | Attribute   | Description                                                                                                                                                                                                                                                            | Type                                          | Default         |
| ----------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | --------------- |
| `animation` | `animation` | Sets the animation style of the progress bar Options are determinate (no animation), indeterminate (animate from left to right) and query (animate from right to left)                                                                                                 | `"determinate" \| "indeterminate" \| "query"` | `'determinate'` |
| `color`     | `color`     | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`                         | `undefined`     |
| `mode`      | `mode`      | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`                               | `undefined`     |
| `value`     | `value`     | The width of the progress bar                                                                                                                                                                                                                                          | `number`                                      | `0`             |


## CSS Custom Properties

| Name               | Description                       |
| ------------------ | --------------------------------- |
| `--bar-background` | Background of the progress bar    |
| `--border-radius`  | Border Radius of the progress bar |
| `--height`         | Height of the progress bar        |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
