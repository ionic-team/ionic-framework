import { Slides } from '../slides';
import { Platform } from '../../../platform/platform';


export interface SlideParams {
  a11y?: boolean;
  allowSwipeToNext?: boolean;
  allowSwipeToPrev?: boolean;
  autoHeight?: boolean;
  autoplay?: boolean;
  autoplayStopOnLast?: boolean;
  autoplayDisableOnInteraction?: boolean;
  breakpoints?: any;
  bulletClass?: string;
  bulletActiveClass?: string;
  buttonDisabledClass?: string;
  centeredSlides?: boolean;
  containerModifierClass?: string;
  direction?: string;
  effect?: string;
  freeModeMomentum?: boolean;
  freeModeMinimumVelocity?: number;
  freeModeMomentumVelocityRatio?: number;
  freeModeMomentumRatio?: number;
  freeModeMomentumBounceRatio?: number;
  freeModeMomentumBounce?: number;
  freeModeSticky?: boolean;
  firstSlideMessage?: string;
  followFinger?: boolean;
  freeMode?: boolean;
  height?: number;
  initialSlide?: number;
  iOSEdgeSwipeDetection?: boolean;
  iOSEdgeSwipeThreshold?: number;
  keyboardControl?: boolean;
  lastSlideMessage?: string;
  loop?: boolean;
  loopedSlides?: number;
  loopAdditionalSlides?: number;
  longSwipes?: boolean;
  longSwipesMs?: number;
  longSwipesRatio?: number;
  nested?: boolean;
  nextButton?: string;
  nextSlideMessage?: string;
  normalizeSlideIndex?: boolean;
  noSwiping?: boolean;
  noSwipingClass?: string;
  notificationClass?: string;
  onlyExternal?: boolean;
  pagination?: string;
  paginationBulletMessage?: string;
  paginationClickable?: boolean;
  paginationCurrentClass?: string;
  paginationElement?: string;
  paginationModifierClass?: string;
  paginationProgressbarClass?: string;
  paginationTotalClass?: string;
  paginationHiddenClass?: string;
  paginationHide?: boolean;
  paginationType?: string;
  parallax?: boolean;
  prevButton?: string;
  preventClicks?: boolean;
  preventClicksPropagation?: boolean;
  prevSlideMessage?: string;
  resistance?: number;
  resistanceRatio?: number;
  roundLengths?: boolean;
  runCallbacksOnInit?: boolean;
  setWrapperSize?: boolean;
  shortSwipes?: boolean;
  simulateTouch?: boolean;
  slideVisibleClass?: string;
  slideActiveClass?: string;
  slideClass?: string;
  slideNextClass?: string;
  slidesOffsetAfter?: number;
  slidesOffsetBefore?: number;
  slideDuplicateClass?: string;
  slideDuplicateActiveClass?: string;
  slideDuplicateNextClass?: string;
  slideDuplicatePrevClass?: string;
  slidePrevClass?: string;
  slidesPerColumn?: number;
  slidesPerColumnFill?: string;
  slidesPerGroup?: number;
  slidesPerView?: any;
  slideToClickedSlide?: boolean;
  speed?: number;
  spaceBetween?: any;
  swipeHandler?: any;
  threshold?: number;
  touchAngle?: number;
  touchEventsTarget?: string;
  touchRatio?: number;
  touchReleaseOnEdges?: boolean;
  touchMoveStopPropagation?: boolean;
  virtualTranslate?: boolean;
  watchSlidesProgress?: boolean;
  watchSlidesVisibility?: boolean;
  width?: number;
  wrapperClass?: string;

  coverflow?: {
    rotate: number;
    stretch: number;
    depth: number;
    modifier: number;
    slideShadows: boolean;
  };

  flip?: {
    slideShadows: boolean;
    limitRotation: boolean;
  };

  cube?: {
    slideShadows: boolean;
    shadow: boolean;
    shadowOffset: number;
    shadowScale: number;
  };

  fade?: {
    crossFade: boolean;
  };
}

export interface SlideElement extends HTMLElement {
  progress: number;
  swiperSlideSize: number;
  swiperSlideOffset: number;
}

export interface SlideContainer extends HTMLElement {
  swiper: Slides;
}

export interface SlideEffect {
  setTranslate: {(s: Slides, plt: Platform): void};
  setTransition: {(s: Slides, plt: Platform, duration: number): void};
}

export interface SlideEffects {
  [key: string]: SlideEffect;
}

export interface SlideTouches {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  diff: number;
}

export interface SlideUIEvent extends TouchEvent {
  originalEvent: SlideUIEvent;
  preventedByNestedSwiper: boolean;
  pageX: number;
  pageY: number;
  which: number;
}

export interface SlideTouchEvents {
  start: string;
  move: string;
  end: string;
}
