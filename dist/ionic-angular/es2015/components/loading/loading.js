import { isPresent } from '../../util/util';
import { PORTAL_LOADING } from '../app/app-constants';
import { LoadingCmp } from './loading-component';
import { LoadingMdPopIn, LoadingMdPopOut, LoadingPopIn, LoadingPopOut, LoadingWpPopIn, LoadingWpPopOut } from './loading-transitions';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export class Loading extends ViewController {
    /**
     * @param {?} app
     * @param {?=} opts
     * @param {?=} config
     */
    constructor(app, opts = {}, config) {
        opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : false;
        opts.dismissOnPageChange = isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;
        super(LoadingCmp, opts, null);
        this._app = app;
        this.isOverlay = true;
        config.setTransition('loading-pop-in', LoadingPopIn);
        config.setTransition('loading-pop-out', LoadingPopOut);
        config.setTransition('loading-md-pop-in', LoadingMdPopIn);
        config.setTransition('loading-md-pop-out', LoadingMdPopOut);
        config.setTransition('loading-wp-pop-in', LoadingWpPopIn);
        config.setTransition('loading-wp-pop-out', LoadingWpPopOut);
    }
    /**
     * @hidden
     * @param {?} direction
     * @return {?}
     */
    getTransitionName(direction) {
        let /** @type {?} */ key = (direction === 'back' ? 'loadingLeave' : 'loadingEnter');
        return this._nav && this._nav.config.get(key);
    }
    /**
     * @param {?} content
     * @return {?}
     */
    setContent(content) {
        this.data.content = content;
        return this;
    }
    /**
     * @param {?} spinner
     * @return {?}
     */
    setSpinner(spinner) {
        this.data.spinner = spinner;
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
     * @param {?} showBackdrop
     * @return {?}
     */
    setShowBackdrop(showBackdrop) {
        this.data.showBackdrop = showBackdrop;
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
     * Present the loading instance.
     *
     * @param {?=} navOptions
     * @return {?}
     */
    present(navOptions = {}) {
        return this._app.present(this, navOptions, PORTAL_LOADING);
    }
    /**
     * Dismiss all loading components which have been presented.
     * @return {?}
     */
    dismissAll() {
        this._nav && this._nav.popAll();
    }
}
function Loading_tsickle_Closure_declarations() {
    /** @type {?} */
    Loading.prototype._app;
}
//# sourceMappingURL=loading.js.map