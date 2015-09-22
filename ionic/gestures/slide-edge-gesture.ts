import {SlideGesture} from 'ionic/gestures/slide-gesture';
import {defaults} from '../util/util';
import {windowDimensions} from '../util/dom';


export class SlideEdgeGesture extends SlideGesture {
  constructor(element: Element, opts: Object = {}) {
    defaults(opts, {
      edge: 'left',
      threshold: 50
    });
    super(element, opts);
    // Can check corners through use of eg 'left top'
    this.edges = opts.edge.split(' ');
    this.threshold = opts.threshold;
  }

  canStart(ev) {
    this._d = this.getContainerDimensions();
    return this.edges.every(edge => this._checkEdge(edge, ev.center));
  }

  getContainerDimensions() {
    return {
      left: 0,
      top: 0,
      width: windowDimensions().width,
      height: windowDimensions().height
    };
  }

  _checkEdge(edge, pos) {
    switch (edge) {
      case 'left': return pos.x <= this._d.left + this.threshold;
      case 'right': return pos.x >= this._d.width - this.threshold;
      case 'top': return pos.y <= this._d.top + this.threshold;
      case 'bottom': return pos.y >= this._d.height - this.threshold;
    }
  }

}
