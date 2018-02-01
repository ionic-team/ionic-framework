# ion-toggle

Toggles change the state of a single option. Toggles can be switched on or off by pressing or swiping them. They can also be checked programmatically by setting the `checked` property.


```html
<!-- Default Toggle -->
<ion-toggle></ion-toggle>

<!-- Disabled Toggle -->
<ion-toggle disabled></ion-toggle>

<!-- Checked Toggle -->
<ion-toggle checked></ion-toggle>

<!-- Toggle Colors -->
<ion-toggle color="primary"></ion-toggle>
<ion-toggle color="secondary"></ion-toggle>
<ion-toggle color="danger"></ion-toggle>
<ion-toggle color="light"></ion-toggle>
<ion-toggle color="dark"></ion-toggle>

<!-- Toggles in a List -->
<ion-list>
  <ion-item>
    <ion-label>Pepperoni</ion-label>
    <ion-toggle slot="end" value="pepperoni" checked></ion-toggle>
  </ion-item>

  <ion-item>
    <ion-label>Sausage</ion-label>
    <ion-toggle slot="end" value="sausage" disabled></ion-toggle>
  </ion-item>

  <ion-item>
    <ion-label>Mushrooms</ion-label>
    <ion-toggle slot="end" value="mushrooms"></ion-toggle>
  </ion-item>
</ion-list>
```


<!-- Auto Generated Below -->


## Properties

#### checked

boolean

Returns / Sets the current state of the element when type is checkbox or radio.


#### color

string


#### disabled

boolean

Indicates that the user cannot interact with the control.


#### mode




#### name

string

The name of the control, which is submitted with the form data.


#### value

string

Reflects the value of the form control.


## Attributes

#### checked

boolean

Returns / Sets the current state of the element when type is checkbox or radio.


#### color

string


#### disabled

boolean

Indicates that the user cannot interact with the control.


#### mode




#### name

string

The name of the control, which is submitted with the form data.


#### value

string

Reflects the value of the form control.


## Events

#### ionBlur

Removes focus from input; keystrokes will subsequently go nowhere.


#### ionChange

The change event is fired when the value of has changed.


#### ionFocus

Focus on the input element; keystrokes will subsequently go to this element.


#### ionStyle

Emitted when the styles change. This is useful for parent
components to know how to style themselves depending on the
child input. For example, a disabled ion-toggle may give
its wrapping ion-item a different style.



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
