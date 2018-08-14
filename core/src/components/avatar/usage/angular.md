```html
<ion-avatar>
  <img [src]="user.img">
</ion-avatar>

<ion-chip>
  <ion-avatar>
    <img [src]="user.img">
  </ion-avatar>
  <ion-label>Chip Avatar</ion-label>
</ion-chip>

<ion-item>
  <ion-avatar slot="start">
    <img [src]="user.img">
  </ion-avatar>
  <ion-label>Item Avatar</ion-label>
</ion-item>
```