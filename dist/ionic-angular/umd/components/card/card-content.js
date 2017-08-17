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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../config/config", "../ion"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var ion_1 = require("../ion");
    /**
     * @hidden
     */
    var CardContent = (function (_super) {
        __extends(CardContent, _super);
        /**
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         */
        function CardContent(config, elementRef, renderer) {
            return _super.call(this, config, elementRef, renderer, 'card-content') || this;
        }
        return CardContent;
    }(ion_1.Ion));
    CardContent.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-card-content'
                },] },
    ];
    /**
     * @nocollapse
     */
    CardContent.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
    ]; };
    exports.CardContent = CardContent;
    function CardContent_tsickle_Closure_declarations() {
        /** @type {?} */
        CardContent.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        CardContent.ctorParameters;
    }
});
//# sourceMappingURL=card-content.js.map