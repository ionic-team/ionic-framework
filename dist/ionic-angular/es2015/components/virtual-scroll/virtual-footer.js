import { Directive, TemplateRef } from '@angular/core';
/**
 * @hidden
 */
export class VirtualFooter {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
VirtualFooter.decorators = [
    { type: Directive, args: [{ selector: '[virtualFooter]' },] },
];
/**
 * @nocollapse
 */
VirtualFooter.ctorParameters = () => [
    { type: TemplateRef, },
];
function VirtualFooter_tsickle_Closure_declarations() {
    /** @type {?} */
    VirtualFooter.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    VirtualFooter.ctorParameters;
    /** @type {?} */
    VirtualFooter.prototype.templateRef;
}
//# sourceMappingURL=virtual-footer.js.map