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
    var VirtualHeader = (function () {
        /**
         * @param {?} templateRef
         */
        function VirtualHeader(templateRef) {
            this.templateRef = templateRef;
        }
        return VirtualHeader;
    }());
    VirtualHeader.decorators = [
        { type: core_1.Directive, args: [{ selector: '[virtualHeader]' },] },
    ];
    /**
     * @nocollapse
     */
    VirtualHeader.ctorParameters = function () { return [
        { type: core_1.TemplateRef, },
    ]; };
    exports.VirtualHeader = VirtualHeader;
    function VirtualHeader_tsickle_Closure_declarations() {
        /** @type {?} */
        VirtualHeader.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        VirtualHeader.ctorParameters;
        /** @type {?} */
        VirtualHeader.prototype.templateRef;
    }
});
//# sourceMappingURL=virtual-header.js.map