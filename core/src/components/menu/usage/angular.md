```html
<ion-menu side="start" menuId="first">
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>Start Menu</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <ion-item>Menu Item</ion-item>
      <ion-item>Menu Item</ion-item>
      <ion-item>Menu Item</ion-item>
      <ion-item>Menu Item</ion-item>
      <ion-item>Menu Item</ion-item>
    </ion-list>
  </ion-content>
</ion-menu>

<ion-menu side="start" menuId="custom" class="my-custom-menu">
  <ion-header>
    <ion-toolbar color="tertiary">
      <ion-title>Custom Menu</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <ion-item>Menu Item</ion-item>
      <ion-item>Menu Item</ion-item>
      <ion-item>Menu Item</ion-item>
      <ion-item>Menu Item</ion-item>
      <ion-item>Menu Item</ion-item>
    </ion-list>
  </ion-content>
</ion-menu>

<ion-menu side="end" type="push">
  <ion-header>
    <ion-toolbar color="danger">
      <ion-title>End Menu</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <ion-item>Menu Item</ion-item>
      <ion-item>Menu Item</ion-item>
      <ion-item>Menu Item</ion-item>
      <ion-item>Menu Item</ion-item>
      <ion-item>Menu Item</ion-item>
    </ion-list>
  </ion-content>
</ion-menu>

<ion-router-outlet main></ion-router-outlet>
```

```typescript
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'menu-example',
  templateUrl: 'menu-example.html',
  styleUrls: ['./menu-example.css'],
})
export class MenuExample {

constructor(private menu: MenuController) { }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
}
```

```css
.my-custom-menu {
  --width: 500px;
}
```