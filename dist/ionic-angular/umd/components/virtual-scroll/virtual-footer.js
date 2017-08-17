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
    var VirtualFooter = (function () {
        /**
         * @param {?} templateRef
         */
        function VirtualFooter(templateRef) {
            this.templateRef = templateRef;
        }
        return VirtualFooter;
    }());
    VirtualFooter.decorators = [
        { type: core_1.Directive, args: [{ selector: '[virtualFooter]' },] },
    ];
    /**
     * @nocollapse
     */
    VirtualFooter.ctorParameters = function () { return [
        { type: core_1.TemplateRef, },
    ]; };
    exports.VirtualFooter = VirtualFooter;
    function VirtualFooter_tsickle_Closure_declarations() {
        /** @type {?} */
        VirtualFooter.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        VirtualFooter.ctorParameters;
        /** @type {?} */
        VirtualFooter.prototype.templateRef;
    }
});
//# sourceMappingURL=virtual-footer.js.map