```tsx
import { Component, h } from '@stencil/core';

import { menuController } from '@ionic/core';

@Component({
  tag: 'menu-example',
  styleUrl: 'menu-example.css'
})
export class MenuExample {
  openFirst() {
    menuController.enable(true, 'first');
    menuController.open('first');
  }

  openEnd() {
    menuController.open('end');
  }

  openCustom() {
    menuController.enable(true, 'custom');
    menuController.open('custom');
  }

  render() {
    return [
      <ion-menu side="start" menuId="first" contentId="main">
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
      </ion-menu>,

      <ion-menu side="start" menuId="custom" contentId="main" class="my-custom-menu">
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
      </ion-menu>,

      <ion-menu side="end" type="push" contentId="main">
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
      </ion-menu>,

      // A router outlet can be placed here instead
      <ion-content id="main">
        <ion-button expand="block" onClick={() => this.openFirst()}>Open Start Menu</ion-button>
        <ion-button expand="block" onClick={() => this.openEnd()}>Open End Menu</ion-button>
        <ion-button expand="block" onClick={() => this.openCustom()}>Open Custom Menu</ion-button>
      </ion-content>
    ];
  }
}
```

```css
.my-custom-menu {
  --width: 500px;
}
```