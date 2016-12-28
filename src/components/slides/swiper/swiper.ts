/**
 * Adopted from Swiper
 * Most modern mobile touch slider and framework with hardware
 * accelerated transitions.
 *
 * http://www.idangero.us/swiper/
 *
 * Copyright 2016, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under MIT
 */

import { a11yInitPagination } from './swiper-a11y';
import { SlideParams, SlideElement } from './swiper-interfaces';
import { Platform } from '../../../platform/platform';
import { maxTranslate, minTranslate, addClass, eachChild, inlineStyle, removeClass, isHorizontal, round, queryChildren, updateSlidesOffset } from './swiper-utils';
import { Slides } from '../slides';
import { SWIPER_DEFAULTS } from './swiper-defaults';
import { setWrapperTranslate, setWrapperTransition } from './swiper-transition';
import { updateProgress } from './swiper-progress';
import { updateClasses } from './swiper-classes';
import { parallaxSetTranslate } from './swiper-parallax';
import { updateActiveIndex, updateRealIndex } from './swiper-index';


export function swiperInit(s: Slides, plt: Platform, params: SlideParams) {
  const win: any = plt.win();
  const doc: any = plt.doc();

  var initialVirtualTranslate = params && params.virtualTranslate;

  params = params || {};
  var originalParams = {};

  for (var param in params) {
    if (typeof params[param] === 'object' && params[param] !== null) {
      originalParams[param] = {};
      for (var deepParam in params[param]) {
        originalParams[param][deepParam] = params[param][deepParam];
      }
    } else {
      originalParams[param] = params[param];
    }
  }

  for (var def in SWIPER_DEFAULTS) {
    if (typeof params[def] === 'undefined') {
      params[def] = SWIPER_DEFAULTS[def];
    } else if (typeof params[def] === 'object') {
      for (var deepDef in SWIPER_DEFAULTS[def]) {
        if (typeof params[def][deepDef] === 'undefined') {
          params[def][deepDef] = SWIPER_DEFAULTS[def][deepDef];
        }
      }
    }
  }

  // Params
  s.params = params;
  s.originalParams = originalParams;

  // Classname
  s.classNames = [];

  /*=========================
    Breakpoints
    ===========================*/
  s.currentBreakpoint = undefined;

  // Set breakpoint on load
  if (s.params.breakpoints) {
    setBreakpoint(s, plt);
  }

  /*=========================
    Preparation - Define Container, Wrapper and Pagination
    ===========================*/
  if (!s.container) {
    return;
  }

  s.supportTouch = (() => {
    return !!(('ontouchstart' in win) || win.DocumentTouch && doc instanceof win.DocumentTouch);
  })();

  // Save instance in container HTML Element and in data
  s.container.swiper = s;

  s.classNames.push(s.params.containerModifierClass + s.params.direction);

  if (s.params.freeMode) {
    s.classNames.push(s.params.containerModifierClass + 'free-mode');
  }
  if (s.params.autoHeight) {
    s.classNames.push(s.params.containerModifierClass + 'autoheight');
  }
  // Enable slides progress when required
  if (s.params.parallax || s.params.watchSlidesVisibility) {
    s.params.watchSlidesProgress = true;
  }
  // Max resistance when touchReleaseOnEdges
  if (s.params.touchReleaseOnEdges) {
    s.params.resistanceRatio = 0;
  }
  // Coverflow / 3D
  if (['cube', 'coverflow', 'flip'].indexOf(s.params.effect) >= 0) {
    s.params.watchSlidesProgress = true;
    s.classNames.push(s.params.containerModifierClass + '3d');
  }
  if (s.params.effect !== 'slide') {
    s.classNames.push(s.params.containerModifierClass + s.params.effect);
  }
  if (s.params.effect === 'cube') {
    s.params.resistanceRatio = 0;
    s.params.slidesPerView = 1;
    s.params.slidesPerColumn = 1;
    s.params.slidesPerGroup = 1;
    s.params.centeredSlides = false;
    s.params.spaceBetween = 0;
    s.params.virtualTranslate = true;
    s.params.setWrapperSize = false;
  }
  if (s.params.effect === 'fade' || s.params.effect === 'flip') {
    s.params.slidesPerView = 1;
    s.params.slidesPerColumn = 1;
    s.params.slidesPerGroup = 1;
    s.params.watchSlidesProgress = true;
    s.params.spaceBetween = 0;
    s.params.setWrapperSize = false;
    if (typeof initialVirtualTranslate === 'undefined') {
      s.params.virtualTranslate = true;
    }
  }

  // Wrapper
  s.wrapper = <HTMLElement>s.container.querySelector('.' + s.params.wrapperClass);

  // Pagination
  if (s.params.pagination) {
    s.paginationContainer = <any>s.container.querySelector(s.params.pagination);

    if (s.params.paginationType === 'bullets' && s.params.paginationClickable) {
      s.paginationContainer.classList.add(s.params.paginationModifierClass + 'clickable');
    } else {
      s.params.paginationClickable = false;
    }
    s.paginationContainer.classList.add(s.params.paginationModifierClass + s.params.paginationType);
  }
  // Next/Prev Buttons
  if (s.params.nextButton || s.params.prevButton) {
    if (s.params.nextButton) {
      s.nextButton = <any>s.container.closest('ion-content').querySelector(s.params.nextButton);
    }
    if (s.params.prevButton) {
      s.prevButton = <any>s.container.closest('ion-content').querySelector(s.params.prevButton);
    }
  }

  // RTL
  s.rtl = isHorizontal(s) && (s.container.dir.toLowerCase() === 'rtl' || s.container.style.direction === 'rtl');
  if (s.rtl) {
    s.classNames.push(s.params.containerModifierClass + 'rtl');
  }

  // Columns
  if (s.params.slidesPerColumn > 1) {
    s.classNames.push(s.params.containerModifierClass + 'multirow');
  }

  // Check for Android
  if (plt.is('android')) {
    s.classNames.push(s.params.containerModifierClass + 'android');
  }

  // Add classes
  s.container.classList.add(s.classNames.join(' '));

  // Translate
  s.translate = 0;

  // Progress
  s.progress = 0;

  // Velocity
  s.velocity = 0;


  /*=========================
    Autoplay
    ===========================*/
  s.autoplayTimeoutId = undefined;
  s.autoplaying = false;
  s.autoplayPaused = false;


  /*=========================
    Events
    ===========================*/
  // Define Touch Events
  s.touchEventsDesktop = {start: 'mousedown', move: 'mousemove', end: 'mouseup'};
  if (win.navigator.pointerEnabled) {
    s.touchEventsDesktop = {start: 'pointerdown', move: 'pointermove', end: 'pointerup'};
  } else if (win.navigator.msPointerEnabled) {
    s.touchEventsDesktop = {start: 'MSPointerDown', move: 'MSPointerMove', end: 'MSPointerUp'};
  }
  s.touchEvents = {
    start : s.supportTouch || !s.params.simulateTouch  ? 'touchstart' : s.touchEventsDesktop.start,
    move : s.supportTouch || !s.params.simulateTouch ? 'touchmove' : s.touchEventsDesktop.move,
    end : s.supportTouch || !s.params.simulateTouch ? 'touchend' : s.touchEventsDesktop.end
  };


  // WP8 Touch Events Fix
  if (win.navigator.pointerEnabled || win.navigator.msPointerEnabled) {
    (s.params.touchEventsTarget === 'container' ? s.container : s.wrapper).classList.add('swiper-wp8-' + s.params.direction);
  }

  s.allowClick = true;

  // Animating Flag
  s.animating = false;

  // Touches information
  s.touches = {
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    diff: 0
  };

  if (s.params.loop) {
    createLoop(s);
  }

  updateContainerSize(s);
  updateSlidesSize(s);
  updatePagination(s);

  if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
    if (!s.params.loop) {
      updateProgress(s);
    }
    s.effects[s.params.effect].setTranslate(s, plt);
  }

  if (s.params.loop) {
    slideTo(s, plt, s.params.initialSlide + s.loopedSlides, 0, s.params.runCallbacksOnInit);

  } else {
    slideTo(s, plt, s.params.initialSlide, 0, s.params.runCallbacksOnInit);

    if (s.params.initialSlide === 0) {
      parallaxSetTranslate(s);
    }
  }

  if (s.params.autoplay) {
    startAutoplay(s, plt);
  }
}


