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
var ItemDivider = (function (_super) {
    __extends(ItemDivider, _super);
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    function ItemDivider(config, elementRef, renderer) {
        return _super.call(this, config, elementRef, renderer, 'item-divider') || this;
    }
    return ItemDivider;
}(Ion));
export { ItemDivider };
ItemDivider.decorators = [
    { type: Directive, args: [{
                selector: 'ion-item-divider',
                host: {
                    'class': 'item-divider'
                }
            },] },
];
/**
 * @nocollapse
 */
ItemDivider.ctorParameters = function () { return [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
]; };
function ItemDivider_tsickle_Closure_declarations() {
    /** @type {?} */
    ItemDivider.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ItemDivider.ctorParameters;
}
//# sourceMappingURL=item-divider.js.map