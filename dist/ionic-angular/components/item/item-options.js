import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Platform } from '../../platform/platform';
import { isRightSide } from '../../util/util';
/**
 * \@name ItemOptions
 * \@description
 * The option buttons for an `ion-item-sliding`. These buttons can be placed either on the left or right side.
 * You can combine the `(ionSwipe)` event plus the `expandable` directive to create a full swipe action for the item.
 *
 * \@usage
 *
 * ```html
 * <ion-item-sliding>
 *   <ion-item>
 *     Item 1
 *   </ion-item>
 *   <ion-item-options side="right" (ionSwipe)="saveItem(item)">
 *     <button ion-button expandable (click)="saveItem(item)">
 *       <ion-icon name="star"></ion-icon>
 *     </button>
 *   </ion-item-options>
 * </ion-item-sliding>
 * ```
 */
var ItemOptions = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _plt
     */
    function ItemOptions(_elementRef, _plt) {
        this._elementRef = _elementRef;
        this._plt = _plt;
        /**
         * \@output {event} Emitted when the item has been fully swiped.
         */
        this.ionSwipe = new EventEmitter();
    }
    /**
     * @hidden
     * @return {?}
     */
    ItemOptions.prototype.isRightSide = function () {
        return isRightSide(this.side, this._plt.isRTL, true);
    };
    /**
     * @hidden
     * @return {?}
     */
    ItemOptions.prototype.width = function () {
        return this._elementRef.nativeElement.offsetWidth;
    };
    return ItemOptions;
}());
export { ItemOptions };
ItemOptions.decorators = [
    { type: Directive, args: [{
                selector: 'ion-item-options',
            },] },
];
/**
 * @nocollapse
 */
ItemOptions.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Platform, },
]; };
ItemOptions.propDecorators = {
    'side': [{ type: Input },],
    'ionSwipe': [{ type: Output },],
};
function ItemOptions_tsickle_Closure_declarations() {
    /** @type {?} */
    ItemOptions.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ItemOptions.ctorParameters;
    /** @type {?} */
    ItemOptions.propDecorators;
    /**
     * \@input {string} The side the option button should be on. Defaults to `"right"`.
     * If you have multiple `ion-item-options`, a side must be provided for each.
     * @type {?}
     */
    ItemOptions.prototype.side;
    /**
     * \@output {event} Emitted when the item has been fully swiped.
     * @type {?}
     */
    ItemOptions.prototype.ionSwipe;
    /** @type {?} */
    ItemOptions.prototype._elementRef;
    /** @type {?} */
    ItemOptions.prototype._plt;
}
//# sourceMappingURL=item-options.js.map