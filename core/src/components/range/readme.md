# ion-range

The Range slider lets users select from a range of values by moving
the slider knob. It can accept dual knobs, but by default one knob
controls the value of the range.

### Range Labels

Labels can be placed on either side of the range by adding the
`slot="start"` or `slot="end"` to the element. The element doesn't have to
be an `ion-label`, it can be added to any element to place it to the
left or right of the range.


<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                                                                                                                                                                                                                            | Type         |
| ----------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `color`     | `color`      | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `Color`      |
| `debounce`  | `debounce`   | How long, in milliseconds, to wait to trigger the `ionChange` event after each change in the range value. Default `0`.                                                                                                                                                 | `number`     |
| `disabled`  | `disabled`   |                                                                                                                                                                                                                                                                        | `boolean`    |
| `dualKnobs` | `dual-knobs` | Show two knobs. Defaults to `false`.                                                                                                                                                                                                                                   | `boolean`    |
| `max`       | `max`        | Maximum integer value of the range. Defaults to `100`.                                                                                                                                                                                                                 | `number`     |
| `min`       | `min`        | Minimum integer value of the range. Defaults to `0`.                                                                                                                                                                                                                   | `number`     |
| `mode`      | `mode`       | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `Mode`       |
| `name`      | `name`       | The name of the control, which is submitted with the form data.                                                                                                                                                                                                        | `string`     |
| `pin`       | `pin`        | If true, a pin with integer value is shown when the knob is pressed. Defaults to `false`.                                                                                                                                                                              | `boolean`    |
| `snaps`     | `snaps`      | If true, the knob snaps to tick marks evenly spaced based on the step property value. Defaults to `false`.                                                                                                                                                             | `boolean`    |
| `step`      | `step`       | Specifies the value granularity. Defaults to `1`.                                                                                                                                                                                                                      | `number`     |
| `value`     | `value`      | the value of the range.                                                                                                                                                                                                                                                | `RangeValue` |


## Events

| Event       | Description                                  |
| ----------- | -------------------------------------------- |
| `ionBlur`   | Emitted when the range loses focus.          |
| `ionChange` | Emitted when the value property has changed. |
| `ionFocus`  | Emitted when the range has focus.            |
| `ionStyle`  | Emitted when the styles change.              |


## CSS Custom Properties

| Name                      | Description                        |
| ------------------------- | ---------------------------------- |
| `--bar-background`        | Background of the range bar        |
| `--bar-background-active` | Background of the active range bar |
| `--bar-height`            | Height of the range bar            |
| `--height`                | Height of the range                |
| `--knob-background`       | Background of the range knob       |
| `--knob-border-radius`    | Border radius of the range knob    |
| `--knob-box-shadow`       | Box shadow of the range knob       |
| `--knob-size`             | Size of the range knob             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
