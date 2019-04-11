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

## Custom Animations

By default, Ionic ships with the slide animation effect built in. Custom animations can be provided via the `options` prop:

```typescript
  const slidesOpts = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) tx -= swiper.translate;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      }
    }
  }    
```

There are additional examples for the [fade](https://github.com/ionic-team/ionic/tree/master/core/src/components/slides/test/custom-fade), [flip](https://github.com/ionic-team/ionic/tree/master/core/src/components/slides/test/custom-flip), [coverflow](https://github.com/ionic-team/ionic/tree/master/core/src/components/slides/test/custom-coverflow), and [cube](https://github.com/ionic-team/ionic/tree/master/core/src/components/slides/test/custom-cube) effects in the framework repository.


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
    initialSlide: 1
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
  initialSlide: 1
}
```


### React

```tsx
import React from 'react';

import { IonSlides, IonSlide } from '@ionic/react';

const slideOpts = {
  initialSlide: 1
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
      initialSlide: 1
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
