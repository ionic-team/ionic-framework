(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./swiper-a11y", "./swiper-utils", "./swiper-pagination"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var swiper_a11y_1 = require("./swiper-a11y");
    var swiper_utils_1 = require("./swiper-utils");
    var swiper_pagination_1 = require("./swiper-pagination");
    /**
     * @param {?} s
     * @return {?}
     */
    function updateClasses(s) {
        var /** @type {?} */ childElements;
        swiper_utils_1.removeClass(s._slides, [swiper_utils_1.CLS.slideActive, swiper_utils_1.CLS.slideNext, swiper_utils_1.CLS.slidePrev, swiper_utils_1.CLS.slideDuplicateActive, swiper_utils_1.CLS.slideDuplicateNext, swiper_utils_1.CLS.slideDuplicatePrev]);
        for (var /** @type {?} */ i = 0; i < s._slides.length; i++) {
            swiper_a11y_1.ariaHidden(s._slides[i], true);
        }
        var /** @type {?} */ activeSlide = s._slides[s._activeIndex];
        if (!activeSlide) {
            return;
        }
        // Active classes
        swiper_utils_1.addClass(activeSlide, swiper_utils_1.CLS.slideActive);
        swiper_a11y_1.ariaHidden(activeSlide, false);
        if (s.loop) {
            // Duplicate to all looped slides
            if (activeSlide.classList.contains(swiper_utils_1.CLS.slideDuplicate)) {
                childElements = swiper_utils_1.queryChildren(s._wrapper, '.' + swiper_utils_1.CLS.slide + ':not(.' + swiper_utils_1.CLS.slideDuplicate + ')[data-swiper-slide-index="' + s.realIndex + '"]');
            }
            else {
                childElements = swiper_utils_1.queryChildren(s._wrapper, '.' + swiper_utils_1.CLS.slide + '.' + swiper_utils_1.CLS.slideDuplicate + '[data-swiper-slide-index="' + s.realIndex + '"]');
            }
            swiper_utils_1.addClass(childElements, swiper_utils_1.CLS.slideDuplicateActive);
        }
        // Next Slide
        var /** @type {?} */ nextSlide = activeSlide.nextElementSibling;
        if (s.loop && !nextSlide) {
            nextSlide = s._slides[0];
        }
        nextSlide && nextSlide.classList.add(swiper_utils_1.CLS.slideNext);
        // Prev Slide
        var /** @type {?} */ prevSlide = activeSlide.previousElementSibling;
        if (s.loop && !prevSlide) {
            prevSlide = s._slides[s._slides.length - 1];
        }
        prevSlide && prevSlide.classList.add(swiper_utils_1.CLS.slidePrev);
        if (s.loop) {
            // Duplicate to all looped slides
            if (nextSlide.classList.contains(swiper_utils_1.CLS.slideDuplicate)) {
                childElements = swiper_utils_1.queryChildren(s._wrapper, '.' + swiper_utils_1.CLS.slide + ':not(.' + swiper_utils_1.CLS.slideDuplicate + ')[data-swiper-slide-index="' + nextSlide.getAttribute('data-swiper-slide-index') + '"]');
            }
            else {
                childElements = swiper_utils_1.queryChildren(s._wrapper, '.' + swiper_utils_1.CLS.slide + '.' + swiper_utils_1.CLS.slideDuplicate + '[data-swiper-slide-index="' + nextSlide.getAttribute('data-swiper-slide-index') + '"]');
            }
            swiper_utils_1.addClass(childElements, swiper_utils_1.CLS.slideDuplicateNext);
            if (prevSlide.classList.contains(swiper_utils_1.CLS.slideDuplicate)) {
                childElements = swiper_utils_1.queryChildren(s._wrapper, '.' + swiper_utils_1.CLS.slide + ':not(.' + swiper_utils_1.CLS.slideDuplicate + ')[data-swiper-slide-index="' + prevSlide.getAttribute('data-swiper-slide-index') + '"]');
            }
            else {
                childElements = swiper_utils_1.queryChildren(s._wrapper, '.' + swiper_utils_1.CLS.slide + '.' + swiper_utils_1.CLS.slideDuplicate + '[data-swiper-slide-index="' + prevSlide.getAttribute('data-swiper-slide-index') + '"]');
            }
            swiper_utils_1.addClass(childElements, swiper_utils_1.CLS.slideDuplicatePrev);
        }
        // Pagination
        if (s._paginationContainer) {
            swiper_pagination_1.updatePaginationClasses(s);
        }
        // Next/active buttons
        if (!s.loop) {
            if (s.prevButton) {
                if (s._isBeginning) {
                    s.prevButton.classList.add(swiper_utils_1.CLS.buttonDisabled);
                    swiper_a11y_1.ariaDisable(s.prevButton, true);
                }
                else {
                    s.prevButton.classList.remove(swiper_utils_1.CLS.buttonDisabled);
                    swiper_a11y_1.ariaDisable(s.prevButton, false);
                }
            }
            if (s.nextButton) {
                if (s._isEnd) {
                    s.nextButton.classList.add(swiper_utils_1.CLS.buttonDisabled);
                    swiper_a11y_1.ariaDisable(s.nextButton, true);
                }
                else {
                    s.nextButton.classList.remove(swiper_utils_1.CLS.buttonDisabled);
                    swiper_a11y_1.ariaDisable(s.nextButton, false);
                }
            }
        }
    }
    exports.updateClasses = updateClasses;
});
//# sourceMappingURL=swiper-classes.js.map