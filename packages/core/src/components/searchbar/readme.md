# ion-searchbar

Manages the display of a Searchbar which can be used to search or filter items.

```html
<ion-searchbar
  [(ngModel)]="myInput"
  [showCancelButton]="shouldShowCancel"
  (ionInput)="onInput($event)"
  (ionCancel)="onCancel($event)">
</ion-searchbar>
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
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### debounce

number

Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.


#### mode



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
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### debounce

number

Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.


#### mode



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


#### ionClear

Emitted when the clear input button is clicked.


#### ionFocus

Emitted when the input has focus.


#### ionInput

Emitted when the Searchbar input has changed, including when it's cleared.



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
