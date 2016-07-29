export interface SwiperOptions {
  initialSlide?: number; // 0 \\ Index number of initial slide.
  direction?: string; // 'horizontal' \\ Could be 'horizontal' or 'vertical' (for vertical slider).
  speed?: number; // 300 \\ Duration of transition between slides (in ms)
  setWrapperSize?: boolean; // false \\ Enabled this option and plugin will set width/height on swiper wrapper equal to total size of all slides. Mostly should be used as compatibility fallback option for browser that don't support flexbox layout well
  virtualTranslate?: boolean; // false \\ Enabled this option and swiper will be operated as usual except it will not move, real translate values on wrapper will not be set. Useful when you may need to create custom slide transition
  width?: number; // - \\ Swiper width (in px). Parameter allows to force Swiper width. Useful only if you initialize Swiper when it is hidden.
    // Setting this parameter will make Swiper not responsive
  height?: number; // - \\ Swiper height (in px). Parameter allows to force Swiper height. Useful only if you initialize Swiper when it is hidden.
    // Setting this parameter will make Swiper not responsive
  autoHeight?: boolean; // false \\ Set to true and slider wrapper will adopt its height to the height of the currently active slide
  roundLengths?: boolean; // false \\ Set to true to round values of slides width and height to prevent blurry texts on usual resolution screens (if you have such)
  nested?: boolean; // false \\ Set to true on nested Swiper for correct touch events interception. Use only on nested swipers that use same direction as the parent one

  // Autoplay
  autoplay?: number; // - \\ delay between transitions (in ms). If this parameter is not specified, auto play will be disabled
  autoplayStopOnLast?: boolean; // false \\ Enable this parameter and autoplay will be stopped when it reaches last slide (has no effect in loop mode)
  autoplayDisableOnInteraction?: boolean; // true \\ Set to false and autoplay will not be disabled after user interactions (swipes), it will be restarted every time after interaction

  // Progress
  watchSlidesProgress?: boolean; // false \\ Enable this feature to calculate each slides progress
  watchSlidesVisibility?: boolean; // false \\ watchSlidesProgress should be enabled. Enable this option and slides that are in viewport will have additional visible class

  // Freemode
  freeMode?: boolean; // false \\ If true then slides will not have fixed positions
  freeModeMomentum?: boolean; // true \\ If true, then slide will keep moving for a while after you release it
  freeModeMomentumRatio?: number; // 1 \\ Higher value produces larger momentum distance after you release slider
  freeModeMomentumBounce?: boolean; // true \\ Set to false if you want to disable momentum bounce in free mode
  freeModeMomentumBounceRatio?: number; // 1 \\ Higher value produces larger momentum bounce effect
  freeModeMinimumVelocity?: number; // 0.02 \\ Minimum touchmove-velocity required to trigger free mode momentum
  freeModeSticky?: boolean; // false \\ Set to true to enable snap to slides positions in free mode

  // Effects
  effect?: string; // 'slide' \\ Could be "slide", "fade", "cube", "coverflow" or "flip"
  fade?: {crossFade: boolean}; // {crossFade: false} \\ Fade effect parameters
  cube?: {slideShadows: boolean; shadow: boolean; shadowOffset: number; shadowScale: number}; // {slideShadows: true; shadow: true; shadowOffset: 20; shadowScale: 0.94} \\ Cube effect parameters. For better performance you may disable shadows
  coverflow?: {rotate: number; stretch: number; depth: number; modifier: number; slideShadows: boolean}; // {rotate: 50; stretch: 0; depth: 100; modifier: 1; slideShadows: true} \\ Coverflow effect parameters. For better performance you may disable shadows
  flip?: {slideShadows: boolean; limitRotation: boolean}; // {slideShadows: true; limitRotation: true} \\ Flip effect parameters. limitRotation (when enabled) limits slides rotation angle to 180deg maximum. It allows to quickly "flip" between different slides. If you use "slow" transitions then it is better to disable it.

  // Parallax
  parallax?: boolean; // false \\ Enable, if you want to use "parallaxed" elements inside of slider

  // Slides grid
  spaceBetween?: number; // 0 \\ Distance between slides in px.
  slidesPerView?: number | string; // 1 \\ Number or 'auto' Number of slides per view (slides visible at the same time on slider's container).
    // If you use it with "auto" value and along with loop: true then you need to specify loopedSlides parameter with amount of slides to loop (duplicate)
    // slidesPerView: 'auto' is currently not compatible with multirow mode, when slidesPerColumn > 1
  slidesPerColumn?: number; // 1 \\ Number of slides per column, for multirow layout
  slidesPerColumnFill?: string; // 'column' \\ Could be 'column' or 'row'. Defines how slides should fill rows, by column or by row
  slidesPerGroup?: number; // 1 \\ Set numbers of slides to define and enable group sliding. Useful to use with slidesPerView > 1
  centeredSlides?: boolean; // false \\ If true, then active slide will be centered, not always on the left side.
  slidesOffsetBefore?: number; // 0 \\ Add (in px) additional slide offset in the beginning of the container (before all slides)
  slidesOffsetAfter?: number; // 0 \\ Add (in px) additional slide offset in the end of the container (after all slides)

  // Grab Cursor
  grabCursor?: boolean; // false \\ This option may a little improve desktop usability. If true, user will see the "grab" cursor when hover on Swiper

  // Touches
  touchEventsTarget?: string; // 'container' \\ Target element to listen touch events on. Can be 'container' (to listen for touch events on swiper-container) or 'wrapper' (to listen for touch events on swiper-wrapper)
  touchRatio?: number; // 1 \\ Touch ration
  touchAngle?: number; // 45 \\ Allowable angle (in degrees) to trigger touch move
  simulateTouch?: boolean; // true \\ If true, Swiper will accept mouse events like touch events (click and drag to change slides)
  shortSwipes?: boolean; // true \\ Set to false if you want to disable short swipes
  longSwipes?: boolean; // true \\ Set to false if you want to disable long swipes
  longSwipesRatio?: number; // 0.5 \\ Ratio to trigger swipe to next/previous slide during long swipes
  longSwipesMs?: number; // 300 \\ Minimal duration (in ms) to trigger swipe to next/previous slide during long swipes
  followFinger?: boolean; // true \\ If disabled, then slider will be animated only when you release it, it will not move while you hold your finger on it
  onlyExternal?: boolean; // false \\ If true, then the only way to switch the slide is use of external API functions like slidePrev or slideNext
  threshold?: number; // 0 \\ Threshold value in px. If "touch distance" will be lower than this value then swiper will not move
  touchMoveStopPropagation?: boolean; // true \\ If enabled, then propagation of "touchmove" will be stopped
  iOSEdgeSwipeDetection?: boolean; // false \\ Enable to release Swiper events for swipe-to-go-back work in iOS UIWebView
  iOSEdgeSwipeThreshold?: number; // 20 \\ Area (in px) from left edge of the screen to release touch events for swipe-to-go-back in iOS UIWebView

  // Touch Resistance
  resistance?: boolean; // true \\ Set to false if you want to disable resistant bounds
  resistanceRatio?: number; // 0.85 \\ This option allows you to control resistance ratio

  // Clicks
  preventClicks?: boolean; // true \\ Set to true to prevent accidental unwanted clicks on links during swiping
  preventClicksPropagation?: boolean; // true \\ Set to true to stop clicks event propagation on links during swiping
  slideToClickedSlide?: boolean; // false \\ Set to true and click on any slide will produce transition to this slide

  // Swiping / No swiping
  allowSwipeToPrev?: boolean; // true \\ Set to false to disable swiping to previous slide direction (to left or top)
  allowSwipeToNext?: boolean; // true \\ Set to false to disable swiping to next slide direction (to right or bottom)
  noSwiping?: boolean; // true \\ Set to false to disable swiping to next slide direction (to right or bottom)
  noSwipingClass?: string; // 'swiper-no-swiping' \\ If true, then you can add noSwipingClass class to swiper's slide to prevent/disable swiping on this element
  swipeHandler?: string | HTMLElement; // null \\ String with CSS selector or HTML element of the container with pagination that will work as only available handler for swiping

  // Navigation Controls
  uniqueNavElements?: boolean; // true \\ If enabled (by default) and navigation elements' parameters passed as a string (like ".pagination") then Swiper will look for such elements through child elements first. Applies for pagination, prev/next buttons and scrollbar elements

  // Pagination
  pagination?: string | HTMLElement; // null \\ String with CSS selector or HTML element of the container with pagination
  paginationType?: string; // 'bullets' \\ String with type of pagination. Can be "bullets", "fraction", "progress" or "custom"
  paginationHide?: boolean; // true \\ Toggle (hide/true) pagination container visibility when click on Slider's container
  paginationClickable?: boolean; // false \\ If true then clicking on pagination button will cause transition to appropriate slide. Only for bullets pagination type
  paginationElement?: string; // 'span' \\ Defines which HTML tag will be use to represent single pagination bullet. . Only for bullets pagination type
  paginationBulletRender?: (index?: number, className?: string) => any; // - \\ This parameter allows totally customize pagination bullets, you need to pass here a function that accepts index number of pagination bullet and required element class name (className). Only for bullets pagination type
    // For example, with this code, we can add slide number into pagination bullet:
    //
    // var swiper = new Swiper('.swiper-container', {
    //   //...
    //   paginationBulletRender: function (index, className) {
    //       return '<span class="' + className + '">' + (index + 1) + '</span>';
    //   }
    // });
  paginationFractionRender?: (swiper?: Swiper, currentClassName?: string, totalClassName?: string) => any; // - \\ This parameter allows to customize "fraction" pagination html. Only for fraction pagination type
    // For example:
    //
    // var swiper = new Swiper('.swiper-container', {
    //   //...
    //   paginationFractionRender: function (swiper, currentClassName, totalClassName) {
    //       return '<span class="' + currentClassName + '"></span>' +
    //              ' of ' +
    //              '<span class="' + totalClassName + '"></span>';
    //   }
    // });
  paginationProgressRender?: (swiper?: Swiper, progressbarClass?: string) => any; // - \\ This parameter allows to customize "progress" pagination. Only for progress pagination type
    // For example:
    //
    // var swiper = new Swiper('.swiper-container', {
    //   //...
    //   paginationProgressRender: function (swiper, progressbarClass) {
    //       return '<span class="' + progressbarClass + '"></span>';
    //   }
    // });
  paginationCustomRender?: (swiper?: Swiper, current?: number, total?: number) => any; // - \\ This parameter is required for custom pagination type where you have to specify how it should be rendered
    // For example:
    //
    // var swiper = new Swiper('.swiper-container', {
    //   //...
    //   paginationCustomRender: function (swiper, current, total) {
    //       return current + ' of ' + total;
    //   }
    // });

  // Navigation Buttons
  nextButton?: string | HTMLElement; // null \\ String with CSS selector or HTML element of the element that will work like "next" button after click on it
  prevButton?: string | HTMLElement; // null \\ String with CSS selector or HTML element of the element that will work like "prev" button after click on it

  // Scrollbar
  scrollbar?: string | HTMLElement; // null \\ String with CSS selector or HTML element of the container with scrollbar.
  scrollbarHide?: boolean; // true \\ Hide scrollbar automatically after user interaction
  scrollbarDraggable?: boolean; // false \\ Set to true to enable make scrollbar draggable that allows you to control slider position
  scrollbarSnapOnRelease?: boolean; // false \\ Set to true to snap slider position to slides when you release scrollbar

  // Accessibility
  a11y?: boolean; // false \\ Option to enable keyboard accessibility to provide foucsable navigation buttons and basic ARIA for screen readers
  prevSlideMessage?: string; // 'Previous slide' \\ Message for screen readers for previous button
  nextSlideMessage?: string; // 'Next slide' \\ Message for screen readers for next button
  firstSlideMessage?: string; // 'This is the first slide' \\ Message for screen readers for previous button when swiper is on first slide
  lastSlideMessage?: string; // 'This is the last slide' \\ Message for screen readers for previous button when swiper is on last slide
  paginationBulletMessage?: string; // 'Go to slide {{index}}' \\ Message for screen readers for single pagination bullet

  // Keyboard / Mousewheel
  keyboardControl?: boolean; // false \\ Set to true to enable navigation through slides using keyboard right and left (for horizontal mode), top and borrom (for vertical mode) keyboard arrows
  mousewheelControl?: boolean; // false \\ Set to true to enable navigation through slides using mouse wheel
  mousewheelForceToAxis?: boolean; // false \\ Set to true to force mousewheel swipes to axis. So in horizontal mode mousewheel will work only with horizontal mousewheel scrolling, and only with vertical scrolling in vertical mode.
  mousewheelReleaseOnEdges?: boolean; // false \\ Set to true and swiper will release mousewheel event and allow page scrolling when swiper is on edge positions (in the beginning or in the end)
  mousewheelInvert?: boolean; // false \\ Set to true to invert sliding direction
  mousewheelSensitivity?: number; // 1 \\ Multiplier of mousewheel data, allows to tweak mouse wheel sensitivity

  // Hash Navigation
  hashnav?: boolean; // false \\ Set to true to enable hash url navigation to for slides

  // Images
  preloadImages?: boolean; // true \\ When enabled Swiper will force to load all images
  updateOnImagesReady?: boolean; // true \\ When enabled Swiper will be reinitialized after all inner images (<img> tags) are loaded. Required preloadImages: true
  lazyLoading?: boolean; // false \\ Set to "true" to enable images lazy loading. Note that preloadImages should be disabled
  lazyLoadingInPrevNext?: boolean; // false \\ Set to "true" to enable lazy loading for the closest slides images (for previous and next slide images)
  lazyLoadingInPrevNextAmount?: number; // 1 \\ Amount of next/prev slides to preload lazy images in. Can't be less than slidesPerView
  lazyLoadingOnTransitionStart?: boolean; // false \\ By default, Swiper will load lazy images after transition to this slide, so you may enable this parameter if you need it to start loading of new image in the beginning of transition

  // Loop
  loop?: boolean; // false \\ Set to true to enable continuous loop mode
    // If you use it along with slidesPerView: 'auto' then you need to specify loopedSlides parameter with amount of slides to loop (duplicate)
  loopAdditionalSlides?: number; // 0 \\ Addition number of slides that will be cloned after creating of loop
  loopedSlides?: number; // null \\ If you use slidesPerView:'auto' with loop mode you should tell to Swiper how many slides it should loop (duplicate) using this parameter

  // Controller
  control?: Swiper; // undefined \\ Pass here another Swiper instance or array with Swiper instances that should be controlled by this Swiper
  controlInverse?: boolean; // false \\ Set to true and controlling will be in inverse direction
  controlBy?: string; // 'slide' \\ Can be 'slide' or 'container'. Defines a way how to control another slider: slide by slide (with respect to other slider's grid) or depending on all slides/container (depending on total slider percentage)

  // Observer
  observer?: boolean; // false \\ Set to true to enable Mutation Observer on Swiper and its elements. In this case Swiper will be updated (reinitialized) each time if you change its style (like hide/show) or modify its child elements (like adding/removing slides)
  observeParents?: boolean; // false \\ Set to true if you also need to watch Mutations for Swiper parent elements

  // Breakpoints
  breakpoints?: {[key: number]: {slidesPerView: number; spaceBetweenSlides: number}}; // - \\ Allows to set different parameter for different responsive breakpoints (screen sizes). Not all parameters can be changed in breakpoints, only those which are not required different layout and logic, like slidesPerView, slidesPerGroup, spaceBetween. Such parameters like slidesPerColumn, loop, direction, effect won't work. For example:
    // var swiper = new Swiper('.swiper-container', {
    //     // Default parameters
    //     slidesPerView: 4,
    //     spaceBetween: 40,
    //     // Responsive breakpoints
    //     breakpoints: {
    //         // when window width is <= 320px
    //         320: {
    //             slidesPerView: 1,
    //             spaceBetweenSlides: 10
    //         },
    //         // when window width is <= 480px
    //         480: {
    //             slidesPerView: 2,
    //             spaceBetweenSlides: 20
    //         },
    //         // when window width is <= 640px
    //         640: {
    //             slidesPerView: 3,
    //             spaceBetweenSlides: 30
    //         }
    //     }
    // })

  // Callbacks
  runCallbacksOnInit?: boolean; // true \\ Run on[Transition/SlideChange][Start/End] callbacks on swiper initialization. Such callbacks will be fired on initialization in case of your initialSlide is not 0, or you use loop mode
  onInit?: (swiper) => any; // Callback function, will be executed right after Swiper initialization
  onSlideChangeStart?: (swiper) => any; // Callback function, will be executed in the beginning of animation to other slide (next or previous). Receives swiper instance as an argument.
  onSlideChangeEnd?: (swiper) => any; // Callback function, will be executed after animation to other slide (next or previous). Receives slider instance as an argument.
  onSlideNextStart?: (swiper) => any; // Same as "onSlideChangeStart" but for "forward" direction only
  onSlideNextEnd?: (swiper) => any; // Same as "onSlideChangeEnd" but for "forward" direction only
  onSlidePrevStart?: (swiper) => any; // Same as "onSlideChangeStart" but for "backward" direction only
  onSlidePrevEnd?: (swiper) => any; // Same as "onSlideChangeEnd" but for "backward" direction only
  onTransitionStart?: (swiper) => any; // Callback function, will be executed in the beginning of transition. Receives swiper instance as an argument.
  onTransitionEnd?: (swiper) => any; // Callback function, will be executed after transition. Receives slider instance as an argument.
  onTouchStart?: (swiper, event) => any; // Callback function, will be executed when user touch Swiper. Receives swiper instance and 'touchstart' event as an arguments.
  onTouchMove?: (swiper, event) => any; // Callback function, will be executed when user touch and move finger over Swiper. Receives swiper instance and 'touchmove' event as an arguments.
  onTouchMoveOpposite?: (swiper, event) => any; // Callback function, will be executed when user touch and move finger over Swiper in direction opposite to direction parameter. Receives swiper instance and 'touchmove' event as an arguments.
  onSliderMove?: (swiper, event) => any; // Callback function, will be executed when user touch and move finger over Swiper and move it. Receives swiper instance and 'touchmove' event as an arguments.
  onTouchEnd?: (swiper, event) => any; // Callback function, will be executed when user release Swiper. Receives swiper instance and 'touchend' event as an arguments.
  onClick?: (swiper, event) => any; // Callback function, will be executed when user click/tap on Swiper after 300ms delay. Receives swiper instance and 'touchend' event as an arguments.
  onTap?: (swiper, event) => any; // Callback function, will be executed when user click/tap on Swiper. Receives swiper instance and 'touchend' event as an arguments.
  onDoubleTap?: (swiper, event) => any; // Callback function, will be executed when user double tap on Swiper's container. Receives swiper instance and 'touchend' event as an arguments
  onImagesReady?: (swiper) => any; // Callback function, will be executed right after all inner images are loaded. updateOnImagesReady should be also enabled
  onProgress?: (swiper, progress) => any; // Callback function, will be executed when Swiper progress is changed, as second arguments it receives progress that is always from 0 to 1
  onReachBeginning?: (swiper) => any; // Callback function, will be executed when Swiper reach its beginning (initial position)
  onReachEnd?: (swiper) => any; // Callback function, will be executed when Swiper reach last slide
  onDestroy?: (swiper) => any; // Callback function, will be executed when you destroy Swiper
  onSetTranslate?: (swiper, translate) => any; // Callback function, will be executed when swiper's wrapper change its position. Receives swiper instance and current translate value as an arguments
  onSetTransition?: (swiper, transition) => any; // Callback function, will be executed everytime when swiper starts animation. Receives swiper instance and current transition duration (in ms) as an arguments
  onAutoplay?: (swiper) => any; // Same as onSlideChangeStart but caused by autoplay
  onAutoplayStart?: (swiper) => any; // Callback function, will be executed when when autoplay started
  onAutoplayStop?: (swiper) => any; // Callback function, will be executed when when autoplay stopped
  onLazyImageLoad?: (swiper, slide, image) => any; // Callback function, will be executed in the beginning of lazy loading of image
  onLazyImageReady?: (swiper, slide, image) => any; // Callback function, will be executed when lazy loading image will be loaded
  onPaginationRendered?: (swiper, paginationContainer) => any; // Callback function, will be executed after pagination elements generated and added to DOM

  // Namespace
  slideClass?: string; // 'swiper-slide' \\ CSS class name of slide
  slideActiveClass?: string; // 'swiper-slide-active' \\ CSS class name of currently active slide
  slideVisibleClass?: string; // 'swiper-slide-visible' \\ CSS class name of currently visible slide
  slideDuplicateClass?: string; // 'swiper-slide-duplicate' \\ CSS class name of slide duplicated by loop mode
  slideNextClass?: string; // 'swiper-slide-next' \\ CSS class name of slide which is right after currently active slide
  slidePrevClass?: string; // 'swiper-slide-prev' \\ CSS class name of slide which is right before currently active slide
  wrapperClass?: string; // 'swiper-wrapper' \\ CSS class name of slides' wrapper
  bulletClass?: string; // 'swiper-pagination-bullet' \\ CSS class name of single pagination bullet
  bulletActiveClass?: string; // 'swiper-pagination-bullet-active' \\ CSS class name of currently active pagination bullet
  paginationHiddenClass?: string; // 'swiper-pagination-hidden' \\ CSS class name of pagination when it becomes inactive
  paginationCurrentClass?: string; // 'swiper-pagination-current' \\ CSS class name of the element with currently active index in "fraction" pagination
  paginationTotalClass?: string; // 'swiper-pagination-total' \\ CSS class name of the element with total number of "snaps" in "fraction" pagination
  paginationProgressbarClass?: string; // 'swiper-pagination-progressbar' \\ CSS class name of pagination progressbar
  buttonDisabledClass?: string; // 'swiper-button-disabled' \\ CSS class name of next/prev button when it becomes disabled
}