function getActiveBreakpoint(s: Slides): any {
  // Get breakpoint for window width
  if (!s.params.breakpoints) return false;
  var breakpoint = false;
  var points = [], point;
  for ( point in s.params.breakpoints ) {
    if (s.params.breakpoints.hasOwnProperty(point)) {
      points.push(point);
    }
  }
  points.sort(function(a, b): any {
    return parseInt(a, 10) > parseInt(b, 10);
  });
  for (var i = 0; i < points.length; i++) {
    point = points[i];
    if (point >= window.innerWidth && !breakpoint) {
      breakpoint = point;
    }
  }
  return breakpoint || 'max';
}

export function setBreakpoint(s: Slides, plt: Platform) {
  // Set breakpoint for window width and update parameters
  var breakpoint = getActiveBreakpoint(s);
  if (breakpoint && s.currentBreakpoint !== breakpoint) {
    var breakPointsParams = breakpoint in s.params.breakpoints ? s.params.breakpoints[breakpoint] : s.originalParams;
    var needsReLoop = s.params.loop && (breakPointsParams.slidesPerView !== s.params.slidesPerView);
    for ( var param in breakPointsParams ) {
      s.params[param] = breakPointsParams[param];
    }
    s.currentBreakpoint = breakpoint;
    if (needsReLoop) {
      reLoop(s, plt, true);
    }
  }
}

