```html
<template>
  <ion-list>
    <ion-item-sliding>
      <ion-item>
        <ion-label>Item</ion-label>
      </ion-item>
      <ion-item-options side="start">
        <ion-item-option @click="favorite(item)">Favorite</ion-item-option>
        <ion-item-option color="danger" @click="share(item)">Share</ion-item-option>
      </ion-item-options>

      <ion-item-options side="end">
        <ion-item-option @click="unread(item)">Unread</ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
</template>
```
