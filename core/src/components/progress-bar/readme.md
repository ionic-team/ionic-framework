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

| Property    | Attribute   | Description                                                                                                                                                                                                                                                            | Type                                                      | Default         |
| ----------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------- |
| `buffer`    | `buffer`    | The width of the buffer in percent - 0 ... 100                                                                                                                                                                                                                         | `number`                                                  | `0`             |
| `color`     | `color`     | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`                                     | `undefined`     |
| `indicator` | `indicator` | Sets the indicator style of the progress bar Options are determinate (no animation), indeterminate (animate from left to right) and query (animate from right to left)                                                                                                 | `"buffer" \| "determinate" \| "indeterminate" \| "query"` | `'determinate'` |
| `mode`      | `mode`      | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`                                           | `undefined`     |
| `value`     | `value`     | The width of the progress bar in percent - 0 ... 100                                                                                                                                                                                                                   | `number`                                                  | `0`             |


## CSS Custom Properties

| Name                  | Description                       |
| --------------------- | --------------------------------- |
| `--bar-background`    | Background of the progress bar    |
| `--bar-speed`         | Speed of the progress bar         |
| `--border-radius`     | Border Radius of the progress bar |
| `--buffer-background` | Background of the buffer bar      |
| `--height`            | Height of the progress bar        |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
