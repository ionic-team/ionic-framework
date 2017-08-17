import { Directive, ElementRef, Renderer } from '@angular/core';
/**
 * @hidden
 */
var Backdrop = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     */
    function Backdrop(_elementRef, _renderer) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
    }
    /**
     * @return {?}
     */
    Backdrop.prototype.getNativeElement = function () {
        return this._elementRef.nativeElement;
    };
    /**
     * @param {?} className
     * @param {?} add
     * @return {?}
     */
    Backdrop.prototype.setElementClass = function (className, add) {
        this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
    };
    return Backdrop;
}());
export { Backdrop };
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
Backdrop.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer, },
]; };
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