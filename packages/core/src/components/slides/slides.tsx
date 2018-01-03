import { Component, Element, Event, EventEmitter, Method, Prop, PropDidChange } from '@stencil/core';
import { Swiper } from './vendor/swiper.js';
import { SwiperOptions } from './vendor/swiper';

@Component({
  tag: 'ion-slides',
  styleUrl: 'slides.scss',
  assetsDir: 'vendor'
})
export class Slides {

  private container: HTMLElement;
  private init: boolean;
  private tmr: number;
  private swiper: any;
  private finalOptions: any;
  private slidesId: number;
  private slideId: string;

  @Element() private el: HTMLElement;

  /**
   * @output {Event} Emitted before the active slide has changed.
   */
  @Event() ionSlideWillChange: EventEmitter;

  /**
   * @output {Event} Emitted after the active slide has changed.
   */
  @Event() ionSlideDidChange: EventEmitter;

  /**
   * @output {Event} Emitted when the next slide has started.
   */
  @Event() ionSlideNextStart: EventEmitter;

  /**
   * @output {Event} Emitted when the previous slide has started.
   */
  @Event() ionSlidePrevStart: EventEmitter;

  /**
   * @output {Event} Emitted when the next slide has ended.
   */
  @Event() ionSlideNextEnd: EventEmitter;

  /**
   * @output {Event} Emitted when the previous slide has ended.
   */
  @Event() ionSlidePrevEnd: EventEmitter;

  /**
   * @output {Event} Emitted when the slide transition has started.
   */
  @Event() ionSlideTransitionStart: EventEmitter;

  /**
   * @output {Event} Emitted when the slide transition has ended.
   */
  @Event() ionSlideTransitionEnd: EventEmitter;

  /**
   * @output {Event} Emitted when the slider is actively being moved.
   */
  @Event() ionSlideDrag: EventEmitter;

  /**
   * @output {Event} Emitted when the slider is at its initial position.
   */
  @Event() ionSlideReachStart: EventEmitter;

  /**
   * @output {Event} Emitted when the slider is at the last slide.
   */
  @Event() ionSlideReachEnd: EventEmitter;

  /**
   * @output {Event} Emitted when the user first touches the slider.
   */
  @Event() ionSlideTouchStart: EventEmitter;

  /**
   * @output {Event} Emitted when the user releases the touch.
   */
  @Event() ionSlideTouchEnd: EventEmitter;

  /**
   * Options to pass to the swiper instance.
   * See http://idangero.us/swiper/api/ for valid options
   */
  @Prop() options:  SwiperOptions;

  @PropDidChange('options')
  updateSwiperOptions() {
    let newOptions = this.normalizeOptions();
    this.swiper.params = Object.assign({}, this.swiper.params, newOptions);
    this.update();
  }

  /**
   * Show or hide the pager
   */
  @Prop() pager: boolean = true;

  render() {
    return (
      <div class='swiper-container' data-dir='rtl'>
        <div class='swiper-wrapper'>
          <slot />
        </div>
        <div
          class={{
            'swiper-pagination': true,
            hide: !this.pager
          }}
        />
      </div>
    );
  }

  constructor() {
    this.slidesId = ++slidesId;
    this.slideId = 'slides-' + this.slidesId;
  }

  private initSlides() {
    if (!this.init) {
      console.debug(`ion-slides, init`);

      this.container = this.el.children[0] as HTMLElement;

      // init swiper core
      this.swiper = new Swiper(this.container, this.normalizeOptions());

      if (this.options.keyboardControl) {
        // init keyboard event listeners
        this.enableKeyboardControl(true);
      }

      this.init = true;
    }
  }

  normalizeOptions() {
      // Base options, can be changed
      var swiperOptions = {
        effect: 'slide',
        autoplay: 0,
        direction: 'horizontal',
        initialSlide: 0,
        loop: false,
        pager: false,
        pagination: '.swiper-pagination',
        paginationType: 'bullets',
        parallax: false,
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 300,
        zoom: false,
        slidesPerColumn: 1,
        slidesPerColumnFill: 'column',
        slidesPerGroup: 1,
        centeredSlides: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        touchEventsTarget: 'container',
        autoplayDisableOnInteraction: true,
        autoplayStopOnLast: false,
        freeMode: false,
        freeModeMomentum: true,
        freeModeMomentumRatio: 1,
        freeModeMomentumBounce: true,
        freeModeMomentumBounceRatio: 1,
        freeModeMomentumVelocityRatio: 1,
        freeModeSticky: false,
        freeModeMinimumVelocity: 0.02,
        autoHeight: false,
        setWrapperSize: false,
        zoomMax: 3,
        zoomMin: 1,
        zoomToggle: true,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: 0.5,
        longSwipesMs: 300,
        followFinger: true,
        onlyExternal: false,
        threshold: 0,
        touchMoveStopPropagation: true,
        touchReleaseOnEdges: false,
        iOSEdgeSwipeDetection: false,
        iOSEdgeSwipeThreshold: 20,
        paginationClickable: false,
        paginationHide: false,
        resistance: true,
        resistanceRatio: 0.85,
        watchSlidesProgress: false,
        watchSlidesVisibility: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        loopAdditionalSlides: 0,
        noSwiping: true,
        runCallbacksOnInit: true,
        controlBy: 'slide',
        controlInverse: false,
        keyboardControl: true,
        coverflow: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        },
        flip: {
          slideShadows: true,
          limitRotation: true
        },
        cube: {
          slideShadows: true,
          shadow: true,
          shadowOffset: 20,
          shadowScale: 0.94
        },
        fade: {
          crossFade: false
        },
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
        firstSlideMessage: 'This is the first slide',
        lastSlideMessage: 'This is the last slide'
      };

