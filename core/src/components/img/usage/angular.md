```html
<ion-list>
  <ion-item *ngFor="let item of items">
    <ion-thumbnail slot="start">
      <ion-img [src]="item.src"></ion-img>
    </ion-thumbnail>
    <ion-label>{{item.text}}</ion-label>
  </ion-item>
</ion-list>
```
