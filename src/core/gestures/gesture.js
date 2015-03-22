import * as util from '../../util';
import Hammer from 'hammer';

export class Gesture {
  constructor(element, opts = {}) {
    util.defaults(opts, {
    });
    this.element = element;
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
  }
}
