```html
<template>
  <!-- Default Input -->
  <ion-input></ion-input>

  <!-- Input with value -->
  <ion-input value="custom"></ion-input>

  <!-- Input with placeholder -->
  <ion-input placeholder="Enter Input"></ion-input>

  <!-- Input with clear button when there is a value -->
  <ion-input clearInput value="clear me"></ion-input>

  <!-- Number type input -->
  <ion-input type="number" value="333"></ion-input>

  <!-- Disabled input -->
  <ion-input value="Disabled" disabled></ion-input>

  <!-- Readonly input -->
  <ion-input value="Readonly" readonly></ion-input>

  <!-- Inputs with labels -->
  <ion-item>
    <ion-label>Default Label</ion-label>
    <ion-input></ion-input>
  </ion-item>

  <ion-item>
    <ion-label position="floating">Floating Label</ion-label>
    <ion-input></ion-input>
  </ion-item>

  <ion-item>
    <ion-label position="fixed">Fixed Label</ion-label>
    <ion-input></ion-input>
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Stacked Label</ion-label>
    <ion-input></ion-input>
  </ion-item>
</template>
```