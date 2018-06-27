# ion-searchbar

Searchbars represent a text field that can be used to search through a collection. They can be displayed inside of a toolbar or the main content.

A Searchbar should be used instead of an input to search lists. A clear button is displayed on input in the searchbar's text field. Clicking on the clear button will erase the text field and the input focused. A cancel button can be enabled which will clear the input and remove focus.



<!-- Auto Generated Below -->


## Properties

#### animated

boolean

If true, enable searchbar animation. Default `false`.


#### autocomplete

string

Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.


#### autocorrect

string

Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.


#### cancelButtonText

string

Set the the cancel button text. Default: `"Cancel"`.


#### color

string

The color the searchbar should be.


#### debounce

number

Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. Default `250`.


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.


#### placeholder

string

Set the input's placeholder. Default `"Search"`.


#### showCancelButton

boolean

If true, show the cancel button. Default `false`.


#### spellcheck

boolean

If true, enable spellcheck on the input. Default `false`.


#### type

string

Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.


#### value

string

the value of the searchbar.


## Attributes

#### animated

boolean

If true, enable searchbar animation. Default `false`.


#### autocomplete

string

Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.


#### autocorrect

string

Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.


#### cancel-button-text

string

Set the the cancel button text. Default: `"Cancel"`.


#### color

string

The color the searchbar should be.


#### debounce

number

Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. Default `250`.


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.


#### placeholder

string

Set the input's placeholder. Default `"Search"`.


#### show-cancel-button

boolean

If true, show the cancel button. Default `false`.


#### spellcheck

boolean

If true, enable spellcheck on the input. Default `false`.


#### type

string

Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.


#### value

string

the value of the searchbar.


## Events

#### ionBlur

Emitted when the input loses focus.


#### ionCancel

Emitted when the cancel button is clicked.


#### ionChange

Emitted when the value has changed.


#### ionClear

Emitted when the clear input button is clicked.


#### ionFocus

Emitted when the input has focus.


#### ionInput

Emitted when a keyboard input ocurred.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
