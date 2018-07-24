# ion-searchbar

Searchbars represent a text field that can be used to search through a collection. They can be displayed inside of a toolbar or the main content.

A Searchbar should be used instead of an input to search lists. A clear button is displayed upon entering input in the searchbar's text field. Clicking on the clear button will erase the text field and the input will remain focused. A cancel button can be enabled which will clear the input and lose the focus upon click.



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


#### cancelButtonIcon

string

Set the cancel button icon. Only applies to `md` mode. Defaults to `"md-arrow-back"`.


#### cancelButtonText

string

Set the the cancel button text. Only applies to `ios` mode. Default: `"Cancel"`.


#### clearIcon

string

Set the clear icon. Defaults to `"close-circle"` for `ios` and `"close"` for `md`.


#### color

string

The color to use from your application's color palette.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information on colors, see [theming](/docs/theming/basics).


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


#### searchIcon

string

The icon to use as the search icon. Defaults to `"search"`.


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


#### cancel-button-icon

string

Set the cancel button icon. Only applies to `md` mode. Defaults to `"md-arrow-back"`.


#### cancel-button-text

string

Set the the cancel button text. Only applies to `ios` mode. Default: `"Cancel"`.


#### clear-icon

string

Set the clear icon. Defaults to `"close-circle"` for `ios` and `"close"` for `md`.


#### color

string

The color to use from your application's color palette.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information on colors, see [theming](/docs/theming/basics).


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


#### search-icon

string

The icon to use as the search icon. Defaults to `"search"`.


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
