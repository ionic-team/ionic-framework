import {Gesture} from 'ionic/gestures/gesture';
import * as util from 'ionic/util';
//import Hammer from 'hammer';

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
    this.on('panstart', ev => {
      if (this.onDragStart(ev) !== false) {
        this.dragging = true;
      }
      // ev.stopPropagation();
    })
    this.on('panmove', ev => {
      if (!this.dragging) return;
      if (this.onDrag(ev) === false) {
        this.dragging = false;
      }
      // ev.stopPropagation()
    });
    this.on('panend', ev => {
      if (!this.dragging) return;
      this.onDragEnd(ev);
      this.dragging = false;
      // ev.stopPropagation()
    });
  }
  onDrag() {}
  onDragStart() {}
  onDragEnd() {}
}
