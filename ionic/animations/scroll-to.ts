import {raf} from '../util/dom';


export class ScrollTo {

  constructor(ele, x, y, duration) {
    if (typeof ele === 'string') {
      // string query selector
      ele = document.querySelector(ele);
    }

    if (ele) {
      if (ele.nativeElement) {
        // angular ElementRef
        ele = ele.nativeElement;
      }

      if (ele.nodeType === 1) {
        this._el = ele;
      }
    }
  }

  start(x, y, duration, tolerance) {
    // scroll animation loop w/ easing
    // credit https://gist.github.com/dezinezync/5487119
    let self = this;

    if (!self._el) {
      // invalid element
      return Promise.resolve();
    }

    x = x || 0;
    y = y || 0;
    tolerance = tolerance || 0;

    let ele = self._el;
    let fromY = ele.scrollTop;
    let fromX = ele.scrollLeft;

    let xDistance = Math.abs(x - fromX);
    let yDistance = Math.abs(y - fromY);

    if (yDistance <= tolerance && xDistance <= tolerance) {
      // prevent scrolling if already close to there
      this._el = ele = null;
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {

      let start = Date.now();

      // start scroll loop
      self.isPlaying = true;
      raf(step);

      // decelerating to zero velocity
      function easeOutCubic(t) {
        return (--t) * t * t + 1;
      }

      // scroll loop
      function step() {
        let time = Math.min(1, ((Date.now() - start) / duration));

        // where .5 would be 50% of time on a linear scale easedT gives a
        // fraction based on the easing method
        let easedT = easeOutCubic(time);

        if (fromY != y) {
          ele.scrollTop = parseInt((easedT * (y - fromY)) + fromY, 10);
        }
        if (fromX != x) {
          ele.scrollLeft = parseInt((easedT * (x - fromX)) + fromX, 10);
        }

        if (time < 1 && self.isPlaying) {
          raf(step);

        } else if (!self.isPlaying) {
          // stopped
          this._el = ele = null;
          reject();

        } else {
          // done
          this._el = ele = null;
          resolve();
        }
      }

    });
  }

  stop() {
    this.isPlaying = false;
  }

  dispose() {
    this.stop();
    this._el = null;
  }

}
