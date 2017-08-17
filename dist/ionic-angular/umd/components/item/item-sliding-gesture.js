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
        define(["require", "exports", "../../gestures/gesture-controller", "../../gestures/pan-gesture", "../../util/dom"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var gesture_controller_1 = require("../../gestures/gesture-controller");
    var pan_gesture_1 = require("../../gestures/pan-gesture");
    var dom_1 = require("../../util/dom");
    /**
     * @hidden
     */
    var ItemSlidingGesture = (function (_super) {
        __extends(ItemSlidingGesture, _super);
        /**
         * @param {?} plt
         * @param {?} list
         * @param {?} gestureCtrl
         * @param {?} domCtrl
         */
        function ItemSlidingGesture(plt, list, gestureCtrl, domCtrl) {
            var _this = _super.call(this, plt, list.getNativeElement(), {
                maxAngle: 20,
                threshold: 5,
                zone: false,
                domController: domCtrl,
                gesture: gestureCtrl.createGesture({
                    name: gesture_controller_1.GESTURE_ITEM_SWIPE,
                    priority: gesture_controller_1.GESTURE_PRIORITY_SLIDING_ITEM,
                    disableScroll: true
                })
            }) || this;
            _this.list = list;
            _this.preSelectedContainer = null;
            _this.selectedContainer = null;
            _this.openContainer = null;
            return _this;
        }
        /**
         * @param {?} ev
         * @return {?}
         */
        ItemSlidingGesture.prototype.canStart = function (ev) {
            if (this.selectedContainer) {
                return false;
            }
            // Get swiped sliding container
            var /** @type {?} */ container = getContainer(ev);
            if (!container) {
                this.closeOpened();
                return false;
            }
            // Close open container if it is not the selected one.
            if (container !== this.openContainer) {
                this.closeOpened();
            }
            var /** @type {?} */ coord = dom_1.pointerCoord(ev);
            this.preSelectedContainer = container;
            this.firstCoordX = coord.x;
            this.firstTimestamp = Date.now();
            return true;
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        ItemSlidingGesture.prototype.onDragStart = function (ev) {
            ev.preventDefault();
            var /** @type {?} */ coord = dom_1.pointerCoord(ev);
            this.selectedContainer = this.openContainer = this.preSelectedContainer;
            this.selectedContainer.startSliding(coord.x);
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        ItemSlidingGesture.prototype.onDragMove = function (ev) {
            ev.preventDefault();
            this.selectedContainer.moveSliding(dom_1.pointerCoord(ev).x);
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        ItemSlidingGesture.prototype.onDragEnd = function (ev) {
            ev.preventDefault();
            var /** @type {?} */ coordX = dom_1.pointerCoord(ev).x;
            var /** @type {?} */ deltaX = (coordX - this.firstCoordX);
            var /** @type {?} */ deltaT = (Date.now() - this.firstTimestamp);
            this.selectedContainer.endSliding(deltaX / deltaT);
            this.selectedContainer = null;
            this.preSelectedContainer = null;
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        ItemSlidingGesture.prototype.notCaptured = function (ev) {
            if (!clickedOptionButton(ev)) {
                this.closeOpened();
            }
        };
        /**
         * @return {?}
         */
        ItemSlidingGesture.prototype.closeOpened = function () {
            this.selectedContainer = null;
            if (this.openContainer) {
                this.openContainer.close();
                this.openContainer = null;
                return true;
            }
            return false;
        };
        /**
         * @return {?}
         */
        ItemSlidingGesture.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this.closeOpened();
            this.list = null;
            this.preSelectedContainer = null;
            this.selectedContainer = null;
            this.openContainer = null;
        };
        return ItemSlidingGesture;
    }(pan_gesture_1.PanGesture));
    exports.ItemSlidingGesture = ItemSlidingGesture;
    function ItemSlidingGesture_tsickle_Closure_declarations() {
        /** @type {?} */
        ItemSlidingGesture.prototype.preSelectedContainer;
        /** @type {?} */
        ItemSlidingGesture.prototype.selectedContainer;
        /** @type {?} */
        ItemSlidingGesture.prototype.openContainer;
        /** @type {?} */
        ItemSlidingGesture.prototype.firstCoordX;
        /** @type {?} */
        ItemSlidingGesture.prototype.firstTimestamp;
        /** @type {?} */
        ItemSlidingGesture.prototype.list;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    function getContainer(ev) {
        var /** @type {?} */ ele = ev.target.closest('ion-item-sliding');
        if (ele) {
            return ((ele))['$ionComponent'];
        }
        return null;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    function clickedOptionButton(ev) {
        var /** @type {?} */ ele = ev.target.closest('ion-item-options>button');
        return !!ele;
    }
});
//# sourceMappingURL=item-sliding-gesture.js.map