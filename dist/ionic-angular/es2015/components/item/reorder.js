import { Component, ElementRef, HostListener } from '@angular/core';
import { findReorderItem } from './item-reorder-util';
/**
 * @hidden
 */
export class Reorder {
    /**
     * @param {?} elementRef
     */
    constructor(elementRef) {
        this.elementRef = elementRef;
        elementRef.nativeElement['$ionComponent'] = this;
    }
    /**
     * @return {?}
     */
    getReorderNode() {
        return findReorderItem(this.elementRef.nativeElement, null);
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    onClick(ev) {
        // Stop propagation if click event reaches ion-reorder
        ev.preventDefault();
        ev.stopPropagation();
    }
}
Reorder.decorators = [
    { type: Component, args: [{
                selector: 'ion-reorder',
                template: `<ion-icon name="reorder"></ion-icon>`
            },] },
];
/**
 * @nocollapse
 */
Reorder.ctorParameters = () => [
    { type: ElementRef, },
];
Reorder.propDecorators = {
    'onClick': [{ type: HostListener, args: ['click', ['$event'],] },],
};
function Reorder_tsickle_Closure_declarations() {
    /** @type {?} */
    Reorder.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Reorder.ctorParameters;
    /** @type {?} */
    Reorder.propDecorators;
    /** @type {?} */
    Reorder.prototype.elementRef;
}
//# sourceMappingURL=reorder.js.map