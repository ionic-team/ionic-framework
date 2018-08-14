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


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
