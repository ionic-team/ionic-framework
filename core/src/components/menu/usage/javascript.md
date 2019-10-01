```html
<ion-app>
  <ion-menu side="start" menu-id="first">
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

  <ion-menu side="start" menu-id="custom" class="my-custom-menu">
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

  <div class="ion-page" main>
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu - Basic</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button expand="block" id="open-start">Open Start Menu</ion-button>
      <ion-button expand="block" id="open-end">Open End Menu</ion-button>
      <ion-button expand="block" id="open-custom">Open Custom Menu</ion-button>
    </ion-content>
  </div>

</ion-app>
```

```javascript
import { menuController } from '@ionic/core';
    
document.querySelector('#open-start').addEventListener('click', async () => {
  await menuController.enable(true, 'first');
  await menuController.open('first');
});

document.querySelector('#open-end').addEventListener('click', async () => {
  await menuController.open('end');
});

document.querySelector('#open-custom').addEventListener('click', async () => {
  await menuController.enable(true, 'custom');
  await menuController.open('custom');
});
```

```css
.my-custom-menu {
  --width: 500px;
}
```