# ion-slides

The Slides component is a multi-section container. Each section can be swiped
or dragged between. It contains any number of [Slide](../Slide) components.


Adopted from Swiper.js:
The most modern mobile touch slider and framework with hardware accelerated transitions.

http://www.idangero.us/swiper/

Copyright 2016, Vladimir Kharlampidi
The iDangero.us
http://www.idangero.us/

Licensed under MIT


<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                                                                  | Type      |
| ----------- | ----------- | -------------------------------------------------------------------------------------------- | --------- |
| `mode`      | `mode`      | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.    | `Mode`    |
| `options`   | --          | Options to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options | `any`     |
| `pager`     | `pager`     | If true, show the pagination. Defaults to `false`.                                           | `boolean` |
| `scrollbar` | `scrollbar` | If true, show the scrollbar. Defaults to `false`.                                            | `boolean` |


## Events

| Event                     | Description                                                 |
| ------------------------- | ----------------------------------------------------------- |
| `ionSlideDidChange`       | Emitted after the active slide has changed.                 |
| `ionSlideDoubleTap`       | Emitted when the user double taps on the slide's container. |
| `ionSlideDrag`            | Emitted when the slider is actively being moved.            |
| `ionSlideNextEnd`         | Emitted when the next slide has ended.                      |
| `ionSlideNextStart`       | Emitted when the next slide has started.                    |
| `ionSlidePrevEnd`         | Emitted when the previous slide has ended.                  |
| `ionSlidePrevStart`       | Emitted when the previous slide has started.                |
| `ionSlideReachEnd`        | Emitted when the slider is at the last slide.               |
| `ionSlideReachStart`      | Emitted when the slider is at its initial position.         |
| `ionSlideTap`             | Emitted when the user taps/clicks on the slide's container. |
| `ionSlideTouchEnd`        | Emitted when the user releases the touch.                   |
| `ionSlideTouchStart`      | Emitted when the user first touches the slider.             |
| `ionSlideTransitionEnd`   | Emitted when the slide transition has ended.                |
| `ionSlideTransitionStart` | Emitted when the slide transition has started.              |
| `ionSlideWillChange`      | Emitted before the active slide has changed.                |
| `ionSlidesDidLoad`        | Emitted after Swiper initialization                         |


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

| Name           | Type                  | Description |
| -------------- | --------------------- | ----------- |
| `speed`        | `number | undefined`  |             |
| `runCallbacks` | `boolean | undefined` |             |

#### Returns

Type: `Promise<void>`



### `slidePrev(speed?: number | undefined, runCallbacks?: boolean | undefined) => Promise<void>`

Transition to the previous slide.

#### Parameters

| Name           | Type                  | Description |
| -------------- | --------------------- | ----------- |
| `speed`        | `number | undefined`  |             |
| `runCallbacks` | `boolean | undefined` |             |

#### Returns

Type: `Promise<void>`



### `slideTo(index: number, speed?: number | undefined, runCallbacks?: boolean | undefined) => Promise<void>`

Transition to the specified slide.

#### Parameters

| Name           | Type                  | Description |
| -------------- | --------------------- | ----------- |
| `index`        | `number`              |             |
| `speed`        | `number | undefined`  |             |
| `runCallbacks` | `boolean | undefined` |             |

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




## CSS Custom Properties

| Name                         | Description                                |
| ---------------------------- | ------------------------------------------ |
| `--bullet-background`        | Background of the pagination bullets       |
| `--bullet-background-active` | Background of the active pagination bullet |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
