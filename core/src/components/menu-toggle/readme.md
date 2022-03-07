# ion-menu-toggle

The MenuToggle component can be used to toggle a menu open or closed.

By default, it's only visible when the selected menu is active. A menu is active when it can be opened/closed. If the menu is disabled or it's being presented as a split-pane, the menu is marked as non-active and ion-menu-toggle hides itself.

In case it's desired to keep `ion-menu-toggle` always visible, the `autoHide` property can be set to `false`.

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-app>
  <ion-menu side="start" menuId="first" contentId="main">
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-title>Example Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>Menu Item</ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
  <div class="ion-page" id="main">
    <ion-content class="ion-padding">
      <ion-menu-toggle>
        <ion-button>Toggle Menu</ion-button>
      </ion-menu-toggle>
    </ion-content>
  </div>
</ion-app>
```


### Javascript

```html
<ion-app>
  <ion-menu side="start" menu-id="first" content-id="main">
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-title>Example Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>Menu Item</ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
  <div class="ion-page" id="main">
    <ion-content class="ion-padding">
      <ion-menu-toggle>
        <ion-button>Toggle Menu</ion-button>
      </ion-menu-toggle>
    </ion-content>
  </div>
</ion-app>
```


### React

```tsx
import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonMenuToggle, IonButton, IonPage } from '@ionic/react';

export const MenuExample: React.FC = () => (
  <>
    <IonMenu side="start" menuId="first" contentId="main">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Example Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>Menu Item</IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
    <IonPage id="main">
      <IonContent>
        <IonMenuToggle>
          <IonButton>Toggle Menu</IonButton>
        </IonMenuToggle>
      </IonContent>
    </IonPage>
  </>
);
```


### Vue

```html
<template>
  <ion-menu side="start" menu-id="first" content-id="main">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Example Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>Menu Item</ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>

  <div class="ion-page" id="main">
    <ion-content>
      <ion-menu-toggle>
        <ion-button>Toggle Menu</ion-button>
      </ion-menu-toggle>
    </ion-content>
  </div>
</template>

<script>
import { 
  IonContent, 
  IonHeader, 
  IonItem, 
  IonList, 
  IonMenu, 
  IonMenuToggle,
  IonButton,
  IonTitle, 
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonContent, 
    IonHeader, 
    IonItem, 
    IonList, 
    IonMenu, 
    IonMenuToggle,
    IonButton,
    IonTitle, 
    IonToolbar
  }
});
</script>
```



## Properties

| Property   | Attribute   | Description                                                                                                                                                                                                                                         | Type                  | Default     |
| ---------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `autoHide` | `auto-hide` | Automatically hides the content when the corresponding menu is not active.  By default, it's `true`. Change it to `false` in order to keep `ion-menu-toggle` always visible regardless the state of the menu.                                       | `boolean`             | `true`      |
| `menu`     | `menu`      | Optional property that maps to a Menu's `menuId` prop. Can also be `start` or `end` for the menu side. This is used to find the correct menu to toggle.  If this property is not used, `ion-menu-toggle` will toggle the first menu that is active. | `string \| undefined` | `undefined` |


## Slots

| Slot | Description                                                     |
| ---- | --------------------------------------------------------------- |
|      | Content is placed inside the toggle to act as the click target. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
