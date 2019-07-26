# ion-grid


The grid is a powerful mobile-first flexbox system for building custom layouts.

It is composed of three units — a grid, [row(s)](../row) and [column(s)](../col). Columns will expand to fill the row, and will resize to fit additional columns. It is based on a 12 column layout with different breakpoints based on the screen size. The number of columns can be customized using CSS.

See [Grid Layout](/docs/layout/grid) for more information.

<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<ion-grid>
  <ion-row>
    <ion-col>
      ion-col
    </ion-col>
    <ion-col>
      ion-col
    </ion-col>
    <ion-col>
      ion-col
    </ion-col>
    <ion-col>
      ion-col
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col size="6">
      ion-col [size="6"]
    </ion-col>
    <ion-col>
      ion-col
    </ion-col>
    <ion-col>
      ion-col
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col size="3">
      ion-col [size="3"]
    </ion-col>
    <ion-col>
      ion-col
    </ion-col>
    <ion-col size="3">
      ion-col [size="3"]
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col size="3">
      ion-col [size="3"]
    </ion-col>
    <ion-col size="3" offset="3">
      ion-col [size="3"] [offset="3"]
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col>
      ion-col
    </ion-col>
    <ion-col>
      ion-col
      <br>#
    </ion-col>
    <ion-col>
      ion-col
      <br>#
      <br>#
    </ion-col>
    <ion-col>
      ion-col
      <br>#
      <br>#
      <br>#
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col align-self-start>
      ion-col [start]
    </ion-col>
    <ion-col align-self-center>
      ion-col [center]
    </ion-col>
    <ion-col align-self-end>
      ion-col [end]
    </ion-col>
    <ion-col>
      ion-col
      <br>#
      <br>#
    </ion-col>
  </ion-row>

  <ion-row align-items-start>
    <ion-col>
      [start] ion-col
    </ion-col>
    <ion-col>
      [start] ion-col
    </ion-col>
    <ion-col align-self-end>
      [start] ion-col [end]
    </ion-col>
    <ion-col>
      ion-col
      <br>#
      <br>#
    </ion-col>
  </ion-row>

  <ion-row align-items-center>
    <ion-col>
      [center] ion-col
    </ion-col>
    <ion-col>
      [center] ion-col
    </ion-col>
    <ion-col>
      [center] ion-col
    </ion-col>
    <ion-col>
      ion-col
      <br>#
      <br>#
    </ion-col>
  </ion-row>

  <ion-row align-items-end>
    <ion-col>
      [end] ion-col
    </ion-col>
    <ion-col align-self-start>
      [end] ion-col [start]
    </ion-col>
    <ion-col>
      [end] ion-col
    </ion-col>
    <ion-col>
      ion-col
      <br>#
      <br>#
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col size="12" size-sm>
      ion-col [size="12"] [size-sm]
    </ion-col>
    <ion-col size="12" size-sm>
      ion-col [size="12"] [size-sm]
    </ion-col>
    <ion-col size="12" size-sm>
      ion-col [size="12"] [size-sm]
    </ion-col>
    <ion-col size="12" size-sm>
      ion-col [size="12"] [size-sm]
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col size="12" size-md>
      ion-col [size="12"] [size-md]
    </ion-col>
    <ion-col size="12" size-md>
      ion-col [size="12"] [size-md]
    </ion-col>
    <ion-col size="12" size-md>
      ion-col [size="12"] [size-md]
    </ion-col>
    <ion-col size="12" size-md>
      ion-col [size="12"] [size-md]
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col size="6" size-lg offset="3">
      ion-col [size="6"] [size-lg] [offset="3"]
    </ion-col>
    <ion-col size="3" size-lg>
      ion-col [size="3"] [size-lg]
    </ion-col>
  </ion-row>
</ion-grid>
```


### React

```tsx
import React from 'react';
import { IonGrid, IonRow, IonCol, IonContent } from '@ionic/react';

