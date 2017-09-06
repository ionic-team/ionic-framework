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
     * \@name NavPop
     * \@description
     * Directive to declaratively pop the current page off from the
     * navigation stack.
     *
     * \@usage
     * ```html
     * <ion-content>
     *
     *  <button ion-button navPop>Go Back</button>
     *
     * </ion-content>
     * ```
     *
     * Similar to {\@link /docs/api/components/nav/NavPush/ `NavPush` }
     * \@demo /docs/demos/src/navigation/
     * @see {\@link /docs/components#navigation Navigation Component Docs}
     * @see {\@link ../NavPush NavPush API Docs}
     */
    var NavPop = (function () {
        /**
         * @param {?} _nav
         */
        function NavPop(_nav) {
            this._nav = _nav;
            if (!_nav) {
                console.error('navPop must be within a NavController');
            }
        }
        /**
         * @hidden
         * @return {?}
         */
        NavPop.prototype.onClick = function () {
            // If no target, or if target is _self, prevent default browser behavior
            if (this._nav) {
                this._nav.pop().catch(function () {
                    (void 0) /* console.debug */;
                });
                return false;
            }
            return true;
        };
        return NavPop;
    }());
    NavPop.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[navPop]'
                },] },
    ];
    /**
     * @nocollapse
     */
    NavPop.ctorParameters = function () { return [
        { type: nav_controller_1.NavController, decorators: [{ type: core_1.Optional },] },
    ]; };
    NavPop.propDecorators = {
        'onClick': [{ type: core_1.HostListener, args: ['click',] },],
    };
    exports.NavPop = NavPop;
    function NavPop_tsickle_Closure_declarations() {
        /** @type {?} */
        NavPop.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        NavPop.ctorParameters;
        /** @type {?} */
        NavPop.propDecorators;
        /** @type {?} */
        NavPop.prototype._nav;
    }
});
//# sourceMappingURL=nav-pop.js.map