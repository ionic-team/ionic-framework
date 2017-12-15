# ion-radio

A radio button is a button that can be either checked or unchecked. A user can tap
the button to check or uncheck it. It can also be checked programmatically by changing
the `checked` property or `checked` attribute.

Use an `ion-radio-group` component to group a set of radio buttons. When
radio buttons are inside a [radio group](../radio-group), only one radio button
in the group can be checked at any time. If a radio button is not placed in a group,
then they will all have the ability to be checked at the same time.


```html
<ion-list>

  <ion-radio-group>

    <ion-list-header>
      Name
    </ion-list-header>

    <ion-item>
      <ion-label>Biff</ion-label>
      <ion-radio value="biff" checked></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Griff</ion-label>
      <ion-radio value="griff"></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Buford</ion-label>
      <ion-radio value="buford"></ion-radio>
    </ion-item>

  </ion-radio-group>

</ion-list>
```


<!-- Auto Generated Below -->


## Properties

#### checked

boolean


#### color

string


#### disabled

boolean


#### mode

any


#### name

string

The name of the control, which is submitted with the form data.


#### value

string


## Attributes

#### checked

boolean


#### color

string


#### disabled

boolean


#### mode

any


#### name

string

The name of the control, which is submitted with the form data.


#### value

string


## Events

#### ionBlur


#### ionFocus


#### ionRadioDidLoad


#### ionRadioDidUnload


#### ionSelect


#### ionStyle



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
