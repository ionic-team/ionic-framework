var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Directive, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * @hidden
 */
var CardContent = (function (_super) {
    __extends(CardContent, _super);
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    function CardContent(config, elementRef, renderer) {
        return _super.call(this, config, elementRef, renderer, 'card-content') || this;
    }
    return CardContent;
}(Ion));
export { CardContent };
CardContent.decorators = [
    { type: Directive, args: [{
                selector: 'ion-card-content'
            },] },
];
/**
 * @nocollapse
 */
CardContent.ctorParameters = function () { return [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
]; };
function CardContent_tsickle_Closure_declarations() {
    /** @type {?} */
    CardContent.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CardContent.ctorParameters;
}
//# sourceMappingURL=card-content.js.map