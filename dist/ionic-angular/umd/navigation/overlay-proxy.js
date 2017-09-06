(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../util/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require("../util/util");
    var OverlayProxy = (function () {
        /**
         * @param {?} _app
         * @param {?} _component
         * @param {?} _config
         * @param {?} _deepLinker
         */
        function OverlayProxy(_app, _component, _config, _deepLinker) {
            this._app = _app;
            this._component = _component;
            this._config = _config;
            this._deepLinker = _deepLinker;
        }
        /**
         * @return {?}
         */
        OverlayProxy.prototype.getImplementation = function () {
            throw new Error('Child class must implement "getImplementation" method');
        };
        /**
         * Present the modal instance.
         *
         * @param {?=} navOptions
         * @return {?}
         */
        OverlayProxy.prototype.present = function (navOptions) {
            var _this = this;
            if (navOptions === void 0) { navOptions = {}; }
            // check if it's a lazy loaded component, or not
            var /** @type {?} */ isLazyLoaded = util_1.isString(this._component);
            if (isLazyLoaded) {
                return this._deepLinker.getComponentFromName(this._component).then(function (loadedComponent) {
                    _this._component = loadedComponent;
                    return _this.createAndPresentOverlay(navOptions);
                });
            }
            else {
                return this.createAndPresentOverlay(navOptions);
            }
        };
        /**
         * @param {?=} data
         * @param {?=} role
         * @param {?=} navOptions
         * @return {?}
         */
        OverlayProxy.prototype.dismiss = function (data, role, navOptions) {
            if (this.overlay) {
                return this.overlay.dismiss(data, role, navOptions);
            }
        };
        /**
         * Called when the current viewController has be successfully dismissed
         * @param {?} callback
         * @return {?}
         */
        OverlayProxy.prototype.onDidDismiss = function (callback) {
            this._onDidDismiss = callback;
            if (this.overlay) {
                this.overlay.onDidDismiss(this._onDidDismiss);
            }
        };
        /**
         * @param {?} navOptions
         * @return {?}
         */
        OverlayProxy.prototype.createAndPresentOverlay = function (navOptions) {
            this.overlay = this.getImplementation();
            this.overlay.onWillDismiss(this._onWillDismiss);
            this.overlay.onDidDismiss(this._onDidDismiss);
            return this.overlay.present(navOptions);
        };
        /**
         * Called when the current viewController will be dismissed
         * @param {?} callback
         * @return {?}
         */
        OverlayProxy.prototype.onWillDismiss = function (callback) {
            this._onWillDismiss = callback;
            if (this.overlay) {
                this.overlay.onWillDismiss(this._onWillDismiss);
            }
        };
        return OverlayProxy;
    }());
    exports.OverlayProxy = OverlayProxy;
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
});
//# sourceMappingURL=overlay-proxy.js.map