export declare class Swiper {
  constructor (container: HTMLElement | string, params: SwiperOptions);

  // Properties
  params: SwiperOptions; // Object with passed initialization parameters
  container: HTMLElement | any; // Dom7/jQuery element with slider container HTML element. To get vanilla HTMLElement use mySwiper.container[0]
  wrapper: HTMLElement | any; // Dom7/jQuery element with slider wrapper HTML element. To get vanilla HTMLElement use mySwiper.wrapper[0]
  slides: HTMLElement | any; // Dom7/jQuery array-like collection of slides HTML elements. To get specific slide HTMLElement use mySwiper.slides[1]
  nextButton: HTMLElement | any; // Dom7/jQuery element with next button HTML element. To get vanilla HTMLElement use mySwiper.nextButton[0]
  prevButton: HTMLElement | any; // Dom7/jQuery element with prev button HTML element. To get vanilla HTMLElement use mySwiper.prevButton[0]
  bullets: HTMLElement | any; // Dom7/jQuery collection of pagination buttons HTML elements. To get specific slide HTMLElement use mySwiper.bullets[1]
  width: number; // Width of container
  height: number; // Height of container
  translate: any; // Current value of wrapper translate
  progress: number; // Current progress of wrapper translate (from 0 to 1)
  activeIndex: number; // Index number of currently active slide
    // Note, that in loop mode active index value will be always shifted on a number of looped/duplicated slides
  previousIndex: number; // Index number of previously active slide
  isBeginning: boolean; // true if slider on most "left"/"top" position
  isEnd: boolean; // true if slider on most "right"/"bottom" position
  autoplaying: boolean; // true if autoplay is enabled
  animating: boolean; // true if swiper is in transition
  // TODO: figure out what diff is
  touches: {startX: number; startY: number; currentX: number; currentY: number; diff: any};
  clickedIndex: number; // Index number of last clicked slide
  clickedSlide: HTMLElement; // Link to last clicked slide (HTMLElement)

