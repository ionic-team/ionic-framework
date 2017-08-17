(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../app/app", "../../config/config", "../../platform/platform"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var app_1 = require("../app/app");
    var config_1 = require("../../config/config");
    var platform_1 = require("../../platform/platform");
    /**
     * @hidden
     */
    var ClickBlock = (function () {
        /**
         * @param {?} app
         * @param {?} config
         * @param {?} plt
         * @param {?} elementRef
         * @param {?} renderer
         */
        function ClickBlock(app, config, plt, elementRef, renderer) {
            this.plt = plt;
            this.elementRef = elementRef;
            this.renderer = renderer;
            this._showing = false;
            app._clickBlock = this;
            var enabled = this.isEnabled = config.getBoolean('clickBlock', true);
            if (enabled) {
                this._setElementClass('click-block-enabled', true);
            }
        }
        /**
         * @param {?} shouldShow
         * @param {?=} expire
         * @param {?=} minDuration
         * @return {?}
         */
        ClickBlock.prototype.activate = function (shouldShow, expire, minDuration) {
            if (expire === void 0) { expire = 100; }
            if (minDuration === void 0) { minDuration = 0; }
            if (this.isEnabled) {
                this.plt.cancelTimeout(this._tmr);
                if (shouldShow) {
                    // remember when we started the click block
                    this._start = Date.now();
                    // figure out the minimum time it should be showing until
                    // this is useful for transitions that are less than 300ms
                    this._minEnd = this._start + (minDuration || 0);
                    this._activate(true);
                }
                this._tmr = this.plt.timeout(this._activate.bind(this, false), expire);
            }
        };
        /**
         * \@internal
         * @param {?} shouldShow
         * @return {?}
         */
        ClickBlock.prototype._activate = function (shouldShow) {
            if (this._showing !== shouldShow) {
                if (!shouldShow) {
                    // check if it was enabled before the minimum duration
                    // this is useful for transitions that are less than 300ms
                    var /** @type {?} */ now = Date.now();
                    if (now < this._minEnd) {
                        this._tmr = this.plt.timeout(this._activate.bind(this, false), this._minEnd - now);
                        return;
                    }
                }
                this._setElementClass('click-block-active', shouldShow);
                this._showing = shouldShow;
            }
        };
        /**
         * @param {?} className
         * @param {?} add
         * @return {?}
         */
        ClickBlock.prototype._setElementClass = function (className, add) {
            this.renderer.setElementClass(this.elementRef.nativeElement, className, add);
        };
        return ClickBlock;
    }());
    ClickBlock.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '.click-block'
                },] },
    ];
    /**
     * @nocollapse
     */
    ClickBlock.ctorParameters = function () { return [
        { type: app_1.App, decorators: [{ type: core_1.Inject, args: [core_1.forwardRef(function () { return app_1.App; }),] },] },
        { type: config_1.Config, },
        { type: platform_1.Platform, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
    ]; };
    exports.ClickBlock = ClickBlock;
    function ClickBlock_tsickle_Closure_declarations() {
        /** @type {?} */
        ClickBlock.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ClickBlock.ctorParameters;
        /** @type {?} */
        ClickBlock.prototype._tmr;
        /** @type {?} */
        ClickBlock.prototype._showing;
        /** @type {?} */
        ClickBlock.prototype._start;
        /** @type {?} */
        ClickBlock.prototype._minEnd;
        /** @type {?} */
        ClickBlock.prototype.isEnabled;
        /** @type {?} */
        ClickBlock.prototype.plt;
        /** @type {?} */
        ClickBlock.prototype.elementRef;
        /** @type {?} */
        ClickBlock.prototype.renderer;
    }
});
//# sourceMappingURL=click-block.js.map