import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, Optional, Output, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { enableKeyboardControl } from './swiper/swiper-keyboard';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { initEvents } from './swiper/swiper-events';
import { initZoom } from './swiper/swiper-zoom';
import { Platform } from '../../platform/platform';
import { SlideContainer, SlideElement, SlideTouchEvents, SlideTouches, SlideZoom } from './swiper/swiper-interfaces';
import { slideTo, slideNext, slidePrev, update, initSwiper, destroySwiper, startAutoplay, stopAutoplay } from './swiper/swiper';
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
 *     console.log("Current index is", currentIndex);
 *   }
 * }
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
 * [source for slides](https://github.com/driftyco/ionic/blob/master/src/components/slides/slides.ts).
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


  /** @private */
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
   * @private
   * Height of container.
   */
  height: number;

  /**
   * @private
   * Width of container.
   */
  width: number;

  /**
   * @private
   * Enabled this option and swiper will be operated as usual except it will
   * not move, real translate values on wrapper will not be set. Useful when
   * you may need to create custom slide transition.
   */
  virtualTranslate = false;

  /**
   * @private
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
    this._slidesPerView = val === 'auto' ? 'auto' : parseInt(val, 10);
  }
  private _slidesPerView: number|string = 1;

  /**
   * @private
   */
  slidesPerColumn = 1;
  /**
   * @private
   */
  slidesPerColumnFill = 'column';
  /**
   * @private
   */
  slidesPerGroup = 1;
  /**
   * @private
   */
  centeredSlides = false;
  /**
   * @private
   */
  slidesOffsetBefore = 0;
  /**
   * @private
   */
  slidesOffsetAfter = 0;

  /**
   * @private
   */
  touchEventsTarget: 'container';

  // autoplay
  /**
   * @private
   */
  autoplayDisableOnInteraction = true;
  /**
   * @private
   */
  autoplayStopOnLast = false;

  // Free mode
  /**
   * @private
   */
  freeMode = false;
  /**
   * @private
   */
  freeModeMomentum = true;
  /**
   * @private
   */
  freeModeMomentumRatio = 1;
  /**
   * @private
   */
  freeModeMomentumBounce = true;
  /**
   * @private
   */
  freeModeMomentumBounceRatio = 1;
  /**
   * @private
   */
  freeModeMomentumVelocityRatio = 1;
  /**
   * @private
   */
  freeModeSticky = false;
  /**
   * @private
   */
  freeModeMinimumVelocity = 0.02;

  // Autoheight
  /**
   * @private
   */
  autoHeight = false;

  // Set wrapper width
  /**
   * @private
   */
  setWrapperSize = false;

  // Zoom
  /**
   * @private
   */
  zoomMax = 3;
  /**
   * @private
   */
  zoomMin = 1;
  /**
   * @private
   */
  zoomToggle = true;

  // Touches
  /**
   * @private
   */
  touchRatio = 1;
  /**
   * @private
   */
  touchAngle = 45;
  /**
   * @private
   */
  simulateTouch = true;
  /**
   * @private
   */
  shortSwipes = true;
  /**
   * @private
   */
  longSwipes = true;
  /**
   * @private
   */
  longSwipesRatio = 0.5;
  /**
   * @private
   */
  longSwipesMs = 300;
  /**
   * @private
   */
  followFinger = true;
  /**
   * @private
   */
  onlyExternal = false;
  /**
   * @private
   */
  threshold = 0;
  /**
   * @private
   */
  touchMoveStopPropagation = true;
  /**
   * @private
   */
  touchReleaseOnEdges = false;

  // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
  /**
   * @private
   */
  iOSEdgeSwipeDetection = false;
  /**
   * @private
   */
  iOSEdgeSwipeThreshold = 20;

  // Pagination
  /**
   * @private
   */
  paginationClickable = false;
  /**
   * @private
   */
  paginationHide = false;

  // Resistance
  /** @private */
  resistance = true;
  /** @private */
  resistanceRatio = 0.85;

  // Progress
  /** @private */
  watchSlidesProgress = false;
  /** @private */
  watchSlidesVisibility = false;

  // Clicks
  /**
   * @private
   */
  preventClicks = true;
  /**
   * @private
   */
  preventClicksPropagation = true;
  /**
   * @private
   */
  slideToClickedSlide = false;

  // loop
  /**
   * @private
   */
  loopAdditionalSlides = 0;
  /**
   * @private
   */
  loopedSlides: number = null;

  // Swiping/no swiping
  /**
   * @private
   */
  swipeHandler: any = null;
  /**
   * @private
   */
  noSwiping = true;

  // Callbacks
  /** @private */
  runCallbacksOnInit = true;

  // Controller
  controlBy = 'slide';
  controlInverse = false;

  // Keyboard
  /**
   * @private
   */
  keyboardControl = true;

  // Effects
  /**
   * @private
   */
  coverflow = {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true
  };
  /**
   * @private
   */
  flip = {
    slideShadows: true,
    limitRotation: true
  };
  /**
   * @private
   */
  cube = {
    slideShadows: true,
    shadow: true,
    shadowOffset: 20,
    shadowScale: 0.94
  };
  /**
   * @private
   */
  fade = {
    crossFade: false
  };

  // Accessibility
  /**
   * @private
   */
  prevSlideMessage = 'Previous slide';
  /**
   * @private
   */
  nextSlideMessage = 'Next slide';
  /**
   * @private
   */
  firstSlideMessage = 'This is the first slide';
  /**
   * @private
   */
  lastSlideMessage = 'This is the last slide';

  /**
   * @private
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


  /** @private */
  ionSlideProgress: EventEmitter<number> = new EventEmitter();
  /** @private */
  ionSlideTransitionStart: EventEmitter<Slides> = new EventEmitter();
  /** @private */
  ionSlideTransitionEnd: EventEmitter<Slides> = new EventEmitter();
  /** @private */
  ionSlideTouchStart: EventEmitter<TouchEvent> = new EventEmitter();
  /** @private */
  ionSlideTouchEnd: EventEmitter<TouchEvent> = new EventEmitter();

  /**
   * @private
   * Deprecated
   */
  @Input()
  set options(val: any) {
    // Deprecated warning added 2016-12-28
    console.warn('ion-slides "options" has been deprecated. Please use ion-slide\'s input properties instead.');
  }

  /**
   * @private
   * Deprecated: Use "ionSlideWillChange" instead.
   * Added 2016-12-29
   */
  @Output()
  get ionWillChange() {
    console.warn('ion-slides "ionWillChange" has been deprecated, please use "ionSlideWillChange" instead.');
    return new EventEmitter();
  }

  /**
   * @private
   * Deprecated: Use "ionSlideDidChange" instead.
   * Added 2016-12-29
   */
  @Output()
  get ionDidChange() {
    console.warn('ion-slides "ionDidChange" has been deprecated, please use "ionSlideDidChange" instead.');
    return new EventEmitter();
  }

  /**
   * @private
   * Deprecated: Use "ionSlideDrag" instead.
   * Added 2016-12-29
   */
  @Output()
  get ionDrag() {
    console.warn('ion-slides "ionDrag" has been deprecated, please use "ionSlideDrag" instead.');
    return new EventEmitter();
  }

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
  /** @private */
  clickedIndex: number;
  /** @private */
  clickedSlide: SlideElement;
  /** @private */
  container: SlideContainer;
  /** @private */
  id: number;
  /** @private */
  progress: number;
  /** @private */
  realIndex: number;
  /** @private */
  renderedHeight: number;
  /** @private */
  renderedWidth: number;
  /** @private */
  slideId: string;
  /** @private */
  swipeDirection: string;
  /** @private */
  velocity: number;


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

  /** @private */
  nextButton: HTMLElement;
  /** @private */
  prevButton: HTMLElement;



  constructor(config: Config, private _plt: Platform, zone: NgZone, @Optional() viewCtrl: ViewController, elementRef: ElementRef, renderer: Renderer) {
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
   * @private
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
   */
  lockSwipeToNext(shouldLockSwipeToNext: boolean) {
    this._allowSwipeToNext = !shouldLockSwipeToNext;
  }

  /**
   * Lock or unlock the ability to slide to the previous slides.
   */
  lockSwipeToPrev(shouldLockSwipeToPrev: boolean) {
    this._allowSwipeToPrev = !shouldLockSwipeToPrev;
  }

  /**
   * Lock or unlock the ability to slide to change slides.
   */
  lockSwipes(shouldLockSwipes: boolean) {
    this._allowSwipeToNext = this._allowSwipeToPrev = !shouldLockSwipes;
  }

  /**
   * Enable or disable keyboard control.
   */
  enableKeyboardControl(shouldEnableKeyboard: boolean) {
    enableKeyboardControl(this, this._plt, shouldEnableKeyboard);
  }

  /**
   * @private
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


  /**
   * @private
   * Deprecated, please use the instance of ion-slides.
   */
  getSlider(): void {
    // deprecated 2016-12-29
    console.warn(`ion-slides, getSlider() has been removed. Please use the properties and methods on the instance of ion-slides instead.`);
  }
}

let slidesId = -1;
