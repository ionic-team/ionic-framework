
var ILLEGAL_ASSIGN_FIELDS = {};
export class Ion {

  assign() {
    for (var i = 1, ii = arguments.length; i < ii; i++) {
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
