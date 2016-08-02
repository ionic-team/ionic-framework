export interface SwiperOptions {
  /**
   * Index number of initial slide.
   * @default 0
   */
  initialSlide?: number;
  /**
   * Could be 'horizontal' or 'vertical' (for vertical slider).
   * @default 'horizontal'
   */
  direction?: string;
  /**
   * Duration of transition between slides (in ms)
   * @default 300
   */
  speed?: number;
  /**
   * Enabled this option and plugin will set width/height on swiper wrapper equal to total size of all slides. Mostly should be used as compatibility fallback option for browser that don't support flexbox layout well
   * @default false
   */
  setWrapperSize?: boolean;
  /**
   * Enabled this option and swiper will be operated as usual except it will not move, real translate values on wrapper will not be set. Useful when you may need to create custom slide transition
   * @default false
   */
  virtualTranslate?: boolean;
  /**
   * Swiper width (in px). Parameter allows to force Swiper width. Useful only if you initialize Swiper when it is hidden.
   * @default undefined
   */
  width?: number;
    // Setting this parameter will make Swiper not responsive
  /**
   * Swiper height (in px). Parameter allows to force Swiper height. Useful only if you initialize Swiper when it is hidden.
   * @default undefined
   */
  height?: number;
    // Setting this parameter will make Swiper not responsive
  /**
   * Set to true and slider wrapper will adopt its height to the height of the currently active slide
   * @default false
   */
  autoHeight?: boolean;
  /**
   * Set to true to round values of slides width and height to prevent blurry texts on usual resolution screens (if you have such)
   * @default false
   */
  roundLengths?: boolean;
  /**
   * Set to true on nested Swiper for correct touch events interception. Use only on nested swipers that use same direction as the parent one
   * @default false
   */
  nested?: boolean;

  // Autoplay

  /**
   * delay between transitions (in ms). If this parameter is not specified, auto play will be disabled
   * @default undefined
   */
  autoplay?: number;
  /**
   * Enable this parameter and autoplay will be stopped when it reaches last slide (has no effect in loop mode)
   * @default false
   */
  autoplayStopOnLast?: boolean;
  /**
   * Set to false and autoplay will not be disabled after user interactions (swipes), it will be restarted every time after interaction
   * @default true
   */
  autoplayDisableOnInteraction?: boolean;

  // Progress

  /**
   * Enable this feature to calculate each slides progress
   * @default false
   */
  watchSlidesProgress?: boolean;
  /**
   * watchSlidesProgress should be enabled. Enable this option and slides that are in viewport will have additional visible class
   * @default false
   */
  watchSlidesVisibility?: boolean;

  // Freemode

  /**
   * If true then slides will not have fixed positions
   * @default false
   */
  freeMode?: boolean;
  /**
   * If true, then slide will keep moving for a while after you release it
   * @default true
   */
  freeModeMomentum?: boolean;
  /**
   * Higher value produces larger momentum distance after you release slider
   * @default 1
   */
  freeModeMomentumRatio?: number;
  /**
   * Set to false if you want to disable momentum bounce in free mode
   * @default true
   */
  freeModeMomentumBounce?: boolean;
  /**
   * Higher value produces larger momentum bounce effect
   * @default 1
   */
  freeModeMomentumBounceRatio?: number;
  /**
   * Minimum touchmove-velocity required to trigger free mode momentum
   * @default 0.02
   */
  freeModeMinimumVelocity?: number;
  /**
   * Set to true to enable snap to slides positions in free mode
   * @default false
   */
  freeModeSticky?: boolean;

  // Effects

  /**
   * Could be "slide", "fade", "cube", "coverflow" or "flip"
   * @default 'slide'
   */
  effect?: string;
  /**
   * Fade effect parameters
   * @default {crossFade: false}
   */
  fade?: {crossFade: boolean};
  /**
   * Cube effect parameters. For better performance you may disable shadows
   * @default {slideShadows: true, shadow: true, shadowOffset: 20, shadowScale: 0.94}
   */
  cube?: {slideShadows: boolean; shadow: boolean; shadowOffset: number; shadowScale: number};
  /**
   * Coverflow effect parameters. For better performance you may disable shadows
   * @default {rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true}
   */
  coverflow?: {rotate: number; stretch: number; depth: number; modifier: number; slideShadows: boolean};
  /**
   * Flip effect parameters. limitRotation (when enabled) limits slides rotation angle to 180deg maximum. It allows to quickly "flip" between different slides. If you use "slow" transitions then it is better to disable it.
   * @default {slideShadows: true, limitRotation: true}
   */
  flip?: {slideShadows: boolean; limitRotation: boolean};

  // Parallax

  /**
   * Enable, if you want to use "parallaxed" elements inside of slider
   * @default false
   */
  parallax?: boolean;

  // Slides grid

  /**
   * Distance between slides in px.
   * @default 0
   */
  spaceBetween?: number;
  /**
   * Number or 'auto' Number of slides per view (slides visible at the same time on slider's container).
   * If you use it with "auto" value and along with loop: true then you need to specify loopedSlides parameter with amount of slides to loop (duplicate)
   * slidesPerView: 'auto' is currently not compatible with multirow mode, when slidesPerColumn > 1
   * @default 1
   */
  slidesPerView?: number | string;
  /**
   * Number of slides per column, for multirow layout
   * @default 1
   */
  slidesPerColumn?: number;
  /**
   * Could be 'column' or 'row'. Defines how slides should fill rows, by column or by row
   * @default 'column'
   */
  slidesPerColumnFill?: string;
  /**
   * Set numbers of slides to define and enable group sliding. Useful to use with slidesPerView > 1
   * @default 1
   */
  slidesPerGroup?: number;
  /**
   * If true, then active slide will be centered, not always on the left side.
   * @default false
   */
  centeredSlides?: boolean;
  /**
   * Add (in px) additional slide offset in the beginning of the container (before all slides)
   * @default 0
   */
  slidesOffsetBefore?: number;
  /**
   * Add (in px) additional slide offset in the end of the container (after all slides)
   * @default 0
   */
  slidesOffsetAfter?: number;

  // Grab Cursor

  /**
   * This option may a little improve desktop usability. If true, user will see the "grab" cursor when hover on Swiper
   * @default false
   */
  grabCursor?: boolean;

  // Touches

  /**
   * Target element to listen touch events on. Can be 'container' (to listen for touch events on swiper-container) or 'wrapper' (to listen for touch events on swiper-wrapper)
   * @default 'container'
   */
  touchEventsTarget?: string;
  /**
   * Touch ration
   * @default 1
   */
  touchRatio?: number;
  /**
   * Allowable angle (in degrees) to trigger touch move
   * @default 45
   */
  touchAngle?: number;
  /**
   * If true, Swiper will accept mouse events like touch events (click and drag to change slides)
   * @default true
   */
  simulateTouch?: boolean;
  /**
   * Set to false if you want to disable short swipes
   * @default true
   */
  shortSwipes?: boolean;
  /**
   * Set to false if you want to disable long swipes
   * @default true
   */
  longSwipes?: boolean;
  /**
   * Ratio to trigger swipe to next/previous slide during long swipes
   * @default 0.5
   */
  longSwipesRatio?: number;
  /**
   * Minimal duration (in ms) to trigger swipe to next/previous slide during long swipes
   * @default 300
   */
  longSwipesMs?: number;
  /**
   * If disabled, then slider will be animated only when you release it, it will not move while you hold your finger on it
   * @default true
   */
  followFinger?: boolean;
  /**
   * If true, then the only way to switch the slide is use of external API functions like slidePrev or slideNext
   * @default false
   */
  onlyExternal?: boolean;
  /**
   * Threshold value in px. If "touch distance" will be lower than this value then swiper will not move
   * @default 0
   */
  threshold?: number;
  /**
   * If enabled, then propagation of "touchmove" will be stopped
   * @default true
   */
  touchMoveStopPropagation?: boolean;
  /**
   * Enable to release Swiper events for swipe-to-go-back work in iOS UIWebView
   * @default false
   */
  iOSEdgeSwipeDetection?: boolean;
  /**
   * Area (in px) from left edge of the screen to release touch events for swipe-to-go-back in iOS UIWebView
   * @default 20
   */
  iOSEdgeSwipeThreshold?: number;

  // Touch Resistance

  /**
   * Set to false if you want to disable resistant bounds
   * @default true
   */
  resistance?: boolean;
  /**
   * This option allows you to control resistance ratio
   * @default 0.85
   */
  resistanceRatio?: number;

  // Clicks

  /**
   * Set to true to prevent accidental unwanted clicks on links during swiping
   * @default true
   */
  preventClicks?: boolean;
  /**
   * Set to true to stop clicks event propagation on links during swiping
   * @default true
   */
  preventClicksPropagation?: boolean;
  /**
   * Set to true and click on any slide will produce transition to this slide
   * @default false
   */
  slideToClickedSlide?: boolean;

  // Swiping / No swiping

  /**
   * Set to false to disable swiping to previous slide direction (to left or top)
   * @default true
   */
  allowSwipeToPrev?: boolean;
  /**
   * Set to false to disable swiping to next slide direction (to right or bottom)
   * @default true
   */
  allowSwipeToNext?: boolean;
  /**
   * Set to false to disable swiping to next slide direction (to right or bottom)
   * @default true
   */
  noSwiping?: boolean;
  /**
   * If true, then you can add noSwipingClass class to swiper's slide to prevent/disable swiping on this element
   * @default 'swiper-no-swiping'
   */
  noSwipingClass?: string;
  /**
   * String with CSS selector or HTML element of the container with pagination that will work as only available handler for swiping
   * @default undefined
   */
  swipeHandler?: string | HTMLElement;

  // Navigation Controls

  /**
   * If enabled (by default) and navigation elements' parameters passed as a string (like ".pagination") then Swiper will look for such elements through child elements first. Applies for pagination, prev/next buttons and scrollbar elements
   * @default true
   */
  uniqueNavElements?: boolean;

  // Pagination

  /**
   * String with CSS selector or HTML element of the container with pagination
   * @default undefined
   */
  pagination?: string | HTMLElement;
  /**
   * String with type of pagination. Can be "bullets", "fraction", "progress" or "custom"
   * @default 'bullets'
   */
  paginationType?: string;
  /**
   * Toggle (hide/true) pagination container visibility when click on Slider's container
   * @default true
   */
  paginationHide?: boolean;
  /**
   * If true then clicking on pagination button will cause transition to appropriate slide. Only for bullets pagination type
   * @default false
   */
  paginationClickable?: boolean;
  /**
   * Defines which HTML tag will be use to represent single pagination bullet. . Only for bullets pagination type
   * @default 'span'
   */
  paginationElement?: string;
  /**
   * This parameter allows totally customize pagination bullets, you need to pass here a function that accepts index number of pagination bullet and required element class name (className). Only for bullets pagination type
   * @example
   * // With this code, we can add slide number into pagination bullet:
   * var swiper = new Swiper('.swiper-container', {
   *   //...
   *   paginationBulletRender: function (index, className) {
   *       return '<span class="' + className + '">' + (index + 1) + '</span>';
   *   }
   * });
   */
  paginationBulletRender?: (index?: number, className?: string) => any;
  /**
   * This parameter allows to customize "fraction" pagination html. Only for fraction pagination type
   * @example
   * var swiper = new Swiper('.swiper-container', {
   *   //...
   *   paginationFractionRender: function (swiper, currentClassName, totalClassName) {
   *       return '<span class="' + currentClassName + '"></span>' +
   *              ' of ' +
   *              '<span class="' + totalClassName + '"></span>';
   *   }
   * });
   */
  paginationFractionRender?: (swiper?: Swiper, currentClassName?: string, totalClassName?: string) => any;
  /**
   * This parameter allows to customize "progress" pagination. Only for progress pagination type
   * @example
   * var swiper = new Swiper('.swiper-container', {
   *   //...
   *   paginationProgressRender: function (swiper, progressbarClass) {
   *       return '<span class="' + progressbarClass + '"></span>';
   *   }
   * });
   */
  paginationProgressRender?: (swiper?: Swiper, progressbarClass?: string) => any;
  /**
   * This parameter is required for custom pagination type where you have to specify how it should be rendered
   * @example
   * var swiper = new Swiper('.swiper-container', {
   *   //...
   *   paginationCustomRender: function (swiper, current, total) {
   *       return current + ' of ' + total;
   *   }
   * });
   */
  paginationCustomRender?: (swiper?: Swiper, current?: number, total?: number) => any;

  // Navigation Buttons

  /**
   * String with CSS selector or HTML element of the element that will work like "next" button after click on it
   * @default undefined
   */
  nextButton?: string | HTMLElement;
  /**
   * String with CSS selector or HTML element of the element that will work like "prev" button after click on it
   * @default undefined
   */
  prevButton?: string | HTMLElement;

  // Scrollbar

  /**
   * String with CSS selector or HTML element of the container with scrollbar.
   * @default undefined
   */
  scrollbar?: string | HTMLElement;
  /**
   * Hide scrollbar automatically after user interaction
   * @default true
   */
  scrollbarHide?: boolean;
  /**
   * Set to true to enable make scrollbar draggable that allows you to control slider position
   * @default false
   */
  scrollbarDraggable?: boolean;
  /**
   * Set to true to snap slider position to slides when you release scrollbar
   * @default false
   */
  scrollbarSnapOnRelease?: boolean;

  // Accessibility

  /**
   * Option to enable keyboard accessibility to provide foucsable navigation buttons and basic ARIA for screen readers
   * @default false
   */
  a11y?: boolean;
  /**
   * Message for screen readers for previous button
   * @default 'Previous slide'
   */
  prevSlideMessage?: string;
  /**
   * Message for screen readers for next button
   * @default 'Next slide'
   */
  nextSlideMessage?: string;
  /**
   * Message for screen readers for previous button when swiper is on first slide
   * @default 'This is the first slide'
   */
  firstSlideMessage?: string;
  /**
   * Message for screen readers for previous button when swiper is on last slide
   * @default 'This is the last slide'
   */
  lastSlideMessage?: string;
  /**
   * Message for screen readers for single pagination bullet
   * @default 'Go to slide {{index}}'
   */
  paginationBulletMessage?: string;

  // Keyboard / Mousewheel

  /**
   * Set to true to enable navigation through slides using keyboard right and left (for horizontal mode), top and borrom (for vertical mode) keyboard arrows
   * @default false
   */
  keyboardControl?: boolean;
  /**
   * Set to true to enable navigation through slides using mouse wheel
   * @default false
   */
  mousewheelControl?: boolean;
  /**
   * Set to true to force mousewheel swipes to axis. So in horizontal mode mousewheel will work only with horizontal mousewheel scrolling, and only with vertical scrolling in vertical mode.
   * @default false
   */
  mousewheelForceToAxis?: boolean;
  /**
   * Set to true and swiper will release mousewheel event and allow page scrolling when swiper is on edge positions (in the beginning or in the end)
   * @default false
   */
  mousewheelReleaseOnEdges?: boolean;
  /**
   * Set to true to invert sliding direction
   * @default false
   */
  mousewheelInvert?: boolean;
  /**
   * Multiplier of mousewheel data, allows to tweak mouse wheel sensitivity
   * @default 1
   */
  mousewheelSensitivity?: number;

  // Hash Navigation

  /**
   * Set to true to enable hash url navigation to for slides
   * @default false
   */
  hashnav?: boolean;

  // Images

  /**
   * When enabled Swiper will force to load all images
   * @default true
   */
  preloadImages?: boolean;
  /**
   * When enabled Swiper will be reinitialized after all inner images (<img> tags) are loaded. Required preloadImages: true
   * @default true
   */
  updateOnImagesReady?: boolean;
  /**
   * Set to "true" to enable images lazy loading. Note that preloadImages should be disabled
   * @default false
   */
  lazyLoading?: boolean;
  /**
   * Set to "true" to enable lazy loading for the closest slides images (for previous and next slide images)
   * @default false
   */
  lazyLoadingInPrevNext?: boolean;
  /**
   * Amount of next/prev slides to preload lazy images in. Can't be less than slidesPerView
   * @default 1
   */
  lazyLoadingInPrevNextAmount?: number;
  /**
   * By default, Swiper will load lazy images after transition to this slide, so you may enable this parameter if you need it to start loading of new image in the beginning of transition
   * @default false
   */
  lazyLoadingOnTransitionStart?: boolean;

  // Loop

  /**
   * Set to true to enable continuous loop mode
   * If you use it along with slidesPerView: 'auto' then you need to specify loopedSlides parameter with amount of slides to loop (duplicate)
   * @default false
   */
  loop?: boolean;
  /**
   * Addition number of slides that will be cloned after creating of loop
   * @default 0
   */
  loopAdditionalSlides?: number;
  /**
   * If you use slidesPerView:'auto' with loop mode you should tell to Swiper how many slides it should loop (duplicate) using this parameter
   * @default undefined
   */
  loopedSlides?: number;

  // Controller

  /**
   * Pass here another Swiper instance or array with Swiper instances that should be controlled by this Swiper
   * @default undefined
   */
  control?: Swiper;
  /**
   * Set to true and controlling will be in inverse direction
   * @default false
   */
  controlInverse?: boolean;
  /**
   * Can be 'slide' or 'container'. Defines a way how to control another slider: slide by slide (with respect to other slider's grid) or depending on all slides/container (depending on total slider percentage)
   * @default 'slide'
   */
  controlBy?: string;

  // Observer

  /**
   * Set to true to enable Mutation Observer on Swiper and its elements. In this case Swiper will be updated (reinitialized) each time if you change its style (like hide/show) or modify its child elements (like adding/removing slides)
   * @default false
   */
  observer?: boolean;
  /**
   * Set to true if you also need to watch Mutations for Swiper parent elements
   * @default false
   */
  observeParents?: boolean;

  // Breakpoints

  /**
   * Allows to set different parameter for different responsive breakpoints (screen sizes). Not all parameters can be changed in breakpoints, only those which are not required different layout and logic, like slidesPerView, slidesPerGroup, spaceBetween. Such parameters like slidesPerColumn, loop, direction, effect won't work. For example:
   * @example
   * var swiper = new Swiper('.swiper-container', {
   *   // Default parameters
   *   slidesPerView: 4,
   *   spaceBetween: 40,
   *   // Responsive breakpoints
   *   breakpoints: {
   *     // when window width is <= 320px
   *     320: {
   *       slidesPerView: 1,
   *       spaceBetweenSlides: 10
   *     },
   *     // when window width is <= 480px
   *     480: {
   *       slidesPerView: 2,
   *       spaceBetweenSlides: 20
   *     },
   *     // when window width is <= 640px
   *     640: {
   *       slidesPerView: 3,
   *       spaceBetweenSlides: 30
   *     }
   *   }
   * })
   */
  breakpoints?: {[key: number]: {slidesPerView: number; spaceBetweenSlides: number}};

  // Callbacks

  /**
   * Run on[Transition/SlideChange][Start/End] callbacks on swiper initialization. Such callbacks will be fired on initialization in case of your initialSlide is not 0, or you use loop mode
   * @default true
   */
  runCallbacksOnInit?: boolean;
  /** Callback function, will be executed right after Swiper initialization */
  onInit?: (swiper: Swiper) => any;
  /** Callback function, will be executed in the beginning of animation to other slide (next or previous). Receives swiper instance as an argument. */
  onSlideChangeStart?: (swiper: Swiper) => any;
  /** Callback function, will be executed after animation to other slide (next or previous). Receives slider instance as an argument. */
  onSlideChangeEnd?: (swiper: Swiper) => any;
  /** Same as "onSlideChangeStart" but for "forward" direction only */
  onSlideNextStart?: (swiper: Swiper) => any;
  /** Same as "onSlideChangeEnd" but for "forward" direction only */
  onSlideNextEnd?: (swiper: Swiper) => any;
  /** Same as "onSlideChangeStart" but for "backward" direction only */
  onSlidePrevStart?: (swiper: Swiper) => any;
  /** Same as "onSlideChangeEnd" but for "backward" direction only */
  onSlidePrevEnd?: (swiper: Swiper) => any;
  /** Callback function, will be executed in the beginning of transition. Receives swiper instance as an argument. */
  onTransitionStart?: (swiper: Swiper) => any;
  /** Callback function, will be executed after transition. Receives slider instance as an argument. */
  onTransitionEnd?: (swiper: Swiper) => any;
  /** Callback function, will be executed when user touch Swiper. Receives swiper instance and 'touchstart' event as an arguments. */
  onTouchStart?: (swiper: Swiper, event: any) => any;
  /** Callback function, will be executed when user touch and move finger over Swiper. Receives swiper instance and 'touchmove' event as an arguments. */
  onTouchMove?: (swiper: Swiper, event: any) => any;
  /** Callback function, will be executed when user touch and move finger over Swiper in direction opposite to direction parameter. Receives swiper instance and 'touchmove' event as an arguments. */
  onTouchMoveOpposite?: (swiper: Swiper, event: any) => any;
  /** Callback function, will be executed when user touch and move finger over Swiper and move it. Receives swiper instance and 'touchmove' event as an arguments. */
  onSliderMove?: (swiper: Swiper, event: any) => any;
  /** Callback function, will be executed when user release Swiper. Receives swiper instance and 'touchend' event as an arguments. */
  onTouchEnd?: (swiper: Swiper, event: any) => any;
  /** Callback function, will be executed when user click/tap on Swiper after 300ms delay. Receives swiper instance and 'touchend' event as an arguments. */
  onClick?: (swiper: Swiper, event: any) => any;
  /** Callback function, will be executed when user click/tap on Swiper. Receives swiper instance and 'touchend' event as an arguments. */
  onTap?: (swiper: Swiper, event: any) => any;
  /** Callback function, will be executed when user double tap on Swiper's container. Receives swiper instance and 'touchend' event as an arguments */
  onDoubleTap?: (swiper: Swiper, event: any) => any;
  /** Callback function, will be executed right after all inner images are loaded. updateOnImagesReady should be also enabled */
  onImagesReady?: (swiper: Swiper) => any;
  /** Callback function, will be executed when Swiper progress is changed, as second arguments it receives progress that is always from 0 to 1 */
  onProgress?: (swiper: Swiper, progress: number) => any;
  /** Callback function, will be executed when Swiper reach its beginning (initial position) */
  onReachBeginning?: (swiper: Swiper) => any;
  /** Callback function, will be executed when Swiper reach last slide */
  onReachEnd?: (swiper: Swiper) => any;
  /** Callback function, will be executed when you destroy Swiper */
  onDestroy?: (swiper: Swiper) => any;
  /** Callback function, will be executed when swiper's wrapper change its position. Receives swiper instance and current translate value as an arguments */
  onSetTranslate?: (swiper: Swiper, translate: number) => any;
  /** Callback function, will be executed everytime when swiper starts animation. Receives swiper instance and current transition duration (in ms) as an arguments */
  onSetTransition?: (swiper: Swiper, transition: number) => any;
  /** Same as onSlideChangeStart but caused by autoplay */
  onAutoplay?: (swiper: Swiper) => any;
  /** Callback function, will be executed when when autoplay started */
  onAutoplayStart?: (swiper: Swiper) => any;
  /** Callback function, will be executed when when autoplay stopped */
  onAutoplayStop?: (swiper: Swiper) => any;
  /** Callback function, will be executed in the beginning of lazy loading of image */
  onLazyImageLoad?: (swiper: Swiper, slide: any, image: any) => any;
  /** Callback function, will be executed when lazy loading image will be loaded */
  onLazyImageReady?: (swiper: Swiper, slide: any, image: any) => any;
  /** Callback function, will be executed after pagination elements generated and added to DOM */
  onPaginationRendered?: (swiper: Swiper, paginationContainer: any) => any;

  // Namespace

  /**
   * CSS class name of slide
   * @default 'swiper-slide'
   */
  slideClass?: string;
  /**
   * CSS class name of currently active slide
   * @default 'swiper-slide-active'
   */
  slideActiveClass?: string;
  /**
   * CSS class name of currently visible slide
   * @default 'swiper-slide-visible'
   */
  slideVisibleClass?: string;
  /**
   * CSS class name of slide duplicated by loop mode
   * @default 'swiper-slide-duplicate'
   */
  slideDuplicateClass?: string;
  /**
   * CSS class name of slide which is right after currently active slide
   * @default 'swiper-slide-next'
   */
  slideNextClass?: string;
  /**
   * CSS class name of slide which is right before currently active slide
   * @default 'swiper-slide-prev'
   */
  slidePrevClass?: string;
  /**
   * CSS class name of slides' wrapper
   * @default 'swiper-wrapper'
   */
  wrapperClass?: string;
  /**
   * CSS class name of single pagination bullet
   * @default 'swiper-pagination-bullet'
   */
  bulletClass?: string;
  /**
   * CSS class name of currently active pagination bullet
   * @default 'swiper-pagination-bullet-active'
   */
  bulletActiveClass?: string;
  /**
   * CSS class name of pagination when it becomes inactive
   * @default 'swiper-pagination-hidden'
   */
  paginationHiddenClass?: string;
  /**
   * CSS class name of the element with currently active index in "fraction" pagination
   * @default 'swiper-pagination-current'
   */
  paginationCurrentClass?: string;
  /**
   * CSS class name of the element with total number of "snaps" in "fraction" pagination
   * @default 'swiper-pagination-total'
   */
  paginationTotalClass?: string;
  /**
   * CSS class name of pagination progressbar
   * @default 'swiper-pagination-progressbar'
   */
  paginationProgressbarClass?: string;
  /**
   * CSS class name of next/prev button when it becomes disabled
   * @default 'swiper-button-disabled'
   */
  buttonDisabledClass?: string;
}

