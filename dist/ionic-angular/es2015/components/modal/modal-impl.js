import { isPresent } from '../../util/util';
import { PORTAL_MODAL } from '../app/app-constants';
import { ModalCmp } from './modal-component';
import { ModalMDSlideIn, ModalMDSlideOut, ModalSlideIn, ModalSlideOut } from './modal-transitions';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export class ModalImpl extends ViewController {
    /**
     * @param {?} app
     * @param {?} component
     * @param {?} data
     * @param {?=} opts
     * @param {?=} config
     */
    constructor(app, component, data, opts = {}, config) {
        data = data || {};
        data.component = component;
        opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
        data.opts = opts;
        super(ModalCmp, data, null);
        this._app = app;
        this._enterAnimation = opts.enterAnimation;
        this._leaveAnimation = opts.leaveAnimation;
        this.isOverlay = true;
        config.setTransition('modal-slide-in', ModalSlideIn);
        config.setTransition('modal-slide-out', ModalSlideOut);
        config.setTransition('modal-md-slide-in', ModalMDSlideIn);
        config.setTransition('modal-md-slide-out', ModalMDSlideOut);
    }
    /**
     * @hidden
     * @param {?} direction
     * @return {?}
     */
    getTransitionName(direction) {
        let /** @type {?} */ key;
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
    }
    /**
     * Present the action sheet instance.
     *
     * @param {?=} navOptions
     * @return {?}
     */
    present(navOptions = {}) {
        navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
        return this._app.present(this, navOptions, PORTAL_MODAL);
    }
}
function ModalImpl_tsickle_Closure_declarations() {
    /** @type {?} */
    ModalImpl.prototype._app;
    /** @type {?} */
    ModalImpl.prototype._enterAnimation;
    /** @type {?} */
    ModalImpl.prototype._leaveAnimation;
}
//# sourceMappingURL=modal-impl.js.map