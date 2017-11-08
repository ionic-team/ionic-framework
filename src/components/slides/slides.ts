import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, Optional, Output, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { enableKeyboardControl } from './swiper/swiper-keyboard';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { initEvents } from './swiper/swiper-events';
import { initZoom } from './swiper/swiper-zoom';
import { Platform } from '../../platform/platform';
import { SlideContainer, SlideElement, SlideTouchEvents, SlideTouches, SlideZoom } from './swiper/swiper-interfaces';
import {
  destroySwiper,
  initSwiper,
  slideNext,
  slidePrev,
  slideTo,
  startAutoplay,
  stopAutoplay,
  update,
} from './swiper/swiper';
import { SWIPER_EFFECTS } from './swiper/swiper-effects';
import { ViewController } from '../../navigation/view-controller';


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
 * [Slide](../Slide) components, written as `<ion-slide>`. Basic configuration
 * values can be set as input properties, which are listed below. Slides events
 * can also be listened to such as the slide changing by placing the event on the
 * `<ion-slides>` element. See [Usage](#usage) below for more information.
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
 * Next, we can use `ViewChild` to assign the Slides instance to
 * your `slides` property. Now we can call any of the `Slides`
 * [methods](#instance-members), for example we can use the Slide's
 * `slideTo()` method in order to navigate to a specific slide on
 * a button click. Below we call the `goToSlide()` method and it
 * navigates to the 3rd slide:
 *
 * ```ts
 * import { ViewChild } from '@angular/core';
 * import { Slides } from 'ionic-angular';
 *
 * class MyPage {
 *   @ViewChild(Slides) slides: Slides;
 *
 *   goToSlide() {
 *     this.slides.slideTo(2, 500);
 *   }
 * }
 * ```
 *
 * We can also add events to listen to on the `<ion-slides>` element.
 * Let's add the `ionSlideDidChange` event and call a method when the slide changes:
 *
 * ```html
 * <ion-slides (ionSlideDidChange)="slideChanged()">
 * ```
 *
 * In our class, we add the `slideChanged()` method which gets the active
 * index and prints it:
 *
 * ```ts
 * class MyPage {
 *   ...
 *
 *   slideChanged() {
 *     let currentIndex = this.slides.getActiveIndex();
 *     console.log('Current index is', currentIndex);
 *   }
 * }
 * ```
 *
 * ### Zooming
 * If your slides contain images, you can enable zooming on them by setting `zoom="true" and
 * wrapping each image in a `div` with the class `swiper-zoom-container`. Zoom supports
 * `img`, `svg`, `canvas`, and `ion-img`.
 *
 * ```html
 * <ion-slides zoom="true">
 *   <ion-slide>
 *     <div class="swiper-zoom-container">
 *       <img src="assets/img/dog.jpg">
 *     </div>
 *     <ion-label>Woof</ion-label>
 *   </ion-slide>
 *   <ion-slide>
 *     <div class="swiper-zoom-container">
 *       <img src="assets/img/cat.jpg">
 *     </div>
 *     <ion-label>Meow</ion-label>
 *   </ion-slide>
 *   <ion-slide>
 *     <div class="swiper-zoom-container">
 *       <img src="assets/img/fish.jpg">
 *     </div>
 *     <ion-label>Just keep swimming</ion-label>
 *   </ion-slide>
 * </ion-slides>
 * ```
 *
 * @advanced
 *
 * There are several options available to create customized slides. Ionic exposes
 * the most commonly used options as [inputs](http://learnangular2.com/inputs/).
 * In order to use an option that isn't exposed as an input the following code
 * should be used, where `freeMode` is the option to change:
 *
 * ```ts
 * import { ViewChild } from '@angular/core';
 * import { Slides } from 'ionic-angular';

 * class MyPage {
 *   @ViewChild(Slides) slides: Slides;
 *
 *   ngAfterViewInit() {
 *     this.slides.freeMode = true;
 *   }
 * }
 *
 * ```
 *
 * To see all of the available options, take a look at the
 * [source for slides](https://github.com/ionic-team/ionic/blob/master/src/components/slides/slides.ts).
 *
 * @demo /docs/demos/src/slides/
 * @see {@link /docs/components#slides Slides Component Docs}
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
    '<div class="swiper-container" [attr.dir]="_rtl? \'rtl\' : null">' +
      '<div class="swiper-wrapper">' +
        '<ng-content></ng-content>' +
      '</div>' +
      '<div [class.hide]="!pager" class="swiper-pagination"></div>' +
    '</div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Slides extends Ion {

  /**
   * @input {number} Delay between transitions (in milliseconds). If this
   * parameter is not passed, autoplay is disabled. Default does
   * not have a value and does not autoplay.
   * Default: `null`.
   */
  @Input()
  get autoplay() {
    return this._autoplayMs;
  }
  set autoplay(val: any) {
    this._autoplayMs = parseInt(val, 10);
  }
  private _autoplayMs: number;

  /**
   * @input {Slides} Pass another Slides instance or array of Slides instances
   * that should be controlled by this Slides instance.
   * Default: `null`.
   */
  @Input()
  get control() {
    return this._control;
  }
  set control(val: Slides | Slides[]) {
    if (val instanceof Slides || Array.isArray(val)) {
      this._control = val;
    }
  }
  private _control: Slides | Slides[] = null;

  /**
   * @input {string} The animation effect of the slides.
   * Possible values are: `slide`, `fade`, `cube`, `coverflow` or `flip`.
   * Default: `slide`.
   */
  @Input()
  get effect() {
    return this._effectName;
  }
  set effect(effectName: string) {
    if (SWIPER_EFFECTS[effectName]) {
      this._effectName = effectName;
    }
  }
  private _effectName = 'slide';

  /**
   * @input {string}  Swipe direction: 'horizontal' or 'vertical'.
   * Default: `horizontal`.
   */
  @Input()
  get direction() {
    return this._direction;
  }
  set direction(val: string) {
    if (val === 'horizontal' || val === 'vertical') {
      this._direction = val;
    }
  }
  private _direction = 'horizontal';

  /**
   * @input {number}  Index number of initial slide. Default: `0`.
   */
  @Input()
  get initialSlide() {
    return this._initialSlide;
  }
  set initialSlide(val: any) {
    this._initialSlide = parseInt(val, 10);
  }
  private _initialSlide = 0;

  /**
   * @input {boolean} If true, continuously loop from the last slide to the
   * first slide.
   */
  @Input()
  get loop() {
    return this._isLoop;
  }
  set loop(val: boolean) {
    this._isLoop = isTrueProperty(val);
  }
  private _isLoop = false;

  /**
   * @input {boolean}  If true, show the pager.
   */
  @Input()
  get pager() {
    return this._pager;
  }
  set pager(val: boolean) {
    this._pager = isTrueProperty(val);
  }
  private _pager = false;

/**
 * @input {string} If dir attribute is equal to rtl, set interal _rtl to true;
 */
  @Input()
  set dir(val: string) {
    this._rtl = (val.toLowerCase() === 'rtl');
  }

  /**
   * @input {string}  Type of pagination. Possible values are:
   * `bullets`, `fraction`, `progress`. Default: `bullets`.
   * (Note that the pager will not show unless `pager` input
   * is set to true).
   */
  @Input()
  get paginationType() {
    return this._paginationType;
  }
  set paginationType(val: string) {
    if (val === 'bullets' || val === 'fraction' || val === 'progress') {
      this._paginationType = val;
    }
  }
  private _paginationType = 'bullets';


  /** @hidden */
  paginationBulletRender: (index?: number, cssClass?: string) => void = null;

  /**
   * @input {boolean} If true, allows you to use "parallaxed" elements inside of
   * slider.
   */
  @Input()
  get parallax() {
    return this._isParallax;
  }
  set parallax(val: boolean) {
    this._isParallax = isTrueProperty(val);
  }
  private _isParallax = false;

  /**
   * @input {number} Duration of transition between slides
   * (in milliseconds). Default: `300`.
   */
  @Input()
  get speed() {
    return this._speedMs;
  }
  set speed(val: any) {
    this._speedMs = parseInt(val, 10);
  }
  private _speedMs = 300;

  /**
   * @input {boolean} If true, enables zooming functionality.
   */
  @Input()
  get zoom() {
    return this._isZoom;
  }
  set zoom(val: boolean) {
    this._isZoom = isTrueProperty(val);
  }
  private _isZoom = false;

  /**
   * @hidden
   * Height of container.
   */
  height: number;

  /**
   * @hidden
   * Width of container.
   */
  width: number;

  /**
   * @hidden
   * Enabled this option and swiper will be operated as usual except it will
   * not move, real translate values on wrapper will not be set. Useful when
   * you may need to create custom slide transition.
   */
  virtualTranslate = false;

  /**
   * @hidden
   * Set to true to round values of slides width and height to prevent blurry
   * texts on usual resolution screens (if you have such)
   */
  roundLengths = false;

  // Slides grid

  /**
   * @input {number} Distance between slides in px. Default: `0`.
   */
  @Input()
  get spaceBetween() {
    return this._spaceBetween;
  }
  set spaceBetween(val: any) {
    this._spaceBetween = parseInt(val, 10);
  }
  private _spaceBetween = 0;

  /**
   * @input {number} Slides per view. Slides visible at the same time. Default: `1`.
   */
  @Input()
  get slidesPerView() {
    return this._slidesPerView;
  }
  set slidesPerView(val: any) {
    this._slidesPerView = val === 'auto' ? 'auto' : parseFloat(val);
  }
  private _slidesPerView: number|string = 1;

  /**
   * @input {boolean} Center a slide in the middle of the screen.
   */
  @Input()
  get centeredSlides() {
    return this._centeredSlides;
  }
  set centeredSlides(val: boolean) {
    this._centeredSlides = isTrueProperty(val);
  }
  private _centeredSlides: boolean = false;

  /**
   * @hidden
   */
  slidesPerColumn = 1;
  /**
   * @hidden
   */
  slidesPerColumnFill = 'column';
  /**
   * @hidden
   */
  slidesPerGroup = 1;
  /**
   * @hidden
   */
  slidesOffsetBefore = 0;
  /**
   * @hidden
   */
  slidesOffsetAfter = 0;

  /**
   * @hidden
   */
  touchEventsTarget: 'container';

  // autoplay
  /**
   * @hidden
   */
  autoplayDisableOnInteraction = true;
  /**
   * @hidden
   */
  autoplayStopOnLast = false;

  // Free mode
  /**
   * @hidden
   */
  freeMode = false;
  /**
   * @hidden
   */
  freeModeMomentum = true;
  /**
   * @hidden
   */
  freeModeMomentumRatio = 1;
  /**
   * @hidden
   */
  freeModeMomentumBounce = true;
  /**
   * @hidden
   */
  freeModeMomentumBounceRatio = 1;
  /**
   * @hidden
   */
  freeModeMomentumVelocityRatio = 1;
  /**
   * @hidden
   */
  freeModeSticky = false;
  /**
   * @hidden
   */
  freeModeMinimumVelocity = 0.02;

  // Autoheight
  /**
   * @hidden
   */
  autoHeight = false;

  // Set wrapper width
  /**
   * @hidden
   */
  setWrapperSize = false;

  // Zoom
  /**
   * @hidden
   */
  zoomMax = 3;
  /**
   * @hidden
   */
  zoomMin = 1;
  /**
   * @hidden
   */
  zoomToggle = true;

  // Touches
  /**
   * @hidden
   */
  touchRatio = 1;
  /**
   * @hidden
   */
  touchAngle = 45;
  /**
   * @hidden
   */
  simulateTouch = true;
  /**
   * @hidden
   */
  shortSwipes = true;
  /**
   * @hidden
   */
  longSwipes = true;
  /**
   * @hidden
   */
  longSwipesRatio = 0.5;
  /**
   * @hidden
   */
  longSwipesMs = 300;
  /**
   * @hidden
   */
  followFinger = true;
  /**
   * @hidden
   */
  onlyExternal = false;
  /**
   * @hidden
   */
  threshold = 0;
  /**
   * @hidden
   */
  touchMoveStopPropagation = true;
  /**
   * @hidden
   */
  touchReleaseOnEdges = false;

  // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
  /**
   * @hidden
   */
  iOSEdgeSwipeDetection = false;
  /**
   * @hidden
   */
  iOSEdgeSwipeThreshold = 20;

  // Pagination
  /**
   * @hidden
   */
  paginationClickable = false;
  /**
   * @hidden
   */
  paginationHide = false;

  // Resistance
  /** @hidden */
  resistance = true;
  /** @hidden */
  resistanceRatio = 0.85;

  // Progress
  /** @hidden */
  watchSlidesProgress = false;
  /** @hidden */
  watchSlidesVisibility = false;

  // Clicks
  /**
   * @hidden
   */
  preventClicks = true;
  /**
   * @hidden
   */
  preventClicksPropagation = true;
  /**
   * @hidden
   */
  slideToClickedSlide = false;

  // loop
  /**
   * @hidden
   */
  loopAdditionalSlides = 0;
  /**
   * @hidden
   */
  loopedSlides: number = null;

  // Swiping/no swiping
  /**
   * @hidden
   */
  swipeHandler: any = null;
  /**
   * @hidden
   */
  noSwiping = true;

  // Callbacks
  /** @hidden */
  runCallbacksOnInit = true;

  // Controller
  controlBy = 'slide';
  controlInverse = false;

  // Keyboard
  /**
   * @hidden
   */
  keyboardControl = true;

  // Effects
  /**
   * @hidden
   */
  coverflow = {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true
  };
  /**
   * @hidden
   */
  flip = {
    slideShadows: true,
    limitRotation: true
  };
  /**
   * @hidden
   */
  cube = {
    slideShadows: true,
    shadow: true,
    shadowOffset: 20,
    shadowScale: 0.94
  };
  /**
   * @hidden
   */
  fade = {
    crossFade: false
  };

  // Accessibility
  /**
   * @hidden
   */
  prevSlideMessage = 'Previous slide';
  /**
   * @hidden
   */
  nextSlideMessage = 'Next slide';
  /**
   * @hidden
   */
  firstSlideMessage = 'This is the first slide';
  /**
   * @hidden
   */
  lastSlideMessage = 'This is the last slide';

  /**
   * @hidden
   */
  originalEvent: any;

  /**
   * @output {Slides} Emitted when a slide change starts.
   */
  @Output() ionSlideWillChange: EventEmitter<Slides> = new EventEmitter();

  /**
   * @output {Slides} Emitted when a slide change ends.
   */
  @Output() ionSlideDidChange: EventEmitter<Slides> = new EventEmitter();

  /**
   * @output {Slides} Emitted when a slide moves.
   */
  @Output() ionSlideDrag: EventEmitter<Slides> = new EventEmitter();

  /**
   * @output {Slides} Emitted when slides reaches its beginning (initial position).
   */
  @Output() ionSlideReachStart: EventEmitter<Slides> = new EventEmitter();

  /**
   * @output {Slides} Emitted when slides reaches its last slide.
   */
  @Output() ionSlideReachEnd: EventEmitter<Slides> = new EventEmitter();

  /**
   * @output {Slides} Emitted when a slide moves.
   */
  @Output() ionSlideAutoplay: EventEmitter<Slides> = new EventEmitter();

  /**
   * @output {Slides} Emitted when a autoplay starts.
   */
  @Output() ionSlideAutoplayStart: EventEmitter<Slides> = new EventEmitter();

  /**
   * @output {Slides} Emitted when a autoplay stops.
   */
  @Output() ionSlideAutoplayStop: EventEmitter<Slides> = new EventEmitter();

  /**
   * @output {Slides} Emitted when a slide change starts with the "forward" direction.
   */
  @Output() ionSlideNextStart: EventEmitter<Slides> = new EventEmitter();

  /**
   * @output {Slides} Emitted when a slide change starts with the "backward" direction.
   */
  @Output() ionSlidePrevStart: EventEmitter<Slides> = new EventEmitter();

  /**
   * @output {Slides} Emitted when a slide change ends with the "forward" direction.
   */
  @Output() ionSlideNextEnd: EventEmitter<Slides> = new EventEmitter();

  /**
   * @output {Slides} Emitted when a slide change ends with the "backward" direction.
   */
  @Output() ionSlidePrevEnd: EventEmitter<Slides> = new EventEmitter();

  /**
   * @output {Slides} Emitted when the user taps/clicks on the slide's container.
   */
  @Output() ionSlideTap: EventEmitter<Slides> = new EventEmitter();

  /**
   * @output {Slides} Emitted when the user double taps on the slide's container.
   */
  @Output() ionSlideDoubleTap: EventEmitter<Slides> = new EventEmitter();


  /** @hidden */
  ionSlideProgress: EventEmitter<number> = new EventEmitter();
  /** @hidden */
  ionSlideTransitionStart: EventEmitter<Slides> = new EventEmitter();
  /** @hidden */
  ionSlideTransitionEnd: EventEmitter<Slides> = new EventEmitter();
  /** @hidden */
  ionSlideTouchStart: EventEmitter<TouchEvent> = new EventEmitter();
  /** @hidden */
  ionSlideTouchEnd: EventEmitter<TouchEvent> = new EventEmitter();


  /**
   * Private properties only useful to this class.
   * ------------------------------------
   */
  private _init: boolean;
  private _tmr: number;
  private _unregs: Function[] = [];

  /**
   * Properties that are exposed publically but no docs.
   * ------------------------------------
   */
  /** @hidden */
  clickedIndex: number;
  /** @hidden */
  clickedSlide: SlideElement;
  /** @hidden */
  container: SlideContainer;
  /** @hidden */
  id: number;
  /** @hidden */
  progress: number;
  /** @hidden */
  realIndex: number;
  /** @hidden */
  renderedHeight: number;
  /** @hidden */
  renderedWidth: number;
  /** @hidden */
  slideId: string;
  /** @hidden */
  swipeDirection: string;
  /** @hidden */
  velocity: number;
  /** @hidden */
  isTouched: boolean;
  /** @hidden */
  isMoved: boolean;
  /** @hidden */
  allowTouchCallbacks: boolean;
  /** @hidden */
  isScrolling: boolean;


  /**
   * Properties which are for internal use only
   * and not exposed to the public
   * ------------------------------------
   */
  /** @internal */
  _activeIndex: number;
  /** @internal */
  _allowClick: boolean;
  /** @internal */
  _allowSwipeToNext = true;
  /** @internal */
  _allowSwipeToPrev = true;
  /** @internal */
  _animating: boolean;
  /** @internal */
  _autoplaying: boolean;
  /** @internal */
  _autoplayPaused: boolean;
  /** @internal */
  _autoplayTimeoutId: number;
  /** @internal */
  _bullets: HTMLElement[];
  /** @internal */
  _classNames: string[];
  /** @internal */
  _isBeginning: boolean;
  /** @internal */
  _isEnd: boolean;
  /** @internal */
  _keyboardUnReg: Function;
  /** @internal */
  _liveRegion: HTMLElement;
  /** @internal */
  _paginationContainer: HTMLElement;
  /** @internal */
  _previousIndex: number;
  /** @internal */
  _renderedSize: number;
  /** @internal */
  _rtl: boolean;
  /** @internal */
  _slides: SlideElement[];
  /** @internal */
  _snapGrid: any;
  /** @internal */
  _slidesGrid: any;
  /** @internal */
  _snapIndex: number;
  /** @internal */
  _slidesSizesGrid: any;
  /** @internal */
  _spline: any;
  /** @internal */
  _supportTouch: boolean;
  /** @internal */
  _supportGestures: boolean;
  /** @internal */
  _touches: SlideTouches;
  /** @internal */
  _touchEvents: SlideTouchEvents;
  /** @internal */
  _touchEventsDesktop: SlideTouchEvents;
  /** @internal */
  _translate: number;
  /** @internal */
  _virtualSize: any;
  /** @internal */
  _wrapper: HTMLElement;
  /** @internal */
  _zone: NgZone;
  /** @internal */
  _zoom: SlideZoom;

  /** @hidden */
  nextButton: HTMLElement;
  /** @hidden */
  prevButton: HTMLElement;



  constructor(
    config: Config,
    private _plt: Platform,
    zone: NgZone,
    @Optional() viewCtrl: ViewController,
    elementRef: ElementRef,
    renderer: Renderer,
  ) {
    super(config, elementRef, renderer, 'slides');

    this._zone = zone;

    this.id = ++slidesId;
    this.slideId = 'slides-' + this.id;

    this.setElementClass(this.slideId, true);

    // only initialize the slides whent the content is ready
    if (viewCtrl) {
      var subscription = viewCtrl.readReady.subscribe(() => {
        subscription.unsubscribe();
        this._initSlides();
      });
    }
  }

  private _initSlides() {
    if (!this._init) {
      console.debug(`ion-slides, init`);
      var s = this;
      var plt = s._plt;

      s.container = this.getNativeElement().children[0];

      // init swiper core
      initSwiper(s, plt);

      // init core event listeners
      this._unregs.push(initEvents(s, plt));

      if (this.zoom) {
        // init zoom event listeners
        this._unregs.push(initZoom(s, plt));
      }

      if (this.keyboardControl) {
        // init keyboard event listeners
        s.enableKeyboardControl(true);
      }

      this._init = true;
    }
  }

  /**
   * @hidden
   */
  ngAfterContentInit() {
    this._plt.timeout(() => {
      this._initSlides();
    }, 300);
  }

  /**
   * Update the underlying slider implementation. Call this if you've added or removed
   * child slides.
   */
  update(debounce = 300) {
    if (this._init) {
      this._plt.cancelTimeout(this._tmr);
      this._tmr = this._plt.timeout(() => {
        update(this, this._plt);

        // Don't allow pager to show with > 10 slides
        if (this.length() > 10) {
          this.paginationType = undefined;
        }
      }, debounce);
    }
  }

  resize() {
    if (this._init) {

    }
  }

  /**
   * Transition to the specified slide.
   *
   * @param {number} index  The index number of the slide.
   * @param {number} [speed]  Transition duration (in ms).
   * @param {boolean} [runCallbacks] Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
   */
  slideTo(index: number, speed?: number, runCallbacks?: boolean) {
    slideTo(this, this._plt, index, speed, runCallbacks);
  }

  /**
   * Transition to the next slide.
   *
   * @param {number} [speed]  Transition duration (in ms).
   * @param {boolean} [runCallbacks]  Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
   */
  slideNext(speed?: number, runCallbacks?: boolean) {
    slideNext(this, this._plt, runCallbacks, speed, true);
  }

  /**
   * Transition to the previous slide.
   *
   * @param {number} [speed]  Transition duration (in ms).
   * @param {boolean} [runCallbacks]  Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
   */
  slidePrev(speed?: number, runCallbacks?: boolean) {
    slidePrev(this, this._plt, runCallbacks, speed, true);
  }

  /**
   * Get the index of the active slide.
   *
   * @returns {number} The index number of the current slide.
   */
  getActiveIndex(): number {
    return this._activeIndex;
  }

  /**
   * Get the index of the previous slide.
   *
   * @returns {number} The index number of the previous slide.
   */
  getPreviousIndex(): number {
    return this._previousIndex;
  }

  /**
   * Get the total number of slides.
   *
   * @returns {number} The total number of slides.
   */
  length(): number {
    return this._slides.length;
  }

  /**
   * Get whether or not the current slide is the last slide.
   *
   * @returns {boolean} If the slide is the last slide or not.
   */
  isEnd(): boolean {
    return this._isEnd;
  }

  /**
   * Get whether or not the current slide is the first slide.
   *
   * @returns {boolean} If the slide is the first slide or not.
   */
  isBeginning(): boolean {
    return this._isBeginning;
  }

  /**
   * Start auto play.
   */
  startAutoplay() {
    startAutoplay(this, this._plt);
  }

  /**
   * Stop auto play.
   */
  stopAutoplay() {
    stopAutoplay(this);
  }

  /**
   * Lock or unlock the ability to slide to the next slides.
   * @param {boolean} shouldLockSwipeToNext If set to true the user will not be able to swipe to the next slide.
   * Set to false to unlock this behaviour.
   */
  lockSwipeToNext(shouldLockSwipeToNext: boolean) {
    this._allowSwipeToNext = !shouldLockSwipeToNext;
  }

  /**
   * Lock or unlock the ability to slide to the previous slides.
   * @param {boolean} shouldLockSwipeToPrev If set to true the user will not be able to swipe to the previous slide.
   * Set to false to unlock this behaviour.
   */
  lockSwipeToPrev(shouldLockSwipeToPrev: boolean) {
    this._allowSwipeToPrev = !shouldLockSwipeToPrev;
  }

  /**
   * Lock or unlock the ability to slide to change slides.
   * @param {boolean} shouldLockSwipes If set to true user can not swipe in either direction on slide.
   * False allows swiping in both directions.
   */
  lockSwipes(shouldLockSwipes: boolean) {
    this._allowSwipeToNext = this._allowSwipeToPrev = !shouldLockSwipes;
  }

  /**
   * Enable or disable keyboard control.
   * @param {boolean} shouldEnableKeyboard If set to true the slider can be controled by a keyboard.
   */
  enableKeyboardControl(shouldEnableKeyboard: boolean) {
    enableKeyboardControl(this, this._plt, shouldEnableKeyboard);
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    this._init = false;

    this._unregs.forEach(unReg => {
      unReg();
    });
    this._unregs.length = 0;

    destroySwiper(this);

    this.enableKeyboardControl(false);
  }
}

let slidesId = -1;
