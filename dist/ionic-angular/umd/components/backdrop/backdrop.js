(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    /**
     * @hidden
     */
    var Backdrop = (function () {
        /**
         * @param {?} _elementRef
         * @param {?} _renderer
         */
        function Backdrop(_elementRef, _renderer) {
            this._elementRef = _elementRef;
            this._renderer = _renderer;
        }
        /**
         * @return {?}
         */
        Backdrop.prototype.getNativeElement = function () {
            return this._elementRef.nativeElement;
        };
        /**
         * @param {?} className
         * @param {?} add
         * @return {?}
         */
        Backdrop.prototype.setElementClass = function (className, add) {
            this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
        };
        return Backdrop;
    }());
    Backdrop.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-backdrop',
                    host: {
                        'role': 'presentation',
                        'tappable': '',
                        'disable-activated': ''
                    },
                },] },
    ];
    /**
     * @nocollapse
     */
    Backdrop.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
    ]; };
    exports.Backdrop = Backdrop;
    function Backdrop_tsickle_Closure_declarations() {
        /** @type {?} */
        Backdrop.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Backdrop.ctorParameters;
        /** @type {?} */
        Backdrop.prototype._elementRef;
        /** @type {?} */
        Backdrop.prototype._renderer;
    }
});
//# sourceMappingURL=backdrop.js.map