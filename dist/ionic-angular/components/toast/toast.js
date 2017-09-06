var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { isPresent } from '../../util/util';
import { PORTAL_TOAST } from '../app/app-constants';
import { ToastCmp } from './toast-component';
import { ToastMdSlideIn, ToastMdSlideOut, ToastSlideIn, ToastSlideOut, ToastWpPopIn, ToastWpPopOut } from './toast-transitions';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
var Toast = (function (_super) {
    __extends(Toast, _super);
    /**
     * @param {?} app
     * @param {?=} opts
     * @param {?=} config
     */
    function Toast(app, opts, config) {
        if (opts === void 0) { opts = {}; }
        var _this = this;
        opts.dismissOnPageChange = isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;
        _this = _super.call(this, ToastCmp, opts, null) || this;
        _this._app = app;
        // set the position to the bottom if not provided
        if (!opts.position || !_this.isValidPosition(opts.position)) {
            opts.position = TOAST_POSITION_BOTTOM;
        }
        _this.isOverlay = true;
        config.setTransition('toast-slide-in', ToastSlideIn);
        config.setTransition('toast-slide-out', ToastSlideOut);
        config.setTransition('toast-md-slide-in', ToastMdSlideIn);
        config.setTransition('toast-md-slide-out', ToastMdSlideOut);
        config.setTransition('toast-wp-slide-out', ToastWpPopOut);
        config.setTransition('toast-wp-slide-in', ToastWpPopIn);
        return _this;
    }
    /**
     * @hidden
     * @param {?} direction
     * @return {?}
     */
    Toast.prototype.getTransitionName = function (direction) {
        var /** @type {?} */ key = 'toast' + (direction === 'back' ? 'Leave' : 'Enter');
        return this._nav && this._nav.config.get(key);
    };
    /**
     * @hidden
     * @param {?} position
     * @return {?}
     */
    Toast.prototype.isValidPosition = function (position) {
        return position === TOAST_POSITION_TOP || position === TOAST_POSITION_MIDDLE || position === TOAST_POSITION_BOTTOM;
    };
    /**
     * @param {?} message
     * @return {?}
     */
    Toast.prototype.setMessage = function (message) {
        this.data.message = message;
        return this;
    };
    /**
     * @param {?} dur
     * @return {?}
     */
    Toast.prototype.setDuration = function (dur) {
        this.data.duration = dur;
        return this;
    };
    /**
     * @param {?} pos
     * @return {?}
     */
    Toast.prototype.setPosition = function (pos) {
        this.data.position = pos;
        return this;
    };
    /**
     * @param {?} cssClass
     * @return {?}
     */
    Toast.prototype.setCssClass = function (cssClass) {
        this.data.cssClass = cssClass;
        return this;
    };
    /**
     * @param {?} closeButton
     * @return {?}
     */
    Toast.prototype.setShowCloseButton = function (closeButton) {
        this.data.showCloseButton = closeButton;
        return this;
    };
    /**
     * Present the toast instance.
     *
     * @param {?=} navOptions
     * @return {?}
     */
    Toast.prototype.present = function (navOptions) {
        if (navOptions === void 0) { navOptions = {}; }
        navOptions.disableApp = false;
        navOptions.keyboardClose = false;
        return this._app.present(this, navOptions, PORTAL_TOAST);
    };
    /**
     * Dismiss all toast components which have been presented.
     * @return {?}
     */
    Toast.prototype.dismissAll = function () {
        this._nav && this._nav.popAll();
    };
    return Toast;
}(ViewController));
export { Toast };
function Toast_tsickle_Closure_declarations() {
    /** @type {?} */
    Toast.prototype._app;
}
var /** @type {?} */ TOAST_POSITION_TOP = 'top';
var /** @type {?} */ TOAST_POSITION_MIDDLE = 'middle';
var /** @type {?} */ TOAST_POSITION_BOTTOM = 'bottom';
//# sourceMappingURL=toast.js.map