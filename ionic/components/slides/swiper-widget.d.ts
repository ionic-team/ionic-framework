export declare class Swiper {
  constructor(container: HTMLElement, params: any);
  slides: Array<HTMLElement>;
  activeIndex: number;
  isEnd: boolean;
  isBeginning: boolean;
  
  update();
  slideNext();
  slidePrev();
  
}