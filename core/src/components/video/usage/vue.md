```html
<template>
  <ion-list>
    <ion-item v-for="item in items" :key="item.src">
      <ion-video :src="item.src"></ion-video>
    </ion-item>
  </ion-list>
</template>
```
