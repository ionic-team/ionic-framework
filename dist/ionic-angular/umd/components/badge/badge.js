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
     * \@name Badge
     * \@module ionic
     * \@description
     * Badges are simple components in Ionic containing numbers or text. You can display a badge to indicate that there is new information associated with the item it is on.
     * @see {\@link /docs/components/#badges Badges Component Docs}
     */
    var Badge = (function (_super) {
        __extends(Badge, _super);
        /**
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         */
        function Badge(config, elementRef, renderer) {
            return _super.call(this, config, elementRef, renderer, 'badge') || this;
        }
        return Badge;
    }(ion_1.Ion));
    Badge.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-badge'
                },] },
    ];
    /**
     * @nocollapse
     */
    Badge.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
    ]; };
    exports.Badge = Badge;
    function Badge_tsickle_Closure_declarations() {
        /** @type {?} */
        Badge.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Badge.ctorParameters;
    }
});
//# sourceMappingURL=badge.js.map