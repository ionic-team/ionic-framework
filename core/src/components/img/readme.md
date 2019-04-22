# ion-img

Img is a tag that will lazily load an image when ever the tag is in the viewport. This is extremely useful when generating a large list as images are only loaded when they're visible. The component uses [Intersection Observer](https://caniuse.com/#feat=intersectionobserver) internally, which is supported in most modern browser, but falls back to a `setTimeout` when it is not supported.


<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-list>
  <ion-item *ngFor="let item of items">
    <ion-thumbnail slot="start">
      <ion-img [src]="item.src"></ion-img>
    </ion-thumbnail>
    <ion-label>{{item.text}}</ion-label>
  </ion-item>
</ion-list>
```


### React

```tsx
import React from 'react';

import { IonList, IonItem, IonThumbnail, IonImg, IonLabel } from '@ionic/react';

type Item = {
  src: string;
  text: string
};
const items: Item[] = [];

const Example: React.SFC<{}> = () => (

  <IonList>
    {items.map(({src, text}) =>
      <IonItem>
        <IonThumbnail slot="start">
          <IonImg src={src}></IonImg>
        </IonThumbnail>
        <IonLabel>{text}}</IonLabel>
      </IonItem>
    )}
  </IonList>
);

export default Example


### Vue

```html
<template>
  <ion-list>
    <ion-item v-for="item in items" :key="item.src">
      <ion-thumbnail slot="start">
        <ion-img :src="item.src"></ion-img>
      </ion-thumbnail>
      <ion-label>{{item.text}}</ion-label>
    </ion-item>
  </ion-list>
</template>
```



## Properties

| Property | Attribute | Description                                                                                                                                                                                                              | Type                  | Default     |
| -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ----------- |
| `alt`    | `alt`     | This attribute defines the alternative text describing the image. Users will see this text displayed if the image URL is wrong, the image is not in one of the supported formats, or if the image is not yet downloaded. | `string \| undefined` | `undefined` |
| `src`    | `src`     | The image URL. This attribute is mandatory for the <img> element.                                                                                                                                                        | `string \| undefined` | `undefined` |


## Events

| Event           | Description                           | Type                |
| --------------- | ------------------------------------- | ------------------- |
| `ionError`      | Emitted when the img fails to load    | `CustomEvent<void>` |
| `ionImgDidLoad` | Emitted when the img src has been set | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
