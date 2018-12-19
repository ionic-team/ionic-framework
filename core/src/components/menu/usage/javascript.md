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
    <ion-content padding>
      <ion-button expand="block" onclick="openFirst()">Open Start Menu</ion-button>
      <ion-button expand="block" onclick="openEnd()">Open End Menu</ion-button>
      <ion-button expand="block" onclick="openCustom()">Open Custom Menu</ion-button>
    </ion-content>
  </div>

</ion-app>
<ion-menu-controller></ion-menu-controller>
```

```javascript
const menuCtrl = document.querySelector('ion-menu-controller');

function openFirst() {
  menuCtrl.enable(true, 'first');
  menuCtrl.open('first');
}

function openEnd() {
  menuCtrl.open('end');
}

function openCustom() {
  menuCtrl.enable(true, 'custom');
  menuCtrl.open('custom');
}
```

```css
.my-custom-menu {
  --width: 500px;
}
```