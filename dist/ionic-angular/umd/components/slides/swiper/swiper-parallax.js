(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./swiper-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var swiper_utils_1 = require("./swiper-utils");
    /**
     * @param {?} s
     * @param {?} el
     * @param {?} progress
     * @return {?}
     */
    function setParallaxTransform(s, el, progress) {
        var /** @type {?} */ p;
        var /** @type {?} */ pX;
        var /** @type {?} */ pY;
        var /** @type {?} */ rtlFactor = s._rtl ? -1 : 1;
        p = el.getAttribute('data-swiper-parallax') || '0';
        pX = el.getAttribute('data-swiper-parallax-x');
        pY = el.getAttribute('data-swiper-parallax-y');
        if (pX || pY) {
            pX = pX || '0';
            pY = pY || '0';
        }
        else {
            if (swiper_utils_1.isHorizontal(s)) {
                pX = p;
                pY = '0';
            }
            else {
                pY = p;
                pX = '0';
            }
        }
        if ((pX).indexOf('%') >= 0) {
            pX = parseInt(pX, 10) * progress * rtlFactor + '%';
        }
        else {
            pX = (pX) * progress * rtlFactor + 'px';
        }
        if ((pY).indexOf('%') >= 0) {
            pY = parseInt(pY, 10) * progress + '%';
        }
        else {
            pY = (pY) * progress + 'px';
        }
        swiper_utils_1.transform(el, 'translate3d(' + pX + ', ' + pY + ',0px)');
    }
    /**
     * @param {?} s
     * @return {?}
     */
    function parallaxSetTranslate(s) {
        swiper_utils_1.eachChild(s.container, '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]', function (el) {
            setParallaxTransform(s, el, s.progress);
        });
        for (var /** @type {?} */ i = 0; i < s._slides.length; i++) {
            var /** @type {?} */ slide = s._slides[i];
            swiper_utils_1.eachChild(slide, '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]', function () {
                var /** @type {?} */ progress = Math.min(Math.max(slide.progress, -1), 1);
                setParallaxTransform(s, slide, progress);
            });
        }
    }
    exports.parallaxSetTranslate = parallaxSetTranslate;
    /**
     * @param {?} s
     * @param {?} duration
     * @return {?}
     */
    function parallaxSetTransition(s, duration) {
        if (typeof duration === 'undefined')
            duration = s.speed;
        swiper_utils_1.eachChild(s.container, '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]', function (el) {
            var /** @type {?} */ parallaxDuration = parseInt(el.getAttribute('data-swiper-parallax-duration'), 10) || duration;
            if (duration === 0)
                parallaxDuration = 0;
            swiper_utils_1.transition(el, parallaxDuration);
        });
    }
    exports.parallaxSetTransition = parallaxSetTransition;
});
//# sourceMappingURL=swiper-parallax.js.map