/*=========================
  Autoplay
  ===========================*/
function autoplay(s: Slides, plt: Platform) {
  var autoplayDelay = s.params.autoplay;
  var activeSlide = s.slides[s.activeIndex];

  if (activeSlide.hasAttribute('data-swiper-autoplay')) {
    autoplayDelay = <any>(activeSlide.getAttribute('data-swiper-autoplay') || s.params.autoplay);
  }

  s.autoplayTimeoutId = setTimeout(() => {
    if (s.params.loop) {
      fixLoop(s, plt);
      slideNext(s, plt, true, undefined, true);
      s.ionAutoplay.emit();

    } else {
      if (!s.isEnd) {
        slideNext(s, plt, true, undefined, true);
        s.ionAutoplay.emit();

      } else {
        if (!s.params.autoplayStopOnLast) {
          slideTo(s, plt, 0);
          s.ionAutoplay.emit();

        } else {
          stopAutoplay(s);
        }
      }
    }
  }, autoplayDelay);
}

function startAutoplay(s: Slides, plt: Platform) {
  if (typeof s.autoplayTimeoutId !== 'undefined') return false;
  if (!s.params.autoplay) return false;
  if (s.autoplaying) return false;
  s.autoplaying = true;
  s.ionAutoplayStart.emit();
  autoplay(s, plt);
}

export function stopAutoplay(s: Slides) {
  if (!s.autoplayTimeoutId) return;
  if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);

  s.autoplaying = false;
  s.autoplayTimeoutId = undefined;
  s.ionAutoplayStop.emit();
}

export function pauseAutoplay(s: Slides, plt: Platform, speed?: number) {
  if (s.autoplayPaused) return;
  if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
  s.autoplayPaused = true;

  if (speed === 0) {
    s.autoplayPaused = false;
    autoplay(s, plt);

  } else {
    plt.transitionEnd(s.wrapper, () => {
      if (!s) return;
      s.autoplayPaused = false;
      if (!s.autoplaying) {
        stopAutoplay(s);
      } else {
        autoplay(s, plt);
      }
    });
  }
}


/*=========================
  Slider/slides sizes
  ===========================*/
