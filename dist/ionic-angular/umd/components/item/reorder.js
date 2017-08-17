(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./item-reorder-util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var item_reorder_util_1 = require("./item-reorder-util");
    /**
     * @hidden
     */
    var Reorder = (function () {
        /**
         * @param {?} elementRef
         */
        function Reorder(elementRef) {
            this.elementRef = elementRef;
            elementRef.nativeElement['$ionComponent'] = this;
        }
        /**
         * @return {?}
         */
        Reorder.prototype.getReorderNode = function () {
            return item_reorder_util_1.findReorderItem(this.elementRef.nativeElement, null);
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        Reorder.prototype.onClick = function (ev) {
            // Stop propagation if click event reaches ion-reorder
            ev.preventDefault();
            ev.stopPropagation();
        };
        return Reorder;
    }());
    Reorder.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-reorder',
                    template: "<ion-icon name=\"reorder\"></ion-icon>"
                },] },
    ];
    /**
     * @nocollapse
     */
    Reorder.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
    ]; };
    Reorder.propDecorators = {
        'onClick': [{ type: core_1.HostListener, args: ['click', ['$event'],] },],
    };
    exports.Reorder = Reorder;
    function Reorder_tsickle_Closure_declarations() {
        /** @type {?} */
        Reorder.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Reorder.ctorParameters;
        /** @type {?} */
        Reorder.propDecorators;
        /** @type {?} */
        Reorder.prototype.elementRef;
    }
});
//# sourceMappingURL=reorder.js.map