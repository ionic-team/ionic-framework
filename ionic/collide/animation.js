import * as util from 'ionic/util/util'
import {Collide} from './collide'
import {processElement} from './process-element'
import {animationStop} from './animation-stop'
import {startTick} from './tick'
import {dom} from 'ionic/util'

const data = Collide.data;


export class Animation {
  constructor(ele) {
    this.parent = null;
    this._options = {};
    this._properties = {};
    this._resolve = null;
    this._call = null;

    this.children = [];

    this.elements(ele);
  }

  addChild(childAnimation) {
    childAnimation.parent = this;
    this.children.push(childAnimation);
    return this;
  }

  setChildren(childAnimations) {
    for (let i = 0; i < childAnimations.length; i++) {
      this.addChild(childAnimations[i]);
    }
    return this;
  }

  elements(ele) {
    this._ele = [];

    if (ele) {
      if (typeof ele === 'string') {
        ele = document.querySelectorAll(ele);
      }

      if (ele.length) {
        this._ele = ele;

      } else if (ele.nodeType) {
        this._ele.push(ele);
      }
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

    if (this._ele.length) {
      let promise = new Promise(res => {
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

        if (this.parent) {
          opts = util.extend(opts, this.parent._options);
        }

        this._options = util.extend(opts, this._options);

        // get the elements ready
        for (var i = 0, ii = this._ele.length; i < ii; i++) {
          processElement('start', this, i, clearCache);
        }

        onNextFrame();
      });

      return promise;
    }

    return Promise.resolve();
  }

  _queueAnimation() {
    if (this._ele.length) {

      if (this._call === null) {
        return;
      }

      var eleData;
      for (var i = 0, ii = this._ele.length, element; i < ii && (element = this._ele[i]); i++) {
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
                                 this._ele,
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

    var promise = this._setupElements(clearCache, () => {
      this._aniType = 'start';
      this._queueAnimation();
    });

    promises.push(promise);

    return Promise.all(promises);
  }

  ready() {
    var promises = [];
    for (var i = 0; i < this.children.length; i++) {
      promises.push(
        this.children[i].ready()
      );
    }

    var clearCache = (this._aniType !== 'progress');

    var promise = this._setupElements(clearCache, () => {
      this._aniType = 'progress';
    });

    promises.push(promise);

    return Promise.all(promises);
  }

  progress(value) {
    // go to and stop at a specific point in the animation

    if (this._aniType = 'progress') {
      this._options.percentComplete = value;

      for (var i = 0; i < this.children.length; i++) {
        this.children[i].progress(value);
      }

      this._queueAnimation();
    }
  }

  stop() {
    // immediately stop where it's at
    animationStop(this._ele, 'stop');
    return this;
  }

  finish() {
    // immediately go to the end of the animation
    animationStop(this._ele, 'finish');
    return this;
  }

  isAnimating() {
    var eleData;
    if (this._ele) {
      for (var i = 0, ii = this._ele.length; i < ii; i++) {
        eleData = data(this._ele[i]);
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

  duration(val) {
    this._options.duration = val;
    return this;
  }

  easing(val) {
    this._options.easing = val;
    return this;
  }

  display(val) {
    this._options.display = val;
    return this;
  }


  /***************
     Properties
  ***************/

  from(propertyName, value) {
    // [endValue, easing, startValue]
    let prop = this.getProperty(propertyName);
    prop[2] = value;
    return this;
  }

  to() {
    // [endValue, easing, startValue]
    if (arguments.length > 1) {
      let prop = this.getProperty(arguments[0]);
      prop[0] = arguments[1];
    } else {
      this._properties = arguments[0] || {};
    }
    return this;
  }

  getProperty(propertyName) {
    // [endValue, easing, startValue]
    if (!this._properties[propertyName]) {
      this._properties[propertyName] = [null, null, null];
    }
    return this._properties[propertyName];
  }


  /*********
     Misc
  *********/

  debug(val) {
    Collide.debug = !!val;
    return this;
  }

}