export function updateAutoHeight(s: Slides) {
  var activeSlides = [];
  var newHeight = 0;
  var i;

  // Find slides currently in view
  if (s.params.slidesPerView !== 'auto' && s.params.slidesPerView > 1) {
    for (i = 0; i < Math.ceil(s.params.slidesPerView); i++) {
      var index = s.activeIndex + i;
      if (index > s.slides.length) break;
      activeSlides.push(s.slides[index]);
    }
  } else {
    activeSlides.push(s.slides[s.activeIndex]);
  }

  // Find new height from heighest slide in view
  for (i = 0; i < activeSlides.length; i++) {
    if (typeof activeSlides[i] !== 'undefined') {
      var height = activeSlides[i].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  }

  // Update Height
  if (newHeight) {
    s.wrapper.style.height = newHeight + 'px';
  }
}

export function updateContainerSize(s: Slides) {
  const container = s.container;
  var width, height;
  if (typeof s.params.width !== 'undefined') {
    width = s.params.width;
  } else {
    width = container.clientWidth;
  }
  if (typeof s.params.height !== 'undefined') {
    height = s.params.height;
  } else {
    height = container.clientHeight;
  }
  if (width === 0 && isHorizontal(s) || height === 0 && !isHorizontal(s)) {
    return;
  }

  // Subtract paddings
  const containerStyles = this.plt.getElementComputedStyle(container);
  width = width - parseInt(containerStyles.paddingLeft, 10) - parseInt(containerStyles.paddingRight, 10);
  height = height - parseInt(containerStyles.paddingTop, 10) - parseInt(containerStyles.paddingBottom, 10);

  // Store values
  s.width = width;
  s.height = height;
  s.size = isHorizontal(s) ? s.width : s.height;
}

export function updateSlidesSize(s: Slides) {
  s.slides = (<any>s.wrapper.querySelectorAll('.' + s.params.slideClass));
  s.snapGrid = [];
  s.slidesGrid = [];
  s.slidesSizesGrid = [];

  var spaceBetween = s.params.spaceBetween,
    slidePosition = -s.params.slidesOffsetBefore,
    i,
    prevSlideSize = 0,
    index = 0;
  if (typeof s.size === 'undefined') return;
  if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * s.size;
  }

  s.virtualSize = -spaceBetween;

  // reset margins
  s.slides.forEach(slide => {
    if (s.rtl) {
      inlineStyle(slide, {marginLeft: '', marginTop: ''});
    } else {
      inlineStyle(slide, {marginRight: '', marginBottom: ''});
    }
  });

  var slidesNumberEvenToRows;
  if (s.params.slidesPerColumn > 1) {
    if (Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn) {
      slidesNumberEvenToRows = s.slides.length;
    } else {
      slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn;
    }
    if (s.params.slidesPerView !== 'auto' && s.params.slidesPerColumnFill === 'row') {
      slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, s.params.slidesPerView * s.params.slidesPerColumn);
    }
  }

  // Calc slides
  var slideSize: number;
  var slidesPerColumn = s.params.slidesPerColumn;
  var slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
  var numFullColumns = slidesPerRow - (s.params.slidesPerColumn * slidesPerRow - s.slides.length);
  for (i = 0; i < s.slides.length; i++) {
    slideSize = 0;
    var slide = s.slides[i];
    if (s.params.slidesPerColumn > 1) {
      // Set slides order
      var newSlideOrderIndex;
      var column, row;
      if (s.params.slidesPerColumnFill === 'column') {
        column = Math.floor(i / slidesPerColumn);
        row = i - column * slidesPerColumn;
        if (column > numFullColumns || (column === numFullColumns && row === slidesPerColumn - 1)) {
          if (++row >= slidesPerColumn) {
            row = 0;
            column++;
          }
        }
        newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
        inlineStyle(slide, {
            '-webkit-box-ordinal-group': newSlideOrderIndex,
            '-moz-box-ordinal-group': newSlideOrderIndex,
            '-ms-flex-order': newSlideOrderIndex,
            '-webkit-order': newSlideOrderIndex,
            'order': newSlideOrderIndex
          });

      } else {
        row = Math.floor(i / slidesPerRow);
        column = i - row * slidesPerRow;
      }

      var cssVal = (row !== 0 && s.params.spaceBetween) && (s.params.spaceBetween + 'px');
      var cssObj = {};
      if (isHorizontal(s)) {
        cssObj['marginTop'] = cssVal;
      } else {
        cssObj['marginLeft'] = cssVal;
      }
      inlineStyle(slide, cssObj);
      slide.setAttribute('data-swiper-column', column);
      slide.setAttribute('data-swiper-row', row);
    }
    if (slide.style.display === 'none') {
      continue;
    }
    if (s.params.slidesPerView === 'auto') {
      var styles = this.plt.getElementComputedStyle(slide);
      if (isHorizontal(s)) {
        slideSize = slide.offsetWidth + parseFloat(styles.marginRight) + parseFloat(styles.marginLeft);
      } else {
        slideSize = slide.offsetHeight + parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
      }
      if (s.params.roundLengths) slideSize = round(slideSize);

    } else {
      slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;
      if (s.params.roundLengths) slideSize = round(slideSize);

      if (isHorizontal(s)) {
        s.slides[i].style.width = slideSize + 'px';
      } else {
        s.slides[i].style.height = slideSize + 'px';
      }
    }
    s.slides[i].swiperSlideSize = slideSize;
    s.slidesSizesGrid.push(slideSize);


    if (s.params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (i === 0) slidePosition = slidePosition - s.size / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
      if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
      s.slidesGrid.push(slidePosition);

    } else {
      if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
      s.slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }

    s.virtualSize += slideSize + spaceBetween;

    prevSlideSize = slideSize;

    index ++;
  }
  s.virtualSize = Math.max(s.virtualSize, s.size) + s.params.slidesOffsetAfter;
  var newSlidesGrid;

  if (
    s.rtl && (s.params.effect === 'slide' || s.params.effect === 'coverflow')) {
    inlineStyle(s.wrapper, {width: s.virtualSize + s.params.spaceBetween + 'px'});
  }
  if (s.params.setWrapperSize) {
    if (isHorizontal(s)) {
      inlineStyle(s.wrapper, {width: s.virtualSize + s.params.spaceBetween + 'px'});
    } else {
      inlineStyle(s.wrapper, {height: s.virtualSize + s.params.spaceBetween + 'px'});
    }
  }

  if (s.params.slidesPerColumn > 1) {
    s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;
    s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween;
    if (isHorizontal(s)) {
      inlineStyle(s.wrapper, {width: s.virtualSize + s.params.spaceBetween + 'px'});
    } else {
      inlineStyle(s.wrapper, {height: s.virtualSize + s.params.spaceBetween + 'px'});
    }
    if (s.params.centeredSlides) {
      newSlidesGrid = [];
      for (i = 0; i < s.snapGrid.length; i++) {
        if (s.snapGrid[i] < s.virtualSize + s.snapGrid[0]) newSlidesGrid.push(s.snapGrid[i]);
      }
      s.snapGrid = newSlidesGrid;
    }
  }

  // Remove last grid elements depending on width
  if (!s.params.centeredSlides) {
    newSlidesGrid = [];
    for (i = 0; i < s.snapGrid.length; i++) {
      if (s.snapGrid[i] <= s.virtualSize - s.size) {
        newSlidesGrid.push(s.snapGrid[i]);
      }
    }
    s.snapGrid = newSlidesGrid;
    if (Math.floor(s.virtualSize - s.size) - Math.floor(s.snapGrid[s.snapGrid.length - 1]) > 1) {
      s.snapGrid.push(s.virtualSize - s.size);
    }
  }
  if (s.snapGrid.length === 0) s.snapGrid = [0];

  if (s.params.spaceBetween !== 0) {
    if (isHorizontal(s)) {
      if (s.rtl) {
        inlineStyle(s.slides, {marginLeft: spaceBetween + 'px'});
      } else {
        inlineStyle(s.slides, {marginRight: spaceBetween + 'px'});
      }
    } else {
      inlineStyle(s.slides, {marginBottom: spaceBetween + 'px'});
    }
  }
  if (s.params.watchSlidesProgress) {
    updateSlidesOffset(s);
  }
}


