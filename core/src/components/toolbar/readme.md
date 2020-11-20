# ion-toolbar

Toolbars are positioned above or below content. When a toolbar is placed in an `<ion-header>` it will appear fixed at the top of the content, and when it is in an `<ion-footer>` it will appear fixed at the bottom. Fullscreen content will scroll behind a toolbar in a header or footer. When placed within an `<ion-content>`, toolbars will scroll with the content.


## Buttons

Buttons placed in a toolbar should be placed inside of the `<ion-buttons>` element. The `<ion-buttons>` element can be positioned inside of the toolbar using a named slot. The below chart has a description of each slot.

| Slot         | Description                                                                                              |
|--------------|----------------------------------------------------------------------------------------------------------|
| `secondary`  | Positions element to the `left` of the content in `ios` mode, and directly to the `right` in `md` mode.  |
| `primary`    | Positions element to the `right` of the content in `ios` mode, and to the far `right` in `md` mode.      |
| `start`      | Positions to the `left` of the content in LTR, and to the `right` in RTL.                                |
| `end`        | Positions to the `right` of the content in LTR, and to the `left` in RTL.                                |


## Borders

In `md` mode, the `<ion-header>` will receive a box-shadow on the bottom, and the `<ion-footer>` will receive a box-shadow on the top.  In `ios` mode, the `<ion-header>` will receive a border on the bottom, and the `<ion-footer>` will receive a border on the top.



<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-toolbar>
  <ion-title>Title Only</ion-title>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="start">
    <ion-back-button></ion-back-button>
  </ion-buttons>
  <ion-title>Back Button</ion-title>
</ion-toolbar>

<ion-toolbar>
  <ion-title size="small">Small Title above a Default Title</ion-title>
</ion-toolbar>
<ion-toolbar>
  <ion-title>Default Title</ion-title>
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
  <ion-buttons slot="primary">
    <ion-button color="secondary">
      <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Default Buttons</ion-title>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="secondary">
    <ion-button fill="solid">
      <ion-icon slot="start" name="person-circle"></ion-icon>
      Contact
    </ion-button>
  </ion-buttons>
  <ion-title>Solid Buttons</ion-title>
  <ion-buttons slot="primary">
    <ion-button fill="solid" color="secondary">
      Help
      <ion-icon slot="end" name="help-circle"></ion-icon>
    </ion-button>
  </ion-buttons>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="secondary">
    <ion-button fill="outline">
      <ion-icon slot="start" name="star"></ion-icon>
      Star
    </ion-button>
  </ion-buttons>
  <ion-title>Outline Buttons</ion-title>
  <ion-buttons slot="primary">
    <ion-button color="danger" fill="outline">
      Edit
      <ion-icon slot="end" name="create"></ion-icon>
    </ion-button>
  </ion-buttons>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="secondary">
    <ion-button>
      Account
    </ion-button>
  </ion-buttons>
  <ion-buttons slot="primary">
    <ion-button color="danger">
      Edit
    </ion-button>
  </ion-buttons>
  <ion-title>Text Only Buttons</ion-title>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="start">
    <ion-menu-button autoHide="false"></ion-menu-button>

  </ion-buttons>
  <ion-buttons slot="secondary">
    <ion-button>
      <ion-icon slot="icon-only" name="star"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Left side menu toggle</ion-title>
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
  <ion-buttons slot="primary">
    <ion-button (click)="clickedSearch()">
      <ion-icon slot="icon-only" name="search"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-searchbar placeholder="Search Favorites"></ion-searchbar>
</ion-toolbar>

<ion-toolbar>
  <ion-segment value="all">
    <ion-segment-button value="all">
      All
    </ion-segment-button>
    <ion-segment-button value="favorites">
      Favorites
    </ion-segment-button>
  </ion-segment>
</ion-toolbar>

<ion-toolbar color="secondary">
  <ion-buttons slot="secondary">
    <ion-button>
      <ion-icon slot="icon-only" name="person-circle"></ion-icon>
    </ion-button>
    <ion-button>
      <ion-icon slot="icon-only" name="search"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-buttons slot="primary">
    <ion-button color="primary">
      <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Secondary Toolbar</ion-title>
</ion-toolbar>

<ion-toolbar color="dark">
  <ion-buttons slot="secondary">
    <ion-button>
      <ion-icon slot="icon-only" name="person-circle"></ion-icon>
    </ion-button>
    <ion-button>
      <ion-icon slot="icon-only" name="search"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-buttons slot="primary">
    <ion-button color="danger">
      <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Dark Toolbar</ion-title>
