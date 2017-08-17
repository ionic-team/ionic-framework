/**
 * @hidden
 * Given a min and max, restrict the given number
 * to the range.
 * @param {?} min the minimum
 * @param {?} n the value
 * @param {?} max the maximum
 * @return {?}
 */
export function clamp(min, n, max) {
    return Math.max(min, Math.min(n, max));
}
/**
 * @hidden
 * @param {?} obj
 * @return {?}
 */
export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * @hidden
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
export function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
    return JSON.stringify(a) === JSON.stringify(b);
}
/**
 * @hidden
 * @param {?} fn
 * @param {?} wait
 * @param {?=} immediate
 * @return {?}
 */
export function debounce(fn, wait, immediate = false) {
    var /** @type {?} */ timeout, /** @type {?} */ args, /** @type {?} */ context, /** @type {?} */ timestamp, /** @type {?} */ result;
    return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var /** @type {?} */ later = function () {
            var /** @type {?} */ last = Date.now() - timestamp;
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            }
            else {
                timeout = null;
                if (!immediate)
                    result = fn.apply(context, args);
            }
        };
        var /** @type {?} */ callNow = immediate && !timeout;
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow)
            result = fn.apply(context, args);
        return result;
    };
}
/**
 * @hidden
 * Rewrites an absolute URL so it works across file and http based engines
 * @param {?} url
 * @return {?}
 */
export function normalizeURL(url) {
    const /** @type {?} */ ionic = ((window))['Ionic'];
    if (ionic && ionic.normalizeURL) {
        return ionic.normalizeURL(url);
    }
    return url;
}
/**
 * @hidden
 * Apply default arguments if they don't exist in
 * the first object.
 * @param {?} dest
 * @param {...?} _args
 * @return {?}
 */
export function defaults(dest, ..._args) {
    for (var /** @type {?} */ i = arguments.length - 1; i >= 1; i--) {
        var /** @type {?} */ source = arguments[i];
        if (source) {
            for (var /** @type {?} */ key in source) {
                if (source.hasOwnProperty(key) && !dest.hasOwnProperty(key)) {
                    dest[key] = source[key];
                }
            }
        }
    }
    return dest;
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
export function isBoolean(val) { return typeof val === 'boolean'; }
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
export function isString(val) { return typeof val === 'string'; }
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
export function isNumber(val) { return typeof val === 'number'; }
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
export function isFunction(val) { return typeof val === 'function'; }
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
export function isDefined(val) { return typeof val !== 'undefined'; }
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
export function isUndefined(val) { return typeof val === 'undefined'; }
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
export function isPresent(val) { return val !== undefined && val !== null; }
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
export function isBlank(val) { return val === undefined || val === null; }
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
export function isObject(val) { return typeof val === 'object'; }
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
export function isArray(val) { return Array.isArray(val); }
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
export function isPrimitive(val) {
    return isString(val) || isBoolean(val) || (isNumber(val) && !isNaN(val));
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
export function isTrueProperty(val) {
    if (typeof val === 'string') {
        val = val.toLowerCase().trim();
        return (val === 'true' || val === 'on' || val === '');
    }
    return !!val;
}
/**
 * @hidden
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
export function isCheckedProperty(a, b) {
    if (a === undefined || a === null || a === '') {
        return (b === undefined || b === null || b === '');
    }
    else if (a === true || a === 'true') {
        return (b === true || b === 'true');
    }
    else if (a === false || a === 'false') {
        return (b === false || b === 'false');
    }
    else if (a === 0 || a === '0') {
        return (b === 0 || b === '0');
    }
    // not using strict comparison on purpose
    return (a == b); // tslint:disable-line
}
/**
 * @hidden
 * Given a side, return if it should be on the right
 * based on the value of dir
 * @param {?} side the side
 * @param {?} isRTL whether the application dir is rtl
 * @param {?=} defaultRight whether the default side is right
 * @return {?}
 */
export function isRightSide(side, isRTL, defaultRight = false) {
    switch (side) {
        case 'right': return true;
        case 'left': return false;
        case 'end': return !isRTL;
        case 'start': return isRTL;
        default: return defaultRight ? !isRTL : isRTL;
    }
}
/**
 * @hidden
 * @param {?} array
 * @param {?} indexes
 * @return {?}
 */
export function reorderArray(array, indexes) {
    const /** @type {?} */ element = array[indexes.from];
    array.splice(indexes.from, 1);
    array.splice(indexes.to, 0, element);
    return array;
}
/**
 * @hidden
 * @param {?} array
 * @param {?} item
 * @return {?}
 */
export function removeArrayItem(array, item) {
    const /** @type {?} */ index = array.indexOf(item);
    return !!~index && !!array.splice(index, 1);
}
/**
 * @hidden
 * @param {?} isResetDirection
 * @param {?} isMovingFast
 * @param {?} isOnResetZone
 * @return {?}
 */
export function swipeShouldReset(isResetDirection, isMovingFast, isOnResetZone) {
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
    let /** @type {?} */ shouldClose = (!isMovingFast && isOnResetZone) || (isResetDirection && isMovingFast);
    return shouldClose;
}
/**
 * @hidden
 */
const ASSERT_ENABLED = true;
/**
 * @hidden
 * @param {?} fn
 * @return {?}
 */
function _runInDev(fn) {
    if (ASSERT_ENABLED === true) {
        return fn();
    }
}
/**
 * @hidden
 * @param {?} actual
 * @param {?} reason
 * @return {?}
 */
function _assert(actual, reason) {
    if (!actual && ASSERT_ENABLED === true) {
        let /** @type {?} */ message = 'IONIC ASSERT: ' + reason;
        console.error(message);
        debugger; // tslint:disable-line
        throw new Error(message);
    }
}
/**
 * @hidden
 * @param {?} functionToLazy
 * @return {?}
 */
export function requestIonicCallback(functionToLazy) {
    if ('requestIdleCallback' in window) {
        return ((window)).requestIdleCallback(functionToLazy);
    }
    else {
        return setTimeout(functionToLazy, 500);
    }
}
/** @hidden */
export { _assert as assert };
/** @hidden */
export { _runInDev as runInDev };
//# sourceMappingURL=util.js.map