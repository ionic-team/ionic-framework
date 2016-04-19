
export declare class Swiper {
  constructor(container: HTMLElement, params: any);
  slides: Array<HTMLElement>;
  activeIndex: number;
  isEnd: boolean;
  isBeginning: boolean;
  update(): any;
  slideNext(runCallbacks: boolean, speed: number);
  slidePrev(runCallbacks: boolean, speed: number);
  slideTo(slideIndex: number, speed: number, runCallbacks: boolean);
}