</ion-toolbar>
```


### Javascript

```html
<ion-toolbar>
  <ion-title>Title Only</ion-title>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="start">
    <ion-back-button></ion-back-button>
  </ion-buttons>
  <ion-title>Back Button</ion-title>
</ion-toolbar>

<ion-toolbar>
  <ion-title size="small">Small Title above a Default Title</ion-title>
</ion-toolbar>
<ion-toolbar>
  <ion-title>Default Title</ion-title>
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
  <ion-buttons slot="primary">
    <ion-button color="secondary">
      <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Default Buttons</ion-title>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="secondary">
    <ion-button fill="solid">
      <ion-icon slot="start" name="person-circle"></ion-icon>
      Contact
    </ion-button>
  </ion-buttons>
  <ion-title>Solid Buttons</ion-title>
  <ion-buttons slot="primary">
    <ion-button fill="solid" color="secondary">
      Help
      <ion-icon slot="end" name="help-circle"></ion-icon>
    </ion-button>
  </ion-buttons>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="secondary">
    <ion-button fill="outline">
      <ion-icon slot="start" name="star"></ion-icon>
      Star
    </ion-button>
  </ion-buttons>
  <ion-title>Outline Buttons</ion-title>
  <ion-buttons slot="primary">
    <ion-button color="danger" fill="outline">
      Edit
      <ion-icon slot="end" name="create"></ion-icon>
    </ion-button>
  </ion-buttons>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="secondary">
    <ion-button>
      Account
    </ion-button>
  </ion-buttons>
  <ion-buttons slot="primary">
    <ion-button color="danger">
      Edit
    </ion-button>
  </ion-buttons>
  <ion-title>Text Only Buttons</ion-title>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="start">
    <ion-menu-button auto-hide="false"></ion-menu-button>
  </ion-buttons>
  <ion-buttons slot="secondary">
    <ion-button>
      <ion-icon slot="icon-only" name="star"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Left side menu toggle</ion-title>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="primary">
    <ion-button onclick="clickedStar()">
      <ion-icon slot="icon-only" name="star"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Right side menu toggle</ion-title>
  <ion-buttons slot="end">
    <ion-menu-button auto-hide="false"></ion-menu-button>
  </ion-buttons>
</ion-toolbar>

<ion-toolbar>
  <ion-buttons slot="primary">
    <ion-button onclick="clickedSearch()">
      <ion-icon slot="icon-only" name="search"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-searchbar placeholder="Search Favorites"></ion-searchbar>
</ion-toolbar>

<ion-toolbar>
  <ion-segment value="all">
    <ion-segment-button value="all">
      All
    </ion-segment-button>
    <ion-segment-button value="favorites">
      Favorites
    </ion-segment-button>
  </ion-segment>
</ion-toolbar>

<ion-toolbar color="secondary">
  <ion-buttons slot="secondary">
    <ion-button>
      <ion-icon slot="icon-only" name="person-circle"></ion-icon>
    </ion-button>
    <ion-button>
      <ion-icon slot="icon-only" name="search"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-buttons slot="primary">
    <ion-button color="primary">
      <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Secondary Toolbar</ion-title>
</ion-toolbar>

<ion-toolbar color="dark">
  <ion-buttons slot="secondary">
    <ion-button>
      <ion-icon slot="icon-only" name="person-circle"></ion-icon>
    </ion-button>
    <ion-button>
      <ion-icon slot="icon-only" name="search"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-buttons slot="primary">
    <ion-button color="danger">
      <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
    </ion-button>
  </ion-buttons>
  <ion-title>Dark Toolbar</ion-title>
