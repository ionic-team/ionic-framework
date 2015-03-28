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
      if (source.hasOwnProperty(key) && !dest.hasOwnProperty(key)) {
        dest[key] = source[key];
      }
    }
  }
  return dest;
}

export let isString = val => typeof val === 'string';
export let isFunction = val => typeof val === 'function';
export let isDefined = val => typeof val === 'undefined';
export let isObject = val => typeof val === 'object';

export function pascalCaseToDashCase(str = '') {
  return str.charAt(0).toLowerCase() + str.substring(1).replace(/[A-Z]/g, match => {
    return '-' + match.toLowerCase()
  })
}

export let array = {
  unique(array) {
    return array.filter((value, index) => {
      return array.indexOf(value) === index;
    });
  }
};
