(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../config/config", "../../util/util", "../../platform/platform", "./fab"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var util_1 = require("../../util/util");
    var platform_1 = require("../../platform/platform");
    var fab_1 = require("./fab");
    /**
     * \@name FabList
     * \@description
     * `ion-fab-list` is a container for multiple FAB buttons. They are components of `ion-fab` and allow you to specificy the buttons position, left, right, top, bottom.
     * \@usage
     *
     * ```html
     *  <ion-fab bottom right >
     *    <button ion-fab>Share</button>
     *    <ion-fab-list side="top">
     *      <button ion-fab>Facebook</button>
     *      <button ion-fab>Twitter</button>
     *      <button ion-fab>Youtube</button>
     *    </ion-fab-list>
     *    <ion-fab-list side="left">
     *      <button ion-fab>Vimeo</button>
     *    </ion-fab-list>
     *  </ion-fab>
     * ```
     * \@module ionic
     *
     * \@demo /docs/demos/src/fab/
     * @see {\@link /docs/components#fab Fab Component Docs}
     */
    var FabList = (function () {
        /**
         * @param {?} _elementRef
         * @param {?} _renderer
         * @param {?} config
         * @param {?} _plt
         */
        function FabList(_elementRef, _renderer, config, _plt) {
            this._elementRef = _elementRef;
            this._renderer = _renderer;
            this._plt = _plt;
            this._visible = false;
            this._fabs = [];
            this._mode = config.get('mode');
        }
        Object.defineProperty(FabList.prototype, "_setbuttons", {
            /**
             * @param {?} query
             * @return {?}
             */
            set: function (query) {
                var /** @type {?} */ fabs = this._fabs = query.toArray();
                var /** @type {?} */ className = "fab-" + this._mode + "-in-list";
                for (var _i = 0, fabs_1 = fabs; _i < fabs_1.length; _i++) {
                    var fab = fabs_1[_i];
                    fab.setElementClass('fab-in-list', true);
                    fab.setElementClass(className, true);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @hidden
         * @param {?} val
         * @return {?}
         */
        FabList.prototype.setVisible = function (val) {
            var _this = this;
            var /** @type {?} */ visible = util_1.isTrueProperty(val);
            if (visible === this._visible) {
                return;
            }
            this._visible = visible;
            var /** @type {?} */ fabs = this._fabs;
            var /** @type {?} */ i = 1;
            if (visible) {
                fabs.forEach(function (fab) {
                    _this._plt.timeout(function () { return fab.setElementClass('show', true); }, i * 30);
                    i++;
                });
            }
            else {
                fabs.forEach(function (fab) { return fab.setElementClass('show', false); });
            }
            this.setElementClass('fab-list-active', visible);
        };
        /**
         * \@internal
         * @param {?} className
         * @param {?} add
         * @return {?}
         */
        FabList.prototype.setElementClass = function (className, add) {
            this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
        };
        return FabList;
    }());
    FabList.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-fab-list',
                },] },
    ];
    /**
     * @nocollapse
     */
    FabList.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: config_1.Config, },
        { type: platform_1.Platform, },
    ]; };
    FabList.propDecorators = {
        '_setbuttons': [{ type: core_1.ContentChildren, args: [fab_1.FabButton,] },],
    };
    exports.FabList = FabList;
    function FabList_tsickle_Closure_declarations() {
        /** @type {?} */
        FabList.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        FabList.ctorParameters;
        /** @type {?} */
        FabList.propDecorators;
        /** @type {?} */
        FabList.prototype._visible;
        /** @type {?} */
        FabList.prototype._fabs;
        /** @type {?} */
        FabList.prototype._mode;
        /** @type {?} */
        FabList.prototype._elementRef;
        /** @type {?} */
        FabList.prototype._renderer;
        /** @type {?} */
        FabList.prototype._plt;
    }
});
//# sourceMappingURL=fab-list.js.map