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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../util/util", "../app/app-constants", "./modal-component", "./modal-transitions", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require("../../util/util");
    var app_constants_1 = require("../app/app-constants");
    var modal_component_1 = require("./modal-component");
    var modal_transitions_1 = require("./modal-transitions");
    var view_controller_1 = require("../../navigation/view-controller");
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
            opts.showBackdrop = util_1.isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
            opts.enableBackdropDismiss = util_1.isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
            data.opts = opts;
            _this = _super.call(this, modal_component_1.ModalCmp, data, null) || this;
            _this._app = app;
            _this._enterAnimation = opts.enterAnimation;
            _this._leaveAnimation = opts.leaveAnimation;
            _this.isOverlay = true;
            config.setTransition('modal-slide-in', modal_transitions_1.ModalSlideIn);
            config.setTransition('modal-slide-out', modal_transitions_1.ModalSlideOut);
            config.setTransition('modal-md-slide-in', modal_transitions_1.ModalMDSlideIn);
            config.setTransition('modal-md-slide-out', modal_transitions_1.ModalMDSlideOut);
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
            return this._app.present(this, navOptions, app_constants_1.PORTAL_MODAL);
        };
        return ModalImpl;
    }(view_controller_1.ViewController));
    exports.ModalImpl = ModalImpl;
    function ModalImpl_tsickle_Closure_declarations() {
        /** @type {?} */
        ModalImpl.prototype._app;
        /** @type {?} */
        ModalImpl.prototype._enterAnimation;
        /** @type {?} */
        ModalImpl.prototype._leaveAnimation;
    }
});
//# sourceMappingURL=modal-impl.js.map