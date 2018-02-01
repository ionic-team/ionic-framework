# ion-input



<!-- Auto Generated Below -->


## Properties

#### accept

string

If the value of the type attribute is `"file"`, then this attribute will indicate the types of files that the server accepts, otherwise it will be ignored. The value must be a comma-separated list of unique content type specifiers.


#### autocapitalize

string

Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Defaults to `"none"`.


#### autocomplete

string

Indicates whether the value of the control can be automatically completed by the browser. Defaults to `"off"`.


#### autocorrect

string

Whether autocorrection should be enabled when the user is entering/editing the text value. Defaults to `"off"`.


#### autofocus

boolean

This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.


#### checked

boolean

If true and the type is `checkbox` or `radio`, the control is selected by default. Defaults to `false`.


#### clearInput

boolean

If true, a clear icon will appear in the input when there is a value. Clicking it clears the input. Defaults to `false`.


#### clearOnEdit

boolean

If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.


#### debounce

number

Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `0`.


#### disabled

boolean

If true, the user cannot interact with the input. Defaults to `false`.


#### inputmode

string

A hint to the browser for which keyboard to display. This attribute applies when the value of the type attribute is `"text"`, `"password"`, `"email"`, or `"url"`. Possible values are: `"verbatim"`, `"latin"`, `"latin-name"`, `"latin-prose"`, `"full-width-latin"`, `"kana"`, `"katakana"`, `"numeric"`, `"tel"`, `"email"`, `"url"`.


#### max

string

The maximum value, which must not be less than its minimum (min attribute) value.


#### maxlength

number

If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.


#### min

string

The minimum value, which must not be greater than its maximum (max attribute) value.


#### minlength

number

If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.


#### multiple

boolean

If true, the user can enter more than one value. This attribute applies when the type attribute is set to `"email"` or `"file"`, otherwise it is ignored.


#### name

string

The name of the control, which is submitted with the form data.


#### pattern

string

A regular expression that the value is checked against. The pattern must match the entire value, not just some subset. Use the title attribute to describe the pattern to help the user. This attribute applies when the value of the type attribute is `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.


#### placeholder

string

Instructional text that shows before the input has a value.


#### readonly

boolean

If true, the user cannot modify the value. Defaults to `false`.


#### required

boolean

If true, the user must fill in a value before submitting a form.


#### results

number

This is a nonstandard attribute supported by Safari that only applies when the type is `"search"`. Its value should be a nonnegative decimal integer.


#### size

number

The initial size of the control. This value is in pixels unless the value of the type attribute is `"text"` or `"password"`, in which case it is an integer number of characters. This attribute applies only when the `type` attribute is set to `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.


#### spellcheck

boolean

If true, the element will have its spelling and grammar checked. Defaults to `false`.


#### step

string

Works with the min and max attributes to limit the increments at which a value can be set. Possible values are: `"any"` or a positive floating point number.


#### type

string

The type of control to display. The default type is text. Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.


#### value

string

The value of the input.


## Attributes

#### accept

string

If the value of the type attribute is `"file"`, then this attribute will indicate the types of files that the server accepts, otherwise it will be ignored. The value must be a comma-separated list of unique content type specifiers.


#### autocapitalize

string

Indicates whether and how the text value should be automatically capitalized as it is entered/edited by the user. Defaults to `"none"`.


#### autocomplete

string

Indicates whether the value of the control can be automatically completed by the browser. Defaults to `"off"`.


#### autocorrect

string

Whether autocorrection should be enabled when the user is entering/editing the text value. Defaults to `"off"`.


#### autofocus

boolean

This Boolean attribute lets you specify that a form control should have input focus when the page loads. Defaults to `false`.


#### checked

boolean

If true and the type is `checkbox` or `radio`, the control is selected by default. Defaults to `false`.


#### clear-input

boolean

If true, a clear icon will appear in the input when there is a value. Clicking it clears the input. Defaults to `false`.


#### clear-on-edit

boolean

If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.


#### debounce

number

Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `0`.


#### disabled

boolean

If true, the user cannot interact with the input. Defaults to `false`.


#### inputmode

string

A hint to the browser for which keyboard to display. This attribute applies when the value of the type attribute is `"text"`, `"password"`, `"email"`, or `"url"`. Possible values are: `"verbatim"`, `"latin"`, `"latin-name"`, `"latin-prose"`, `"full-width-latin"`, `"kana"`, `"katakana"`, `"numeric"`, `"tel"`, `"email"`, `"url"`.


#### max

string

The maximum value, which must not be less than its minimum (min attribute) value.


#### maxlength

number

If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.


#### min

string

The minimum value, which must not be greater than its maximum (max attribute) value.


#### minlength

number

If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.


#### multiple

boolean

If true, the user can enter more than one value. This attribute applies when the type attribute is set to `"email"` or `"file"`, otherwise it is ignored.


#### name

string

The name of the control, which is submitted with the form data.


#### pattern

string

A regular expression that the value is checked against. The pattern must match the entire value, not just some subset. Use the title attribute to describe the pattern to help the user. This attribute applies when the value of the type attribute is `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.


#### placeholder

string

Instructional text that shows before the input has a value.


#### readonly

boolean

If true, the user cannot modify the value. Defaults to `false`.


#### required

boolean

If true, the user must fill in a value before submitting a form.


#### results

number

This is a nonstandard attribute supported by Safari that only applies when the type is `"search"`. Its value should be a nonnegative decimal integer.


#### size

number

The initial size of the control. This value is in pixels unless the value of the type attribute is `"text"` or `"password"`, in which case it is an integer number of characters. This attribute applies only when the `type` attribute is set to `"text"`, `"search"`, `"tel"`, `"url"`, `"email"`, or `"password"`, otherwise it is ignored.


#### spellcheck

boolean

If true, the element will have its spelling and grammar checked. Defaults to `false`.


#### step

string

Works with the min and max attributes to limit the increments at which a value can be set. Possible values are: `"any"` or a positive floating point number.


#### type

string

The type of control to display. The default type is text. Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.


#### value

string

The value of the input.


## Events

#### ionBlur

Emitted when the input loses focus.


#### ionFocus

Emitted when the input has focus.


#### ionInput

Emitted when the input value has changed.


#### ionStyle

Emitted when the styles change.



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
