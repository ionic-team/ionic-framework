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
import { GESTURE_PRIORITY_TOGGLE, GESTURE_TOGGLE } from '../../gestures/gesture-controller';
import { PanGesture } from '../../gestures/pan-gesture';
import { pointerCoord } from '../../util/dom';
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
                name: GESTURE_TOGGLE,
                priority: GESTURE_PRIORITY_TOGGLE
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
        this.toggle._onDragStart(pointerCoord(ev).x);
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    ToggleGesture.prototype.onDragMove = function (ev) {
        ev.preventDefault();
        this.toggle._onDragMove(pointerCoord(ev).x);
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    ToggleGesture.prototype.onDragEnd = function (ev) {
        ev.preventDefault();
        this.toggle._onDragEnd(pointerCoord(ev).x);
    };
    return ToggleGesture;
}(PanGesture));
export { ToggleGesture };
function ToggleGesture_tsickle_Closure_declarations() {
    /** @type {?} */
    ToggleGesture.prototype.toggle;
}
//# sourceMappingURL=toggle-gesture.js.map