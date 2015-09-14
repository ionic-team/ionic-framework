import {Gesture} from 'ionic/gestures/gesture';
import * as util from 'ionic/util';


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
