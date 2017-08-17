import { SlideGesture } from './slide-gesture';
import { defaults } from '../util/util';
import { pointerCoord } from '../util/dom';
import { Platform } from '../platform/platform';

/**
 * @hidden
 */
export class SlideEdgeGesture extends SlideGesture {

  public edges: string[];
  public maxEdgeStart: any;
  private _d: any;

  constructor(plt: Platform, element: HTMLElement, opts: any = {}) {
    defaults(opts, {
      edge: 'start',
      maxEdgeStart: 50
    });
    super(plt, element, opts);
    // Can check corners through use of eg 'left top'
    this.setEdges(opts.edge);
    this.maxEdgeStart = opts.maxEdgeStart;
  }

  setEdges(edges: string) {
    const isRTL = this.plt.isRTL;
    this.edges = edges.split(' ').map((value) => {
      switch (value) {
        case 'start': return isRTL ? 'right' : 'left';
        case 'end': return isRTL ? 'left' : 'right';
        default: return value;
      }
    });
  }

  canStart(ev: any): boolean {
    const coord = pointerCoord(ev);
    this._d = this.getContainerDimensions();
    return this.edges.every(edge => this._checkEdge(edge, coord));
  }

  getContainerDimensions() {
    const plt = this.plt;
    return {
      left: 0,
      top: 0,
      width: plt.width(),
      height: plt.height()
    };
  }

  _checkEdge(edge: string, pos: any): boolean {
    const data = this._d;
    const maxEdgeStart = this.maxEdgeStart;
    switch (edge) {
      case 'left': return pos.x <= data.left + maxEdgeStart;
      case 'right': return pos.x >= data.width - maxEdgeStart;
      case 'top': return pos.y <= data.top + maxEdgeStart;
      case 'bottom': return pos.y >= data.height - maxEdgeStart;
    }
    return false;
  }

}