export declare class Swiper {
  /**
   * Create a Swiper
   * @param {HTMLElement | string} container - The container element for the Swiper
   * @param {SwiperOptions} params - Set of options for the Swiper
   */
  constructor (container: HTMLElement | string, params: SwiperOptions);

  /** Object with passed initialization parameters */
  params: SwiperOptions;
  /** Dom7/jQuery element with slider container HTML element. To get vanilla HTMLElement use mySwiper.container[0] */
  container: HTMLElement | any;
  /** Dom7/jQuery element with slider wrapper HTML element. To get vanilla HTMLElement use mySwiper.wrapper[0] */
  wrapper: HTMLElement | any;
  /** Dom7/jQuery array-like collection of slides HTML elements. To get specific slide HTMLElement use mySwiper.slides[1] */
  slides: HTMLElement | any;
  /** Dom7/jQuery element with next button HTML element. To get vanilla HTMLElement use mySwiper.nextButton[0] */
  nextButton: HTMLElement | any;
  /** Dom7/jQuery element with prev button HTML element. To get vanilla HTMLElement use mySwiper.prevButton[0] */
  prevButton: HTMLElement | any;
  /** Dom7/jQuery collection of pagination buttons HTML elements. To get specific slide HTMLElement use mySwiper.bullets[1] */
  bullets: HTMLElement | any;
  /** Width of container */
  width: number;
  /** Height of container */
  height: number;
  /** Current value of wrapper translate */
  translate: any;
  /** Current progress of wrapper translate (from 0 to 1) */
  progress: number;
  /** Index number of currently active slide */
  activeIndex: number;
    // Note, that in loop mode active index value will be always shifted on a number of looped/duplicated slides
  /** Index number of previously active slide */
  previousIndex: number;
  /** true if slider on most "left"/"top" position */
  isBeginning: boolean;
  /** true if slider on most "right"/"bottom" position */
  isEnd: boolean;
  /** true if autoplay is enabled */
  autoplaying: boolean;
  /** true if swiper is in transition */
  animating: boolean;
  /** Object with touch event properties */
  touches: {startX: number; startY: number; currentX: number; currentY: number; diff: number};
  /** Index number of last clicked slide */
  clickedIndex: number;
  /** Link to last clicked slide */
  clickedSlide: HTMLElement;

