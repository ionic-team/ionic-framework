import * as util from 'ionic2/util';
import Hammer from 'hammer';

export class Gesture {
  constructor(element, opts = {}) {
    this.element = element;

    // Map 'x' or 'y' string to hammerjs opts
    this.direction = opts.direction || 'x';
    opts.direction = this.direction === 'x' ?
      Hammer.DIRECTION_HORIZONTAL :
      Hammer.DIRECTION_VERTICAL;

    this._options = opts;

  }
  options(opts = {}) {
    util.extend(this._options, opts);
  }

  listen() {
    this.hammertime = Hammer(this.element, this._options);
  }
  unlisten() {
    this.hammertime.destroy();
    this.hammertime = null;
  }
  destroy() {
    this.hammertime.destroy();
    this.hammertime = null;
  }
}
