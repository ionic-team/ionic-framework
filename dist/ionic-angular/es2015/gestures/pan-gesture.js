import { defaults } from '../util/util';
import { PanRecognizer } from './recognizers';
import { pointerCoord } from '../util/dom';
import { UIEventManager } from './ui-event-manager';
/**
 * @hidden
 */
export class PanGesture {
    /**
     * @param {?} plt
     * @param {?} element
     * @param {?=} opts
     */
    constructor(plt, element, opts = {}) {
        this.plt = plt;
        this.element = element;
        defaults(opts, {
            threshold: 20,
            maxAngle: 40,
            direction: 'x',
            zone: true,
            capture: false,
            passive: false,
        });
        this.events = new UIEventManager(plt);
        if (opts.domController) {
            this.debouncer = opts.domController.debouncer();
        }
        this.gestute = opts.gesture;
        this.direction = opts.direction;
        this.eventsConfig = {
            element: this.element,
            pointerDown: this.pointerDown.bind(this),
            pointerMove: this.pointerMove.bind(this),
            pointerUp: this.pointerUp.bind(this),
            zone: opts.zone,
            capture: opts.capture,
            passive: opts.passive
        };
        if (opts.threshold > 0) {
            this.detector = new PanRecognizer(opts.direction, opts.threshold, opts.maxAngle);
        }
    }
    /**
     * @return {?}
     */
    listen() {
        if (!this.isListening) {
            this.pointerEvents = this.events.pointerEvents(this.eventsConfig);
            this.isListening = true;
        }
    }
    /**
     * @return {?}
     */
    unlisten() {
        if (this.isListening) {
            this.gestute && this.gestute.release();
            this.events.unlistenAll();
            this.isListening = false;
        }
    }
    /**
     * @return {?}
     */
    destroy() {
        this.gestute && this.gestute.destroy();
        this.gestute = null;
        this.unlisten();
        this.events.destroy();
        this.events = this.element = this.gestute = null;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    pointerDown(ev) {
        if (this.started) {
            return;
        }
        if (!this.canStart(ev)) {
            return false;
        }
        if (this.gestute) {
            // Release fallback
            this.gestute.release();
            // Start gesture
            if (!this.gestute.start()) {
                return false;
            }
        }
        this.started = true;
        this.captured = false;
        const /** @type {?} */ coord = pointerCoord(ev);
        if (this.detector) {
            this.detector.start(coord);
        }
        else {
            if (!this.tryToCapture(ev)) {
                this.started = false;
                this.captured = false;
                this.gestute.release();
                return false;
            }
        }
        return true;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    pointerMove(ev) {
        (void 0) /* assert */;
        if (this.captured) {
            this.debouncer.write(() => {
                this.onDragMove(ev);
            });
            return;
        }
        (void 0) /* assert */;
        const /** @type {?} */ coord = pointerCoord(ev);
        if (this.detector.detect(coord)) {
            if (this.detector.pan() !== 0) {
                if (!this.tryToCapture(ev)) {
                    this.abort(ev);
                }
            }
        }
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    pointerUp(ev) {
        (void 0) /* assert */;
        this.debouncer.cancel();
        this.gestute && this.gestute.release();
        if (this.captured) {
            this.onDragEnd(ev);
        }
        else {
            this.notCaptured(ev);
        }
        this.captured = false;
        this.started = false;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    tryToCapture(ev) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        if (this.gestute && !this.gestute.capture()) {
            return false;
        }
        this.onDragStart(ev);
        this.captured = true;
        return true;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    abort(ev) {
        this.started = false;
        this.captured = false;
        this.gestute.release();
        this.pointerEvents.stop();
        this.notCaptured(ev);
    }
    /**
     * @return {?}
     */
    getNativeElement() {
        return this.element;
    }
    /**
     * @param {?} _ev
     * @return {?}
     */
    canStart(_ev) { return true; }
    /**
     * @param {?} _ev
     * @return {?}
     */
    onDragStart(_ev) { }
    /**
     * @param {?} _ev
     * @return {?}
     */
    onDragMove(_ev) { }
    /**
     * @param {?} _ev
     * @return {?}
     */
    onDragEnd(_ev) { }
    /**
     * @param {?} _ev
     * @return {?}
     */
    notCaptured(_ev) { }
}
function PanGesture_tsickle_Closure_declarations() {
    /** @type {?} */
    PanGesture.prototype.debouncer;
    /** @type {?} */
    PanGesture.prototype.events;
    /** @type {?} */
    PanGesture.prototype.pointerEvents;
    /** @type {?} */
    PanGesture.prototype.detector;
    /** @type {?} */
    PanGesture.prototype.started;
    /** @type {?} */
    PanGesture.prototype.captured;
    /** @type {?} */
    PanGesture.prototype.isListening;
    /** @type {?} */
    PanGesture.prototype.gestute;
    /** @type {?} */
    PanGesture.prototype.direction;
    /** @type {?} */
    PanGesture.prototype.eventsConfig;
    /** @type {?} */
    PanGesture.prototype.plt;
    /** @type {?} */
    PanGesture.prototype.element;
}
//# sourceMappingURL=pan-gesture.js.map