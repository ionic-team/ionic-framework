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
    var VirtualItem = (function () {
        /**
         * @param {?} templateRef
         * @param {?} viewContainer
         */
        function VirtualItem(templateRef, viewContainer) {
            this.templateRef = templateRef;
            this.viewContainer = viewContainer;
        }
        return VirtualItem;
    }());
    VirtualItem.decorators = [
        { type: core_1.Directive, args: [{ selector: '[virtualItem]' },] },
    ];
    /**
     * @nocollapse
     */
    VirtualItem.ctorParameters = function () { return [
        { type: core_1.TemplateRef, },
        { type: core_1.ViewContainerRef, },
    ]; };
    exports.VirtualItem = VirtualItem;
    function VirtualItem_tsickle_Closure_declarations() {
        /** @type {?} */
        VirtualItem.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        VirtualItem.ctorParameters;
        /** @type {?} */
        VirtualItem.prototype.templateRef;
        /** @type {?} */
        VirtualItem.prototype.viewContainer;
    }
});
//# sourceMappingURL=virtual-item.js.map