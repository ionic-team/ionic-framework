# ion-button

Buttons provide a clickable element, which can be used in forms, or anywhere that needs simple, standard button functionality. They may display text, icons, or both. Buttons can be styled with several attributes to look a specific way.

## Expand

This attribute lets you specify how wide the button should be. By default, buttons are inline blocks, but setting this attribute will change the button to a full-width block element.

| Value          | Details                                                                      |
|----------------|------------------------------------------------------------------------------|
| `block`        | Full-width button with rounded corners.                                      |
| `full`         | Full-width button with square corners and no border on the left or right.    |

## Fill

This attributes determines the background and border color of the button. By default, buttons have a solid background unless the button is inside of a toolbar, in which case it has a transparent background.

| Value          | Details                                                                      |
|----------------|------------------------------------------------------------------------------|
| `clear`        | Button with a transparent background that resembles a flat button.           |
| `outline`      | Button with a transparent background and a visible border.                   |
| `solid`        | Button with a filled background. Useful for buttons in a toolbar.            |

## Size

This attribute specifies the size of the button. Setting this attribute will change the height and padding of a button.

| Value          | Details                                                                      |
|----------------|------------------------------------------------------------------------------|
| `small`        | Button with less height and padding. Default for buttons in an item.         |
| `default`      | Button with the default height and padding. Useful for buttons in an item.   |
| `large`        | Button with more height and padding.                                         |


<!-- Auto Generated Below -->


## Properties

#### buttonType

string

The type of button.
Possible values are: `"button"`, `"bar-button"`.


#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### disabled

boolean

If true, the user cannot interact with the button. Defaults to `false`.


#### expand

string

Set to `"block"` for a full-width button or to `"full"` for a full-width button
without left and right borders.


#### fill

string

Set to `"clear"` for a transparent button, to `"outline"` for a transparent
button with a border, or to `"solid"`. The default style is `"solid"` except inside of
a toolbar, where the default is `"clear"`.


#### href

string

Contains a URL or a URL fragment that the hyperlink points to.
If this property is set, an anchor tag will be rendered.


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### routerDirection

string

When using a router, it specifies the transition direction when navigating to
another page using `href`.


#### shape

string

The button shape.
Possible values are: `"round"`.


#### size

string

The button size.
Possible values are: `"small"`, `"default"`, `"large"`.


#### strong

boolean

If true, activates a button with a heavier font weight.


#### type

string

The type of the button.
Possible values are: `"submit"`, `"reset"` and `"button"`.
Default value is: `"button"`


## Attributes

#### button-type

string

The type of button.
Possible values are: `"button"`, `"bar-button"`.


#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### disabled

boolean

If true, the user cannot interact with the button. Defaults to `false`.


#### expand

string

Set to `"block"` for a full-width button or to `"full"` for a full-width button
without left and right borders.


#### fill

string

Set to `"clear"` for a transparent button, to `"outline"` for a transparent
button with a border, or to `"solid"`. The default style is `"solid"` except inside of
a toolbar, where the default is `"clear"`.


#### href

string

Contains a URL or a URL fragment that the hyperlink points to.
If this property is set, an anchor tag will be rendered.


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### router-direction

string

When using a router, it specifies the transition direction when navigating to
another page using `href`.


#### shape

string

The button shape.
Possible values are: `"round"`.


#### size

string

The button size.
Possible values are: `"small"`, `"default"`, `"large"`.


#### strong

boolean

If true, activates a button with a heavier font weight.


#### type

string

The type of the button.
Possible values are: `"submit"`, `"reset"` and `"button"`.
Default value is: `"button"`


## Events

#### ionBlur

Emitted when the button loses focus.


#### ionFocus

Emitted when the button has focus.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
