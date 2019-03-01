# ion-item-sliding

A sliding item contains an item that can be dragged to reveal buttons. It requires an [item](../item) component as a child. All options to reveal should be placed in the [item options](../item-options) element.


### Swipe Direction

By default, the buttons are placed on the `"end"` side. This means that options are revealed when the sliding item is swiped from end to start, i.e. from right to left in LTR, but from left to right in RTL. To place them on the opposite side, so that they are revealed when swiping in the opposite direction, set the `side` attribute to `"start"` on the [`ion-item-options`]((../item-options) element. Up to two `ion-item-options` can be used at the same time in order to reveal two different sets of options depending on the swiping direction.


### Options Layout

By default if an icon is placed with text in the [item option](../item-option), it will display the icon on top of the text, but the icon slot can be changed to any of the following to position it in the option.

| Slot        | description                                                              |
| ----------- | ------------------------------------------------------------------------ |
| `start`     | In LTR, start is the left side of the button, and in RTL it is the right |
| `top`       | The icon is above the text                                               |
| `icon-only` | The icon is the only content of the button                               |
| `bottom`    | The icon is below the text                                               |
| `end`       | In LTR, end is the right side of the button, and in RTL it is the left   |


### Expandable Options

Options can be expanded to take up the full width of the item if you swipe past a certain point. This can be combined with the `ionSwipe` event to call methods on the class.


<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-list>
  <ion-item-sliding>
    <ion-item>
      <ion-label>Item</ion-label>
    </ion-item>
    <ion-item-options side="start">
      <ion-item-option (click)="favorite(item)">Favorite</ion-item-option>
      <ion-item-option color="danger" (click)="share(item)">Share</ion-item-option>
    </ion-item-options>

    <ion-item-options side="end">
      <ion-item-option (click)="unread(item)">Unread</ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</ion-list>
```


### Javascript

```html
<ion-list>
  <ion-item-sliding>
    <ion-item>
      <ion-label>Item</ion-label>
    </ion-item>
    <ion-item-options side="start">
      <ion-item-option onClick="favorite(item)">Favorite</ion-item-option>
      <ion-item-option color="danger" onClick="share(item)">Share</ion-item-option>
    </ion-item-options>

    <ion-item-options side="end">
      <ion-item-option onClick="unread(item)">Unread</ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</ion-list>
```


### React

```tsx
import React from 'react';

import { IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from '@ionic/react';

const Example: React.SFC<{}> = () => (

<IonList>
  <IonItemSliding>
    <IonItem>
      <IonLabel>Item</IonLabel>
    </IonItem>
    <IonItemOptions side="start">
      <IonItemOption onClick={() => {}}>Favorite</IonItemOption>
      <IonItemOption color="danger" onClick={() => {}}>Share</IonItemOption>
    </IonItemOptions>

    <IonItemOptions side="end">
      <IonItemOption onClick={() => {}}>Unread</IonItemOption>
    </IonItemOptions>
  </IonItemSliding>
</IonList>

);

export default Example;
```


### Vue

```html
<template>
  <ion-list>
    <ion-item-sliding>
      <ion-item>
        <ion-label>Item</ion-label>
      </ion-item>
      <ion-item-options side="start">
        <ion-item-option @click="favorite(item)">Favorite</ion-item-option>
        <ion-item-option color="danger" @click="share(item)">Share</ion-item-option>
      </ion-item-options>

      <ion-item-options side="end">
        <ion-item-option @click="unread(item)">Unread</ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
</template>
```



## Properties

| Property   | Attribute  | Description                                                | Type      | Default |
| ---------- | ---------- | ---------------------------------------------------------- | --------- | ------- |
| `disabled` | `disabled` | If `true`, the user cannot interact with the sliding-item. | `boolean` | `false` |


## Events

| Event     | Description                                | Type                |
| --------- | ------------------------------------------ | ------------------- |
| `ionDrag` | Emitted when the sliding position changes. | `CustomEvent<void>` |


## Methods

### `close() => Promise<void>`

Close the sliding item. Items can also be closed from the [List](../../list/List).

#### Returns

Type: `Promise<void>`



### `closeOpened() => Promise<boolean>`

Close all of the sliding items in the list. Items can also be closed from the [List](../../list/List).

#### Returns

Type: `Promise<boolean>`



### `getOpenAmount() => Promise<number>`

Get the amount the item is open in pixels.

#### Returns

Type: `Promise<number>`



### `getSlidingRatio() => Promise<number>`

Get the ratio of the open amount of the item compared to the width of the options.
If the number returned is positive, then the options on the right side are open.
If the number returned is negative, then the options on the left side are open.
If the absolute value of the number is greater than 1, the item is open more than
the width of the options.

#### Returns

Type: `Promise<number>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
