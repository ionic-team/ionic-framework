export interface SwiperOptions {
  /** Index number of initial slide. */
  initialSlide?: number = 0;
  /** Could be 'horizontal' or 'vertical' (for vertical slider). */
  direction?: string = 'horizontal';
  /** Duration of transition between slides (in ms) */
  speed?: number = 300;
  /** Enabled this option and plugin will set width/height on swiper wrapper equal to total size of all slides. Mostly should be used as compatibility fallback option for browser that don't support flexbox layout well */
  setWrapperSize?: boolean = false;
  /** Enabled this option and swiper will be operated as usual except it will not move, real translate values on wrapper will not be set. Useful when you may need to create custom slide transition */
  virtualTranslate?: boolean = false;
  /** Swiper width (in px). Parameter allows to force Swiper width. Useful only if you initialize Swiper when it is hidden. */
  width?: number = undefined;
    // Setting this parameter will make Swiper not responsive
  /** Swiper height (in px). Parameter allows to force Swiper height. Useful only if you initialize Swiper when it is hidden. */
  height?: number = undefined;
    // Setting this parameter will make Swiper not responsive
  /** Set to true and slider wrapper will adopt its height to the height of the currently active slide */
  autoHeight?: boolean = false;
  /** Set to true to round values of slides width and height to prevent blurry texts on usual resolution screens (if you have such) */
  roundLengths?: boolean = false;
  /** Set to true on nested Swiper for correct touch events interception. Use only on nested swipers that use same direction as the parent one */
  nested?: boolean = false;

  // Autoplay

  /** delay between transitions (in ms). If this parameter is not specified, auto play will be disabled */
  autoplay?: number = undefined;
  /** Enable this parameter and autoplay will be stopped when it reaches last slide (has no effect in loop mode) */
  autoplayStopOnLast?: boolean = false;
  /** Set to false and autoplay will not be disabled after user interactions (swipes), it will be restarted every time after interaction */
  autoplayDisableOnInteraction?: boolean = true;

  // Progress

  /** Enable this feature to calculate each slides progress */
  watchSlidesProgress?: boolean = false;
  /** watchSlidesProgress should be enabled. Enable this option and slides that are in viewport will have additional visible class */
  watchSlidesVisibility?: boolean = false;

  // Freemode

  /** If true then slides will not have fixed positions */
  freeMode?: boolean = false;
  /** If true, then slide will keep moving for a while after you release it */
  freeModeMomentum?: boolean = true;
  /** Higher value produces larger momentum distance after you release slider */
  freeModeMomentumRatio?: number = 1;
  /** Set to false if you want to disable momentum bounce in free mode */
  freeModeMomentumBounce?: boolean = true;
  /** Higher value produces larger momentum bounce effect */
  freeModeMomentumBounceRatio?: number = 1;
  /** Minimum touchmove-velocity required to trigger free mode momentum */
  freeModeMinimumVelocity?: number = 0.02;
  /** Set to true to enable snap to slides positions in free mode */
  freeModeSticky?: boolean = false;

  // Effects

  /** Could be "slide", "fade", "cube", "coverflow" or "flip" */
  effect?: string = 'slide';
  /** Fade effect parameters */
  fade?: {crossFade: boolean} = {crossFade: false};
  /** Cube effect parameters. For better performance you may disable shadows */
  cube?: {slideShadows: boolean; shadow: boolean; shadowOffset: number; shadowScale: number} = {slideShadows: true, shadow: true, shadowOffset: 20, shadowScale: 0.94};
  /** Coverflow effect parameters. For better performance you may disable shadows */
  coverflow?: {rotate: number; stretch: number; depth: number; modifier: number; slideShadows: boolean} = {rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true};
  /** Flip effect parameters. limitRotation (when enabled) limits slides rotation angle to 180deg maximum. It allows to quickly "flip" between different slides. If you use "slow" transitions then it is better to disable it. */
  flip?: {slideShadows: boolean; limitRotation: boolean} = {slideShadows: true, limitRotation: true};

  // Parallax

  /** Enable, if you want to use "parallaxed" elements inside of slider */
  parallax?: boolean = false;

  // Slides grid

  /** Distance between slides in px. */
  spaceBetween?: number = 0;
  /**
   * Number or 'auto' Number of slides per view (slides visible at the same time on slider's container).
   * If you use it with "auto" value and along with loop: true then you need to specify loopedSlides parameter with amount of slides to loop (duplicate)
   * slidesPerView: 'auto' is currently not compatible with multirow mode, when slidesPerColumn > 1
   */
  slidesPerView?: number | string = 1;
  /** Number of slides per column, for multirow layout */
  slidesPerColumn?: number = 1;
  /** Could be 'column' or 'row'. Defines how slides should fill rows, by column or by row */
  slidesPerColumnFill?: string = 'column';
  /** Set numbers of slides to define and enable group sliding. Useful to use with slidesPerView > 1 */
  slidesPerGroup?: number = 1;
  /** If true, then active slide will be centered, not always on the left side. */
  centeredSlides?: boolean = false;
  /** Add (in px) additional slide offset in the beginning of the container (before all slides) */
  slidesOffsetBefore?: number = 0;
  /** Add (in px) additional slide offset in the end of the container (after all slides) */
  slidesOffsetAfter?: number = 0;

  // Grab Cursor

  /** This option may a little improve desktop usability. If true, user will see the "grab" cursor when hover on Swiper */
  grabCursor?: boolean = false;

  // Touches

  /** Target element to listen touch events on. Can be 'container' (to listen for touch events on swiper-container) or 'wrapper' (to listen for touch events on swiper-wrapper) */
  touchEventsTarget?: string = 'container';
  /** Touch ration */
  touchRatio?: number = 1;
  /** Allowable angle (in degrees) to trigger touch move */
  touchAngle?: number = 45;
  /** If true, Swiper will accept mouse events like touch events (click and drag to change slides) */
  simulateTouch?: boolean = true;
  /** Set to false if you want to disable short swipes */
  shortSwipes?: boolean = true;
  /** Set to false if you want to disable long swipes */
  longSwipes?: boolean = true;
  /** Ratio to trigger swipe to next/previous slide during long swipes */
  longSwipesRatio?: number = 0.5;
  /** Minimal duration (in ms) to trigger swipe to next/previous slide during long swipes */
  longSwipesMs?: number = 300;
  /** If disabled, then slider will be animated only when you release it, it will not move while you hold your finger on it */
  followFinger?: boolean = true;
  /** If true, then the only way to switch the slide is use of external API functions like slidePrev or slideNext */
  onlyExternal?: boolean = false;
  /** Threshold value in px. If "touch distance" will be lower than this value then swiper will not move */
  threshold?: number = 0;
  /** If enabled, then propagation of "touchmove" will be stopped */
  touchMoveStopPropagation?: boolean = true;
  /** Enable to release Swiper events for swipe-to-go-back work in iOS UIWebView */
  iOSEdgeSwipeDetection?: boolean = false;
  /** Area (in px) from left edge of the screen to release touch events for swipe-to-go-back in iOS UIWebView */
  iOSEdgeSwipeThreshold?: number = 20;

  // Touch Resistance

  /** Set to false if you want to disable resistant bounds */
  resistance?: boolean = true;
  /** This option allows you to control resistance ratio */
  resistanceRatio?: number = 0.85;

  // Clicks

  /** Set to true to prevent accidental unwanted clicks on links during swiping */
  preventClicks?: boolean = true;
  /** Set to true to stop clicks event propagation on links during swiping */
  preventClicksPropagation?: boolean = true;
  /** Set to true and click on any slide will produce transition to this slide */
  slideToClickedSlide?: boolean = false;

  // Swiping / No swiping

  /** Set to false to disable swiping to previous slide direction (to left or top) */
  allowSwipeToPrev?: boolean = true;
  /** Set to false to disable swiping to next slide direction (to right or bottom) */
  allowSwipeToNext?: boolean = true;
  /** Set to false to disable swiping to next slide direction (to right or bottom) */
  noSwiping?: boolean = true;
  /** If true, then you can add noSwipingClass class to swiper's slide to prevent/disable swiping on this element */
  noSwipingClass?: string = 'swiper-no-swiping';
  /** String with CSS selector or HTML element of the container with pagination that will work as only available handler for swiping */
  swipeHandler?: string | HTMLElement = undefined;

  // Navigation Controls

  /** If enabled (by default) and navigation elements' parameters passed as a string (like ".pagination") then Swiper will look for such elements through child elements first. Applies for pagination, prev/next buttons and scrollbar elements */
  uniqueNavElements?: boolean = true;

  // Pagination

  /** String with CSS selector or HTML element of the container with pagination */
  pagination?: string | HTMLElement = undefined;
  /** String with type of pagination. Can be "bullets", "fraction", "progress" or "custom" */
  paginationType?: string = 'bullets';
  /** Toggle (hide/true) pagination container visibility when click on Slider's container */
  paginationHide?: boolean = true;
  /** If true then clicking on pagination button will cause transition to appropriate slide. Only for bullets pagination type */
  paginationClickable?: boolean = false;
  /** Defines which HTML tag will be use to represent single pagination bullet. . Only for bullets pagination type */
  paginationElement?: string = 'span';
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

  /** String with CSS selector or HTML element of the element that will work like "next" button after click on it */
  nextButton?: string | HTMLElement = undefined;
  /** String with CSS selector or HTML element of the element that will work like "prev" button after click on it */
  prevButton?: string | HTMLElement = undefined;

  // Scrollbar

  /** String with CSS selector or HTML element of the container with scrollbar. */
  scrollbar?: string | HTMLElement = undefined;
  /** Hide scrollbar automatically after user interaction */
  scrollbarHide?: boolean = true;
  /** Set to true to enable make scrollbar draggable that allows you to control slider position */
  scrollbarDraggable?: boolean = false;
  /** Set to true to snap slider position to slides when you release scrollbar */
  scrollbarSnapOnRelease?: boolean = false;

  // Accessibility

  /** Option to enable keyboard accessibility to provide foucsable navigation buttons and basic ARIA for screen readers */
  a11y?: boolean = false;
  /** Message for screen readers for previous button */
  prevSlideMessage?: string = 'Previous slide';
  /** Message for screen readers for next button */
  nextSlideMessage?: string = 'Next slide';
  /** Message for screen readers for previous button when swiper is on first slide */
  firstSlideMessage?: string = 'This is the first slide';
  /** Message for screen readers for previous button when swiper is on last slide */
  lastSlideMessage?: string = 'This is the last slide';
  /** Message for screen readers for single pagination bullet */
  paginationBulletMessage?: string = 'Go to slide {{index}}';

  // Keyboard / Mousewheel

  /** Set to true to enable navigation through slides using keyboard right and left (for horizontal mode), top and borrom (for vertical mode) keyboard arrows */
  keyboardControl?: boolean = false;
  /** Set to true to enable navigation through slides using mouse wheel */
  mousewheelControl?: boolean = false;
  /** Set to true to force mousewheel swipes to axis. So in horizontal mode mousewheel will work only with horizontal mousewheel scrolling, and only with vertical scrolling in vertical mode. */
  mousewheelForceToAxis?: boolean = false;
  /** Set to true and swiper will release mousewheel event and allow page scrolling when swiper is on edge positions (in the beginning or in the end) */
  mousewheelReleaseOnEdges?: boolean = false;
  /** Set to true to invert sliding direction */
  mousewheelInvert?: boolean = false;
  /** Multiplier of mousewheel data, allows to tweak mouse wheel sensitivity */
  mousewheelSensitivity?: number = 1;

  // Hash Navigation

  /** Set to true to enable hash url navigation to for slides */
  hashnav?: boolean = false;

  // Images

  /** When enabled Swiper will force to load all images */
  preloadImages?: boolean = true;
  /** When enabled Swiper will be reinitialized after all inner images (<img> tags) are loaded. Required preloadImages: true */
  updateOnImagesReady?: boolean = true;
  /** Set to "true" to enable images lazy loading. Note that preloadImages should be disabled */
  lazyLoading?: boolean = false;
  /** Set to "true" to enable lazy loading for the closest slides images (for previous and next slide images) */
  lazyLoadingInPrevNext?: boolean = false;
  /** Amount of next/prev slides to preload lazy images in. Can't be less than slidesPerView */
  lazyLoadingInPrevNextAmount?: number = 1;
  /** By default, Swiper will load lazy images after transition to this slide, so you may enable this parameter if you need it to start loading of new image in the beginning of transition */
  lazyLoadingOnTransitionStart?: boolean = false;

  // Loop

  /**
   * Set to true to enable continuous loop mode
   * If you use it along with slidesPerView: 'auto' then you need to specify loopedSlides parameter with amount of slides to loop (duplicate)
   */
  loop?: boolean = false;
  /** Addition number of slides that will be cloned after creating of loop */
  loopAdditionalSlides?: number = 0;
  /** If you use slidesPerView:'auto' with loop mode you should tell to Swiper how many slides it should loop (duplicate) using this parameter */
  loopedSlides?: number = undefined;

  // Controller

  /** Pass here another Swiper instance or array with Swiper instances that should be controlled by this Swiper */
  control?: Swiper = undefined;
  /** Set to true and controlling will be in inverse direction */
  controlInverse?: boolean = false;
  /** Can be 'slide' or 'container'. Defines a way how to control another slider: slide by slide (with respect to other slider's grid) or depending on all slides/container (depending on total slider percentage) */
  controlBy?: string = 'slide';

  // Observer

  /** Set to true to enable Mutation Observer on Swiper and its elements. In this case Swiper will be updated (reinitialized) each time if you change its style (like hide/show) or modify its child elements (like adding/removing slides) */
  observer?: boolean = false;
  /** Set to true if you also need to watch Mutations for Swiper parent elements */
  observeParents?: boolean = false;

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

  /** Run on[Transition/SlideChange][Start/End] callbacks on swiper initialization. Such callbacks will be fired on initialization in case of your initialSlide is not 0, or you use loop mode */
  runCallbacksOnInit?: boolean = true;
  /** Callback function, will be executed right after Swiper initialization */
  onInit?: (swiper) => any;
  /** Callback function, will be executed in the beginning of animation to other slide (next or previous). Receives swiper instance as an argument. */
  onSlideChangeStart?: (swiper) => any;
  /** Callback function, will be executed after animation to other slide (next or previous). Receives slider instance as an argument. */
  onSlideChangeEnd?: (swiper) => any;
  /** Same as "onSlideChangeStart" but for "forward" direction only */
  onSlideNextStart?: (swiper) => any;
  /** Same as "onSlideChangeEnd" but for "forward" direction only */
  onSlideNextEnd?: (swiper) => any;
  /** Same as "onSlideChangeStart" but for "backward" direction only */
  onSlidePrevStart?: (swiper) => any;
  /** Same as "onSlideChangeEnd" but for "backward" direction only */
  onSlidePrevEnd?: (swiper) => any;
  /** Callback function, will be executed in the beginning of transition. Receives swiper instance as an argument. */
  onTransitionStart?: (swiper) => any;
  /** Callback function, will be executed after transition. Receives slider instance as an argument. */
  onTransitionEnd?: (swiper) => any;
  /** Callback function, will be executed when user touch Swiper. Receives swiper instance and 'touchstart' event as an arguments. */
  onTouchStart?: (swiper, event) => any;
  /** Callback function, will be executed when user touch and move finger over Swiper. Receives swiper instance and 'touchmove' event as an arguments. */
  onTouchMove?: (swiper, event) => any;
  /** Callback function, will be executed when user touch and move finger over Swiper in direction opposite to direction parameter. Receives swiper instance and 'touchmove' event as an arguments. */
  onTouchMoveOpposite?: (swiper, event) => any;
  /** Callback function, will be executed when user touch and move finger over Swiper and move it. Receives swiper instance and 'touchmove' event as an arguments. */
  onSliderMove?: (swiper, event) => any;
  /** Callback function, will be executed when user release Swiper. Receives swiper instance and 'touchend' event as an arguments. */
  onTouchEnd?: (swiper, event) => any;
  /** Callback function, will be executed when user click/tap on Swiper after 300ms delay. Receives swiper instance and 'touchend' event as an arguments. */
  onClick?: (swiper, event) => any;
  /** Callback function, will be executed when user click/tap on Swiper. Receives swiper instance and 'touchend' event as an arguments. */
  onTap?: (swiper, event) => any;
  /** Callback function, will be executed when user double tap on Swiper's container. Receives swiper instance and 'touchend' event as an arguments */
  onDoubleTap?: (swiper, event) => any;
  /** Callback function, will be executed right after all inner images are loaded. updateOnImagesReady should be also enabled */
  onImagesReady?: (swiper) => any;
  /** Callback function, will be executed when Swiper progress is changed, as second arguments it receives progress that is always from 0 to 1 */
  onProgress?: (swiper, progress) => any;
  /** Callback function, will be executed when Swiper reach its beginning (initial position) */
  onReachBeginning?: (swiper) => any;
  /** Callback function, will be executed when Swiper reach last slide */
  onReachEnd?: (swiper) => any;
  /** Callback function, will be executed when you destroy Swiper */
  onDestroy?: (swiper) => any;
  /** Callback function, will be executed when swiper's wrapper change its position. Receives swiper instance and current translate value as an arguments */
  onSetTranslate?: (swiper, translate) => any;
  /** Callback function, will be executed everytime when swiper starts animation. Receives swiper instance and current transition duration (in ms) as an arguments */
  onSetTransition?: (swiper, transition) => any;
  /** Same as onSlideChangeStart but caused by autoplay */
  onAutoplay?: (swiper) => any;
  /** Callback function, will be executed when when autoplay started */
  onAutoplayStart?: (swiper) => any;
  /** Callback function, will be executed when when autoplay stopped */
  onAutoplayStop?: (swiper) => any;
  /** Callback function, will be executed in the beginning of lazy loading of image */
  onLazyImageLoad?: (swiper, slide, image) => any;
  /** Callback function, will be executed when lazy loading image will be loaded */
  onLazyImageReady?: (swiper, slide, image) => any;
  /** Callback function, will be executed after pagination elements generated and added to DOM */
  onPaginationRendered?: (swiper, paginationContainer) => any;

  // Namespace

  /** CSS class name of slide */
  slideClass?: string = 'swiper-slide';
  /** CSS class name of currently active slide */
  slideActiveClass?: string = 'swiper-slide-active';
  /** CSS class name of currently visible slide */
  slideVisibleClass?: string = 'swiper-slide-visible';
  /** CSS class name of slide duplicated by loop mode */
  slideDuplicateClass?: string = 'swiper-slide-duplicate';
  /** CSS class name of slide which is right after currently active slide */
  slideNextClass?: string = 'swiper-slide-next';
  /** CSS class name of slide which is right before currently active slide */
  slidePrevClass?: string = 'swiper-slide-prev';
  /** CSS class name of slides' wrapper */
  wrapperClass?: string = 'swiper-wrapper';
  /** CSS class name of single pagination bullet */
  bulletClass?: string = 'swiper-pagination-bullet';
  /** CSS class name of currently active pagination bullet */
  bulletActiveClass?: string = 'swiper-pagination-bullet-active';
  /** CSS class name of pagination when it becomes inactive */
  paginationHiddenClass?: string = 'swiper-pagination-hidden';
  /** CSS class name of the element with currently active index in "fraction" pagination */
  paginationCurrentClass?: string = 'swiper-pagination-current';
  /** CSS class name of the element with total number of "snaps" in "fraction" pagination */
  paginationTotalClass?: string = 'swiper-pagination-total';
  /** CSS class name of pagination progressbar */
  paginationProgressbarClass?: string = 'swiper-pagination-progressbar';
  /** CSS class name of next/prev button when it becomes disabled */
  buttonDisabledClass?: string = 'swiper-button-disabled';
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
   * @param {boolean} updateTranslate - Set it to true (by default it is false) to hard set/reset/update Swiper wrapper translate. It is useful if you use not default effect or scrollbar.
   */
  update(updateTranslate: boolean = false);

  /**
   * Recalculate size of swiper container
   */
  updateContainerSize();

  /**
   * Recalculate number of slides and their offsets. Useful after you add/remove slides with JavaScript
   */
  updateSlidesSize();

  /**
   * Recalculate swiper progress
   */
  updateProgress();

  /**
   * Updates pagination layout and re-render bullets
   */
  updatePagination();

  /**
   * Update active/prev/next classes on slides and bullets
   */
  updateClasses();

  /**
   * Swiper executes this method when you resize browser. It is almost the same as .update() but a bit softer, without hard setting translate
   */
  onResize();

  /**
   * Detach all events listeners
   */
  detachEvents();

  /**
   * Atach all events listeners again
   */
  attachEvents();

  /**
   * Start auto play. It may be useful for custom "Play" and "Pause" buttons
   */
  startAutoplay();

  /**
   * Stop auto play. It may be useful for custom "Play" and "Pause" buttons
   */
  stopAutoplay();

  /**
   * Destroy slider instance and detach all events listeners, where
   * @param {boolean} deleteInstance - Set it to false (by default it is true) to not to delete Swiper instance
   * @param {boolean} cleanupStyles - Set it to true (by default it is false) and all custom styles will be removed from slides, wrapper and container. Useful if you need to destroy Swiper and to init again with new options or in different direction
   */
  destroy(deleteInstance: boolean = true, cleanupStyles: boolean = false);

  /**
   * Add new slides to the end.
   * @param {HTMLElement | HTMLElement[] | string | string[]} slides - Slide or slides you wish to add to the Swiper
   */
  appendSlide(slides: HTMLElement | HTMLElement[] | string | string[]);

  /**
   * Add new slides to the beginning.
   * @param {HTMLElement | HTMLElement[] | string | string[]} slides - Slide or slides you wish to add to the Swiper
   */
  prependSlide(slides: HTMLElement | HTMLElement[] | string | string[]);

  /**
   * Remove selected slides.
   * @param {number | number[]} slideIndex - Index or indices of slides to remove from the Swiper
   */
  removeSlide(slideIndex: number | number[]);

  /**
   * Remove all slides
   */
  removeAllSlides();

  /**
   * Set custom css3 transform's translate value for swiper wrapper
   * @param {number} translate - value to translate the swiper wrapper by
   */
  setWrapperTranslate(translate: number);

  /**
   * Get current value of swiper wrapper css3 transform translate
   * @return {number} current value of swiper wrapper css3 transform translate
   */
  getWrapperTranslate(): number;

  /**
   * Add callback/event handler
   * @param {string} callback - The event type to listen for.
   * @param {(...args: any) => any} handler - The method to be called when an event occurs.
   * @return {Swiper}
   */
  on(callback: string, handler: (...args: any) => any): Swiper;

  /**
   * Add event/callback that will be executed only once
   * @param {string} callback - The event type to listen for.
   * @param {(...args: any) => any} handler - The method to be called when an event occurs.
   * @return {Swiper}
   */
  once(callback: string, handler: (...args: any) => any): Swiper;

  /**
   * Remove all handlers for specified callback/event
   * @param {string} callback - The event type to stop listening for.
   * @return {Swiper}
   */
  off(callback: string): Swiper;

  /**
   * Disable (lock) ability to slide to the next slides
   */
  lockSwipeToNext();

  /**
   * Enable (unlock) ability to slide to the next slides
   */
  unlockSwipeToNext();

  /**
   * Disable (lock) ability to slide to the previous slides
   */
  lockSwipeToPrev();

  /**
   * Enable (unlock) ability to slide to the previous slides
   */
  unlockSwipeToPrev();

  /**
   * Disable (lock) ability to change slides
   */
  lockSwipes();

  /**
   * Enable (unlock) ability to change slides
   */
  unlockSwipes();

  /**
   * Disable mousewheel control
   */
  disableMousewheelControl();

  /**
   * Enable mousewheel control
   */
  enableMousewheelControl();

  /**
   * Enable keyboard control
   */
  enableKeyboardControl();

  /**
   * Disable keyboard control
   */
  disableKeyboardControl();
}
