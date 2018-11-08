# ion-segment-button

Segment buttons are groups of related buttons inside of a [Segment](../../segment/Segment). They are displayed in a horizontal row. A segment button can be checked by default by adding the `checked` attribute or by setting the `value` of the segment to the `value` of the segment button. Only one segment button should be selected at a time.


<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type                                                                                       | Default               |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------- |
| `checked`  | `checked`  | If `true`, the segment button is selected.                                                                                                                                                                                                                             | `boolean`                                                                                  | `false`               |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`                                                                      | `undefined`           |
| `disabled` | `disabled` | If `true`, the user cannot interact with the segment button.                                                                                                                                                                                                           | `boolean`                                                                                  | `false`               |
| `layout`   | `layout`   | Set the layout of the text and icon in the segment.                                                                                                                                                                                                                    | `"icon-bottom" \| "icon-end" \| "icon-hide" \| "icon-start" \| "icon-top" \| "label-hide"` | `undefined`           |
| `mode`     | `mode`     | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`                                                                            | `undefined`           |
| `value`    | `value`    | The value of the segment button.                                                                                                                                                                                                                                       | `string`                                                                                   | `'ion-sb-' + (ids++)` |


## Events

| Event       | Description                                 | Detail |
| ----------- | ------------------------------------------- | ------ |
| `ionSelect` | Emitted when the segment button is clicked. | void   |


## CSS Custom Properties

| Name                        | Description                                                         |
| --------------------------- | ------------------------------------------------------------------- |
| `--background`              | Background of the segment button                                    |
| `--background-activated`    | Background of the activated (pressed) segment button                |
| `--background-checked`      | Background of the checked segment button                            |
| `--background-disabled`     | Background of the disabled segment button                           |
| `--background-hover`        | Background of the segment button on hover                           |
| `--border-color`            | Color of the segment button border                                  |
| `--border-radius`           | Radius of the segment button border                                 |
| `--border-style`            | Style of the segment button border                                  |
| `--border-width`            | Width of the segment button border                                  |
| `--color`                   | Color of the segment button                                         |
| `--color-activated`         | Color of the activated (pressed) segment button                     |
| `--color-checked`           | Color of the checked segment button                                 |
| `--color-checked-activated` | Color of the checked & activated segment button                     |
| `--color-checked-disabled`  | Color of the checked & disabled segment button                      |
| `--color-disabled`          | Color of the disabled segment button                                |
| `--icon-margin-bottom`      | Bottom margin of the segment button icon                            |
| `--icon-margin-end`         | End margin of the segment button icon                               |
| `--icon-margin-start`       | Start margin of the segment button icon                             |
| `--icon-margin-top`         | Top margin of the segment button icon                               |
| `--icon-order`              | Order of the segment button icon                                    |
| `--icon-size`               | Font size of the segment button icon                                |
| `--indicator-color`         | Color of the indicator (highlight) under the segment button         |
| `--indicator-color-checked` | Color of the indicator (highlight) under the checked segment button |
| `--label-margin-bottom`     | Bottom margin of the segment button label                           |
| `--label-margin-end`        | End margin of the segment button label                              |
| `--label-margin-start`      | Start margin of the segment button label                            |
| `--label-margin-top`        | Top margin of the segment button label                              |
| `--margin-bottom`           | Bottom margin of the segment button                                 |
| `--margin-end`              | End margin of the segment button                                    |
| `--margin-start`            | Start margin of the segment button                                  |
| `--margin-top`              | Top margin of the segment button                                    |
| `--padding-bottom`          | Bottom padding of the segment button                                |
| `--padding-end`             | End padding of the segment button                                   |
| `--padding-start`           | Start padding of the segment button                                 |
| `--padding-top`             | Top padding of the segment button                                   |
| `--transition`              | Transition of the segment button                                    |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
