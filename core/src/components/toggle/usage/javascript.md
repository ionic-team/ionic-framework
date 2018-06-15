```html
<ion-toggle></ion-toggle>
<ion-toggle disabled></ion-toggle>
<ion-toggle checked></ion-toggle>

<ion-toggle color="primary"></ion-toggle>
<ion-toggle color="secondary"></ion-toggle>
<ion-toggle color="danger"></ion-toggle>
<ion-toggle color="light"></ion-toggle>
<ion-toggle color="dark"></ion-toggle>

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
