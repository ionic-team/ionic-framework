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
}(Ion));
export { Footer };
Footer.decorators = [
    { type: Directive, args: [{
                selector: 'ion-footer'
            },] },
];
/**
 * @nocollapse
 */
Footer.ctorParameters = function () { return [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: ViewController, decorators: [{ type: Optional },] },
]; };
function Footer_tsickle_Closure_declarations() {
    /** @type {?} */
    Footer.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Footer.ctorParameters;
}
//# sourceMappingURL=toolbar-footer.js.map