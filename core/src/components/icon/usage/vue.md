```html
<template>
  <!-- automatically uses the correct "star" icon depending on the mode -->
  <ion-icon name="star"></ion-icon>

  <!-- explicitly set the icon for each mode -->
  <ion-icon ios="ios-home" md="md-home"></ion-icon>

  <!-- always use the same icon, no matter what the mode is -->
  <ion-icon name="ios-clock"></ion-icon>
  <ion-icon name="logo-twitter"></ion-icon>

  <!-- use a custom svg icon -->
  <ion-icon src="/path/to/external/file.svg"></ion-icon>

  <!-- set the icon size -->
  <ion-icon size="small" name="heart"></ion-icon>
  <ion-icon size="large" name="heart"></ion-icon>
</template>
```
