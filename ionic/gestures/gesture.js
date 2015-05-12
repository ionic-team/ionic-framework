import * as util from 'ionic/util';
//import Hammer from 'hammer';

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
    this.hammertime.on(type, util.noop);
    (this._callbacks[type] || (this._callbacks[type] = [])).push(cb);
    this.element.addEventListener(type, cb);
  }

  listen() {
    this.hammertime = Hammer(this.element, this._options);
  }
  unlisten() {
    this.hammertime.destroy();
    this.hammertime = null;
    for (let type in this._callbacks) {
      for (let i = 0; i < this._callbacks[type].length; i++) {
        this.element.removeEventListener(type, this._callbacks[type][i]);
      }
    }
    this._callbacks = {}
  }
  destroy() {
    this.unlisten()
  }
}

