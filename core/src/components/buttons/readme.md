# ion-buttons

The Buttons component is a container element. Buttons placed in a toolbar should be placed inside of the `<ion-buttons>` element.

The `<ion-buttons>` element can be positioned inside of the toolbar using a named slot. The below chart has a description of each slot.

| Slot         | Description                                                                                              |
|--------------|----------------------------------------------------------------------------------------------------------|
| `secondary`  | Positions element to the `left` of the content in `ios` mode, and directly to the `right` in `md` mode.  |
| `primary`    | Positions element to the `right` of the content in `ios` mode, and to the far `right` in `md` mode.      |
| `start`      | Positions to the `left` of the content in LTR, and to the `right` in RTL.                                |
| `end`        | Positions to the `right` of the content in LTR, and to the `left` in RTL.                                |


<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-toolbar>
  <ion-buttons slot="start">
    <ion-back-button></ion-back-button>
  </ion-buttons>
  <ion-title>Back Button</ion-title>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="secondary">
    <ion-button>
      <ion-icon slot="icon-only" name="contact"></ion-icon>
    </ion-button>
    <ion-button>
      <ion-icon slot="icon-only" name="search"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Default Buttons</ion-title>
  <ion-buttons slot="primary">
    <ion-button color="secondary">
      <ion-icon slot="icon-only" name="more"></ion-icon>
    </ion-button>
  </ion-buttons>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="primary">
    <ion-button (click)="clickedStar()">
      <ion-icon slot="icon-only" name="star"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Right side menu toggle</ion-title>
  <ion-buttons slot="end">
    <ion-menu-button autoHide="false"></ion-menu-button>
  </ion-buttons>
</ion-toolbar>
```


### Javascript

```html
<ion-toolbar>
  <ion-buttons slot="start">
    <ion-back-button></ion-back-button>
  </ion-buttons>
  <ion-title>Back Button</ion-title>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="secondary">
    <ion-button>
      <ion-icon slot="icon-only" name="contact"></ion-icon>
    </ion-button>
    <ion-button>
      <ion-icon slot="icon-only" name="search"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Default Buttons</ion-title>
  <ion-buttons slot="primary">
    <ion-button color="secondary">
      <ion-icon slot="icon-only" name="more"></ion-icon>
    </ion-button>
  </ion-buttons>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="primary">
    <ion-button onclick="clickedStar()">
      <ion-icon slot="icon-only" name="star"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Right side menu toggle</ion-title>
  <ion-buttons slot="end">
    <ion-menu-toggle auto-hide="false">
      <ion-button>
        <ion-icon slot="icon-only" name="menu"></ion-icon>
      </ion-button>
    </ion-menu-toggle>
  </ion-buttons>
</ion-toolbar>
```


### React

```tsx
import React from 'react';
import {
  IonButtons,
  IonToolbar,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonContent
} from '@ionic/react';

export const ButtonsExample: React.FunctionComponent = () => (
  <IonContent>
    <IonToolbar>
      <IonButtons slot="start">
        <IonBackButton defaultHref="/" />
      </IonButtons>
      <IonTitle>Back Button</IonTitle>
    </IonToolbar>

    <IonToolbar>
      <IonButtons slot="secondary">
        <IonButton>
          <IonIcon slot="icon-only" name="contact" />
        </IonButton>
        <IonButton>
          <IonIcon slot="icon-only" name="search" />
        </IonButton>
      </IonButtons>
      <IonTitle>Default Buttons</IonTitle>
      <IonButtons slot="primary">
        <IonButton color="secondary">
          <IonIcon slot="icon-only" name="more" />
        </IonButton>
      </IonButtons>
    </IonToolbar>

    <IonToolbar>
      <IonButtons slot="primary">
        <IonButton onClick={() => {}}>
          <IonIcon slot="icon-only" name="star" />
        </IonButton>
      </IonButtons>
      <IonTitle>Right side menu toggle</IonTitle>
      <IonButtons slot="end">
        <IonMenuButton autoHide={false} />
      </IonButtons>
    </IonToolbar>
  </IonContent>
);
```


### Vue

```html
<template>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
    <ion-title>Back Button</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons slot="secondary">
      <ion-button>
        <ion-icon slot="icon-only" name="contact"></ion-icon>
      </ion-button>
      <ion-button>
        <ion-icon slot="icon-only" name="search"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Default Buttons</ion-title>
    <ion-buttons slot="primary">
      <ion-button color="secondary">
        <ion-icon slot="icon-only" name="more"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons slot="primary">
      <ion-button @click="clickedStar()">
        <ion-icon slot="icon-only" name="star"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Right side menu toggle</ion-title>
    <ion-buttons slot="end">
      <ion-menu-button autoHide="false"></ion-menu-button>
    </ion-buttons>
  </ion-toolbar>
</template>
```



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
