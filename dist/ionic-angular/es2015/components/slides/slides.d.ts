import { ElementRef, EventEmitter, NgZone, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { Platform } from '../../platform/platform';
import { SlideContainer, SlideElement, SlideTouchEvents, SlideTouches, SlideZoom } from './swiper/swiper-interfaces';
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
export declare class Slides extends Ion {
    private _plt;
    /**
     * @input {number} Delay between transitions (in milliseconds). If this
     * parameter is not passed, autoplay is disabled. Default does
     * not have a value and does not autoplay.
     * Default: `null`.
     */
    autoplay: any;
    private _autoplayMs;
    /**
     * @input {Slides} Pass another Slides instance or array of Slides instances
     * that should be controlled by this Slides instance.
     * Default: `null`.
     */
    control: Slides | Slides[];
    private _control;
    /**
     * @input {string} The animation effect of the slides.
     * Possible values are: `slide`, `fade`, `cube`, `coverflow` or `flip`.
     * Default: `slide`.
     */
    effect: string;
    private _effectName;
    /**
     * @input {string}  Swipe direction: 'horizontal' or 'vertical'.
     * Default: `horizontal`.
     */
    direction: string;
    private _direction;
    /**
     * @input {number}  Index number of initial slide. Default: `0`.
     */
    initialSlide: any;
    private _initialSlide;
    /**
     * @input {boolean} If true, continuously loop from the last slide to the
     * first slide.
     */
    loop: boolean;
    private _isLoop;
    /**
     * @input {boolean}  If true, show the pager.
     */
    pager: boolean;
    private _pager;
    /**
     * @input {string} If dir attribute is equal to rtl, set interal _rtl to true;
     */
    dir: string;
    /**
     * @input {string}  Type of pagination. Possible values are:
     * `bullets`, `fraction`, `progress`. Default: `bullets`.
     * (Note that the pager will not show unless `pager` input
     * is set to true).
     */
    paginationType: string;
    private _paginationType;
    /** @hidden */
    paginationBulletRender: (index?: number, cssClass?: string) => void;
    /**
     * @input {boolean} If true, allows you to use "parallaxed" elements inside of
     * slider.
     */
    parallax: boolean;
    private _isParallax;
    /**
     * @input {number} Duration of transition between slides
     * (in milliseconds). Default: `300`.
     */
    speed: any;
    private _speedMs;
    /**
     * @input {boolean} If true, enables zooming functionality.
     */
    zoom: boolean;
    private _isZoom;
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
    virtualTranslate: boolean;
    /**
     * @hidden
     * Set to true to round values of slides width and height to prevent blurry
     * texts on usual resolution screens (if you have such)
     */
    roundLengths: boolean;
    /**
     * @input {number} Distance between slides in px. Default: `0`.
     */
    spaceBetween: any;
    private _spaceBetween;
    /**
     * @input {number} Slides per view. Slides visible at the same time. Default: `1`.
     */
    slidesPerView: any;
    private _slidesPerView;
    /**
     * @input {boolean} Center a slide in the middle of the screen.
     */
    centeredSlides: boolean;
    private _centeredSlides;
    /**
     * @hidden
     */
    slidesPerColumn: number;
    /**
     * @hidden
     */
    slidesPerColumnFill: string;
    /**
     * @hidden
     */
    slidesPerGroup: number;
    /**
     * @hidden
     */
    slidesOffsetBefore: number;
    /**
     * @hidden
     */
    slidesOffsetAfter: number;
    /**
     * @hidden
     */
    touchEventsTarget: 'container';
    /**
     * @hidden
     */
    autoplayDisableOnInteraction: boolean;
    /**
     * @hidden
     */
    autoplayStopOnLast: boolean;
    /**
     * @hidden
     */
    freeMode: boolean;
    /**
     * @hidden
     */
    freeModeMomentum: boolean;
    /**
     * @hidden
     */
    freeModeMomentumRatio: number;
    /**
     * @hidden
     */
    freeModeMomentumBounce: boolean;
    /**
     * @hidden
     */
    freeModeMomentumBounceRatio: number;
    /**
     * @hidden
     */
    freeModeMomentumVelocityRatio: number;
    /**
     * @hidden
     */
    freeModeSticky: boolean;
    /**
     * @hidden
     */
    freeModeMinimumVelocity: number;
    /**
     * @hidden
     */
    autoHeight: boolean;
    /**
     * @hidden
     */
    setWrapperSize: boolean;
    /**
     * @hidden
     */
    zoomMax: number;
    /**
     * @hidden
     */
    zoomMin: number;
    /**
     * @hidden
     */
    zoomToggle: boolean;
    /**
     * @hidden
     */
    touchRatio: number;
    /**
     * @hidden
     */
    touchAngle: number;
    /**
     * @hidden
     */
    simulateTouch: boolean;
    /**
     * @hidden
     */
    shortSwipes: boolean;
    /**
     * @hidden
     */
    longSwipes: boolean;
    /**
     * @hidden
     */
    longSwipesRatio: number;
    /**
     * @hidden
     */
    longSwipesMs: number;
    /**
     * @hidden
     */
    followFinger: boolean;
    /**
     * @hidden
     */
    onlyExternal: boolean;
    /**
     * @hidden
     */
    threshold: number;
    /**
     * @hidden
     */
    touchMoveStopPropagation: boolean;
    /**
     * @hidden
     */
    touchReleaseOnEdges: boolean;
    /**
     * @hidden
     */
    iOSEdgeSwipeDetection: boolean;
    /**
     * @hidden
     */
    iOSEdgeSwipeThreshold: number;
    /**
     * @hidden
     */
    paginationClickable: boolean;
    /**
     * @hidden
     */
    paginationHide: boolean;
    /** @hidden */
    resistance: boolean;
    /** @hidden */
    resistanceRatio: number;
    /** @hidden */
    watchSlidesProgress: boolean;
    /** @hidden */
    watchSlidesVisibility: boolean;
    /**
     * @hidden
     */
    preventClicks: boolean;
    /**
     * @hidden
     */
    preventClicksPropagation: boolean;
    /**
     * @hidden
     */
    slideToClickedSlide: boolean;
    /**
     * @hidden
     */
    loopAdditionalSlides: number;
    /**
     * @hidden
     */
    loopedSlides: number;
    /**
     * @hidden
     */
    swipeHandler: any;
    /**
     * @hidden
     */
    noSwiping: boolean;
    /** @hidden */
    runCallbacksOnInit: boolean;
    controlBy: string;
    controlInverse: boolean;
    /**
     * @hidden
     */
    keyboardControl: boolean;
    /**
     * @hidden
     */
    coverflow: {
        rotate: number;
        stretch: number;
        depth: number;
        modifier: number;
        slideShadows: boolean;
    };
    /**
     * @hidden
     */
    flip: {
        slideShadows: boolean;
        limitRotation: boolean;
    };
    /**
     * @hidden
     */
    cube: {
        slideShadows: boolean;
        shadow: boolean;
        shadowOffset: number;
        shadowScale: number;
    };
    /**
     * @hidden
     */
    fade: {
        crossFade: boolean;
    };
    /**
     * @hidden
     */
    prevSlideMessage: string;
    /**
     * @hidden
     */
    nextSlideMessage: string;
    /**
     * @hidden
     */
    firstSlideMessage: string;
    /**
     * @hidden
     */
    lastSlideMessage: string;
    /**
     * @hidden
     */
    originalEvent: any;
    /**
     * @output {Slides} Emitted when a slide change starts.
     */
    ionSlideWillChange: EventEmitter<Slides>;
    /**
     * @output {Slides} Emitted when a slide change ends.
     */
    ionSlideDidChange: EventEmitter<Slides>;
    /**
     * @output {Slides} Emitted when a slide moves.
     */
    ionSlideDrag: EventEmitter<Slides>;
    /**
     * @output {Slides} Emitted when slides reaches its beginning (initial position).
     */
    ionSlideReachStart: EventEmitter<Slides>;
    /**
     * @output {Slides} Emitted when slides reaches its last slide.
     */
    ionSlideReachEnd: EventEmitter<Slides>;
    /**
     * @output {Slides} Emitted when a slide moves.
     */
    ionSlideAutoplay: EventEmitter<Slides>;
    /**
     * @output {Slides} Emitted when a autoplay starts.
     */
    ionSlideAutoplayStart: EventEmitter<Slides>;
    /**
     * @output {Slides} Emitted when a autoplay stops.
     */
    ionSlideAutoplayStop: EventEmitter<Slides>;
    /**
     * @output {Slides} Emitted when a slide change starts with the "forward" direction.
     */
    ionSlideNextStart: EventEmitter<Slides>;
    /**
     * @output {Slides} Emitted when a slide change starts with the "backward" direction.
     */
    ionSlidePrevStart: EventEmitter<Slides>;
    /**
     * @output {Slides} Emitted when a slide change ends with the "forward" direction.
     */
    ionSlideNextEnd: EventEmitter<Slides>;
    /**
     * @output {Slides} Emitted when a slide change ends with the "backward" direction.
     */
    ionSlidePrevEnd: EventEmitter<Slides>;
    /**
     * @output {Slides} Emitted when the user taps/clicks on the slide's container.
     */
    ionSlideTap: EventEmitter<Slides>;
    /**
     * @output {Slides} Emitted when the user double taps on the slide's container.
     */
    ionSlideDoubleTap: EventEmitter<Slides>;
    /** @hidden */
    ionSlideProgress: EventEmitter<number>;
    /** @hidden */
    ionSlideTransitionStart: EventEmitter<Slides>;
    /** @hidden */
    ionSlideTransitionEnd: EventEmitter<Slides>;
    /** @hidden */
    ionSlideTouchStart: EventEmitter<TouchEvent>;
    /** @hidden */
    ionSlideTouchEnd: EventEmitter<TouchEvent>;
    /**
     * Private properties only useful to this class.
     * ------------------------------------
     */
    private _init;
    private _tmr;
    private _unregs;
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
    _allowSwipeToNext: boolean;
    /** @internal */
    _allowSwipeToPrev: boolean;
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
    constructor(config: Config, _plt: Platform, zone: NgZone, viewCtrl: ViewController, elementRef: ElementRef, renderer: Renderer);
    private _initSlides();
    /**
     * @hidden
     */
    ngAfterContentInit(): void;
    /**
     * Update the underlying slider implementation. Call this if you've added or removed
     * child slides.
     */
    update(debounce?: number): void;
    resize(): void;
    /**
     * Transition to the specified slide.
     *
     * @param {number} index  The index number of the slide.
     * @param {number} [speed]  Transition duration (in ms).
     * @param {boolean} [runCallbacks] Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
     */
    slideTo(index: number, speed?: number, runCallbacks?: boolean): void;
    /**
     * Transition to the next slide.
     *
     * @param {number} [speed]  Transition duration (in ms).
     * @param {boolean} [runCallbacks]  Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
     */
    slideNext(speed?: number, runCallbacks?: boolean): void;
    /**
     * Transition to the previous slide.
     *
     * @param {number} [speed]  Transition duration (in ms).
     * @param {boolean} [runCallbacks]  Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
     */
    slidePrev(speed?: number, runCallbacks?: boolean): void;
    /**
     * Get the index of the active slide.
     *
     * @returns {number} The index number of the current slide.
     */
    getActiveIndex(): number;
    /**
     * Get the index of the previous slide.
     *
     * @returns {number} The index number of the previous slide.
     */
    getPreviousIndex(): number;
    /**
     * Get the total number of slides.
     *
     * @returns {number} The total number of slides.
     */
    length(): number;
    /**
     * Get whether or not the current slide is the last slide.
     *
     * @returns {boolean} If the slide is the last slide or not.
     */
    isEnd(): boolean;
    /**
     * Get whether or not the current slide is the first slide.
     *
     * @returns {boolean} If the slide is the first slide or not.
     */
    isBeginning(): boolean;
    /**
     * Start auto play.
     */
    startAutoplay(): void;
    /**
     * Stop auto play.
     */
    stopAutoplay(): void;
    /**
     * Lock or unlock the ability to slide to the next slides.
     * @param {boolean} shouldLockSwipeToNext If set to true the user will not be able to swipe to the next slide.
     * Set to false to unlock this behaviour.
     */
    lockSwipeToNext(shouldLockSwipeToNext: boolean): void;
    /**
     * Lock or unlock the ability to slide to the previous slides.
     * @param {boolean} shouldLockSwipeToPrev If set to true the user will not be able to swipe to the previous slide.
     * Set to false to unlock this behaviour.
     */
    lockSwipeToPrev(shouldLockSwipeToPrev: boolean): void;
    /**
     * Lock or unlock the ability to slide to change slides.
     * @param {boolean} shouldLockSwipes If set to true user can not swipe in either direction on slide.
     * False allows swiping in both directions.
     */
    lockSwipes(shouldLockSwipes: boolean): void;
    /**
     * Enable or disable keyboard control.
     * @param {boolean} shouldEnableKeyboard If set to true the slider can be controled by a keyboard.
     */
    enableKeyboardControl(shouldEnableKeyboard: boolean): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
}
