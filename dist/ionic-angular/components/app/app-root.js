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
import { Component, ComponentFactoryResolver, ElementRef, Inject, OpaqueToken, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { App } from './app';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { OverlayPortal } from './overlay-portal';
import { Platform } from '../../platform/platform';
import * as Constants from './app-constants';
export var /** @type {?} */ AppRootToken = new OpaqueToken('USERROOT');
/**
 * @hidden
 */
var IonicApp = (function (_super) {
    __extends(IonicApp, _super);
    /**
     * @param {?} _userCmp
     * @param {?} _cfr
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} config
     * @param {?} _plt
     * @param {?} app
     */
    function IonicApp(_userCmp, _cfr, elementRef, renderer, config, _plt, app) {
        var _this = _super.call(this, config, elementRef, renderer, 'app-root') || this;
        _this._userCmp = _userCmp;
        _this._cfr = _cfr;
        _this._plt = _plt;
        // register with App that this is Ionic's appRoot component. tada!
        app._appRoot = _this;
        _this._stopScrollPlugin = window['IonicStopScroll'];
        return _this;
    }
    /**
     * @return {?}
     */
    IonicApp.prototype.ngOnInit = function () {
        var _this = this;
        // load the user root component
        // into Ionic's root component
        var /** @type {?} */ factory = this._cfr.resolveComponentFactory(this._userCmp);
        var /** @type {?} */ componentRef = this._viewport.createComponent(factory);
        this._renderer.setElementClass(componentRef.location.nativeElement, 'app-root', true);
        componentRef.changeDetectorRef.detectChanges();
        // set the mode class name
        // ios/md/wp
        this.setElementClass(this._config.get('mode'), true);
        var /** @type {?} */ versions = this._plt.versions();
        this._plt.platforms().forEach(function (platformName) {
            // platform-ios
            var /** @type {?} */ platformClass = 'platform-' + platformName;
            _this.setElementClass(platformClass, true);
            var /** @type {?} */ platformVersion = versions[platformName];
            if (platformVersion) {
                // platform-ios9
                platformClass += platformVersion.major;
                _this.setElementClass(platformClass, true);
                // platform-ios9_3
                _this.setElementClass(platformClass + '_' + platformVersion.minor, true);
            }
        });
        // touch devices should not use :hover CSS pseudo
        // enable :hover CSS when the "hoverCSS" setting is not false
        if (this._config.getBoolean('hoverCSS', true)) {
            this.setElementClass('enable-hover', true);
        }
        // sweet, the app root has loaded!
        // which means angular and ionic has fully loaded!
        // fire off the platform prepare ready, which could
        // have been switched out by any of the platform engines
        this._plt.prepareReady();
    };
    /**
     * @hidden
     * @param {?=} portal
     * @return {?}
     */
    IonicApp.prototype._getPortal = function (portal) {
        if (portal === Constants.PORTAL_LOADING) {
            return this._loadingPortal;
        }
        if (portal === Constants.PORTAL_TOAST) {
            return this._toastPortal;
        }
        // Modals need their own overlay becuase we don't want an ActionSheet
        // or Alert to trigger lifecycle events inside a modal
        if (portal === Constants.PORTAL_MODAL) {
            return this._modalPortal;
        }
        return this._overlayPortal;
    };
    /**
     * @return {?}
     */
    IonicApp.prototype._getActivePortal = function () {
        var /** @type {?} */ defaultPortal = this._overlayPortal;
        var /** @type {?} */ modalPortal = this._modalPortal;
        var /** @type {?} */ hasModal = modalPortal.length() > 0;
        var /** @type {?} */ hasDefault = defaultPortal.length() > 0;
        if (!hasModal && !hasDefault) {
            return null;
        }
        else if (hasModal && hasDefault) {
            var /** @type {?} */ defaultIndex = defaultPortal.getActive().getZIndex();
            var /** @type {?} */ modalIndex = modalPortal.getActive().getZIndex();
            if (defaultIndex > modalIndex) {
                return defaultPortal;
            }
            else {
                (void 0) /* assert */;
                return modalPortal;
            }
        }
        if (hasModal) {
            return modalPortal;
        }
        else if (hasDefault) {
            return defaultPortal;
        }
    };
    /**
     * @param {?} shouldDisableScroll
     * @return {?}
     */
    IonicApp.prototype._disableScroll = function (shouldDisableScroll) {
        var _this = this;
        if (shouldDisableScroll) {
            this.stopScroll().then(function () {
                _this._tmr = _this._plt.timeout(function () {
                    (void 0) /* console.debug */;
                    _this.setElementClass('disable-scroll', true);
                }, 32);
            });
        }
        else {
            var /** @type {?} */ plugin = this._stopScrollPlugin;
            if (plugin && plugin.cancel) {
                plugin.cancel();
            }
            clearTimeout(this._tmr);
            (void 0) /* console.debug */;
            this.setElementClass('disable-scroll', false);
        }
    };
    /**
     * @return {?}
     */
    IonicApp.prototype.stopScroll = function () {
        var _this = this;
        if (this._stopScrollPlugin) {
            return new Promise(function (resolve) {
                _this._stopScrollPlugin.stop(function () { return resolve(true); });
            });
        }
        else {
            return Promise.resolve(false);
        }
    };
    return IonicApp;
}(Ion));
export { IonicApp };
IonicApp.decorators = [
    { type: Component, args: [{
                selector: 'ion-app',
                template: '<div #viewport app-viewport></div>' +
                    '<div #modalPortal overlay-portal></div>' +
                    '<div #overlayPortal overlay-portal></div>' +
                    '<div #loadingPortal class="loading-portal" overlay-portal></div>' +
                    '<div #toastPortal class="toast-portal" [overlay-portal]="10000"></div>' +
                    '<div class="click-block"></div>'
            },] },
];
/**
 * @nocollapse
 */
IonicApp.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [AppRootToken,] },] },
    { type: ComponentFactoryResolver, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Config, },
    { type: Platform, },
    { type: App, },
]; };
IonicApp.propDecorators = {
    '_viewport': [{ type: ViewChild, args: ['viewport', { read: ViewContainerRef },] },],
    '_modalPortal': [{ type: ViewChild, args: ['modalPortal', { read: OverlayPortal },] },],
    '_overlayPortal': [{ type: ViewChild, args: ['overlayPortal', { read: OverlayPortal },] },],
    '_loadingPortal': [{ type: ViewChild, args: ['loadingPortal', { read: OverlayPortal },] },],
    '_toastPortal': [{ type: ViewChild, args: ['toastPortal', { read: OverlayPortal },] },],
};
function IonicApp_tsickle_Closure_declarations() {
    /** @type {?} */
    IonicApp.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    IonicApp.ctorParameters;
    /** @type {?} */
    IonicApp.propDecorators;
    /** @type {?} */
    IonicApp.prototype._stopScrollPlugin;
    /** @type {?} */
    IonicApp.prototype._tmr;
    /** @type {?} */
    IonicApp.prototype._viewport;
    /** @type {?} */
    IonicApp.prototype._modalPortal;
    /** @type {?} */
    IonicApp.prototype._overlayPortal;
    /** @type {?} */
    IonicApp.prototype._loadingPortal;
    /** @type {?} */
    IonicApp.prototype._toastPortal;
    /** @type {?} */
    IonicApp.prototype._userCmp;
    /** @type {?} */
    IonicApp.prototype._cfr;
    /** @type {?} */
    IonicApp.prototype._plt;
}
//# sourceMappingURL=app-root.js.map