export const GridExample: React.FunctionComponent = () => (
  <IonContent>
    <IonGrid>
      <IonRow>
        <IonCol>ion-col</IonCol>
        <IonCol>ion-col</IonCol>
        <IonCol>ion-col</IonCol>
        <IonCol>ion-col</IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="6">ion-col size="6"</IonCol>
        <IonCol>ion-col</IonCol>
        <IonCol>ion-col</IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="3">ion-col size="3"</IonCol>
        <IonCol>ion-col</IonCol>
        <IonCol size="3">ion-col size="3"</IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="3">ion-col size="3"</IonCol>
        <IonCol size="3" offset="3">
          ion-col size="3" offset="3"
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol>ion-col</IonCol>
        <IonCol>
          ion-col
          <br />#
        </IonCol>
        <IonCol>
          ion-col
          <br />#
          <br />#
        </IonCol>
        <IonCol>
          ion-col
          <br />#
          <br />#
          <br />#
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol align-self-start>ion-col start</IonCol>
        <IonCol align-self-center>ion-col center</IonCol>
        <IonCol align-self-end>ion-col end</IonCol>
        <IonCol>
          ion-col
          <br />#
          <br />#
        </IonCol>
      </IonRow>

      <IonRow align-items-start>
        <IonCol>start ion-col</IonCol>
        <IonCol>start ion-col</IonCol>
        <IonCol align-self-end>start ion-col end</IonCol>
        <IonCol>
          ion-col
          <br />#
          <br />#
        </IonCol>
      </IonRow>

      <IonRow align-items-center>
        <IonCol>center ion-col</IonCol>
        <IonCol>center ion-col</IonCol>
        <IonCol>center ion-col</IonCol>
        <IonCol>
          ion-col
          <br />#
          <br />#
        </IonCol>
      </IonRow>

      <IonRow align-items-end>
        <IonCol>end ion-col</IonCol>
        <IonCol align-self-start>end ion-col start</IonCol>
        <IonCol>end ion-col</IonCol>
        <IonCol>
          ion-col
          <br />#
          <br />#
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12" size-sm>
          ion-col size="12" size-sm
        </IonCol>
        <IonCol size="12" size-sm>
          ion-col size="12" size-sm
        </IonCol>
        <IonCol size="12" size-sm>
          ion-col size="12" size-sm
        </IonCol>
        <IonCol size="12" size-sm>
          ion-col size="12" size-sm
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12" size-md>
          ion-col size="12" size-md
        </IonCol>
        <IonCol size="12" size-md>
          ion-col size="12" size-md
        </IonCol>
        <IonCol size="12" size-md>
          ion-col size="12" size-md
        </IonCol>
        <IonCol size="12" size-md>
          ion-col size="12" size-md
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="6" size-lg offset="3">
          ion-col size="6" size-lg offset="3"
        </IonCol>
        <IonCol size="3" size-lg>
          ion-col size="3" size-lg
        </IonCol>
      </IonRow>
    </IonGrid>
  </IonContent>
);
```


### Vue

```html
<template>
  <ion-grid>
    <ion-row>
      <ion-col>
        ion-col
      </ion-col>
      <ion-col>
        ion-col
      </ion-col>
      <ion-col>
        ion-col
      </ion-col>
      <ion-col>
        ion-col
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col size="6">
        ion-col [size="6"]
      </ion-col>
      <ion-col>
        ion-col
      </ion-col>
      <ion-col>
        ion-col
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col size="3">
        ion-col [size="3"]
      </ion-col>
      <ion-col>
        ion-col
      </ion-col>
      <ion-col size="3">
        ion-col [size="3"]
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col size="3">
        ion-col [size="3"]
      </ion-col>
      <ion-col size="3" offset="3">
        ion-col [size="3"] [offset="3"]
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col>
        ion-col
      </ion-col>
      <ion-col>
        ion-col
        <br>#
      </ion-col>
      <ion-col>
        ion-col
        <br>#
        <br>#
      </ion-col>
      <ion-col>
        ion-col
        <br>#
        <br>#
        <br>#
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col align-self-start>
        ion-col [start]
      </ion-col>
      <ion-col align-self-center>
        ion-col [center]
      </ion-col>
      <ion-col align-self-end>
        ion-col [end]
      </ion-col>
      <ion-col>
        ion-col
        <br>#
        <br>#
      </ion-col>
    </ion-row>

    <ion-row align-items-start>
      <ion-col>
        [start] ion-col
      </ion-col>
      <ion-col>
        [start] ion-col
      </ion-col>
      <ion-col align-self-end>
        [start] ion-col [end]
      </ion-col>
      <ion-col>
        ion-col
        <br>#
        <br>#
      </ion-col>
    </ion-row>

    <ion-row align-items-center>
      <ion-col>
        [center] ion-col
      </ion-col>
      <ion-col>
        [center] ion-col
      </ion-col>
      <ion-col>
        [center] ion-col
      </ion-col>
      <ion-col>
        ion-col
        <br>#
        <br>#
      </ion-col>
    </ion-row>

    <ion-row align-items-end>
      <ion-col>
        [end] ion-col
      </ion-col>
      <ion-col align-self-start>
        [end] ion-col [start]
      </ion-col>
      <ion-col>
        [end] ion-col
      </ion-col>
      <ion-col>
        ion-col
        <br>#
        <br>#
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col size="12" size-sm>
        ion-col [size="12"] [size-sm]
      </ion-col>
      <ion-col size="12" size-sm>
        ion-col [size="12"] [size-sm]
      </ion-col>
      <ion-col size="12" size-sm>
        ion-col [size="12"] [size-sm]
      </ion-col>
      <ion-col size="12" size-sm>
        ion-col [size="12"] [size-sm]
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col size="12" size-md>
        ion-col [size="12"] [size-md]
      </ion-col>
      <ion-col size="12" size-md>
        ion-col [size="12"] [size-md]
      </ion-col>
      <ion-col size="12" size-md>
        ion-col [size="12"] [size-md]
      </ion-col>
      <ion-col size="12" size-md>
        ion-col [size="12"] [size-md]
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col size="6" size-lg offset="3">
        ion-col [size="6"] [size-lg] [offset="3"]
      </ion-col>
      <ion-col size="3" size-lg>
        ion-col [size="3"] [size-lg]
      </ion-col>
    </ion-row>
  </ion-grid>
