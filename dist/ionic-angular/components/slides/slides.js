var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, Optional, Output, Renderer, ViewEncapsulation } from '@angular/core';
import { Config } from '../../config/config';
import { enableKeyboardControl } from './swiper/swiper-keyboard';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { initEvents } from './swiper/swiper-events';
import { initZoom } from './swiper/swiper-zoom';
import { Platform } from '../../platform/platform';
import { destroySwiper, initSwiper, slideNext, slidePrev, slideTo, startAutoplay, stopAutoplay, update, } from './swiper/swiper';
import { SWIPER_EFFECTS } from './swiper/swiper-effects';
import { ViewController } from '../../navigation/view-controller';
/**
 * \@name Slides
 * \@description
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
 * \@usage
 *
 * You can add slides to a `\@Component` using the following template:
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
 * import { ViewChild } from '\@angular/core';
 * import { Slides } from 'ionic-angular';
 *
 * class MyPage {
 *   \@ViewChild(Slides) slides: Slides;
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
 * \@advanced
 *
 * There are several options available to create customized slides. Ionic exposes
 * the most commonly used options as [inputs](http://learnangular2.com/inputs/).
 * In order to use an option that isn't exposed as an input the following code
 * should be used, where `freeMode` is the option to change:
 *
 * ```ts
 * import { ViewChild } from '\@angular/core';
 * import { Slides } from 'ionic-angular';
 * class MyPage {
 *   \@ViewChild(Slides) slides: Slides;
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
 * \@demo /docs/demos/src/slides/
 * @see {\@link /docs/components#slides Slides Component Docs}
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
var Slides = (function (_super) {
    __extends(Slides, _super);
    /**
     * @param {?} config
     * @param {?} _plt
     * @param {?} zone
     * @param {?} viewCtrl
     * @param {?} elementRef
     * @param {?} renderer
     */
    function Slides(config, _plt, zone, viewCtrl, elementRef, renderer) {
        var _this = _super.call(this, config, elementRef, renderer, 'slides') || this;
        _this._plt = _plt;
        _this._control = null;
        _this._effectName = 'slide';
        _this._direction = 'horizontal';
        _this._initialSlide = 0;
        _this._isLoop = false;
        _this._pager = false;
        _this._paginationType = 'bullets';
        /**
         * @hidden
         */
        _this.paginationBulletRender = null;
        _this._isParallax = false;
        _this._speedMs = 300;
        _this._isZoom = false;
        /**
         * @hidden
         * Enabled this option and swiper will be operated as usual except it will
         * not move, real translate values on wrapper will not be set. Useful when
         * you may need to create custom slide transition.
         */
        _this.virtualTranslate = false;
        /**
         * @hidden
         * Set to true to round values of slides width and height to prevent blurry
         * texts on usual resolution screens (if you have such)
         */
        _this.roundLengths = false;
        _this._spaceBetween = 0;
        _this._slidesPerView = 1;
        _this._centeredSlides = false;
        /**
         * @hidden
         */
        _this.slidesPerColumn = 1;
        /**
         * @hidden
         */
        _this.slidesPerColumnFill = 'column';
        /**
         * @hidden
         */
        _this.slidesPerGroup = 1;
        /**
         * @hidden
         */
        _this.slidesOffsetBefore = 0;
        /**
         * @hidden
         */
        _this.slidesOffsetAfter = 0;
        /**
         * @hidden
         */
        _this.autoplayDisableOnInteraction = true;
        /**
         * @hidden
         */
        _this.autoplayStopOnLast = false;
        /**
         * @hidden
         */
        _this.freeMode = false;
        /**
         * @hidden
         */
        _this.freeModeMomentum = true;
        /**
         * @hidden
         */
        _this.freeModeMomentumRatio = 1;
        /**
         * @hidden
         */
        _this.freeModeMomentumBounce = true;
        /**
         * @hidden
         */
        _this.freeModeMomentumBounceRatio = 1;
        /**
         * @hidden
         */
        _this.freeModeMomentumVelocityRatio = 1;
        /**
         * @hidden
         */
        _this.freeModeSticky = false;
        /**
         * @hidden
         */
        _this.freeModeMinimumVelocity = 0.02;
        /**
         * @hidden
         */
        _this.autoHeight = false;
        /**
         * @hidden
         */
        _this.setWrapperSize = false;
        /**
         * @hidden
         */
        _this.zoomMax = 3;
        /**
         * @hidden
         */
        _this.zoomMin = 1;
        /**
         * @hidden
         */
        _this.zoomToggle = true;
        /**
         * @hidden
         */
        _this.touchRatio = 1;
        /**
         * @hidden
         */
        _this.touchAngle = 45;
        /**
         * @hidden
         */
        _this.simulateTouch = true;
        /**
         * @hidden
         */
        _this.shortSwipes = true;
        /**
         * @hidden
         */
        _this.longSwipes = true;
        /**
         * @hidden
         */
        _this.longSwipesRatio = 0.5;
        /**
         * @hidden
         */
        _this.longSwipesMs = 300;
        /**
         * @hidden
         */
        _this.followFinger = true;
        /**
         * @hidden
         */
        _this.onlyExternal = false;
        /**
         * @hidden
         */
        _this.threshold = 0;
        /**
         * @hidden
         */
        _this.touchMoveStopPropagation = true;
        /**
         * @hidden
         */
        _this.touchReleaseOnEdges = false;
        /**
         * @hidden
         */
        _this.iOSEdgeSwipeDetection = false;
        /**
         * @hidden
         */
        _this.iOSEdgeSwipeThreshold = 20;
        /**
         * @hidden
         */
        _this.paginationClickable = false;
        /**
         * @hidden
         */
        _this.paginationHide = false;
        /**
         * @hidden
         */
        _this.resistance = true;
        /**
         * @hidden
         */
        _this.resistanceRatio = 0.85;
        /**
         * @hidden
         */
        _this.watchSlidesProgress = false;
        /**
         * @hidden
         */
        _this.watchSlidesVisibility = false;
        /**
         * @hidden
         */
        _this.preventClicks = true;
        /**
         * @hidden
         */
        _this.preventClicksPropagation = true;
        /**
         * @hidden
         */
        _this.slideToClickedSlide = false;
        /**
         * @hidden
         */
        _this.loopAdditionalSlides = 0;
        /**
         * @hidden
         */
        _this.loopedSlides = null;
        /**
         * @hidden
         */
        _this.swipeHandler = null;
        /**
         * @hidden
         */
        _this.noSwiping = true;
        /**
         * @hidden
         */
        _this.runCallbacksOnInit = true;
        // Controller
        _this.controlBy = 'slide';
        _this.controlInverse = false;
        /**
         * @hidden
         */
        _this.keyboardControl = true;
        /**
         * @hidden
         */
        _this.coverflow = {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
        };
        /**
         * @hidden
         */
        _this.flip = {
            slideShadows: true,
            limitRotation: true
        };
        /**
         * @hidden
         */
        _this.cube = {
            slideShadows: true,
            shadow: true,
            shadowOffset: 20,
            shadowScale: 0.94
        };
        /**
         * @hidden
         */
        _this.fade = {
            crossFade: false
        };
        /**
         * @hidden
         */
        _this.prevSlideMessage = 'Previous slide';
        /**
         * @hidden
         */
        _this.nextSlideMessage = 'Next slide';
        /**
         * @hidden
         */
        _this.firstSlideMessage = 'This is the first slide';
        /**
         * @hidden
         */
        _this.lastSlideMessage = 'This is the last slide';
        /**
         * \@output {Slides} Emitted when a slide change starts.
         */
        _this.ionSlideWillChange = new EventEmitter();
        /**
         * \@output {Slides} Emitted when a slide change ends.
         */
        _this.ionSlideDidChange = new EventEmitter();
        /**
         * \@output {Slides} Emitted when a slide moves.
         */
        _this.ionSlideDrag = new EventEmitter();
        /**
         * \@output {Slides} Emitted when slides reaches its beginning (initial position).
         */
        _this.ionSlideReachStart = new EventEmitter();
        /**
         * \@output {Slides} Emitted when slides reaches its last slide.
         */
        _this.ionSlideReachEnd = new EventEmitter();
        /**
         * \@output {Slides} Emitted when a slide moves.
         */
        _this.ionSlideAutoplay = new EventEmitter();
        /**
         * \@output {Slides} Emitted when a autoplay starts.
         */
        _this.ionSlideAutoplayStart = new EventEmitter();
        /**
         * \@output {Slides} Emitted when a autoplay stops.
         */
        _this.ionSlideAutoplayStop = new EventEmitter();
        /**
         * \@output {Slides} Emitted when a slide change starts with the "forward" direction.
         */
        _this.ionSlideNextStart = new EventEmitter();
        /**
         * \@output {Slides} Emitted when a slide change starts with the "backward" direction.
         */
        _this.ionSlidePrevStart = new EventEmitter();
        /**
         * \@output {Slides} Emitted when a slide change ends with the "forward" direction.
         */
        _this.ionSlideNextEnd = new EventEmitter();
        /**
         * \@output {Slides} Emitted when a slide change ends with the "backward" direction.
         */
        _this.ionSlidePrevEnd = new EventEmitter();
        /**
         * \@output {Slides} Emitted when the user taps/clicks on the slide's container.
         */
        _this.ionSlideTap = new EventEmitter();
        /**
         * \@output {Slides} Emitted when the user double taps on the slide's container.
         */
        _this.ionSlideDoubleTap = new EventEmitter();
        /**
         * @hidden
         */
        _this.ionSlideProgress = new EventEmitter();
        /**
         * @hidden
         */
        _this.ionSlideTransitionStart = new EventEmitter();
        /**
         * @hidden
         */
        _this.ionSlideTransitionEnd = new EventEmitter();
        /**
         * @hidden
         */
        _this.ionSlideTouchStart = new EventEmitter();
        /**
         * @hidden
         */
        _this.ionSlideTouchEnd = new EventEmitter();
        _this._unregs = [];
        /**
         * \@internal
         */
        _this._allowSwipeToNext = true;
        /**
         * \@internal
         */
        _this._allowSwipeToPrev = true;
        _this._zone = zone;
        _this.id = ++slidesId;
        _this.slideId = 'slides-' + _this.id;
        _this.setElementClass(_this.slideId, true);
        // only initialize the slides whent the content is ready
        if (viewCtrl) {
            var subscription = viewCtrl.readReady.subscribe(function () {
                subscription.unsubscribe();
                _this._initSlides();
            });
        }
        return _this;
    }
    Object.defineProperty(Slides.prototype, "autoplay", {
        /**
         * \@input {number} Delay between transitions (in milliseconds). If this
         * parameter is not passed, autoplay is disabled. Default does
         * not have a value and does not autoplay.
         * Default: `null`.
         * @return {?}
         */
        get: function () {
            return this._autoplayMs;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._autoplayMs = parseInt(val, 10);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "control", {
        /**
         * \@input {Slides} Pass another Slides instance or array of Slides instances
         * that should be controlled by this Slides instance.
         * Default: `null`.
         * @return {?}
         */
        get: function () {
            return this._control;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            if (val instanceof Slides || Array.isArray(val)) {
                this._control = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "effect", {
        /**
         * \@input {string} The animation effect of the slides.
         * Possible values are: `slide`, `fade`, `cube`, `coverflow` or `flip`.
         * Default: `slide`.
         * @return {?}
         */
        get: function () {
            return this._effectName;
        },
        /**
         * @param {?} effectName
         * @return {?}
         */
        set: function (effectName) {
            if (SWIPER_EFFECTS[effectName]) {
                this._effectName = effectName;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "direction", {
        /**
         * \@input {string}  Swipe direction: 'horizontal' or 'vertical'.
         * Default: `horizontal`.
         * @return {?}
         */
        get: function () {
            return this._direction;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            if (val === 'horizontal' || val === 'vertical') {
                this._direction = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "initialSlide", {
        /**
         * \@input {number}  Index number of initial slide. Default: `0`.
         * @return {?}
         */
        get: function () {
            return this._initialSlide;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._initialSlide = parseInt(val, 10);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "loop", {
        /**
         * \@input {boolean} If true, continuously loop from the last slide to the
         * first slide.
         * @return {?}
         */
        get: function () {
            return this._isLoop;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._isLoop = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "pager", {
        /**
         * \@input {boolean}  If true, show the pager.
         * @return {?}
         */
        get: function () {
            return this._pager;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._pager = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "dir", {
        /**
         * \@input {string} If dir attribute is equal to rtl, set interal _rtl to true;
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._rtl = (val.toLowerCase() === 'rtl');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "paginationType", {
        /**
         * \@input {string}  Type of pagination. Possible values are:
         * `bullets`, `fraction`, `progress`. Default: `bullets`.
         * (Note that the pager will not show unless `pager` input
         * is set to true).
         * @return {?}
         */
        get: function () {
            return this._paginationType;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            if (val === 'bullets' || val === 'fraction' || val === 'progress') {
                this._paginationType = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "parallax", {
        /**
         * \@input {boolean} If true, allows you to use "parallaxed" elements inside of
         * slider.
         * @return {?}
         */
        get: function () {
            return this._isParallax;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._isParallax = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "speed", {
        /**
         * \@input {number} Duration of transition between slides
         * (in milliseconds). Default: `300`.
         * @return {?}
         */
        get: function () {
            return this._speedMs;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._speedMs = parseInt(val, 10);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "zoom", {
        /**
         * \@input {boolean} If true, enables zooming functionality.
         * @return {?}
         */
        get: function () {
            return this._isZoom;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._isZoom = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "spaceBetween", {
        /**
         * \@input {number} Distance between slides in px. Default: `0`.
         * @return {?}
         */
        get: function () {
            return this._spaceBetween;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._spaceBetween = parseInt(val, 10);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "slidesPerView", {
        /**
         * \@input {number} Slides per view. Slides visible at the same time. Default: `1`.
         * @return {?}
         */
        get: function () {
            return this._slidesPerView;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._slidesPerView = val === 'auto' ? 'auto' : parseFloat(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "centeredSlides", {
        /**
         * \@input {boolean} Center a slide in the middle of the screen.
         * @return {?}
         */
        get: function () {
            return this._centeredSlides;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._centeredSlides = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    Slides.prototype._initSlides = function () {
        if (!this._init) {
            (void 0) /* console.debug */;
            var /** @type {?} */ s = this;
            var /** @type {?} */ plt = s._plt;
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
    };
    /**
     * @hidden
     * @return {?}
     */
    Slides.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._plt.timeout(function () {
            _this._initSlides();
        }, 300);
    };
    /**
     * Update the underlying slider implementation. Call this if you've added or removed
     * child slides.
     * @param {?=} debounce
     * @return {?}
     */
    Slides.prototype.update = function (debounce) {
        var _this = this;
        if (debounce === void 0) { debounce = 300; }
        if (this._init) {
            this._plt.cancelTimeout(this._tmr);
            this._tmr = this._plt.timeout(function () {
                update(_this, _this._plt);
                // Don't allow pager to show with > 10 slides
                if (_this.length() > 10) {
                    _this.paginationType = undefined;
                }
            }, debounce);
        }
    };
    /**
     * @return {?}
     */
    Slides.prototype.resize = function () {
        if (this._init) {
        }
    };
    /**
     * Transition to the specified slide.
     *
     * @param {?} index
     * @param {?=} speed
     * @param {?=} runCallbacks
     * @return {?}
     */
    Slides.prototype.slideTo = function (index, speed, runCallbacks) {
        slideTo(this, this._plt, index, speed, runCallbacks);
    };
    /**
     * Transition to the next slide.
     *
     * @param {?=} speed
     * @param {?=} runCallbacks
     * @return {?}
     */
    Slides.prototype.slideNext = function (speed, runCallbacks) {
        slideNext(this, this._plt, runCallbacks, speed, true);
    };
    /**
     * Transition to the previous slide.
     *
     * @param {?=} speed
     * @param {?=} runCallbacks
     * @return {?}
     */
    Slides.prototype.slidePrev = function (speed, runCallbacks) {
        slidePrev(this, this._plt, runCallbacks, speed, true);
    };
    /**
     * Get the index of the active slide.
     *
     * @return {?}
     */
    Slides.prototype.getActiveIndex = function () {
        return this._activeIndex;
    };
    /**
     * Get the index of the previous slide.
     *
     * @return {?}
     */
    Slides.prototype.getPreviousIndex = function () {
        return this._previousIndex;
    };
    /**
     * Get the total number of slides.
     *
     * @return {?}
     */
    Slides.prototype.length = function () {
        return this._slides.length;
    };
    /**
     * Get whether or not the current slide is the last slide.
     *
     * @return {?}
     */
    Slides.prototype.isEnd = function () {
        return this._isEnd;
    };
    /**
     * Get whether or not the current slide is the first slide.
     *
     * @return {?}
     */
    Slides.prototype.isBeginning = function () {
        return this._isBeginning;
    };
    /**
     * Start auto play.
     * @return {?}
     */
    Slides.prototype.startAutoplay = function () {
        startAutoplay(this, this._plt);
    };
    /**
     * Stop auto play.
     * @return {?}
     */
    Slides.prototype.stopAutoplay = function () {
        stopAutoplay(this);
    };
    /**
     * Lock or unlock the ability to slide to the next slides.
     * Set to false to unlock this behaviour.
     * @param {?} shouldLockSwipeToNext
     * @return {?}
     */
    Slides.prototype.lockSwipeToNext = function (shouldLockSwipeToNext) {
        this._allowSwipeToNext = !shouldLockSwipeToNext;
    };
    /**
     * Lock or unlock the ability to slide to the previous slides.
     * Set to false to unlock this behaviour.
     * @param {?} shouldLockSwipeToPrev
     * @return {?}
     */
    Slides.prototype.lockSwipeToPrev = function (shouldLockSwipeToPrev) {
        this._allowSwipeToPrev = !shouldLockSwipeToPrev;
    };
    /**
     * Lock or unlock the ability to slide to change slides.
     * False allows swiping in both directions.
     * @param {?} shouldLockSwipes
     * @return {?}
     */
    Slides.prototype.lockSwipes = function (shouldLockSwipes) {
        this._allowSwipeToNext = this._allowSwipeToPrev = !shouldLockSwipes;
    };
    /**
     * Enable or disable keyboard control.
     * @param {?} shouldEnableKeyboard
     * @return {?}
     */
    Slides.prototype.enableKeyboardControl = function (shouldEnableKeyboard) {
        enableKeyboardControl(this, this._plt, shouldEnableKeyboard);
    };
    /**
     * @hidden
     * @return {?}
     */
    Slides.prototype.ngOnDestroy = function () {
        this._init = false;
        this._unregs.forEach(function (unReg) {
            unReg();
        });
        this._unregs.length = 0;
        destroySwiper(this);
        this.enableKeyboardControl(false);
    };
    return Slides;
}(Ion));
export { Slides };
Slides.decorators = [
    { type: Component, args: [{
                selector: 'ion-slides',
                template: '<div class="swiper-container" [attr.dir]="_rtl? \'rtl\' : null">' +
                    '<div class="swiper-wrapper">' +
                    '<ng-content></ng-content>' +
                    '</div>' +
                    '<div [class.hide]="!pager" class="swiper-pagination"></div>' +
                    '</div>',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
Slides.ctorParameters = function () { return [
    { type: Config, },
    { type: Platform, },
    { type: NgZone, },
    { type: ViewController, decorators: [{ type: Optional },] },
    { type: ElementRef, },
    { type: Renderer, },
]; };
Slides.propDecorators = {
    'autoplay': [{ type: Input },],
    'control': [{ type: Input },],
    'effect': [{ type: Input },],
    'direction': [{ type: Input },],
    'initialSlide': [{ type: Input },],
    'loop': [{ type: Input },],
    'pager': [{ type: Input },],
    'dir': [{ type: Input },],
    'paginationType': [{ type: Input },],
    'parallax': [{ type: Input },],
    'speed': [{ type: Input },],
    'zoom': [{ type: Input },],
    'spaceBetween': [{ type: Input },],
    'slidesPerView': [{ type: Input },],
    'centeredSlides': [{ type: Input },],
    'ionSlideWillChange': [{ type: Output },],
    'ionSlideDidChange': [{ type: Output },],
    'ionSlideDrag': [{ type: Output },],
    'ionSlideReachStart': [{ type: Output },],
    'ionSlideReachEnd': [{ type: Output },],
    'ionSlideAutoplay': [{ type: Output },],
    'ionSlideAutoplayStart': [{ type: Output },],
    'ionSlideAutoplayStop': [{ type: Output },],
    'ionSlideNextStart': [{ type: Output },],
    'ionSlidePrevStart': [{ type: Output },],
    'ionSlideNextEnd': [{ type: Output },],
    'ionSlidePrevEnd': [{ type: Output },],
    'ionSlideTap': [{ type: Output },],
    'ionSlideDoubleTap': [{ type: Output },],
};
function Slides_tsickle_Closure_declarations() {
    /** @type {?} */
    Slides.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Slides.ctorParameters;
    /** @type {?} */
    Slides.propDecorators;
    /** @type {?} */
    Slides.prototype._autoplayMs;
    /** @type {?} */
    Slides.prototype._control;
    /** @type {?} */
    Slides.prototype._effectName;
    /** @type {?} */
    Slides.prototype._direction;
    /** @type {?} */
    Slides.prototype._initialSlide;
    /** @type {?} */
    Slides.prototype._isLoop;
    /** @type {?} */
    Slides.prototype._pager;
    /** @type {?} */
    Slides.prototype._paginationType;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.paginationBulletRender;
    /** @type {?} */
    Slides.prototype._isParallax;
    /** @type {?} */
    Slides.prototype._speedMs;
    /** @type {?} */
    Slides.prototype._isZoom;
    /**
     * @hidden
     * Height of container.
     * @type {?}
     */
    Slides.prototype.height;
    /**
     * @hidden
     * Width of container.
     * @type {?}
     */
    Slides.prototype.width;
    /**
     * @hidden
     * Enabled this option and swiper will be operated as usual except it will
     * not move, real translate values on wrapper will not be set. Useful when
     * you may need to create custom slide transition.
     * @type {?}
     */
    Slides.prototype.virtualTranslate;
    /**
     * @hidden
     * Set to true to round values of slides width and height to prevent blurry
     * texts on usual resolution screens (if you have such)
     * @type {?}
     */
    Slides.prototype.roundLengths;
    /** @type {?} */
    Slides.prototype._spaceBetween;
    /** @type {?} */
    Slides.prototype._slidesPerView;
    /** @type {?} */
    Slides.prototype._centeredSlides;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.slidesPerColumn;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.slidesPerColumnFill;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.slidesPerGroup;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.slidesOffsetBefore;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.slidesOffsetAfter;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.touchEventsTarget;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.autoplayDisableOnInteraction;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.autoplayStopOnLast;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.freeMode;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.freeModeMomentum;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.freeModeMomentumRatio;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.freeModeMomentumBounce;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.freeModeMomentumBounceRatio;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.freeModeMomentumVelocityRatio;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.freeModeSticky;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.freeModeMinimumVelocity;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.autoHeight;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.setWrapperSize;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.zoomMax;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.zoomMin;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.zoomToggle;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.touchRatio;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.touchAngle;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.simulateTouch;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.shortSwipes;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.longSwipes;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.longSwipesRatio;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.longSwipesMs;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.followFinger;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.onlyExternal;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.threshold;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.touchMoveStopPropagation;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.touchReleaseOnEdges;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.iOSEdgeSwipeDetection;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.iOSEdgeSwipeThreshold;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.paginationClickable;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.paginationHide;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.resistance;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.resistanceRatio;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.watchSlidesProgress;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.watchSlidesVisibility;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.preventClicks;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.preventClicksPropagation;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.slideToClickedSlide;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.loopAdditionalSlides;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.loopedSlides;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.swipeHandler;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.noSwiping;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.runCallbacksOnInit;
    /** @type {?} */
    Slides.prototype.controlBy;
    /** @type {?} */
    Slides.prototype.controlInverse;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.keyboardControl;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.coverflow;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.flip;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.cube;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.fade;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.prevSlideMessage;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.nextSlideMessage;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.firstSlideMessage;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.lastSlideMessage;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.originalEvent;
    /**
     * \@output {Slides} Emitted when a slide change starts.
     * @type {?}
     */
    Slides.prototype.ionSlideWillChange;
    /**
     * \@output {Slides} Emitted when a slide change ends.
     * @type {?}
     */
    Slides.prototype.ionSlideDidChange;
    /**
     * \@output {Slides} Emitted when a slide moves.
     * @type {?}
     */
    Slides.prototype.ionSlideDrag;
    /**
     * \@output {Slides} Emitted when slides reaches its beginning (initial position).
     * @type {?}
     */
    Slides.prototype.ionSlideReachStart;
    /**
     * \@output {Slides} Emitted when slides reaches its last slide.
     * @type {?}
     */
    Slides.prototype.ionSlideReachEnd;
    /**
     * \@output {Slides} Emitted when a slide moves.
     * @type {?}
     */
    Slides.prototype.ionSlideAutoplay;
    /**
     * \@output {Slides} Emitted when a autoplay starts.
     * @type {?}
     */
    Slides.prototype.ionSlideAutoplayStart;
    /**
     * \@output {Slides} Emitted when a autoplay stops.
     * @type {?}
     */
    Slides.prototype.ionSlideAutoplayStop;
    /**
     * \@output {Slides} Emitted when a slide change starts with the "forward" direction.
     * @type {?}
     */
    Slides.prototype.ionSlideNextStart;
    /**
     * \@output {Slides} Emitted when a slide change starts with the "backward" direction.
     * @type {?}
     */
    Slides.prototype.ionSlidePrevStart;
    /**
     * \@output {Slides} Emitted when a slide change ends with the "forward" direction.
     * @type {?}
     */
    Slides.prototype.ionSlideNextEnd;
    /**
     * \@output {Slides} Emitted when a slide change ends with the "backward" direction.
     * @type {?}
     */
    Slides.prototype.ionSlidePrevEnd;
    /**
     * \@output {Slides} Emitted when the user taps/clicks on the slide's container.
     * @type {?}
     */
    Slides.prototype.ionSlideTap;
    /**
     * \@output {Slides} Emitted when the user double taps on the slide's container.
     * @type {?}
     */
    Slides.prototype.ionSlideDoubleTap;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.ionSlideProgress;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.ionSlideTransitionStart;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.ionSlideTransitionEnd;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.ionSlideTouchStart;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.ionSlideTouchEnd;
    /**
     * Private properties only useful to this class.
     * ------------------------------------
     * @type {?}
     */
    Slides.prototype._init;
    /** @type {?} */
    Slides.prototype._tmr;
    /** @type {?} */
    Slides.prototype._unregs;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.clickedIndex;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.clickedSlide;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.container;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.id;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.progress;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.realIndex;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.renderedHeight;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.renderedWidth;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.slideId;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.swipeDirection;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.velocity;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._activeIndex;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._allowClick;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._allowSwipeToNext;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._allowSwipeToPrev;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._animating;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._autoplaying;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._autoplayPaused;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._autoplayTimeoutId;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._bullets;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._classNames;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._isBeginning;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._isEnd;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._keyboardUnReg;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._liveRegion;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._paginationContainer;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._previousIndex;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._renderedSize;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._rtl;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._slides;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._snapGrid;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._slidesGrid;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._snapIndex;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._slidesSizesGrid;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._spline;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._supportTouch;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._supportGestures;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._touches;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._touchEvents;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._touchEventsDesktop;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._translate;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._virtualSize;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._wrapper;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._zone;
    /**
     * \@internal
     * @type {?}
     */
    Slides.prototype._zoom;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.nextButton;
    /**
     * @hidden
     * @type {?}
     */
    Slides.prototype.prevButton;
    /** @type {?} */
    Slides.prototype._plt;
}
var /** @type {?} */ slidesId = -1;
//# sourceMappingURL=slides.js.map