import * as util from 'ionic/util/util'
import {Collide} from './collide'
import {processElement} from './process-element'
import {animationStop} from './animation-stop'
import {startTick} from './tick'
import {dom} from 'ionic/util'

const data = Collide.data;


export class Animation {
  constructor() {
    this._elements = null;
    this._options = {};
    this._properties = {};
    this._resolve = null;
    this._call = null;
  }

  elements(ele) {
    if (!ele) {
      this._elements = null;
    } else {
      this._elements = !ele.length ? [ele] : ele;
    }
  }

  _setupElements(clearCache, onNextFrame) {

    // ensure another animation wasnt about to start
    if (this._nextAF) {
      dom.rafCancel(this._nextAF);
    }

    if (this.isAnimating()) {
      this.stop();
    }

    this._promise = new Promise(res => {
      this._resolve = res;
    });

    this._call = null;

    // in the next frame, do all the DOM GETs to load element info
    this._nextAF = dom.raf(() => {
      /**********************************
         Animation Call-Wide Variables
      **********************************/

      /* A container for CSS unit conversion ratios (e.g. %, rem, and em ==> px) that is used to cache ratios across all elements
         being animated in a single Collide call. Calculating unit ratios necessitates DOM querying and updating, and is therefore
         avoided (via caching) wherever possible. This container is call-wide instead of page-wide to avoid the risk of using stale
         conversion metrics across Collide animations that are not immediately consecutively chained. */
      this._unitConversion = {
        lastParent: null,
        lastPosition: null,
        lastFontSize: null,
        lastPercentToPxWidth: null,
        lastPercentToPxHeight: null,
        lastEmToPx: null,
        remToPx: null,
        vwToPx: null,
        vhToPx: null
      };

      this._call = [];

      this._options = util.extend({}, Collide.defaults, this._options);

      // get the elements ready
      for (var i = 0, ii = this._elements.length; i < ii; i++) {
        processElement('start', this, i, clearCache);
      }

      onNextFrame();
    });

  }

  _queueAnimation() {
    /* Switch on the element's animating flag. */
    if (this._call === null) return;

    var eleData;
    for (var i = 0, ii = this._elements.length, element; i < ii && (element = this._elements[i]); i++) {
      eleData = data(element);
      if (eleData) {
        eleData.isAnimating = true;
      }

      /*********************
          Auto-Dequeuing
      *********************/

      /* To fire the first non-custom-queue entry on an element, the element
         must be dequeued if its queue stack consists *solely* of the current call. (This can be determined by checking
         for the 'inprogress' item that is prepended to active queue stack arrays.) Regardless, whenever the element's
         queue is further appended with additional items -- including delay()'s calls, the queue's
         first entry is automatically fired. This behavior contrasts that of custom queues, which never auto-fire. */
      /* Note: When an element set is being subjected to a non-parallel Collide call, the animation will not begin until
         each one of the elements in the set has reached the end of its individually pre-existing queue chain. */
      if (this._options.queue === '' && Collide.queue(element)[0] !== 'inprogress') {
        Collide.dequeue(element);
      }
    }

    /* Once the final element in this call's element set has been processed, push the call array onto
       Collide.State.calls for the animation tick to immediately begin processing. */
    /* Add the current call plus its associated metadata (the element set and the call's options) onto the global call container.
       Anything on this call container is subjected to tick() processing. */
    Collide.State.calls.push([ this._call,
                               this._elements,
                               this._options,
                               null,
                               this._resolve ]);

    startTick();
  }

  start() {
    var clearCache = (this._aniType !== 'start');

    this._setupElements(clearCache, () => {
      this._aniType = 'start';
      this._queueAnimation();
    });

    return this._promise;
  }

  ready() {
    var clearCache = (this._aniType !== 'percent');

    this._setupElements(clearCache, () => {
      this._aniType = 'percent';
    });

    return this._promise;
  }

  percent(percentComplete) {
    // go to and stop at a specific point in the animation
    if (this._aniType = 'percent') {
      this._options.percentComplete = percentComplete;

      this._queueAnimation();

      startTick();
    }
  }

  stop() {
    // immediately stop where it's at
    animationStop(this._elements, 'stop');
  }

  finish() {
    // immediately go to the end of the animation
    animationStop(this._elements, 'finish');
  }

  isAnimating() {
    var eleData;
    if (this._elements) {
      for (var i = 0, ii = this._elements.length; i < ii; i++) {
        eleData = data(this._elements[i]);
        if (eleData && eleData.isAnimating) {
          return true;
        }
      }
    }
    return false;
  }


  /************
     Options
  ************/
  options(val) {
    this._options = val || {};
  }

  option(key, val) {
    this._options[key] = val;
  }

  removeOption(key) {
    delete this._options[key];
  }

  duration(val) {
    this._options.duration = val;
  }

  easing(val) {
    this._options.easing = val;
  }


  /**************************
     Properties
  **************************/

  properties(val) {
    this._properties = val || {};
  }

  property(key, val) {
    this._properties[key] = val;
  }

  removeProperty(key) {
    delete this._properties[key];
  }


  /**************************
     Misc
  **************************/

  debug(val) {
    Collide.debug = !!val;
  }

}
