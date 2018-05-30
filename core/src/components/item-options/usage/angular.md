```html
<ion-item-sliding>
  <ion-item>
    Item 1
  </ion-item>
  <ion-item-options side="end" (ionSwipe)="saveItem(item)">
    <ion-item-option expandable (click)="saveItem(item)">
      <ion-icon name="star"></ion-icon>
    </ion-item-option>
  </ion-item-options>
</ion-item-sliding>
```
