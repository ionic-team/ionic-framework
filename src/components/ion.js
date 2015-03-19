import * as Platform from '../platform';
import * as util from '../util';

var ILLEGAL_ASSIGN_FIELDS = {};
export class Ion {

  extend(...args) {
    args.unshift(this);
    return util.extend.apply(null, args);
  }

}
