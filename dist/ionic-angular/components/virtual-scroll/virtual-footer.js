import { Directive, TemplateRef } from '@angular/core';
/**
 * @hidden
 */
var VirtualFooter = (function () {
    /**
     * @param {?} templateRef
     */
    function VirtualFooter(templateRef) {
        this.templateRef = templateRef;
    }
    return VirtualFooter;
}());
export { VirtualFooter };
VirtualFooter.decorators = [
    { type: Directive, args: [{ selector: '[virtualFooter]' },] },
];
/**
 * @nocollapse
 */
VirtualFooter.ctorParameters = function () { return [
    { type: TemplateRef, },
]; };
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