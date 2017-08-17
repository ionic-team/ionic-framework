(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./swiper-utils", "./swiper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var swiper_utils_1 = require("./swiper-utils");
    var swiper_1 = require("./swiper");
    /**
     * @param {?} s
     * @param {?} plt
     * @param {?} e
     * @return {?}
     */
    function handleKeyboard(s, plt, e) {
        var /** @type {?} */ win = plt.win();
        var /** @type {?} */ kc = e.keyCode || e.charCode;
        // Directions locks
        if (!s._allowSwipeToNext && (swiper_utils_1.isHorizontal(s) && kc === 39 || !swiper_utils_1.isHorizontal(s) && kc === 40)) {
            return false;
        }
        if (!s._allowSwipeToPrev && (swiper_utils_1.isHorizontal(s) && kc === 37 || !swiper_utils_1.isHorizontal(s) && kc === 38)) {
            return false;
        }
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
            return;
        }
        var /** @type {?} */ activeEle = plt.getActiveElement();
        if (activeEle && activeEle.nodeName && (activeEle.nodeName.toLowerCase() === 'input' || activeEle.nodeName.toLowerCase() === 'textarea')) {
            return;
        }
        if (kc === 37 || kc === 39 || kc === 38 || kc === 40) {
            var /** @type {?} */ inView = false;
            // Check that swiper should be inside of visible area of window
            if (s.container.closest('.' + swiper_utils_1.CLS.slide) && !s.container.closest('.' + swiper_utils_1.CLS.slideActive)) {
                return;
            }
            var /** @type {?} */ windowScroll = {
                left: win.pageXOffset,
                top: win.pageYOffset
            };
            var /** @type {?} */ windowWidth = plt.width();
            var /** @type {?} */ windowHeight = plt.height();
            var /** @type {?} */ swiperOffset = swiper_utils_1.offset(s.container, plt);
            if (s._rtl) {
                swiperOffset.left = swiperOffset.left - s.container.scrollLeft;
            }
            var /** @type {?} */ swiperCoord = [
                [swiperOffset.left, swiperOffset.top],
                [swiperOffset.left + s.renderedWidth, swiperOffset.top],
                [swiperOffset.left, swiperOffset.top + s.renderedHeight],
                [swiperOffset.left + s.renderedWidth, swiperOffset.top + s.renderedHeight]
            ];
            for (var /** @type {?} */ i = 0; i < swiperCoord.length; i++) {
                var /** @type {?} */ point = swiperCoord[i];
                if (point[0] >= windowScroll.left && point[0] <= windowScroll.left + windowWidth &&
                    point[1] >= windowScroll.top && point[1] <= windowScroll.top + windowHeight) {
                    inView = true;
                }
            }
            if (!inView)
                return;
        }
        if (swiper_utils_1.isHorizontal(s)) {
            if (kc === 37 || kc === 39) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                else {
                    e.returnValue = false;
                }
            }
            if ((kc === 39 && !s._rtl) || (kc === 37 && s._rtl)) {
                swiper_1.slideNext(s, plt);
            }
            if ((kc === 37 && !s._rtl) || (kc === 39 && s._rtl)) {
                swiper_1.slidePrev(s, plt);
            }
        }
        else {
            if (kc === 38 || kc === 40) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                else {
                    e.returnValue = false;
                }
            }
            if (kc === 40) {
                swiper_1.slideNext(s, plt);
            }
            if (kc === 38) {
                swiper_1.slidePrev(s, plt);
            }
        }
    }
    /**
     * @param {?} s
     * @param {?} plt
     * @param {?} shouldEnable
     * @return {?}
     */
    function enableKeyboardControl(s, plt, shouldEnable) {
        if (shouldEnable && !s._keyboardUnReg) {
            s._keyboardUnReg = plt.registerListener(plt.doc(), 'keydown', function (ev) {
                handleKeyboard(s, plt, ev);
            }, { zone: false });
        }
        else if (!shouldEnable && s._keyboardUnReg) {
            s._keyboardUnReg();
        }
    }
    exports.enableKeyboardControl = enableKeyboardControl;
});
//# sourceMappingURL=swiper-keyboard.js.map