/*=========================
  Dynamic Slides Per View
  ===========================*/
export function currentSlidesPerView(s: Slides) {
  var spv = 1, i, j;
  if (s.params.centeredSlides) {
    var size = s.slides[s.activeIndex].swiperSlideSize;
    var breakLoop;
    for (i = s.activeIndex + 1; i < s.slides.length; i++) {
      if (s.slides[i] && !breakLoop) {
        size += s.slides[i].swiperSlideSize;
        spv ++;
        if (size > s.size) breakLoop = true;
      }
    }
    for (j = s.activeIndex - 1; j >= 0; j--) {
      if (s.slides[j] && !breakLoop) {
        size += s.slides[j].swiperSlideSize;
        spv ++;
        if (size > s.size) breakLoop = true;
      }
    }
  } else {
    for (i = s.activeIndex + 1; i < s.slides.length; i++) {
      if (s.slidesGrid[i] - s.slidesGrid[s.activeIndex] < s.size) {
        spv++;
      }
    }
  }
  return spv;
}



/*=========================
  Pagination
  ===========================*/
export function updatePagination(s: Slides) {
  if (!s.params.pagination) return;

  if (s.paginationContainer) {
    var paginationHTML = '';
    if (s.params.paginationType === 'bullets') {
      var numberOfBullets = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
      for (var i = 0; i < numberOfBullets; i++) {
        paginationHTML += '<' + s.params.paginationElement + ' class="' + s.params.bulletClass + '"></' + s.params.paginationElement + '>';
      }
      s.paginationContainer.innerHTML = paginationHTML;

      s.bullets = queryChildren(s.paginationContainer, '.' + s.params.bulletClass);
      if (s.params.paginationClickable && s.params.a11y) {
        a11yInitPagination(this);
      }
    }

    if (s.params.paginationType === 'fraction') {
      paginationHTML =
        '<span class="' + s.params.paginationCurrentClass + '"></span>' +
        ' / ' +
        '<span class="' + s.params.paginationTotalClass + '"></span>';
      s.paginationContainer.innerHTML = paginationHTML;
    }

    if (s.params.paginationType === 'progress') {
      paginationHTML = '<span class="' + s.params.paginationProgressbarClass + '"></span>';
      s.paginationContainer.innerHTML = paginationHTML;
    }
  }
}

