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


#### color

string


#### disabled

boolean


#### mode




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
