
export const SWIPER_DEFAULTS = {
  direction: 'horizontal',
  touchEventsTarget: 'container',
  initialSlide: 0,
  speed: 300,

  // autoplay
  autoplay: false,
  autoplayDisableOnInteraction: true,
  autoplayStopOnLast: false,

  // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
  iOSEdgeSwipeDetection: false,
  iOSEdgeSwipeThreshold: 20,

  // Free mode
  freeMode: false,
  freeModeMomentum: true,
  freeModeMomentumRatio: 1,
  freeModeMomentumBounce: true,
  freeModeMomentumBounceRatio: 1,
  freeModeMomentumVelocityRatio: 1,
  freeModeSticky: false,
  freeModeMinimumVelocity: 0.02,

  // Autoheight
  autoHeight: false,

  // Set wrapper width
  setWrapperSize: false,

  // Virtual Translate
  virtualTranslate: false,

  // Effects
  effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  coverflow: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows : true
  },
  flip: {
    slideShadows : true,
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

  // Parallax
  parallax: false,

  // Zoom
  zoom: false,
  zoomMax: 3,
  zoomMin: 1,
  zoomToggle: true,

  // Keyboard Mousewheel
  keyboardControl: false,
  mousewheelControl: false,
  mousewheelReleaseOnEdges: false,
  mousewheelInvert: false,
  mousewheelForceToAxis: false,
  mousewheelSensitivity: 1,
  mousewheelEventsTarged: 'container',

  // Breakpoints
  breakpoints: undefined,

  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerColumn: 1,
  slidesPerColumnFill: 'column',
  slidesPerGroup: 1,
  centeredSlides: false,
  slidesOffsetBefore: 0, // in px
  slidesOffsetAfter: 0, // in px

  // Round length
  roundLengths: false,

  // Touches
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

  // Unique Navigation Elements
  uniqueNavElements: true,

  // Pagination
  pagination: null,
  paginationElement: 'span',
  paginationClickable: false,
  paginationHide: false,
  paginationBulletRender: null,
  paginationProgressRender: null,
  paginationFractionRender: null,
  paginationCustomRender: null,
  paginationType: 'bullets', // 'bullets' or 'progress' or 'fraction' or 'custom'

  // Resistance
  resistance: true,
  resistanceRatio: 0.85,

  // Next/prev buttons
  nextButton: null,
  prevButton: null,

  // Progress
  watchSlidesProgress: false,
  watchSlidesVisibility: false,

  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,

  // Lazy Loading
  lazyLoading: false,
  lazyLoadingInPrevNext: false,
  lazyLoadingInPrevNextAmount: 1,
  lazyLoadingOnTransitionStart: false,

  // Images
  preloadImages: true,
  updateOnImagesReady: true,

  // loop
  loop: false,
  loopAdditionalSlides: 0,
  loopedSlides: null,

  // Control
  control: undefined,
  controlInverse: false,
  controlBy: 'slide', // or 'container'
  normalizeSlideIndex: true,

  // Swiping/no swiping
  allowSwipeToPrev: true,
  allowSwipeToNext: true,
  swipeHandler: null, // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: 'swiper-no-swiping',

  // NS
  containerModifierClass: 'swiper-container-', // NEW
  slideClass: 'swiper-slide',
  slideActiveClass: 'swiper-slide-active',
  slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
  slideVisibleClass: 'swiper-slide-visible',
  slideDuplicateClass: 'swiper-slide-duplicate',
  slideNextClass: 'swiper-slide-next',
  slideDuplicateNextClass: 'swiper-slide-duplicate-next',
  slidePrevClass: 'swiper-slide-prev',
  slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
  wrapperClass: 'swiper-wrapper',
  bulletClass: 'swiper-pagination-bullet',
  bulletActiveClass: 'swiper-pagination-bullet-active',
  buttonDisabledClass: 'swiper-button-disabled',
  paginationCurrentClass: 'swiper-pagination-current',
  paginationTotalClass: 'swiper-pagination-total',
  paginationHiddenClass: 'swiper-pagination-hidden',
  paginationProgressbarClass: 'swiper-pagination-progressbar',
  paginationClickableClass: 'swiper-pagination-clickable', // NEW
  paginationModifierClass: 'swiper-pagination-', // NEW
  lazyLoadingClass: 'swiper-lazy',
  lazyStatusLoadingClass: 'swiper-lazy-loading',
  lazyStatusLoadedClass: 'swiper-lazy-loaded',
  lazyPreloaderClass: 'swiper-lazy-preloader',
  notificationClass: 'swiper-notification',
  preloaderClass: 'preloader',
  zoomContainerClass: 'swiper-zoom-container',

  // Observer
  observer: false,
  observeParents: false,

  // Accessibility
  a11y: true,
  prevSlideMessage: 'Previous slide',
  nextSlideMessage: 'Next slide',
  firstSlideMessage: 'This is the first slide',
  lastSlideMessage: 'This is the last slide',
  paginationBulletMessage: 'Go to slide {{index}}',

  // Callbacks
  runCallbacksOnInit: true
  /*
  Callbacks:
  onInit: function (swiper)
  onDestroy: function (swiper)
  onClick: function (swiper, e)
  onTap: function (swiper, e)
  onDoubleTap: function (swiper, e)
  onSliderMove: function (swiper, e)
  onSlideChangeStart: function (swiper)
  onSlideChangeEnd: function (swiper)
  onTransitionStart: function (swiper)
  onTransitionEnd: function (swiper)
  onImagesReady: function (swiper)
  onProgress: function (swiper, progress)
  onTouchStart: function (swiper, e)
  onTouchMove: function (swiper, e)
  onTouchMoveOpposite: function (swiper, e)
  onTouchEnd: function (swiper, e)
  onReachBeginning: function (swiper)
  onReachEnd: function (swiper)
  onSetTransition: function (swiper, duration)
  onSetTranslate: function (swiper, translate)
  onAutoplayStart: function (swiper)
  onAutoplayStop: function (swiper),
  onLazyImageLoad: function (swiper, slide, image)
  onLazyImageReady: function (swiper, slide, image)
  */

};
