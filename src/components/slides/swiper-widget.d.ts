
export declare class Swiper {
  constructor(container: HTMLElement, params: any);
  slides: Array<HTMLElement>;
  activeIndex: number;
  previousIndex: number;
  isEnd: boolean;
  isBeginning: boolean;
  update(): any;
  slideNext(runCallbacks: boolean, speed: number): void;
  slidePrev(runCallbacks: boolean, speed: number): void;
  slideTo(slideIndex: number, speed: number, runCallbacks: boolean): void;
}
