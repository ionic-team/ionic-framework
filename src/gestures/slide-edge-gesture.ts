import {SlideGesture} from './slide-gesture';
import {defaults} from '../util/util';
import {windowDimensions} from '../util/dom';


export class SlideEdgeGesture extends SlideGesture {
  public edges: Array<string>;
  public maxEdgeStart: any;
  private _d: any;

  constructor(element: HTMLElement, opts: any = {}) {
    defaults(opts, {
      edge: 'left',
      maxEdgeStart: 50
    });
    super(element, opts);
    // Can check corners through use of eg 'left top'
    this.edges = opts.edge.split(' ');
    this.maxEdgeStart = opts.maxEdgeStart;
  }

  canStart(ev: any): boolean {
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
      case 'left': return pos.x <= this._d.left + this.maxEdgeStart;
      case 'right': return pos.x >= this._d.width - this.maxEdgeStart;
      case 'top': return pos.y <= this._d.top + this.maxEdgeStart;
      case 'bottom': return pos.y >= this._d.height - this.maxEdgeStart;
    }
  }

}
