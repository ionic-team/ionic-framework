# ion-segment

Segments display a group of related buttons, sometimes known as segmented controls, in a horizontal row. They can be displayed inside of a toolbar or the main content.

Their functionality is similar to tabs, where selecting one will deselect all others. Segments are useful for toggling between different views inside of the content. Tabs should be used instead of a segment when clicking on a control should navigate between pages.


<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type             |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `Color`          |
| `disabled` | `disabled` |                                                                                                                                                                                                                                                                        | `boolean`        |
| `mode`     | `mode`     | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `Mode`           |
| `value`    | `value`    | the value of the segment.                                                                                                                                                                                                                                              | `string`, `null` |


## Events

| Event       | Description                                  |
| ----------- | -------------------------------------------- |
| `ionChange` | Emitted when the value property has changed. |


## CSS Custom Properties

| Name                      | Description                      |
| ------------------------- | -------------------------------- |
| `--background`            | Background of segment            |
| `--background-checked`    | Background of checked segment    |
| `--border-color`          | Color of segment border          |
| `--border-color-checked`  | Color of checked segment border  |
| `--border-color-disabled` | Color of disabled segment border |
| `--color`                 | Color of segment text            |
| `--color-checked`         | Color of checked segment text    |
| `--color-disabled`        | Color of disabled segment text   |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
