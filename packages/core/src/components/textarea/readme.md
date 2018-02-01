# ion-textarea

`ion-textarea` is used for multi-line text inputs. Ionic still
uses an actual `<textarea>` HTML element within the component;
however, with Ionic wrapping the native HTML text area element, Ionic
is able to better handle the user experience and interactivity.

Note that `<ion-textarea>` must load its value from the `value` or
`[(ngModel)]` attribute. Unlike the native `<textarea>` element,
`<ion-textarea>` does not support loading its value from the
textarea's inner content.

When requiring only a single-line text input, we recommend using
`<ion-input>` instead.

```html
 <ion-item>
   <ion-label>Comments</ion-label>
   <ion-textarea></ion-textarea>
 </ion-item>

 <ion-item>
   <ion-label stacked>Message</ion-label>
   <ion-textarea [(ngModel)]="msg"></ion-textarea>
 </ion-item>

 <ion-item>
   <ion-label floating>Description</ion-label>
   <ion-textarea></ion-textarea>
 </ion-item>

<ion-item>
   <ion-label>Long Description</ion-label>
   <ion-textarea rows="6" placeholder="enter long description here..."></ion-textarea>
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

*Built by [StencilJS](https://stenciljs.com/)*