  /**
   * Run transition to next slide
   * @param {boolean} runCallbacks - Set it to false (by default it is true) and transition will not produce onSlideChange callback functions.
   * @param {number} speed - transition duration (in ms).
   * @return {boolean}
   */
  slideNext(runCallbacks?: boolean, speed?: number): boolean;

  /**
   * Run transition to previous slide
   * @param {boolean} runCallbacks - Set it to false (by default it is true) and transition will not produce onSlideChange callback functions.
   * @param {number} speed - transition duration (in ms).
   * @return {boolean}
   */
  slidePrev(runCallbacks?: boolean, speed?: number): boolean;

  /**
   * Run transition to the slide with index number equal to 'index' parameter for the duration equal to 'speed' parameter.
   * @param {number} index - Index number of slide.
   * @param {number} speed - Transition duration (in ms).
   * @param {boolean} runCallbacks - Set it to false (by default it is true) and transition will not produce onSlideChange callback functions.
   * @return {boolean}
   */
  slideTo(index: number, speed?: number, runCallbacks?: boolean): boolean;

  /**
   * This method includes subcalls to updateContainerSize, updateSlidesSize, updateProgress, updatePagination and updateClasses methods
   * You should call it after you add/remove slides manually, or after you hide/show it, or do any custom DOM modifications with Swiper
   * @param {boolean} [updateTranslate=false] - Set it to true (by default it is false) to hard set/reset/update Swiper wrapper translate. It is useful if you use not default effect or scrollbar.
   */
  update(updateTranslate: boolean): void;

