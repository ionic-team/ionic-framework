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
export class Header extends Ion {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} viewCtrl
     */
    constructor(config, elementRef, renderer, viewCtrl) {
        super(config, elementRef, renderer, 'header');
        viewCtrl && viewCtrl._setHeader(this);
    }
}
Header.decorators = [
    { type: Directive, args: [{
                selector: 'ion-header'
            },] },
];
/**
 * @nocollapse
 */
Header.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: ViewController, decorators: [{ type: Optional },] },
];
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