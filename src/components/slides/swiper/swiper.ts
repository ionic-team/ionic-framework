import { swiperInit } from './init';
import { swiperCore } from './core';
import { SwiperContainer, SwiperParams, SwiperSlide } from './interfaces';
import { Platform } from '../../../platform/platform';


export class Swiper {
  activeIndex: number;
  autoplaying: boolean;
  autoplayPaused: boolean;
  autoplayTimeoutId: number;
  bullets: HTMLElement[];
  classNames: string[];
  height?: number;
  liveRegion: HTMLElement;
  loopedSlides: number;
  originalParams?: SwiperParams;
  paginationContainer: HTMLElement;
  params: SwiperParams;
  progress: number;
  rtl: boolean;
  slides: SwiperSlide[];
  size: number;
  translate: number;
  velocity: number;
  virtualSize: any;
  width?: number;
  wrapper: HTMLElement;

  currentBreakpoint: any;
  effects: any;
  scrollbar: any;
  snapGrid: any;
  slidesGrid: any;
  slidesSizesGrid: any;


  constructor(public container: SwiperContainer, params: SwiperParams, public plt: Platform) {
    swiperCore(this, params, container);
    swiperInit(this);
  }

emit(asdf?: any, fdasdf?: any) {}

  getActiveBreakpoint(): any {
    const s = this;
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

  setBreakpoint() {
    const s = this;
    // Set breakpoint for window width and update parameters
    var breakpoint = s.getActiveBreakpoint();
    if (breakpoint && s.currentBreakpoint !== breakpoint) {
      var breakPointsParams = breakpoint in s.params.breakpoints ? s.params.breakpoints[breakpoint] : s.originalParams;
      var needsReLoop = s.params.loop && (breakPointsParams.slidesPerView !== s.params.slidesPerView);
      for ( var param in breakPointsParams ) {
        s.params[param] = breakPointsParams[param];
      }
      s.currentBreakpoint = breakpoint;
      if (needsReLoop && s.destroyLoop) {
        s.reLoop(true);
      }
    }
  }

  isHorizontal() {
    return this.params.direction === 'horizontal';
  }

  /*=========================
    Locks, unlocks
    ===========================*/
  lockSwipeToNext() {
    this.params.allowSwipeToNext = false;
  }

  lockSwipeToPrev() {
    this.params.allowSwipeToPrev = false;
  }

  lockSwipes() {
    this.params.allowSwipeToNext = this.params.allowSwipeToPrev = false;
  }

  unlockSwipeToNext() {
    this.params.allowSwipeToNext = true;
  }

  unlockSwipeToPrev() {
    this.params.allowSwipeToPrev = true;
  }

  unlockSwipes() {
    this.params.allowSwipeToNext = this.params.allowSwipeToPrev = true;
  }

  /*=========================
    Autoplay
    ===========================*/
  autoplay() {
    const s = this;
    var autoplayDelay = s.params.autoplay;
    var activeSlide = s.slides[s.activeIndex];
    if (activeSlide.hasAttribute('data-swiper-autoplay')) {
      autoplayDelay = <any>(activeSlide.getAttribute('data-swiper-autoplay') || s.params.autoplay);
    }
    s.autoplayTimeoutId = setTimeout(() => {
      if (s.params.loop) {
        s.fixLoop();
        s._slideNext();
        s.emit('onAutoplay', s);

      } else {
        if (!s.isEnd) {
          s._slideNext();
          s.emit('onAutoplay', s);

        } else {
          if (!s.params.autoplayStopOnLast) {
            s._slideTo(0);
            s.emit('onAutoplay', s);
          } else {
            s.stopAutoplay();
          }
        }
      }
    }, autoplayDelay);
  }

  startAutoplay() {
    const s = this;
    if (typeof s.autoplayTimeoutId !== 'undefined') return false;
    if (!s.params.autoplay) return false;
    if (s.autoplaying) return false;
    s.autoplaying = true;
    s.emit('onAutoplayStart', s);
    s.autoplay();
  }

  stopAutoplay() {
    const s = this;
    if (!s.autoplayTimeoutId) return;
    if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
    s.autoplaying = false;
    s.autoplayTimeoutId = undefined;
    s.emit('onAutoplayStop', s);
  }

  pauseAutoplay(speed) {
    const s = this;
    if (s.autoplayPaused) return;
    if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
    s.autoplayPaused = true;

    if (speed === 0) {
      s.autoplayPaused = false;
      s.autoplay();

    } else {
      s.wrapper.transitionEnd(() => {
        if (!s) return;
        s.autoplayPaused = false;
        if (!s.autoplaying) {
          s.stopAutoplay();
        } else {
          s.autoplay();
        }
      });
    }
  }


  /*=========================
    Min/Max Translate
    ===========================*/
  minTranslate() {
    return (-this.snapGrid[0]);
  }

  maxTranslate() {
    return (-this.snapGrid[this.snapGrid.length - 1]);
  }


  /*=========================
    Slider/slides sizes
    ===========================*/
  updateAutoHeight() {
    const s = this;
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

  updateContainerSize() {
    const s = this;
    var width, height;
    if (typeof s.params.width !== 'undefined') {
      width = s.params.width;
    } else {
      width = s.container[0].clientWidth;
    }
    if (typeof s.params.height !== 'undefined') {
      height = s.params.height;
    } else {
      height = s.container[0].clientHeight;
    }
    if (width === 0 && s.isHorizontal() || height === 0 && !s.isHorizontal()) {
      return;
    }

    // Subtract paddings
    const paddingLeft = this.plt.getComputedStyle
    width = width - parseInt(s.container.css('padding-left'), 10) - parseInt(s.container.css('padding-right'), 10);
    height = height - parseInt(s.container.css('padding-top'), 10) - parseInt(s.container.css('padding-bottom'), 10);

    // Store values
    s.width = width;
    s.height = height;
    s.size = s.isHorizontal() ? s.width : s.height;
  };

  updateSlidesSize() {
    const s = this;
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
        if (s.isHorizontal()) {
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
        slideSize = s.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
        if (s.params.roundLengths) slideSize = round(slideSize);
      } else {
        slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;
        if (s.params.roundLengths) slideSize = round(slideSize);

        if (s.isHorizontal()) {
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
      if (s.isHorizontal()) {
        inlineStyle(s.wrapper, {width: s.virtualSize + s.params.spaceBetween + 'px'});
      } else {
        inlineStyle(s.wrapper, {height: s.virtualSize + s.params.spaceBetween + 'px'});
      }
    }

    if (s.params.slidesPerColumn > 1) {
      s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;
      s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween;
      if (s.isHorizontal()) {
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
      if (s.isHorizontal()) {
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
      s.updateSlidesOffset();
    }
  }

  updateSlidesOffset() {
    const s = this;
    for (var i = 0; i < s.slides.length; i++) {
      s.slides[i].swiperSlideOffset = s.isHorizontal() ? s.slides[i].offsetLeft : s.slides[i].offsetTop;
    }
  }

}

/*=========================
  Round helper
  ===========================*/
function round(a) {
  return Math.floor(a);
}


function inlineStyle(ele: HTMLElement|HTMLElement[], styles: any) {
  if (Array.isArray(ele)) {
    ele.forEach(el => {
      inlineStyle(el, styles);
    });

  } else {
    var cssProps = Object.keys(styles);
    for (var i = 0; i < cssProps.length; i++) {
      ele.style[cssProps[i]] = styles[cssProps[i]];
    }
  }
}
