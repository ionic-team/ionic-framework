# ion-searchbar

Searchbars represent a text field that can be used to search through a collection. They can be displayed inside of a toolbar or the main content.

A searchbar should be used instead of an input to search lists. A clear button is displayed on input in the searchbar's text field. Clicking on the clear button will erase the text field and remain focused in the input. A cancel button can be enabled which will clear the input and remove focus.


```html
<!-- Default Searchbar -->
<ion-searchbar></ion-searchbar>

<!-- Searchbar with danger color -->
<ion-searchbar color="danger"></ion-searchbar>

<!-- Searchbar with value -->
<ion-searchbar value="Ionic"></ion-searchbar>

<!-- Searchbar with telephone type -->
<ion-searchbar type="tel"></ion-searchbar>

<!-- Searchbar with a cancel button and custom cancel button text -->
<ion-searchbar show-cancel-button cancel-button-text="Custom Cancel"></ion-searchbar>

<!-- Searchbar with a custom debounce -->
<ion-searchbar debounce="500"></ion-searchbar>

<!-- Animated Searchbar -->
<ion-searchbar animated></ion-searchbar>

<!-- Searchbar with a placeholder -->
<ion-searchbar placeholder="Filter Schedules"></ion-searchbar>

<!-- Searchbar in a Toolbar -->
<ion-toolbar>
  <ion-searchbar></ion-searchbar>
</ion-toolbar>
```

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

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### debounce

number

Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. Default `250`.


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


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

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### debounce

number

Set the amount of time, in milliseconds, to wait to trigger the `ionChange` event after each keystroke. Default `250`.


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


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
