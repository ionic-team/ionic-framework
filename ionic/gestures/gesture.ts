import * as util from 'ionic/util';
import {Hammer} from 'ionic/gestures/hammer';

/**
 * A gesture recognizer class.
 *
 * TODO(mlynch): Re-enable the DOM event simulation that was causing issues (or verify hammer does this already, it might);
 */

export class Gesture {
  constructor(element, opts = {}) {
    util.defaults(opts, {
      domEvents: true
    });
    this.element = element;

    // Map 'x' or 'y' string to hammerjs opts
    this.direction = opts.direction || 'x';
    opts.direction = this.direction === 'x' ?
      Hammer.DIRECTION_HORIZONTAL :
      Hammer.DIRECTION_VERTICAL;

    this._options = opts;
    this._callbacks = {};

  }

  options(opts = {}) {
    util.extend(this._options, opts);
  }

  on(type, cb) {
    if(type == 'pinch' || type == 'rotate') {
      this.hammertime.get('pinch').set({enable: true});
    }
    this.hammertime.on(type, cb);
    (this._callbacks[type] || (this._callbacks[type] = [])).push(cb);
    //this.element.addEventListener(type, cb);
  }

  listen() {
    this.hammertime = Hammer(this.element, this._options);
  }

  unlisten() {
    if (this.hammertime) {
      for (let type in this._callbacks) {
        for (let i = 0; i < this._callbacks[type].length; i++) {
          //this.element.removeEventListener(type, this._callbacks[type][i]);
          this.hammertime.off(type, this._callbacks[type]);
        }
      }
      this.hammertime.destroy();
      this.hammertime = null;
      this._callbacks = {}
    }
  }

  destroy() {
    this.unlisten()
  }
}
