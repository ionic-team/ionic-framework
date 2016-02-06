import {raf} from '../util/dom';


export class ScrollTo {
  public isPlaying: boolean;
  private _el: HTMLElement;

  constructor(ele: any) {
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

  start(x: number, y: number, duration: number, tolerance?: number): Promise<any> {
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

    let fromY = self._el.scrollTop;
    let fromX = self._el.scrollLeft;

    let xDistance = Math.abs(x - fromX);
    let yDistance = Math.abs(y - fromY);

    console.debug(`scrollTo start, y: ${y}, fromY: ${fromY}, yDistance: ${yDistance}, duration: ${duration}, tolerance: ${tolerance}`);

    if (yDistance <= tolerance && xDistance <= tolerance) {
      // prevent scrolling if already close to there
      self._el = null;
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      let startTime: number;

      // scroll loop
      function step() {
        if (!self._el) {
          return resolve();
        }

        let time = Math.min(1, ((Date.now() - startTime) / duration));

        // where .5 would be 50% of time on a linear scale easedT gives a
        // fraction based on the easing method
        let easedT = easeOutCubic(time);

        if (fromY != y) {
          self._el.scrollTop = (easedT * (y - fromY)) + fromY;
        }

        if (fromX != x) {
          self._el.scrollLeft = Math.round((easedT * (x - fromX)) + fromX);
        }

        console.debug(`scrollTo step, easedT: ${easedT}, scrollTop: ${self._el.scrollTop}`);

        if (time < 1 && self.isPlaying) {
          raf(step);

        } else if (!self.isPlaying) {
          // stopped
          self._el = null;
          reject();

        } else {
          // done
          self._el = null;
          console.debug(`scrollTo done`);
          resolve();
        }
      }

      // start scroll loop
      self.isPlaying = true;

      // chill out for a frame first
      raf(() => {
        startTime = Date.now();
        raf(step);
      });

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

// decelerating to zero velocity
function easeOutCubic(t) {
  return (--t) * t * t + 1;
}
