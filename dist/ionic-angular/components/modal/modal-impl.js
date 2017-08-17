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
import { PORTAL_MODAL } from '../app/app-constants';
import { ModalCmp } from './modal-component';
import { ModalMDSlideIn, ModalMDSlideOut, ModalSlideIn, ModalSlideOut } from './modal-transitions';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
var ModalImpl = (function (_super) {
    __extends(ModalImpl, _super);
    /**
     * @param {?} app
     * @param {?} component
     * @param {?} data
     * @param {?=} opts
     * @param {?=} config
     */
    function ModalImpl(app, component, data, opts, config) {
        if (opts === void 0) { opts = {}; }
        var _this = this;
        data = data || {};
        data.component = component;
        opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
        data.opts = opts;
        _this = _super.call(this, ModalCmp, data, null) || this;
        _this._app = app;
        _this._enterAnimation = opts.enterAnimation;
        _this._leaveAnimation = opts.leaveAnimation;
        _this.isOverlay = true;
        config.setTransition('modal-slide-in', ModalSlideIn);
        config.setTransition('modal-slide-out', ModalSlideOut);
        config.setTransition('modal-md-slide-in', ModalMDSlideIn);
        config.setTransition('modal-md-slide-out', ModalMDSlideOut);
        return _this;
    }
    /**
     * @hidden
     * @param {?} direction
     * @return {?}
     */
    ModalImpl.prototype.getTransitionName = function (direction) {
        var /** @type {?} */ key;
        if (direction === 'back') {
            if (this._leaveAnimation) {
                return this._leaveAnimation;
            }
            key = 'modalLeave';
        }
        else {
            if (this._enterAnimation) {
                return this._enterAnimation;
            }
            key = 'modalEnter';
        }
        return this._nav && this._nav.config.get(key);
    };
    /**
     * Present the action sheet instance.
     *
     * @param {?=} navOptions
     * @return {?}
     */
    ModalImpl.prototype.present = function (navOptions) {
        if (navOptions === void 0) { navOptions = {}; }
        navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
        return this._app.present(this, navOptions, PORTAL_MODAL);
    };
    return ModalImpl;
}(ViewController));
export { ModalImpl };
function ModalImpl_tsickle_Closure_declarations() {
    /** @type {?} */
    ModalImpl.prototype._app;
    /** @type {?} */
    ModalImpl.prototype._enterAnimation;
    /** @type {?} */
    ModalImpl.prototype._leaveAnimation;
}
//# sourceMappingURL=modal-impl.js.map