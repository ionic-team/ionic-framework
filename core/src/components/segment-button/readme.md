# ion-segment-button

Segment buttons are groups of related buttons inside of a [Segment](../../segment/Segment). They are displayed in a horizontal row. A segment button can be checked by default by adding the `checked` attribute or by setting the `value` of the segment to the `value` of the segment button. Only one segment button should be selected at a time.


<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type      |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `checked`  | `checked`  | If true, the segment button is selected. Defaults to `false`.                                                                                                                                                                                                          | `boolean` |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `Color`   |
| `disabled` | `disabled` |                                                                                                                                                                                                                                                                        | `boolean` |
| `mode`     | `mode`     | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `Mode`    |
| `value`    | `value`    | The value of the segment button.                                                                                                                                                                                                                                       | `string`  |


## Events

| Event       | Description                                 |
| ----------- | ------------------------------------------- |
| `ionSelect` | Emitted when the segment button is clicked. |


## CSS Custom Properties

| Name                 | Description                  |
| -------------------- | ---------------------------- |
| `--border-radius`    | Radius of the button border  |
| `--border-style`     | Style of the button border   |
| `--border-width`     | Width of the button border   |
| `--btn-background`   | Background of the button     |
| `--btn-border-color` | Color of the button border   |
| `--icon-size`        | Size of the button icon      |
| `--margin-bottom`    | Bottom margin of the button  |
| `--margin-end`       | End margin of the button     |
| `--margin-start`     | Start margin of the button   |
| `--margin-top`       | Top margin of the button     |
| `--padding-bottom`   | Bottom padding of the button |
| `--padding-end`      | End padding of the button    |
| `--padding-start`    | Start padding of the button  |
| `--padding-top`      | Top padding of the button    |
| `--transition`       | Transition of the button     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
