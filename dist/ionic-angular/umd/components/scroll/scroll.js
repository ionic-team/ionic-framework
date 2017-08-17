(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../util/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var util_1 = require("../../util/util");
    /**
     * \@name Scroll
     * \@description
     * Scroll is a non-flexboxed scroll area that can scroll horizontally or vertically. `ion-Scroll` Can be used in places where you may not need a full page scroller, but a highly customized one, such as image scubber or comment scroller.
     * \@usage
     * ```html
     * <ion-scroll scrollX="true">
     * </ion-scroll>
     *
     * <ion-scroll scrollY="true">
     * </ion-scroll>
     *
     * <ion-scroll scrollX="true" scrollY="true">
     * </ion-scroll>
     * ```
     * \@demo /docs/demos/src/scroll/
     */
    var Scroll = (function () {
        function Scroll() {
            this._scrollX = false;
            this._scrollY = false;
            this._zoom = false;
            this._maxZoom = 1;
            /**
             * @hidden
             */
            this.maxScale = 3;
            /**
             * @hidden
             */
            this.zoomDuration = 250;
        }
        Object.defineProperty(Scroll.prototype, "scrollX", {
            /**
             * \@input {boolean} If true, scrolling along the X axis is enabled.
             * @return {?}
             */
            get: function () {
                return this._scrollX;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._scrollX = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scroll.prototype, "scrollY", {
            /**
             * \@input {boolean} If true, scrolling along the Y axis is enabled; requires the following CSS declaration: ion-scroll { white-space: nowrap; }
             * @return {?}
             */
            get: function () {
                return this._scrollY;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._scrollY = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scroll.prototype, "zoom", {
            /**
             * \@input {boolean} If true, zooming is enabled.
             * @return {?}
             */
            get: function () {
                return this._zoom;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._zoom = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scroll.prototype, "maxZoom", {
            /**
             * \@input {number} Set the max zoom amount.
             * @return {?}
             */
            get: function () {
                return this._maxZoom;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._maxZoom = val;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @hidden
         * Add a scroll event handler to the scroll element if it exists.
         * undefined if the scroll element doesn't exist.
         * @param {?} handler
         * @return {?}
         */
        Scroll.prototype.addScrollEventListener = function (handler) {
            (void 0) /* assert */;
            var /** @type {?} */ ele = this._scrollContent.nativeElement;
            ele.addEventListener('scroll', handler);
            return function () {
                ele.removeEventListener('scroll', handler);
            };
        };
        return Scroll;
    }());
    Scroll.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-scroll',
                    template: '<div class="scroll-content" #scrollContent>' +
                        '<div class="scroll-zoom-wrapper">' +
                        '<ng-content></ng-content>' +
                        '</div>' +
                        '</div>',
                    host: {
                        '[class.scroll-x]': 'scrollX',
                        '[class.scroll-y]': 'scrollY'
                    },
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    Scroll.ctorParameters = function () { return []; };
    Scroll.propDecorators = {
        'scrollX': [{ type: core_1.Input },],
        'scrollY': [{ type: core_1.Input },],
        'zoom': [{ type: core_1.Input },],
        'maxZoom': [{ type: core_1.Input },],
        '_scrollContent': [{ type: core_1.ViewChild, args: ['scrollContent', { read: core_1.ElementRef },] },],
    };
    exports.Scroll = Scroll;
    function Scroll_tsickle_Closure_declarations() {
        /** @type {?} */
        Scroll.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Scroll.ctorParameters;
        /** @type {?} */
        Scroll.propDecorators;
        /** @type {?} */
        Scroll.prototype._scrollX;
        /** @type {?} */
        Scroll.prototype._scrollY;
        /** @type {?} */
        Scroll.prototype._zoom;
        /** @type {?} */
        Scroll.prototype._maxZoom;
        /**
         * @hidden
         * @type {?}
         */
        Scroll.prototype.maxScale;
        /**
         * @hidden
         * @type {?}
         */
        Scroll.prototype.zoomDuration;
        /**
         * \@internal
         * @type {?}
         */
        Scroll.prototype._scrollContent;
    }
});
//# sourceMappingURL=scroll.js.map