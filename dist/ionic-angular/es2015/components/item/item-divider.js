import { Directive, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * @hidden
 */
export class ItemDivider extends Ion {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'item-divider');
    }
}
ItemDivider.decorators = [
    { type: Directive, args: [{
                selector: 'ion-item-divider',
                host: {
                    'class': 'item-divider'
                }
            },] },
];
/**
 * @nocollapse
 */
ItemDivider.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
function ItemDivider_tsickle_Closure_declarations() {
    /** @type {?} */
    ItemDivider.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ItemDivider.ctorParameters;
}
//# sourceMappingURL=item-divider.js.map