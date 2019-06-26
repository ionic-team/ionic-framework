# ion-header

Header is a parent component that holds the toolbar component.
It's important to note that ion-header needs to be the one of the three root elements of a page



<!-- Auto Generated Below -->


## Usage

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

<ion-content></ion-content>
```


### React

```tsx
import React from 'react';
import { IonHeader, IonContent, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';

export const HeaderExample: React.FunctionComponent = () => (
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

    <IonContent />
  </>
);
```



## Properties

| Property      | Attribute     | Description                                                                                                                                                                           | Type            | Default     |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------- |
| `mode`        | `mode`        | The mode determines which platform styles to use.                                                                                                                                     | `"ios" \| "md"` | `undefined` |
| `translucent` | `translucent` | If `true`, the header will be translucent. Only applies to `ios` mode. Note: In order to scroll content behind the header, the `fullscreen` attribute needs to be set on the content. | `boolean`       | `false`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
