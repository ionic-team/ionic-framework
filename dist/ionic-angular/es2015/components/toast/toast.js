import { isPresent } from '../../util/util';
import { PORTAL_TOAST } from '../app/app-constants';
import { ToastCmp } from './toast-component';
import { ToastMdSlideIn, ToastMdSlideOut, ToastSlideIn, ToastSlideOut, ToastWpPopIn, ToastWpPopOut } from './toast-transitions';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export class Toast extends ViewController {
    /**
     * @param {?} app
     * @param {?=} opts
     * @param {?=} config
     */
    constructor(app, opts = {}, config) {
        opts.dismissOnPageChange = isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;
        super(ToastCmp, opts, null);
        this._app = app;
        // set the position to the bottom if not provided
        if (!opts.position || !this.isValidPosition(opts.position)) {
            opts.position = TOAST_POSITION_BOTTOM;
        }
        this.isOverlay = true;
        config.setTransition('toast-slide-in', ToastSlideIn);
        config.setTransition('toast-slide-out', ToastSlideOut);
        config.setTransition('toast-md-slide-in', ToastMdSlideIn);
        config.setTransition('toast-md-slide-out', ToastMdSlideOut);
        config.setTransition('toast-wp-slide-out', ToastWpPopOut);
        config.setTransition('toast-wp-slide-in', ToastWpPopIn);
    }
    /**
     * @hidden
     * @param {?} direction
     * @return {?}
     */
    getTransitionName(direction) {
        let /** @type {?} */ key = 'toast' + (direction === 'back' ? 'Leave' : 'Enter');
        return this._nav && this._nav.config.get(key);
    }
    /**
     * @hidden
     * @param {?} position
     * @return {?}
     */
    isValidPosition(position) {
        return position === TOAST_POSITION_TOP || position === TOAST_POSITION_MIDDLE || position === TOAST_POSITION_BOTTOM;
    }
    /**
     * @param {?} message
     * @return {?}
     */
    setMessage(message) {
        this.data.message = message;
        return this;
    }
    /**
     * @param {?} dur
     * @return {?}
     */
    setDuration(dur) {
        this.data.duration = dur;
        return this;
    }
    /**
     * @param {?} pos
     * @return {?}
     */
    setPosition(pos) {
        this.data.position = pos;
        return this;
    }
    /**
     * @param {?} cssClass
     * @return {?}
     */
    setCssClass(cssClass) {
        this.data.cssClass = cssClass;
        return this;
    }
    /**
     * @param {?} closeButton
     * @return {?}
     */
    setShowCloseButton(closeButton) {
        this.data.showCloseButton = closeButton;
        return this;
    }
    /**
     * Present the toast instance.
     *
     * @param {?=} navOptions
     * @return {?}
     */
    present(navOptions = {}) {
        navOptions.disableApp = false;
        navOptions.keyboardClose = false;
        return this._app.present(this, navOptions, PORTAL_TOAST);
    }
    /**
     * Dismiss all toast components which have been presented.
     * @return {?}
     */
    dismissAll() {
        this._nav && this._nav.popAll();
    }
}
function Toast_tsickle_Closure_declarations() {
    /** @type {?} */
    Toast.prototype._app;
}
const /** @type {?} */ TOAST_POSITION_TOP = 'top';
const /** @type {?} */ TOAST_POSITION_MIDDLE = 'middle';
const /** @type {?} */ TOAST_POSITION_BOTTOM = 'bottom';
//# sourceMappingURL=toast.js.map