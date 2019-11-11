```html
<template>
  <!-- Default Note -->
  <ion-note>Default Note</ion-note>

  <!-- Note Colors -->
  <ion-note color="primary">Primary Note</ion-note>
  <ion-note color="secondary">Secondary Note</ion-note>
  <ion-note color="danger">Danger Note</ion-note>
  <ion-note color="light">Light Note</ion-note>
  <ion-note color="dark">Dark Note</ion-note>

  <!-- Notes in a List -->
  <ion-list>
    <ion-item>
      <ion-label>Note (End)</ion-label>
      <ion-note slot="end">On</ion-note>
    </ion-item>

    <ion-item>
      <ion-note slot="start">Off</ion-note>
      <ion-label>Note (Start)</ion-label>
    </ion-item>
  </ion-list>
</template>
```