/*=========================
  Common update method
  ===========================*/
export function update(s: Slides, plt: Platform, updateTranslate?: boolean) {
  if (!s) return;

  updateContainerSize(s);
  updateSlidesSize(s);
  updateProgress(s);
  updatePagination(s);
  updateClasses(s);

  var translated, newTranslate;
  function forceSetTranslate() {
    newTranslate = Math.min(Math.max(s.translate, maxTranslate(s)), minTranslate(s));
    setWrapperTranslate(s, plt, newTranslate);
    updateActiveIndex(s);
    updateClasses(s);
  }
  if (updateTranslate) {
    if (s.params.freeMode) {
      forceSetTranslate();
      if (s.params.autoHeight) {
        updateAutoHeight(s);
      }

    } else {
      if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
        translated = slideTo(s, plt, s.slides.length - 1, 0, false, true);
      } else {
        translated = slideTo(s, plt, s.activeIndex, 0, false, true);
      }

      if (!translated) {
        forceSetTranslate();
      }
    }

  } else if (s.params.autoHeight) {
    updateAutoHeight(s);
  }
}


/*=========================
  Loop
  ===========================*/
// Create looped slides
function createLoop(s: Slides) {
  // Remove duplicated slides
  eachChild(s.wrapper, '.' + s.params.slideClass + '.' + s.params.slideDuplicateClass, ele => {
    ele.parentElement.removeChild(ele);
  });

  var slides: SlideElement[] = <any>s.wrapper.querySelectorAll('.' + s.params.slideClass);

  if (s.params.slidesPerView === 'auto' && !s.params.loopedSlides) {
    s.params.loopedSlides = slides.length;
  }

  s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView, 10);
  s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides;
  if (s.loopedSlides > slides.length) {
    s.loopedSlides = slides.length;
  }

  var prependSlides = [];
  var appendSlides = [];

  for (var i = 0; i < slides.length; i++) {
    var slide = slides[i];
    if (i < s.loopedSlides) appendSlides.push(slide);
    if (i < slides.length && i >= slides.length - s.loopedSlides) prependSlides.push(slide);
    slide.setAttribute('data-swiper-slide-index', <any>i);
  }

  for (i = 0; i < appendSlides.length; i++) {
    var appendClone = appendSlides[i].cloneNode(true);
    addClass(appendClone, s.params.slideDuplicateClass);
    s.wrapper.appendChild(appendClone);
  }
  for (i = prependSlides.length - 1; i >= 0; i--) {
    var prependClone = prependSlides[i].cloneNode(true);
    addClass(prependClone, s.params.slideDuplicateClass);
    s.wrapper.insertBefore(prependClone, s.wrapper.firstElementChild);
  }
}

