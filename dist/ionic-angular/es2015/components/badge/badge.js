import { Directive, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * \@name Badge
 * \@module ionic
 * \@description
 * Badges are simple components in Ionic containing numbers or text. You can display a badge to indicate that there is new information associated with the item it is on.
 * @see {\@link /docs/components/#badges Badges Component Docs}
 */
export class Badge extends Ion {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'badge');
    }
}
Badge.decorators = [
    { type: Directive, args: [{
                selector: 'ion-badge'
            },] },
];
/**
 * @nocollapse
 */
Badge.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
function Badge_tsickle_Closure_declarations() {
    /** @type {?} */
    Badge.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Badge.ctorParameters;
}
//# sourceMappingURL=badge.js.map