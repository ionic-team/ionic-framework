import { Swiper } from './swiper';


export interface SwiperParams {
  a11y?: boolean;
  allowSwipeToNext?: boolean;
  allowSwipeToPrev?: boolean;
  autoHeight?: boolean;
  autoplay?: boolean;
  autoplayStopOnLast?: boolean;
  breakpoints?: any;
  bulletActiveClass?: string;
  buttonDisabledClass?: string;
  centeredSlides?: boolean;
  containerModifierClass?: string;
  direction?: string;
  effect?: string;
  freeMode?: boolean;
  height?: number;
  initialSlide?: number;
  keyboardControl?: boolean;
  loop?: boolean;
  mousewheelControl?: boolean;
  nextButton?: boolean;
  pagination?: boolean;
  prevButton?: boolean;
  paginationHiddenClass?: string;
  parallax?: boolean;
  resistanceRatio?: number;
  roundLengths?: boolean;
  scrollbarDraggable?: boolean;
  setWrapperSize?: boolean;
  slideVisibleClass?: string;
  slideActiveClass?: string;
  slideClass?: string;
  slideNextClass?: string;
  slidesOffsetAfter?: number;
  slidesOffsetBefore?: number;
  slidePrevClass?: string;
  slidesPerColumn?: number;
  slidesPerColumnFill?: string;
  slidesPerGroup?: number;
  slidesPerView?: any;
  spaceBetween?: any;
  touchReleaseOnEdges?: boolean;
  virtualTranslate?: boolean;
  watchSlidesProgress?: boolean;
  watchSlidesVisibility?: boolean;
  width?: number;
  wrapperClass?: string;
}

export interface SwiperSlide extends HTMLElement {
  swiperSlideSize: number;
  swiperSlideOffset: number;
}

export interface SwiperContainer extends HTMLElement {
  swiper: Swiper;
}
