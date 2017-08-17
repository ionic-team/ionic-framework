import { eachChild, isHorizontal, transform, transition } from './swiper-utils';
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
        if (isHorizontal(s)) {
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
    transform(el, 'translate3d(' + pX + ', ' + pY + ',0px)');
}
/**
 * @param {?} s
 * @return {?}
 */
export function parallaxSetTranslate(s) {
    eachChild(s.container, '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]', function (el) {
        setParallaxTransform(s, el, s.progress);
    });
    for (var /** @type {?} */ i = 0; i < s._slides.length; i++) {
        var /** @type {?} */ slide = s._slides[i];
        eachChild(slide, '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]', function () {
            var /** @type {?} */ progress = Math.min(Math.max(slide.progress, -1), 1);
            setParallaxTransform(s, slide, progress);
        });
    }
}
/**
 * @param {?} s
 * @param {?} duration
 * @return {?}
 */
export function parallaxSetTransition(s, duration) {
    if (typeof duration === 'undefined')
        duration = s.speed;
    eachChild(s.container, '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]', function (el) {
        var /** @type {?} */ parallaxDuration = parseInt(el.getAttribute('data-swiper-parallax-duration'), 10) || duration;
        if (duration === 0)
            parallaxDuration = 0;
        transition(el, parallaxDuration);
    });
}
//# sourceMappingURL=swiper-parallax.js.map