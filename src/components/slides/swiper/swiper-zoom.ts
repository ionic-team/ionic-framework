import { Slides } from '../slides';
import { Platform } from '../../../platform/platform';
import { CLS, isHorizontal, offset, transform, transition } from './swiper-utils';
import { getTranslate } from './swiper-transition';
import { SlideElement } from './swiper-interfaces';


export function initZoom(s: Slides, plt: Platform) {
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

  return function() {
    detachZoomEvents(s);
  };
}


// Calc Scale From Multi-touches
function getDistanceBetweenTouches(ev: TouchEvent) {
  if (ev.targetTouches.length < 2) return 1;

  var x1 = ev.targetTouches[0].pageX,
    y1 = ev.targetTouches[0].pageY,
    x2 = ev.targetTouches[1].pageX,
    y2 = ev.targetTouches[1].pageY;

  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


// Events
function onGestureStart(s: Slides, _plt: Platform, ev: TouchEvent) {
  const z = s._zoom;
  s.originalEvent = ev;

  if (!s._supportGestures) {
    if (ev.type !== 'touchstart' || ev.type === 'touchstart' && ev.targetTouches.length < 2) {
      return;
    }
    z.gesture.scaleStart = getDistanceBetweenTouches(ev);
  }

  if (!z.gesture.slide) {
    if (ev.currentTarget && (<any>ev.currentTarget).classList.contains(CLS.slide)) {
      z.gesture.slide = <any>ev.currentTarget;
    }

    if (!z.gesture.slide) {
      z.gesture.slide = s._slides[s._activeIndex];
    }

    z.gesture.image = <HTMLElement>z.gesture.slide.querySelector('img, svg, canvas, ion-img');
    if (z.gesture.image) {
      z.gesture.imageWrap = <HTMLElement>z.gesture.image.closest('.' + CLS.zoomContainer);

      if (!z.gesture.imageWrap) {
        z.gesture.image = undefined;
        return;
      }

      z.gesture.zoomMax = parseInt(z.gesture.imageWrap.getAttribute('data-swiper-zoom') || <any>s.zoomMax, 10);
    }
  }

  transition(z.gesture.image, 0);
  z.isScaling = true;
}


function onGestureChange(s: Slides, _plt: Platform, ev: TouchEvent) {
  const z = s._zoom;
  s.originalEvent = ev;

  if (!s._supportGestures) {
    if (ev.type !== 'touchmove' || ev.type === 'touchmove' && ev.targetTouches.length < 2) {
      return;
    }
    z.gesture.scaleMove = getDistanceBetweenTouches(ev);
  }

  if (!z.gesture.image) return;

  if (s._supportGestures) {
    z.scale = (<any>ev).scale * z.currentScale;

  } else {
    z.scale = (z.gesture.scaleMove / z.gesture.scaleStart) * z.currentScale;
  }

  if (z.scale > z.gesture.zoomMax) {
    z.scale = z.gesture.zoomMax - 1 + Math.pow((z.scale - z.gesture.zoomMax + 1), 0.5);
  }

  if (z.scale < s.zoomMin) {
    z.scale =  s.zoomMin + 1 - Math.pow((s.zoomMin - z.scale + 1), 0.5);
  }

  transform(z.gesture.image, 'translate3d(0,0,0) scale(' + z.scale + ')');
}


function onGestureEnd(s: Slides, _plt: Platform, ev: TouchEvent) {
  const z = s._zoom;
  s.originalEvent = ev;

  if (!s._supportGestures) {
    if (ev.type !== 'touchend' || ev.type === 'touchend' && ev.changedTouches.length < 2) {
      return;
    }
  }

  if (!z.gesture.image) return;

  z.scale = Math.max(Math.min(z.scale, z.gesture.zoomMax), s.zoomMin);

  transition(z.gesture.image, s.speed);
  transform(z.gesture.image, 'translate3d(0,0,0) scale(' + z.scale + ')');

  z.currentScale = z.scale;
  z.isScaling = false;

  if (z.scale === 1) {
    z.gesture.slide = undefined;
  }
}


function onTouchStart(s: Slides, plt: Platform, ev: TouchEvent) {
  const z = s._zoom;
  s.originalEvent = ev;

  if (!z.gesture.image || z.image.isTouched) return;

  if (plt.is('android')) {
    ev.preventDefault();
  }

  z.image.isTouched = true;
  z.image.touchesStart.x = ev.type === 'touchstart' ? ev.targetTouches[0].pageX : (<any>ev).pageX;
  z.image.touchesStart.y = ev.type === 'touchstart' ? ev.targetTouches[0].pageY : (<any>ev).pageY;
}


function onTouchMove(s: Slides, plt: Platform, ev: TouchEvent) {
  const z = s._zoom;
  s.originalEvent = ev;

  if (!z.gesture.image) return;

  s._allowClick = false;

  if (!z.image.isTouched || !z.gesture.slide) return;

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
  var scaledWidth = z.image.width * z.scale;
  var scaledHeight = z.image.height * z.scale;

  if (scaledWidth < z.gesture.slideWidth && scaledHeight < z.gesture.slideHeight) {
    return;
  }

  z.image.minX = Math.min((z.gesture.slideWidth / 2 - scaledWidth / 2), 0);
  z.image.maxX = -z.image.minX;

  z.image.minY = Math.min((z.gesture.slideHeight / 2 - scaledHeight / 2), 0);
  z.image.maxY = -z.image.minY;

  z.image.touchesCurrent.x = ev.type === 'touchmove' ? ev.targetTouches[0].pageX : (<any>ev).pageX;
  z.image.touchesCurrent.y = ev.type === 'touchmove' ? ev.targetTouches[0].pageY : (<any>ev).pageY;

  if (!z.image.isMoved && !z.isScaling) {
    if (isHorizontal(s) &&
      (Math.floor(z.image.minX) === Math.floor(z.image.startX) && z.image.touchesCurrent.x < z.image.touchesStart.x) ||
      (Math.floor(z.image.maxX) === Math.floor(z.image.startX) && z.image.touchesCurrent.x > z.image.touchesStart.x)
      ) {
      z.image.isTouched = false;
      return;

    } else if (!isHorizontal(s) &&
      (Math.floor(z.image.minY) === Math.floor(z.image.startY) && z.image.touchesCurrent.y < z.image.touchesStart.y) ||
      (Math.floor(z.image.maxY) === Math.floor(z.image.startY) && z.image.touchesCurrent.y > z.image.touchesStart.y)
      ) {
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
    z.image.currentX =  z.image.minX + 1 - Math.pow((z.image.minX - z.image.currentX + 1), 0.8);
  }
  if (z.image.currentX > z.image.maxX) {
    z.image.currentX = z.image.maxX - 1 + Math.pow((z.image.currentX - z.image.maxX + 1), 0.8);
  }

  if (z.image.currentY < z.image.minY) {
    z.image.currentY =  z.image.minY + 1 - Math.pow((z.image.minY - z.image.currentY + 1), 0.8);
  }
  if (z.image.currentY > z.image.maxY) {
    z.image.currentY = z.image.maxY - 1 + Math.pow((z.image.currentY - z.image.maxY + 1), 0.8);
  }

  // Velocity
  if (!z.velocity.prevPositionX) z.velocity.prevPositionX = z.image.touchesCurrent.x;
  if (!z.velocity.prevPositionY) z.velocity.prevPositionY = z.image.touchesCurrent.y;
  if (!z.velocity.prevTime) z.velocity.prevTime = Date.now();

  z.velocity.x = (z.image.touchesCurrent.x - z.velocity.prevPositionX) / (Date.now() - z.velocity.prevTime) / 2;
  z.velocity.y = (z.image.touchesCurrent.y - z.velocity.prevPositionY) / (Date.now() - z.velocity.prevTime) / 2;

  if (Math.abs(z.image.touchesCurrent.x - z.velocity.prevPositionX) < 2) z.velocity.x = 0;
  if (Math.abs(z.image.touchesCurrent.y - z.velocity.prevPositionY) < 2) z.velocity.y = 0;

  z.velocity.prevPositionX = z.image.touchesCurrent.x;
  z.velocity.prevPositionY = z.image.touchesCurrent.y;
  z.velocity.prevTime = Date.now();

  transform(z.gesture.imageWrap, 'translate3d(' + z.image.currentX + 'px, ' + z.image.currentY + 'px,0)');
}


function onTouchEnd(s: Slides) {
  const z = s._zoom;

  if (!z.gesture.image) return;

  if (!z.image.isTouched || !z.image.isMoved) {
    z.image.isTouched = false;
    z.image.isMoved = false;
    return;
  }

  z.image.isTouched = false;
  z.image.isMoved = false;

  var momentumDurationX = 300;
  var momentumDurationY = 300;
  var momentumDistanceX = z.velocity.x * momentumDurationX;
  var newPositionX = z.image.currentX + momentumDistanceX;
  var momentumDistanceY = z.velocity.y * momentumDurationY;
  var newPositionY = z.image.currentY + momentumDistanceY;

  // Fix duration
  if (z.velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - z.image.currentX) / z.velocity.x);
  if (z.velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - z.image.currentY) / z.velocity.y);

  var momentumDuration = Math.max(momentumDurationX, momentumDurationY);

  z.image.currentX = newPositionX;
  z.image.currentY = newPositionY;

  // Define if we need image drag
  var scaledWidth = z.image.width * z.scale;
  var scaledHeight = z.image.height * z.scale;

  z.image.minX = Math.min((z.gesture.slideWidth / 2 - scaledWidth / 2), 0);
  z.image.maxX = -z.image.minX;

  z.image.minY = Math.min((z.gesture.slideHeight / 2 - scaledHeight / 2), 0);
  z.image.maxY = -z.image.minY;

  z.image.currentX = Math.max(Math.min(z.image.currentX, z.image.maxX), z.image.minX);
  z.image.currentY = Math.max(Math.min(z.image.currentY, z.image.maxY), z.image.minY);

  transition(z.gesture.imageWrap, momentumDuration);
  transform(z.gesture.imageWrap, 'translate3d(' + z.image.currentX + 'px, ' + z.image.currentY + 'px,0)');
}