</ion-toolbar>
```


### React

```tsx
import React from 'react';
import { IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonIcon, IonMenuButton, IonSearchbar, IonSegment, IonSegmentButton } from '@ionic/react';
import { personCircle, search, helpCircle, star, create, ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';

export const ToolbarExample: React.FC = () => (
  <IonToolbar>
    <IonTitle>Title Only</IonTitle>
  </IonToolbar>

  <IonToolbar>
    <IonButtons slot="start">
      <IonBackButton defaultHref="/" />
    </IonButtons>
    <IonTitle>Back Button</IonTitle>
  </IonToolbar>

  <IonToolbar>
    <IonTitle size="small">Small Title above a Default Title</IonTitle>
  </IonToolbar>
  <IonToolbar>
    <IonTitle>Default Title</IonTitle>
  </IonToolbar>

  <IonToolbar>
    <IonButtons slot="secondary">
      <IonButton>
        <IonIcon slot="icon-only" icon={personCircle} />
      </IonButton>
      <IonButton>
        <IonIcon slot="icon-only" icon={search} />
      </IonButton>
    </IonButtons>
    <IonButtons slot="primary">
      <IonButton color="secondary">
        <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical} />
      </IonButton>
    </IonButtons>
    <IonTitle>Default Buttons</IonTitle>
  </IonToolbar>

  <IonToolbar>
    <IonButtons slot="secondary">
      <IonButton fill="solid">
        <IonIcon slot="start" icon={personCircle} />
        Contact
      </IonButton>
    </IonButtons>
    <IonTitle>Solid Buttons</IonTitle>
    <IonButtons slot="primary">
      <IonButton fill="solid" color="secondary">
        Help
        <IonIcon slot="end" icon={helpCircle} />
      </IonButton>
    </IonButtons>
  </IonToolbar>

  <IonToolbar>
    <IonButtons slot="secondary">
      <IonButton fill="outline">
        <IonIcon slot="start" icon={star} />
        Star
      </IonButton>
    </IonButtons>
    <IonTitle>Outline Buttons</IonTitle>
    <IonButtons slot="primary">
      <IonButton color="danger" fill="outline">
        Edit
        <IonIcon slot="end" icon={create} />
      </IonButton>
    </IonButtons>
  </IonToolbar>

  <IonToolbar>
    <IonButtons slot="secondary">
      <IonButton>Account</IonButton>
    </IonButtons>
    <IonButtons slot="primary">
      <IonButton color="danger">Edit</IonButton>
    </IonButtons>
    <IonTitle>Text Only Buttons</IonTitle>
  </IonToolbar>

  <IonToolbar>
    <IonButtons slot="start">
      <IonMenuButton autoHide={false} />
    </IonButtons>
    <IonButtons slot="secondary">
      <IonButton>
        <IonIcon slot="icon-only" icon={star} />
      </IonButton>
    </IonButtons>
    <IonTitle>Left side menu toggle</IonTitle>
  </IonToolbar>

  <IonToolbar>
    <IonButtons slot="primary">
      <IonButton onClick={() => {}}>
        <IonIcon slot="icon-only" icon={star} />
      </IonButton>
    </IonButtons>
    <IonTitle>Right side menu toggle</IonTitle>
    <IonButtons slot="end">
      <IonMenuButton autoHide={false} />
    </IonButtons>
  </IonToolbar>

  <IonToolbar>
    <IonButtons slot="primary">
      <IonButton onClick={() => {}}>
        <IonIcon slot="icon-only" icon={search} />
      </IonButton>
    </IonButtons>
    <IonSearchbar placeholder="Search Favorites" />
  </IonToolbar>

  <IonToolbar>
    <IonSegment value="all">
      <IonSegmentButton value="all">
        All
      </IonSegmentButton>
      <IonSegmentButton value="favorites">Favorites</IonSegmentButton>
    </IonSegment>
  </IonToolbar>

  <IonToolbar color="secondary">
    <IonButtons slot="secondary">
      <IonButton>
        <IonIcon slot="icon-only" icon={personCircle} />
      </IonButton>
      <IonButton>
        <IonIcon slot="icon-only" icon={search} />
      </IonButton>
    </IonButtons>
    <IonButtons slot="primary">
      <IonButton color="primary">
        <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical} />
      </IonButton>
    </IonButtons>
    <IonTitle>Secondary Toolbar</IonTitle>
  </IonToolbar>

  <IonToolbar color="dark">
    <IonButtons slot="secondary">
      <IonButton>
        <IonIcon slot="icon-only" icon={personCircle} />
      </IonButton>
      <IonButton>
        <IonIcon slot="icon-only" icon={search} />
      </IonButton>
    </IonButtons>
    <IonButtons slot="primary">
      <IonButton color="danger">
        <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical} />
      </IonButton>
    </IonButtons>
    <IonTitle>Dark Toolbar</IonTitle>
  </IonToolbar>
);
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'toolbar-example',
  styleUrl: 'toolbar-example.css'
})
export class ToolbarExample {

  clickedStar() {
    console.log("Clicked star button");
  }

  clickedSearch() {
    console.log("Clicked search button");
  }

