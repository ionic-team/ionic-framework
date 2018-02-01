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


#### ionFocus

Focus on the input element; keystrokes will subsequently go to this element.


#### ionRadioDidLoad


#### ionRadioDidUnload


#### ionSelect

A single radio button fires an ionSelect event, whereas
a radio group fires an ionChange event. It would be more common
to attach listeners to the radio group, not individual radio buttons.


#### ionStyle



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
