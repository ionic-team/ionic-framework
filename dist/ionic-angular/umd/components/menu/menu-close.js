(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../app/menu-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var menu_controller_1 = require("../app/menu-controller");
    /**
     * \@name MenuClose
     * \@description
     * The `menuClose` directive can be placed on any button to close an open menu.
     *
     * \@usage
     *
     * A simple `menuClose` button can be added using the following markup:
     *
     * ```html
     * <button ion-button menuClose>Close Menu</button>
     * ```
     *
     * To close a certain menu by its id or side, give the `menuClose`
     * directive a value.
     *
     * ```html
     * <button ion-button menuClose="left">Close Left Menu</button>
     * ```
     *
     * \@demo /docs/demos/src/menu/
     * @see {\@link /docs/components#menus Menu Component Docs}
     * @see {\@link ../../menu/Menu Menu API Docs}
     */
    var MenuClose = (function () {
        /**
         * @param {?} _menu
         */
        function MenuClose(_menu) {
            this._menu = _menu;
        }
        /**
         * @hidden
         * @return {?}
         */
        MenuClose.prototype.close = function () {
            var /** @type {?} */ menu = this._menu.get(this.menuClose);
            menu && menu.close();
        };
        return MenuClose;
    }());
    MenuClose.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[menuClose]'
                },] },
    ];
    /**
     * @nocollapse
     */
    MenuClose.ctorParameters = function () { return [
        { type: menu_controller_1.MenuController, },
    ]; };
    MenuClose.propDecorators = {
        'menuClose': [{ type: core_1.Input },],
        'close': [{ type: core_1.HostListener, args: ['click',] },],
    };
    exports.MenuClose = MenuClose;
    function MenuClose_tsickle_Closure_declarations() {
        /** @type {?} */
        MenuClose.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        MenuClose.ctorParameters;
        /** @type {?} */
        MenuClose.propDecorators;
        /**
         * @hidden
         * @type {?}
         */
        MenuClose.prototype.menuClose;
        /** @type {?} */
        MenuClose.prototype._menu;
    }
});
//# sourceMappingURL=menu-close.js.map