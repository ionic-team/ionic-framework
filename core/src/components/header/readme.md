# ion-header

Header is a parent component that holds the toolbar component.
It's important to note that ion-header needs to be the one of the three root elements of a page

## Fade Header

The `collapse` property can be set to `'fade'` on a page's main `ion-header` to have the background color of the toolbars fade in as users scroll. This provides the same fade effect that is found in many native iOS applications.

This functionality can be combined with [Collapsible Large Titles](https://ionicframework.com/docs/api/title#collapsible-large-titles) as well. The `collapse="condense"` value should be set on the `ion-header` inside of your `ion-content`. The `collapse="fade"` value should be set on the `ion-header` outside of your `ion-content`.

### Usage with Virtual Scroll

Fade and collapsible large titles require a scroll container to function. When using a virtual scrolling solution, you will need to disable scrolling on the `ion-content` and indicate which element container is responsible for the scroll container with the `.ion-content-scroll-host` class target.

```html
<ion-header collapse="fade">
  <ion-toolbar>
    <ion-title>Header</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content fullscreen="true" scroll-y="false">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">Header</ion-title>
    </ion-toolbar>
  </ion-header>
  <virtual-scroll-element class="ion-content-scroll-host">
    <!-- Your virtual scroll content -->
  </virtual-scroll-element>
</ion-content>
```

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
    <ion-title>My Navigation Bar</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-title>Subheader</ion-title>
  </ion-toolbar>
</ion-header>

<!-- Header without a border -->
<ion-header class="ion-no-border">
  <ion-toolbar>
    <ion-title>Header - No Border</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">My Navigation Bar</ion-title>
    </ion-toolbar>
  </ion-header>
</ion-content>

<!-- Fade Header with collapse header -->
<ion-header collapse="fade" [translucent]="true">
  <ion-toolbar>
    <ion-title>Header</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">Header</ion-title>
    </ion-toolbar>
  </ion-header>
</ion-content>
```


### Javascript

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
    <ion-title>My Navigation Bar</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-title>Subheader</ion-title>
  </ion-toolbar>
</ion-header>

<!-- Header without a border -->
<ion-header class="ion-no-border">
  <ion-toolbar>
    <ion-title>Header - No Border</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">My Navigation Bar</ion-title>
    </ion-toolbar>
  </ion-header>
</ion-content>

<!-- Fade Header with collapse header -->
<ion-header collapse="fade" translucent="true">
  <ion-toolbar>
    <ion-title>Header</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content fullscreen="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">Header</ion-title>
    </ion-toolbar>
  </ion-header>
</ion-content>
```


### React

```tsx
import React from 'react';
import { IonHeader, IonContent, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';

export const HeaderExample: React.FC = () => (
  <>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/" />
        </IonButtons>
        <IonTitle>My Navigation Bar</IonTitle>
      </IonToolbar>
    
      <IonToolbar>
        <IonTitle>Subheader</IonTitle>
      </IonToolbar>
    </IonHeader>
    
    {/*-- Header without a border --*/}
    <IonHeader className="ion-no-border">
     <IonToolbar>
      <IonTitle>Header - No Border</IonTitle>
     </IonToolbar>
    </IonHeader>
    
    <IonContent>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">My Navigation Bar</IonTitle>
        </IonToolbar>
      </IonHeader>
    </IonContent>
    
    {/*-- Fade Header with collapse header --*/}
    <IonHeader collapse="fade" translucent={true}>
      <IonToolbar>
        <IonTitle>Header</IonTitle>
      </IonToolbar>
    </IonHeader>
    
    <IonContent fullscreen={true}>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Header</IonTitle>
        </IonToolbar>
      </IonHeader>
    </IonContent>
  </>
);
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'header-example',
  styleUrl: 'header-example.css'
})
export class HeaderExample {
  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button></ion-back-button>
          </ion-buttons>
          <ion-title>My Navigation Bar</ion-title>
        </ion-toolbar>

        <ion-toolbar>
          <ion-title>Subheader</ion-title>
        </ion-toolbar>
      </ion-header>,

      {/*-- Header without a border --*/}
      <ion-header class="ion-no-border">
        <ion-toolbar>
          <ion-title>Header - No Border</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">My Navigation Bar</ion-title>
          </ion-toolbar>
        </ion-header>
      </ion-content>,
      
      {/*-- Fade Header with collapse header --*/}
      <ion-header collapse="fade" translucent={true}>
        <ion-toolbar>
          <ion-title>Header</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <ion-content fullscreen={true}>
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Header</ion-title>
          </ion-toolbar>
        </ion-header>
      </ion-content>
    ];
  }
}
```


### Vue

```html
<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>My Navigation Bar</ion-title>
    </ion-toolbar>
  
    <ion-toolbar>
      <ion-title>Subheader</ion-title>
    </ion-toolbar>
  </ion-header>
  
  <!-- Header without a border -->
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-title>Header - No Border</ion-title>
    </ion-toolbar>
  </ion-header>
  
  <ion-content>
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">My Navigation Bar</ion-title>
      </ion-toolbar>
    </ion-header>
  </ion-content>
  
  <!-- Fade Header with collapse header -->
  <ion-header collapse="fade" :translucent="true">
    <ion-toolbar>
      <ion-title>Header</ion-title>
    </ion-toolbar>
  </ion-header>
  
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Header</ion-title>
      </ion-toolbar>
    </ion-header>
  </ion-content>
</template>

<script>
import { 
  IonBackButton, 
  IonButtons, 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { 
    IonBackButton, 
    IonButtons, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar
  }
});
</script>
```



## Properties

| Property      | Attribute     | Description                                                                                                                                                                                                                                                                                                                           | Type                                | Default     |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------- |
| `collapse`    | `collapse`    | Describes the scroll effect that will be applied to the header. Only applies in iOS mode.  Typically used for [Collapsible Large Titles](https://ionicframework.com/docs/api/title#collapsible-large-titles)                                                                                                                          | `"condense" \| "fade" \| undefined` | `undefined` |
| `mode`        | `mode`        | The mode determines which platform styles to use.                                                                                                                                                                                                                                                                                     | `"ios" \| "md"`                     | `undefined` |
| `translucent` | `translucent` | If `true`, the header will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).  Note: In order to scroll content behind the header, the `fullscreen` attribute needs to be set on the content. | `boolean`                           | `false`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
