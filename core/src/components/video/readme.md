# ion-video

Video is a tag that will play/pause the video as it hits the desired threshold. The component uses [Intersection Observer](https://caniuse.com/#feat=intersectionobserver) internally, which is supported in most modern browsers.

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-list>
  <ion-item *ngFor="let item of items">
    <ion-video src="item.src"></ion-video>
  </ion-item>
</ion-list>
```


### Javascript

```html
  <ion-video src="https://www.w3schools.com/html/mov_bbb.mp4"></ion-video>
```


### React

```tsx
import React from 'react';
import { IonList, IonItem, IonVideo IonContent } from '@ionic/react';

type Item = {
  src: string;
};
const items: Item[] = [{ src: 'https://www.w3schools.com/html/mov_bbb.mp4' }];

export const VideoExample: React.FunctionComponent = () => (
  <IonContent>
    <IonList>
      {items.map((video, i) => (
        <IonVideo key={i} src={video.src}></IonVideo>
      ))}
    </IonList>
  </IonContent>
);
```


### Vue

```html
<template>
  <ion-list>
    <ion-item v-for="item in items" :key="item.src">
      <ion-video :src="item.src"></ion-video>
    </ion-item>
  </ion-list>
</template>
```



## Properties

| Property    | Attribute | Description                                                           | Type                    | Default     |
| ----------- | --------- | --------------------------------------------------------------------- | ----------------------- | ----------- |
| `loop`      | `loop`    | Determines if the video should loop endlessly. Defaults to true.      | `boolean \| undefined`  | `true`      |
| `src`       | `src`     | The video URL. This attribute is mandatory for the <video> element.   | `string \| undefined`   | `undefined` |
| `threshold` | --        | intersection threshold triggers: >= 0.65 will play < 0.65 will pause. | `number[] \| undefined` | `[0, 0.65]` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
