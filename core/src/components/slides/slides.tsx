import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { rIC } from '../../utils/helpers.js';

import { SwiperInterface, SwiperOptions } from './swiper/swiper-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-slides',
  styleUrls: {
    ios: 'slides.ios.scss',
    md: 'slides.md.scss'
  },
  assetsDir: 'swiper',
})
export class Slides implements ComponentInterface {

  private scrollbarEl?: HTMLElement;
  private paginationEl?: HTMLElement;
  private didInit = false;

  private readySwiper!: (swiper: SwiperInterface) => void;
  private swiper: Promise<SwiperInterface> = new Promise(resolve => { this.readySwiper = resolve; });

  @Element() el!: HTMLIonSlidesElement;

  /**
   * Options to pass to the swiper instance.
   * See http://idangero.us/swiper/api/ for valid options
   */
  @Prop() options: any = {}; // SwiperOptions;  // TODO

  @Watch('options')
  async optionsChanged() {
    if (this.didInit) {
      const swiper = await this.getSwiper();
      Object.assign(swiper.params, this.options);
      await this.update();
    }
  }

  /**
   * If `true`, show the pagination.
   */
  @Prop() pager = false;

  /**
   * If `true`, show the scrollbar.
   */
  @Prop() scrollbar = false;

  /**
   * Emitted after Swiper initialization
   */
  @Event() ionSlidesDidLoad!: EventEmitter<void>;

  /**
   * Emitted when the user taps/clicks on the slide's container.
   */
  @Event() ionSlideTap!: EventEmitter<void>;

  /**
   * Emitted when the user double taps on the slide's container.
   */
  @Event() ionSlideDoubleTap!: EventEmitter<void>;

  /**
   * Emitted before the active slide has changed.
   */
  @Event() ionSlideWillChange!: EventEmitter<void>;

  /**
   * Emitted after the active slide has changed.
   */
  @Event() ionSlideDidChange!: EventEmitter<void>;

  /**
   * Emitted when the next slide has started.
   */
  @Event() ionSlideNextStart!: EventEmitter<void>;

  /**
   * Emitted when the previous slide has started.
   */
  @Event() ionSlidePrevStart!: EventEmitter<void>;

  /**
   * Emitted when the next slide has ended.
   */
  @Event() ionSlideNextEnd!: EventEmitter<void>;

  /**
   * Emitted when the previous slide has ended.
   */
  @Event() ionSlidePrevEnd!: EventEmitter<void>;

  /**
   * Emitted when the slide transition has started.
   */
  @Event() ionSlideTransitionStart!: EventEmitter<void>;

  /**
   * Emitted when the slide transition has ended.
   */
  @Event() ionSlideTransitionEnd!: EventEmitter<void>;

  /**
   * Emitted when the slider is actively being moved.
   */
  @Event() ionSlideDrag!: EventEmitter<void>;

  /**
   * Emitted when the slider is at its initial position.
   */
  @Event() ionSlideReachStart!: EventEmitter<void>;

  /**
   * Emitted when the slider is at the last slide.
   */
  @Event() ionSlideReachEnd!: EventEmitter<void>;

  /**
   * Emitted when the user first touches the slider.
   */
  @Event() ionSlideTouchStart!: EventEmitter<void>;

  /**
   * Emitted when the user releases the touch.
   */
  @Event() ionSlideTouchEnd!: EventEmitter<void>;

  componentDidLoad() {
    rIC(() => this.initSwiper());
  }

  async componentDidUnload() {
    const swiper = await this.getSwiper();
    swiper.destroy(true, true);
  }

  @Listen('ionSlideChanged')
  onSlideChanged() {
    if (this.didInit) {
      this.update();
    }
  }

  /**
   * Update the underlying slider implementation. Call this if you've added or removed
   * child slides.
   */
  @Method()
  async update() {
    const swiper = await this.getSwiper();
    swiper.update();
  }

  /**
   * Force swiper to update its height (when autoHeight is enabled) for the duration
   * equal to 'speed' parameter.
   *
   * @param speed The transition duration (in ms).
   */
  @Method()
  async updateAutoHeight(speed?: number) {
    const swiper = await this.getSwiper();
    swiper.updateAutoHeight(speed);
  }

  /**
   * Transition to the specified slide.
   *
   * @param index The index of the slide to transition to.
   * @param speed The transition duration (in ms).
   * @param runCallbacks If true, the transition will produce [Transition/SlideChange][Start/End] transition events.
   */
  @Method()
  async slideTo(index: number, speed?: number, runCallbacks?: boolean) {
    const swiper = await this.getSwiper();
    swiper.slideTo(index, speed, runCallbacks);
  }

  /**
   * Transition to the next slide.
   *
   * @param speed The transition duration (in ms).
   * @param runCallbacks If true, the transition will produce [Transition/SlideChange][Start/End] transition events.
   */
  @Method()
  async slideNext(speed?: number, runCallbacks?: boolean) {
    const swiper = await this.getSwiper();
    swiper.slideNext(speed!, runCallbacks!);
  }

