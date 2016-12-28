import { Slides } from '../slides';
import { SlideUIEvent, SlideElement } from './swiper-interfaces';
import { maxTranslate, minTranslate, isFormElement, isHorizontal, getElementIndex, triggerTransitionEnd } from './swiper-utils';
import { getWrapperTranslate, setWrapperTranslate, setWrapperTransition } from './swiper-transition';
import { currentSlidesPerView, fixLoop, slideNext, slidePrev, slideTo, slideReset, setBreakpoint, stopAutoplay, pauseAutoplay, updateAutoHeight, updateContainerSize, updatePagination, updateSlidesSize, onTransitionStart, onTransitionEnd } from './swiper';
import { updateProgress } from './swiper-progress';
import { updateActiveIndex } from './swiper-index';
import { updateClasses } from './swiper-classes';
import { Platform } from '../../../platform/platform';


/*=========================
  Events
  ===========================*/

// Attach/detach events
export function initEvents(s: Slides, plt: Platform): Function {
  let unregs: Function[] = [];

  const touchEventsTarget = s.params.touchEventsTarget === 'container' ? s.container : s.wrapper;
  const moveCapture = s.params.nested ? true : false;

  // Touch Events
  if (s.supportTouch) {
    // touchstart
    plt.addListener(touchEventsTarget, s.touchEvents.start, (ev: SlideUIEvent) => {
      onTouchStart(s, plt, ev);
    }, { passive: true, zone: false }, unregs);

    // touchmove
    plt.addListener(touchEventsTarget, s.touchEvents.move, (ev: SlideUIEvent) => {
      onTouchMove(s, plt, ev);
    }, { passive: true, zone: false, capture: moveCapture }, unregs);

    // touchend
    plt.addListener(touchEventsTarget, s.touchEvents.end, (ev: SlideUIEvent) => {
      onTouchEnd(s, plt, ev);
    }, { passive: true, zone: false }, unregs);
  }

  if ((s.params.simulateTouch && !plt.is('ios') && !plt.is('android')) || (s.params.simulateTouch && !s.supportTouch && plt.is('ios'))) {
    // mousedown
    plt.addListener(touchEventsTarget, 'mousedown', (ev: SlideUIEvent) => {
      onTouchStart(s, plt, ev);
    }, { zone: false }, unregs);

    // mousemove
    plt.addListener(plt.doc(), 'mousemove', (ev: SlideUIEvent) => {
      onTouchStart(s, plt, ev);
    }, { zone: false, capture: moveCapture }, unregs);

    // mouseup
    plt.addListener(plt.doc(), 'mouseup', (ev: SlideUIEvent) => {
      onTouchStart(s, plt, ev);
    }, { zone: false }, unregs);
  }

  // onresize
  unregs.push(plt.onResize(() => {
    onResize(s, plt, false);
  }));

  // Next, Prev, Index
  if (s.params.nextButton && s.nextButton) {
    plt.addListener(s.nextButton, 'click', (ev) => {
      onClickNext(s, plt, ev);
    }, { zone: false }, unregs);
  }

  if (s.params.prevButton && s.prevButton) {
    plt.addListener(s.prevButton, 'click', (ev) => {
      onClickPrev(s, plt, ev);
    }, { zone: false }, unregs);
  }

  // if (s.params.pagination && s.params.paginationClickable) {
  //   plt.addListener(s.prevButton, 'click', (ev) => {
  //     onClickIndex(s, plt, ev);
  //   }, { zone: false }, unregs);

  //   s.paginationContainer[actionDom]('click', '.' + s.params.bulletClass, s.onClickIndex);
  //   if (s.params.a11y) s.paginationContainer[actionDom]('keydown', '.' + s.params.bulletClass, s.a11y.onEnterKey);
  // }

  // Prevent Links Clicks
  if (s.params.preventClicks || s.params.preventClicksPropagation) {
    plt.addListener(touchEventsTarget, 'click', (ev) => {
      preventClicks(s, ev);
    }, { zone: false, capture: true }, unregs);
  }

  return function() {
    unregs.forEach(unreg => {
      unreg();
    });
    unregs = null;
  };
}

/*=========================
  Handle Clicks
  ===========================*/
