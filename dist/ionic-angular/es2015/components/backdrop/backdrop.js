import { Directive, ElementRef, Renderer } from '@angular/core';
/**
 * @hidden
 */
export class Backdrop {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     */
    constructor(_elementRef, _renderer) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
    }
    /**
     * @return {?}
     */
    getNativeElement() {
        return this._elementRef.nativeElement;
    }
    /**
     * @param {?} className
     * @param {?} add
     * @return {?}
     */
    setElementClass(className, add) {
        this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
    }
}
Backdrop.decorators = [
    { type: Directive, args: [{
                selector: 'ion-backdrop',
                host: {
                    'role': 'presentation',
                    'tappable': '',
                    'disable-activated': ''
                },
            },] },
];
/**
 * @nocollapse
 */
Backdrop.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer, },
];
function Backdrop_tsickle_Closure_declarations() {
    /** @type {?} */
    Backdrop.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Backdrop.ctorParameters;
    /** @type {?} */
    Backdrop.prototype._elementRef;
    /** @type {?} */
    Backdrop.prototype._renderer;
}
//# sourceMappingURL=backdrop.js.map