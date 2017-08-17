import { PanGesture } from './pan-gesture';
import { clamp } from '../util/util';
import { pointerCoord } from '../util/dom';
/**
 * @hidden
 */
export class SlideGesture extends PanGesture {
    /**
     * @param {?} plt
     * @param {?} element
     * @param {?=} opts
     */
    constructor(plt, element, opts = {}) {
        super(plt, element, opts);
        this.slide = null;
    }
    /**
     * @param {?} _slide
     * @param {?} _ev
     * @return {?}
     */
    getSlideBoundaries(_slide, _ev) {
        return {
            min: 0,
            max: this.getNativeElement().offsetWidth
        };
    }
    /**
     * @param {?} _slide
     * @param {?} _ev
     * @return {?}
     */
    getElementStartPos(_slide, _ev) {
        return 0;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    onDragStart(ev) {
        this.onSlideBeforeStart(ev);
        let /** @type {?} */ coord = (pointerCoord(ev));
        let /** @type {?} */ pos = coord[this.direction];
        this.slide = {
            min: 0,
            max: 0,
            pointerStartPos: pos,
            pos: pos,
            timestamp: Date.now(),
            elementStartPos: 0,
            started: true,
            delta: 0,
            distance: 0,
            velocity: 0,
        };
        // TODO: we should run this in the next frame
        let { min, max } = this.getSlideBoundaries(this.slide, ev);
        this.slide.min = min;
        this.slide.max = max;
        this.slide.elementStartPos = this.getElementStartPos(this.slide, ev);
        this.onSlideStart(this.slide, ev);
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    onDragMove(ev) {
        let /** @type {?} */ slide = this.slide;
        (void 0) /* assert */;
        let /** @type {?} */ coord = (pointerCoord(ev));
        let /** @type {?} */ newPos = coord[this.direction];
        let /** @type {?} */ newTimestamp = Date.now();
        let /** @type {?} */ velocity = (this.plt.isRTL ? (slide.pos - newPos) : (newPos - slide.pos)) / (newTimestamp - slide.timestamp);
        slide.pos = newPos;
        slide.timestamp = newTimestamp;
        slide.distance = clamp(slide.min, (this.plt.isRTL ? slide.pointerStartPos - newPos : newPos - slide.pointerStartPos) + slide.elementStartPos, slide.max);
        slide.velocity = velocity;
        slide.delta = (this.plt.isRTL ? slide.pointerStartPos - newPos : newPos - slide.pointerStartPos);
        this.onSlide(slide, ev);
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    onDragEnd(ev) {
        this.onSlideEnd(this.slide, ev);
        this.slide = null;
    }
    /**
     * @param {?=} _ev
     * @return {?}
     */
    onSlideBeforeStart(_ev) { }
    /**
     * @param {?=} _slide
     * @param {?=} _ev
     * @return {?}
     */
    onSlideStart(_slide, _ev) { }
    /**
     * @param {?=} _slide
     * @param {?=} _ev
     * @return {?}
     */
    onSlide(_slide, _ev) { }
    /**
     * @param {?=} _slide
     * @param {?=} _ev
     * @return {?}
     */
    onSlideEnd(_slide, _ev) { }
}
function SlideGesture_tsickle_Closure_declarations() {
    /** @type {?} */
    SlideGesture.prototype.slide;
}
//# sourceMappingURL=slide-gesture.js.map