import { ChangeDetectionStrategy, Component, Directive, ElementRef, EventEmitter, Input, Output, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { Platform } from '../../platform/platform';
import { SlideContainer, SlideElement, SlideEffects, SlideParams, SlideTouchEvents, SlideTouches } from './swiper/swiper-interfaces';
import { initEvents } from './swiper/swiper-events';
import { slideTo, slideNext, slidePrev, update, swiperInit, swiperDestroy } from './swiper/swiper';
import { enableKeyboardControl } from './swiper/swiper-keyboard';

/**
 * @name Slides
 * @description
 * The Slides component is a multi-section container. Each section can be swiped
 * or dragged between. It contains any number of [Slide](../Slide) components.
 *
 *
 * ### Creating
 * You should use a template to create slides and listen to slide events. The template
 * should contain the slide container, an `<ion-slides>` element, and any number of
 * [Slide](../Slide) components, written as `<ion-slide>`. Any configuration of the
 * slides should be passed in the `options` property of the `<ion-slides>` element.
 * You can listen to events such as the slide changing by placing the event on the
 * `<ion-slides>` element. See [Usage](#usage) below for more information on
 * creating slides.
 *
 *
 * ### Configuring
 * There are several configuration options that can be passed to Slides. These should
 * be passed in the `options` property of the `<ion-slides>` element upon creation.
 * You can allow the slides to loop around from the last to the first, set autoplay
 * on the slides so it will automatically switch between them, and more.
 *
 * Properties to pass in options:
 *
 * | Property              | Type      | Default        | Description                                                                                |
 * |-----------------------|-----------|----------------|--------------------------------------------------------------------------------------------|
 * | autoplay              | `number`  | -              | Delay between transitions (in ms). If this parameter is not passed, autoplay is disabled.  |
 * | direction             | `string`  | 'horizontal'   | Swipe direction: 'horizontal' or 'vertical'.                                               |
 * | initialSlide          | `number`  | 0              | Index number of initial slide                                                              |
 * | loop                  | `boolean` | false          | Whether to continuously loop from the last slide to the first slide.                       |
 * | pager                 | `boolean` | false          | Show the pagination bullets.                                                               |
 * | speed                 | `number`  | 300            | Duration of transition between slides (in ms).                                             |
 *
 * See [Usage](#usage) below for more information on configuring slides.
 *
 *
 * ### Navigating
 * After creating and configuring the slides, you can navigate between them
 * by swiping or calling methods on the `Slides` instance. You can call `slideTo()` to
 * navigate to a specific slide, or `slideNext()` to change to the slide that follows
 * the active slide. All of the [methods](#instance-members) provided by the `Slides`
 * instance are listed below. See [Usage](#usage) below for more information on
 * navigating between slides.
 *
 *
 * ### Limitations
 * The Slides component wraps the [Swiper](http://www.idangero.us/swiper/) component
 * built by iDangero.us. This means that all of the Swiper API isn't exposed on the
 * Slides component. See the [`getSlider()`](#getSlider) method for information on
 * getting the `Swiper` instance and using its methods directly.
 *
 *
 * @usage
 *
 * You can add slides to a `@Component` using the following template:
 *
 * ```html
 * <ion-slides>
 *   <ion-slide>
 *     <h1>Slide 1</h1>
 *   </ion-slide>
 *   <ion-slide>
 *     <h1>Slide 2</h1>
 *   </ion-slide>
 *   <ion-slide>
 *     <h1>Slide 3</h1>
 *   </ion-slide>
 * </ion-slides>
 * ```
 *
 * To add [options](#configuring), we will define them in `mySlideOptions` in our class `MyPage`:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { Slides } from 'ionic-angular';
 *
 * @Component({
 *   templateUrl: 'my-page.html'
 * })
 * class MyPage {
 *   mySlideOptions = {
 *     initialSlide: 1,
 *     loop: true
 *   };
 * }
 * ```
 *
 * This is setting the second slide as the initial slide on load, since
 * the `initialSlide` begins at `0`. We are also setting `loop` to true which
 * allows us to swipe from the last slide to the first continuously. Then,
 * we will pass `mySlideOptions` in the `options` property of the `<ion-slides>`
 * element. We are using [property binding](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#property-binding)
 * on `options` because `mySlideOptions` is an expression:
 *
 * ```html
 * <ion-slides [options]="mySlideOptions">
 * ```
 *
 * To grab a reference to the Slides, we will add a [local template variable](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#local-vars)
 * to `<ion-slides>` called `mySlider`:
 *
 * ```html
 * <ion-slides #mySlider [options]="mySlideOptions">
 * ```
 *
 * Next, we can use `ViewChild` to assign the Slides instance to `slider`:
 *
 * ```ts
 * import { ViewChild } from '@angular/core';
 *
 * class MyPage {
 *   @ViewChild('mySlider') slider: Slides;
 *
 *   ...
 * }
 * ```
 *
 * Now we can call any of the `Slider` [methods](#instance-members),
 * for example we can use the Slider's `slideTo()` method in order to
 * navigate to a specific slide on a button click. Below we call the
 * `goToSlide()` method and it navigates to the 3rd slide:
 *
 * ```ts
 * class MyPage {
 *   ...
 *
 *   goToSlide() {
 *     this.slider.slideTo(2, 500);
 *   }
 * }
 * ```
 *
 * We can also add events to listen to on the `<ion-slides>` element.
 * Let's add the `ionDidChange` event and call a method when the slide changes:
 *
 * ```html
 * <ion-slides #mySlider (ionDidChange)="onSlideChanged()" [options]="mySlideOptions">
 * ```
 *
 * In our class, we add the `onSlideChanged()` method which gets the active
 * index and prints it:
 *
 * ```ts
 * class MyPage {
 *   ...
 *
 *   onSlideChanged() {
 *     let currentIndex = this.slider.getActiveIndex();
 *     console.log("Current index is", currentIndex);
 *   }
 * }
 * ```
 *
 * @demo /docs/v2/demos/src/slides/
 * @see {@link /docs/v2/components#slides Slides Component Docs}
 *
 * Adopted from Swiper.js:
 * The most modern mobile touch slider and framework with
 * hardware accelerated transitions.
 *
 * http://www.idangero.us/swiper/
 *
 * Copyright 2016, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under MIT
 */
@Component({
  selector: 'ion-slides',
  template:
    '<div class="swiper-container">' +
      '<div class="swiper-wrapper">' +
        '<ng-content></ng-content>' +
      '</div>' +
      '<div [class.hide]="!showPager" class="swiper-pagination"></div>' +
    '</div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Slides extends Ion {

  /**
   * @input {Object} Any configuration for the slides
   */
  @Input() options: any;

  /**
   * @private Deprecated
   */
  @Input() pager: any;

  /**
   * @output {any} Expression to evaluate when a slide change starts.
   */
  @Output() ionWillChange: EventEmitter<any> = new EventEmitter();

  /**
   * @output {any} Expression to evaluate when a slide change ends.
   */
  @Output() ionDidChange: EventEmitter<any> = new EventEmitter();

  /**
   * @output {any} Expression to evaluate when a slide moves.
   */
  @Output() ionDrag: EventEmitter<any> = new EventEmitter();

  id: number;
  slideId: string;

  activeIndex: number;
  allowClick: boolean;
  animating: boolean;
  autoplaying: boolean;
  autoplayPaused: boolean;
  autoplayTimeoutId: number;
  bullets: HTMLElement[];
  container: SlideContainer;
  classNames: string[];
  clickedIndex: number;
  clickedSlide: SlideElement;
  disableKeyboardControl: boolean;
  effects: SlideEffects;
  height: number;
  isBeginning: boolean;
  isEnd: boolean;
  liveRegion: HTMLElement;
  loopedSlides: number;
  nextButton: HTMLElement;
  originalParams: SlideParams;
  paginationContainer: HTMLElement;
  params: SlideParams;
  prevButton: HTMLElement;
  previousIndex: number;
  progress: number;
  realIndex: number;
  rtl: boolean;
  slides: SlideElement[];
  snapIndex: number;
  size: number;
  translate: number;
  velocity: number;
  virtualSize: any;
  width: number;
  wrapper: HTMLElement;
  keyboardUnReg: Function;
  swipeDirection: string;
  touchEventsDesktop: SlideTouchEvents;
  touchEvents: SlideTouchEvents;
  supportTouch: boolean;

  currentBreakpoint: any;
  snapGrid: any;
  slidesGrid: any;
  slidesSizesGrid: any;
  touches: SlideTouches;

  ionAutoplay = new EventEmitter();
  ionAutoplayStart = new EventEmitter();
  ionAutoplayStop = new EventEmitter();
  ionReachBeginning = new EventEmitter();
  ionReachEnd = new EventEmitter();
  ionProgress = new EventEmitter();
  ionTransitionStart = new EventEmitter();
  ionSlideChangeStart = new EventEmitter();
  ionSlideNextStart = new EventEmitter();
  ionSlidePrevStart = new EventEmitter();
  ionTransitionEnd = new EventEmitter();
  ionSlideChangeEnd = new EventEmitter();
  ionSlideNextEnd = new EventEmitter();
  ionSlidePrevEnd = new EventEmitter();
  ionSetTransition = new EventEmitter();
  ionSetTranslate = new EventEmitter();
  ionTouchStart = new EventEmitter();
  ionTouchMove = new EventEmitter();
  ionTouchMoveOpposite = new EventEmitter();
  ionSliderMove = new EventEmitter();
  ionTouchEnd = new EventEmitter();
  ionTap = new EventEmitter();
  ionClick = new EventEmitter();
  ionDoubleTap = new EventEmitter();

  private _tmr: number;
  private _init: boolean;
  private _unregs: Function[] = [];


  constructor(config: Config, private _plt: Platform, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'slides');

    this.id = ++slidesId;
    this.slideId = 'slides-' + this.id;

    this.setElementClass(this.slideId, true);

    this.container = this.getNativeElement().children[0];
  }

  /**
   * @private
   */
  ngAfterContentInit() {
    const s = this;
    const plt = s._plt;

    swiperInit(s, plt, {});
    this._unregs.push(initEvents(s, plt));
    // zoom init
    s.enableKeyboardControl(true);

    this._init = true;
  }

  /**
   * @private
   * Update the underlying slider implementation. Call this if you've added or removed
   * child slides.
   */
  update(debounce = 300) {
    if (this._init) {
      this._plt.cancelTimeout(this._tmr);
      this._tmr = this._plt.timeout(() => {
        update(this, this._plt);

        // Don't allow pager to show with > 10 slides
        // if (this.length() > 10) {
        //   this.showPager = false;
        // }
      }, debounce);
    }
  }

  /**
   * Transition to the specified slide.
   *
   * @param {number} index  The index number of the slide.
   * @param {number} [speed]  Transition duration (in ms).
   * @param {boolean} [runCallbacks] Whether or not to emit the `ionWillChange`/`ionDidChange` events. Default true.
   */
  slideTo(index: number, speed?: number, runCallbacks?: boolean) {
    slideTo(this, this._plt, index, speed, runCallbacks);
  }

  /**
   * Transition to the next slide.
   *
   * @param {number} [speed]  Transition duration (in ms).
   * @param {boolean} [runCallbacks]  Whether or not to emit the `ionWillChange`/`ionDidChange` events. Default true.
   */
  slideNext(speed?: number, runCallbacks?: boolean) {
    slideNext(this, this._plt, runCallbacks, speed, true);
  }

  /**
   * Transition to the previous slide.
   *
   * @param {number} [speed]  Transition duration (in ms).
   * @param {boolean} [runCallbacks]  Whether or not to emit the `ionWillChange`/`ionDidChange` events. Default true.
   */
  slidePrev(speed?: number, runCallbacks?: boolean) {
    slidePrev(this, this._plt, runCallbacks, speed, true);
  }

  /**
   * Get the total number of slides.
   *
   * @returns {number} The total number of slides.
   */
  length(): number {
    return this.slides.length;
  }


  /*=========================
    Locks, unlocks
    ===========================*/
  lockSwipeToNext() {
    this.params.allowSwipeToNext = false;
  }

  lockSwipeToPrev() {
    this.params.allowSwipeToPrev = false;
  }

  lockSwipes() {
    this.params.allowSwipeToNext = this.params.allowSwipeToPrev = false;
  }

  unlockSwipeToNext() {
    this.params.allowSwipeToNext = true;
  }

  unlockSwipeToPrev() {
    this.params.allowSwipeToPrev = true;
  }

  unlockSwipes() {
    this.params.allowSwipeToNext = this.params.allowSwipeToPrev = true;
  }

  enableKeyboardControl(shouldEnableKeyboard: boolean) {
    enableKeyboardControl(this, this._plt, shouldEnableKeyboard);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._unregs.forEach(unReg => {
      unReg();
    });
    this._unregs = null;

    swiperDestroy(this, true, true);

    this.enableKeyboardControl(false);
  }

}


 /**
  * @name Slide
  * @description
  * The Slide component is a child component of [Slides](../Slides). The template
  * should be written as `ion-slide`. Any slide content should be written
  * in this component and it should be used in conjunction with [Slides](../Slides).
  *
  * See the [Slides API Docs](../Slides) for more usage information.
  *
  * @demo /docs/v2/demos/src/slides/
  * @see {@link /docs/v2/api/components/slides/Slides/ Slides API Docs}
  */
@Component({
  selector: 'ion-slide',
  template: '<div class="slide-zoom"><ng-content></ng-content></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Slide {

  constructor(
    elementRef: ElementRef,
    renderer: Renderer,
    private _slides: Slides
  ) {
    renderer.setElementClass(elementRef.nativeElement, 'swiper-slide', true);
    _slides.update(0);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._slides.update(0);
  }
}


/**
* @private
*/
@Directive({
  selector: 'slide-lazy',
  host: {
    'class': 'swiper-lazy'
  }
})
export class SlideLazy {}

let slidesId = -1;
