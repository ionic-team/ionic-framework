# ion-range

The Range slider lets users select from a range of values by moving
the slider knob. It can accept dual knobs, but by default one knob
controls the value of the range.

### Range Labels

Labels can be placed on either side of the range by adding the
`slot="start"` or `slot="end"` to the element. The element doesn't have to
be an `ion-label`, it can be added to any element to place it to the
left or right of the range. See [usage](#usage) below for examples.

### Usage

```html
<ion-list>
  <ion-item>
    <ion-range color="danger" pin="true"></ion-range>
  </ion-item>

  <ion-item>
    <ion-range min="-200" max="200" color="secondary">
      <ion-label slot="start">-200</ion-label>
      <ion-label slot="end">200</ion-label>
    </ion-range>
  </ion-item>

 <ion-item>
   <ion-range min="20" max="80" step="2" >
     <ion-icon small slot="start" name="sunny"></ion-icon>
     <ion-icon slot="end" name="sunny"></ion-icon>
   </ion-range>
 </ion-item>

  <ion-item>
    <ion-range min="1000" max="2000" step="100" snaps="true" color="secondary" ></ion-range>
  </ion-item>

  <ion-item>
    <ion-range dualKnobs="true" min="21" max="72" step="3" snaps="true"></ion-range>
  </ion-item>
</ion-list>
```

<!-- Auto Generated Below -->


## Properties

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### debounce

number

How long, in milliseconds, to wait to trigger the
`ionChange` event after each change in the range value. Default `0`.


#### disabled

boolean

Indicates that the user cannot interact with the control.


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

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### name

string

The name of the control, which is submitted with the form data.


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
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### debounce

number

How long, in milliseconds, to wait to trigger the
`ionChange` event after each change in the range value. Default `0`.


#### disabled

boolean

Indicates that the user cannot interact with the control.


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

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### name

string

The name of the control, which is submitted with the form data.


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



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