  // Methods
  slideNext(runCallbacks: boolean, speed: number): boolean; // Run transition to next slide
    // runCallbacks - boolean - Set it to false (by default it is true) and transition will not produce onSlideChange callback functions. Optional
    // speed - number - transition duration (in ms). Optional
  slidePrev(runCallbacks: boolean, speed: number): boolean; // Run transition to previous slide
    // runCallbacks - boolean - Set it to false (by default it is true) and transition will not produce onSlideChange callback functions. Optional
    // speed - number - transition duration (in ms). Optional
  slideTo(index: number, speed: number, runCallbacks: boolean): boolean; // Run transition to the slide with index number equal to 'index' parameter for the duration equal to 'speed' parameter.
    // index - number - index number of slide
    // speed - number - transition duration (in ms). Optional
    // runCallbacks - boolean - Set it to false (by default it is true) and transition will not produce onSlideChange callback functions. Optional
  update(updateTranslate: boolean): any; //
    // This method includes updateContainerSize, updateSlidesSize, updateProgress, updatePagination and updateClasses methods
    //
    // You should call it after you add/remove slides manually, or after you hide/show it, or do any custom DOM modifications with Swiper
    //
    // updateTranslate - boolean - Set it to true (by default it is false) to hard set/reset/update Swiper wrapper translate. It is useful if you use not default effect or scrollbar. Optional
    // This method also includes subcall of the following methods which you can use separately:
    //
    // mySwiper.updateContainerSize(); - recalculate size of swiper container
    // mySwiper.updateSlidesSize(); - recalculate number of slides and their offsets. Useful after you add/remove slides with JavaScript
    // mySwiper.updateProgress(); - recalculate swiper progress
    // mySwiper.updatePagination(); - updates pagination layout and re-render bullets
    // mySwiper.updateClasses(); - update active/prev/next classes on slides and bullets
  onResize(); // Swiper executes this method when you resize browser. It is almost the same as .update() but a bit softer, without hard setting translate
  detachEvents(); // Detach all events listeners
  attachEvents(); // Atach all events listeners again
  startAutoplay(); // start auto play. It may be useful for custom "Play" and "Pause" buttons
  stopAutoplay(); // stop auto play. It may be useful for custom "Play" and "Pause" buttons
  destroy(deleteInstance: boolean, cleanupStyles: boolean); // Destroy slider instance and detach all events listeners, where
    // deleteInstance - boolean - Set it to false (by default it is true) to not to delete Swiper instance
    // cleanupStyles - boolean - Set it to true (by default it is false) and all custom styles will be removed from slides, wrapper and container. Useful if you need to destroy Swiper and to init again with new options or in different direction
  appendSlide(slides: HTMLElement | HTMLElement[] | string | string[]); // Add new slides to the end. slides could be HTMLElement or HTML string with new slide or array with such slides, for example:
    // mySwiper.appendSlide('<div class="swiper-slide">Slide 10"</div>')
    // mySwiper.appendSlide([
    //    '<div class="swiper-slide">Slide 10"</div>',
    //    '<div class="swiper-slide">Slide 11"</div>'
    // ]);
  prependSlide(slides: HTMLElement | HTMLElement[] | string | string[]); // Add new slides to the beginning. slides could be HTMLElement or HTML string with new slide or array with such slides, for example:
    // mySwiper.prependSlide('<div class="swiper-slide">Slide 0"</div>')
    // mySwiper.prependSlide([
    //    '<div class="swiper-slide">Slide 1"</div>',
    //    '<div class="swiper-slide">Slide 2"</div>'
    // ]);
  removeSlide(slideIndex: number | number[]); // Remove selected slides. slideIndex could be a number with slide index to remove or array with indexes, for example:
    // mySwiper.removeSlide(0); //remove first slide
    // mySwiper.removeSlide([0, 1]); //remove first and second slides
  removeAllSlides(); // Remove all slides
  // TODO: figure out if this is actually right
  setWrapperTranslate(translate: string); // Set custom css3 transform's translate value for swiper wrapper
  // TODO: figure out what this actually returns
  getWrapperTranslate(): any; // Get current value of swiper wrapper css3 transform translate
  // TODO: figure out what the callback and handler should do
  on(callback: string, handler: () => any | any); // Add callback/event handler
  once(callback: string, handler: () => any | any); // Add event/callback that will be executed only once
  off(callback: string); // Remove all handlers for specified callback/event
  lockSwipeToNext(); // Disable (lock) ability to slide to the next slides
  unlockSwipeToNext(); // Enable (unlock) ability to slide to the next slides
  lockSwipeToPrev(); // Disable (lock) ability to slide to the previous slides
  unlockSwipeToPrev(); // Enable (unlock) ability to slide to the previous slides
  lockSwipes(); // Disable (lock) ability to change slides
  unlockSwipes(); // Enable (unlock) ability to change slides
  disableMousewheelControl(); // Disable mousewheel control
  enableMousewheelControl(); // Enable mousewheel control
  disableKeyboardControl(); // Disable keyboard control
  enableKeyboardControl(); // Enable keyboard control
}