function onTransitionEnd(s: Slides) {
  const z = s._zoom;

  if (z.gesture.slide && s._previousIndex !== s._activeIndex) {
    transform(z.gesture.image, 'translate3d(0,0,0) scale(1)');
    transform(z.gesture.imageWrap, 'translate3d(0,0,0)');

    z.gesture.slide = z.gesture.image = z.gesture.imageWrap = undefined;
    z.scale = z.currentScale = 1;
  }
}


function toggleZoom(s: Slides, plt: Platform) {
  const z = s._zoom;
  const ev = s.originalEvent;

  if (!z.gesture.slide) {
    z.gesture.slide = s.clickedSlide ? s.clickedSlide : s._slides[s._activeIndex];
    z.gesture.image = <HTMLElement>z.gesture.slide.querySelector('img, svg, canvas, ion-img');
    z.gesture.imageWrap = z.gesture.image && <HTMLElement>z.gesture.image.closest('.' + CLS.zoomContainer);
  }

  if (!z.gesture.imageWrap) return;

  var touchX: number;
  var touchY: number;
  var offsetX: number;
  var offsetY: number;
  var diffX: number;
  var diffY: number;
  var translateX: number;
  var translateY: number;
  var imageWidth: number;
  var imageHeight: number;
  var scaledWidth: number;
  var scaledHeight: number;
  var translateMinX: number;
  var translateMinY: number;
  var translateMaxX: number;
  var translateMaxY: number;
  var slideWidth: number;
  var slideHeight: number;

  if (typeof z.image.touchesStart.x === 'undefined' && ev) {
    touchX = ev.type === 'touchend' ? ev.changedTouches[0].pageX : (<any>ev).pageX;
    touchY = ev.type === 'touchend' ? ev.changedTouches[0].pageY : (<any>ev).pageY;

  } else {
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

  } else {
    // Zoom In
    z.scale = z.currentScale = parseInt(z.gesture.imageWrap.getAttribute('data-swiper-zoom') || <any>s.zoomMax, 10);

    if (ev) {
      slideWidth = z.gesture.slide.offsetWidth;
      slideHeight = z.gesture.slide.offsetHeight;

      var slideOffsets = offset(z.gesture.slide, plt);
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
        translateX =  translateMinX;
      }

      if (translateX > translateMaxX) {
        translateX = translateMaxX;
      }

      if (translateY < translateMinY) {
        translateY =  translateMinY;
      }

      if (translateY > translateMaxY) {
        translateY = translateMaxY;
      }

    } else {
      translateX = 0;
      translateY = 0;
    }

    transition(z.gesture.imageWrap, 300);
    transform(z.gesture.imageWrap, 'translate3d(' + translateX + 'px, ' + translateY + 'px,0)');

    transition(z.gesture.image, 300);
    transform(z.gesture.image, 'translate3d(0,0,0) scale(' + z.scale + ')');
  }
}


