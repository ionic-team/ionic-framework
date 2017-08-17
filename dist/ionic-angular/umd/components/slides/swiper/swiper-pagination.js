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
     * @return {?}
     */
    function updatePagination(s) {
        if (!s.paginationType || !s._paginationContainer)
            return;
        var /** @type {?} */ paginationHTML = '';
        if (s.paginationType === 'bullets') {
            var /** @type {?} */ numberOfBullets = s.loop ? Math.ceil((s._slides.length - s.loopedSlides * 2) / s.slidesPerGroup) : s._snapGrid.length;
            for (var /** @type {?} */ i = 0; i < numberOfBullets; i++) {
                if (s.paginationBulletRender) {
                    paginationHTML += s.paginationBulletRender(i, swiper_utils_1.CLS.bullet);
                }
                else {
                    paginationHTML += "<button class=\"" + swiper_utils_1.CLS.bullet + "\" aria-label=\"Go to slide " + (i + 1) + "\" data-slide-index=\"" + i + "\"></button>";
                }
            }
        }
        else if (s.paginationType === 'fraction') {
            paginationHTML =
                '<span class="' + swiper_utils_1.CLS.paginationCurrent + '"></span>' +
                    ' / ' +
                    '<span class="' + swiper_utils_1.CLS.paginationTotal + '"></span>';
        }
        else if (s.paginationType === 'progress') {
            paginationHTML = '<span class="' + swiper_utils_1.CLS.paginationProgressbar + '"></span>';
        }
        s._paginationContainer.innerHTML = paginationHTML;
        s._bullets = (s._paginationContainer.querySelectorAll('.' + swiper_utils_1.CLS.bullet));
    }
    exports.updatePagination = updatePagination;
    /**
     * @param {?} s
     * @return {?}
     */
    function updatePaginationClasses(s) {
        // Current/Total
        var /** @type {?} */ current;
        var /** @type {?} */ total = s.loop ? Math.ceil((s._slides.length - s.loopedSlides * 2) / s.slidesPerGroup) : s._snapGrid.length;
        if (s.loop) {
            current = Math.ceil((s._activeIndex - s.loopedSlides) / s.slidesPerGroup);
            if (current > s._slides.length - 1 - s.loopedSlides * 2) {
                current = current - (s._slides.length - s.loopedSlides * 2);
            }
            if (current > total - 1) {
                current = current - total;
            }
            if (current < 0 && s.paginationType !== 'bullets') {
                current = total + current;
            }
        }
        else {
            if (typeof s._snapIndex !== 'undefined') {
                current = s._snapIndex;
            }
            else {
                current = s._activeIndex || 0;
            }
        }
        // Types
        if (s.paginationType === 'bullets' && s._bullets) {
            var /** @type {?} */ selector = current + (current < 0 ? s._bullets.length : 0);
            for (var /** @type {?} */ i = 0; i < s._bullets.length; i++) {
                if (i === selector) {
                    swiper_utils_1.addClass(s._bullets[i], swiper_utils_1.CLS.bulletActive);
                }
                else {
                    swiper_utils_1.removeClass(s._bullets[i], swiper_utils_1.CLS.bulletActive);
                }
            }
        }
        if (s.paginationType === 'fraction') {
            swiper_utils_1.eachChild(s._paginationContainer, '.' + swiper_utils_1.CLS.paginationCurrent, function (ele) {
                ele.textContent = ((current + 1));
            });
            swiper_utils_1.eachChild(s._paginationContainer, '.' + swiper_utils_1.CLS.paginationTotal, function (ele) {
                ele.textContent = total;
            });
        }
        if (s.paginationType === 'progress') {
            var /** @type {?} */ scale = (current + 1) / total, /** @type {?} */ scaleX = scale, /** @type {?} */ scaleY = 1;
            if (!swiper_utils_1.isHorizontal(s)) {
                scaleY = scale;
                scaleX = 1;
            }
            swiper_utils_1.eachChild(s._paginationContainer, '.' + swiper_utils_1.CLS.paginationProgressbar, function (ele) {
                swiper_utils_1.transform(ele, 'translate3d(0,0,0) scaleX(' + scaleX + ') scaleY(' + scaleY + ')');
                swiper_utils_1.transition(ele, s.speed);
            });
        }
    }
    exports.updatePaginationClasses = updatePaginationClasses;
});
//# sourceMappingURL=swiper-pagination.js.map