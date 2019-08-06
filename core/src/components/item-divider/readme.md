# ion-item-divider

Item Dividers are block elements that can be used to separate items in a list. They are similar to list headers, but instead of being placed at the top of a list, they should go in between groups of like items.

<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<ion-item-divider>
  <ion-label>
    Basic Item Divider
  </ion-label>
</ion-item-divider>

<ion-item-divider color="secondary">
  <ion-label>
    Secondary Item Divider
  </ion-label>
</ion-item-divider>

<!-- Item Dividers in a List -->
<ion-list>
  <ion-item-divider>
    <ion-label>
      Section A
    </ion-label>
  </ion-item-divider>

  <ion-item><ion-label>A1</ion-label></ion-item>
  <ion-item><ion-label>A2</ion-label></ion-item>
  <ion-item><ion-label>A3</ion-label></ion-item>
  <ion-item><ion-label>A4</ion-label></ion-item>
  <ion-item><ion-label>A5</ion-label></ion-item>

  <ion-item-divider>
    <ion-label>
      Section B
    </ion-label>
  </ion-item-divider>

  <ion-item><ion-label>B1</ion-label></ion-item>
  <ion-item><ion-label>B2</ion-label></ion-item>
  <ion-item><ion-label>B3</ion-label></ion-item>
  <ion-item><ion-label>B4</ion-label></ion-item>
  <ion-item><ion-label>B5</ion-label></ion-item>
</ion-list>
```


### React

```tsx
import React from 'react';
import { IonItemDivider, IonLabel, IonList, IonItem, IonContent } from '@ionic/react';

export const ItemDividerExample: React.FunctionComponent = () => (
  <IonContent>
    <IonItemDivider>
      <IonLabel>
        Basic Item Divider
      </IonLabel>
    </IonItemDivider>

    <IonItemDivider color="secondary">
      <IonLabel>
        Secondary Item Divider
      </IonLabel>
    </IonItemDivider>

    {/*-- Item Dividers in a List --*/}
    <IonList>
      <IonItemDivider>
        <IonLabel>
          Section A
        </IonLabel>
      </IonItemDivider>

      <IonItem><IonLabel>A1</IonLabel></IonItem>
      <IonItem><IonLabel>A2</IonLabel></IonItem>
      <IonItem><IonLabel>A3</IonLabel></IonItem>
      <IonItem><IonLabel>A4</IonLabel></IonItem>
      <IonItem><IonLabel>A5</IonLabel></IonItem>

      <IonItemDivider>
        <IonLabel>
          Section B
        </IonLabel>
      </IonItemDivider>

      <IonItem><IonLabel>B1</IonLabel></IonItem>
      <IonItem><IonLabel>B2</IonLabel></IonItem>
      <IonItem><IonLabel>B3</IonLabel></IonItem>
      <IonItem><IonLabel>B4</IonLabel></IonItem>
      <IonItem><IonLabel>B5</IonLabel></IonItem>
    </IonList>
  </IonContent>
);
```


### Vue

```html
<template>
  <ion-item-divider>
    <ion-label>
      Basic Item Divider
    </ion-label>
  </ion-item-divider>

  <ion-item-divider color="secondary">
    <ion-label>
      Secondary Item Divider
    </ion-label>
  </ion-item-divider>

  <!-- Item Dividers in a List -->
  <ion-list>
    <ion-item-divider>
      <ion-label>
        Section A
      </ion-label>
    </ion-item-divider>

    <ion-item><ion-label>A1</ion-label></ion-item>
    <ion-item><ion-label>A2</ion-label></ion-item>
    <ion-item><ion-label>A3</ion-label></ion-item>
    <ion-item><ion-label>A4</ion-label></ion-item>
    <ion-item><ion-label>A5</ion-label></ion-item>

    <ion-item-divider>
      <ion-label>
        Section B
      </ion-label>
    </ion-item-divider>

    <ion-item><ion-label>B1</ion-label></ion-item>
    <ion-item><ion-label>B2</ion-label></ion-item>
    <ion-item><ion-label>B3</ion-label></ion-item>
    <ion-item><ion-label>B4</ion-label></ion-item>
    <ion-item><ion-label>B5</ion-label></ion-item>
  </ion-list>
</template>
```



## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                            | Type                  | Default     |
| -------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `color`  | `color`   | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` | `undefined` |
| `mode`   | `mode`    | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`       | `undefined` |
| `sticky` | `sticky`  | When it's set to `true`, the item-divider will stay visible when it reaches the top of the viewport until the next `ion-item-divider` replaces it.  This feature relies in `position:sticky`: https://caniuse.com/#feat=css-sticky                                     | `boolean`             | `false`     |


## Slots

| Slot      | Description                                                                        |
| --------- | ---------------------------------------------------------------------------------- |
|           | Content is placed between the named slots if provided without a slot.              |
| `"end"`   | Content is placed to the right of the divider text in LTR, and to the left in RTL. |
| `"start"` | Content is placed to the left of the divider text in LTR, and to the right in RTL. |


## CSS Custom Properties

| Name                     | Description                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `--background`           | Background of the item divider                                                                                  |
| `--color`                | Color of the item divider                                                                                       |
| `--inner-padding-bottom` | Bottom inner padding of the item divider                                                                        |
| `--inner-padding-end`    | End inner padding of the item divider                                                                           |
| `--inner-padding-start`  | Start inner padding of the item divider                                                                         |
| `--inner-padding-top`    | Top inner padding of the item divider                                                                           |
| `--padding-bottom`       | Bottom padding of the item divider                                                                              |
| `--padding-end`          | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the item divider |
| `--padding-start`        | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the item divider |
| `--padding-top`          | Top padding of the item divider                                                                                 |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
