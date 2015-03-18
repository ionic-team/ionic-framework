import * as Platform from '../platform';

var ILLEGAL_ASSIGN_FIELDS = {};
export class Ion {

  constructor() {
    var platformName = Platform.getPlatform();
    var platformConfig = this.$config._platforms[platformName];
    if (platformConfig) {
      for (var i = 0, ii = platformConfig._mixins.length; i < ii; i++)
        platformConfig._mixins[i](this);
      }
    }
  }

  assign() {
    for (var i = 0, ii = arguments.length; i < ii; i++) {
      var obj = arguments[i];
      if (obj) {
        var keys = Object.keys(obj);
        for (var j = 0, jj = keys.length; j < jj; j++) {
          var key = keys[j];
          if (!ILLEGAL_ASSIGN_FIELDS[key]) {
            this[key] = obj[key];
          }
        }
      }
    }
  }

}