  /**
   * Recalculate size of swiper container
   */
  updateContainerSize(): void;

  /**
   * Recalculate number of slides and their offsets. Useful after you add/remove slides with JavaScript
   */
  updateSlidesSize(): void;

  /**
   * Recalculate swiper progress
   */
  updateProgress(): void;

  /**
   * Updates pagination layout and re-render bullets
   */
  updatePagination(): void;

  /**
   * Update active/prev/next classes on slides and bullets
   */
  updateClasses(): void;

  /**
   * Swiper executes this method when you resize browser. It is almost the same as .update() but a bit softer, without hard setting translate
   */
  onResize(): void;

  /**
   * Detach all events listeners
   */
  detachEvents(): void;

  /**
   * Atach all events listeners again
   */
  attachEvents(): void;

  /**
   * Start auto play. It may be useful for custom "Play" and "Pause" buttons
   */
  startAutoplay(): void;

  /**
   * Stop auto play. It may be useful for custom "Play" and "Pause" buttons
   */
  stopAutoplay(): void;

  /**
   * Destroy slider instance and detach all events listeners, where
   * @param {boolean} [deleteInstance=true] - Set it to false (by default it is true) to not to delete Swiper instance
   * @param {boolean} [cleanupStyles=false] - Set it to true (by default it is false) and all custom styles will be removed from slides, wrapper and container. Useful if you need to destroy Swiper and to init again with new options or in different direction
   */
  destroy(deleteInstance: boolean, cleanupStyles: boolean): void;

