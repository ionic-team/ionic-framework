/* Forked from Collide.js, MIT License. Julian Shapiro http://twitter.com/shapiro */

import {dom} from 'ionic/util'


export let Collide = {

  /* Container for page-wide Collide state data. */
  State: {
    /* Create a cached element for re-use when checking for CSS property prefixes. */
    prefixElement: document.createElement('div'),

    /* Cache every prefix match to avoid repeating lookups. */
    prefixMatches: {},

    /* Cache the anchor used for animating window scrolling. */
    scrollAnchor: null,

    /* Cache the browser-specific property names associated with the scroll anchor. */
    scrollPropertyLeft: null,
    scrollPropertyTop: null,

    /* Keep track of whether our RAF tick is running. */
    isTicking: false,

    /* Container for every in-progress call to Collide. */
    calls: []
  },

  CSS: {},
  Easings: {},

  /* Collide option defaults, which can be overriden by the user. */
  defaults: {
    queue: '',
    duration: 400,
    easing: 'swing',
    begin: undefined,
    complete: undefined,
    progress: undefined,
    display: undefined,
    visibility: undefined,
    loop: false,
    delay: false,
    /* Advanced: Set to false to prevent property values from being cached between consecutive Collide-initiated chain calls. */
    _cacheValues: true
  },

  /* Used for getting/setting Collide's hooked CSS properties. */
  hook: null, /* Defined below. */

  /* Collide-wide animation time remapping for testing purposes. */
  mock: false,

  /* Set to 1 or 2 (most verbose) to output debug info to console. */
  debug: false,

  startTick: function() {
    /* If the animation tick isn't running, start it.
       Collide shuts it off when there are no active calls to process. */
    if (Collide.State.isTicking === false) {
      Collide.State.isTicking = true;

      /* Start the tick loop. */
      tick();
    }
  },

  /* initialize element data */
  initData: function(element) {
    element.$collide = {
      /* Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements. */
      isSVG: dom.isSVG(element),

      /* Keep track of whether the element is currently being animated by Collide.
         This is used to ensure that property values are not transferred between non-consecutive (stale) calls. */
      isAnimating: false,

      /* A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
      computedStyle: null,

      /* Tween data is cached for each animation on the element so that data can be passed across calls --
         in particular, end values are used as subsequent start values in consecutive Collide calls. */
      tweensContainer: null,

      /* The full root property values of each CSS hook being animated on this element are cached so that:
         1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
         2) Post-hook-injection root values can be transferred over to consecutively chained Collide calls as starting root values. */
      rootPropertyValueCache: {},

      /* A cache for transform updates, which must be manually flushed via CSS.flushTransformCache(). */
      transformCache: {}
    };
  },

  /* get/set element data */
  data: function(element, key, value) {
    if (value === undefined) {

      if (key === undefined) {
        // get data object: Data(element)
        return element.$collide;
      }

      if (element.$collide) {
        // get data by key: Data(element, key)
        return element.$collide[key];
      }

    } else if (key !== undefined) {
      // set data: Data(element, key, value)
      if (!element.$collide) {
        element.$collide = {};
      }
      element.$collide[key] = value;
    }

  },

  /* get/set element queue data */
  queue: function (element, type, data) {
    function $makeArray (arr, results) {
      let ret = results || [];

      if (arr != null) {
        [].push.call(ret, arr);
      }

      return ret;
    }

    if (!element) {
      return;
    }

    type = (type || 'collide') + 'queue';

    var q = this.data(element, type);

    if (!data) {
      return q || [];
    }

    if (!q || Array.isArray(data)) {
      q = this.data(element, type, $makeArray(data));

    } else {
      q.push(data);
    }

    return q;
  },

  /* dequeue element */
  dequeue: function (element, type) {
    type = type || 'collide';

    let queue = this.queue(element, type);
    let fn = queue.shift();

    if (fn === 'inprogress') {
      fn = queue.shift();
    }

    if (fn) {
      if (type === 'collide') {
        queue.unshift('inprogress');
      }

      fn.call(element, () => {
        this.dequeue(element, type);
      });
    }
  }

};
