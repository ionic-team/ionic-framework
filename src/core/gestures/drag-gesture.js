import {Gesture} from './gesture';
var noop = function() {};

class DragGesture extends Gesture {
  // constructor(element, opts = {}) {
  //   super(element, opts);
  //   this.onDrag = opts.onDrag;
  //   this.onDragStart = opts.onDragStart;
  //   this.onDragEnd = opts.onDragEnd;
  // }
  // listen() {
  //   super.listen();
  //   this.hammertime.on('dragstart', this._onDragStart.bind(this));
  //   this.hammertime.on('drag', this._onDrag.bind(this));
  //   this.hammertime.on('dragend', this._onDragEnd.bind(this));
  // }
  // unlisten() {
  //   super.unlisten();
  //   this.hammertime.destroy();
  // }

  // _onDragStart(ev) {
  //   (this.onDragStart || noop)(ev);
  // }
  // _onDrag(ev) {
  //   (this.onDrag || noop)(ev);
  // }
  // _onDragEnd(ev) {
  //   (this.onDragEnd || noop)(ev);
  // }
}
