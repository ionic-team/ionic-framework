
/**
 * @hidden
 * Given a min and max, restrict the given number
 * to the range.
 * @param min the minimum
 * @param n the value
 * @param max the maximum
 */
export function clamp(min: number, n: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

/** @hidden */
export function deepCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

/** @hidden */
export function deepEqual(a: any, b: any) {
  if (a === b) {
    return true;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

/** @hidden */
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
 * @hidden
 * Rewrites an absolute URL so it works across file and http based engines
 */
export function normalizeURL(url: string): string {
  const ionic = (<any>window)['Ionic'];
  if (ionic && ionic.normalizeURL) {
    return ionic.normalizeURL(url);
  }
  return url;
}

/**
 * @hidden
 * Apply default arguments if they don't exist in
 * the first object.
 * @param {any} dest the destination to apply defaults to.
 */
export function defaults(dest: any, ..._args: any[]) {
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


/** @hidden */
export function isBoolean(val: any): val is boolean { return typeof val === 'boolean'; }
/** @hidden */
export function isString(val: any): val is string { return typeof val === 'string'; }
/** @hidden */
export function isNumber(val: any): val is number { return typeof val === 'number'; }
/** @hidden */
export function isFunction(val: any): val is Function { return typeof val === 'function'; }
/** @hidden */
export function isDefined(val: any): boolean { return typeof val !== 'undefined'; }
/** @hidden */
export function isUndefined(val: any): val is undefined { return typeof val === 'undefined'; }
/** @hidden */
export function isPresent(val: any): val is any { return val !== undefined && val !== null; }
/** @hidden */
export function isBlank(val: any): val is null { return val === undefined || val === null; }
/** @hidden */
export function isObject(val: any): val is Object { return typeof val === 'object'; }
/** @hidden */
export function isArray(val: any): val is any[] { return Array.isArray(val); }



/** @hidden */
export function isPrimitive(val: any) {
  return isString(val) || isBoolean(val) || (isNumber(val) && !isNaN(val));
}


/** @hidden */
export function isTrueProperty(val: any): boolean {
  if (typeof val === 'string') {
    val = val.toLowerCase().trim();
    return (val === 'true' || val === 'on' || val === '');
  }
  return !!val;
}


/** @hidden */
export function isCheckedProperty(a: any, b: any): boolean {
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
  return (a == b); // tslint:disable-line
}

/** @hidden */
export type Side = 'left' | 'right' | 'start' | 'end';

/**
 * @hidden
 * Given a side, return if it should be on the right
 * based on the value of dir
 * @param side the side
 * @param isRTL whether the application dir is rtl
 * @param defaultRight whether the default side is right
 */
export function isRightSide(side: Side, isRTL: boolean, defaultRight: boolean = false): boolean {
  switch (side) {
    case 'right': return true;
    case 'left': return false;
    case 'end': return !isRTL;
    case 'start': return isRTL;
    default: return defaultRight ? !isRTL : isRTL;
  }
}


/** @hidden */
export function reorderArray(array: any[], indexes: {from: number, to: number}): any[] {
  const element = array[indexes.from];
  array.splice(indexes.from, 1);
  array.splice(indexes.to, 0, element);
  return array;
}


/** @hidden */
export function removeArrayItem(array: any[], item: any) {
  const index = array.indexOf(item);
  return !!~index && !!array.splice(index, 1);
}


/** @hidden */
export function swipeShouldReset(isResetDirection: boolean, isMovingFast: boolean, isOnResetZone: boolean): boolean {
  // The logic required to know when the sliding item should close (openAmount=0)
  // depends on three booleans (isCloseDirection, isMovingFast, isOnCloseZone)
  // and it ended up being too complicated to be written manually without errors
  // so the truth table is attached below: (0=false, 1=true)
  // isCloseDirection | isMovingFast | isOnCloseZone || shouldClose
  //         0        |       0      |       0       ||    0
  //         0        |       0      |       1       ||    1
  //         0        |       1      |       0       ||    0
  //         0        |       1      |       1       ||    0
  //         1        |       0      |       0       ||    0
  //         1        |       0      |       1       ||    1
  //         1        |       1      |       0       ||    1
  //         1        |       1      |       1       ||    1
  // The resulting expression was generated by resolving the K-map (Karnaugh map):
  let shouldClose = (!isMovingFast && isOnResetZone) || (isResetDirection && isMovingFast);
  return shouldClose;
}


/** @hidden */
const ASSERT_ENABLED = true;


/** @hidden */
function _runInDev(fn: Function) {
  if (ASSERT_ENABLED === true) {
    return fn();
  }
}


/** @hidden */
function _assert(actual: any, reason: string) {
  if (!actual && ASSERT_ENABLED === true) {
    let message = 'IONIC ASSERT: ' + reason;
    console.error(message);
    debugger; // tslint:disable-line
    throw new Error(message);
  }
}

/** @hidden */
export function requestIonicCallback(functionToLazy: any) {
  if ('requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(functionToLazy);
  } else {
    return setTimeout(functionToLazy, 500);
  }
}

/** @hidden */
export { _assert as assert};

/** @hidden */
export { _runInDev as runInDev};
