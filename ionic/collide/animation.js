import * as util from 'ionic/util/util'
import {Collide} from './collide'
import {processElement} from './process-element'
import {animationStop} from './animation-stop'
import {startTick} from './tick'
import {dom} from 'ionic/util'

const data = Collide.data;


export class Animation {
  constructor() {
    this.parent = null;
    this._elements = null;
    this._options = {};
    this._properties = {};
    this._resolve = null;
    this._call = null;

    this.children = [];
  }

  addChild(animation) {
    animation.parent = this;
    this.children.push(animation);
    return this;
  }

  elements(ele) {
    if (ele && ele.length > 0) {
      this._elements = ele;

    } else if (ele && ele.nodeType) {
      this._elements = [ele];

    } else {
      this._elements = null;
    }

    return this;
  }

  _setupElements(clearCache, onNextFrame) {

    // ensure another animation wasnt about to start
    if (this._nextAF) {
      dom.rafCancel(this._nextAF);
    }

    if (this.isAnimating()) {
      this.stop();
    }

    if (this._elements && this._elements.length) {
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

        var opts = util.extend({}, Collide.defaults);

        if (this.parent && this.parent._options) {
          opts = util.extend(opts, this.parent._options);
        }

        this._options = util.extend(opts, this._options);

        // get the elements ready
        for (var i = 0, ii = this._elements.length; i < ii; i++) {
          processElement('start', this, i, clearCache);
        }

        onNextFrame();
      });

    } else {
      this._promise = Promise.resolve();
    }

  }

  _queueAnimation() {
    if (this._elements) {

      if (this._call === null) {
        return;
      }

      var eleData;
      for (var i = 0, ii = this._elements.length, element; i < ii && (element = this._elements[i]); i++) {
        if (element) {
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
      }

      /* Push the call array onto Collide.State.calls for the animation tick to immediately begin processing. */
      /* Add the current call plus its associated metadata (the element set and the call's options) onto the global call container.
         Anything on this call container is subjected to tick() processing. */
      Collide.State.calls.push([ this._call,
                                 this._elements,
                                 this._options,
                                 null,
                                 this._resolve ]);
    }

    startTick();
  }

  start() {
    var promises = [];
    for (var i = 0; i < this.children.length; i++) {
      promises.push(
        this.children[i].start()
      );
    }

    var clearCache = (this._aniType !== 'start');

    this._setupElements(clearCache, () => {
      this._aniType = 'start';
      this._queueAnimation();
    });

    promises.push(this._promise);

    return Promise.all(promises);
  }

  ready() {
    var promises = [];
    for (var i = 0; i < this.children.length; i++) {
      promises.push(
        this.children[i].ready()
      );
    }

    var clearCache = (this._aniType !== 'percent');

    this._setupElements(clearCache, () => {
      this._aniType = 'percent';
    });

    promises.push(this._promise);

    return Promise.all(promises);
  }

  percent(percentComplete) {
    // go to and stop at a specific point in the animation

    if (this._aniType = 'percent') {
      this._options.percentComplete = percentComplete;

      for (var i = 0; i < this.children.length; i++) {
        this.children[i].percent(percentComplete);
      }

      this._queueAnimation();
    }
  }

  stop() {
    // immediately stop where it's at
    animationStop(this._elements, 'stop');
    return this;
  }

  finish() {
    // immediately go to the end of the animation
    animationStop(this._elements, 'finish');
    return this;
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
    return this;
  }

  option(key, val) {
    this._options[key] = val;
    return this;
  }

  removeOption(key) {
    delete this._options[key];
    return this;
  }

  duration(val) {
    this._options.duration = val;
    return this;
  }

  easing(val) {
    this._options.easing = val;
    return this;
  }


  /***************
     Properties
  ***************/

  to() {
    if (arguments.length > 1) {
      this._properties[ arguments[0] ] = arguments[1];
    } else {
      this._properties = arguments[0] || {};
    }
    return this;
  }

  removeProperty(key) {
    delete this._properties[key];
    return this;
  }


  /*********
     Misc
  *********/

  debug(val) {
    Collide.debug = !!val;
    return this;
  }

}
