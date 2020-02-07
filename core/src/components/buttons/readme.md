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
      <ion-icon slot="icon-only" name="person-circle"></ion-icon>
    </ion-button>
    <ion-button>
      <ion-icon slot="icon-only" name="search"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Default Buttons</ion-title>
  <ion-buttons slot="primary">
    <ion-button color="secondary">
      <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
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

<ion-toolbar>
  <ion-buttons collapse="true">
    <ion-button>
      <ion-icon slot="icon-only" name="star"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Collapsible Buttons</ion-title>
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
      <ion-icon slot="icon-only" name="person-circle"></ion-icon>
    </ion-button>
    <ion-button>
      <ion-icon slot="icon-only" name="search"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Default Buttons</ion-title>
  <ion-buttons slot="primary">
    <ion-button color="secondary">
      <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
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

<ion-toolbar>
  <ion-buttons collapse="true">
    <ion-button>
      <ion-icon slot="icon-only" name="star"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Collapsible Buttons</ion-title>
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

export const ButtonsExample: React.FC = () => (
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
          <IonIcon slot="icon-only" name="person-circle" />
        </IonButton>
        <IonButton>
          <IonIcon slot="icon-only" name="search" />
        </IonButton>
      </IonButtons>
      <IonTitle>Default Buttons</IonTitle>
      <IonButtons slot="primary">
        <IonButton color="secondary">
          <IonIcon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical" />
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

    <IonToolbar>
      <IonButtons collapse="true">
        <IonButton>
          <IonIcon slot="icon-only" name="star" />
        </IonButton>
      </IonButtons>
      <IonTitle>Collapsible Buttons</IonTitle>
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
        <ion-icon slot="icon-only" name="person-circle"></ion-icon>
      </ion-button>
      <ion-button>
        <ion-icon slot="icon-only" name="search"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Default Buttons</ion-title>
    <ion-buttons slot="primary">
      <ion-button color="secondary">
        <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
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
      <ion-menu-button auto-hide="false"></ion-menu-button>
    </ion-buttons>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons collapse="true">
      <ion-button>
        <ion-icon slot="icon-only" name="star"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Collapsible Buttons</ion-title>
  </ion-toolbar>
</template>
```



## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                       | Type      | Default |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `collapse` | `collapse` | If true, buttons will disappear when its parent toolbar has fully collapsed if the toolbar is not the first toolbar. If the toolbar is the first toolbar, the buttons will be hidden and will only be shown once all toolbars have fully collapsed.  Only applies in `ios` mode with `collapse` set to `true` on `ion-header`.  Typically used for [Collapsible Large Titles](https://ionicframework.com/docs/api/title#collapsible-large-titles) | `boolean` | `false` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
