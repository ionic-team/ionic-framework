```html
<template>
  <ion-list>
    <ion-item v-for="item in items" :key="item.src">
      <ion-thumbnail slot="start">
        <ion-img :src="item.src"></ion-img>
      </ion-thumbnail>
      <ion-label>{{item.text}}</ion-label>
    </ion-item>
  </ion-list>
</template>
```
