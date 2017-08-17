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
    var ToggleGesture = (function (_super) {
        __extends(ToggleGesture, _super);
        /**
         * @param {?} plt
         * @param {?} toggle
         * @param {?} gestureCtrl
         * @param {?} domCtrl
         */
        function ToggleGesture(plt, toggle, gestureCtrl, domCtrl) {
            var _this = _super.call(this, plt, toggle.getNativeElement(), {
                threshold: 0,
                zone: false,
                domController: domCtrl,
                gesture: gestureCtrl.createGesture({
                    name: gesture_controller_1.GESTURE_TOGGLE,
                    priority: gesture_controller_1.GESTURE_PRIORITY_TOGGLE
                })
            }) || this;
            _this.toggle = toggle;
            return _this;
        }
        /**
         * @return {?}
         */
        ToggleGesture.prototype.canStart = function () {
            return true;
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        ToggleGesture.prototype.onDragStart = function (ev) {
            ev.preventDefault();
            this.toggle._onDragStart(dom_1.pointerCoord(ev).x);
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        ToggleGesture.prototype.onDragMove = function (ev) {
            ev.preventDefault();
            this.toggle._onDragMove(dom_1.pointerCoord(ev).x);
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        ToggleGesture.prototype.onDragEnd = function (ev) {
            ev.preventDefault();
            this.toggle._onDragEnd(dom_1.pointerCoord(ev).x);
        };
        return ToggleGesture;
    }(pan_gesture_1.PanGesture));
    exports.ToggleGesture = ToggleGesture;
    function ToggleGesture_tsickle_Closure_declarations() {
        /** @type {?} */
        ToggleGesture.prototype.toggle;
    }
});
//# sourceMappingURL=toggle-gesture.js.map