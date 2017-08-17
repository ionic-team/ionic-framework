import { CLS, getElementIndex, isFormElement, isHorizontal, maxTranslate, minTranslate, triggerTransitionEnd, } from './swiper-utils';
import { getWrapperTranslate, setWrapperTransition, setWrapperTranslate } from './swiper-transition';
import { currentSlidesPerView, fixLoop, onTransitionEnd, onTransitionStart, pauseAutoplay, slideNext, slidePrev, slideReset, slideTo, stopAutoplay, updateAutoHeight, updateContainerSize, updateSlidesSize, } from './swiper';
import { updateProgress } from './swiper-progress';
import { updateActiveIndex } from './swiper-index';
import { updatePagination } from './swiper-pagination';
import { updateClasses } from './swiper-classes';
/**
 * @param {?} s
 * @param {?} plt
 * @return {?}
 */
export function initEvents(s, plt) {
    var /** @type {?} */ win = plt.win();
    var /** @type {?} */ doc = plt.doc();
    s._supportTouch = (function () {
        return !!(('ontouchstart' in win) || win.DocumentTouch && doc instanceof win.DocumentTouch);
    })();
    // Define Touch Events
    s._touchEventsDesktop = { start: 'mousedown', move: 'mousemove', end: 'mouseup' };
    if (win.navigator.pointerEnabled) {
        s._touchEventsDesktop = { start: 'pointerdown', move: 'pointermove', end: 'pointerup' };
    }
    else if (win.navigator.msPointerEnabled) {
        s._touchEventsDesktop = { start: 'MSPointerDown', move: 'MSPointerMove', end: 'MSPointerUp' };
    }
    s._touchEvents = {
        start: s._supportTouch || !s.simulateTouch ? 'touchstart' : s._touchEventsDesktop.start,
        move: s._supportTouch || !s.simulateTouch ? 'touchmove' : s._touchEventsDesktop.move,
        end: s._supportTouch || !s.simulateTouch ? 'touchend' : s._touchEventsDesktop.end
    };
    // WP8 Touch Events Fix
    if (win.navigator.pointerEnabled || win.navigator.msPointerEnabled) {
        (s.touchEventsTarget === 'container' ? s.container : s._wrapper).classList.add('swiper-wp8-' + s.direction);
    }
    var /** @type {?} */ unregs = [];
    var /** @type {?} */ touchEventsTarget = s.touchEventsTarget === 'container' ? s.container : s._wrapper;
    // Touch Events
    if (s._supportTouch) {
        // touchstart
        plt.registerListener(touchEventsTarget, s._touchEvents.start, function (ev) {
            onTouchStart(s, plt, ev);
        }, { passive: true, zone: false }, unregs);
        // touchmove
        plt.registerListener(touchEventsTarget, s._touchEvents.move, function (ev) {
            onTouchMove(s, plt, ev);
        }, { zone: false }, unregs);
        // touchend
        plt.registerListener(touchEventsTarget, s._touchEvents.end, function (ev) {
            onTouchEnd(s, plt, ev);
        }, { passive: true, zone: false }, unregs);
    }
    if ((s.simulateTouch && !plt.is('ios') && !plt.is('android')) || (s.simulateTouch && !s._supportTouch && plt.is('ios')) || plt.getQueryParam('ionicPlatform')) {
        // mousedown
        plt.registerListener(touchEventsTarget, 'mousedown', function (ev) {
            onTouchStart(s, plt, ev);
        }, { zone: false }, unregs);
        // mousemove
        plt.registerListener(plt.doc(), 'mousemove', function (ev) {
            onTouchMove(s, plt, ev);
        }, { zone: false }, unregs);
        // mouseup
        plt.registerListener(plt.doc(), 'mouseup', function (ev) {
            onTouchEnd(s, plt, ev);
        }, { zone: false }, unregs);
    }
    // onresize
    var /** @type {?} */ resizeObs = plt.resize.subscribe(function () { return onResize(s, plt, false); });
    // Next, Prev, Index
    if (s.nextButton) {
        plt.registerListener(s.nextButton, 'click', function (ev) {
            onClickNext(s, plt, ev);
        }, { zone: false }, unregs);
    }
    if (s.prevButton) {
        plt.registerListener(s.prevButton, 'click', function (ev) {
            onClickPrev(s, plt, ev);
        }, { zone: false }, unregs);
    }
    if (s.paginationType) {
        plt.registerListener(s._paginationContainer, 'click', function (ev) {
            onClickIndex(s, plt, ev);
        }, { zone: false }, unregs);
    }
    // Prevent Links Clicks
    if (s.preventClicks || s.preventClicksPropagation) {
        plt.registerListener(touchEventsTarget, 'click', function (ev) {
            preventClicks(s, ev);
        }, { zone: false, capture: true }, unregs);
    }
    // return a function that removes all of the added listeners
    return function () {
        resizeObs.unsubscribe();
        unregs.forEach(function (unreg) {
            unreg();
        });
        unregs = null;
    };
}
/**
 * @param {?} s
 * @param {?} e
 * @return {?}
 */
