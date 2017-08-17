(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../navigation/deep-linker", "../../navigation/view-controller", "./nav-pop"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var deep_linker_1 = require("../../navigation/deep-linker");
    var view_controller_1 = require("../../navigation/view-controller");
    var nav_pop_1 = require("./nav-pop");
    /**
     * @hidden
     */
    var NavPopAnchor = (function () {
        /**
         * @param {?} host
         * @param {?} linker
         * @param {?} viewCtrl
         */
        function NavPopAnchor(host, linker, viewCtrl) {
            this.host = host;
            this.linker = linker;
            this.viewCtrl = viewCtrl;
        }
        /**
         * @return {?}
         */
        NavPopAnchor.prototype.updateHref = function () {
            if (this.host && this.viewCtrl) {
                var /** @type {?} */ previousView = this.host._nav.getPrevious(this.viewCtrl);
                this._href = (previousView && this.linker.createUrl(this.host._nav, this.viewCtrl.component, this.viewCtrl.data)) || '#';
            }
            else {
                this._href = '#';
            }
        };
        /**
         * @return {?}
         */
        NavPopAnchor.prototype.ngAfterContentInit = function () {
            this.updateHref();
        };
        return NavPopAnchor;
    }());
    NavPopAnchor.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'a[navPop]',
                    host: {
                        '[attr.href]': '_href'
                    }
                },] },
    ];
    /**
     * @nocollapse
     */
    NavPopAnchor.ctorParameters = function () { return [
        { type: nav_pop_1.NavPop, decorators: [{ type: core_1.Optional },] },
        { type: deep_linker_1.DeepLinker, },
        { type: view_controller_1.ViewController, decorators: [{ type: core_1.Optional },] },
    ]; };
    exports.NavPopAnchor = NavPopAnchor;
    function NavPopAnchor_tsickle_Closure_declarations() {
        /** @type {?} */
        NavPopAnchor.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        NavPopAnchor.ctorParameters;
        /** @type {?} */
        NavPopAnchor.prototype._href;
        /** @type {?} */
        NavPopAnchor.prototype.host;
        /** @type {?} */
        NavPopAnchor.prototype.linker;
        /** @type {?} */
        NavPopAnchor.prototype.viewCtrl;
    }
});
//# sourceMappingURL=nav-pop-anchor.js.map