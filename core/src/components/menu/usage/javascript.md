```html
<ion-app>
  <ion-menu side="start" menu-id="first" content-id="main">
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

  <ion-menu side="start" menu-id="custom" class="my-custom-menu" content-id="main">
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

  <ion-menu side="end" type="push" content-id="main">
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

  <div class="ion-page" id="main">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu - Basic</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button expand="block" onclick="openFirst()">Open Start Menu</ion-button>
      <ion-button expand="block" onclick="openEnd()">Open End Menu</ion-button>
      <ion-button expand="block" onclick="openCustom()">Open Custom Menu</ion-button>
    </ion-content>
  </div>

</ion-app>
```

```javascript
<script type="module">
    import { menuController } from '@ionic/core';
    window.menuController = menuController;
</script>
  
<script>
  function openFirst() {
    menuController.enable(true, 'first');
    menuController.open('first');
  }
  
  function openEnd() {
    menuController.open('end');
  }
  
  function openCustom() {
    menuController.enable(true, 'custom');
    menuController.open('custom');
  }
</script>
```

```css
.my-custom-menu {
  --width: 500px;
}
```