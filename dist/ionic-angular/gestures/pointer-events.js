/**
 * @hidden
 */
var PointerEvents = (function () {
    /**
     * @param {?} plt
     * @param {?} ele
     * @param {?} pointerDown
     * @param {?} pointerMove
     * @param {?} pointerUp
     * @param {?} option
     */
    function PointerEvents(plt, ele, pointerDown, pointerMove, pointerUp, option) {
        this.plt = plt;
        this.ele = ele;
        this.pointerDown = pointerDown;
        this.pointerMove = pointerMove;
        this.pointerUp = pointerUp;
        this.option = option;
        this.rmTouchStart = null;
        this.rmTouchMove = null;
        this.rmTouchEnd = null;
        this.rmTouchCancel = null;
        this.rmMouseStart = null;
        this.rmMouseMove = null;
        this.rmMouseUp = null;
        this.lastTouchEvent = 0;
        this.mouseWait = 2 * 1000;
        (void 0) /* assert */;
        (void 0) /* assert */;
        this.bindTouchEnd = this.handleTouchEnd.bind(this);
        this.bindMouseUp = this.handleMouseUp.bind(this);
        this.rmTouchStart = this.plt.registerListener(ele, 'touchstart', this.handleTouchStart.bind(this), option);
        this.rmMouseStart = this.plt.registerListener(ele, 'mousedown', this.handleMouseDown.bind(this), option);
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    PointerEvents.prototype.handleTouchStart = function (ev) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        this.lastTouchEvent = Date.now() + this.mouseWait;
        this.lastEventType = POINTER_EVENT_TYPE_TOUCH;
        if (!this.pointerDown(ev, POINTER_EVENT_TYPE_TOUCH)) {
            return;
        }
        if (!this.rmTouchMove && this.pointerMove) {
            this.rmTouchMove = this.plt.registerListener(this.ele, 'touchmove', this.pointerMove, this.option);
        }
        if (!this.rmTouchEnd) {
            this.rmTouchEnd = this.plt.registerListener(this.ele, 'touchend', this.bindTouchEnd, this.option);
        }
        if (!this.rmTouchCancel) {
            this.rmTouchCancel = this.plt.registerListener(this.ele, 'touchcancel', this.bindTouchEnd, this.option);
        }
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    PointerEvents.prototype.handleMouseDown = function (ev) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        if (this.lastTouchEvent > Date.now()) {
            (void 0) /* console.debug */;
            return;
        }
        this.lastEventType = POINTER_EVENT_TYPE_MOUSE;
        if (!this.pointerDown(ev, POINTER_EVENT_TYPE_MOUSE)) {
            return;
        }
        if (!this.rmMouseMove && this.pointerMove) {
            this.rmMouseMove = this.plt.registerListener(this.plt.doc(), 'mousemove', this.pointerMove, this.option);
        }
        if (!this.rmMouseUp) {
            this.rmMouseUp = this.plt.registerListener(this.plt.doc(), 'mouseup', this.bindMouseUp, this.option);
        }
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    PointerEvents.prototype.handleTouchEnd = function (ev) {
        this.stopTouch();
        this.pointerUp && this.pointerUp(ev, POINTER_EVENT_TYPE_TOUCH);
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    PointerEvents.prototype.handleMouseUp = function (ev) {
        this.stopMouse();
        this.pointerUp && this.pointerUp(ev, POINTER_EVENT_TYPE_MOUSE);
    };
    /**
     * @return {?}
     */
    PointerEvents.prototype.stopTouch = function () {
        this.rmTouchMove && this.rmTouchMove();
        this.rmTouchEnd && this.rmTouchEnd();
        this.rmTouchCancel && this.rmTouchCancel();
        this.rmTouchMove = this.rmTouchEnd = this.rmTouchCancel = null;
    };
    /**
     * @return {?}
     */
    PointerEvents.prototype.stopMouse = function () {
        this.rmMouseMove && this.rmMouseMove();
        this.rmMouseUp && this.rmMouseUp();
        this.rmMouseMove = this.rmMouseUp = null;
    };
    /**
     * @return {?}
     */
    PointerEvents.prototype.stop = function () {
        this.stopTouch();
        this.stopMouse();
    };
    /**
     * @return {?}
     */
    PointerEvents.prototype.destroy = function () {
        this.rmTouchStart && this.rmTouchStart();
        this.rmMouseStart && this.rmMouseStart();
        this.stop();
        this.ele = this.pointerUp = this.pointerMove = this.pointerDown = this.rmTouchStart = this.rmMouseStart = null;
    };
    return PointerEvents;
}());
export { PointerEvents };
function PointerEvents_tsickle_Closure_declarations() {
    /** @type {?} */
    PointerEvents.prototype.rmTouchStart;
    /** @type {?} */
    PointerEvents.prototype.rmTouchMove;
    /** @type {?} */
    PointerEvents.prototype.rmTouchEnd;
    /** @type {?} */
    PointerEvents.prototype.rmTouchCancel;
    /** @type {?} */
    PointerEvents.prototype.rmMouseStart;
    /** @type {?} */
    PointerEvents.prototype.rmMouseMove;
    /** @type {?} */
    PointerEvents.prototype.rmMouseUp;
    /** @type {?} */
    PointerEvents.prototype.bindTouchEnd;
    /** @type {?} */
    PointerEvents.prototype.bindMouseUp;
    /** @type {?} */
    PointerEvents.prototype.lastTouchEvent;
    /** @type {?} */
    PointerEvents.prototype.mouseWait;
    /** @type {?} */
    PointerEvents.prototype.lastEventType;
    /** @type {?} */
    PointerEvents.prototype.plt;
    /** @type {?} */
    PointerEvents.prototype.ele;
    /** @type {?} */
    PointerEvents.prototype.pointerDown;
    /** @type {?} */
    PointerEvents.prototype.pointerMove;
    /** @type {?} */
    PointerEvents.prototype.pointerUp;
    /** @type {?} */
    PointerEvents.prototype.option;
}
export var /** @type {?} */ POINTER_EVENT_TYPE_MOUSE = 1;
export var /** @type {?} */ POINTER_EVENT_TYPE_TOUCH = 2;
//# sourceMappingURL=pointer-events.js.map