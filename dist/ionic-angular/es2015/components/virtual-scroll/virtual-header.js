import { Directive, TemplateRef } from '@angular/core';
/**
 * @hidden
 */
export class VirtualHeader {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
VirtualHeader.decorators = [
    { type: Directive, args: [{ selector: '[virtualHeader]' },] },
];
/**
 * @nocollapse
 */
VirtualHeader.ctorParameters = () => [
    { type: TemplateRef, },
];
function VirtualHeader_tsickle_Closure_declarations() {
    /** @type {?} */
    VirtualHeader.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    VirtualHeader.ctorParameters;
    /** @type {?} */
    VirtualHeader.prototype.templateRef;
}
//# sourceMappingURL=virtual-header.js.map