```html
<template>
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
      <ion-toggle @ionChange="toppings.push($event.target.value)" value="pepperoni" v-bind:checked="toppings.indexOf('pepperoni') !== -1"></ion-toggle>
    </ion-item>

    <ion-item>
      <ion-label>Sausage</ion-label>
      <ion-toggle @ionChange="toppings.push($event.target.value)" value="sausage" v-bind:checked="toppings.indexOf('pepperoni') !== -1" disabled="true"></ion-toggle>
    </ion-item>

    <ion-item>
      <ion-label>Mushrooms</ion-label>
      <ion-toggle @ionChange="toppings.push($event.target.value)" value="mushrooms" v-bind:checked="toppings.indexOf('pepperoni') !== -1"></ion-toggle>
    </ion-item>
  </ion-list>
</template>
```
