import {DragGesture} from './drag-gesture';
import * as util from '../../util';

export class SlideGesture extends DragGesture {

  // These getters are overridden by the implementation
  getSlideRange() {
    return [0, this.element.offsetWidth];
  }
  getEventPos(ev, slideRange) {
    return -slideRange[1] + n;
  }
  getElementPos(ev, slideRange) {
    return slideRange[0];
  }

  onDragStart(ev) {
    var { direction } = this._options.direction;
    var slideRange = this.getSlideRange(ev);
    var dragStartPos = this.getEventPos(ev);
    var elementStartpos = this.getElementPos(ev, distance);
    this._state = { distance, dragStartPos, elementStartPos };

    return this.onSlideStart && this.onSlideStart(this._state, ev);
  }
  onDrag(ev) {
    var { distance, dragStartPos, elementStartPos } = this._state;
    var pos = elementStartPos + this.getEventPos(ev) - dragStartPos;
    this._state.position = util.clamp(slideRange[0], n, slideRange[1]);

    return this.onSlide && this.onSlide(this._state, ev);
  }
  onDragEnd() {
    var ret = this.onSlideEnd && this.onSlideEnd(this._state, ev);
    this._state = null;
    return ret;
  }
}
