import { Attribute, Directive, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * @hidden
 */
export class ListHeader extends Ion {
    /**
     * @param {?} config
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _id
     */
    constructor(config, renderer, elementRef, _id) {
        super(config, elementRef, renderer, 'list-header');
        this._id = _id;
    }
    /**
     * @return {?}
     */
    get id() {
        return this._id;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set id(val) {
        this._id = val;
        this.setElementAttribute('id', val);
    }
}
ListHeader.decorators = [
    { type: Directive, args: [{
                selector: 'ion-list-header'
            },] },
];
/**
 * @nocollapse
 */
ListHeader.ctorParameters = () => [
    { type: Config, },
    { type: Renderer, },
    { type: ElementRef, },
    { type: undefined, decorators: [{ type: Attribute, args: ['id',] },] },
];
function ListHeader_tsickle_Closure_declarations() {
    /** @type {?} */
    ListHeader.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ListHeader.ctorParameters;
    /** @type {?} */
    ListHeader.prototype._id;
}
//# sourceMappingURL=list-header.js.map