  /**
   * Add new slides to the end.
   * @param {(HTMLElement | HTMLElement[] | string | string[])} slides - Slide or slides you wish to add to the Swiper
   */
  appendSlide(slides: HTMLElement | HTMLElement[] | string | string[]): void;

  /**
   * Add new slides to the beginning.
   * @param {(HTMLElement | HTMLElement[] | string | string[])} slides - Slide or slides you wish to add to the Swiper
   */
  prependSlide(slides: HTMLElement | HTMLElement[] | string | string[]): void;

  /**
   * Remove selected slides.
   * @param {(number | number[])} slideIndex - Index or indices of slides to remove from the Swiper
   */
  removeSlide(slideIndex: number | number[]): void;

  /**
   * Remove all slides
   */
  removeAllSlides(): void;

  /**
   * Set custom css3 transform's translate value for swiper wrapper
   * @param {number} translate - value to translate the swiper wrapper by
   */
  setWrapperTranslate(translate: number): void;

  /**
   * Get current value of swiper wrapper css3 transform translate
   * @return {number} current value of swiper wrapper css3 transform translate
   */
  getWrapperTranslate(): number;

  /**
   * Add callback/event handler
   * @param {string} callback - The event type to listen for.
   * @param {(...args: any[]) => any} handler - The method to be called when an event occurs.
   * @return {Swiper}
   */
  on(callback: string, handler: (...args: any[]) => any): Swiper;

