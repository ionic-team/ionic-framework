(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../config/config", "../../gestures/gesture-controller", "../../util/util", "../../platform/key", "../../navigation/nav-params", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var gesture_controller_1 = require("../../gestures/gesture-controller");
    var util_1 = require("../../util/util");
    var key_1 = require("../../platform/key");
    var nav_params_1 = require("../../navigation/nav-params");
    var view_controller_1 = require("../../navigation/view-controller");
    /**
     * @hidden
     */
    var LoadingCmp = (function () {
        /**
         * @param {?} _viewCtrl
         * @param {?} _config
         * @param {?} _elementRef
         * @param {?} gestureCtrl
         * @param {?} params
         * @param {?} renderer
         */
        function LoadingCmp(_viewCtrl, _config, _elementRef, gestureCtrl, params, renderer) {
            this._viewCtrl = _viewCtrl;
            this._config = _config;
            (void 0) /* assert */;
            this.gestureBlocker = gestureCtrl.createBlocker(gesture_controller_1.BLOCK_ALL);
            this.d = params.data;
            renderer.setElementClass(_elementRef.nativeElement, "loading-" + _config.get('mode'), true);
            if (this.d.cssClass) {
                this.d.cssClass.split(' ').forEach(function (cssClass) {
                    // Make sure the class isn't whitespace, otherwise it throws exceptions
                    if (cssClass.trim() !== '')
                        renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
                });
            }
            this.id = (++loadingIds);
        }
        /**
         * @return {?}
         */
        LoadingCmp.prototype.ngOnInit = function () {
            // If no spinner was passed in loading options we need to fall back
            // to the loadingSpinner in the app's config, then the mode spinner
            if (util_1.isUndefined(this.d.spinner)) {
                this.d.spinner = this._config.get('loadingSpinner', this._config.get('spinner', 'ios'));
            }
            // If the user passed hide to the spinner we don't want to show it
            this.showSpinner = util_1.isDefined(this.d.spinner) && this.d.spinner !== 'hide';
        };
        /**
         * @return {?}
         */
        LoadingCmp.prototype.ionViewWillEnter = function () {
            this.gestureBlocker.block();
        };
        /**
         * @return {?}
         */
        LoadingCmp.prototype.ionViewDidLeave = function () {
            this.gestureBlocker.unblock();
        };
        /**
         * @return {?}
         */
        LoadingCmp.prototype.ionViewDidEnter = function () {
            var _this = this;
            // If there is a duration, dismiss after that amount of time
            if (this.d && this.d.duration) {
                this.durationTimeout = setTimeout(function () { return _this.dismiss('backdrop'); }, this.d.duration);
            }
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        LoadingCmp.prototype.keyUp = function (ev) {
            if (this._viewCtrl.isLast() && ev.keyCode === key_1.KEY_ESCAPE) {
                this.bdClick();
            }
        };
        /**
         * @return {?}
         */
        LoadingCmp.prototype.bdClick = function () {
            if (this.d.enableBackdropDismiss) {
                this.dismiss('backdrop');
            }
        };
        /**
         * @param {?} role
         * @return {?}
         */
        LoadingCmp.prototype.dismiss = function (role) {
            if (this.durationTimeout) {
                clearTimeout(this.durationTimeout);
            }
            return this._viewCtrl.dismiss(null, role);
        };
        /**
         * @return {?}
         */
        LoadingCmp.prototype.ngOnDestroy = function () {
            (void 0) /* assert */;
            this.gestureBlocker.destroy();
        };
        return LoadingCmp;
    }());
    LoadingCmp.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-loading',
                    template: '<ion-backdrop [hidden]="!d.showBackdrop" (click)="bdClick()" [class.backdrop-no-tappable]="!d.enableBackdropDismiss"></ion-backdrop>' +
                        '<div class="loading-wrapper">' +
                        '<div *ngIf="showSpinner" class="loading-spinner">' +
                        '<ion-spinner [name]="d.spinner"></ion-spinner>' +
                        '</div>' +
                        '<div *ngIf="d.content" [innerHTML]="d.content" class="loading-content"></div>' +
                        '</div>',
                    host: {
                        'role': 'dialog'
                    },
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    LoadingCmp.ctorParameters = function () { return [
        { type: view_controller_1.ViewController, },
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: gesture_controller_1.GestureController, },
        { type: nav_params_1.NavParams, },
        { type: core_1.Renderer, },
    ]; };
    LoadingCmp.propDecorators = {
        'keyUp': [{ type: core_1.HostListener, args: ['body:keyup', ['$event'],] },],
    };
    exports.LoadingCmp = LoadingCmp;
    function LoadingCmp_tsickle_Closure_declarations() {
        /** @type {?} */
        LoadingCmp.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        LoadingCmp.ctorParameters;
        /** @type {?} */
        LoadingCmp.propDecorators;
        /** @type {?} */
        LoadingCmp.prototype.d;
        /** @type {?} */
        LoadingCmp.prototype.id;
        /** @type {?} */
        LoadingCmp.prototype.showSpinner;
        /** @type {?} */
        LoadingCmp.prototype.durationTimeout;
        /** @type {?} */
        LoadingCmp.prototype.gestureBlocker;
        /** @type {?} */
        LoadingCmp.prototype._viewCtrl;
        /** @type {?} */
        LoadingCmp.prototype._config;
    }
    var /** @type {?} */ loadingIds = -1;
});
//# sourceMappingURL=loading-component.js.map