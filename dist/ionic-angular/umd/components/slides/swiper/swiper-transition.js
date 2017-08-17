(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./swiper-utils", "./swiper-parallax", "./swiper-progress", "./swiper-index", "./swiper-controller", "./swiper-effects"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var swiper_utils_1 = require("./swiper-utils");
    var swiper_parallax_1 = require("./swiper-parallax");
    var swiper_progress_1 = require("./swiper-progress");
    var swiper_index_1 = require("./swiper-index");
    var swiper_controller_1 = require("./swiper-controller");
    var swiper_effects_1 = require("./swiper-effects");
    /**
     * @param {?} s
     * @param {?} plt
     * @param {?} translate
     * @param {?=} shouldUpdateActiveIndex
     * @param {?=} byController
     * @return {?}
     */
    function setWrapperTranslate(s, plt, translate, shouldUpdateActiveIndex, byController) {
        var /** @type {?} */ x = 0, /** @type {?} */ y = 0, /** @type {?} */ z = 0;
        if (swiper_utils_1.isHorizontal(s)) {
            x = s._rtl ? -translate : translate;
        }
        else {
            y = translate;
        }
        if (s.roundLengths) {
            x = swiper_utils_1.round(x);
            y = swiper_utils_1.round(y);
        }
        if (!s.virtualTranslate) {
            swiper_utils_1.transform(s._wrapper, 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
        }
        s._translate = swiper_utils_1.isHorizontal(s) ? x : y;
        // Check if we need to update progress
        var /** @type {?} */ progress;
        var /** @type {?} */ translatesDiff = swiper_utils_1.maxTranslate(s) - swiper_utils_1.minTranslate(s);
        if (translatesDiff === 0) {
            progress = 0;
        }
        else {
            progress = (translate - swiper_utils_1.minTranslate(s)) / (translatesDiff);
        }
        if (progress !== s.progress) {
            swiper_progress_1.updateProgress(s, translate);
        }
        if (shouldUpdateActiveIndex) {
            swiper_index_1.updateActiveIndex(s);
        }
        if (s.effect !== 'slide' && swiper_effects_1.SWIPER_EFFECTS[s.effect]) {
            swiper_effects_1.SWIPER_EFFECTS[s.effect].setTranslate(s, plt);
        }
        if (s.parallax) {
            swiper_parallax_1.parallaxSetTranslate(s);
        }
        if (s.control) {
            swiper_controller_1.SWIPER_CONTROLLER.setTranslate(s, plt, s._translate, byController, setWrapperTranslate);
        }
    }
    exports.setWrapperTranslate = setWrapperTranslate;
    /**
     * @param {?} s
     * @param {?} plt
     * @param {?} el
     * @param {?} axis
     * @return {?}
     */
    function getTranslate(s, plt, el, axis) {
        var /** @type {?} */ win = plt.win();
        var /** @type {?} */ matrix;
        var /** @type {?} */ curTransform;
        var /** @type {?} */ curStyle;
        var /** @type {?} */ transformMatrix;
        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = 'x';
        }
        if (s.virtualTranslate) {
            return s._rtl ? -s._translate : s._translate;
        }
        curStyle = plt.getElementComputedStyle(el);
        if (win.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(',').length > 6) {
                curTransform = curTransform.split(', ').map(function (a) {
                    return a.replace(',', '.');
                }).join(', ');
            }
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new win.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
        }
        else {
            transformMatrix = ((curStyle)).MozTransform || ((curStyle)).OTransform || ((curStyle)).MsTransform || ((curStyle)).msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }
        if (axis === 'x') {
            if (win.WebKitCSSMatrix) {
                // Latest Chrome and webkits Fix
                curTransform = (transformMatrix.m41);
            }
            else if (matrix.length === 16) {
                // Crazy IE10 Matrix
                curTransform = parseFloat(matrix[12]);
            }
            else {
                // Normal Browsers
                curTransform = parseFloat(matrix[4]);
            }
        }
        if (axis === 'y') {
            if (win.WebKitCSSMatrix) {
                // Latest Chrome and webkits Fix
                curTransform = transformMatrix.m42;
            }
            else if (matrix.length === 16) {
                // Crazy IE10 Matrix
                curTransform = parseFloat(matrix[13]);
            }
            else {
                // Normal Browsers
                curTransform = parseFloat(matrix[5]);
            }
        }
        if (s._rtl && curTransform) {
            curTransform = -curTransform;
        }
        return curTransform || 0;
    }
    exports.getTranslate = getTranslate;
    /**
     * @param {?} s
     * @param {?} plt
     * @param {?=} axis
     * @return {?}
     */
    function getWrapperTranslate(s, plt, axis) {
        if (typeof axis === 'undefined') {
            axis = swiper_utils_1.isHorizontal(s) ? 'x' : 'y';
        }
        return getTranslate(s, plt, s._wrapper, axis);
    }
    exports.getWrapperTranslate = getWrapperTranslate;
    /**
     * @param {?} s
     * @param {?} plt
     * @param {?} duration
     * @param {?=} byController
     * @return {?}
     */
    function setWrapperTransition(s, plt, duration, byController) {
        swiper_utils_1.transition(s._wrapper, duration);
        if (s.effect !== 'slide' && swiper_effects_1.SWIPER_EFFECTS[s.effect]) {
            swiper_effects_1.SWIPER_EFFECTS[s.effect].setTransition(s, plt, duration);
        }
        if (s.parallax) {
            swiper_parallax_1.parallaxSetTransition(s, duration);
        }
        if (s.control) {
            swiper_controller_1.SWIPER_CONTROLLER.setTransition(s, plt, duration, byController, setWrapperTransition);
        }
    }
    exports.setWrapperTransition = setWrapperTransition;
});
//# sourceMappingURL=swiper-transition.js.map