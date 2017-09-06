(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../platform/platform", "../../util/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var platform_1 = require("../../platform/platform");
    var util_1 = require("../../util/util");
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
            this.ionSwipe = new core_1.EventEmitter();
        }
        /**
         * @hidden
         * @return {?}
         */
        ItemOptions.prototype.isRightSide = function () {
            return util_1.isRightSide(this.side, this._plt.isRTL, true);
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
    ItemOptions.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-item-options',
                },] },
    ];
    /**
     * @nocollapse
     */
    ItemOptions.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: platform_1.Platform, },
    ]; };
    ItemOptions.propDecorators = {
        'side': [{ type: core_1.Input },],
        'ionSwipe': [{ type: core_1.Output },],
    };
    exports.ItemOptions = ItemOptions;
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
});
//# sourceMappingURL=item-options.js.map