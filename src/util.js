export function noop() {}

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

export function clamp(min, n, max) {
  return Math.max(min, Math.min(n, max));
}

export function defaults(obj, src) {
  for (var key in src) {
    if (src.hasOwnProperty(key) && !obj.hasOwnProperty(key)) {
      obj[key] = src[key];
    }
  }
  return obj;
}
