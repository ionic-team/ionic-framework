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
        define(["require", "exports", "@angular/core", "./app", "../../config/config", "../../navigation/deep-linker", "../../platform/dom-controller", "../../gestures/gesture-controller", "../../navigation/nav-controller-base", "../../platform/platform", "../../transitions/transition-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var app_1 = require("./app");
    var config_1 = require("../../config/config");
    var deep_linker_1 = require("../../navigation/deep-linker");
    var dom_controller_1 = require("../../platform/dom-controller");
    var gesture_controller_1 = require("../../gestures/gesture-controller");
    var nav_controller_base_1 = require("../../navigation/nav-controller-base");
    var platform_1 = require("../../platform/platform");
    var transition_controller_1 = require("../../transitions/transition-controller");
    /**
     * @hidden
     */
    var OverlayPortal = (function (_super) {
        __extends(OverlayPortal, _super);
        /**
         * @param {?} app
         * @param {?} config
         * @param {?} plt
         * @param {?} elementRef
         * @param {?} zone
         * @param {?} renderer
         * @param {?} cfr
         * @param {?} gestureCtrl
         * @param {?} transCtrl
         * @param {?} linker
         * @param {?} viewPort
         * @param {?} domCtrl
         * @param {?} errHandler
         */
        function OverlayPortal(app, config, plt, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, viewPort, domCtrl, errHandler) {
            var _this = _super.call(this, null, app, config, plt, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, domCtrl, errHandler) || this;
            _this._isPortal = true;
            _this._init = true;
            _this.setViewport(viewPort);
            // on every page change make sure the portal has
            // dismissed any views that should be auto dismissed on page change
            app.viewDidLeave.subscribe(function (view) {
                if (!view.isOverlay) {
                    _this.dismissPageChangeViews();
                }
            });
            return _this;
        }
        Object.defineProperty(OverlayPortal.prototype, "_overlayPortal", {
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._zIndexOffset = (val || 0);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        OverlayPortal.prototype.ngOnDestroy = function () {
            this.destroy();
        };
        /**
         * @return {?}
         */
        OverlayPortal.prototype.getType = function () {
            return 'portal';
        };
        /**
         * @return {?}
         */
        OverlayPortal.prototype.getSecondaryIdentifier = function () {
            return null;
        };
        return OverlayPortal;
    }(nav_controller_base_1.NavControllerBase));
    OverlayPortal.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[overlay-portal]',
                },] },
    ];
    /**
     * @nocollapse
     */
    OverlayPortal.ctorParameters = function () { return [
        { type: app_1.App, decorators: [{ type: core_1.Inject, args: [core_1.forwardRef(function () { return app_1.App; }),] },] },
        { type: config_1.Config, },
        { type: platform_1.Platform, },
        { type: core_1.ElementRef, },
        { type: core_1.NgZone, },
        { type: core_1.Renderer, },
        { type: core_1.ComponentFactoryResolver, },
        { type: gesture_controller_1.GestureController, },
        { type: transition_controller_1.TransitionController, },
        { type: deep_linker_1.DeepLinker, decorators: [{ type: core_1.Optional },] },
        { type: core_1.ViewContainerRef, },
        { type: dom_controller_1.DomController, },
        { type: core_1.ErrorHandler, },
    ]; };
    OverlayPortal.propDecorators = {
        '_overlayPortal': [{ type: core_1.Input, args: ['overlay-portal',] },],
    };
    exports.OverlayPortal = OverlayPortal;
    function OverlayPortal_tsickle_Closure_declarations() {
        /** @type {?} */
        OverlayPortal.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        OverlayPortal.ctorParameters;
        /** @type {?} */
        OverlayPortal.propDecorators;
    }
});
//# sourceMappingURL=overlay-portal.js.map