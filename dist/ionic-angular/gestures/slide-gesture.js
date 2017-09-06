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
import { PanGesture } from './pan-gesture';
import { clamp } from '../util/util';
import { pointerCoord } from '../util/dom';
/**
 * @hidden
 */
var SlideGesture = (function (_super) {
    __extends(SlideGesture, _super);
    /**
     * @param {?} plt
     * @param {?} element
     * @param {?=} opts
     */
    function SlideGesture(plt, element, opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, plt, element, opts) || this;
        _this.slide = null;
        return _this;
    }
    /**
     * @param {?} _slide
     * @param {?} _ev
     * @return {?}
     */
    SlideGesture.prototype.getSlideBoundaries = function (_slide, _ev) {
        return {
            min: 0,
            max: this.getNativeElement().offsetWidth
        };
    };
    /**
     * @param {?} _slide
     * @param {?} _ev
     * @return {?}
     */
    SlideGesture.prototype.getElementStartPos = function (_slide, _ev) {
        return 0;
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    SlideGesture.prototype.onDragStart = function (ev) {
        this.onSlideBeforeStart(ev);
        var /** @type {?} */ coord = (pointerCoord(ev));
        var /** @type {?} */ pos = coord[this.direction];
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
        var _a = this.getSlideBoundaries(this.slide, ev), min = _a.min, max = _a.max;
        this.slide.min = min;
        this.slide.max = max;
        this.slide.elementStartPos = this.getElementStartPos(this.slide, ev);
        this.onSlideStart(this.slide, ev);
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    SlideGesture.prototype.onDragMove = function (ev) {
        var /** @type {?} */ slide = this.slide;
        (void 0) /* assert */;
        var /** @type {?} */ coord = (pointerCoord(ev));
        var /** @type {?} */ newPos = coord[this.direction];
        var /** @type {?} */ newTimestamp = Date.now();
        var /** @type {?} */ velocity = (this.plt.isRTL ? (slide.pos - newPos) : (newPos - slide.pos)) / (newTimestamp - slide.timestamp);
        slide.pos = newPos;
        slide.timestamp = newTimestamp;
        slide.distance = clamp(slide.min, (this.plt.isRTL ? slide.pointerStartPos - newPos : newPos - slide.pointerStartPos) + slide.elementStartPos, slide.max);
        slide.velocity = velocity;
        slide.delta = (this.plt.isRTL ? slide.pointerStartPos - newPos : newPos - slide.pointerStartPos);
        this.onSlide(slide, ev);
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    SlideGesture.prototype.onDragEnd = function (ev) {
        this.onSlideEnd(this.slide, ev);
        this.slide = null;
    };
    /**
     * @param {?=} _ev
     * @return {?}
     */
    SlideGesture.prototype.onSlideBeforeStart = function (_ev) { };
    /**
     * @param {?=} _slide
     * @param {?=} _ev
     * @return {?}
     */
    SlideGesture.prototype.onSlideStart = function (_slide, _ev) { };
    /**
     * @param {?=} _slide
     * @param {?=} _ev
     * @return {?}
     */
    SlideGesture.prototype.onSlide = function (_slide, _ev) { };
    /**
     * @param {?=} _slide
     * @param {?=} _ev
     * @return {?}
     */
    SlideGesture.prototype.onSlideEnd = function (_slide, _ev) { };
    return SlideGesture;
}(PanGesture));
export { SlideGesture };
function SlideGesture_tsickle_Closure_declarations() {
    /** @type {?} */
    SlideGesture.prototype.slide;
}
//# sourceMappingURL=slide-gesture.js.map