import { Component, Element, Event, EventEmitter, Method, Prop, Watch } from '@stencil/core';

import { Mode } from '../../interface.js';

import { Swiper } from './vendor/swiper.js';

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

  private readyResolve: any;
  private readyPromise: Promise<boolean> = new Promise(resolve => { this.readyResolve = resolve; });

  mode!: Mode;

  @Element() el!: HTMLStencilElement;

  /**
   * Emitted after Swiper initialization
   */
  @Event() ionSlidesDidLoad!: EventEmitter;

  /**
   * Emitted when the user taps/clicks on the slide's container.
   */
  @Event() ionSlideTap!: EventEmitter;

  /**
   * Emitted when the user double taps on the slide's container.
   */
  @Event() ionSlideDoubleTap!: EventEmitter;

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
  @Prop() options: any = {}; // SwiperOptions;  // TODO

  @Watch('options')
  updateSwiperOptions() {
    const newOptions = this.normalizeOptions();
    this.swiper.params = { ...this.swiper.params, ...newOptions };
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
    this.container = (this.el.shadowRoot || this.el).querySelector('.swiper-container') as HTMLElement;
    const finalOptions = this.normalizeOptions();
    // init swiper core
    this.swiper = new Swiper(this.container, finalOptions);
    this.readyResolve(true);
  }

  /**
   * Update the underlying slider implementation. Call this if you've added or removed
   * child slides.
   */
  @Method()
  async update() {
    await this.waitUntilReady();
    this.swiper.update();
  }

  /**
   * Transition to the specified slide.
   */
  @Method()
  async slideTo(index: number, speed?: number, runCallbacks?: boolean) {
    await this.waitUntilReady();
    this.swiper.slideTo(index, speed, runCallbacks);
  }

  /**
   * Transition to the next slide.
   */
  @Method()
  async slideNext(speed?: number, runCallbacks?: boolean) {
    await this.waitUntilReady();
    this.swiper.slideNext(speed, runCallbacks);
  }

  /**
   * Transition to the previous slide.
   */
  @Method()
  async slidePrev(speed?: number, runCallbacks?: boolean) {
    await this.waitUntilReady();
    this.swiper.slidePrev(speed, runCallbacks);
  }

  /**
   * Get the index of the active slide.
   */
  @Method()
  async getActiveIndex(): Promise<number> {
    await this.waitUntilReady();
    return Promise.resolve(this.swiper.activeIndex);
  }

  /**
   * Get the index of the previous slide.
   */
  @Method()
  async getPreviousIndex(): Promise<number> {
    await this.waitUntilReady();
    return Promise.resolve(this.swiper.previousIndex);
  }

  /**
   * Get the total number of slides.
   */
  @Method()
  async length(): Promise<number> {
    await this.waitUntilReady();
    return Promise.resolve(this.swiper.slides.length);
  }

  /**
   * Get whether or not the current slide is the last slide.
   *
   */
  @Method()
  async isEnd(): Promise<boolean> {
    await this.waitUntilReady();
    return Promise.resolve(this.swiper.isEnd);
  }

  /**
   * Get whether or not the current slide is the first slide.
   */
  @Method()
  async isBeginning(): Promise<boolean> {
    await this.waitUntilReady();
    return Promise.resolve(this.swiper.isBeginning);
  }

  /**
   * Start auto play.
   */
  @Method()
  async startAutoplay() {
    await this.waitUntilReady();
    this.swiper.autoplay.start();
  }

  /**
   * Stop auto play.
   */
  @Method()
  async stopAutoplay() {
    await this.waitUntilReady();
    this.swiper.autoplay.stop();
  }

  /**
   * Lock or unlock the ability to slide to the next slides.
   */
  @Method()
  async lockSwipeToNext(shouldLockSwipeToNext: boolean) {
    await this.waitUntilReady();
    this.swiper.allowSlideNext = !shouldLockSwipeToNext;
  }

  /**
   * Lock or unlock the ability to slide to the previous slides.
   */
  @Method()
  async lockSwipeToPrev(shouldLockSwipeToPrev: boolean) {
    await this.waitUntilReady();
    this.swiper.allowSlidePrev = !shouldLockSwipeToPrev;
  }

  /**
   * Lock or unlock the ability to slide to change slides.
   */
  @Method()
  async lockSwipes(shouldLockSwipes: boolean) {
    await this.waitUntilReady();
    this.swiper.allowSlideNext = !shouldLockSwipes;
    this.swiper.allowSlidePrev = !shouldLockSwipes;
    this.swiper.allowTouchMove = !shouldLockSwipes;

  }

  /**
   * Calls true if the swiper core is initialized
   */
  private waitUntilReady(): Promise<boolean> {
    return this.readyPromise;
  }

  private normalizeOptions() {
    // Base options, can be changed
    // TODO Add interface SwiperOptions
    const swiperOptions = {
      effect: 'slide',
      direction: 'horizontal',
      initialSlide: 0,
      loop: false,
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: false,
        hideOnClick: false,
      },
      parallax: false,
      scrollbar: {
        el: this.scrollbar ? '.swiper-scrollbar' : undefined,
        hide: true,
      },
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 300,
      slidesPerColumn: 1,
      slidesPerColumnFill: 'column',
      slidesPerGroup: 1,
      centeredSlides: false,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
      touchEventsTarget: 'container',
      autoplay: {
        disableOnInteraction: true,
        stopOnLastSlide: false,
      },
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
      zoom: {
        maxRatio: 3,
        minRatio: 1,
        toggle: true,
      },
      touchRatio: 1,
      touchAngle: 45,
      simulateTouch: true,
      shortSwipes: true,
      longSwipes: true,
      longSwipesRatio: 0.5,
      longSwipesMs: 300,
      followFinger: true,
      threshold: 0,
      touchMoveStopPropagation: true,
      touchReleaseOnEdges: false,
      iOSEdgeSwipeDetection: false,
      iOSEdgeSwipeThreshold: 20,
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
      controller: {
        control: this.swiper,
        by: 'slide',
        inverse: false,
      },
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      },
      flipEffect: {
        slideShadows: true,
        limitRotation: true
      },
      cubeEffect: {
        slideShadows: true,
        shadow: true,
        shadowOffset: 20,
        shadowScale: 0.94
      },
      fadeEffect: {
        crossFade: false
      },
      a11y: {
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
        firstSlideMessage: 'This is the first slide',
        lastSlideMessage: 'This is the last slide'
      }
    };

    // Keep the event options separate, we dont want users
    // overwriting these
    const eventOptions = {
      on: {
        init: () => {
          setTimeout(() => {
            this.ionSlidesDidLoad.emit();
          }, 20);
        },
        slideChangeTransitionStart: this.ionSlideWillChange.emit,
        slideChangeTransitionEnd: this.ionSlideDidChange.emit,
        slideNextTransitionStart: this.ionSlideNextStart.emit,
        slidePrevTransitionStart: this.ionSlidePrevStart.emit,
        slideNextTransitionEnd: this.ionSlideNextEnd.emit,
        slidePrevTransitionEnd: this.ionSlidePrevEnd.emit,
        transitionStart: this.ionSlideTransitionStart.emit,
        transitionEnd: this.ionSlideTransitionEnd.emit,
        sliderMove: this.ionSlideDrag.emit,
        reachBeginning: this.ionSlideReachStart.emit,
        reachEnd: this.ionSlideReachEnd.emit,
        touchStart: this.ionSlideTouchStart.emit,
        touchEnd: this.ionSlideTouchEnd.emit,
        tap: this.ionSlideTap.emit,
        doubleTap: this.ionSlideDoubleTap.emit
      }
    };

    // Merge the base, user options, and events together then pas to swiper
    return { ...swiperOptions, ...this.options, ...eventOptions };
  }

  render() {
    return (
      <div class="swiper-container" ref={el => this.container = el as HTMLElement}>
        <div class="swiper-wrapper">
          <slot></slot>
        </div>
        {this.pager ? <div class="swiper-pagination"></div> : null}
        {this.scrollbar ? <div class="swiper-scrollbar"></div> : null}
      </div>
    );
  }
}
