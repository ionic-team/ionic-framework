import { CSS, pointerCoord, nativeRaf, cancelRaf } from '../util/dom';


export class ScrollView {
  private _el: HTMLElement;
  private _js: boolean = false;
  private _top: number = 0;
  private _pos: Array<number>;
  private _velocity: number;
  private _max: number;
  private _rafId: number;
  private _cb: Function;
  isPlaying: boolean;

  constructor(ele: HTMLElement) {
    this._el = ele;
  }

  getTop(): number {
    if (this._js) {
      return this._top;
    }

    return this._top = this._el.scrollTop;
  }

  setTop(top: number) {
    this._top = top;

    if (this._js) {
      (<any>this._el.style)[CSS.transform] = `translate3d(0px,${top * -1}px,0px)`;

    } else {
      this._el.scrollTop = top;
    }
  }

  scrollTo(x: number, y: number, duration: number): Promise<any> {
    // scroll animation loop w/ easing
    // credit https://gist.github.com/dezinezync/5487119
    let self = this;

    if (!self._el) {
      // invalid element
      return Promise.resolve();
    }

    x = x || 0;
    y = y || 0;

    let fromY = self._el.scrollTop;
    let fromX = self._el.scrollLeft;

    let maxAttempts = (duration / 16) + 100;

    return new Promise(resolve => {
      let startTime: number;
      let attempts = 0;

      // scroll loop
      function step() {
        attempts++;

        if (!self._el || !self.isPlaying || attempts > maxAttempts) {
          self.isPlaying = false;
          resolve();
          return;
        }

        let time = Math.min(1, ((Date.now() - startTime) / duration));

        // where .5 would be 50% of time on a linear scale easedT gives a
        // fraction based on the easing method
        let easedT = (--time) * time * time + 1;

        if (fromY !== y) {
          self.setTop((easedT * (y - fromY)) + fromY);
        }

        if (fromX !== x) {
          self._el.scrollLeft = Math.floor((easedT * (x - fromX)) + fromX);
        }

        if (easedT < 1) {
          nativeRaf(step);

        } else {
          // done
          resolve();
        }
      }

      // start scroll loop
      self.isPlaying = true;

      // chill out for a frame first
      nativeRaf(() => {
        startTime = Date.now();
        nativeRaf(step);
      });

    });
  }

  scrollToTop(duration: number): Promise<any> {
    return this.scrollTo(0, 0, duration);
  }

  scrollToBottom(duration: number): Promise<any> {
    let y = 0;
    if (this._el) {
      y = this._el.scrollHeight - this._el.clientHeight;
    }
    return this.scrollTo(0, y, duration);
  }

  stop() {
    this.isPlaying = false;
  }

  /**
   * @private
   * JS Scrolling has been provided only as a temporary solution
   * until iOS apps can take advantage of scroll events at all times.
   * The goal is to eventually remove JS scrolling entirely. This
   * method may be removed in the future.
   */
  jsScroll(onScrollCallback: Function): Function {
    this._js = true;
    this._cb = onScrollCallback;
    this._pos = [];

    if (this._el) {
      this._el.addEventListener('touchstart', this._start.bind(this));
      this._el.addEventListener('touchmove', this._move.bind(this));
      this._el.addEventListener('touchend', this._end.bind(this));
      this._el.parentElement.classList.add('js-scroll');
    }

    return () => {
      if (this._el) {
        this._el.removeEventListener('touchstart', this._start.bind(this));
        this._el.removeEventListener('touchmove', this._move.bind(this));
        this._el.removeEventListener('touchend', this._end.bind(this));
        this._el.parentElement.classList.remove('js-scroll');
      }
    };
  }

  /**
   * @private
   * Used for JS scrolling. May be removed in the future.
   */
  private _start(ev: UIEvent) {
    this._velocity = 0;
    this._pos.length = 0;
    this._max = null;
    this._pos.push(pointerCoord(ev).y, Date.now());
  }

  /**
   * @private
   * Used for JS scrolling. May be removed in the future.
   */
  private _move(ev: UIEvent) {
    if (this._pos.length) {
      let y = pointerCoord(ev).y;

      // ******** DOM READ ****************
      this._setMax();

      this._top -= (y - this._pos[this._pos.length - 2]);

      this._top = Math.min(Math.max(this._top, 0), this._max);

      this._pos.push(y, Date.now());

      // ******** DOM READ THEN DOM WRITE ****************
      this._cb(this._top);

      // ******** DOM WRITE ****************
      this.setTop(this._top);
    }
  }

  /**
   * @private
   * Used for JS scrolling. May be removed in the future.
   */
  private _setMax() {
    if (!this._max) {
      // ******** DOM READ ****************
      this._max = (this._el.offsetHeight - this._el.parentElement.offsetHeight + this._el.parentElement.offsetTop);
    }
  }

  /**
   * @private
   * Used for JS scrolling. May be removed in the future.
   */
  private _end(ev: UIEvent) {
    // figure out what the scroll position was about 100ms ago
    let positions = this._pos;
    this._velocity = 0;
    cancelRaf(this._rafId);

    if (!positions.length) return;

    let y = pointerCoord(ev).y;

    positions.push(y, Date.now());

    let endPos = (positions.length - 1);
    let startPos = endPos;
    let timeRange = (Date.now() - 100);

    // move pointer to position measured 100ms ago
    for (var i = endPos; i > 0 && positions[i] > timeRange; i -= 2) {
      startPos = i;
    }

    if (startPos !== endPos) {
      // compute relative movement between these two points
      let timeOffset = (positions[endPos] - positions[startPos]);
      let movedTop = (positions[startPos - 1] - positions[endPos - 1]);

      // based on XXms compute the movement to apply for each render step
      this._velocity = ((movedTop / timeOffset) * FRAME_MS);

      // verify that we have enough velocity to start deceleration
      if (Math.abs(this._velocity) > MIN_VELOCITY_START_DECELERATION) {
        // ******** DOM READ ****************
        this._setMax();

        this._rafId = nativeRaf(this._decelerate.bind(this));
      }
    }

    positions.length = 0;
  }

  /**
   * @private
   * Used for JS scrolling. May be removed in the future.
   */
  private _decelerate() {
    var self = this;

    if (self._velocity) {
      self._velocity *= DECELERATION_FRICTION;

      // update top with updated velocity
      // clamp top within scroll limits
      self._top = Math.min(Math.max(self._top + self._velocity, 0), self._max);

      // ******** DOM READ THEN DOM WRITE ****************
      self._cb(self._top);

      // ******** DOM WRITE ****************
      self.setTop(self._top);

      if (self._top > 0 && self._top < self._max && Math.abs(self._velocity) > MIN_VELOCITY_CONTINUE_DECELERATION) {
        self._rafId = nativeRaf(self._decelerate.bind(self));
      }
    }
  }

  /**
   * @private
   */
  destroy() {
    this._velocity = 0;
    this.stop();
    this._el = null;
  }

}

const MIN_VELOCITY_START_DECELERATION = 4;
const MIN_VELOCITY_CONTINUE_DECELERATION = 0.12;
const DECELERATION_FRICTION = 0.97;
const FRAME_MS = (1000 / 60);
