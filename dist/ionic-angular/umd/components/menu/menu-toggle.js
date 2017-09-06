(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../button/button", "../app/menu-controller", "../toolbar/navbar", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var button_1 = require("../button/button");
    var menu_controller_1 = require("../app/menu-controller");
    var navbar_1 = require("../toolbar/navbar");
    var view_controller_1 = require("../../navigation/view-controller");
    /**
     * \@name MenuToggle
     * \@description
     * The `menuToggle` directive can be placed on any button to toggle a menu open or closed.
     * If it is added to the [NavBar](../../navbar/NavBar) of a page, the button will only appear
     * when the page it's in is currently a root page. See the [Menu Navigation Bar Behavior](../Menu#navigation-bar-behavior)
     * docs for more information.
     *
     *
     * \@usage
     *
     * A simple `menuToggle` button can be added using the following markup:
     *
     * ```html
     * <button ion-button menuToggle>Toggle Menu</button>
     * ```
     *
     * To toggle a specific menu by its id or side, give the `menuToggle`
     * directive a value.
     *
     * ```html
     * <button ion-button menuToggle="right">Toggle Right Menu</button>
     * ```
     *
     * If placing the `menuToggle` in a navbar or toolbar, it should be
     * placed as a child of the `<ion-navbar>` or `<ion-toolbar>`, and not in
     * the `<ion-buttons>` element:
     *
     * ```html
     * <ion-header>
     *
     *   <ion-navbar>
     *     <ion-buttons start>
     *       <button ion-button>
     *         <ion-icon name="contact"></ion-icon>
     *       </button>
     *     </ion-buttons>
     *     <button ion-button menuToggle>
     *       <ion-icon name="menu"></ion-icon>
     *     </button>
     *     <ion-title>
     *       Title
     *     </ion-title>
     *     <ion-buttons end>
     *       <button ion-button (click)="doClick()">
     *         <ion-icon name="more"></ion-icon>
     *       </button>
     *     </ion-buttons>
     *   </ion-navbar>
     *
     * </ion-header>
     * ```
     *
     * Similar to `<ion-buttons>`, the `menuToggle` can be positioned using
     * `start`, `end`, `left`, or `right`:
     *
     * ```html
     * <ion-toolbar>
     *   <button ion-button menuToggle right>
     *     <ion-icon name="menu"></ion-icon>
     *   </button>
     *   <ion-title>
     *     Title
     *   </ion-title>
     *   <ion-buttons end>
     *     <button ion-button (click)="doClick()">
     *       <ion-icon name="more"></ion-icon>
     *     </button>
     *   </ion-buttons>
     * </ion-toolbar>
     * ```
     *
     * See the [Toolbar API docs](../../toolbar/Toolbar) for more information
     * on the different positions.
     *
     * \@demo /docs/demos/src/menu/
     * @see {\@link /docs/components#menus Menu Component Docs}
     * @see {\@link ../../menu/Menu Menu API Docs}
     */
    var MenuToggle = (function () {
        /**
         * @param {?} _menu
         * @param {?} _viewCtrl
         * @param {?} _button
         * @param {?} _navbar
         */
        function MenuToggle(_menu, _viewCtrl, _button, _navbar) {
            this._menu = _menu;
            this._viewCtrl = _viewCtrl;
            this._button = _button;
            this._isButton = !!_button;
            this._inNavbar = !!_navbar;
        }
        /**
         * @return {?}
         */
        MenuToggle.prototype.ngAfterContentInit = function () {
            // Add the bar-button-menutoggle / button-menutoggle class
            if (this._isButton) {
                this._button._setClass('menutoggle', true);
            }
        };
        /**
         * @hidden
         * @return {?}
         */
        MenuToggle.prototype.toggle = function () {
            var /** @type {?} */ menu = this._menu.get(this.menuToggle);
            menu && menu.toggle();
        };
        Object.defineProperty(MenuToggle.prototype, "isHidden", {
            /**
             * @hidden
             * @return {?}
             */
            get: function () {
                var /** @type {?} */ menu = this._menu.get(this.menuToggle);
                if (this._inNavbar && this._viewCtrl) {
                    if (!menu || !menu._canOpen()) {
                        return true;
                    }
                    if (this._viewCtrl.isFirst()) {
                        // this is the first view, so it should always show
                        return false;
                    }
                    if (menu) {
                        // this is not the root view, so see if this menu
                        // is configured to still be enabled if it's not the root view
                        return !menu.persistent;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        return MenuToggle;
    }());
    MenuToggle.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[menuToggle]',
                    host: {
                        '[hidden]': 'isHidden'
                    }
                },] },
    ];
    /**
     * @nocollapse
     */
    MenuToggle.ctorParameters = function () { return [
        { type: menu_controller_1.MenuController, },
        { type: view_controller_1.ViewController, decorators: [{ type: core_1.Optional },] },
        { type: button_1.Button, decorators: [{ type: core_1.Optional },] },
        { type: navbar_1.Navbar, decorators: [{ type: core_1.Optional },] },
    ]; };
    MenuToggle.propDecorators = {
        'menuToggle': [{ type: core_1.Input },],
        'toggle': [{ type: core_1.HostListener, args: ['click',] },],
    };
    exports.MenuToggle = MenuToggle;
    function MenuToggle_tsickle_Closure_declarations() {
        /** @type {?} */
        MenuToggle.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        MenuToggle.ctorParameters;
        /** @type {?} */
        MenuToggle.propDecorators;
        /**
         * @hidden
         * @type {?}
         */
        MenuToggle.prototype.menuToggle;
        /**
         * @hidden
         * @type {?}
         */
        MenuToggle.prototype._isButton;
        /**
         * @hidden
         * @type {?}
         */
        MenuToggle.prototype._inNavbar;
        /** @type {?} */
        MenuToggle.prototype._menu;
        /** @type {?} */
        MenuToggle.prototype._viewCtrl;
        /** @type {?} */
        MenuToggle.prototype._button;
    }
});
//# sourceMappingURL=menu-toggle.js.map