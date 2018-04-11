# ion-textarea

The textarea component is used for multi-line text input. A native textarea element is rendered inside of the component. The user experience and interactivity of the textarea component is improved by having control over the native textarea.

Unlike the native textarea element, the Ionic textarea does not support loading its value from the inner content. The textarea value should be set in the `value` attribute.

The textarea component accepts the [native textarea attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) in addition to the Ionic properties.

```html
<!-- Default textarea -->
<ion-textarea></ion-textarea>

<!-- Textarea in an item with a placeholder -->
<ion-item>
  <ion-textarea placeholder="Enter more information here..."></ion-textarea>
</ion-item>

<!-- Textarea in an item with a floating label -->
<ion-item>
  <ion-label position="floating">Description</ion-label>
  <ion-textarea></ion-textarea>
</ion-item>

<!-- Disabled and readonly textarea in an item with a stacked label -->
<ion-item>
  <ion-label position="stacked">Summary</ion-label>
  <ion-textarea
    disabled
    readonly
    value="Ionic enables developers to build performant, high-quality mobile apps.">
  </ion-textarea>
</ion-item>

<!-- Textarea that clears the value on edit -->
<ion-item>
  <ion-label>Comment</ion-label>
  <ion-textarea clear-on-edit="true"></ion-textarea>
</ion-item>

<!-- Textarea with custom number of rows and cols -->
<ion-item>
  <ion-label>Notes</ion-label>
  <ion-textarea rows="6" cols="20" placeholder="Enter any notes here..."></ion-textarea>
</ion-item>
```


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


#### cols

number

The visible width of the text control, in average character widths. If it is specified, it must be a positive integer.


#### debounce

number

Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `0`.


#### disabled

boolean

If true, the user cannot interact with the textarea. Defaults to `false`.


#### maxlength

number

If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.


#### minlength

number

If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.


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


#### cols

number

The visible width of the text control, in average character widths. If it is specified, it must be a positive integer.


#### debounce

number

Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `0`.


#### disabled

boolean

If true, the user cannot interact with the textarea. Defaults to `false`.


#### maxlength

number

If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter.


#### minlength

number

If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter.


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


#### ionFocus

Emitted when the input has focus.


#### ionInput

Emitted when the input value has changed.


#### ionStyle

Emitted when the styles change.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
