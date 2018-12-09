# ion-progress-bar

ion-progress-bar is a horizontal progress bar to visualize the progression of an operation and activity. You can choose between two types: ``determinate`` and ``indeterminate``.

## Progress modes

### determinate (default)

If the percentage of an operation is known, you should use the determinate type. This is the default type and the progress is represented by the `value` property.

A buffer shows circles as animation to indicate some activity. If the `buffer` property is smaller than 1 you can show the addditional buffering progress. 

### indeterminate

If an operation is in progress and it's not necessary to indicate how long it will take.

If you add `reversed="true"`, you receive a query which is used to indicate pre-loading.

<!-- Auto Generated Below -->


## Usage

### Javascript

```html
<!-- Default Progressbar -->
<ion-progress-bar></ion-progress-bar>

<!-- Default Progressbar with 50 percent -->
<ion-progress-bar value="0.5"></ion-progress-bar>

<!-- Colorize Progressbar -->
<ion-progress-bar color="primary" value="0.5"></ion-progress-bar>
<ion-progress-bar color="secondary" value="0.5"></ion-progress-bar>

<!-- Other types -->
<ion-progress-bar value="0.25" buffer="0.5"></ion-progress-bar>
<ion-progress-bar type="indeterminate"></ion-progress-bar>
<ion-progress-bar type="indeterminate" reversed="true"></ion-progress-bar>
```



## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type                                           | Default         |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------- |
| `buffer`   | `buffer`   | Only on type `"buffer"`: Value of the buffer from [0, ..., 1]                                                                                                                                                                                                          | `number`                                       | `0`             |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`                          | `undefined`     |
| `mode`     | `mode`     | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`                                | `undefined`     |
| `reversed` | `reversed` | Reverse the progress bar                                                                                                                                                                                                                                               | `boolean`                                      | `false`         |
| `type`     | `type`     | Style of the progress bar Options are `"determinate"` (no animation), `"indeterminate"` (animate from left to right), and `"buffer"` (shows circle points)                                                                                                             | `"buffer" \| "determinate" \| "indeterminate"` | `'determinate'` |
| `value`    | `value`    | Only on type `"determinate"` and  `"buffer"`: Value of the progress bar from [0, ..., 1]                                                                                                                                                                               | `number`                                       | `0`             |


## CSS Custom Properties

| Name                          | Description                    |
| ----------------------------- | ------------------------------ |
| `--buffer-animation-duration` | Speed of the buffer circles    |
| `--buffer-background`         | Background of the buffer bar   |
| `--buffer-color`              | Color of the buffer circles    |
| `--buffer-size`               | Size of the buffer circles     |
| `--progress-background`       | Background of the progress bar |
| `--progress-color`            | Color of the progress bar      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