// Prevent Clicks

function preventClicks(s: Slides, e: UIEvent) {
  if (!s.allowClick) {
    if (s.params.preventClicks) {
      e.preventDefault();
    }
    if (s.params.preventClicksPropagation && s.animating) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
}


// Clicks
function onClickNext(s: Slides, plt: Platform, e: UIEvent) {
  e.preventDefault();
  if (s.isEnd && !s.params.loop) {
    return;
  }
  slideNext(s, plt);
}

function onClickPrev(s: Slides, plt: Platform, e: UIEvent) {
  e.preventDefault();
  if (s.isBeginning && !s.params.loop) {
    return;
  }
  slidePrev(s, plt);
}

// function onClickIndex(s: Slides, plt: Platform, index: number, e: UIEvent) {
//   e.preventDefault();
//   if (s.params.loop) {
//     index = index + s.loopedSlides;
//   }
//   slideTo(s, plt, index);
// }


/*=========================
  Handle Touches
  ===========================*/
function findElementInEvent(e: SlideUIEvent, selector: any) {
  var el = <HTMLElement>e.target;
  if (!el.matches(selector)) {
    if (typeof selector === 'string') {
      el = <HTMLElement>el.closest(selector);

    } else if (selector.nodeType) {
      var parentEl = el.parentElement;
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


function updateClickedSlide(s: Slides, plt: Platform, e: SlideUIEvent) {
  var slide: SlideElement = <any>findElementInEvent(e, '.' + s.params.slideClass);
  var slideIndex = -1;

  if (slide) {
    for (var i = 0; i < s.slides.length; i++) {
      if (s.slides[i] === slide) {
        slideIndex = i;
        break;
      }
    }
  }

  if (slide && slideIndex > -1) {
    s.clickedSlide = slide;
    s.clickedIndex = slideIndex;

  } else {
    s.clickedSlide = undefined;
    s.clickedIndex = undefined;
    return;
  }

  if (s.params.slideToClickedSlide && s.clickedIndex !== undefined && s.clickedIndex !== s.activeIndex) {
    var slideToIndex = s.clickedIndex;
    var realIndex;
    var slidesPerView = s.params.slidesPerView === 'auto' ? currentSlidesPerView(s) : s.params.slidesPerView;

    if (s.params.loop) {
      if (s.animating) return;

      realIndex = parseInt(s.clickedSlide.getAttribute('data-swiper-slide-index'), 10);

      if (s.params.centeredSlides) {
        if ((slideToIndex < s.loopedSlides - slidesPerView / 2) || (slideToIndex > s.slides.length - s.loopedSlides + slidesPerView / 2)) {
          fixLoop(s, plt);

          slideToIndex = getElementIndex(s.wrapper.querySelector('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.' + s.params.slideDuplicateClass + ')'));

          plt.timeout(() => {
            slideTo(s, plt, slideToIndex);
          });

        } else {
          slideTo(s, plt, slideToIndex);
        }

      } else {
        if (slideToIndex > s.slides.length - slidesPerView) {
          fixLoop(s, plt);

          slideToIndex = getElementIndex(s.wrapper.querySelector('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.' + s.params.slideDuplicateClass + ')'));

          plt.timeout(() => {
            slideTo(s, plt, slideToIndex);
          });

        } else {
          slideTo(s, plt, slideToIndex);
        }
      }

    } else {
      slideTo(s, plt, slideToIndex);
    }
  }
}

var isTouched,
  isMoved,
  allowTouchCallbacks,
  touchStartTime,
  isScrolling,
  currentTranslate,
  startTranslate,
  allowThresholdMove,
  // Last click time
  lastClickTime = Date.now(), clickTimeout,
  // Velocities
  velocities = [],
  allowMomentumBounce;


// Touch handlers
var isTouchEvent, startMoving;

function onTouchStart(s: Slides, plt: Platform, e: SlideUIEvent) {
  if (e.originalEvent) e = e.originalEvent;
  isTouchEvent = e.type === 'touchstart';

  if (!isTouchEvent && 'which' in e && e.which === 3) return;
  if (s.params.noSwiping && findElementInEvent(e, '.' + s.params.noSwipingClass)) {
    s.allowClick = true;
    return;
  }
  if (s.params.swipeHandler) {
    if (!findElementInEvent(e, s.params.swipeHandler)) return;
  }

  var startX = s.touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
  var startY = s.touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;

  // Do NOT start if iOS edge swipe is detected. Otherwise iOS app (UIWebView) cannot swipe-to-go-back anymore
  if (plt.is('ios') && s.params.iOSEdgeSwipeDetection && startX <= s.params.iOSEdgeSwipeThreshold) {
    return;
  }

  isTouched = true;
  isMoved = false;
  allowTouchCallbacks = true;
  isScrolling = undefined;
  startMoving = undefined;
  s.touches.startX = startX;
  s.touches.startY = startY;
  touchStartTime = Date.now();
  s.allowClick = true;
  updateContainerSize(s);
  s.swipeDirection = undefined;

  if (s.params.threshold > 0) {
    allowThresholdMove = false;
  }

  if (e.type !== 'touchstart') {
    var preventDefault = true;
    if (isFormElement(e.target)) {
      preventDefault = false;
    }

    plt.focusOutActiveElement();

    if (preventDefault) {
      e.preventDefault();
    }
  }

  s.ionTouchStart.emit(e);
}


function onTouchMove(s: Slides, plt: Platform, e: SlideUIEvent) {
  if (e.originalEvent) e = e.originalEvent;
  if (isTouchEvent && e.type === 'mousemove') return;
  if (e.preventedByNestedSwiper) {
    s.touches.startX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
    s.touches.startY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
    return;
  }
  if (s.params.onlyExternal) {
    // isMoved = true;
    s.allowClick = false;
    if (isTouched) {
      s.touches.startX = s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
      s.touches.startY = s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
      touchStartTime = Date.now();
    }
    return;
  }

  if (isTouchEvent && s.params.touchReleaseOnEdges && !s.params.loop) {
    if (!isHorizontal(s)) {
      // Vertical
      if (
        (s.touches.currentY < s.touches.startY && s.translate <= maxTranslate(s)) ||
        (s.touches.currentY > s.touches.startY && s.translate >= minTranslate(s))
        ) {
        return;
      }
    } else {
      if (
        (s.touches.currentX < s.touches.startX && s.translate <= maxTranslate(s)) ||
        (s.touches.currentX > s.touches.startX && s.translate >= minTranslate(s))
        ) {
        return;
      }
    }
  }

  const activeEle = plt.getActiveElement();
  if (isTouchEvent && activeEle) {
    if (e.target === activeEle && isFormElement(e.target)) {
      isMoved = true;
      s.allowClick = false;
      return;
    }
  }

  if (allowTouchCallbacks) {
    s.ionTouchMove.emit(e);
  }

  if (e.targetTouches && e.targetTouches.length > 1) return;

  s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
  s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

  if (typeof isScrolling === 'undefined') {
    var touchAngle;
    if (isHorizontal(s) && s.touches.currentY === s.touches.startY || !isHorizontal(s) && s.touches.currentX === s.touches.startX) {
      isScrolling = false;
    } else {
      touchAngle = Math.atan2(Math.abs(s.touches.currentY - s.touches.startY), Math.abs(s.touches.currentX - s.touches.startX)) * 180 / Math.PI;
      isScrolling = isHorizontal(s) ? touchAngle > s.params.touchAngle : (90 - touchAngle > s.params.touchAngle);
    }
  }

  if (isScrolling) {
    s.ionTouchMoveOpposite.emit(e);
  }

  if (!isTouched) return;
  if (isScrolling)  {
    isTouched = false;
    return;
  }

  s.allowClick = false;
  s.ionSliderMove.emit(e);
  e.preventDefault();

  if (s.params.touchMoveStopPropagation && !s.params.nested) {
    e.stopPropagation();
  }

  if (!isMoved) {
    if (s.params.loop) {
      fixLoop(s, plt);
    }

    startTranslate = getWrapperTranslate(s, plt);
    setWrapperTransition(s, plt, 0);

    if (s.animating) {
      triggerTransitionEnd(plt, s.wrapper);
    }

    if (s.params.autoplay && s.autoplaying) {
      if (s.params.autoplayDisableOnInteraction) {
        stopAutoplay(s);
      } else {
        pauseAutoplay(s, plt);
      }
    }
    allowMomentumBounce = false;
  }
  isMoved = true;

  var diff = s.touches.diff = isHorizontal(s) ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;

  diff = diff * s.params.touchRatio;
  if (s.rtl) diff = -diff;

  s.swipeDirection = diff > 0 ? 'prev' : 'next';
  currentTranslate = diff + startTranslate;

  var disableParentSwiper = true;
  if ((diff > 0 && currentTranslate > minTranslate(s))) {
    disableParentSwiper = false;
    if (s.params.resistance) {
      currentTranslate = minTranslate(s) - 1 + Math.pow(-minTranslate(s) + startTranslate + diff, s.params.resistanceRatio);
    }

  } else if (diff < 0 && currentTranslate < maxTranslate(s)) {
    disableParentSwiper = false;
    if (s.params.resistance) currentTranslate = maxTranslate(s) + 1 - Math.pow(maxTranslate(s) - startTranslate - diff, s.params.resistanceRatio);
  }

  if (disableParentSwiper) {
    e.preventedByNestedSwiper = true;
  }

  // Directions locks
  if (!s.params.allowSwipeToNext && s.swipeDirection === 'next' && currentTranslate < startTranslate) {
    currentTranslate = startTranslate;
  }
  if (!s.params.allowSwipeToPrev && s.swipeDirection === 'prev' && currentTranslate > startTranslate) {
    currentTranslate = startTranslate;
  }


  // Threshold
  if (s.params.threshold > 0) {
    if (Math.abs(diff) > s.params.threshold || allowThresholdMove) {
      if (!allowThresholdMove) {
        allowThresholdMove = true;
        s.touches.startX = s.touches.currentX;
        s.touches.startY = s.touches.currentY;
        currentTranslate = startTranslate;
        s.touches.diff = isHorizontal(s) ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
        return;
      }
    } else {
      currentTranslate = startTranslate;
      return;
    }
  }

  if (!s.params.followFinger) return;

  // Update active index in free mode
  if (s.params.freeMode || s.params.watchSlidesProgress) {
    updateActiveIndex(s);
  }
  if (s.params.freeMode) {
    // Velocity
    if (velocities.length === 0) {
      velocities.push({
        position: s.touches[isHorizontal(s) ? 'startX' : 'startY'],
        time: touchStartTime
      });
    }
    velocities.push({
      position: s.touches[isHorizontal(s) ? 'currentX' : 'currentY'],
      time: (new Date()).getTime()
    });
  }
  // Update progress
  updateProgress(currentTranslate);

  // Update translate
  setWrapperTranslate(s, plt, currentTranslate);
}


function onTouchEnd(s: Slides, plt: Platform, e: SlideUIEvent) {
  if (e.originalEvent) e = e.originalEvent;
  if (allowTouchCallbacks) {
    s.ionTouchEnd.emit(e);
  }

  allowTouchCallbacks = false;
  if (!isTouched) return;

  // Time diff
  var touchEndTime = Date.now();
  var timeDiff = touchEndTime - touchStartTime;

  // Tap, doubleTap, Click
  if (s.allowClick) {
    updateClickedSlide(s, plt, e);
    s.ionTap.emit(e);

    if (timeDiff < 300 && (touchEndTime - lastClickTime) > 300) {
      if (clickTimeout) {
        plt.cancelTimeout(clickTimeout);
      }

      clickTimeout = plt.timeout(() => {
        if (!s) return;
        if (s.params.paginationHide && s.paginationContainer && !(<HTMLElement>e.target).classList.contains(s.params.bulletClass)) {
          s.paginationContainer.classList.toggle(s.params.paginationHiddenClass);
        }
        s.ionClick.emit(e);
      }, 300);

    }
    if (timeDiff < 300 && (touchEndTime - lastClickTime) < 300) {
      if (clickTimeout) clearTimeout(clickTimeout);
      s.ionDoubleTap.emit(e);
    }
  }

  lastClickTime = Date.now();
  plt.timeout(() => {
    if (s) {
      s.allowClick = true;
    }
  });

  if (!isTouched || !isMoved || !s.swipeDirection || s.touches.diff === 0 || currentTranslate === startTranslate) {
    isTouched = isMoved = false;
    return;
  }
  isTouched = isMoved = false;

  var currentPos;
  if (s.params.followFinger) {
    currentPos = s.rtl ? s.translate : -s.translate;
  } else {
    currentPos = -currentTranslate;
  }
  if (s.params.freeMode) {
    if (currentPos < -minTranslate(s)) {
      slideTo(s, plt, s.activeIndex);
      return;

    } else if (currentPos > -maxTranslate(s)) {
      if (s.slides.length < s.snapGrid.length) {
        slideTo(s, plt, s.snapGrid.length - 1);
      } else {
        slideTo(s, plt, s.slides.length - 1);
      }
      return;
    }

    if (s.params.freeModeMomentum) {
      if (velocities.length > 1) {
        var lastMoveEvent = velocities.pop(), velocityEvent = velocities.pop();

        var distance = lastMoveEvent.position - velocityEvent.position;
        var time = lastMoveEvent.time - velocityEvent.time;
        s.velocity = distance / time;
        s.velocity = s.velocity / 2;
        if (Math.abs(s.velocity) < s.params.freeModeMinimumVelocity) {
          s.velocity = 0;
        }
        // this implies that the user stopped moving a finger then released.
        // There would be no events with distance zero, so the last event is stale.
        if (time > 150 || (new Date().getTime() - lastMoveEvent.time) > 300) {
          s.velocity = 0;
        }
      } else {
        s.velocity = 0;
      }
      s.velocity = s.velocity * s.params.freeModeMomentumVelocityRatio;

      velocities.length = 0;
      var momentumDuration = 1000 * s.params.freeModeMomentumRatio;
      var momentumDistance = s.velocity * momentumDuration;

      var newPosition = s.translate + momentumDistance;
      if (s.rtl) newPosition = - newPosition;
      var doBounce = false;
      var afterBouncePosition;
      var bounceAmount = Math.abs(s.velocity) * 20 * s.params.freeModeMomentumBounceRatio;

      if (newPosition < maxTranslate(s)) {
        if (s.params.freeModeMomentumBounce) {
          if (newPosition + maxTranslate(s) < -bounceAmount) {
            newPosition = maxTranslate(s) - bounceAmount;
          }
          afterBouncePosition = maxTranslate(s);
          doBounce = true;
          allowMomentumBounce = true;
        } else {
          newPosition = maxTranslate(s);
        }

      } else if (newPosition > minTranslate(s)) {
        if (s.params.freeModeMomentumBounce) {
          if (newPosition - minTranslate(s) > bounceAmount) {
            newPosition = minTranslate(s) + bounceAmount;
          }
          afterBouncePosition = minTranslate(s);
          doBounce = true;
          allowMomentumBounce = true;
        } else {
          newPosition = minTranslate(s);
        }

      } else if (s.params.freeModeSticky) {
        var j = 0,
          nextSlide;
        for (j = 0; j < s.snapGrid.length; j += 1) {
          if (s.snapGrid[j] > -newPosition) {
            nextSlide = j;
            break;
          }

        }
        if (Math.abs(s.snapGrid[nextSlide] - newPosition) < Math.abs(s.snapGrid[nextSlide - 1] - newPosition) || s.swipeDirection === 'next') {
          newPosition = s.snapGrid[nextSlide];
        } else {
          newPosition = s.snapGrid[nextSlide - 1];
        }
        if (!s.rtl) newPosition = - newPosition;
      }

      // Fix duration
      if (s.velocity !== 0) {
        if (s.rtl) {
          momentumDuration = Math.abs((-newPosition - s.translate) / s.velocity);
        } else {
          momentumDuration = Math.abs((newPosition - s.translate) / s.velocity);
        }

      } else if (s.params.freeModeSticky) {
        slideReset(s, plt);
        return;
      }

      if (s.params.freeModeMomentumBounce && doBounce) {
        updateProgress(afterBouncePosition);
        setWrapperTransition(s, plt, momentumDuration);
        setWrapperTranslate(s, plt, newPosition);

        onTransitionStart(s);
        s.animating = true;

        plt.transitionEnd(s.wrapper, () => {
          if (!s || !allowMomentumBounce) return;

          setWrapperTransition(s, plt, s.params.speed);
          setWrapperTranslate(s, plt, afterBouncePosition);

          plt.transitionEnd(s.wrapper, () => {
            if (!s) return;
            onTransitionEnd(s, plt);
          });
        });

      } else if (s.velocity) {
        updateProgress(s, newPosition);
        setWrapperTransition(s, plt, momentumDuration);
        setWrapperTranslate(s, plt, newPosition);

        onTransitionStart(s);

        if (!s.animating) {
          s.animating = true;
          plt.transitionEnd(s.wrapper, () => {
            if (!s) return;
            onTransitionEnd(s, plt);
          });
        }

      } else {
        updateProgress(s, newPosition);
      }

      updateActiveIndex(s);
    }

    if (!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs) {
      updateProgress(s);
      updateActiveIndex(s);
    }
    return;
  }

  // Find current slide
  var i, stopIndex = 0, groupSize = s.slidesSizesGrid[0];
  for (i = 0; i < s.slidesGrid.length; i += s.params.slidesPerGroup) {
    if (typeof s.slidesGrid[i + s.params.slidesPerGroup] !== 'undefined') {
      if (currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup]) {
        stopIndex = i;
        groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i];
      }
    } else {
      if (currentPos >= s.slidesGrid[i]) {
        stopIndex = i;
        groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2];
      }
    }
  }

  // Find current slide size
  var ratio = (currentPos - s.slidesGrid[stopIndex]) / groupSize;

  if (timeDiff > s.params.longSwipesMs) {
    // Long touches
    if (!s.params.longSwipes) {
      slideTo(s, plt, s.activeIndex);
      return;
    }

    if (s.swipeDirection === 'next') {
      if (ratio >= s.params.longSwipesRatio) {
        slideTo(s, plt, stopIndex + s.params.slidesPerGroup);
      } else {
        slideTo(s, plt, stopIndex);
      }
    }

    if (s.swipeDirection === 'prev') {
      if (ratio > (1 - s.params.longSwipesRatio)) {
        slideTo(s, plt, stopIndex + s.params.slidesPerGroup);
      } else {
        slideTo(s, plt, stopIndex);
      }
    }

  } else {
    // Short swipes
    if (!s.params.shortSwipes) {
      slideTo(s, plt, s.activeIndex);
      return;
    }

    if (s.swipeDirection === 'next') {
      slideTo(s, plt, stopIndex + s.params.slidesPerGroup);
    }

    if (s.swipeDirection === 'prev') {
      slideTo(s, plt, stopIndex);
    }
  }
}


/*=========================
  Resize Handler
  ===========================*/
function onResize(s: Slides, plt: Platform, forceUpdatePagination: boolean) {
  // Breakpoints
  if (s.params.breakpoints) {
    setBreakpoint(s, plt);
  }

  // Disable locks on resize
  var allowSwipeToPrev = s.params.allowSwipeToPrev;
  var allowSwipeToNext = s.params.allowSwipeToNext;
  s.params.allowSwipeToPrev = s.params.allowSwipeToNext = true;

  updateContainerSize(s);
  updateSlidesSize(s);

  if (s.params.slidesPerView === 'auto' || s.params.freeMode || forceUpdatePagination) {
    updatePagination(s);
  }

  var slideChangedBySlideTo = false;
  if (s.params.freeMode) {
    var newTranslate = Math.min(Math.max(s.translate, maxTranslate(s)), minTranslate(s));
    setWrapperTranslate(s, plt, newTranslate);
    updateActiveIndex(s);
    updateClasses(s);

    if (s.params.autoHeight) {
      updateAutoHeight(s);
    }

  } else {
    updateClasses(s);

    if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
      slideChangedBySlideTo = slideTo(s, plt, s.slides.length - 1, 0, false, true);
    } else {
      slideChangedBySlideTo = slideTo(s, plt, s.activeIndex, 0, false, true);
    }
  }

  // Return locks after resize
  s.params.allowSwipeToPrev = allowSwipeToPrev;
  s.params.allowSwipeToNext = allowSwipeToNext;
}
