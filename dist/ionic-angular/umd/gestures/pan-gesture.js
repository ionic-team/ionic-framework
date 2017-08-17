(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../util/util", "./recognizers", "../util/dom", "./ui-event-manager"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require("../util/util");
    var recognizers_1 = require("./recognizers");
    var dom_1 = require("../util/dom");
    var ui_event_manager_1 = require("./ui-event-manager");
    /**
     * @hidden
     */
    var PanGesture = (function () {
        /**
         * @param {?} plt
         * @param {?} element
         * @param {?=} opts
         */
        function PanGesture(plt, element, opts) {
            if (opts === void 0) { opts = {}; }
            this.plt = plt;
            this.element = element;
            util_1.defaults(opts, {
                threshold: 20,
                maxAngle: 40,
                direction: 'x',
                zone: true,
                capture: false,
                passive: false,
            });
            this.events = new ui_event_manager_1.UIEventManager(plt);
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
                this.detector = new recognizers_1.PanRecognizer(opts.direction, opts.threshold, opts.maxAngle);
            }
        }
        /**
         * @return {?}
         */
        PanGesture.prototype.listen = function () {
            if (!this.isListening) {
                this.pointerEvents = this.events.pointerEvents(this.eventsConfig);
                this.isListening = true;
            }
        };
        /**
         * @return {?}
         */
        PanGesture.prototype.unlisten = function () {
            if (this.isListening) {
                this.gestute && this.gestute.release();
                this.events.unlistenAll();
                this.isListening = false;
            }
        };
        /**
         * @return {?}
         */
        PanGesture.prototype.destroy = function () {
            this.gestute && this.gestute.destroy();
            this.gestute = null;
            this.unlisten();
            this.events.destroy();
            this.events = this.element = this.gestute = null;
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        PanGesture.prototype.pointerDown = function (ev) {
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
            var /** @type {?} */ coord = dom_1.pointerCoord(ev);
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
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        PanGesture.prototype.pointerMove = function (ev) {
            var _this = this;
            (void 0) /* assert */;
            if (this.captured) {
                this.debouncer.write(function () {
                    _this.onDragMove(ev);
                });
                return;
            }
            (void 0) /* assert */;
            var /** @type {?} */ coord = dom_1.pointerCoord(ev);
            if (this.detector.detect(coord)) {
                if (this.detector.pan() !== 0) {
                    if (!this.tryToCapture(ev)) {
                        this.abort(ev);
                    }
                }
            }
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        PanGesture.prototype.pointerUp = function (ev) {
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
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        PanGesture.prototype.tryToCapture = function (ev) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            if (this.gestute && !this.gestute.capture()) {
                return false;
            }
            this.onDragStart(ev);
            this.captured = true;
            return true;
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        PanGesture.prototype.abort = function (ev) {
            this.started = false;
            this.captured = false;
            this.gestute.release();
            this.pointerEvents.stop();
            this.notCaptured(ev);
        };
        /**
         * @return {?}
         */
        PanGesture.prototype.getNativeElement = function () {
            return this.element;
        };
        /**
         * @param {?} _ev
         * @return {?}
         */
        PanGesture.prototype.canStart = function (_ev) { return true; };
        /**
         * @param {?} _ev
         * @return {?}
         */
        PanGesture.prototype.onDragStart = function (_ev) { };
        /**
         * @param {?} _ev
         * @return {?}
         */
        PanGesture.prototype.onDragMove = function (_ev) { };
        /**
         * @param {?} _ev
         * @return {?}
         */
        PanGesture.prototype.onDragEnd = function (_ev) { };
        /**
         * @param {?} _ev
         * @return {?}
         */
        PanGesture.prototype.notCaptured = function (_ev) { };
        return PanGesture;
    }());
    exports.PanGesture = PanGesture;
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
});
//# sourceMappingURL=pan-gesture.js.map