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
        define(["require", "exports", "@angular/core", "../../config/config", "../ion", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var ion_1 = require("../ion");
    var view_controller_1 = require("../../navigation/view-controller");
    /**
     * \@name Footer
     * \@description
     * Footer is a root component of a page that sits at the bottom of the page.
     * Footer can be a wrapper for `ion-toolbar` to make sure the content area is sized correctly.
     *
     * \@usage
     *
     * ```html
     * <ion-content></ion-content>
     *
     * <ion-footer>
     *   <ion-toolbar>
     *     <ion-title>Footer</ion-title>
     *   </ion-toolbar>
     * </ion-footer>
     * ```
     *
     */
    var Footer = (function (_super) {
        __extends(Footer, _super);
        /**
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         * @param {?} viewCtrl
         */
        function Footer(config, elementRef, renderer, viewCtrl) {
            var _this = _super.call(this, config, elementRef, renderer, 'footer') || this;
            viewCtrl && viewCtrl._setFooter(_this);
            return _this;
        }
        return Footer;
    }(ion_1.Ion));
    Footer.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-footer'
                },] },
    ];
    /**
     * @nocollapse
     */
    Footer.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: view_controller_1.ViewController, decorators: [{ type: core_1.Optional },] },
    ]; };
    exports.Footer = Footer;
    function Footer_tsickle_Closure_declarations() {
        /** @type {?} */
        Footer.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Footer.ctorParameters;
    }
});
//# sourceMappingURL=toolbar-footer.js.map