  render() {
    return [
      <ion-toolbar>
        <ion-title>Title Only</ion-title>
      </ion-toolbar>,

      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Back Button</ion-title>
      </ion-toolbar>,

      <ion-toolbar>
        <ion-title size="small">Small Title above a Default Title</ion-title>
      </ion-toolbar>,
      <ion-toolbar>
        <ion-title>Default Title</ion-title>
      </ion-toolbar>,

      <ion-toolbar>
        <ion-buttons slot="secondary">
          <ion-button>
            <ion-icon slot="icon-only" name="person-circle"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon slot="icon-only" name="search"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button color="secondary">
            <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Default Buttons</ion-title>
      </ion-toolbar>,

      <ion-toolbar>
        <ion-buttons slot="secondary">
          <ion-button fill="solid">
            <ion-icon slot="start" name="person-circle"></ion-icon>
            Contact
          </ion-button>
        </ion-buttons>
        <ion-title>Solid Buttons</ion-title>
        <ion-buttons slot="primary">
          <ion-button fill="solid" color="secondary">
            Help
            <ion-icon slot="end" name="help-circle"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>,

      <ion-toolbar>
        <ion-buttons slot="secondary">
          <ion-button fill="outline">
            <ion-icon slot="start" name="star"></ion-icon>
            Star
          </ion-button>
        </ion-buttons>
        <ion-title>Outline Buttons</ion-title>
        <ion-buttons slot="primary">
          <ion-button color="danger" fill="outline">
            Edit
            <ion-icon slot="end" name="create"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>,

      <ion-toolbar>
        <ion-buttons slot="secondary">
          <ion-button>
            Account
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button color="danger">
            Edit
          </ion-button>
        </ion-buttons>
        <ion-title>Text Only Buttons</ion-title>
      </ion-toolbar>,

      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button autoHide={false}></ion-menu-button>

        </ion-buttons>
        <ion-buttons slot="secondary">
          <ion-button>
            <ion-icon slot="icon-only" name="star"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Left side menu toggle</ion-title>
      </ion-toolbar>,

      <ion-toolbar>
        <ion-buttons slot="primary">
          <ion-button onClick={() => this.clickedStar()}>
            <ion-icon slot="icon-only" name="star"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Right side menu toggle</ion-title>
        <ion-buttons slot="end">
          <ion-menu-button autoHide={false}></ion-menu-button>

        </ion-buttons>
      </ion-toolbar>,

      <ion-toolbar>
        <ion-buttons slot="primary">
          <ion-button onClick={() => this.clickedSearch()}>
            <ion-icon slot="icon-only" name="search"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-searchbar placeholder="Search Favorites"></ion-searchbar>
      </ion-toolbar>,

      <ion-toolbar>
        <ion-segment value="all">
          <ion-segment-button value="all">
            All
          </ion-segment-button>
          <ion-segment-button value="favorites">
            Favorites
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>,

      <ion-toolbar color="secondary">
        <ion-buttons slot="secondary">
          <ion-button>
            <ion-icon slot="icon-only" name="person-circle"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon slot="icon-only" name="search"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button color="primary">
            <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Secondary Toolbar</ion-title>
      </ion-toolbar>,

      <ion-toolbar color="dark">
        <ion-buttons slot="secondary">
          <ion-button>
            <ion-icon slot="icon-only" name="person-circle"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon slot="icon-only" name="search"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button color="danger">
            <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Dark Toolbar</ion-title>
      </ion-toolbar>
    ];
  }
}
```


### Vue

```html
<template>
  <ion-toolbar>
    <ion-title>Title Only</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
    <ion-title>Back Button</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-title size="small">Small Title above a Default Title</ion-title>
  </ion-toolbar>
  <ion-toolbar>
    <ion-title>Default Title</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons slot="secondary">
      <ion-button>
        <ion-icon slot="icon-only" :icon="personCircle"></ion-icon>
      </ion-button>
      <ion-button>
        <ion-icon slot="icon-only" :icon="search"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-buttons slot="primary">
      <ion-button color="secondary">
        <ion-icon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Default Buttons</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons slot="secondary">
      <ion-button fill="solid">
        <ion-icon slot="start" :icon="person-circle"></ion-icon>
        Contact
      </ion-button>
    </ion-buttons>
    <ion-title>Solid Buttons</ion-title>
    <ion-buttons slot="primary">
      <ion-button fill="solid" color="secondary">
        Help
        <ion-icon slot="end" :icon="help-circle"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons slot="secondary">
      <ion-button fill="outline">
        <ion-icon slot="start" :icon="star"></ion-icon>
        Star
      </ion-button>
    </ion-buttons>
    <ion-title>Outline Buttons</ion-title>
    <ion-buttons slot="primary">
      <ion-button color="danger" fill="outline">
        Edit
        <ion-icon slot="end" :icon="create"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons slot="secondary">
      <ion-button>
        Account
      </ion-button>
    </ion-buttons>
    <ion-buttons slot="primary">
      <ion-button color="danger">
        Edit
      </ion-button>
    </ion-buttons>
    <ion-title>Text Only Buttons</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button auto-hide="false"></ion-menu-button>

    </ion-buttons>
    <ion-buttons slot="secondary">
      <ion-button>
        <ion-icon slot="icon-only" :icon="star"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Left side menu toggle</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons slot="primary">
      <ion-button @click="clickedStar()">
        <ion-icon slot="icon-only" :icon="star"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Right side menu toggle</ion-title>
    <ion-buttons slot="end">
      <ion-menu-button auto-hide="false"></ion-menu-button>

    </ion-buttons>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons slot="primary">
      <ion-button @click="clickedSearch()">
        <ion-icon slot="icon-only" :icon="search"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-searchbar placeholder="Search Favorites"></ion-searchbar>
  </ion-toolbar>

  <ion-toolbar>
    <ion-segment value="all">
      <ion-segment-button value="all">
        All
      </ion-segment-button>
      <ion-segment-button value="favorites">
        Favorites
      </ion-segment-button>
    </ion-segment>
  </ion-toolbar>

  <ion-toolbar color="secondary">
    <ion-buttons slot="secondary">
      <ion-button>
        <ion-icon slot="icon-only" :icon="personCircle"></ion-icon>
      </ion-button>
      <ion-button>
        <ion-icon slot="icon-only" :icon="search"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-buttons slot="primary">
      <ion-button color="primary">
        <ion-icon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Secondary Toolbar</ion-title>
  </ion-toolbar>

  <ion-toolbar color="dark">
    <ion-buttons slot="secondary">
      <ion-button>
        <ion-icon slot="icon-only" :icon="personCircle"></ion-icon>
      </ion-button>
      <ion-button>
        <ion-icon slot="icon-only" :icon="search"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-buttons slot="primary">
      <ion-button color="danger">
        <ion-icon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Dark Toolbar</ion-title>
  </ion-toolbar>
