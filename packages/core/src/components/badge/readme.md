# ion-badge

Badges are inline block elements that usually appear near another element. Typically they contain a number or other characters. They can be used as a notification that there are additional items associated with an element and indicate how many items there are.

```html
<ion-badge>99</ion-badge>

<!-- Colors -->
<ion-badge color="primary">11</ion-badge>
<ion-badge color="secondary">22</ion-badge>
<ion-badge color="warning">33</ion-badge>
<ion-badge color="danger">44</ion-badge>
<ion-badge color="light">55</ion-badge>
<ion-badge color="dark">66</ion-badge>
```

```html
<ion-content>
  <ion-list>
    <ion-item>
      <ion-badge slot="start">11</ion-badge>
      <ion-label>My Item</ion-label>
      <ion-badge slot="end">22</ion-badge>
    </ion-item>
  </ion-list>
</ion-content>
```


<!-- Auto Generated Below -->


## Properties

#### color

string


#### mode

any


## Attributes

#### color

string


#### mode

any



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
