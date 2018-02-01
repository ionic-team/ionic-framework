import { Slides } from '../slides';
import { Platform } from '../../../platform/platform';
import { fixLoop, onTransitionEnd, onTransitionStart } from './swiper';
import { updateActiveIndex } from './swiper-index';
import { isHorizontal, maxTranslate, minTranslate } from './swiper-utils';
import { updateProgress } from './swiper-progress';


/*=========================
  Controller
  ===========================*/
export const SWIPER_CONTROLLER = {
  LinearSpline: function (_s: Slides, _platform: Platform, x: any, y: any) {
    this.x = x;
    this.y = y;
    this.lastIndex = x.length - 1;
    // Given an x value (x2), return the expected y2 value:
    // (x1,y1) is the known point before given value,
    // (x3,y3) is the known point after given value.
    var i1: number, i3: number;

    this.interpolate = function (x2: number) {
      if (!x2) return 0;

      // Get the indexes of x1 and x3 (the array indexes before and after given x2):
      i3 = binarySearch(this.x, x2);
      i1 = i3 - 1;

      // We have our indexes i1 & i3, so we can calculate already:
      // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1
      return ((x2 - this.x[i1]) * (this.y[i3] - this.y[i1])) / (this.x[i3] - this.x[i1]) + this.y[i1];
    };

    var binarySearch = (function () {
      var maxIndex: number, minIndex: number, guess: number;
      return function (array: any[], val: number) {
        minIndex = -1;
        maxIndex = array.length;
        while (maxIndex - minIndex > 1)
          if (array[guess = maxIndex + minIndex >> 1] <= val) {
            minIndex = guess;
          } else {
            maxIndex = guess;
          }
        return maxIndex;
      };
    })();
  },
  // xxx: for now i will just save one spline function to to
  getInterpolateFunction: function (s: Slides, plt: Platform, c: Slides) {
    if (!s._spline) s._spline = s.loop ?
      new (<any>SWIPER_CONTROLLER).LinearSpline(s, plt, s._slidesGrid, c._slidesGrid) :
      new (<any>SWIPER_CONTROLLER).LinearSpline(s, plt, s._snapGrid, c._snapGrid);
  },
  setTranslate: function (s: Slides, plt: Platform, translate: number, byController: Slides, setWrapperTranslate: any) {
    var controlled = s.control;
    var multiplier: number, controlledTranslate: number;
    function setControlledTranslate(c: Slides) {
      // this will create an Interpolate function based on the snapGrids
      // x is the Grid of the scrolled scroller and y will be the controlled scroller
      // it makes sense to create this only once and recall it for the interpolation
      // the function does a lot of value caching for performance
      translate = c._rtl && isHorizontal(c) ? -s._translate : s._translate;
      if (s.controlBy === 'slide') {
        SWIPER_CONTROLLER.getInterpolateFunction(s, plt, c);
        // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
        // but it did not work out
        controlledTranslate = -s._spline.interpolate(-translate);
      }

      if (!controlledTranslate || s.controlBy === 'container') {
        multiplier = (maxTranslate(c) - minTranslate(c)) / (maxTranslate(s) - minTranslate(s));
        controlledTranslate = (translate - minTranslate(s)) * multiplier + minTranslate(c);
      }

      if (s.controlInverse) {
        controlledTranslate = maxTranslate(c) - controlledTranslate;
      }
      updateProgress(c, controlledTranslate);
      setWrapperTranslate(c, plt, controlledTranslate, false, s);
      updateActiveIndex(c);
    }
    if (Array.isArray(controlled)) {
      for (var i = 0; i < controlled.length; i++) {
        if (controlled[i] !== byController) {
          setControlledTranslate(controlled[i]);
        }
      }
    } else if (byController !== controlled) {
      setControlledTranslate(controlled);
    }
  },
  setTransition: function (s: Slides, plt: Platform, duration: number, byController: Slides, setWrapperTransition: any) {
    var controlled = s.control;
    var i: number;
    function setControlledTransition(c: Slides) {
      setWrapperTransition(c, plt, duration, s);
      if (duration !== 0) {
        onTransitionStart(c);
        plt.transitionEnd(c._wrapper, () => {
          if (!controlled) return;
          if (c.loop && s.controlBy === 'slide') {
            fixLoop(c, plt);
          }
          onTransitionEnd(c, plt);
        });
      }
    }
    if (Array.isArray(controlled)) {
      for (i = 0; i < controlled.length; i++) {
        if (controlled[i] !== byController) {
          setControlledTransition(controlled[i]);
        }
      }
    } else if (byController !== controlled) {
      setControlledTransition(controlled);
    }
  }
};
