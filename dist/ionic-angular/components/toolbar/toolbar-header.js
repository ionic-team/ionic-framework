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
import { Directive, ElementRef, Optional, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { ViewController } from '../../navigation/view-controller';
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
}(Ion));
export { Header };
Header.decorators = [
    { type: Directive, args: [{
                selector: 'ion-header'
            },] },
];
/**
 * @nocollapse
 */
Header.ctorParameters = function () { return [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: ViewController, decorators: [{ type: Optional },] },
]; };
function Header_tsickle_Closure_declarations() {
    /** @type {?} */
    Header.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Header.ctorParameters;
}
//# sourceMappingURL=toolbar-header.js.map