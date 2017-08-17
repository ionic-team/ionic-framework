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
        define(["require", "exports", "../../gestures/gesture-controller", "../../gestures/slide-edge-gesture"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var gesture_controller_1 = require("../../gestures/gesture-controller");
    var slide_edge_gesture_1 = require("../../gestures/slide-edge-gesture");
    /**
     * Gesture attached to the content which the menu is assigned to
     */
    var MenuContentGesture = (function (_super) {
        __extends(MenuContentGesture, _super);
        /**
         * @param {?} plt
         * @param {?} menu
         * @param {?} gestureCtrl
         * @param {?} domCtrl
         */
        function MenuContentGesture(plt, menu, gestureCtrl, domCtrl) {
            var _this = _super.call(this, plt, plt.doc().body, {
                direction: 'x',
                edge: menu.side,
                threshold: 5,
                maxEdgeStart: menu.maxEdgeStart || 50,
                zone: false,
                passive: true,
                domController: domCtrl,
                gesture: gestureCtrl.createGesture({
                    name: gesture_controller_1.GESTURE_MENU_SWIPE,
                    priority: gesture_controller_1.GESTURE_PRIORITY_MENU_SWIPE,
                    disableScroll: true
                })
            }) || this;
            _this.menu = menu;
            return _this;
        }
        /**
         * @param {?} ev
         * @return {?}
         */
        MenuContentGesture.prototype.canStart = function (ev) {
            var /** @type {?} */ menu = this.menu;
            if (!menu.canSwipe()) {
                return false;
            }
            if (menu.isOpen) {
                return true;
            }
            else if (menu.getMenuController().getOpen()) {
                return false;
            }
            return _super.prototype.canStart.call(this, ev);
        };
        /**
         * @return {?}
         */
        MenuContentGesture.prototype.onSlideBeforeStart = function () {
            (void 0) /* console.debug */;
            this.menu._swipeBeforeStart();
        };
        /**
         * @return {?}
         */
        MenuContentGesture.prototype.onSlideStart = function () {
            (void 0) /* console.debug */;
            this.menu._swipeStart();
        };
        /**
         * @param {?} slide
         * @return {?}
         */
        MenuContentGesture.prototype.onSlide = function (slide) {
            var /** @type {?} */ z = (this.menu.isRightSide !== this.plt.isRTL ? slide.min : slide.max);
            var /** @type {?} */ stepValue = (slide.distance / z);
            this.menu._swipeProgress(stepValue);
        };
        /**
         * @param {?} slide
         * @return {?}
         */
        MenuContentGesture.prototype.onSlideEnd = function (slide) {
            var /** @type {?} */ z = (this.menu.isRightSide !== this.plt.isRTL ? slide.min : slide.max);
            var /** @type {?} */ currentStepValue = (slide.distance / z);
            var /** @type {?} */ velocity = slide.velocity;
            z = Math.abs(z * 0.5);
            var /** @type {?} */ shouldCompleteRight = (velocity >= 0)
                && (velocity > 0.2 || slide.delta > z);
            var /** @type {?} */ shouldCompleteLeft = (velocity <= 0)
                && (velocity < -0.2 || slide.delta < -z);
            (void 0) /* console.debug */;
            this.menu._swipeEnd(shouldCompleteLeft, shouldCompleteRight, currentStepValue, velocity);
        };
        /**
         * @param {?} slide
         * @return {?}
         */
        MenuContentGesture.prototype.getElementStartPos = function (slide) {
            var /** @type {?} */ menu = this.menu;
            if (menu.isRightSide !== this.plt.isRTL) {
                return menu.isOpen ? slide.min : slide.max;
            }
            // left menu
            return menu.isOpen ? slide.max : slide.min;
        };
        /**
         * @return {?}
         */
        MenuContentGesture.prototype.getSlideBoundaries = function () {
            var /** @type {?} */ menu = this.menu;
            if (menu.isRightSide !== this.plt.isRTL) {
                return {
                    min: -menu.width(),
                    max: 0
                };
            }
            // left menu
            return {
                min: 0,
                max: menu.width()
            };
        };
        return MenuContentGesture;
    }(slide_edge_gesture_1.SlideEdgeGesture));
    exports.MenuContentGesture = MenuContentGesture;
    function MenuContentGesture_tsickle_Closure_declarations() {
        /** @type {?} */
        MenuContentGesture.prototype.menu;
    }
});
//# sourceMappingURL=menu-gestures.js.map