export function resetZoomEvents(s: Slides, plt: Platform) {
  detachZoomEvents(s);

  const unRegs = s._zoom.unRegs;
  const evtOpts = { passive: s._touchEvents.start === 'touchstart', zone: false };
  const slides = s._slides;
  let slide: SlideElement;

  // Scale image
  if (s._supportGestures) {
    for (let i = 0; i < slides.length; i++) {
      slide = slides[i];
      // gesturestart
      plt.registerListener(slide, 'gesturestart', (ev: TouchEvent) => {
        onGestureStart(s, plt, ev);
      }, evtOpts, unRegs);

      // gesturechange
      plt.registerListener(slide, 'gesturechange', (ev: TouchEvent) => {
        onGestureChange(s, plt, ev);
      }, evtOpts, unRegs);

      // gestureend
      plt.registerListener(slide, 'gestureend', (ev: TouchEvent) => {
        onGestureEnd(s, plt, ev);
      }, evtOpts, unRegs);
    }

  } else if (s._touchEvents.start === 'touchstart') {
    for (let i = 0; i < slides.length; i++) {
      slide = slides[i];
      // touchstart
      plt.registerListener(slide, s._touchEvents.start, (ev: TouchEvent) => {
        onGestureStart(s, plt, ev);
      }, evtOpts, unRegs);

      // touchmove
      plt.registerListener(slide, s._touchEvents.move, (ev: TouchEvent) => {
        onGestureChange(s, plt, ev);
      }, evtOpts, unRegs);

      // touchend
      plt.registerListener(slide, s._touchEvents.end, (ev: TouchEvent) => {
        onGestureEnd(s, plt, ev);
      }, evtOpts, unRegs);
    }
  }

  // Move image
  var touchStartSub = s.ionSlideTouchStart.subscribe((ev: TouchEvent) => {
    onTouchStart(s, plt, ev);
  });
  unRegs.push(() => { touchStartSub.unsubscribe(); });

  for (let i = 0; i < slides.length; i++) {
    slide = slides[i];
    if (slide.querySelector('.' + CLS.zoomContainer)) {
      plt.registerListener(slide, 's.touchEvents.move', (ev: TouchEvent) => {
        onTouchMove(s, plt, ev);
      }, evtOpts, unRegs);
    }
  }

  var touchEndSub = s.ionSlideTouchEnd.subscribe(() => {
    onTouchEnd(s);
  });
  unRegs.push(() => { touchEndSub.unsubscribe(); });

  // Scale Out
  var transEndSub = s.ionSlideTouchEnd.subscribe(() => {
    onTransitionEnd(s);
  });
  unRegs.push(() => { transEndSub.unsubscribe(); });

  if (s.zoomToggle) {
    var doubleTapSub = s.ionSlideDoubleTap.subscribe(() => {
      toggleZoom(s, plt);
    });
    unRegs.push(() => { doubleTapSub.unsubscribe(); });
  }

}

function detachZoomEvents(s: Slides) {
  s._zoom.unRegs.forEach(unReg => {
    unReg();
  });
  s._zoom.unRegs.length = 0;
}
