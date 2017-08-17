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
        define(["require", "exports", "@angular/core", "../../config/config", "../ion", "./navbar", "./toolbar"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var ion_1 = require("../ion");
    var navbar_1 = require("./navbar");
    var toolbar_1 = require("./toolbar");
    /**
     * \@name Title
     * \@description
     * `ion-title` is a component that sets the title of the `Toolbar` or `Navbar`
     *
     * \@usage
     *
     * ```html
     * <ion-header>
     *
     *   <ion-navbar>
     *     <ion-title>Settings</ion-title>
     *   </ion-navbar>
     *
     * </ion-header>
     * ```
     *
     * Or to create a navbar with a toolbar as a subheader:
     *
     * ```html
     * <ion-header>
     *
     *   <ion-navbar>
     *     <ion-title>Main Header</ion-title>
     *   </ion-navbar>
     *
     *   <ion-toolbar>
     *     <ion-title>Subheader</ion-title>
     *   </ion-toolbar>
     *
     * </ion-header>
     * ```
     *
     * \@demo /docs/demos/src/title/
     */
    var ToolbarTitle = (function (_super) {
        __extends(ToolbarTitle, _super);
        /**
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         * @param {?} toolbar
         * @param {?} navbar
         */
        function ToolbarTitle(config, elementRef, renderer, toolbar, navbar) {
            var _this = _super.call(this, config, elementRef, renderer, 'title') || this;
            toolbar && toolbar._setTitle(_this);
            navbar && navbar._setTitle(_this);
            return _this;
        }
        /**
         * @hidden
         * @return {?}
         */
        ToolbarTitle.prototype.getTitleText = function () {
            return this._elementRef.nativeElement.textContent;
        };
        return ToolbarTitle;
    }(ion_1.Ion));
    ToolbarTitle.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-title',
                    template: '<div class="toolbar-title" [ngClass]="\'toolbar-title-\' + _mode">' +
                        '<ng-content></ng-content>' +
                        '</div>',
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    ToolbarTitle.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: toolbar_1.Toolbar, decorators: [{ type: core_1.Optional },] },
        { type: navbar_1.Navbar, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [core_1.forwardRef(function () { return navbar_1.Navbar; }),] },] },
    ]; };
    exports.ToolbarTitle = ToolbarTitle;
    function ToolbarTitle_tsickle_Closure_declarations() {
        /** @type {?} */
        ToolbarTitle.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ToolbarTitle.ctorParameters;
    }
});
//# sourceMappingURL=toolbar-title.js.map