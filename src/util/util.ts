
/**
 * Given a min and max, restrict the given number
 * to the range.
 * @param min the minimum
 * @param n the value
 * @param max the maximum
 */
export function clamp(min: number, n: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

/**
 * The assign() method is used to copy the values of all enumerable own
 * properties from one or more source objects to a target object. It will
 * return the target object. When available, this method will use
 * `Object.assign()` under-the-hood.
 * @param target  The target object
 * @param source(s)  The source object
 */
export function assign(...args: any[]): any {
  if (typeof Object.assign !== 'function') {
    // use the old-school shallow extend method
    return _baseExtend(args[0], [].slice.call(args, 1), false);
  }

  // use the built in ES6 Object.assign method
  return Object.assign.apply(null, args);
}

/**
 * Do a deep extend (merge).
 * @param dst the destination
 * @param ... the param objects
 */
export function merge(dst: any, ...args: any[]) {
  return _baseExtend(dst, [].slice.call(arguments, 1), true);
}

function _baseExtend(dst: any, objs: any, deep: boolean) {
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

export function debounce(fn: Function, wait: number, immediate: boolean = false): any {
 var timeout: number, args: any, context: any, timestamp: number, result: any;
 return function() {
   context = this;
   args = arguments;
   timestamp = Date.now();
   var later: any = function() {
     var last: any = Date.now() - timestamp;
     if (last < wait) {
       timeout = setTimeout(later, wait - last);
     } else {
       timeout = null;
       if (!immediate) result = fn.apply(context, args);
     }
   };
   var callNow = immediate && !timeout;
   if (!timeout) {
     timeout = setTimeout(later, wait);
   }
   if (callNow) result = fn.apply(context, args);
   return result;
 };
}


/**
 * Apply default arguments if they don't exist in
 * the first object.
 * @param the destination to apply defaults to.
 */
export function defaults(dest: any, ...args: any[]) {
  for (var i = arguments.length - 1; i >= 1; i--) {
    var source = arguments[i];
    if (source) {
      for (var key in source) {
        if (source.hasOwnProperty(key) && !dest.hasOwnProperty(key)) {
          dest[key] = source[key];
        }
      }
    }
  }
  return dest;
}

export const isBoolean = (val: any) => typeof val === 'boolean';
export const isString = (val: any) => typeof val === 'string';
export const isNumber = (val: any) => typeof val === 'number';
export const isFunction = (val: any) => typeof val === 'function';
export const isDefined = (val: any) => typeof val !== 'undefined';
export const isUndefined = (val: any) => typeof val === 'undefined';
export const isPresent = (val: any) => val !== undefined && val !== null;
export const isBlank = (val: any) => val === undefined || val === null;
export const isObject = (val: any) => typeof val === 'object';
export const isArray = Array.isArray;

export const isPrimitive = function(val: any) {
  return isString(val) || isBoolean(val) || (isNumber(val) && !isNaN(val));
};

export const isTrueProperty = function(val: any): boolean {
  if (typeof val === 'string') {
    val = val.toLowerCase().trim();
    return (val === 'true' || val === 'on' || val === '');
  }
  return !!val;
};

export const isCheckedProperty = function(a: any, b: any): boolean {
  if (a === undefined || a === null || a === '') {
    return (b === undefined || b === null || b === '');

  } else if (a === true || a === 'true') {
    return (b === true || b === 'true');

  } else if (a === false || a === 'false') {
    return (b === false || b === 'false');

  } else if (a === 0 || a === '0') {
    return (b === 0 || b === '0');
  }

  // not using strict comparison on purpose
  /* tslint:disable */
  return (a == b);
  /* tslint:enable */
};


/**
 * @private
 */
export function reorderArray(array: any[], indexes: {from: number, to: number}): any[] {
  let element = array[indexes.from];
  array.splice(indexes.from, 1);
  array.splice(indexes.to, 0, element);
  return array;
}
