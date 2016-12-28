import { Slides } from '../slides';
import { Platform } from '../../../platform/platform';
import { isHorizontal, offset } from './swiper-utils';
import { slideNext, slidePrev } from './swiper';


/*=========================
  Keyboard Control
  ===========================*/
function handleKeyboard(s: Slides, plt: Platform, e: KeyboardEvent) {
  var win = plt.win();

  var kc = e.keyCode || e.charCode;
  // Directions locks
  if (!s.params.allowSwipeToNext && (isHorizontal(s) && kc === 39 || !isHorizontal(s) && kc === 40)) {
    return false;
  }

  if (!s.params.allowSwipeToPrev && (isHorizontal(s) && kc === 37 || !isHorizontal(s) && kc === 38)) {
    return false;
  }

  if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
    return;
  }

  var activeEle = plt.getActiveElement();
  if (activeEle && activeEle.nodeName && (activeEle.nodeName.toLowerCase() === 'input' || activeEle.nodeName.toLowerCase() === 'textarea')) {
    return;
  }

  if (kc === 37 || kc === 39 || kc === 38 || kc === 40) {
    var inView = false;
    // Check that swiper should be inside of visible area of window
    if (s.container.closest('.' + s.params.slideClass) && !s.container.closest('.' + s.params.slideActiveClass)) {
      return;
    }
    var windowScroll = {
      left: win.pageXOffset,
      top: win.pageYOffset
    };
    var windowWidth = plt.width();
    var windowHeight = plt.height();
    var swiperOffset = offset(s.container, plt);

    if (s.rtl) {
      swiperOffset.left = swiperOffset.left - s.container[0].scrollLeft;
    }

    var swiperCoord = [
      [swiperOffset.left, swiperOffset.top],
      [swiperOffset.left + s.width, swiperOffset.top],
      [swiperOffset.left, swiperOffset.top + s.height],
      [swiperOffset.left + s.width, swiperOffset.top + s.height]
    ];

    for (var i = 0; i < swiperCoord.length; i++) {
      var point = swiperCoord[i];
      if (
        point[0] >= windowScroll.left && point[0] <= windowScroll.left + windowWidth &&
        point[1] >= windowScroll.top && point[1] <= windowScroll.top + windowHeight
      ) {
        inView = true;
      }

    }
    if (!inView) return;
  }

  if (isHorizontal(s)) {
    if (kc === 37 || kc === 39) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }

    if ((kc === 39 && !s.rtl) || (kc === 37 && s.rtl)) {
      slideNext(s, plt);
    }

    if ((kc === 37 && !s.rtl) || (kc === 39 && s.rtl)) {
      slidePrev(s, plt);
    }

  } else {
    if (kc === 38 || kc === 40) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }

    if (kc === 40) {
      slideNext(s, plt);
    }

    if (kc === 38) {
      slidePrev(s, plt);
    }
  }
}

export function enableKeyboardControl(s: Slides, plt: Platform, shouldEnable: boolean) {
  s.params.keyboardControl = shouldEnable;

  if (shouldEnable && !s.keyboardUnReg) {
    s.keyboardUnReg = plt.addListener(plt.doc(), 'keydown', (ev: KeyboardEvent) => {
      handleKeyboard(s, plt, ev);
    }, { zone: false });

  } else if (!shouldEnable && s.keyboardUnReg) {
    s.keyboardUnReg();
  }
}
