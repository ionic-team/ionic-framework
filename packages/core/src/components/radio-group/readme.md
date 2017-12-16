# ion-radio-group

A radio group is a group of [radio buttons](../radio). It allows
a user to select at most one radio button from a set. Checking one radio
button that belongs to a radio group unchecks any previous checked
radio button within the same group.


```html
<ion-list>

  <ion-radio-group>

    <ion-list-header>
      Auto Manufacturers
    </ion-list-header>

    <ion-item>
      <ion-label>Cord</ion-label>
      <ion-radio value="cord"></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Duesenberg</ion-label>
      <ion-radio value="duesenberg"></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Hudson</ion-label>
      <ion-radio value="hudson"></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Packard</ion-label>
      <ion-radio value="packard"></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Studebaker</ion-label>
      <ion-radio value="studebaker"></ion-radio>
    </ion-item>

  </ion-radio-group>

</ion-list>
```


<!-- Auto Generated Below -->


## Properties

#### allowEmptySelection

boolean


#### disabled

boolean


#### name

string

The name of the control, which is submitted with the form data.


#### value

string


## Attributes

#### allowEmptySelection

boolean


#### disabled

boolean


#### name

string

The name of the control, which is submitted with the form data.


#### value

string


## Events

#### ionChange



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
