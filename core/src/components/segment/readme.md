# ion-segment

Segments display a group of related buttons, sometimes known as segmented controls, in a horizontal row. They can be displayed inside of a toolbar or the main content.

Their functionality is similar to tabs, where selecting one will deselect all others. Segments are useful for toggling between different views inside of the content. Tabs should be used instead of a segment when clicking on a control should navigate between pages.


<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type                          | Default     |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------- |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`         | `undefined` |
| `disabled` | `disabled` | If `true`, the user cannot interact with the segment.                                                                                                                                                                                                                  | `boolean`                     | `false`     |
| `mode`     | `mode`     | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`               | `undefined` |
| `value`    | `value`    | the value of the segment.                                                                                                                                                                                                                                              | `null \| string \| undefined` | `undefined` |


## Events

| Event       | Description                                  | Detail               |
| ----------- | -------------------------------------------- | -------------------- |
| `ionChange` | Emitted when the value property has changed. | TextInputChangeEvent |
| `ionStyle`  | Emitted when the styles change.              | StyleEvent           |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
