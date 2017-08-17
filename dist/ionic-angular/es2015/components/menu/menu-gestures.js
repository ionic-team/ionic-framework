import { GESTURE_MENU_SWIPE, GESTURE_PRIORITY_MENU_SWIPE } from '../../gestures/gesture-controller';
import { SlideEdgeGesture } from '../../gestures/slide-edge-gesture';
/**
 * Gesture attached to the content which the menu is assigned to
 */
export class MenuContentGesture extends SlideEdgeGesture {
    /**
     * @param {?} plt
     * @param {?} menu
     * @param {?} gestureCtrl
     * @param {?} domCtrl
     */
    constructor(plt, menu, gestureCtrl, domCtrl) {
        super(plt, plt.doc().body, {
            direction: 'x',
            edge: menu.side,
            threshold: 5,
            maxEdgeStart: menu.maxEdgeStart || 50,
            zone: false,
            passive: true,
            domController: domCtrl,
            gesture: gestureCtrl.createGesture({
                name: GESTURE_MENU_SWIPE,
                priority: GESTURE_PRIORITY_MENU_SWIPE,
                disableScroll: true
            })
        });
        this.menu = menu;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    canStart(ev) {
        const /** @type {?} */ menu = this.menu;
        if (!menu.canSwipe()) {
            return false;
        }
        if (menu.isOpen) {
            return true;
        }
        else if (menu.getMenuController().getOpen()) {
            return false;
        }
        return super.canStart(ev);
    }
    /**
     * @return {?}
     */
    onSlideBeforeStart() {
        (void 0) /* console.debug */;
        this.menu._swipeBeforeStart();
    }
    /**
     * @return {?}
     */
    onSlideStart() {
        (void 0) /* console.debug */;
        this.menu._swipeStart();
    }
    /**
     * @param {?} slide
     * @return {?}
     */
    onSlide(slide) {
        const /** @type {?} */ z = (this.menu.isRightSide !== this.plt.isRTL ? slide.min : slide.max);
        const /** @type {?} */ stepValue = (slide.distance / z);
        this.menu._swipeProgress(stepValue);
    }
    /**
     * @param {?} slide
     * @return {?}
     */
    onSlideEnd(slide) {
        let /** @type {?} */ z = (this.menu.isRightSide !== this.plt.isRTL ? slide.min : slide.max);
        const /** @type {?} */ currentStepValue = (slide.distance / z);
        const /** @type {?} */ velocity = slide.velocity;
        z = Math.abs(z * 0.5);
        const /** @type {?} */ shouldCompleteRight = (velocity >= 0)
            && (velocity > 0.2 || slide.delta > z);
        const /** @type {?} */ shouldCompleteLeft = (velocity <= 0)
            && (velocity < -0.2 || slide.delta < -z);
        (void 0) /* console.debug */;
        this.menu._swipeEnd(shouldCompleteLeft, shouldCompleteRight, currentStepValue, velocity);
    }
    /**
     * @param {?} slide
     * @return {?}
     */
    getElementStartPos(slide) {
        const /** @type {?} */ menu = this.menu;
        if (menu.isRightSide !== this.plt.isRTL) {
            return menu.isOpen ? slide.min : slide.max;
        }
        // left menu
        return menu.isOpen ? slide.max : slide.min;
    }
    /**
     * @return {?}
     */
    getSlideBoundaries() {
        const /** @type {?} */ menu = this.menu;
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
    }
}
function MenuContentGesture_tsickle_Closure_declarations() {
    /** @type {?} */
    MenuContentGesture.prototype.menu;
}
//# sourceMappingURL=menu-gestures.js.map