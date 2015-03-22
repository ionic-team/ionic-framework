import * as Platform from '../platform';
import * as util from '../util';

export class Ion {

  extend(...args) {
    args.unshift(this);
    return util.extend.apply(null, args);
  }

}
