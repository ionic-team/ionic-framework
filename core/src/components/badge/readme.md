# ion-badge

Badges are inline block elements that usually appear near another element. Typically they contain a number or other characters. They can be used as a notification that there are additional items associated with an element and indicate how many items there are.


<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<!-- Default -->
<ion-badge>99</ion-badge>

<!-- Colors -->
<ion-badge color="primary">11</ion-badge>
<ion-badge color="secondary">22</ion-badge>
<ion-badge color="tertiary">33</ion-badge>
<ion-badge color="success">44</ion-badge>
<ion-badge color="warning">55</ion-badge>
<ion-badge color="danger">66</ion-badge>
<ion-badge color="light">77</ion-badge>
<ion-badge color="medium">88</ion-badge>
<ion-badge color="dark">99</ion-badge>

<!-- Item with badge on left and right -->
<ion-item>
  <ion-badge slot="start">11</ion-badge>
  <ion-label>My Item</ion-label>
  <ion-badge slot="end">22</ion-badge>
</ion-item>
```


### React

```tsx
import React from 'react';
import { IonBadge, IonItem, IonLabel, IonContent } from '@ionic/react';

export const BadgeExample: React.FunctionComponent = () => (
  <IonContent>
    {/*-- Default --*/}
    <IonBadge>99</IonBadge>

    {/*-- Colors --*/}
    <IonBadge color="primary">11</IonBadge>
    <IonBadge color="secondary">22</IonBadge>
    <IonBadge color="tertiary">33</IonBadge>
    <IonBadge color="success">44</IonBadge>
    <IonBadge color="warning">55</IonBadge>
    <IonBadge color="danger">66</IonBadge>
    <IonBadge color="light">77</IonBadge>
    <IonBadge color="medium">88</IonBadge>
    <IonBadge color="dark">99</IonBadge>

    {/*-- Item with badge on left and right --*/}
    <IonItem>
      <IonBadge slot="start">11</IonBadge>
      <IonLabel>My Item</IonLabel>
      <IonBadge slot="end">22</IonBadge>
    </IonItem>
  </IonContent>
);
```


### Vue

```html
<template>
  <!-- Default -->
  <ion-badge>99</ion-badge>

  <!-- Colors -->
  <ion-badge color="primary">11</ion-badge>
  <ion-badge color="secondary">22</ion-badge>
  <ion-badge color="tertiary">33</ion-badge>
  <ion-badge color="success">44</ion-badge>
  <ion-badge color="warning">55</ion-badge>
  <ion-badge color="danger">66</ion-badge>
  <ion-badge color="light">77</ion-badge>
  <ion-badge color="medium">88</ion-badge>
  <ion-badge color="dark">99</ion-badge>

  <!-- Item with badge on left and right -->
  <ion-item>
    <ion-badge slot="start">11</ion-badge>
    <ion-label>My Item</ion-label>
    <ion-badge slot="end">22</ion-badge>
  </ion-item>
</template>
```



## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                            | Type                  | Default     |
| -------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `color`  | `color`   | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` | `undefined` |
| `mode`   | `mode`    | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`       | `undefined` |


## CSS Custom Properties

| Name               | Description                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `--background`     | Background of the badge                                                                                  |
| `--color`          | Text color of the badge                                                                                  |
| `--padding-bottom` | Bottom padding of the badge                                                                              |
| `--padding-end`    | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the badge |
| `--padding-start`  | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the badge |
| `--padding-top`    | Top padding of the badge                                                                                 |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
