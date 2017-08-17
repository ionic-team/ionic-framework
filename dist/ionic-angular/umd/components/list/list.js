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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../config/config", "../../platform/dom-controller", "../../gestures/gesture-controller", "../ion", "../../util/util", "../item/item-sliding-gesture", "../../platform/platform"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var dom_controller_1 = require("../../platform/dom-controller");
    var gesture_controller_1 = require("../../gestures/gesture-controller");
    var ion_1 = require("../ion");
    var util_1 = require("../../util/util");
    var item_sliding_gesture_1 = require("../item/item-sliding-gesture");
    var platform_1 = require("../../platform/platform");
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
                this._enableSliding = util_1.isTrueProperty(val);
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
                this._slidingGesture = new item_sliding_gesture_1.ItemSlidingGesture(this._plt, this, this._gestureCtrl, this._domCtrl);
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
    }(ion_1.Ion));
    List.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ion-list',
                },] },
    ];
    /**
     * @nocollapse
     */
    List.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: platform_1.Platform, },
        { type: gesture_controller_1.GestureController, },
        { type: dom_controller_1.DomController, },
    ]; };
    List.propDecorators = {
        'sliding': [{ type: core_1.Input },],
    };
    exports.List = List;
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
});
//# sourceMappingURL=list.js.map