  /**
   * Transition to the previous slide.
   *
   * @param speed The transition duration (in ms).
   * @param runCallbacks If true, the transition will produce the [Transition/SlideChange][Start/End] transition events.
   */
  @Method()
  async slidePrev(speed?: number, runCallbacks?: boolean) {
    const swiper = await this.getSwiper();
    swiper.slidePrev(speed, runCallbacks);
  }

  /**
   * Get the index of the active slide.
   */
  @Method()
  async getActiveIndex(): Promise<number> {
    const swiper = await this.getSwiper();
    return swiper.activeIndex;
  }

  /**
   * Get the index of the previous slide.
   */
  @Method()
  async getPreviousIndex(): Promise<number> {
    const swiper = await this.getSwiper();
    return swiper.previousIndex;
  }

  /**
   * Get the total number of slides.
   */
  @Method()
  async length(): Promise<number> {
    const swiper = await this.getSwiper();
    return swiper.slides.length;
  }

  /**
   * Get whether or not the current slide is the last slide.
   */
  @Method()
  async isEnd(): Promise<boolean> {
    const swiper = await this.getSwiper();
    return swiper.isEnd;
  }

  /**
   * Get whether or not the current slide is the first slide.
   */
  @Method()
  async isBeginning(): Promise<boolean> {
    const swiper = await this.getSwiper();
    return swiper.isBeginning;
  }

  /**
   * Start auto play.
   */
  @Method()
  async startAutoplay() {
    const swiper = await this.getSwiper();
    if (swiper.autoplay) {
      swiper.autoplay.start();
    }
  }

  /**
   * Stop auto play.
   */
  @Method()
  async stopAutoplay() {
    const swiper = await this.getSwiper();
    if (swiper.autoplay) {
      swiper.autoplay.stop();
    }
  }

  /**
   * Lock or unlock the ability to slide to the next slide.
   *
   * @param lock If `true`, disable swiping to the next slide.
   */
  @Method()
  async lockSwipeToNext(lock: boolean) {
    const swiper = await this.getSwiper();
    swiper.allowSlideNext = !lock;
  }

  /**
   * Lock or unlock the ability to slide to the previous slide.
   *
   * @param lock If `true`, disable swiping to the previous slide.
   */
  @Method()
  async lockSwipeToPrev(lock: boolean) {
    const swiper = await this.getSwiper();
    swiper.allowSlidePrev = !lock;
  }

  /**
   * Lock or unlock the ability to slide to the next or previous slide.
   *
   * @param lock If `true`, disable swiping to the next and previous slide.
   */
  @Method()
  async lockSwipes(lock: boolean) {
    const swiper = await this.getSwiper();
    swiper.allowSlideNext = !lock;
    swiper.allowSlidePrev = !lock;
    swiper.allowTouchMove = !lock;
  }

  private async initSwiper() {
    const finalOptions = this.normalizeOptions();

    // init swiper core
    // @ts-ignore
    const { Swiper } = await import('./swiper/swiper.bundle.js');
    const swiper = new Swiper(this.el, finalOptions);
    this.didInit = true;
    this.readySwiper(swiper);
  }

  private getSwiper() {
    return this.swiper;
  }

  private normalizeOptions(): SwiperOptions {
    // Base options, can be changed
    // TODO Add interface SwiperOptions
    const swiperOptions: SwiperOptions = {
      effect: undefined,
      direction: 'horizontal',
      initialSlide: 0,
      loop: false,
      parallax: false,
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
      autoplay: false,
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
        toggle: false,
      },
      touchRatio: 1,
      touchAngle: 45,
      simulateTouch: true,
      touchStartPreventDefault: false,
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
        crossfade: false
      },
      a11y: {
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
        firstSlideMessage: 'This is the first slide',
        lastSlideMessage: 'This is the last slide'
      }
    };

    if (this.pager) {
      swiperOptions.pagination = {
        el: this.paginationEl!,
        type: 'bullets',
        clickable: false,
        hideOnClick: false,
      };
    }

    if (this.scrollbar) {
      swiperOptions.scrollbar = {
        el: this.scrollbarEl!,
        hide: true,
      };
    }

    // Keep the event options separate, we dont want users
    // overwriting these
    const eventOptions: SwiperOptions = {
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

    const customEvents = (!!this.options && !!this.options.on) ? this.options.on : {};

    // merge "on" event listeners, while giving our event listeners priority
    const mergedEventOptions = { on: { ...customEvents, ...eventOptions.on } };

    // Merge the base, user options, and events together then pas to swiper
    return { ...swiperOptions, ...this.options, ...mergedEventOptions };
  }

  hostData() {
    const mode = getIonMode(this);

    return {
      class: {
        [`${mode}`]: true,

        // Used internally for styling
        [`slides-${mode}`]: true,

        'swiper-container': true
      }
    };
  }

  render() {
    return [
      <div class="swiper-wrapper">
        <slot></slot>
      </div>,
      this.pager && <div class="swiper-pagination" ref={el => this.paginationEl = el}></div>,
      this.scrollbar && <div class="swiper-scrollbar" ref={el => this.scrollbarEl = el}></div>
    ];
  }
}
