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
    <ion-buttons slot="secondary">
      <ion-button>
        <ion-icon slot="icon-only" name="contact"></ion-icon>
      </ion-button>
      <ion-button>
        <ion-icon slot="icon-only" name="search"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-buttons slot="primary">
      <ion-button color="secondary">
        <ion-icon slot="icon-only" name="more"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Default Buttons</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-buttons slot="secondary">
      <ion-button fill="solid">
        <ion-icon slot="start" name="contact"></ion-icon>
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
      <ion-button @click="clickedStar()">
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
      <ion-button @click="clickedSearch()">
        <ion-icon slot="icon-only" name="search"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-searchbar placeholder="Search Favorites"></ion-searchbar>
  </ion-toolbar>

  <ion-toolbar>
    <ion-segment>
      <ion-segment-button value="all" checked>
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
        <ion-icon slot="icon-only" name="contact"></ion-icon>
      </ion-button>
      <ion-button>
        <ion-icon slot="icon-only" name="search"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-buttons slot="primary">
      <ion-button color="primary">
        <ion-icon slot="icon-only" name="more"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Secondary Toolbar</ion-title>
  </ion-toolbar>

  <ion-toolbar color="dark">
    <ion-buttons slot="secondary">
      <ion-button>
        <ion-icon slot="icon-only" name="contact"></ion-icon>
      </ion-button>
      <ion-button>
        <ion-icon slot="icon-only" name="search"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-buttons slot="primary">
      <ion-button color="danger">
        <ion-icon slot="icon-only" name="more"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title>Dark Toolbar</ion-title>
  </ion-toolbar>
</template>
```