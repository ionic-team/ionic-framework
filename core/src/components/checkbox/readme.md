# ion-checkbox

Checkboxes allow the selection of multiple options from a set of options. They appear as checked (ticked) when activated. Clicking on a checkbox will toggle the `checked` property. They can also be checked programmatically by setting the `checked` property.




<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type      |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `checked`  | `checked`  | If true, the checkbox is selected. Defaults to `false`.                                                                                                                                                                                                                | `boolean` |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `Color`   |
| `disabled` | `disabled` | If true, the user cannot interact with the checkbox. Defaults to `false`.                                                                                                                                                                                              | `boolean` |
| `mode`     | `mode`     | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `Mode`    |
| `name`     | `name`     | The name of the control, which is submitted with the form data.                                                                                                                                                                                                        | `string`  |
| `value`    | `value`    | The value of the checkbox.                                                                                                                                                                                                                                             | `string`  |


## Events

| Event       | Description                                    |
| ----------- | ---------------------------------------------- |
| `ionBlur`   | Emitted when the toggle loses focus.           |
| `ionChange` | Emitted when the checked property has changed. |
| `ionFocus`  | Emitted when the toggle has focus.             |
| `ionStyle`  | Emitted when the styles change.                |


## CSS Custom Properties

| Name                     | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `--background`           | Background of the checkbox icon                |
| `--background-checked`   | Background of the checkbox icon when checked   |
| `--border-color`         | Border color of the checkbox icon              |
| `--border-color-checked` | Border color of the checkbox icon when checked |
| `--border-radius`        | Border radius of the checkbox icon             |
| `--border-style`         | Border style of the checkbox icon              |
| `--border-width`         | Border width of the checkbox icon              |
| `--checkmark-color`      | Color of the checkbox checkmark when checked   |
| `--size`                 | Size of the checkbox icon                      |
| `--transition`           | Transition of the checkbox icon                |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
