# ion-slides

The Slides component is a multi-section container. Each section can be swiped
or dragged between. It contains any number of [Slide](../slide) components.


Adopted from Swiper.js:
The most modern mobile touch slider and framework with hardware accelerated transitions.

http://www.idangero.us/swiper/

Copyright 2016, Vladimir Kharlampidi
The iDangero.us
http://www.idangero.us/

Licensed under MIT


<!-- Auto Generated Below -->


## Usage

### Angular

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'slides-example',
  template: `
    <ion-slides pager="true" [options]="slideOpts">
      <ion-slide>
        <h1>Slide 1</h1>
      </ion-slide>
      <ion-slide>
        <h1>Slide 2</h1>
      </ion-slide>
      <ion-slide>
        <h1>Slide 3</h1>
      </ion-slide>
    </ion-slides>
  `
})
export class SlideExample {
  slideOpts = {
    effect: 'flip'
  };
  constructor() {}
}
```


### Javascript

```html
  <ion-slides pager="true">

    <ion-slide>
      <h1>Slide 1</h1>
    </ion-slide>

    <ion-slide>
      <h1>Slide 2</h1>
    </ion-slide>

    <ion-slide>
      <h1>Slide 3</h1>
    </ion-slide>
  </ion-slides>
```

```javascript
var slides = document.querySelector('ion-slides');
slides.options = {
  effect: 'flip'
}
```


### React

```tsx
import React from 'react';

import { IonSlides, IonSlide } from '@ionic/react';

const slideOpts = {
  effect: 'flip'
};

const Example: React.SFC<{}> = () => (
  <IonSlides pager={true} options={slideOpts}>
    <IonSlide>
      <h1>Slide 1</h1>
    </IonSlide>
    <IonSlide>
      <h1>Slide 2</h1>
    </IonSlide>
    <IonSlide>
      <h1>Slide 3</h1>
    </IonSlide>
  </IonSlides>
);

export default Example;
```


### Vue

```html
<template>
  <ion-slides pager="true" :options="slideOpts">
    <ion-slide>
      <h1>Slide 1</h1>
    </ion-slide>
    <ion-slide>
      <h1>Slide 2</h1>
    </ion-slide>
    <ion-slide>
      <h1>Slide 3</h1>
    </ion-slide>
  </ion-slides>
</template>


<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class SelectExample extends Vue {
    slideOpts = {
      effect: 'flip'
    };
  }
