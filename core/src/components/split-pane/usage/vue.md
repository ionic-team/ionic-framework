```html
<template>
  <ion-split-pane contentId="menu-content">
    <!--  our side menu  -->
    <ion-menu contentId="menu-content">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
    </ion-menu>

    <!-- the main content -->
    <ion-router-outlet id="menu-content"></ion-router-outlet>
  </ion-split-pane>
</template>
```
