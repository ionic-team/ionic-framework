# ion-textarea

The textarea component is used for multi-line text input. A native textarea element is rendered inside of the component. The user experience and interactivity of the textarea component is improved by having control over the native textarea.

Unlike the native textarea element, the Ionic textarea does not support loading its value from the inner content. The textarea value should be set in the `value` attribute.

The textarea component accepts the [native textarea attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) in addition to the Ionic properties.



<!-- Auto Generated Below -->


## Properties

#### autocapitalize

string

Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Defaults to `"none"`.


#### autocomplete

string

Indicates whether the value of the control can be automatically completed by the browser. Defaults to `"off"`.


#### autofocus

boolean

This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.


#### clearOnEdit

boolean

If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.


#### color

string

The color to use from your application's color palette.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information on colors, see [theming](/docs/theming/basics).


#### cols

number

The visible width of the text control, in average character widths. If it is specified, it must be a positive integer.


#### debounce

number

Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. Default `0`.


#### disabled

boolean

If true, the user cannot interact with the textarea. Defaults to `false`.


#### maxlength

number

If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.


#### minlength

number

If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.


#### name

string

The name of the control, which is submitted with the form data.


#### placeholder

string

Instructional text that shows before the input has a value.


#### readonly

boolean

If true, the user cannot modify the value. Defaults to `false`.


#### required

boolean

If true, the user must fill in a value before submitting a form.


#### rows

number

The number of visible text lines for the control.


#### spellcheck

boolean

If true, the element will have its spelling and grammar checked. Defaults to `false`.


#### value

string

The value of the textarea.


#### wrap

string

Indicates how the control wraps text. Possible values are: `"hard"`, `"soft"`, `"off"`.


## Attributes

#### autocapitalize

string

Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Defaults to `"none"`.


#### autocomplete

string

Indicates whether the value of the control can be automatically completed by the browser. Defaults to `"off"`.


#### autofocus

boolean

This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.


#### clear-on-edit

boolean

If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.


#### color

string

The color to use from your application's color palette.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information on colors, see [theming](/docs/theming/basics).


#### cols

number

The visible width of the text control, in average character widths. If it is specified, it must be a positive integer.


#### debounce

number

Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. Default `0`.


#### disabled

boolean

If true, the user cannot interact with the textarea. Defaults to `false`.


#### maxlength

number

If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.


#### minlength

number

If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.


#### name

string

The name of the control, which is submitted with the form data.


#### placeholder

string

Instructional text that shows before the input has a value.


#### readonly

boolean

If true, the user cannot modify the value. Defaults to `false`.


#### required

boolean

If true, the user must fill in a value before submitting a form.


#### rows

number

The number of visible text lines for the control.


#### spellcheck

boolean

If true, the element will have its spelling and grammar checked. Defaults to `false`.


#### value

string

The value of the textarea.


#### wrap

string

Indicates how the control wraps text. Possible values are: `"hard"`, `"soft"`, `"off"`.


## Events

#### ionBlur

Emitted when the input loses focus.


#### ionChange

Emitted when the input value has changed.


#### ionFocus

Emitted when the input has focus.


#### ionInput

Emitted when a keyboard input ocurred.


#### ionStyle

Emitted when the styles change.


## CSS Custom Properties

| Name                    | Description                     |
| ----------------------- | ------------------------------- |
| `--background`          | Background of the textarea      |
| `--border-radius`       | Border radius of the textarea   |
| `--color`               | Color of the text               |
| `--padding-bottom`      | Bottom padding of the textarea  |
| `--padding-end`         | End padding of the textarea     |
| `--padding-start`       | Start padding of the textarea   |
| `--padding-top`         | Top padding of the textarea     |
| `--placeholder-color`   | Color of the placeholder text   |
| `--placeholder-opacity` | Opacity of the placeholder text |
| `--placeholder-weight`  | Weight of the placeholder text  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
