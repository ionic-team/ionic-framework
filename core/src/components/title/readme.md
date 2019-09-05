# ion-title

`ion-title` is a component that sets the title of the `Toolbar`.



<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<!-- Default title -->
<ion-toolbar>
  <ion-title>Default Title</ion-title>
</ion-toolbar>

<!-- Small title above a default title -->
<ion-toolbar>
  <ion-title size="small">Small Title above a Default Title</ion-title>
</ion-toolbar>
<ion-toolbar>
  <ion-title>Default Title</ion-title>
</ion-toolbar>
```


### React

```tsx
import React from 'react';
import {
  IonToolbar,
  IonTitle
} from '@ionic/react';

export const ToolbarExample: React.FC = () => (
  <IonToolbar>
    <IonTitle>Default Title</IonTitle>
  </IonToolbar>

  <IonToolbar>
    <IonTitle size="small">Small Title above a Default Title</IonTitle>
  </IonToolbar>
  <IonToolbar>
    <IonTitle>Default Title</IonTitle>
  </IonToolbar>
);
```


### Vue

```html
<template>
  <ion-toolbar>
    <ion-title>Default Title</ion-title>
  </ion-toolbar>

  <ion-toolbar>
    <ion-title size="small">Small Title above a Default Title</ion-title>
  </ion-toolbar>
  <ion-toolbar>
    <ion-title>Default Title</ion-title>
  </ion-toolbar>
</template>
```



## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                            | Type                              | Default     |
| -------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------- |
| `color`  | `color`   | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`             | `undefined` |
| `size`   | `size`    | The size of the toolbar title.                                                                                                                                                                                                                                         | `"large" \| "small" \| undefined` | `undefined` |


## CSS Custom Properties

| Name      | Description             |
| --------- | ----------------------- |
| `--color` | Text color of the title |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
