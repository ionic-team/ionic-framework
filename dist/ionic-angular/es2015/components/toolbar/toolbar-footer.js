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
export class Footer extends Ion {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} viewCtrl
     */
    constructor(config, elementRef, renderer, viewCtrl) {
        super(config, elementRef, renderer, 'footer');
        viewCtrl && viewCtrl._setFooter(this);
    }
}
Footer.decorators = [
    { type: Directive, args: [{
                selector: 'ion-footer'
            },] },
];
/**
 * @nocollapse
 */
Footer.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: ViewController, decorators: [{ type: Optional },] },
];
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