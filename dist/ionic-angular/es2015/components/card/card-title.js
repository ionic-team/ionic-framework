import { Directive, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * @hidden
 */
export class CardTitle extends Ion {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'card-title');
    }
}
CardTitle.decorators = [
    { type: Directive, args: [{
                selector: 'ion-card-title'
            },] },
];
/**
 * @nocollapse
 */
CardTitle.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
function CardTitle_tsickle_Closure_declarations() {
    /** @type {?} */
    CardTitle.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CardTitle.ctorParameters;
}
//# sourceMappingURL=card-title.js.map