
export declare class Swiper {
  constructor(container: HTMLElement, params: any);
  slides: Array<HTMLElement>;
  activeIndex: number;
  isEnd: boolean;
  isBeginning: boolean;
  update(): any;
  slideNext(): any;
  slidePrev(): any;
  slideTo(slideIndex: number, speed: number, runCallbacks: boolean);
}
