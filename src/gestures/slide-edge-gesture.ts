import {SlideGesture} from './slide-gesture';
import {defaults} from '../util/util';
import {windowDimensions} from '../util/dom';


const enum Edge {
  Left,
  Right,
  Top,
  Bottom
}
function edgeMapper(value: string): Edge {
  switch (value) {
    case 'left': return Edge.Left;
    case 'right': return Edge.Right;
    case 'top': return Edge.Top;
    case 'bottom': return Edge.Bottom;
    default: throw new Error("invalid edge value: " + value);
  }
}

export class SlideEdgeGesture extends SlideGesture {
  public maxEdgeStart: number;
  private _edges: Edge[];
  private _d: any;

  constructor(element: HTMLElement, opts: any = {}) {
    defaults(opts, {
      edge: 'left',
      maxEdgeStart: 50
    });
    super(element, opts);
    // Can check corners through use of eg 'left top'
    this._edges = opts.edge.split(' ').map(edgeMapper);
    this.maxEdgeStart = opts.maxEdgeStart;
  }

  canStart(ev: any): boolean {
    this._d = this.getContainerDimensions();
    return this._edges.every(edge => this._checkEdge(edge, ev.center));
  }

  getContainerDimensions() {
    return {
      left: 0,
      top: 0,
      width: windowDimensions().width,
      height: windowDimensions().height
    };
  }

  private _checkEdge(edge: Edge, pos): boolean {
    switch (edge) {
      case Edge.Left: return pos.x <= this._d.left + this.maxEdgeStart;
      case Edge.Right: return pos.x >= this._d.width - this.maxEdgeStart;
      case Edge.Top: return pos.y <= this._d.top + this.maxEdgeStart;
      case Edge.Bottom: return pos.y >= this._d.height - this.maxEdgeStart;
    }
    console.error('internal error: unreachable');
    return false;
  }

}
