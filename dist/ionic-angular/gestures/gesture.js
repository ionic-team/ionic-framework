import { defaults } from '../util/util';
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL, Hammer } from './hammer';
/**
 * @hidden
 * A gesture recognizer class.
 *
 * TODO(mlynch): Re-enable the DOM event simulation that was causing issues (or verify hammer does this already, it might);
 */
var Gesture = (function () {
    /**
     * @param {?} element
     * @param {?=} opts
     */
    function Gesture(element, opts) {
        if (opts === void 0) { opts = {}; }
        this._callbacks = {};
        this.isListening = false;
        defaults(opts, {
            domEvents: true
        });
        this.element = element;
        // Map 'x' or 'y' string to hammerjs opts
        this.direction = opts.direction || 'x';
        opts.direction = this.direction === 'x' ?
            DIRECTION_HORIZONTAL :
            DIRECTION_VERTICAL;
        this._options = opts;
    }
    /**
     * @param {?} opts
     * @return {?}
     */
    Gesture.prototype.options = function (opts) {
        Object.assign(this._options, opts);
    };
    /**
     * @param {?} type
     * @param {?} cb
     * @return {?}
     */
    Gesture.prototype.on = function (type, cb) {
        if (type === 'pinch' || type === 'rotate') {
            this._hammer.get(type).set({ enable: true });
        }
        this._hammer.on(type, cb);
        (this._callbacks[type] || (this._callbacks[type] = [])).push(cb);
    };
    /**
     * @param {?} type
     * @param {?} cb
     * @return {?}
     */
    Gesture.prototype.off = function (type, cb) {
        this._hammer.off(type, this._callbacks[type] ? cb : null);
    };
    /**
     * @return {?}
     */
    Gesture.prototype.listen = function () {
        if (!this.isListening) {
            this._hammer = Hammer(this.element, this._options);
        }
        this.isListening = true;
    };
    /**
     * @return {?}
     */
    Gesture.prototype.unlisten = function () {
        var /** @type {?} */ eventType;
        var /** @type {?} */ i;
        if (this._hammer && this.isListening) {
            for (eventType in this._callbacks) {
                for (i = 0; i < this._callbacks[eventType].length; i++) {
                    this._hammer.off(eventType, this._callbacks[eventType]);
                }
            }
            this._hammer.destroy();
        }
        this._callbacks = {};
        this._hammer = null;
        this.isListening = false;
    };
    /**
     * @return {?}
     */
    Gesture.prototype.destroy = function () {
        this.unlisten();
        this.element = this._options = null;
    };
    return Gesture;
}());
export { Gesture };
function Gesture_tsickle_Closure_declarations() {
    /** @type {?} */
    Gesture.prototype._hammer;
    /** @type {?} */
    Gesture.prototype._options;
    /** @type {?} */
    Gesture.prototype._callbacks;
    /** @type {?} */
    Gesture.prototype.element;
    /** @type {?} */
    Gesture.prototype.direction;
    /** @type {?} */
    Gesture.prototype.isListening;
}
//# sourceMappingURL=gesture.js.map