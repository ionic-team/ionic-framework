# ion-checkbox

Checkboxes allow the selection of multiple options from a set of options. They appear as checked (ticked) when activated. Clicking on a checkbox will toggle the `checked` property. They can also be checked programmatically by setting the `checked` property.


```html
<!-- Default Checkbox -->
<ion-checkbox></ion-checkbox>

<!-- Disabled Checkbox -->
<ion-checkbox disabled></ion-checkbox>

<!-- Checked Checkbox -->
<ion-checkbox checked></ion-checkbox>

<!-- Checkbox Colors -->
<ion-checkbox color="primary"></ion-checkbox>
<ion-checkbox color="secondary"></ion-checkbox>
<ion-checkbox color="danger"></ion-checkbox>
<ion-checkbox color="light"></ion-checkbox>
<ion-checkbox color="dark"></ion-checkbox>

<!-- Checkboxes in a List -->
<ion-list>
  <ion-item>
    <ion-label>Pepperoni</ion-label>
    <ion-checkbox slot="end" value="pepperoni" checked></ion-checkbox>
  </ion-item>

  <ion-item>
    <ion-label>Sausage</ion-label>
    <ion-checkbox slot="end" value="sausage" disabled></ion-checkbox>
  </ion-item>

  <ion-item>
    <ion-label>Mushrooms</ion-label>
    <ion-checkbox slot="end" value="mushrooms"></ion-checkbox>
  </ion-item>
</ion-list>
```


<!-- Auto Generated Below -->


## Properties

#### checked

boolean

If true, the checkbox is selected. Defaults to `false`.


#### color

string

The color to use.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.


#### disabled

boolean

If true, the user cannot interact with the checkbox. Defaults to `false`.


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.


#### name

string

The name of the control, which is submitted with the form data.


#### value

string

the value of the checkbox.


## Attributes

#### checked

boolean

If true, the checkbox is selected. Defaults to `false`.


#### color

string

The color to use.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.


#### disabled

boolean

If true, the user cannot interact with the checkbox. Defaults to `false`.


#### mode

string

The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.


#### name

string

The name of the control, which is submitted with the form data.


#### value

string

the value of the checkbox.


## Events

#### ionBlur

Emitted when the toggle loses focus.


#### ionChange

Emitted when the checked property has changed.


#### ionFocus

Emitted when the toggle has focus.


#### ionStyle

Emitted when the styles change.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
