import { CLS, isHorizontal, offset, transform, transition } from './swiper-utils';
import { getTranslate } from './swiper-transition';
/**
 * @param {?} s
 * @param {?} plt
 * @return {?}
 */
export function initZoom(s, plt) {
    s._supportGestures = ('ongesturestart' in plt.win());
    s._zoom = {
        // "Global" Props
        scale: 1,
        currentScale: 1,
        isScaling: false,
        gesture: {
            slide: undefined,
            slideWidth: undefined,
            slideHeight: undefined,
            image: undefined,
            imageWrap: undefined,
            zoomMax: s.zoomMax
        },
        image: {
            isTouched: undefined,
            isMoved: undefined,
            currentX: undefined,
            currentY: undefined,
            minX: undefined,
            minY: undefined,
            maxX: undefined,
            maxY: undefined,
            width: undefined,
            height: undefined,
            startX: undefined,
            startY: undefined,
            touchesStart: {},
            touchesCurrent: {}
        },
        velocity: {
            x: undefined,
            y: undefined,
            prevPositionX: undefined,
            prevPositionY: undefined,
            prevTime: undefined
        },
        unRegs: []
    };
    resetZoomEvents(s, plt);
    return function () {
        detachZoomEvents(s);
    };
}
/**
 * @param {?} ev
 * @return {?}
 */
