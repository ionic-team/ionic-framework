# ion-video

Video is a tag that will play/pause the video as it hits the desired threshold. The component uses [Intersection Observer](https://caniuse.com/#feat=intersectionobserver) internally, which is supported in most modern browsers.

Requires the following `config.xml` preference

`<preference name=”AllowInlineMediaPlayback” value=”true” />` 

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

| Property        | Attribute        | Description                                                                | Type                   | Default     |
| --------------- | ---------------- | -------------------------------------------------------------------------- | ---------------------- | ----------- |
| `loop`          | `loop`           | Determines if the video should loop endlessly. Defaults to true.           | `boolean \| undefined` | `true`      |
| `playThreshold` | `play-threshold` | Determines at what percent the video should be in the view before playing. | `number \| undefined`  | `undefined` |
| `src`           | `src`            | The video URL. This attribute is mandatory for the <video> element.        | `string \| undefined`  | `undefined` |


## Methods

### `pause() => Promise<void>`

Pauses the video

#### Returns

Type: `Promise<void>`



### `play() => Promise<void>`

Plays the video

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
