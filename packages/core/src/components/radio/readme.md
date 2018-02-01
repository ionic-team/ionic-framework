# ion-radio

Radios are generally used as a set of related options inside of a group, but they can also be used alone. Pressing on a radio will check it. They can also be checked programmatically by setting the `checked` property.

An `ion-radio-group` can be used to group a set of radios. When radios are inside of a [radio group](../radio-group), only one radio in the group will be checked at any time. Pressing a radio will check it and uncheck the previously selected radio, if there is one. If a radio is not in a group with another radio, then both radios will have the ability to be checked at the same time.


```html
<ion-list>
  <ion-radio-group>
    <ion-list-header>
      <ion-label>Name</ion-label>
    </ion-list-header>

    <ion-item>
      <ion-label>Biff</ion-label>
      <ion-radio slot="start" value="biff" checked></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Griff</ion-label>
      <ion-radio slot="start" value="griff"></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Buford</ion-label>
      <ion-radio slot="start" value="buford"></ion-radio>
    </ion-item>
  </ion-radio-group>
</ion-list>
```


<!-- Auto Generated Below -->


## Properties

#### checked

boolean

If true, the radio is selected. Defaults to `false`.


#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### disabled

boolean

Indicates that the user cannot interact with the control.


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### name

string

The name of the control, which is submitted with the form data.


#### value

string

the value of the radio.


## Attributes

#### checked

boolean

If true, the radio is selected. Defaults to `false`.


#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
For more information, see [Theming your App](/docs/theming/theming-your-app).


#### disabled

boolean

Indicates that the user cannot interact with the control.


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.
For more information, see [Platform Styles](/docs/theming/platform-specific-styles).


#### name

string

The name of the control, which is submitted with the form data.


#### value

string

the value of the radio.


## Events

#### ionBlur

Emitted when the radio button loses focus.


#### ionFocus

Emitted when the radio button has focus.


#### ionRadioDidLoad

Emitted when the radio loads.


#### ionRadioDidUnload

Emitted when the radio unloads.


#### ionSelect

Emitted when the radio button is selected.


#### ionStyle

Emitted when the styles change.



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