function destroyLoop(s: Slides) {
  eachChild(s.wrapper, '.' + s.params.slideClass + '.' + s.params.slideDuplicateClass, ele => {
    ele.parentElement.removeChild(ele);
  });
  for (var i = 0; i < s.slides.length; i++) {
    s.slides[i].removeAttribute('data-swiper-slide-index');
  }
}

function reLoop(s: Slides, plt: Platform, updatePosition: boolean) {
  var oldIndex = s.activeIndex - s.loopedSlides;

  destroyLoop(s);
  createLoop(s);
  updateSlidesSize(s);

  if (updatePosition) {
    slideTo(s, plt, oldIndex + s.loopedSlides, 0, false);
  }
}

export function fixLoop(s: Slides, plt: Platform) {
  var newIndex;
  if (s.activeIndex < s.loopedSlides) {
    // Fix For Negative Oversliding
    newIndex = s.slides.length - s.loopedSlides * 3 + s.activeIndex;
    newIndex = newIndex + s.loopedSlides;
    slideTo(s, plt, newIndex, 0, false, true);

  } else if ((s.params.slidesPerView === 'auto' && s.activeIndex >= s.loopedSlides * 2) || (s.activeIndex > s.slides.length - s.params.slidesPerView * 2)) {
    // Fix For Positive Oversliding
    newIndex = -s.slides.length + s.activeIndex + s.loopedSlides;
    newIndex = newIndex + s.loopedSlides;
    slideTo(s, plt, newIndex, 0, false, true);
  }
}


/*=========================
  Transitions
  ===========================*/

export function slideTo(s: Slides, plt: Platform, slideIndex?: number, speed?: number, runCallbacks?: boolean, internal?: boolean) {
  if (typeof runCallbacks === 'undefined') runCallbacks = true;
  if (typeof slideIndex === 'undefined') slideIndex = 0;
  if (slideIndex < 0) slideIndex = 0;
  s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup);
  if (s.snapIndex >= s.snapGrid.length) s.snapIndex = s.snapGrid.length - 1;

  var translate = - s.snapGrid[s.snapIndex];
  // Stop autoplay
  if (s.params.autoplay && s.autoplaying) {
    if (internal || !s.params.autoplayDisableOnInteraction) {
      pauseAutoplay(s, plt, speed);
    } else {
      stopAutoplay(s);
    }
  }

  // Update progress
  updateProgress(s, translate);

  // Normalize slideIndex
  if (s.params.normalizeSlideIndex) {
    for (var i = 0; i < s.slidesGrid.length; i++) {
      if (- Math.floor(translate * 100) >= Math.floor(s.slidesGrid[i] * 100)) {
        slideIndex = i;
      }
    }
  }

  // Directions locks
  if (!s.params.allowSwipeToNext && translate < s.translate && translate < minTranslate(s)) {
    return false;
  }
  if (!s.params.allowSwipeToPrev && translate > s.translate && translate > maxTranslate(s)) {
    if ((s.activeIndex || 0) !== slideIndex ) return false;
  }

  // Update Index
  if (typeof speed === 'undefined') speed = s.params.speed;

  s.previousIndex = s.activeIndex || 0;
  s.activeIndex = slideIndex;
  updateRealIndex(s);

  if ((s.rtl && -translate === s.translate) || (!s.rtl && translate === s.translate)) {
    // Update Height
    if (s.params.autoHeight) {
      updateAutoHeight(s);
    }
    updateClasses(s);
    if (s.params.effect !== 'slide') {
      setWrapperTranslate(s, plt, translate);
    }
    return false;
  }

  updateClasses(s);
  onTransitionStart(s, runCallbacks);

  if (speed === 0) {
    setWrapperTranslate(s, plt, translate);
    setWrapperTransition(s, plt, 0);
    onTransitionEnd(s, plt, runCallbacks);

  } else {
    setWrapperTranslate(s, plt, translate);
    setWrapperTransition(s, plt, speed);
    if (!s.animating) {
      s.animating = true;
      plt.transitionEnd(s.wrapper, () => {
        if (!s) return;
        onTransitionEnd(s, plt, runCallbacks);
      });
    }

  }

  return true;
}