</template>

<script>
import { 
  IonButton, 
  IonButtons, 
  IonIcon,
  IonTitle, 
  IonToolbar
} from '@ionic/vue';
import { 
  ellipsisHorizontal,
  ellipsisVertical, 
  helpCircle, 
  personCircle, 
  search, 
  star
} from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonButton, 
    IonButtons, 
    IonIcon,
    IonTitle, 
    IonToolbar
  },
  setup() {
    return {
      ellipsisHorizontal,
      ellipsisVertical, 
      helpCircle, 
      personCircle, 
      search, 
      star
    }
  }
});
</script>
```



## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                            | Type                  | Default     |
| -------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `color`  | `color`   | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` | `undefined` |
| `mode`   | `mode`    | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`       | `undefined` |


## Slots

| Slot          | Description                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------------- |
|               | Content is placed between the named slots if provided without a slot.                                    |
| `"end"`       | Content is placed to the right of the toolbar text in LTR, and to the left in RTL.                       |
| `"primary"`   | Content is placed to the right of the toolbar text in `ios` mode, and to the far right in `md` mode.     |
| `"secondary"` | Content is placed to the left of the toolbar text in `ios` mode, and directly to the right in `md` mode. |
| `"start"`     | Content is placed to the left of the toolbar text in LTR, and to the right in RTL.                       |


## CSS Custom Properties

| Name               | Description                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| `--background`     | Background of the toolbar                                                                                  |
| `--border-color`   | Color of the toolbar border                                                                                |
| `--border-style`   | Style of the toolbar border                                                                                |
| `--border-width`   | Width of the toolbar border                                                                                |
| `--color`          | Color of the toolbar text                                                                                  |
| `--min-height`     | Minimum height of the toolbar                                                                              |
| `--opacity`        | Opacity of the toolbar background                                                                          |
| `--padding-bottom` | Bottom padding of the toolbar                                                                              |
| `--padding-end`    | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the toolbar |
| `--padding-start`  | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the toolbar |
| `--padding-top`    | Top padding of the toolbar                                                                                 |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
