import { PanGesture } from './drag-gesture';
import { clamp } from '../util';
import { pointerCoord } from '../util/dom';

/**
 * @private
 */
export class SlideGesture extends PanGesture {
  public slide: SlideData = null;

  constructor(element: HTMLElement, opts = {}) {
    super(element, opts);
  }

  /*
   * Get the min and max for the slide. pageX/pageY.
   * Only called on dragstart.
   */
  getSlideBoundaries(slide: SlideData, ev: any) {
    return {
      min: 0,
      max: this.getNativeElement().offsetWidth
    };
  }

  /*
   * Get the element's pos when the drag starts.
   * For example, an open side menu starts at 100% and a closed
   * sidemenu starts at 0%.
   */
  getElementStartPos(slide: SlideData, ev: any) {
    return 0;
  }

  onDragStart(ev: any) {
    this.slide = {};
    this.onSlideBeforeStart(this.slide, ev);

    let {min, max} = this.getSlideBoundaries(this.slide, ev);
    let coord = <any>pointerCoord(ev);
    this.slide.min = min;
    this.slide.max = max;
    this.slide.elementStartPos = this.getElementStartPos(this.slide, ev);
    this.slide.pos = this.slide.pointerStartPos = coord[this.direction];
    this.slide.timestamp = Date.now();
    this.slide.started = true;
    this.slide.velocity = 0;
    this.onSlideStart(this.slide, ev);
  }

  onDragMove(ev: any) {
    let coord = <any>pointerCoord(ev);
    let newPos = coord[this.direction];
    let newTimestamp = Date.now();
    let velocity = (newPos - this.slide.pos) / (newTimestamp - this.slide.timestamp);

    this.slide.pos = newPos;
    this.slide.timestamp = newTimestamp;
    this.slide.distance = clamp(
      this.slide.min,
      newPos - this.slide.pointerStartPos + this.slide.elementStartPos,
      this.slide.max
    );
    this.slide.velocity = velocity;
    this.slide.delta = newPos - this.slide.pointerStartPos;
    this.onSlide(this.slide, ev);

    return true;
  }

  onDragEnd(ev: any) {
    this.onSlideEnd(this.slide, ev);
    this.slide = null;
  }

  onSlideBeforeStart(slide?: SlideData, ev?: any): void {}
  onSlideStart(slide?: SlideData, ev?: any): void {}
  onSlide(slide?: SlideData, ev?: any): void {}
  onSlideEnd(slide?: SlideData, ev?: any): void {}
}

/**
 * @private
 */
export interface SlideData {
  min?: number;
  max?: number;
  distance?: number;
  delta?: number;
  started?: boolean;
  pos?: any;
  timestamp?: number;
  pointerStartPos?: number;
  elementStartPos?: number;
  velocity?: number;
}
