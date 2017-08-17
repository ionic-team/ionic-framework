import { GESTURE_PRIORITY_TOGGLE, GESTURE_TOGGLE } from '../../gestures/gesture-controller';
import { PanGesture } from '../../gestures/pan-gesture';
import { pointerCoord } from '../../util/dom';
/**
 * @hidden
 */
export class ToggleGesture extends PanGesture {
    /**
     * @param {?} plt
     * @param {?} toggle
     * @param {?} gestureCtrl
     * @param {?} domCtrl
     */
    constructor(plt, toggle, gestureCtrl, domCtrl) {
        super(plt, toggle.getNativeElement(), {
            threshold: 0,
            zone: false,
            domController: domCtrl,
            gesture: gestureCtrl.createGesture({
                name: GESTURE_TOGGLE,
                priority: GESTURE_PRIORITY_TOGGLE
            })
        });
        this.toggle = toggle;
    }
    /**
     * @return {?}
     */
    canStart() {
        return true;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    onDragStart(ev) {
        ev.preventDefault();
        this.toggle._onDragStart(pointerCoord(ev).x);
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    onDragMove(ev) {
        ev.preventDefault();
        this.toggle._onDragMove(pointerCoord(ev).x);
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    onDragEnd(ev) {
        ev.preventDefault();
        this.toggle._onDragEnd(pointerCoord(ev).x);
    }
}
function ToggleGesture_tsickle_Closure_declarations() {
    /** @type {?} */
    ToggleGesture.prototype.toggle;
}
//# sourceMappingURL=toggle-gesture.js.map