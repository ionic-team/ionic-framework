import { Directive, ElementRef } from '@angular/core';
import { DomController } from '../../platform/dom-controller';
/**
 * @hidden
 */
var TabHighlight = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _dom
     */
    function TabHighlight(_elementRef, _dom) {
        this._elementRef = _elementRef;
        this._dom = _dom;
    }
    /**
     * @param {?} tab
     * @return {?}
     */
    TabHighlight.prototype.select = function (tab) {
        var _this = this;
        if (!tab) {
            return;
        }
        var /** @type {?} */ dom = this._dom;
        dom.read(function () {
            var /** @type {?} */ btnEle = tab.btn.getNativeElement();
            var /** @type {?} */ transform = "translate3d(" + btnEle.offsetLeft + "px,0,0) scaleX(" + btnEle.offsetWidth + ")";
            dom.write(function () {
                var /** @type {?} */ ele = _this._elementRef.nativeElement;
                ((ele.style))[dom.plt.Css.transform] = transform;
                if (!_this._init) {
                    _this._init = true;
                    dom.write(function () {
                        ele.classList.add('animate');
                    }, 80);
                }
            });
        }, 32);
    };
    return TabHighlight;
}());
export { TabHighlight };
TabHighlight.decorators = [
    { type: Directive, args: [{
                selector: '.tab-highlight'
            },] },
];
/**
 * @nocollapse
 */
TabHighlight.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: DomController, },
]; };
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