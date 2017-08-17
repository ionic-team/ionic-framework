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
import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { ItemSlidingGesture } from '../item/item-sliding-gesture';
import { Platform } from '../../platform/platform';
/**
 * The List is a widely used interface element in almost any mobile app,
 * and can include content ranging from basic text all the way to
 * buttons, toggles, icons, and thumbnails.
 *
 * Both the list, which contains items, and the list items themselves
 * can be any HTML element.
 *
 * Using the List and Item components make it easy to support various
 * interaction modes such as swipe to edit, drag to reorder, and
 * removing items.
 *
 * \@demo /docs/demos/src/list/
 * @see {\@link /docs/components#lists List Component Docs}
 * \@advanced
 *
 * Enable the sliding items.
 *
 * ```ts
 * import { Component, ViewChild } from '\@angular/core';
 * import { List } from 'ionic-angular';
 *
 * \@Component({...})
 * export class MyClass {
 *   \@ViewChild(List) list: List;
 *
 *   constructor() { }
 *
 *   stopSliding() {
 *     this.list.enableSlidingItems(false);
 *   }
 * }
 * ```
 *
 */
var List = (function (_super) {
    __extends(List, _super);
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} _plt
     * @param {?} _gestureCtrl
     * @param {?} _domCtrl
     */
    function List(config, elementRef, renderer, _plt, _gestureCtrl, _domCtrl) {
        var _this = _super.call(this, config, elementRef, renderer, 'list') || this;
        _this._plt = _plt;
        _this._gestureCtrl = _gestureCtrl;
        _this._domCtrl = _domCtrl;
        _this._enableSliding = true;
        _this._containsSlidingItems = false;
        return _this;
    }
    Object.defineProperty(List.prototype, "sliding", {
        /**
         * \@input {boolean} If true, the sliding items will be enabled.
         * @return {?}
         */
        get: function () {
            return this._enableSliding;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._enableSliding = isTrueProperty(val);
            this._updateSlidingState();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     * @param {?} contains
     * @return {?}
     */
    List.prototype.containsSlidingItem = function (contains) {
        this._containsSlidingItems = contains;
        this._updateSlidingState();
    };
    /**
     * @return {?}
     */
    List.prototype._updateSlidingState = function () {
        var /** @type {?} */ shouldSlide = this._enableSliding && this._containsSlidingItems;
        if (!shouldSlide) {
            this._slidingGesture && this._slidingGesture.destroy();
            this._slidingGesture = null;
        }
        else if (!this._slidingGesture) {
            (void 0) /* console.debug */;
            this._slidingGesture = new ItemSlidingGesture(this._plt, this, this._gestureCtrl, this._domCtrl);
            this._slidingGesture.listen();
        }
    };
    /**
     * Close any sliding items that are open.
     * @return {?}
     */
    List.prototype.closeSlidingItems = function () {
        this._slidingGesture && this._slidingGesture.closeOpened();
    };
    /**
     * @hidden
     * @return {?}
     */
    List.prototype.destroy = function () {
        this._slidingGesture && this._slidingGesture.destroy();
    };
    return List;
}(Ion));
export { List };
List.decorators = [
    { type: Directive, args: [{
                selector: 'ion-list',
            },] },
];
/**
 * @nocollapse
 */
List.ctorParameters = function () { return [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Platform, },
    { type: GestureController, },
    { type: DomController, },
]; };
List.propDecorators = {
    'sliding': [{ type: Input },],
};
function List_tsickle_Closure_declarations() {
    /** @type {?} */
    List.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    List.ctorParameters;
    /** @type {?} */
    List.propDecorators;
    /** @type {?} */
    List.prototype._enableSliding;
    /** @type {?} */
    List.prototype._containsSlidingItems;
    /** @type {?} */
    List.prototype._slidingGesture;
    /** @type {?} */
    List.prototype._plt;
    /** @type {?} */
    List.prototype._gestureCtrl;
    /** @type {?} */
    List.prototype._domCtrl;
}
//# sourceMappingURL=list.js.map