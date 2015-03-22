import {SlideGesture} from './slide-gesture';
import * as util from '../../util';

export class SlideEdgeGesture extends SlideGesture {
  constructor(element: Element, opts: Object = {}) {
    util.defaults(opts, {
      edge: 'left',
      threshold: 50
    });
    // Can check corners through use of eg 'left top'
    this.edges = opts.edge.split(' ');
    this.threshold = opts.threshold;
    super(element, opts);
  }

  canStart(ev) {
    this._containerRect = this.getContainerDimensions();
    return this.edges.every(edge => this._checkEdge(edge, ev.center));
  }

  getContainerDimensions() {
    return {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  _checkEdge(edge, pos) {
    if ((edge === 'left' && pos.x > this._containerRect.left + this.threshold) ||
        (edge === 'right' && pos.x < this._containerRect.width - this.threshold) ||
        (edge === 'top' && pos.y > this._containerRect.top + this.threshold) ||
        (edge === 'bottom' && pos.y < this._containerRect.height - this.threshold)) {
      return false;
    }
    return true;
  }

}
