```html
<ion-list>
  <ion-item-sliding>
    <ion-item>
      <ion-label>Item</ion-label>
    </ion-item>
    <ion-item-options side="start">
      <ion-item-option onClick="favorite(item)">Favorite</ion-item-option>
      <ion-item-option color="danger" onClick="share(item)">Share</ion-item-option>
    </ion-item-options>

    <ion-item-options side="end">
      <ion-item-option onClick="unread(item)">Unread</ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</ion-list>
```
