import {defaults, assign} from '../util';
import {Hammer, DIRECTION_HORIZONTAL, DIRECTION_VERTICAL} from './hammer';

/**
 * A gesture recognizer class.
 *
 * TODO(mlynch): Re-enable the DOM event simulation that was causing issues (or verify hammer does this already, it might);
 */

export class Gesture {
  public element: HTMLElement;
  public direction: any;
  private _hammer: any;
  private _options: any;
  private _callbacks: any = {};

  constructor(element, opts: any = {}) {
    defaults(opts, {
      domEvents: true
    });
    this.element = element;

    // Map 'x' or 'y' string to hammerjs opts
    this.direction = opts.direction || 'x';
    opts.direction = this.direction === 'x' ?
      DIRECTION_HORIZONTAL :
      DIRECTION_VERTICAL;

    this._options = opts;
  }

  options(opts = {}) {
    assign(this._options, opts);
  }

  on(type, cb) {
    if(type == 'pinch' || type == 'rotate') {
      this._hammer.get('pinch').set({enable: true});
    }
    this._hammer.on(type, cb);
    (this._callbacks[type] || (this._callbacks[type] = [])).push(cb);
  }

  off(type, cb) {
    this._hammer.off(type, this._callbacks[type] ? cb : null);
  }

  listen() {
    this._hammer = Hammer(this.element, this._options);
  }

  unlisten() {
    if (this._hammer) {
      for (let type in this._callbacks) {
        for (let i = 0; i < this._callbacks[type].length; i++) {
          this._hammer.off(type, this._callbacks[type]);
        }
      }
      this._hammer.destroy();
      this._hammer = null;
      this._callbacks = {};
    }
  }

  destroy() {
    this.unlisten()
  }
}
