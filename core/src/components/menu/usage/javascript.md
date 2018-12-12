```html
<ion-app>
  <ion-menu side="start" content-id="menu-content">
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-title>Left Menu</ion-title>
      </ion-toolbar>
    </ion-header>
  </ion-menu>

  <ion-menu side="end" content-id="menu-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Hola</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      hola macho
    </ion-content>
  </ion-menu>

  <div class="ion-page" id="menu-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu - Basic</ion-title>
      </ion-toolbar>
    </ion-header>
  </div>

</ion-app>
<ion-menu-controller></ion-menu-controller>
```