</template>
```



## Properties

| Property | Attribute | Description                                                           | Type      | Default |
| -------- | --------- | --------------------------------------------------------------------- | --------- | ------- |
| `fixed`  | `fixed`   | If `true`, the grid will have a fixed width based on the screen size. | `boolean` | `false` |


## CSS Custom Properties

| Name                    | Description                           |
| ----------------------- | ------------------------------------- |
| `--ion-grid-padding`    | Padding for the Grid                  |
| `--ion-grid-padding-lg` | Padding for the Grid on lg screens    |
| `--ion-grid-padding-md` | Padding for the Grid on md screens    |
| `--ion-grid-padding-sm` | Padding for the Grid on sm screens    |
| `--ion-grid-padding-xl` | Padding for the Grid on xl screens    |
| `--ion-grid-padding-xs` | Padding for the Grid on xs screens    |
| `--ion-grid-width`      | Width of the fixed Grid               |
| `--ion-grid-width-lg`   | Width of the fixed Grid on lg screens |
| `--ion-grid-width-md`   | Width of the fixed Grid on md screens |
| `--ion-grid-width-sm`   | Width of the fixed Grid on sm screens |
| `--ion-grid-width-xl`   | Width of the fixed Grid on xl screens |
| `--ion-grid-width-xs`   | Width of the fixed Grid on xs screens |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