      // Keep the event options separate, we dont want users
      // overwriting these
      var eventOptions = {
        onSlideChangeStart: this.ionSlideWillChange.emit,
        onSlideChangeEnd: this.ionSlideDidChange.emit,
        onSlideNextStart: this.ionSlideNextStart.emit,
        onSlidePrevStart: this.ionSlidePrevStart.emit,
        onSlideNextEnd: this.ionSlideNextEnd.emit,
        onSlidePrevEnd: this.ionSlidePrevEnd.emit,
        onTransitionStart: this.ionSlideTransitionStart.emit,
        onTransitionEnd: this.ionSlideTransitionEnd.emit,
        onSliderMove: this.ionSlideDrag.emit,
        onReachBeginning: this.ionSlideReachStart.emit,
        onReachEnd: this.ionSlideReachEnd.emit,
        onTouchStart: this.ionSlideTouchStart.emit,
        onTouchEnd: this.ionSlideTouchEnd.emit
      };

      // Merge the base, user options, and events together then pas to swiper
      return Object.assign(
        {},
        swiperOptions,
        this.options,
        eventOptions
      );

  }

  componentDidLoad() {
    /**
     * TODO: This should change because currently componentDidLoad fires independent of whether the
     * child components are ready.
     */
    setTimeout(() => {
      this.initSlides();
    }, 10);
  }

  /**
   * Update the underlying slider implementation. Call this if you've added or removed
   * child slides.
   */
  @Method()
  update(debounce = 300) {
    this.swiper.update();
    // if (this.init) {
    //   window.clearTimeout(this.tmr);
    //   this.tmr = window.setTimeout(() => {
    //     this.swiper.update();
    //
    //     // Don't allow pager to show with > 10 slides
    //     if (this.length() > 10) {
    //       this.options.paginationType = undefined;
    //     }
    //   }, debounce);
    // }
  }

  /**
   * Transition to the specified slide.
   *
   * @param {number} index  The index number of the slide.
   * @param {number} [speed]  Transition duration (in ms).
   * @param {boolean} [runCallbacks] Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
   */
  @Method()
  slideTo(index: number, speed?: number, runCallbacks?: boolean) {
    this.swiper.slideTo(index, speed, runCallbacks);
  }

  /**
   * Transition to the next slide.
   *
   * @param {number} [speed]  Transition duration (in ms).
   * @param {boolean} [runCallbacks]  Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
   */
  @Method()
  slideNext(speed?: number, runCallbacks?: boolean) {
    this.swiper.slideNext(runCallbacks, speed);
  }

  /**
   * Transition to the previous slide.
   *
   * @param {number} [speed]  Transition duration (in ms).
   * @param {boolean} [runCallbacks]  Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
   */
  @Method()
  slidePrev(speed?: number, runCallbacks?: boolean) {
    this.swiper.slidePrev(runCallbacks, speed);
  }

  /**
   * Get the index of the active slide.
   *
   * @returns {number} The index number of the current slide.
   */
  @Method()
  getActiveIndex(): number {
    return this.swiper.activeIndex;
  }

  /**
   * Get the index of the previous slide.
   *
   * @returns {number} The index number of the previous slide.
   */
  @Method()
  getPreviousIndex(): number {
    return this.swiper.previousIndex;
  }

  /**
   * Get the total number of slides.
   *
   * @returns {number} The total number of slides.
   */
  @Method()
  length(): number {
    return this.swiper.slides.length;
  }

  /**
   * Get whether or not the current slide is the last slide.
   *
   * @returns {boolean} If the slide is the last slide or not.
   */
  @Method()
  isEnd(): boolean {
    return this.swiper.isEnd;
  }

  /**
   * Get whether or not the current slide is the first slide.
   *
   * @returns {boolean} If the slide is the first slide or not.
   */
  @Method()
  isBeginning(): boolean {
    return this.swiper.isBeginning;
  }

  /**
   * Start auto play.
   */
  @Method()
  startAutoplay(speed?: number): void {
    this.swiper.startAutoplay();
  }

  /**
   * Stop auto play.
   */
  @Method()
  stopAutoplay(): void {
    this.swiper.stopAutoplay();
  }

  /**
   * Lock or unlock the ability to slide to the next slides.
   */
  @Method()
  lockSwipeToNext(shouldLockSwipeToNext: boolean) {
    if (shouldLockSwipeToNext) {
      return this.swiper.lockSwipeToNext();
    }
    this.swiper.unlockSwipeToNext();
  }

  /**
   * Lock or unlock the ability to slide to the previous slides.
   */
  @Method()
  lockSwipeToPrev(shouldLockSwipeToPrev: boolean) {
    if (shouldLockSwipeToPrev) {
      return this.swiper.lockSwipeToPrev();
    }
    this.swiper.unlockSwipeToPrev();
  }

  /**
   * Lock or unlock the ability to slide to change slides.
   */
  @Method()
  lockSwipes(shouldLockSwipes: boolean) {
    if (shouldLockSwipes) {
      return this.swiper.lockSwipes();
    }
    this.swiper.unlockSwipes();
  }

  /**
   * Enable or disable keyboard control.
   */
  enableKeyboardControl(shouldEnableKeyboard: boolean) {
    if (shouldEnableKeyboard) {
      return this.swiper.enableKeyboardControl();
    }
    this.swiper.disableKeyboardControl();
  }

  /**
   * @hidden
   */
  componentDidUnload() {
    this.init = false;

    this.swiper.destroy(true, true);
    this.enableKeyboardControl(false);
  }
}

let slidesId = -1;
