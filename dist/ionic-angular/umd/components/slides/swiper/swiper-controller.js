(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./swiper", "./swiper-index", "./swiper-utils", "./swiper-progress"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var swiper_1 = require("./swiper");
    var swiper_index_1 = require("./swiper-index");
    var swiper_utils_1 = require("./swiper-utils");
    var swiper_progress_1 = require("./swiper-progress");
    /*=========================
      Controller
      ===========================*/
    exports.SWIPER_CONTROLLER = {
        LinearSpline: function (_s, _platform, x, y) {
            this.x = x;
            this.y = y;
            this.lastIndex = x.length - 1;
            // Given an x value (x2), return the expected y2 value:
            // (x1,y1) is the known point before given value,
            // (x3,y3) is the known point after given value.
            var /** @type {?} */ i1, /** @type {?} */ i3;
            this.interpolate = function (x2) {
                if (!x2)
                    return 0;
                // Get the indexes of x1 and x3 (the array indexes before and after given x2):
                i3 = binarySearch(this.x, x2);
                i1 = i3 - 1;
                // We have our indexes i1 & i3, so we can calculate already:
                // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1
                return ((x2 - this.x[i1]) * (this.y[i3] - this.y[i1])) / (this.x[i3] - this.x[i1]) + this.y[i1];
            };
            var /** @type {?} */ binarySearch = (function () {
                var /** @type {?} */ maxIndex, /** @type {?} */ minIndex, /** @type {?} */ guess;
                return function (array, val) {
                    minIndex = -1;
                    maxIndex = array.length;
                    while (maxIndex - minIndex > 1)
                        if (array[guess = maxIndex + minIndex >> 1] <= val) {
                            minIndex = guess;
                        }
                        else {
                            maxIndex = guess;
                        }
                    return maxIndex;
                };
            })();
        },
        // xxx: for now i will just save one spline function to to
        getInterpolateFunction: function (s, plt, c) {
            if (!s._spline)
                s._spline = s.loop ?
                    new ((exports.SWIPER_CONTROLLER)).LinearSpline(s, plt, s._slidesGrid, c._slidesGrid) :
                    new ((exports.SWIPER_CONTROLLER)).LinearSpline(s, plt, s._snapGrid, c._snapGrid);
        },
        setTranslate: function (s, plt, translate, byController, setWrapperTranslate) {
            var /** @type {?} */ controlled = s.control;
            var /** @type {?} */ multiplier, /** @type {?} */ controlledTranslate;
            /**
             * @param {?} c
             * @return {?}
             */
            function setControlledTranslate(c) {
                // this will create an Interpolate function based on the snapGrids
                // x is the Grid of the scrolled scroller and y will be the controlled scroller
                // it makes sense to create this only once and recall it for the interpolation
                // the function does a lot of value caching for performance
                translate = c._rtl && swiper_utils_1.isHorizontal(c) ? -s._translate : s._translate;
                if (s.controlBy === 'slide') {
                    exports.SWIPER_CONTROLLER.getInterpolateFunction(s, plt, c);
                    // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
                    // but it did not work out
                    controlledTranslate = -s._spline.interpolate(-translate);
                }
                if (!controlledTranslate || s.controlBy === 'container') {
                    multiplier = (swiper_utils_1.maxTranslate(c) - swiper_utils_1.minTranslate(c)) / (swiper_utils_1.maxTranslate(s) - swiper_utils_1.minTranslate(s));
                    controlledTranslate = (translate - swiper_utils_1.minTranslate(s)) * multiplier + swiper_utils_1.minTranslate(c);
                }
                if (s.controlInverse) {
                    controlledTranslate = swiper_utils_1.maxTranslate(c) - controlledTranslate;
                }
                swiper_progress_1.updateProgress(c, controlledTranslate);
                setWrapperTranslate(c, plt, controlledTranslate, false, s);
                swiper_index_1.updateActiveIndex(c);
            }
            if (Array.isArray(controlled)) {
                for (var /** @type {?} */ i = 0; i < controlled.length; i++) {
                    if (controlled[i] !== byController) {
                        setControlledTranslate(controlled[i]);
                    }
                }
            }
            else if (byController !== controlled) {
                setControlledTranslate(controlled);
            }
        },
        setTransition: function (s, plt, duration, byController, setWrapperTransition) {
            var /** @type {?} */ controlled = s.control;
            var /** @type {?} */ i;
            /**
             * @param {?} c
             * @return {?}
             */
            function setControlledTransition(c) {
                setWrapperTransition(c, plt, duration, s);
                if (duration !== 0) {
                    swiper_1.onTransitionStart(c);
                    plt.transitionEnd(c._wrapper, function () {
                        if (!controlled)
                            return;
                        if (c.loop && s.controlBy === 'slide') {
                            swiper_1.fixLoop(c, plt);
                        }
                        swiper_1.onTransitionEnd(c, plt);
                    });
                }
            }
            if (Array.isArray(controlled)) {
                for (i = 0; i < controlled.length; i++) {
                    if (controlled[i] !== byController) {
                        setControlledTransition(controlled[i]);
                    }
                }
            }
            else if (byController !== controlled) {
                setControlledTransition(controlled);
            }
        }
    };
});
//# sourceMappingURL=swiper-controller.js.map