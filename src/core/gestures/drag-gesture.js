import {Gesture} from './gesture';
import * as util from '../../util';

export class DragGesture extends Gesture {
  constructor(element, opts = {}) {
    util.extend(this, { 
      onDrag: opts.onDrag, 
      onDragEnd: opts.onDragEnd,
      onDragStart: opts.onDragStart
    });
    super(element, opts);
  }
  listen() {
    super.listen();
    this.hammertime.on('panstart', ev => {
      if (this.onDragStart && this.onDragStart(ev) !== false) {
        this.dragging = true;
      }
    });
    this.hammertime.on('panmove', ev => {
      if (!this.dragging) return;
      if (this.onDrag && this.onDrag(ev) === false) {
        this.dragging = false;
      }
    });
    this.hammertime.on('panend', ev => {
      if (!this.dragging) return;
      this.onDragEnd && this.onDragEnd(ev);
      this.dragging = false;
    });
  }
}
