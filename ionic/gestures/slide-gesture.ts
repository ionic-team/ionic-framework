import {DragGesture} from 'ionic/gestures/drag-gesture';
import * as util from 'ionic/util';

export class SlideGesture extends DragGesture {
  constructor(element, opts = {}) {
    super(element, opts);
    this.element = element;
  }

  /*
   * Get the min and max for the slide. pageX/pageY.
   * Only called on dragstart.
   */
  getSlideBoundaries(slide, ev) {
    return {
      min: 0,
      max: this.element.offsetWidth
    };
  }

  /*
   * Get the element's pos when the drag starts.
   * For example, an open side menu starts at 100% and a closed
   * sidemenu starts at 0%.
   */
  getElementStartPos(slide, ev) {
    return 0;
  }

  canStart() {
    return true;
  }

  onDragStart(ev) {
    if (!this.canStart(ev)) return false;
    this.slide = {};
    var promise = this.onSlideBeforeStart(this.slide, ev) || Promise.resolve();
    promise.then(() => {
      var {min, max} = this.getSlideBoundaries(this.slide, ev);
      this.slide.min = min;
      this.slide.max = max;
      this.slide.elementStartPos = this.getElementStartPos(this.slide, ev);
      this.slide.pointerStartPos = ev.center[this.direction];
      this.slide.started = true;
      this.onSlideStart(this.slide, ev);
    }).catch(() => {
      this.slide = null;
    });
  }

  onDrag(ev) {
    if (!this.slide || !this.slide.started) return;
    this.slide.pos = ev.center[this.direction];
    this.slide.distance = util.clamp(
      this.slide.min,
      this.slide.pos - this.slide.pointerStartPos + this.slide.elementStartPos,
      this.slide.max
    );
    this.slide.delta = this.slide.pos - this.slide.pointerStartPos;
    this.onSlide(this.slide, ev);
  }

  onDragEnd(ev) {
    if (!this.slide || !this.slide.started) return;
    this.onSlideEnd(this.slide, ev);
    this.slide = null;
  }

  onSlideBeforeStart() {}
  onSlideStart() {}
  onSlide() {}
  onSlideEnd() {}
}
