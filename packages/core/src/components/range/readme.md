# ion-range-knob



<!-- Auto Generated Below -->


## Properties

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### debounce

number

How long, in milliseconds, to wait to trigger the
`ionChange` event after each change in the range value. Default `0`.


#### disabled

boolean


#### dualKnobs

boolean

Show two knobs. Defaults to `false`.


#### max

number

Maximum integer value of the range. Defaults to `100`.


#### min

number

Minimum integer value of the range. Defaults to `0`.


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### pin

boolean

If true, a pin with integer value is shown when the knob
is pressed. Defaults to `false`.


#### snaps

boolean

If true, the knob snaps to tick marks evenly spaced based
on the step property value. Defaults to `false`.


#### step

number

Specifies the value granularity. Defaults to `1`.


#### value

any

the value of the range.


## Attributes

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### debounce

number

How long, in milliseconds, to wait to trigger the
`ionChange` event after each change in the range value. Default `0`.


#### disabled

boolean


#### dual-knobs

boolean

Show two knobs. Defaults to `false`.


#### max

number

Maximum integer value of the range. Defaults to `100`.


#### min

number

Minimum integer value of the range. Defaults to `0`.


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### pin

boolean

If true, a pin with integer value is shown when the knob
is pressed. Defaults to `false`.


#### snaps

boolean

If true, the knob snaps to tick marks evenly spaced based
on the step property value. Defaults to `false`.


#### step

number

Specifies the value granularity. Defaults to `1`.


#### value

any

the value of the range.


## Events

#### ionBlur

Emitted when the range loses focus.


#### ionChange

Emitted when the value property has changed.


#### ionFocus

Emitted when the range has focus.


#### ionStyle

Emitted when the styles change.


## Methods

#### ratio()

Returns the ratio of the knob's is current location, which is a number
between `0` and `1`. If two knobs are used, this property represents
the lower value.


#### ratioUpper()

Returns the ratio of the upper value's is current location, which is
a number between `0` and `1`. If there is only one knob, then this
will return `null`.



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
