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
    var ItemContent = (function () {
        function ItemContent() {
        }
        return ItemContent;
    }());
    ItemContent.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-item,[ion-item]',
                    host: {
                        'class': 'item-block'
                    }
                },] },
    ];
    /**
     * @nocollapse
     */
    ItemContent.ctorParameters = function () { return []; };
    exports.ItemContent = ItemContent;
    function ItemContent_tsickle_Closure_declarations() {
        /** @type {?} */
        ItemContent.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ItemContent.ctorParameters;
    }
});
//# sourceMappingURL=item-content.js.map