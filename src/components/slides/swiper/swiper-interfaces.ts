import { Slides } from '../slides';
import { Platform } from '../../../platform/platform';


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

export interface SlideZoom {
  scale: number;
  currentScale: number;
  isScaling: boolean;
  gesture: {
    slide: SlideElement;
    slideWidth: number;
    slideHeight: number;
    image: HTMLElement;
    imageWrap: HTMLElement;
    zoomMax: number;
    scaleStart?: number;
    scaleMove?: number;
  };
  image: {
    isTouched: boolean;
    isMoved: boolean;
    currentX: number;
    currentY: number;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
    startX: number;
    startY: number;
    touchesStart: {
      x?: number;
      y?: number;
    },
    touchesCurrent: {
      x?: number;
      y?: number;
    }
  };
  velocity: {
    x: number;
    y: number;
    prevPositionX: number;
    prevPositionY: number;
    prevTime: number
  };
  unRegs: Function[];
}
