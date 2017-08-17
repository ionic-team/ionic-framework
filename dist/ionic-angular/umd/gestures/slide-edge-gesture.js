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
        define(["require", "exports", "./slide-gesture", "../util/util", "../util/dom"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var slide_gesture_1 = require("./slide-gesture");
    var util_1 = require("../util/util");
    var dom_1 = require("../util/dom");
    /**
     * @hidden
     */
    var SlideEdgeGesture = (function (_super) {
        __extends(SlideEdgeGesture, _super);
        /**
         * @param {?} plt
         * @param {?} element
         * @param {?=} opts
         */
        function SlideEdgeGesture(plt, element, opts) {
            if (opts === void 0) { opts = {}; }
            var _this = this;
            util_1.defaults(opts, {
                edge: 'start',
                maxEdgeStart: 50
            });
            _this = _super.call(this, plt, element, opts) || this;
            // Can check corners through use of eg 'left top'
            _this.setEdges(opts.edge);
            _this.maxEdgeStart = opts.maxEdgeStart;
            return _this;
        }
        /**
         * @param {?} edges
         * @return {?}
         */
        SlideEdgeGesture.prototype.setEdges = function (edges) {
            var /** @type {?} */ isRTL = this.plt.isRTL;
            this.edges = edges.split(' ').map(function (value) {
                switch (value) {
                    case 'start': return isRTL ? 'right' : 'left';
                    case 'end': return isRTL ? 'left' : 'right';
                    default: return value;
                }
            });
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        SlideEdgeGesture.prototype.canStart = function (ev) {
            var _this = this;
            var /** @type {?} */ coord = dom_1.pointerCoord(ev);
            this._d = this.getContainerDimensions();
            return this.edges.every(function (edge) { return _this._checkEdge(edge, coord); });
        };
        /**
         * @return {?}
         */
        SlideEdgeGesture.prototype.getContainerDimensions = function () {
            var /** @type {?} */ plt = this.plt;
            return {
                left: 0,
                top: 0,
                width: plt.width(),
                height: plt.height()
            };
        };
        /**
         * @param {?} edge
         * @param {?} pos
         * @return {?}
         */
        SlideEdgeGesture.prototype._checkEdge = function (edge, pos) {
            var /** @type {?} */ data = this._d;
            var /** @type {?} */ maxEdgeStart = this.maxEdgeStart;
            switch (edge) {
                case 'left': return pos.x <= data.left + maxEdgeStart;
                case 'right': return pos.x >= data.width - maxEdgeStart;
                case 'top': return pos.y <= data.top + maxEdgeStart;
                case 'bottom': return pos.y >= data.height - maxEdgeStart;
            }
            return false;
        };
        return SlideEdgeGesture;
    }(slide_gesture_1.SlideGesture));
    exports.SlideEdgeGesture = SlideEdgeGesture;
    function SlideEdgeGesture_tsickle_Closure_declarations() {
        /** @type {?} */
        SlideEdgeGesture.prototype.edges;
        /** @type {?} */
        SlideEdgeGesture.prototype.maxEdgeStart;
        /** @type {?} */
        SlideEdgeGesture.prototype._d;
    }
});
//# sourceMappingURL=slide-edge-gesture.js.map