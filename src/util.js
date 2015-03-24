export function noop() {}

export function clamp(min, n, max) {
  return Math.max(min, Math.min(n, max));
}

export function extend(dest) {
  for (var i = 1, ii = arguments.length; i < ii; i++) {
    var source = arguments[i] || {};
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        dest[key] = source[key];
      }
    }
  }
  return dest;
}

export function defaults(dest) {
  for (let i = arguments.length - 1; i >= 1; i--) {
    let source = arguments[i] || {};
    for (let key in source) {
      if (!dest.hasOwnProperty(key)) {
        dest[key] = source[key];
      }
    }
  }
  return dest;
}

export function isString(val) {
  return typeof val === 'string';
}

export function isFunction(val) {
  return typeof val === 'function';
}

export function isDefined(val) {
  return typeof val !== 'undefined';
}

export var array = {
  unique(array) {
    return array.filter(function(value, index) {
      return array.indexOf(value) === index;
    });
  }
};
