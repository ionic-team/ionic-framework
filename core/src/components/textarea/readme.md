# ion-textarea

The textarea component is used for multi-line text input. A native textarea element is rendered inside of the component. The user experience and interactivity of the textarea component is improved by having control over the native textarea.

Unlike the native textarea element, the Ionic textarea does not support loading its value from the inner content. The textarea value should be set in the `value` attribute.

The textarea component accepts the [native textarea attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) in addition to the Ionic properties.



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute        | Description                                                                                                                                                                                                                                                            | Type      |
| ---------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `autocapitalize` | `autocapitalize` | Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Defaults to `"none"`.                                                                                                                                | `string`  |
| `autofocus`      | `autofocus`      | This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.                                                                                                                                          | `boolean` |
| `clearOnEdit`    | `clear-on-edit`  | If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.                                                                                                                                 | `boolean` |
| `color`          | `color`          | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `Color`   |
| `cols`           | `cols`           | The visible width of the text control, in average character widths. If it is specified, it must be a positive integer.                                                                                                                                                 | `number`  |
| `debounce`       | `debounce`       | Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. Default `0`.                                                                                                                                                   | `number`  |
| `disabled`       | `disabled`       | If true, the user cannot interact with the textarea. Defaults to `false`.                                                                                                                                                                                              | `boolean` |
| `maxlength`      | `maxlength`      | If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.                                                                                       | `number`  |
| `minlength`      | `minlength`      | If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.                                                                                       | `number`  |
| `mode`           | `mode`           | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `Mode`    |
| `name`           | `name`           | The name of the control, which is submitted with the form data.                                                                                                                                                                                                        | `string`  |
| `placeholder`    | `placeholder`    | Instructional text that shows before the input has a value.                                                                                                                                                                                                            | `string`  |
| `readonly`       | `readonly`       | If true, the user cannot modify the value. Defaults to `false`.                                                                                                                                                                                                        | `boolean` |
| `required`       | `required`       | If true, the user must fill in a value before submitting a form.                                                                                                                                                                                                       | `boolean` |
| `rows`           | `rows`           | The number of visible text lines for the control.                                                                                                                                                                                                                      | `number`  |
| `spellcheck`     | `spellcheck`     | If true, the element will have its spelling and grammar checked. Defaults to `false`.                                                                                                                                                                                  | `boolean` |
| `value`          | `value`          | The value of the textarea.                                                                                                                                                                                                                                             | `string`  |
| `wrap`           | `wrap`           | Indicates how the control wraps text. Possible values are: `"hard"`, `"soft"`, `"off"`.                                                                                                                                                                                | `string`  |


## Events

| Event       | Description                               |
| ----------- | ----------------------------------------- |
| `ionBlur`   | Emitted when the input loses focus.       |
| `ionChange` | Emitted when the input value has changed. |
| `ionFocus`  | Emitted when the input has focus.         |
| `ionInput`  | Emitted when a keyboard input ocurred.    |
| `ionStyle`  | Emitted when the styles change.           |


## Methods

| Method     | Description |
| ---------- | ----------- |
| `setFocus` |             |


## CSS Custom Properties

| Name                        | Description                     |
| --------------------------- | ------------------------------- |
| `--background`              | Background of the textarea      |
| `--border-radius`           | Border radius of the textarea   |
| `--color`                   | Color of the text               |
| `--padding-bottom`          | Bottom padding of the textarea  |
| `--padding-end`             | End padding of the textarea     |
| `--padding-start`           | Start padding of the textarea   |
| `--padding-top`             | Top padding of the textarea     |
| `--placeholder-color`       | Color of the placeholder text   |
| `--placeholder-font-style`  | Style of the placeholder text   |
| `--placeholder-font-weight` | Weight of the placeholder text  |
| `--placeholder-opacity`     | Opacity of the placeholder text |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
