// Simple noop function
export function noop() {};

/**
 * Given a min and max, restrict the given number
 * to the range.
 * @param min the minimum
 * @param n the value
 * @param max the maximum
 */
export function clamp(min, n, max) {
  return Math.max(min, Math.min(n, max));
}

/**
 * Extend the destination with an arbitrary number of other objects.
 * @param dst the destination
 * @param ... the param objects
 */
export function extend(dst) {
  return _baseExtend(dst, [].slice.call(arguments, 1), false);
}

/**
 * Do a deep extend (merge).
 * @param dst the destination
 * @param ... the param objects
 */
export function merge(dst) {
  return _baseExtend(dst, [].slice.call(arguments, 1), true);
}

function _baseExtend(dst, objs, deep) {
  for (var i = 0, ii = objs.length; i < ii; ++i) {
    var obj = objs[i];
    if (!obj || !isObject(obj) && !isFunction(obj)) continue;
    var keys = Object.keys(obj);
    for (var j = 0, jj = keys.length; j < jj; j++) {
      var key = keys[j];
      var src = obj[key];

      if (deep && isObject(src)) {
        if (!isObject(dst[key])) dst[key] = isArray(src) ? [] : {};
        _baseExtend(dst[key], [src], true);
      } else {
        dst[key] = src;
      }
    }
  }

  return dst;
}

export function debounce(func, wait, immediate) {
 var timeout, args, context, timestamp, result;
 return function() {
   context = this;
   args = arguments;
   timestamp = new Date();
   var later = function() {
     var last = (new Date()) - timestamp;
     if (last < wait) {
       timeout = setTimeout(later, wait - last);
     } else {
       timeout = null;
       if (!immediate) result = func.apply(context, args);
     }
   };
   var callNow = immediate && !timeout;
   if (!timeout) {
     timeout = setTimeout(later, wait);
   }
   if (callNow) result = func.apply(context, args);
   return result;
 };
}


/**
 * Apply default arguments if they don't exist in
 * the first object.
 * @param the destination to apply defaults to.
 */
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

export const isBoolean = val => typeof val === 'boolean';
export const isString = val => typeof val === 'string';
export const isNumber = val => typeof val === 'number';
export const isFunction = val => typeof val === 'function';
export const isDefined = val => typeof val !== 'undefined';
export const isUndefined = val => typeof val === 'undefined';
export const isBlank = val => val === undefined || val === null;
export const isObject = val => typeof val === 'object';
export const isArray = Array.isArray;
export const isTrueProperty = val => typeof val !== 'undefined' && val !== "false";

/**
 * Convert a string in the format thisIsAString to a slug format this-is-a-string
 */
export function pascalCaseToDashCase(str = '') {
  return str.charAt(0).toLowerCase() + str.substring(1).replace(/[A-Z]/g, match => {
    return '-' + match.toLowerCase();
  });
}

let uid = 0;
export function nextUid() {
  return ++uid;
}

/**
 * A simple logger class.
 */
export class Log {
  static log(...args) {
    console.log.apply(console, args);
  }
  static info(...args) {
    console.info.apply(console, args);
  }
  static warn(...args) {
    console.warn.apply(console, args);
  }
  static error(...args) {
    console.error.apply(console, args);
  }
}

export const array = {
  find(arr, cb) {
    for (let i = 0, ii = arr.length; i < ii; i++) {
      if (cb(arr[i], i)) return arr[i];
    }
  },
  remove(arr, itemOrIndex) {
    let index = -1;
    if (isNumber(itemOrIndex)) {
      index = itemOrIndex;
    } else {
      index = arr.indexOf(itemOrIndex);
    }
    if (index < 0) {
      return false;
    }
    arr.splice(index, 1);
    return true;
  }
}

/**
 * Grab the query string param value for the given key.
 * @param key the key to look for
 */
export function getQuerystring(url, key) {
  var queryParams = {};
  if (url) {
    const startIndex = url.indexOf('?');
    if (startIndex !== -1) {
      const queries = url.slice(startIndex + 1).split('&');
      if (queries.length) {
        queries.forEach((param) => {
          var split = param.split('=');
          queryParams[split[0]] = split[1].split('#')[0];
        });
      }
    }
    if (key) {
      return queryParams[key] || '';
    }
  }
  return queryParams;
}