export function onTransitionStart(s: Slides, runCallbacks?: boolean) {
  if (typeof runCallbacks === 'undefined') runCallbacks = true;
  if (s.params.autoHeight) {
    updateAutoHeight(s);
  }

  if (runCallbacks) {
    s.ionTransitionStart.emit();

    if (s.activeIndex !== s.previousIndex) {
      s.ionSlideChangeStart.emit();

      if (s.activeIndex > s.previousIndex) {
        s.ionSlideNextStart.emit();
      } else {
        s.ionSlidePrevStart.emit();
      }
    }
  }
}

export function onTransitionEnd(s: Slides, plt: Platform, runCallbacks?: boolean) {
  s.animating = false;
  setWrapperTransition(s, plt, 0);
  if (typeof runCallbacks === 'undefined') runCallbacks = true;

  if (runCallbacks) {
    s.ionTransitionEnd.emit();

    if (s.activeIndex !== s.previousIndex) {
      s.ionSlideChangeEnd.emit();

      if (s.activeIndex > s.previousIndex) {
        s.ionSlideNextEnd.emit();
      } else {
        s.ionSlidePrevEnd.emit();
      }
    }
  }
}

export function slideNext(s: Slides, plt: Platform, runCallbacks?: boolean, speed?: number, internal?: boolean): any {
  if (s.params.loop) {
    if (s.animating) return false;
    fixLoop(s, plt);
    s.container.clientLeft;
    return slideTo(s, plt, s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);

  } else {
    return slideTo(s, plt, s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
  }
}

export function slidePrev(s: Slides, plt: Platform, runCallbacks?: boolean, speed?: number, internal?: boolean): any {
  if (s.params.loop) {
    if (s.animating) return false;
    fixLoop(s, plt);
    s.container.clientLeft;
    return slideTo(s, plt, s.activeIndex - 1, speed, runCallbacks, internal);

  } else {
    return slideTo(s, plt, s.activeIndex - 1, speed, runCallbacks, internal);
  }
}

export function slideReset(s: Slides, plt: Platform, runCallbacks?: boolean, speed?: number, internal?: boolean) {
  return slideTo(s, plt, s.activeIndex, speed, runCallbacks, true);
}

export function disableTouchControl(s: Slides) {
  s.params.onlyExternal = true;
  return true;
}

export function enableTouchControl(s: Slides) {
  s.params.onlyExternal = false;
  return true;
}


/*=========================
  Translate/transition helpers
  ===========================*/




// Cleanup dynamic styles
function cleanupStyles(s: Slides) {
  // Container
  removeClass(s.container, s.classNames);
  s.container.removeAttribute('style');

  // Wrapper
  s.wrapper.removeAttribute('style');

  // Slides
  if (s.slides && s.slides.length) {
    removeClass(s.slides, [
      s.params.slideVisibleClass,
      s.params.slideActiveClass,
      s.params.slideNextClass,
      s.params.slidePrevClass
    ]);
    for (var i = 0; i < s.slides.length; i++) {
      var slide = s.slides[i];
      slide.removeAttribute('style');
      slide.removeAttribute('data-swiper-column');
      slide.removeAttribute('data-swiper-row');
    }
  }

  // Pagination/Bullets
  if (s.paginationContainer) {
    removeClass(s.paginationContainer, s.params.paginationHiddenClass);
  }
  if (s.bullets && s.bullets.length) {
    removeClass(s.bullets, s.params.bulletActiveClass);
  }

  // Buttons
  removeClass(s.prevButton, s.params.buttonDisabledClass);
  removeClass(s.nextButton, s.params.buttonDisabledClass);
};


// Destroy
export function swiperDestroy(s: Slides, deleteInstance, shouldCleanupStyles) {
  // Stop autoplay
  stopAutoplay(s);

  // Destroy loop
  if (s.params.loop) {
    destroyLoop(s);
  }

  // Cleanup styles
  if (shouldCleanupStyles) {
    cleanupStyles(s);
  }

  // Delete instance
  if (deleteInstance !== false) s = null;
}
