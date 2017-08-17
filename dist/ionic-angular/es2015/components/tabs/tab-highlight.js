import { Directive, ElementRef } from '@angular/core';
import { DomController } from '../../platform/dom-controller';
/**
 * @hidden
 */
export class TabHighlight {
    /**
     * @param {?} _elementRef
     * @param {?} _dom
     */
    constructor(_elementRef, _dom) {
        this._elementRef = _elementRef;
        this._dom = _dom;
    }
    /**
     * @param {?} tab
     * @return {?}
     */
    select(tab) {
        if (!tab) {
            return;
        }
        const /** @type {?} */ dom = this._dom;
        dom.read(() => {
            const /** @type {?} */ btnEle = tab.btn.getNativeElement();
            const /** @type {?} */ transform = `translate3d(${btnEle.offsetLeft}px,0,0) scaleX(${btnEle.offsetWidth})`;
            dom.write(() => {
                const /** @type {?} */ ele = this._elementRef.nativeElement;
                ((ele.style))[dom.plt.Css.transform] = transform;
                if (!this._init) {
                    this._init = true;
                    dom.write(() => {
                        ele.classList.add('animate');
                    }, 80);
                }
            });
        }, 32);
    }
}
TabHighlight.decorators = [
    { type: Directive, args: [{
                selector: '.tab-highlight'
            },] },
];
/**
 * @nocollapse
 */
TabHighlight.ctorParameters = () => [
    { type: ElementRef, },
    { type: DomController, },
];
function TabHighlight_tsickle_Closure_declarations() {
    /** @type {?} */
    TabHighlight.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    TabHighlight.ctorParameters;
    /** @type {?} */
    TabHighlight.prototype._init;
    /** @type {?} */
    TabHighlight.prototype._elementRef;
    /** @type {?} */
    TabHighlight.prototype._dom;
}
//# sourceMappingURL=tab-highlight.js.map