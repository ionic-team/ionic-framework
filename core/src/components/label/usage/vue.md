```html
<template>
  <!-- Default Label -->
  <ion-label>Label</ion-label>

  <!-- Label Colors -->
  <ion-label color="primary">Primary Label</ion-label>
  <ion-label color="secondary">Secondary Label</ion-label>
  <ion-label color="danger">Danger Label</ion-label>
  <ion-label color="light">Light Label</ion-label>
  <ion-label color="dark">Dark Label</ion-label>

  <!-- Item Labels -->
  <ion-item>
    <ion-label>Default Item</ion-label>
  </ion-item>

  <ion-item>
    <ion-label text-wrap>
      Multi-line text that should wrap when it is too long
      to fit on one line in the item.
    </ion-label>
  </ion-item>

  <!-- Input Labels -->
  <ion-item>
    <ion-label>Default Input</ion-label>
    <ion-input></ion-input>
  </ion-item>

  <ion-item>
    <ion-label position="fixed">Fixed</ion-label>
    <ion-input></ion-input>
  </ion-item>

  <ion-item>
    <ion-label position="floating">Floating</ion-label>
    <ion-input></ion-input>
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Stacked</ion-label>
    <ion-input></ion-input>
  </ion-item>

  <ion-item>
    <ion-label>Toggle</ion-label>
    <ion-toggle slot="end" checked></ion-toggle>
  </ion-item>

  <ion-item>
    <ion-checkbox slot="start" checked></ion-checkbox>
    <ion-label>Checkbox</ion-label>
  </ion-item>
</template>
```
