import { Directive, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * @hidden
 */
export class CardContent extends Ion {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'card-content');
    }
}
CardContent.decorators = [
    { type: Directive, args: [{
                selector: 'ion-card-content'
            },] },
];
/**
 * @nocollapse
 */
CardContent.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
function CardContent_tsickle_Closure_declarations() {
    /** @type {?} */
    CardContent.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CardContent.ctorParameters;
}
//# sourceMappingURL=card-content.js.map