</script>
```



## Properties

| Property    | Attribute   | Description                                                                                  | Type            | Default     |
| ----------- | ----------- | -------------------------------------------------------------------------------------------- | --------------- | ----------- |
| `mode`      | `mode`      | The mode determines which platform styles to use.                                            | `"ios" \| "md"` | `undefined` |
| `options`   | `options`   | Options to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options | `any`           | `{}`        |
| `pager`     | `pager`     | If `true`, show the pagination.                                                              | `boolean`       | `false`     |
| `scrollbar` | `scrollbar` | If `true`, show the scrollbar.                                                               | `boolean`       | `false`     |


## Events

| Event                     | Description                                                 | Type                |
| ------------------------- | ----------------------------------------------------------- | ------------------- |
| `ionSlideDidChange`       | Emitted after the active slide has changed.                 | `CustomEvent<void>` |
| `ionSlideDoubleTap`       | Emitted when the user double taps on the slide's container. | `CustomEvent<void>` |
| `ionSlideDrag`            | Emitted when the slider is actively being moved.            | `CustomEvent<void>` |
| `ionSlideNextEnd`         | Emitted when the next slide has ended.                      | `CustomEvent<void>` |
| `ionSlideNextStart`       | Emitted when the next slide has started.                    | `CustomEvent<void>` |
| `ionSlidePrevEnd`         | Emitted when the previous slide has ended.                  | `CustomEvent<void>` |
| `ionSlidePrevStart`       | Emitted when the previous slide has started.                | `CustomEvent<void>` |
| `ionSlideReachEnd`        | Emitted when the slider is at the last slide.               | `CustomEvent<void>` |
| `ionSlideReachStart`      | Emitted when the slider is at its initial position.         | `CustomEvent<void>` |
| `ionSlidesDidLoad`        | Emitted after Swiper initialization                         | `CustomEvent<void>` |
| `ionSlideTap`             | Emitted when the user taps/clicks on the slide's container. | `CustomEvent<void>` |
| `ionSlideTouchEnd`        | Emitted when the user releases the touch.                   | `CustomEvent<void>` |
| `ionSlideTouchStart`      | Emitted when the user first touches the slider.             | `CustomEvent<void>` |
| `ionSlideTransitionEnd`   | Emitted when the slide transition has ended.                | `CustomEvent<void>` |
| `ionSlideTransitionStart` | Emitted when the slide transition has started.              | `CustomEvent<void>` |
| `ionSlideWillChange`      | Emitted before the active slide has changed.                | `CustomEvent<void>` |


## Methods

### `getActiveIndex() => Promise<number>`

Get the index of the active slide.

#### Returns

Type: `Promise<number>`



### `getPreviousIndex() => Promise<number>`

Get the index of the previous slide.

#### Returns

Type: `Promise<number>`



### `isBeginning() => Promise<boolean>`

Get whether or not the current slide is the first slide.

#### Returns

Type: `Promise<boolean>`



### `isEnd() => Promise<boolean>`

Get whether or not the current slide is the last slide.

#### Returns

Type: `Promise<boolean>`



### `length() => Promise<number>`

Get the total number of slides.

#### Returns

Type: `Promise<number>`



### `lockSwipeToNext(shouldLockSwipeToNext: boolean) => Promise<void>`

Lock or unlock the ability to slide to the next slides.

#### Parameters

| Name                    | Type      | Description |
| ----------------------- | --------- | ----------- |
| `shouldLockSwipeToNext` | `boolean` |             |

#### Returns

Type: `Promise<void>`



### `lockSwipeToPrev(shouldLockSwipeToPrev: boolean) => Promise<void>`

Lock or unlock the ability to slide to the previous slides.

#### Parameters

| Name                    | Type      | Description |
| ----------------------- | --------- | ----------- |
| `shouldLockSwipeToPrev` | `boolean` |             |

#### Returns

Type: `Promise<void>`



### `lockSwipes(shouldLockSwipes: boolean) => Promise<void>`

Lock or unlock the ability to slide to change slides.

#### Parameters

| Name               | Type      | Description |
| ------------------ | --------- | ----------- |
| `shouldLockSwipes` | `boolean` |             |

#### Returns

Type: `Promise<void>`



### `slideNext(speed?: number | undefined, runCallbacks?: boolean | undefined) => Promise<void>`

Transition to the next slide.

#### Parameters

| Name           | Type                   | Description |
| -------------- | ---------------------- | ----------- |
| `speed`        | `number \| undefined`  |             |
| `runCallbacks` | `boolean \| undefined` |             |

#### Returns

Type: `Promise<void>`



### `slidePrev(speed?: number | undefined, runCallbacks?: boolean | undefined) => Promise<void>`

Transition to the previous slide.

#### Parameters

| Name           | Type                   | Description |
| -------------- | ---------------------- | ----------- |
| `speed`        | `number \| undefined`  |             |
| `runCallbacks` | `boolean \| undefined` |             |

#### Returns

Type: `Promise<void>`



### `slideTo(index: number, speed?: number | undefined, runCallbacks?: boolean | undefined) => Promise<void>`

Transition to the specified slide.

#### Parameters

| Name           | Type                   | Description |
| -------------- | ---------------------- | ----------- |
| `index`        | `number`               |             |
| `speed`        | `number \| undefined`  |             |
| `runCallbacks` | `boolean \| undefined` |             |

#### Returns

Type: `Promise<void>`



### `startAutoplay() => Promise<void>`

Start auto play.

#### Returns

Type: `Promise<void>`



### `stopAutoplay() => Promise<void>`

Stop auto play.

#### Returns

Type: `Promise<void>`



### `update() => Promise<void>`

Update the underlying slider implementation. Call this if you've added or removed
child slides.

#### Returns

Type: `Promise<void>`



### `updateAutoHeight(speed?: number | undefined) => Promise<void>`

Force swiper to update its height (when autoHeight enabled) for the duration equal to 'speed' parameter

#### Parameters

| Name    | Type                  | Description |
| ------- | --------------------- | ----------- |
| `speed` | `number \| undefined` |             |

#### Returns

Type: `Promise<void>`




## CSS Custom Properties

| Name                         | Description                                |
| ---------------------------- | ------------------------------------------ |
| `--bullet-background`        | Background of the pagination bullets       |
| `--bullet-background-active` | Background of the active pagination bullet |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
