
export class Gesture {
  // constructor(element, opts = {}) {
  //   this.element = element;
  //   this._options = opts;
  // }
  // options(opts = {}) {
  //   extend(this._options, opts);
  // }

  // listen() {
  //   this.hammertime = Hammer(element, this._options);
  // }
  // unlisten() {
  //   this.hammertime.destroy();
  //   this.hammertime = null;
  // }
  // destroy() {
  //   this.hammertime.destroy();
  // }
}

// TODO make a utils.js
function extend() {
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
