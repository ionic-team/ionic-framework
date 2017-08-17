/**
 * @hidden
 * Given a min and max, restrict the given number
 * to the range.
 * @param min the minimum
 * @param n the value
 * @param max the maximum
 */
export declare function clamp(min: number, n: number, max: number): number;
/** @hidden */
export declare function deepCopy(obj: any): any;
/** @hidden */
export declare function deepEqual(a: any, b: any): boolean;
/** @hidden */
export declare function debounce(fn: Function, wait: number, immediate?: boolean): any;
/**
 * @hidden
 * Rewrites an absolute URL so it works across file and http based engines
 */
export declare function normalizeURL(url: string): string;
/**
 * @hidden
 * Apply default arguments if they don't exist in
 * the first object.
 * @param {any} dest the destination to apply defaults to.
 */
export declare function defaults(dest: any, ..._args: any[]): any;
/** @hidden */
export declare function isBoolean(val: any): val is boolean;
/** @hidden */
export declare function isString(val: any): val is string;
/** @hidden */
export declare function isNumber(val: any): val is number;
/** @hidden */
export declare function isFunction(val: any): val is Function;
/** @hidden */
export declare function isDefined(val: any): boolean;
/** @hidden */
export declare function isUndefined(val: any): val is undefined;
/** @hidden */
export declare function isPresent(val: any): val is any;
/** @hidden */
export declare function isBlank(val: any): val is null;
/** @hidden */
export declare function isObject(val: any): val is Object;
/** @hidden */
export declare function isArray(val: any): val is any[];
/** @hidden */
export declare function isPrimitive(val: any): boolean;
/** @hidden */
export declare function isTrueProperty(val: any): boolean;
/** @hidden */
export declare function isCheckedProperty(a: any, b: any): boolean;
/** @hidden */
export declare type Side = 'left' | 'right' | 'start' | 'end';
/**
 * @hidden
 * Given a side, return if it should be on the right
 * based on the value of dir
 * @param side the side
 * @param isRTL whether the application dir is rtl
 * @param defaultRight whether the default side is right
 */
export declare function isRightSide(side: Side, isRTL: boolean, defaultRight?: boolean): boolean;
/** @hidden */
export declare function reorderArray(array: any[], indexes: {
    from: number;
    to: number;
}): any[];
/** @hidden */
export declare function removeArrayItem(array: any[], item: any): boolean;
/** @hidden */
export declare function swipeShouldReset(isResetDirection: boolean, isMovingFast: boolean, isOnResetZone: boolean): boolean;
/** @hidden */
declare function _runInDev(fn: Function): any;
/** @hidden */
declare function _assert(actual: any, reason: string): void;
/** @hidden */
export declare function requestIonicCallback(functionToLazy: any): any;
/** @hidden */
export { _assert as assert };
/** @hidden */
export { _runInDev as runInDev };