function getDistanceBetweenTouches(ev) {
    if (ev.targetTouches.length < 2)
        return 1;
    var /** @type {?} */ x1 = ev.targetTouches[0].pageX, /** @type {?} */ y1 = ev.targetTouches[0].pageY, /** @type {?} */ x2 = ev.targetTouches[1].pageX, /** @type {?} */ y2 = ev.targetTouches[1].pageY;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
/**
 * @param {?} s
 * @param {?} _plt
 * @param {?} ev
 * @return {?}
 */
function onGestureStart(s, _plt, ev) {
    var /** @type {?} */ z = s._zoom;
    s.originalEvent = ev;
    if (!s._supportGestures) {
        if (ev.type !== 'touchstart' || ev.type === 'touchstart' && ev.targetTouches.length < 2) {
            return;
        }
        z.gesture.scaleStart = getDistanceBetweenTouches(ev);
    }
    if (!z.gesture.slide) {
        if (ev.currentTarget && ((ev.currentTarget)).classList.contains(CLS.slide)) {
            z.gesture.slide = (ev.currentTarget);
        }
        if (!z.gesture.slide) {
            z.gesture.slide = s._slides[s._activeIndex];
        }
        z.gesture.image = (z.gesture.slide.querySelector('img, svg, canvas, ion-img'));
        z.gesture.imageWrap = (z.gesture.image.closest('.' + CLS.zoomContainer));
        if (!z.gesture.imageWrap) {
            z.gesture.image = undefined;
            return;
        }
        z.gesture.zoomMax = parseInt(z.gesture.imageWrap.getAttribute('data-swiper-zoom') || (s.zoomMax), 10);
    }
    transition(z.gesture.image, 0);
    z.isScaling = true;
}
/**
 * @param {?} s
 * @param {?} _plt
 * @param {?} ev
 * @return {?}
 */
function onGestureChange(s, _plt, ev) {
    var /** @type {?} */ z = s._zoom;
    s.originalEvent = ev;
    if (!s._supportGestures) {
        if (ev.type !== 'touchmove' || ev.type === 'touchmove' && ev.targetTouches.length < 2) {
            return;
        }
        z.gesture.scaleMove = getDistanceBetweenTouches(ev);
    }
    if (!z.gesture.image)
        return;
    if (s._supportGestures) {
        z.scale = ((ev)).scale * z.currentScale;
    }
    else {
        z.scale = (z.gesture.scaleMove / z.gesture.scaleStart) * z.currentScale;
    }
    if (z.scale > z.gesture.zoomMax) {
        z.scale = z.gesture.zoomMax - 1 + Math.pow((z.scale - z.gesture.zoomMax + 1), 0.5);
    }
    if (z.scale < s.zoomMin) {
        z.scale = s.zoomMin + 1 - Math.pow((s.zoomMin - z.scale + 1), 0.5);
    }
    transform(z.gesture.image, 'translate3d(0,0,0) scale(' + z.scale + ')');
}
/**
 * @param {?} s
 * @param {?} _plt
 * @param {?} ev
 * @return {?}
 */
function onGestureEnd(s, _plt, ev) {
    var /** @type {?} */ z = s._zoom;
    s.originalEvent = ev;
    if (!s._supportGestures) {
        if (ev.type !== 'touchend' || ev.type === 'touchend' && ev.changedTouches.length < 2) {
            return;
        }
    }
    if (!z.gesture.image)
        return;
    z.scale = Math.max(Math.min(z.scale, z.gesture.zoomMax), s.zoomMin);
    transition(z.gesture.image, s.speed);
    transform(z.gesture.image, 'translate3d(0,0,0) scale(' + z.scale + ')');
    z.currentScale = z.scale;
    z.isScaling = false;
    if (z.scale === 1) {
        z.gesture.slide = undefined;
    }
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?} ev
 * @return {?}
 */
function onTouchStart(s, plt, ev) {
    var /** @type {?} */ z = s._zoom;
    s.originalEvent = ev;
    if (!z.gesture.image || z.image.isTouched)
        return;
    if (plt.is('android')) {
        ev.preventDefault();
    }
    z.image.isTouched = true;
    z.image.touchesStart.x = ev.type === 'touchstart' ? ev.targetTouches[0].pageX : ((ev)).pageX;
    z.image.touchesStart.y = ev.type === 'touchstart' ? ev.targetTouches[0].pageY : ((ev)).pageY;
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?} ev
 * @return {?}
 */
function onTouchMove(s, plt, ev) {
    var /** @type {?} */ z = s._zoom;
    s.originalEvent = ev;
    if (!z.gesture.image)
        return;
    s._allowClick = false;
    if (!z.image.isTouched || !z.gesture.slide)
        return;
    if (!z.image.isMoved) {
        z.image.width = z.gesture.image.offsetWidth;
        z.image.height = z.gesture.image.offsetHeight;
        z.image.startX = getTranslate(s, plt, z.gesture.imageWrap, 'x') || 0;
        z.image.startY = getTranslate(s, plt, z.gesture.imageWrap, 'y') || 0;
        z.gesture.slideWidth = z.gesture.slide.offsetWidth;
        z.gesture.slideHeight = z.gesture.slide.offsetHeight;
        transition(z.gesture.imageWrap, 0);
        if (s._rtl) {
            z.image.startX = -z.image.startX;
            z.image.startY = -z.image.startY;
        }
    }
    // Define if we need image drag
    var /** @type {?} */ scaledWidth = z.image.width * z.scale;
    var /** @type {?} */ scaledHeight = z.image.height * z.scale;
    if (scaledWidth < z.gesture.slideWidth && scaledHeight < z.gesture.slideHeight) {
        return;
    }
    z.image.minX = Math.min((z.gesture.slideWidth / 2 - scaledWidth / 2), 0);
    z.image.maxX = -z.image.minX;
    z.image.minY = Math.min((z.gesture.slideHeight / 2 - scaledHeight / 2), 0);
    z.image.maxY = -z.image.minY;
    z.image.touchesCurrent.x = ev.type === 'touchmove' ? ev.targetTouches[0].pageX : ((ev)).pageX;
    z.image.touchesCurrent.y = ev.type === 'touchmove' ? ev.targetTouches[0].pageY : ((ev)).pageY;
    if (!z.image.isMoved && !z.isScaling) {
        if (isHorizontal(s) &&
            (Math.floor(z.image.minX) === Math.floor(z.image.startX) && z.image.touchesCurrent.x < z.image.touchesStart.x) ||
            (Math.floor(z.image.maxX) === Math.floor(z.image.startX) && z.image.touchesCurrent.x > z.image.touchesStart.x)) {
            z.image.isTouched = false;
            return;
        }
        else if (!isHorizontal(s) &&
            (Math.floor(z.image.minY) === Math.floor(z.image.startY) && z.image.touchesCurrent.y < z.image.touchesStart.y) ||
            (Math.floor(z.image.maxY) === Math.floor(z.image.startY) && z.image.touchesCurrent.y > z.image.touchesStart.y)) {
            z.image.isTouched = false;
            return;
        }
    }
    ev.preventDefault();
    ev.stopPropagation();
    z.image.isMoved = true;
    z.image.currentX = z.image.touchesCurrent.x - z.image.touchesStart.x + z.image.startX;
    z.image.currentY = z.image.touchesCurrent.y - z.image.touchesStart.y + z.image.startY;
    if (z.image.currentX < z.image.minX) {
        z.image.currentX = z.image.minX + 1 - Math.pow((z.image.minX - z.image.currentX + 1), 0.8);
    }
    if (z.image.currentX > z.image.maxX) {
        z.image.currentX = z.image.maxX - 1 + Math.pow((z.image.currentX - z.image.maxX + 1), 0.8);
    }
    if (z.image.currentY < z.image.minY) {
        z.image.currentY = z.image.minY + 1 - Math.pow((z.image.minY - z.image.currentY + 1), 0.8);
    }
    if (z.image.currentY > z.image.maxY) {
        z.image.currentY = z.image.maxY - 1 + Math.pow((z.image.currentY - z.image.maxY + 1), 0.8);
    }
    // Velocity
    if (!z.velocity.prevPositionX)
        z.velocity.prevPositionX = z.image.touchesCurrent.x;
    if (!z.velocity.prevPositionY)
        z.velocity.prevPositionY = z.image.touchesCurrent.y;
    if (!z.velocity.prevTime)
        z.velocity.prevTime = Date.now();
    z.velocity.x = (z.image.touchesCurrent.x - z.velocity.prevPositionX) / (Date.now() - z.velocity.prevTime) / 2;
    z.velocity.y = (z.image.touchesCurrent.y - z.velocity.prevPositionY) / (Date.now() - z.velocity.prevTime) / 2;
    if (Math.abs(z.image.touchesCurrent.x - z.velocity.prevPositionX) < 2)
        z.velocity.x = 0;
    if (Math.abs(z.image.touchesCurrent.y - z.velocity.prevPositionY) < 2)
        z.velocity.y = 0;
    z.velocity.prevPositionX = z.image.touchesCurrent.x;
    z.velocity.prevPositionY = z.image.touchesCurrent.y;
    z.velocity.prevTime = Date.now();
    transform(z.gesture.imageWrap, 'translate3d(' + z.image.currentX + 'px, ' + z.image.currentY + 'px,0)');
}
/**
 * @param {?} s
 * @return {?}
 */
function onTouchEnd(s) {
    var /** @type {?} */ z = s._zoom;
    if (!z.gesture.image)
        return;
    if (!z.image.isTouched || !z.image.isMoved) {
        z.image.isTouched = false;
        z.image.isMoved = false;
        return;
    }
    z.image.isTouched = false;
    z.image.isMoved = false;
    var /** @type {?} */ momentumDurationX = 300;
    var /** @type {?} */ momentumDurationY = 300;
    var /** @type {?} */ momentumDistanceX = z.velocity.x * momentumDurationX;
    var /** @type {?} */ newPositionX = z.image.currentX + momentumDistanceX;
    var /** @type {?} */ momentumDistanceY = z.velocity.y * momentumDurationY;
    var /** @type {?} */ newPositionY = z.image.currentY + momentumDistanceY;
    // Fix duration
    if (z.velocity.x !== 0)
        momentumDurationX = Math.abs((newPositionX - z.image.currentX) / z.velocity.x);
    if (z.velocity.y !== 0)
        momentumDurationY = Math.abs((newPositionY - z.image.currentY) / z.velocity.y);
    var /** @type {?} */ momentumDuration = Math.max(momentumDurationX, momentumDurationY);
    z.image.currentX = newPositionX;
    z.image.currentY = newPositionY;
    // Define if we need image drag
    var /** @type {?} */ scaledWidth = z.image.width * z.scale;
    var /** @type {?} */ scaledHeight = z.image.height * z.scale;
    z.image.minX = Math.min((z.gesture.slideWidth / 2 - scaledWidth / 2), 0);
    z.image.maxX = -z.image.minX;
    z.image.minY = Math.min((z.gesture.slideHeight / 2 - scaledHeight / 2), 0);
    z.image.maxY = -z.image.minY;
    z.image.currentX = Math.max(Math.min(z.image.currentX, z.image.maxX), z.image.minX);
    z.image.currentY = Math.max(Math.min(z.image.currentY, z.image.maxY), z.image.minY);
    transition(z.gesture.imageWrap, momentumDuration);
    transform(z.gesture.imageWrap, 'translate3d(' + z.image.currentX + 'px, ' + z.image.currentY + 'px,0)');
}
/**
 * @param {?} s
 * @return {?}
 */
function onTransitionEnd(s) {
    var /** @type {?} */ z = s._zoom;
    if (z.gesture.slide && s._previousIndex !== s._activeIndex) {
        transform(z.gesture.image, 'translate3d(0,0,0) scale(1)');
        transform(z.gesture.imageWrap, 'translate3d(0,0,0)');
        z.gesture.slide = z.gesture.image = z.gesture.imageWrap = undefined;
        z.scale = z.currentScale = 1;
    }
}
/**
 * @param {?} s
 * @param {?} plt
 * @return {?}
 */
function toggleZoom(s, plt) {
    var /** @type {?} */ z = s._zoom;
    var /** @type {?} */ ev = s.originalEvent;
    if (!z.gesture.slide) {
        z.gesture.slide = s.clickedSlide ? s.clickedSlide : s._slides[s._activeIndex];
        z.gesture.image = (z.gesture.slide.querySelector('img, svg, canvas, ion-img'));
        z.gesture.imageWrap = (z.gesture.image.closest('.' + CLS.zoomContainer));
    }
    if (!z.gesture.image)
        return;
    var /** @type {?} */ touchX;
    var /** @type {?} */ touchY;
    var /** @type {?} */ offsetX;
    var /** @type {?} */ offsetY;
    var /** @type {?} */ diffX;
    var /** @type {?} */ diffY;
    var /** @type {?} */ translateX;
    var /** @type {?} */ translateY;
    var /** @type {?} */ imageWidth;
    var /** @type {?} */ imageHeight;
    var /** @type {?} */ scaledWidth;
    var /** @type {?} */ scaledHeight;
    var /** @type {?} */ translateMinX;
    var /** @type {?} */ translateMinY;
    var /** @type {?} */ translateMaxX;
    var /** @type {?} */ translateMaxY;
    var /** @type {?} */ slideWidth;
    var /** @type {?} */ slideHeight;
    if (typeof z.image.touchesStart.x === 'undefined' && ev) {
        touchX = ev.type === 'touchend' ? ev.changedTouches[0].pageX : ((ev)).pageX;
        touchY = ev.type === 'touchend' ? ev.changedTouches[0].pageY : ((ev)).pageY;
    }
    else {
        touchX = z.image.touchesStart.x;
        touchY = z.image.touchesStart.y;
    }
    if (z.scale && z.scale !== 1) {
        // Zoom Out
        z.scale = z.currentScale = 1;
        transition(z.gesture.imageWrap, 300);
        transform(z.gesture.imageWrap, 'translate3d(0,0,0)');
        transition(z.gesture.image, 300);
        transform(z.gesture.image, 'translate3d(0,0,0) scale(1)');
        z.gesture.slide = undefined;
    }
    else {
        // Zoom In
        z.scale = z.currentScale = parseInt(z.gesture.imageWrap.getAttribute('data-swiper-zoom') || (s.zoomMax), 10);
        if (ev) {
            slideWidth = z.gesture.slide.offsetWidth;
            slideHeight = z.gesture.slide.offsetHeight;
            var /** @type {?} */ slideOffsets = offset(z.gesture.slide, plt);
            offsetX = slideOffsets.left;
            offsetY = slideOffsets.top;
            diffX = offsetX + slideWidth / 2 - touchX;
            diffY = offsetY + slideHeight / 2 - touchY;
            imageWidth = z.gesture.image.offsetWidth;
            imageHeight = z.gesture.image.offsetHeight;
            scaledWidth = imageWidth * z.scale;
            scaledHeight = imageHeight * z.scale;
            translateMinX = Math.min((slideWidth / 2 - scaledWidth / 2), 0);
            translateMinY = Math.min((slideHeight / 2 - scaledHeight / 2), 0);
            translateMaxX = -translateMinX;
            translateMaxY = -translateMinY;
            translateX = diffX * z.scale;
            translateY = diffY * z.scale;
            if (translateX < translateMinX) {
                translateX = translateMinX;
            }
            if (translateX > translateMaxX) {
                translateX = translateMaxX;
            }
            if (translateY < translateMinY) {
                translateY = translateMinY;
            }
            if (translateY > translateMaxY) {
                translateY = translateMaxY;
            }
        }
        else {
            translateX = 0;
            translateY = 0;
        }
        transition(z.gesture.imageWrap, 300);
        transform(z.gesture.imageWrap, 'translate3d(' + translateX + 'px, ' + translateY + 'px,0)');
        transition(z.gesture.image, 300);
        transform(z.gesture.image, 'translate3d(0,0,0) scale(' + z.scale + ')');
    }
}
/**
 * @param {?} s
 * @param {?} plt
 * @return {?}
 */
export function resetZoomEvents(s, plt) {
    detachZoomEvents(s);
    var /** @type {?} */ unRegs = s._zoom.unRegs;
    var /** @type {?} */ evtOpts = { passive: s._touchEvents.start === 'touchstart', zone: false };
    var /** @type {?} */ slides = s._slides;
    var /** @type {?} */ slide;
    // Scale image
    if (s._supportGestures) {
        for (var /** @type {?} */ i = 0; i < slides.length; i++) {
            slide = slides[i];
            // gesturestart
            plt.registerListener(slide, 'gesturestart', function (ev) {
                onGestureStart(s, plt, ev);
            }, evtOpts, unRegs);
            // gesturechange
            plt.registerListener(slide, 'gesturechange', function (ev) {
                onGestureChange(s, plt, ev);
            }, evtOpts, unRegs);
            // gestureend
            plt.registerListener(slide, 'gestureend', function (ev) {
                onGestureEnd(s, plt, ev);
            }, evtOpts, unRegs);
        }
    }
    else if (s._touchEvents.start === 'touchstart') {
        for (var /** @type {?} */ i_1 = 0; i_1 < slides.length; i_1++) {
            slide = slides[i_1];
            // touchstart
            plt.registerListener(slide, s._touchEvents.start, function (ev) {
                onGestureStart(s, plt, ev);
            }, evtOpts, unRegs);
            // touchmove
            plt.registerListener(slide, s._touchEvents.move, function (ev) {
                onGestureChange(s, plt, ev);
            }, evtOpts, unRegs);
            // touchend
            plt.registerListener(slide, s._touchEvents.end, function (ev) {
                onGestureEnd(s, plt, ev);
            }, evtOpts, unRegs);
        }
    }
    // Move image
    var /** @type {?} */ touchStartSub = s.ionSlideTouchStart.subscribe(function (ev) {
        onTouchStart(s, plt, ev);
    });
    unRegs.push(function () { touchStartSub.unsubscribe(); });
    for (var /** @type {?} */ i_2 = 0; i_2 < slides.length; i_2++) {
        slide = slides[i_2];
        if (slide.querySelector('.' + CLS.zoomContainer)) {
            plt.registerListener(slide, 's.touchEvents.move', function (ev) {
                onTouchMove(s, plt, ev);
            }, evtOpts, unRegs);
        }
    }
    var /** @type {?} */ touchEndSub = s.ionSlideTouchEnd.subscribe(function () {
        onTouchEnd(s);
    });
    unRegs.push(function () { touchEndSub.unsubscribe(); });
    // Scale Out
    var /** @type {?} */ transEndSub = s.ionSlideTouchEnd.subscribe(function () {
        onTransitionEnd(s);
    });
    unRegs.push(function () { transEndSub.unsubscribe(); });
    if (s.zoomToggle) {
        var /** @type {?} */ doubleTapSub = s.ionSlideDoubleTap.subscribe(function () {
            toggleZoom(s, plt);
        });
        unRegs.push(function () { doubleTapSub.unsubscribe(); });
    }
}
/**
 * @param {?} s
 * @return {?}
 */
function detachZoomEvents(s) {
    s._zoom.unRegs.forEach(function (unReg) {
        unReg();
    });
    s._zoom.unRegs.length = 0;
}
//# sourceMappingURL=swiper-zoom.js.map