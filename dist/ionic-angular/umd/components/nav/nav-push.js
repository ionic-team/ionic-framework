(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../navigation/nav-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var nav_controller_1 = require("../../navigation/nav-controller");
    /**
     * \@name NavPush
     * \@description
     * Directive to declaratively push a new page to the current nav
     * stack.
     *
     * \@usage
     * ```html
     * <button ion-button [navPush]="pushPage"></button>
     * ```
     *
     * To specify parameters you can use array syntax or the `navParams`
     * property:
     *
     * ```html
     * <button ion-button [navPush]="pushPage" [navParams]="params">Go</button>
     * ```
     *
     * Where `pushPage` and `params` are specified in your component,
     * and `pushPage` contains a reference to a
     * component you would like to push:
     *
     * ```ts
     * import { LoginPage } from './login';
     *
     * \@Component({
     *   template: `<button ion-button [navPush]="pushPage" [navParams]="params">Go</button>`
     * })
     * class MyPage {
     *   params: Object;
     *   pushPage: any;
     *   constructor(){
     *     this.pushPage = LoginPage;
     *     this.params = { id: 42 };
     *   }
     * }
     * ```
     *
     * \@demo /docs/demos/src/navigation/
     * @see {\@link /docs/components#navigation Navigation Component Docs}
     * @see {\@link ../NavPop NavPop API Docs}
     *
     */
    var NavPush = (function () {
        /**
         * @param {?} _nav
         */
        function NavPush(_nav) {
            this._nav = _nav;
            if (!_nav) {
                console.error('navPush must be within a NavController');
            }
        }
        /**
         * @hidden
         * @return {?}
         */
        NavPush.prototype.onClick = function () {
            if (this._nav && this.navPush) {
                this._nav.push(this.navPush, this.navParams);
                return false;
            }
            return true;
        };
        return NavPush;
    }());
    NavPush.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[navPush]'
                },] },
    ];
    /**
     * @nocollapse
     */
    NavPush.ctorParameters = function () { return [
        { type: nav_controller_1.NavController, decorators: [{ type: core_1.Optional },] },
    ]; };
    NavPush.propDecorators = {
        'navPush': [{ type: core_1.Input },],
        'navParams': [{ type: core_1.Input },],
        'onClick': [{ type: core_1.HostListener, args: ['click',] },],
    };
    exports.NavPush = NavPush;
    function NavPush_tsickle_Closure_declarations() {
        /** @type {?} */
        NavPush.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        NavPush.ctorParameters;
        /** @type {?} */
        NavPush.propDecorators;
        /**
         * \@input {Page | string} The component class or deeplink name you want to push onto the navigation stack.
         * @type {?}
         */
        NavPush.prototype.navPush;
        /**
         * \@input {any} Any NavParams you want to pass along to the next view.
         * @type {?}
         */
        NavPush.prototype.navParams;
        /** @type {?} */
        NavPush.prototype._nav;
    }
});
//# sourceMappingURL=nav-push.js.map