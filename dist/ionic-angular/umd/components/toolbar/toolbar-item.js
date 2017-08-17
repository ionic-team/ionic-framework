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
        define(["require", "exports", "@angular/core", "../button/button", "../../config/config", "../ion", "./navbar", "./toolbar"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var button_1 = require("../button/button");
    var config_1 = require("../../config/config");
    var ion_1 = require("../ion");
    var navbar_1 = require("./navbar");
    var toolbar_1 = require("./toolbar");
    /**
     * @hidden
     */
    var ToolbarItem = (function (_super) {
        __extends(ToolbarItem, _super);
        /**
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         * @param {?} toolbar
         * @param {?} navbar
         */
        function ToolbarItem(config, elementRef, renderer, toolbar, navbar) {
            var _this = _super.call(this, config, elementRef, renderer, 'bar-buttons') || this;
            _this.inToolbar = !!(toolbar || navbar);
            return _this;
        }
        Object.defineProperty(ToolbarItem.prototype, "_buttons", {
            /**
             * @param {?} buttons
             * @return {?}
             */
            set: function (buttons) {
                if (this.inToolbar) {
                    buttons.forEach(function (button) {
                        button.setRole('bar-button');
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        return ToolbarItem;
    }(ion_1.Ion));
    ToolbarItem.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-buttons,[menuToggle]'
                },] },
    ];
    /**
     * @nocollapse
     */
    ToolbarItem.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: toolbar_1.Toolbar, decorators: [{ type: core_1.Optional },] },
        { type: navbar_1.Navbar, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [core_1.forwardRef(function () { return navbar_1.Navbar; }),] },] },
    ]; };
    ToolbarItem.propDecorators = {
        '_buttons': [{ type: core_1.ContentChildren, args: [button_1.Button,] },],
    };
    exports.ToolbarItem = ToolbarItem;
    function ToolbarItem_tsickle_Closure_declarations() {
        /** @type {?} */
        ToolbarItem.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ToolbarItem.ctorParameters;
        /** @type {?} */
        ToolbarItem.propDecorators;
        /** @type {?} */
        ToolbarItem.prototype.inToolbar;
    }
});
//# sourceMappingURL=toolbar-item.js.map