  /**
   * Add event/callback that will be executed only once
   * @param {string} callback - The event type to listen for.
   * @param {(...args: any[]) => any} handler - The method to be called when an event occurs.
   * @return {Swiper}
   */
  once(callback: string, handler: (...args: any[]) => any): Swiper;

  /**
   * Remove all handlers for specified callback/event
   * @param {string} callback - The event type to stop listening for.
   * @return {Swiper}
   */
  off(callback: string): Swiper;

  /**
   * Disable (lock) ability to slide to the next slides
   */
  lockSwipeToNext(): void;

  /**
   * Enable (unlock) ability to slide to the next slides
   */
  unlockSwipeToNext(): void;

  /**
   * Disable (lock) ability to slide to the previous slides
   */
  lockSwipeToPrev(): void;

  /**
   * Enable (unlock) ability to slide to the previous slides
   */
  unlockSwipeToPrev(): void;

  /**
   * Disable (lock) ability to change slides
   */
  lockSwipes(): void;

  /**
   * Enable (unlock) ability to change slides
   */
  unlockSwipes(): void;

  /**
   * Disable mousewheel control
   */
  disableMousewheelControl(): void;

  /**
   * Enable mousewheel control
   */
  enableMousewheelControl(): void;

  /**
   * Enable keyboard control
   */
  enableKeyboardControl(): void;

  /**
   * Disable keyboard control
   */
  disableKeyboardControl(): void;
}
