```html
<template>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
    <ion-title>Back Button</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons slot="secondary">
      <ion-button>
        <ion-icon slot="icon-only" name="contact"></ion-icon>
      </ion-button>
      <ion-button>
        <ion-icon slot="icon-only" name="search"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Default Buttons</ion-title>
    <ion-buttons slot="primary">
      <ion-button color="secondary">
        <ion-icon slot="icon-only" name="more"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons slot="primary">
      <ion-button @click="clickedStar()">
        <ion-icon slot="icon-only" name="star"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Right side menu toggle</ion-title>
    <ion-buttons slot="end">
      <ion-menu-button autoHide="false"></ion-menu-button>
    </ion-buttons>
  </ion-toolbar>
</template>
```