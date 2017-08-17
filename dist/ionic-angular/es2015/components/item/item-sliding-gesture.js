import { GESTURE_ITEM_SWIPE, GESTURE_PRIORITY_SLIDING_ITEM } from '../../gestures/gesture-controller';
import { PanGesture } from '../../gestures/pan-gesture';
import { pointerCoord } from '../../util/dom';
/**
 * @hidden
 */
export class ItemSlidingGesture extends PanGesture {
    /**
     * @param {?} plt
     * @param {?} list
     * @param {?} gestureCtrl
     * @param {?} domCtrl
     */
    constructor(plt, list, gestureCtrl, domCtrl) {
        super(plt, list.getNativeElement(), {
            maxAngle: 20,
            threshold: 5,
            zone: false,
            domController: domCtrl,
            gesture: gestureCtrl.createGesture({
                name: GESTURE_ITEM_SWIPE,
                priority: GESTURE_PRIORITY_SLIDING_ITEM,
                disableScroll: true
            })
        });
        this.list = list;
        this.preSelectedContainer = null;
        this.selectedContainer = null;
        this.openContainer = null;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    canStart(ev) {
        if (this.selectedContainer) {
            return false;
        }
        // Get swiped sliding container
        let /** @type {?} */ container = getContainer(ev);
        if (!container) {
            this.closeOpened();
            return false;
        }
        // Close open container if it is not the selected one.
        if (container !== this.openContainer) {
            this.closeOpened();
        }
        let /** @type {?} */ coord = pointerCoord(ev);
        this.preSelectedContainer = container;
        this.firstCoordX = coord.x;
        this.firstTimestamp = Date.now();
        return true;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    onDragStart(ev) {
        ev.preventDefault();
        let /** @type {?} */ coord = pointerCoord(ev);
        this.selectedContainer = this.openContainer = this.preSelectedContainer;
        this.selectedContainer.startSliding(coord.x);
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    onDragMove(ev) {
        ev.preventDefault();
        this.selectedContainer.moveSliding(pointerCoord(ev).x);
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    onDragEnd(ev) {
        ev.preventDefault();
        let /** @type {?} */ coordX = pointerCoord(ev).x;
        let /** @type {?} */ deltaX = (coordX - this.firstCoordX);
        let /** @type {?} */ deltaT = (Date.now() - this.firstTimestamp);
        this.selectedContainer.endSliding(deltaX / deltaT);
        this.selectedContainer = null;
        this.preSelectedContainer = null;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    notCaptured(ev) {
        if (!clickedOptionButton(ev)) {
            this.closeOpened();
        }
    }
    /**
     * @return {?}
     */
    closeOpened() {
        this.selectedContainer = null;
        if (this.openContainer) {
            this.openContainer.close();
            this.openContainer = null;
            return true;
        }
        return false;
    }
    /**
     * @return {?}
     */
    destroy() {
        super.destroy();
        this.closeOpened();
        this.list = null;
        this.preSelectedContainer = null;
        this.selectedContainer = null;
        this.openContainer = null;
    }
}
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
    let /** @type {?} */ ele = ev.target.closest('ion-item-sliding');
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
    let /** @type {?} */ ele = ev.target.closest('ion-item-options>button');
    return !!ele;
}
//# sourceMappingURL=item-sliding-gesture.js.map