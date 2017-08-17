import { isString } from '../util/util';
export class OverlayProxy {
    /**
     * @param {?} _app
     * @param {?} _component
     * @param {?} _config
     * @param {?} _deepLinker
     */
    constructor(_app, _component, _config, _deepLinker) {
        this._app = _app;
        this._component = _component;
        this._config = _config;
        this._deepLinker = _deepLinker;
    }
    /**
     * @return {?}
     */
    getImplementation() {
        throw new Error('Child class must implement "getImplementation" method');
    }
    /**
     * Present the modal instance.
     *
     * @param {?=} navOptions
     * @return {?}
     */
    present(navOptions = {}) {
        // check if it's a lazy loaded component, or not
        const /** @type {?} */ isLazyLoaded = isString(this._component);
        if (isLazyLoaded) {
            return this._deepLinker.getComponentFromName(this._component).then((loadedComponent) => {
                this._component = loadedComponent;
                return this.createAndPresentOverlay(navOptions);
            });
        }
        else {
            return this.createAndPresentOverlay(navOptions);
        }
    }
    /**
     * @param {?=} data
     * @param {?=} role
     * @param {?=} navOptions
     * @return {?}
     */
    dismiss(data, role, navOptions) {
        if (this.overlay) {
            return this.overlay.dismiss(data, role, navOptions);
        }
    }
    /**
     * Called when the current viewController has be successfully dismissed
     * @param {?} callback
     * @return {?}
     */
    onDidDismiss(callback) {
        this._onDidDismiss = callback;
        if (this.overlay) {
            this.overlay.onDidDismiss(this._onDidDismiss);
        }
    }
    /**
     * @param {?} navOptions
     * @return {?}
     */
    createAndPresentOverlay(navOptions) {
        this.overlay = this.getImplementation();
        this.overlay.onWillDismiss(this._onWillDismiss);
        this.overlay.onDidDismiss(this._onDidDismiss);
        return this.overlay.present(navOptions);
    }
    /**
     * Called when the current viewController will be dismissed
     * @param {?} callback
     * @return {?}
     */
    onWillDismiss(callback) {
        this._onWillDismiss = callback;
        if (this.overlay) {
            this.overlay.onWillDismiss(this._onWillDismiss);
        }
    }
}
function OverlayProxy_tsickle_Closure_declarations() {
    /** @type {?} */
    OverlayProxy.prototype.overlay;
    /** @type {?} */
    OverlayProxy.prototype._onWillDismiss;
    /** @type {?} */
    OverlayProxy.prototype._onDidDismiss;
    /** @type {?} */
    OverlayProxy.prototype._app;
    /** @type {?} */
    OverlayProxy.prototype._component;
    /** @type {?} */
    OverlayProxy.prototype._config;
    /** @type {?} */
    OverlayProxy.prototype._deepLinker;
}
//# sourceMappingURL=overlay-proxy.js.map