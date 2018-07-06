import { Component, Element, Event, EventEmitter, Method, Prop, Watch } from '@stencil/core';
import { Mode } from '../../interface.js';
import { createThemedClasses } from '../../utils/theme.js';
import { Swiper }  from './vendor/swiper.js';

@Component({
  tag: 'ion-slides',
  styleUrls: {
    ios: 'slides.ios.scss',
    md: 'slides.md.scss'
  },
  assetsDir: 'vendor',
  shadow: true
})
export class Slides {
  private container!: HTMLElement;
  private swiper: any;

  mode!: Mode;

  @Element() el!: HTMLStencilElement;

  /**
   * Emitted before the active slide has changed.
   */
  @Event() ionSlideWillChange!: EventEmitter;

  /**
   * Emitted after the active slide has changed.
   */
  @Event() ionSlideDidChange!: EventEmitter;

  /**
   * Emitted when the next slide has started.
   */
  @Event() ionSlideNextStart!: EventEmitter;

  /**
   * Emitted when the previous slide has started.
   */
  @Event() ionSlidePrevStart!: EventEmitter;

  /**
   * Emitted when the next slide has ended.
   */
  @Event() ionSlideNextEnd!: EventEmitter;

  /**
   * Emitted when the previous slide has ended.
   */
  @Event() ionSlidePrevEnd!: EventEmitter;

  /**
   * Emitted when the slide transition has started.
   */
  @Event() ionSlideTransitionStart!: EventEmitter;

  /**
   * Emitted when the slide transition has ended.
   */
  @Event() ionSlideTransitionEnd!: EventEmitter;

  /**
   * Emitted when the slider is actively being moved.
   */
  @Event() ionSlideDrag!: EventEmitter;

  /**
   * Emitted when the slider is at its initial position.
   */
  @Event() ionSlideReachStart!: EventEmitter;

  /**
   * Emitted when the slider is at the last slide.
   */
  @Event() ionSlideReachEnd!: EventEmitter;

  /**
   * Emitted when the user first touches the slider.
   */
  @Event() ionSlideTouchStart!: EventEmitter;

  /**
   * Emitted when the user releases the touch.
   */
  @Event() ionSlideTouchEnd!: EventEmitter;

  /**
   * Options to pass to the swiper instance.
   * See http://idangero.us/swiper/api/ for valid options
   */
  @Prop() options: any; // SwiperOptions;  // TODO

  @Watch('options')
  updateSwiperOptions() {
    const newOptions = this.normalizeOptions();
    this.swiper.params = Object.assign({}, this.swiper.params, newOptions);
    this.update();
  }

  /**
   * If true, show the pagination. Defaults to `false`.
   */
  @Prop() pager = false;

  /**
   * If true, show the scrollbar. Defaults to `false`.
   */
  @Prop() scrollbar = false;

  componentDidLoad() {
    setTimeout(this.initSlides.bind(this), 10);
  }

  componentDidUnload() {
    this.swiper.destroy(true, true);
  }

  private initSlides() {
    console.debug(`ion-slides, init`);
    this.container = (this.el.shadowRoot || this.el).querySelector('.swiper-container') as HTMLElement;
    const finalOptions = this.normalizeOptions();
    // init swiper core
    this.swiper = new Swiper(this.container, finalOptions);
  }

  /**
   * Update the underlying slider implementation. Call this if you've added or removed
   * child slides.
   */
  @Method()
  update() {
    this.swiper.update();
  }

  /**
   * Transition to the specified slide.
   */
  @Method()
  slideTo(index: number, speed?: number, runCallbacks?: boolean) {
    this.swiper.slideTo(index, speed, runCallbacks);
  }

  /**
   * Transition to the next slide.
   */
  @Method()
  slideNext(speed?: number, runCallbacks?: boolean) {
    this.swiper.slideNext(runCallbacks, speed);
  }

  /**
   * Transition to the previous slide.
   */
  @Method()
  slidePrev(speed?: number, runCallbacks?: boolean) {
    this.swiper.slidePrev(runCallbacks, speed);
  }

  /**
   * Get the index of the active slide.
   */
  @Method()
  getActiveIndex(): number {
    return this.swiper.activeIndex;
  }

  /**
   * Get the index of the previous slide.
   */
  @Method()
  getPreviousIndex(): number {
    return this.swiper.previousIndex;
  }

  /**
   * Get the total number of slides.
   */
  @Method()
  length(): number {
    return this.swiper.slides.length;
  }

  /**
   * Get whether or not the current slide is the last slide.
   *
   */
  @Method()
  isEnd(): boolean {
    return this.swiper.isEnd;
  }

  /**
   * Get whether or not the current slide is the first slide.
   */
  @Method()
  isBeginning(): boolean {
    return this.swiper.isBeginning;
  }

  /**
   * Start auto play.
   */
  @Method()
  startAutoplay(): void {
    this.swiper.autoplay.start();
  }

  /**
   * Stop auto play.
   */
  @Method()
  stopAutoplay(): void {
    this.swiper.autoplay.stop();
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

  private normalizeOptions() {
    // Base options, can be changed
    const swiperOptions = {
      effect: 'slide',
      direction: 'horizontal',
      initialSlide: 0,
      loop: false,
      pager: false,
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },
      parallax: false,
      scrollbar: {
        el: '.swiper-scrollbar',
        hide: true,
      },
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
    const eventOptions = {
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
    return Object.assign({}, swiperOptions, this.options, eventOptions);
  }

  hostData() {
    return {
      class: createThemedClasses(this.mode, 'slides')
    };
  }

  render() {
    return (
      <div class="swiper-container" ref={ (el) => this.container = el as HTMLElement }>
        <div class="swiper-wrapper">
          <slot></slot>
        </div>
        { this.pager ? <div class="swiper-pagination"></div> : null }
        { this.scrollbar ? <div class="swiper-scrollbar"></div> : null }
      </div>
    );
  }
}
