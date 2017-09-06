import { Directive, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * @hidden
 */
export class CardHeader extends Ion {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'card-header');
    }
}
CardHeader.decorators = [
    { type: Directive, args: [{
                selector: 'ion-card-header'
            },] },
];
/**
 * @nocollapse
 */
CardHeader.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
function CardHeader_tsickle_Closure_declarations() {
    /** @type {?} */
    CardHeader.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CardHeader.ctorParameters;
}
//# sourceMappingURL=card-header.js.map