function preventClicks(s, e) {
    if (!s._allowClick) {
        if (s.preventClicks) {
            e.preventDefault();
        }
        if (s.preventClicksPropagation && s._animating) {
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?} e
 * @return {?}
 */
function onClickNext(s, plt, e) {
    e.preventDefault();
    if (s._isEnd && !s.loop) {
        return;
    }
    slideNext(s, plt);
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?} e
 * @return {?}
 */
function onClickPrev(s, plt, e) {
    e.preventDefault();
    if (s._isBeginning && !s.loop) {
        return;
    }
    slidePrev(s, plt);
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?} e
 * @return {?}
 */
function onClickIndex(s, plt, e) {
    var /** @type {?} */ indexStr = ((e.target)).getAttribute('data-slide-index');
    if (indexStr) {
        var /** @type {?} */ index = parseInt(indexStr, 10);
        e.preventDefault();
        if (s.loop) {
            index = index + s.loopedSlides;
        }
        slideTo(s, plt, index);
    }
}
/**
 * @param {?} e
 * @param {?} selector
 * @return {?}
 */
function findElementInEvent(e, selector) {
    var /** @type {?} */ el = (e.target);
    if (!el.matches(selector)) {
        if (typeof selector === 'string') {
            el = (el.closest(selector));
        }
        else if (selector.nodeType) {
            var /** @type {?} */ parentEl = el.parentElement;
            while (parentEl) {
                if (parentEl === selector) {
                    return selector;
                }
            }
            return undefined;
        }
    }
    return el;
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?} e
 * @return {?}
 */
function updateClickedSlide(s, plt, e) {
    var /** @type {?} */ slide = (findElementInEvent(e, '.' + CLS.slide));
    var /** @type {?} */ slideIndex = -1;
    if (slide) {
        for (var /** @type {?} */ i = 0; i < s._slides.length; i++) {
            if (s._slides[i] === slide) {
                slideIndex = i;
                break;
            }
        }
    }
    if (slide && slideIndex > -1) {
        s.clickedSlide = slide;
        s.clickedIndex = slideIndex;
    }
    else {
        s.clickedSlide = undefined;
        s.clickedIndex = undefined;
        return;
    }
    if (s.slideToClickedSlide && s.clickedIndex !== undefined && s.clickedIndex !== s._activeIndex) {
        var /** @type {?} */ slideToIndex = s.clickedIndex;
        var /** @type {?} */ realIndex;
        var /** @type {?} */ slidesPerView = s.slidesPerView === 'auto' ? currentSlidesPerView(s) : (s.slidesPerView);
        if (s.loop) {
            if (s._animating)
                return;
            realIndex = parseInt(s.clickedSlide.getAttribute('data-swiper-slide-index'), 10);
            if (s.centeredSlides) {
                if ((slideToIndex < s.loopedSlides - slidesPerView / 2) || (slideToIndex > s._slides.length - s.loopedSlides + slidesPerView / 2)) {
                    fixLoop(s, plt);
                    slideToIndex = getElementIndex(s._wrapper.querySelector('.' + CLS.slide + '[data-swiper-slide-index="' + realIndex + '"]:not(.' + CLS.slideDuplicate + ')'));
                    plt.timeout(function () {
                        slideTo(s, plt, slideToIndex);
                    });
                }
                else {
                    slideTo(s, plt, slideToIndex);
                }
            }
            else {
                if (slideToIndex > s._slides.length - slidesPerView) {
                    fixLoop(s, plt);
                    slideToIndex = getElementIndex(s._wrapper.querySelector('.' + CLS.slide + '[data-swiper-slide-index="' + realIndex + '"]:not(.' + CLS.slideDuplicate + ')'));
                    plt.timeout(function () {
                        slideTo(s, plt, slideToIndex);
                    });
                }
                else {
                    slideTo(s, plt, slideToIndex);
                }
            }
        }
        else {
            slideTo(s, plt, slideToIndex);
        }
    }
}
var /** @type {?} */ isTouched;
var /** @type {?} */ isMoved;
var /** @type {?} */ allowTouchCallbacks;
var /** @type {?} */ touchStartTime;
var /** @type {?} */ isScrolling;
var /** @type {?} */ currentTranslate;
var /** @type {?} */ startTranslate;
var /** @type {?} */ allowThresholdMove;
// Last click time
var /** @type {?} */ lastClickTime = Date.now();
var /** @type {?} */ clickTimeout;
// Velocities
var /** @type {?} */ velocities = [];
var /** @type {?} */ allowMomentumBounce;
// Touch handlers
var /** @type {?} */ isTouchEvent;
var /** @type {?} */ startMoving;
/**
 * @param {?} s
 * @param {?} plt
 * @param {?} ev
 * @return {?}
 */
function onTouchStart(s, plt, ev) {
    (void 0) /* console.debug */;
    if (ev.originalEvent) {
        ev = ev.originalEvent;
    }
    s.originalEvent = ev;
    isTouchEvent = ev.type === 'touchstart';
    if (!isTouchEvent && 'which' in ev && ev.which === 3) {
        return;
    }
    if (s.noSwiping && findElementInEvent(ev, '.' + CLS.noSwiping)) {
        s._allowClick = true;
        return;
    }
    if (s.swipeHandler) {
        if (!findElementInEvent(ev, s.swipeHandler))
            return;
    }
    var /** @type {?} */ startX = s._touches.currentX = ev.type === 'touchstart' ? ev.targetTouches[0].pageX : ev.pageX;
    var /** @type {?} */ startY = s._touches.currentY = ev.type === 'touchstart' ? ev.targetTouches[0].pageY : ev.pageY;
    // Do NOT start if iOS edge swipe is detected. Otherwise iOS app (UIWebView) cannot swipe-to-go-back anymore
    if (plt.is('ios') && s.iOSEdgeSwipeDetection && startX <= s.iOSEdgeSwipeThreshold) {
        return;
    }
    isTouched = true;
    isMoved = false;
    allowTouchCallbacks = true;
    isScrolling = undefined;
    startMoving = undefined;
    s._touches.startX = startX;
    s._touches.startY = startY;
    touchStartTime = Date.now();
    s._allowClick = true;
    updateContainerSize(s, plt);
    s.swipeDirection = undefined;
    if (s.threshold > 0) {
        allowThresholdMove = false;
    }
    if (ev.type !== 'touchstart') {
        var /** @type {?} */ preventDefault = true;
        if (isFormElement(ev.target)) {
            preventDefault = false;
        }
        plt.focusOutActiveElement();
        if (preventDefault) {
            ev.preventDefault();
        }
    }
    s.ionSlideTouchStart.emit(ev);
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?} ev
 * @return {?}
 */
function onTouchMove(s, plt, ev) {
    (void 0) /* console.debug */;
    if (ev.originalEvent) {
        ev = ev.originalEvent;
    }
    s.originalEvent = ev;
    if (isTouchEvent && ev.type === 'mousemove')
        return;
    if (ev.preventedByNestedSwiper) {
        s._touches.startX = ev.type === 'touchmove' ? ev.targetTouches[0].pageX : ev.pageX;
        s._touches.startY = ev.type === 'touchmove' ? ev.targetTouches[0].pageY : ev.pageY;
        return;
    }
    if (s.onlyExternal) {
        // isMoved = true;
        s._allowClick = false;
        if (isTouched) {
            s._touches.startX = s._touches.currentX = ev.type === 'touchmove' ? ev.targetTouches[0].pageX : ev.pageX;
            s._touches.startY = s._touches.currentY = ev.type === 'touchmove' ? ev.targetTouches[0].pageY : ev.pageY;
            touchStartTime = Date.now();
        }
        return;
    }
    if (isTouchEvent && s.touchReleaseOnEdges && !s.loop) {
        if (!isHorizontal(s)) {
            // Vertical
            if ((s._touches.currentY < s._touches.startY && s._translate <= maxTranslate(s)) ||
                (s._touches.currentY > s._touches.startY && s._translate >= minTranslate(s))) {
                return;
            }
        }
        else {
            if ((s._touches.currentX < s._touches.startX && s._translate <= maxTranslate(s)) ||
                (s._touches.currentX > s._touches.startX && s._translate >= minTranslate(s))) {
                return;
            }
        }
    }
    var /** @type {?} */ activeEle = plt.getActiveElement();
    if (isTouchEvent && activeEle) {
        if (ev.target === activeEle && isFormElement(ev.target)) {
            isMoved = true;
            s._allowClick = false;
            return;
        }
    }
    if (ev.targetTouches && ev.targetTouches.length > 1)
        return;
    s._touches.currentX = ev.type === 'touchmove' ? ev.targetTouches[0].pageX : ev.pageX;
    s._touches.currentY = ev.type === 'touchmove' ? ev.targetTouches[0].pageY : ev.pageY;
    if (typeof isScrolling === 'undefined') {
        var /** @type {?} */ touchAngle;
        if (isHorizontal(s) && s._touches.currentY === s._touches.startY || !isHorizontal(s) && s._touches.currentX === s._touches.startX) {
            isScrolling = false;
        }
        else {
            touchAngle = Math.atan2(Math.abs(s._touches.currentY - s._touches.startY), Math.abs(s._touches.currentX - s._touches.startX)) * 180 / Math.PI;
            isScrolling = isHorizontal(s) ? touchAngle > s.touchAngle : (90 - touchAngle > s.touchAngle);
        }
    }
    if (!isTouched)
        return;
    if (isScrolling) {
        isTouched = false;
        return;
    }
    s._allowClick = false;
    s.ionSlideDrag.emit(s);
    ev.preventDefault();
    if (s.touchMoveStopPropagation) {
        ev.stopPropagation();
    }
    if (!isMoved) {
        if (s.loop) {
            fixLoop(s, plt);
        }
        startTranslate = getWrapperTranslate(s, plt);
        setWrapperTransition(s, plt, 0);
        if (s._animating) {
            triggerTransitionEnd(plt, s._wrapper);
        }
        if (s.autoplay && s._autoplaying) {
            if (s.autoplayDisableOnInteraction) {
                stopAutoplay(s);
            }
            else {
                pauseAutoplay(s, plt);
            }
        }
        allowMomentumBounce = false;
    }
    isMoved = true;
    var /** @type {?} */ diff = s._touches.diff = isHorizontal(s) ? s._touches.currentX - s._touches.startX : s._touches.currentY - s._touches.startY;
    diff = diff * s.touchRatio;
    if (s._rtl)
        diff = -diff;
    s.swipeDirection = diff > 0 ? 'prev' : 'next';
    currentTranslate = diff + startTranslate;
    var /** @type {?} */ disableParentSwiper = true;
    if ((diff > 0 && currentTranslate > minTranslate(s))) {
        disableParentSwiper = false;
        if (s.resistance) {
            currentTranslate = minTranslate(s) - 1 + Math.pow(-minTranslate(s) + startTranslate + diff, s.resistanceRatio);
        }
    }
    else if (diff < 0 && currentTranslate < maxTranslate(s)) {
        disableParentSwiper = false;
        if (s.resistance)
            currentTranslate = maxTranslate(s) + 1 - Math.pow(maxTranslate(s) - startTranslate - diff, s.resistanceRatio);
    }
    if (disableParentSwiper) {
        ev.preventedByNestedSwiper = true;
    }
    // Directions locks
    if (!s._allowSwipeToNext && s.swipeDirection === 'next' && currentTranslate < startTranslate) {
        currentTranslate = startTranslate;
    }
    if (!s._allowSwipeToPrev && s.swipeDirection === 'prev' && currentTranslate > startTranslate) {
        currentTranslate = startTranslate;
    }
    // Threshold
    if (s.threshold > 0) {
        if (Math.abs(diff) > s.threshold || allowThresholdMove) {
            if (!allowThresholdMove) {
                allowThresholdMove = true;
                s._touches.startX = s._touches.currentX;
                s._touches.startY = s._touches.currentY;
                currentTranslate = startTranslate;
                s._touches.diff = isHorizontal(s) ? s._touches.currentX - s._touches.startX : s._touches.currentY - s._touches.startY;
                return;
            }
        }
        else {
            currentTranslate = startTranslate;
            return;
        }
    }
    if (!s.followFinger)
        return;
    // Update active index in free mode
    if (s.freeMode || s.watchSlidesProgress) {
        updateActiveIndex(s);
    }
    if (s.freeMode) {
        // Velocity
        if (velocities.length === 0) {
            velocities.push({
                position: ((s._touches))[isHorizontal(s) ? 'startX' : 'startY'],
                time: touchStartTime
            });
        }
        velocities.push({
            position: ((s._touches))[isHorizontal(s) ? 'currentX' : 'currentY'],
            time: (new Date()).getTime()
        });
    }
    // Update progress
    updateProgress(s, currentTranslate);
    // Update translate
    setWrapperTranslate(s, plt, currentTranslate);
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?} ev
 * @return {?}
 */
function onTouchEnd(s, plt, ev) {
    (void 0) /* console.debug */;
    if (ev.originalEvent) {
        ev = ev.originalEvent;
    }
    s.originalEvent = ev;
    if (allowTouchCallbacks) {
        s.ionSlideTouchEnd.emit(ev);
    }
    allowTouchCallbacks = false;
    if (!isTouched)
        return;
    // Time diff
    var /** @type {?} */ touchEndTime = Date.now();
    var /** @type {?} */ timeDiff = touchEndTime - touchStartTime;
    // Tap, doubleTap, Click
    if (s._allowClick) {
        updateClickedSlide(s, plt, ev);
        s._zone.run(function () {
            s.ionSlideTap.emit(s);
            if (timeDiff < 300 && (touchEndTime - lastClickTime) > 300) {
                if (clickTimeout) {
                    plt.cancelTimeout(clickTimeout);
                }
                clickTimeout = plt.timeout(function () {
                    if (!s)
                        return;
                    if (s.paginationHide && s._paginationContainer && !((ev.target)).classList.contains(CLS.bullet)) {
                        s._paginationContainer.classList.toggle(CLS.paginationHidden);
                    }
                }, 300);
            }
            if (timeDiff < 300 && (touchEndTime - lastClickTime) < 300) {
                if (clickTimeout)
                    clearTimeout(clickTimeout);
                s.ionSlideDoubleTap.emit(s);
            }
        });
    }
    lastClickTime = Date.now();
    plt.timeout(function () {
        if (s) {
            s._allowClick = true;
        }
    });
    if (!isTouched || !isMoved || !s.swipeDirection || s._touches.diff === 0 || currentTranslate === startTranslate) {
        isTouched = isMoved = false;
        return;
    }
    isTouched = isMoved = false;
    var /** @type {?} */ currentPos;
    if (s.followFinger) {
        currentPos = s._rtl ? s._translate : -s._translate;
    }
    else {
        currentPos = -currentTranslate;
    }
    if (s.freeMode) {
        if (currentPos < -minTranslate(s)) {
            slideTo(s, plt, s._activeIndex);
            return;
        }
        else if (currentPos > -maxTranslate(s)) {
            if (s._slides.length < s._snapGrid.length) {
                slideTo(s, plt, s._snapGrid.length - 1);
            }
            else {
                slideTo(s, plt, s._slides.length - 1);
            }
            return;
        }
        if (s.freeModeMomentum) {
            if (velocities.length > 1) {
                var /** @type {?} */ lastMoveEvent = velocities.pop(), /** @type {?} */ velocityEvent = velocities.pop();
                var /** @type {?} */ distance = lastMoveEvent.position - velocityEvent.position;
                var /** @type {?} */ time = lastMoveEvent.time - velocityEvent.time;
                s.velocity = distance / time;
                s.velocity = s.velocity / 2;
                if (Math.abs(s.velocity) < s.freeModeMinimumVelocity) {
                    s.velocity = 0;
                }
                // this implies that the user stopped moving a finger then released.
                // There would be no events with distance zero, so the last event is stale.
                if (time > 150 || (new Date().getTime() - lastMoveEvent.time) > 300) {
                    s.velocity = 0;
                }
            }
            else {
                s.velocity = 0;
            }
            s.velocity = s.velocity * s.freeModeMomentumVelocityRatio;
            velocities.length = 0;
            var /** @type {?} */ momentumDuration = 1000 * s.freeModeMomentumRatio;
            var /** @type {?} */ momentumDistance = s.velocity * momentumDuration;
            var /** @type {?} */ newPosition = s._translate + momentumDistance;
            if (s._rtl)
                newPosition = -newPosition;
            var /** @type {?} */ doBounce = false;
            var /** @type {?} */ afterBouncePosition;
            var /** @type {?} */ bounceAmount = Math.abs(s.velocity) * 20 * s.freeModeMomentumBounceRatio;
            if (newPosition < maxTranslate(s)) {
                if (s.freeModeMomentumBounce) {
                    if (newPosition + maxTranslate(s) < -bounceAmount) {
                        newPosition = maxTranslate(s) - bounceAmount;
                    }
                    afterBouncePosition = maxTranslate(s);
                    doBounce = true;
                    allowMomentumBounce = true;
                }
                else {
                    newPosition = maxTranslate(s);
                }
            }
            else if (newPosition > minTranslate(s)) {
                if (s.freeModeMomentumBounce) {
                    if (newPosition - minTranslate(s) > bounceAmount) {
                        newPosition = minTranslate(s) + bounceAmount;
                    }
                    afterBouncePosition = minTranslate(s);
                    doBounce = true;
                    allowMomentumBounce = true;
                }
                else {
                    newPosition = minTranslate(s);
                }
            }
            else if (s.freeModeSticky) {
                var /** @type {?} */ j = 0;
                var /** @type {?} */ nextSlide;
                for (j = 0; j < s._snapGrid.length; j += 1) {
                    if (s._snapGrid[j] > -newPosition) {
                        nextSlide = j;
                        break;
                    }
                }
                if (Math.abs(s._snapGrid[nextSlide] - newPosition) < Math.abs(s._snapGrid[nextSlide - 1] - newPosition) || s.swipeDirection === 'next') {
                    newPosition = s._snapGrid[nextSlide];
                }
                else {
                    newPosition = s._snapGrid[nextSlide - 1];
                }
                if (!s._rtl)
                    newPosition = -newPosition;
            }
            // Fix duration
            if (s.velocity !== 0) {
                if (s._rtl) {
                    momentumDuration = Math.abs((-newPosition - s._translate) / s.velocity);
                }
                else {
                    momentumDuration = Math.abs((newPosition - s._translate) / s.velocity);
                }
            }
            else if (s.freeModeSticky) {
                slideReset(s, plt);
                return;
            }
            if (s.freeModeMomentumBounce && doBounce) {
                updateProgress(s, afterBouncePosition);
                setWrapperTransition(s, plt, momentumDuration);
                setWrapperTranslate(s, plt, newPosition);
                onTransitionStart(s);
                s._animating = true;
                plt.transitionEnd(s._wrapper, function () {
                    if (!s || !allowMomentumBounce)
                        return;
                    setWrapperTransition(s, plt, s.speed);
                    setWrapperTranslate(s, plt, afterBouncePosition);
                    plt.transitionEnd(s._wrapper, function () {
                        if (!s)
                            return;
                        onTransitionEnd(s, plt);
                    });
                });
            }
            else if (s.velocity) {
                updateProgress(s, newPosition);
                setWrapperTransition(s, plt, momentumDuration);
                setWrapperTranslate(s, plt, newPosition);
                onTransitionStart(s);
                if (!s._animating) {
                    s._animating = true;
                    plt.transitionEnd(s._wrapper, function () {
                        if (!s)
                            return;
                        onTransitionEnd(s, plt);
                    });
                }
            }
            else {
                updateProgress(s, newPosition);
            }
            updateActiveIndex(s);
        }
        if (!s.freeModeMomentum || timeDiff >= s.longSwipesMs) {
            updateProgress(s);
            updateActiveIndex(s);
        }
        return;
    }
    // Find current slide
    var /** @type {?} */ stopIndex = 0;
    var /** @type {?} */ groupSize = s._slidesSizesGrid[0];
    for (var /** @type {?} */ i = 0; i < s._slidesGrid.length; i += s.slidesPerGroup) {
        if (typeof s._slidesGrid[i + s.slidesPerGroup] !== 'undefined') {
            if (currentPos >= s._slidesGrid[i] && currentPos < s._slidesGrid[i + s.slidesPerGroup]) {
                stopIndex = i;
                groupSize = s._slidesGrid[i + s.slidesPerGroup] - s._slidesGrid[i];
            }
        }
        else {
            if (currentPos >= s._slidesGrid[i]) {
                stopIndex = i;
                groupSize = s._slidesGrid[s._slidesGrid.length - 1] - s._slidesGrid[s._slidesGrid.length - 2];
            }
        }
    }
    // Find current slide size
    var /** @type {?} */ ratio = (currentPos - s._slidesGrid[stopIndex]) / groupSize;
    if (timeDiff > s.longSwipesMs) {
        // Long touches
        if (!s.longSwipes) {
            slideTo(s, plt, s._activeIndex);
            return;
        }
        if (s.swipeDirection === 'next') {
            if (ratio >= s.longSwipesRatio) {
                slideTo(s, plt, stopIndex + s.slidesPerGroup);
            }
            else {
                slideTo(s, plt, stopIndex);
            }
        }
        if (s.swipeDirection === 'prev') {
            if (ratio > (1 - s.longSwipesRatio)) {
                slideTo(s, plt, stopIndex + s.slidesPerGroup);
            }
            else {
                slideTo(s, plt, stopIndex);
            }
        }
    }
    else {
        // Short swipes
        if (!s.shortSwipes) {
            slideTo(s, plt, s._activeIndex);
            return;
        }
        if (s.swipeDirection === 'next') {
            slideTo(s, plt, stopIndex + s.slidesPerGroup);
        }
        if (s.swipeDirection === 'prev') {
            slideTo(s, plt, stopIndex);
        }
    }
}
/*=========================
  Resize Handler
  ===========================*/
var /** @type {?} */ resizeId;
/**
 * @param {?} s
 * @param {?} plt
 * @param {?} forceUpdatePagination
 * @return {?}
 */
function onResize(s, plt, forceUpdatePagination) {
    // TODO: hacky, we should use Resize Observer in the future
    if (resizeId) {
        plt.cancelTimeout(resizeId);
        resizeId = null;
    }
    resizeId = plt.timeout(function () { return doResize(s, plt, forceUpdatePagination); }, 200);
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?} forceUpdatePagination
 * @return {?}
 */
function doResize(s, plt, forceUpdatePagination) {
    resizeId = null;
    // Disable locks on resize
    var /** @type {?} */ allowSwipeToPrev = s._allowSwipeToPrev;
    var /** @type {?} */ allowSwipeToNext = s._allowSwipeToNext;
    s._allowSwipeToPrev = s._allowSwipeToNext = true;
    updateContainerSize(s, plt);
    updateSlidesSize(s, plt);
    if (s.slidesPerView === 'auto' || s.freeMode || forceUpdatePagination) {
        updatePagination(s);
    }
    if (s._spline) {
        s._spline = undefined;
    }
    var /** @type {?} */ slideChangedBySlideTo = false;
    if (s.freeMode) {
        var /** @type {?} */ newTranslate = Math.min(Math.max(s._translate, maxTranslate(s)), minTranslate(s));
        setWrapperTranslate(s, plt, newTranslate);
        updateActiveIndex(s);
        updateClasses(s);
        if (s.autoHeight) {
            updateAutoHeight(s);
        }
    }
    else {
        updateClasses(s);
        if ((s.slidesPerView === 'auto' || s.slidesPerView > 1) && s._isEnd && !s.centeredSlides) {
            slideChangedBySlideTo = slideTo(s, plt, s._slides.length - 1, 0, false, true);
        }
        else {
            slideChangedBySlideTo = slideTo(s, plt, s._activeIndex, 0, false, true);
        }
    }
    // Return locks after resize
    s._allowSwipeToPrev = allowSwipeToPrev;
    s._allowSwipeToNext = allowSwipeToNext;
}
//# sourceMappingURL=swiper-events.js.map