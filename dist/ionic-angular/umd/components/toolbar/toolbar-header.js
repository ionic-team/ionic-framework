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
     * \@name Header
     * \@description
     * Header is a parent component that holds the navbar and toolbar component.
     * It's important to note that `ion-header` needs to be the one of the three root elements of a page
     *
     * \@usage
     *
     * ```html
     * <ion-header>
     *   <ion-navbar>
     *     <ion-title>Page1</ion-title>
     *   </ion-navbar>
     *
     *   <ion-toolbar>
     *     <ion-title>Subheader</ion-title>
     *   </ion-toolbar>
     * </ion-header>
     *
     * <ion-content></ion-content>
     * ```
     *
     */
    var Header = (function (_super) {
        __extends(Header, _super);
        /**
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         * @param {?} viewCtrl
         */
        function Header(config, elementRef, renderer, viewCtrl) {
            var _this = _super.call(this, config, elementRef, renderer, 'header') || this;
            viewCtrl && viewCtrl._setHeader(_this);
            return _this;
        }
        return Header;
    }(ion_1.Ion));
    Header.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-header'
                },] },
    ];
    /**
     * @nocollapse
     */
    Header.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: view_controller_1.ViewController, decorators: [{ type: core_1.Optional },] },
    ]; };
    exports.Header = Header;
    function Header_tsickle_Closure_declarations() {
        /** @type {?} */
        Header.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Header.ctorParameters;
    }
});
//# sourceMappingURL=toolbar-header.js.map