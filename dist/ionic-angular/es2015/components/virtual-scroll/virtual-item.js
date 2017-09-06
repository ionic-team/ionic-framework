import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
/**
 * @hidden
 */
export class VirtualItem {
    /**
     * @param {?} templateRef
     * @param {?} viewContainer
     */
    constructor(templateRef, viewContainer) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
    }
}
VirtualItem.decorators = [
    { type: Directive, args: [{ selector: '[virtualItem]' },] },
];
/**
 * @nocollapse
 */
VirtualItem.ctorParameters = () => [
    { type: TemplateRef, },
    { type: ViewContainerRef, },
];
function VirtualItem_tsickle_Closure_declarations() {
    /** @type {?} */
    VirtualItem.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    VirtualItem.ctorParameters;
    /** @type {?} */
    VirtualItem.prototype.templateRef;
    /** @type {?} */
    VirtualItem.prototype.viewContainer;
}
//# sourceMappingURL=virtual-item.js.map