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
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Optional, Renderer, ViewEncapsulation, forwardRef, } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { Navbar } from './navbar';
import { Toolbar } from './toolbar';
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
}(Ion));
export { ToolbarTitle };
ToolbarTitle.decorators = [
    { type: Component, args: [{
                selector: 'ion-title',
                template: '<div class="toolbar-title" [ngClass]="\'toolbar-title-\' + _mode">' +
                    '<ng-content></ng-content>' +
                    '</div>',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
ToolbarTitle.ctorParameters = function () { return [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Toolbar, decorators: [{ type: Optional },] },
    { type: Navbar, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return Navbar; }),] },] },
]; };
function ToolbarTitle_tsickle_Closure_declarations() {
    /** @type {?} */
    ToolbarTitle.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ToolbarTitle.ctorParameters;
}
//# sourceMappingURL=toolbar-title.js.map