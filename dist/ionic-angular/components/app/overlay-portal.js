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
import { ComponentFactoryResolver, Directive, ElementRef, ErrorHandler, Inject, Input, NgZone, Optional, Renderer, ViewContainerRef, forwardRef } from '@angular/core';
import { App } from './app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { Platform } from '../../platform/platform';
import { TransitionController } from '../../transitions/transition-controller';
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
}(NavControllerBase));
export { OverlayPortal };
OverlayPortal.decorators = [
    { type: Directive, args: [{
                selector: '[overlay-portal]',
            },] },
];
/**
 * @nocollapse
 */
OverlayPortal.ctorParameters = function () { return [
    { type: App, decorators: [{ type: Inject, args: [forwardRef(function () { return App; }),] },] },
    { type: Config, },
    { type: Platform, },
    { type: ElementRef, },
    { type: NgZone, },
    { type: Renderer, },
    { type: ComponentFactoryResolver, },
    { type: GestureController, },
    { type: TransitionController, },
    { type: DeepLinker, decorators: [{ type: Optional },] },
    { type: ViewContainerRef, },
    { type: DomController, },
    { type: ErrorHandler, },
]; };
OverlayPortal.propDecorators = {
    '_overlayPortal': [{ type: Input, args: ['overlay-portal',] },],
};
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
//# sourceMappingURL=overlay-portal.js.map