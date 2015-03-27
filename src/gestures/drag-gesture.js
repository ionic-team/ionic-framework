import {Gesture} from 'ionic2/gestures/gesture';
import * as util from 'ionic2/util';
import Hammer from 'hammer';

/*
 * BUG(ajoslin): HammerJS 2.x does not have an alternative to HammerJS 1.x's
 * dragLockToAxis, so a vertical and horizontal gesture can happen at the same time.
 */
export class DragGesture extends Gesture {
  constructor(element, opts = {}) {
    util.defaults(opts, {});
    super(element, opts);
  }
  listen() {
    super.listen();
    this.hammertime.on('panstart', ev => {
      if (this.onDragStart(ev) !== false) {
        this.dragging = true;
      }
    });
    this.hammertime.on('panmove', ev => {
      if (!this.dragging) return;
      if (this.onDrag(ev) === false) {
        this.dragging = false;
      }
    });
    this.hammertime.on('panend', ev => {
      if (!this.dragging) return;
      this.onDragEnd(ev);
      this.dragging = false;
    });
  }
  onDrag() {}
  onDragStart() {}
  onDragEnd() {}
}
