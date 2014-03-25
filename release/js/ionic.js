/*!
 * Copyright 2014 Drifty Co.
 * http://drifty.com/
 *
 * Ionic, v1.0.0-beta.1
 * A powerful HTML5 mobile app framework.
 * http://ionicframework.com/
 *
 * By @maxlynch, @benjsperry, @adamdbradley <3
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 *
 */

(function() {

// Create namespaces
//
window.ionic = {
  controllers: {},
  views: {},
  version: '1.0.0-beta.1'
};

(function(ionic) {

  var bezierCoord = function (x,y) {
    if(!x) x=0;
    if(!y) y=0;
    return {x: x, y: y};
  };

  function B1(t) { return t*t*t; }
  function B2(t) { return 3*t*t*(1-t); }
  function B3(t) { return 3*t*(1-t)*(1-t); }
  function B4(t) { return (1-t)*(1-t)*(1-t); }

  ionic.Animator = {
    // Quadratic bezier solver
    getQuadraticBezier: function(percent,C1,C2,C3,C4) {
      var pos = new bezierCoord();
      pos.x = C1.x*B1(percent) + C2.x*B2(percent) + C3.x*B3(percent) + C4.x*B4(percent);
      pos.y = C1.y*B1(percent) + C2.y*B2(percent) + C3.y*B3(percent) + C4.y*B4(percent);
      return pos;
    },

    // Cubic bezier solver from https://github.com/arian/cubic-bezier (MIT)
    getCubicBezier: function(x1, y1, x2, y2, duration) {
      // Precision
      epsilon = (1000 / 60 / duration) / 4;

      var curveX = function(t){
        var v = 1 - t;
        return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
      };

      var curveY = function(t){
        var v = 1 - t;
        return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
      };

      var derivativeCurveX = function(t){
        var v = 1 - t;
        return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
      };

      return function(t) {

        var x = t, t0, t1, t2, x2, d2, i;

        // First try a few iterations of Newton's method -- normally very fast.
        for (t2 = x, i = 0; i < 8; i++){
          x2 = curveX(t2) - x;
          if (Math.abs(x2) < epsilon) return curveY(t2);
          d2 = derivativeCurveX(t2);
          if (Math.abs(d2) < 1e-6) break;
          t2 = t2 - x2 / d2;
        }

        t0 = 0, t1 = 1, t2 = x;

        if (t2 < t0) return curveY(t0);
        if (t2 > t1) return curveY(t1);

        // Fallback to the bisection method for reliability.
        while (t0 < t1){
          x2 = curveX(t2);
          if (Math.abs(x2 - x) < epsilon) return curveY(t2);
          if (x > x2) t0 = t2;
          else t1 = t2;
          t2 = (t1 - t0) * 0.5 + t0;
        }

        // Failure
        return curveY(t2);
      };
    },

    animate: function(element, className, fn) {
      return {
        leave: function() {
          var endFunc = function() {

            element.classList.remove('leave');
            element.classList.remove('leave-active');

            element.removeEventListener('webkitTransitionEnd', endFunc);
            element.removeEventListener('transitionEnd', endFunc);
          };
          element.addEventListener('webkitTransitionEnd', endFunc);
          element.addEventListener('transitionEnd', endFunc);

          element.classList.add('leave');
          element.classList.add('leave-active');
          return this;
        },
        enter: function() {
          var endFunc = function() {

            element.classList.remove('enter');
            element.classList.remove('enter-active');

            element.removeEventListener('webkitTransitionEnd', endFunc);
            element.removeEventListener('transitionEnd', endFunc);
          };
          element.addEventListener('webkitTransitionEnd', endFunc);
          element.addEventListener('transitionEnd', endFunc);

          element.classList.add('enter');
          element.classList.add('enter-active');

          return this;
        }
      };
    }
  };
})(ionic);

(function(window, document, ionic) {

  var readyCallbacks = [];
  var isDomReady = false;

  function domReady() {
    isDomReady = true;
    for(var x=0; x<readyCallbacks.length; x++) {
      ionic.requestAnimationFrame(readyCallbacks[x]);
    }
    readyCallbacks = [];
    document.removeEventListener('DOMContentLoaded', domReady);
  }
  document.addEventListener('DOMContentLoaded', domReady);

  // From the man himself, Mr. Paul Irish.
  // The requestAnimationFrame polyfill
  // Put it on window just to preserve its context
  // without having to use .call
  window._rAF = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 16);
            };
  })();

  /**
  * @ngdoc utility
  * @name ionic.DomUtil
  * @module ionic
  */
  ionic.DomUtil = {
    //Call with proper context
    /**
     * @ngdoc method
     * @name ionic.DomUtil#requestAnimationFrame
     * @alias ionic.requestAnimationFrame
     * @description Calls [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame), or a polyfill if not available.
     * @param {function} callback The function to call when the next frame
     * happens.
     */
    requestAnimationFrame: function(cb) {
      window._rAF(cb);
    },

    /**
     * @ngdoc method
     * @name ionic.DomUtil#animationFrameThrottle
     * @alias ionic.animationFrameThrottle
     * @description
     * When given a callback, if that callback is called 100 times between
     * animation frames, adding Throttle will make it only run the last of
     * the 100 calls.
     *
     * @param {function} callback a function which will be throttled to
     * requestAnimationFrame
     * @returns {function} A function which will then call the passed in callback.
     * The passed in callback will receive the context the returned function is
     * called with.
     */
    animationFrameThrottle: function(cb) {
      var args, isQueued, context;
      return function() {
        args = arguments;
        context = this;
        if (!isQueued) {
          isQueued = true;
          ionic.requestAnimationFrame(function() {
            cb.apply(context, args);
            isQueued = false;
          });
        }
      };
    },

    /**
     * @ngdoc method
     * @name ionic.DomUtil#getPositionInParent
     * @description
     * Find an element's scroll offset within its container.
     * @param {DOMElement} element The element to find the offset of.
     * @returns {object} A position object with the following properties:
     *   - `{number}` `left` The left offset of the element.
     *   - `{number}` `top` The top offset of the element.
     */
    getPositionInParent: function(el) {
      return {
        left: el.offsetLeft,
        top: el.offsetTop
      };
    },

    /**
     * @ngdoc method
     * @name ionic.DomUtil#ready
     * @description
     * Call a function when the DOM is ready, or if it is already ready
     * call the function immediately.
     * @param {function} callback The function to be called.
     */
    ready: function(cb) {
      if(isDomReady || document.readyState === "complete") {
        ionic.requestAnimationFrame(cb);
      } else {
        readyCallbacks.push(cb);
      }
    },

    /**
     * @ngdoc method
     * @name ionic.DomUtil#getTextBounds
     * @description
     * Get a rect representing the bounds of the given textNode.
     * @param {DOMElement} textNode The textNode to find the bounds of.
     * @returns {object} An object representing the bounds of the node. Properties:
     *   - `{number}` `left` The left positton of the textNode.
     *   - `{number}` `right` The right positton of the textNode.
     *   - `{number}` `top` The top positton of the textNode.
     *   - `{number}` `bottom` The bottom position of the textNode.
     *   - `{number}` `width` The width of the textNode.
     *   - `{number}` `height` The height of the textNode.
     */
    getTextBounds: function(textNode) {
      if(document.createRange) {
        var range = document.createRange();
        range.selectNodeContents(textNode);
        if(range.getBoundingClientRect) {
          var rect = range.getBoundingClientRect();
          if(rect) {
            var sx = window.scrollX;
            var sy = window.scrollY;

            return {
              top: rect.top + sy,
              left: rect.left + sx,
              right: rect.left + sx + rect.width,
              bottom: rect.top + sy + rect.height,
              width: rect.width,
              height: rect.height
            };
          }
        }
      }
      return null;
    },

    /**
     * @ngdoc method
     * @name ionic.DomUtil#getChildIndex
     * @description
     * Get the first index of a child node within the given element of the
     * specified type.
     * @param {DOMElement} element The element to find the index of.
     * @param {string} type The nodeName to match children of element against.
     * @returns {number} The index, or -1, of a child with nodeName matching type.
     */
    getChildIndex: function(element, type) {
      if(type) {
        var ch = element.parentNode.children;
        var c;
        for(var i = 0, k = 0, j = ch.length; i < j; i++) {
          c = ch[i];
          if(c.nodeName && c.nodeName.toLowerCase() == type) {
            if(c == element) {
              return k;
            }
            k++;
          }
        }
      }
      return Array.prototype.slice.call(element.parentNode.children).indexOf(element);
    },

    /**
     * @private
     */
    swapNodes: function(src, dest) {
      dest.parentNode.insertBefore(src, dest);
    },
    /**
     * @ngdoc method
     * @name ionic.DomUtil#getParentWithClass
     * @param {DOMElement} element
     * @param {string} className
     * @returns {DOMElement} The closest parent of element matching the
     * className, or null.
     */
    getParentWithClass: function(e, className, depth) {
      depth = depth || 10;
      while(e.parentNode && depth--) {
        if(e.parentNode.classList && e.parentNode.classList.contains(className)) {
          return e.parentNode;
        }
        e = e.parentNode;
      }
      return null;
    },
    /**
     * @ngdoc method
     * @name ionic.DomUtil#getParentWithClass
     * @param {DOMElement} element
     * @param {string} className
     * @returns {DOMElement} The closest parent or self matching the
     * className, or null.
     */
    getParentOrSelfWithClass: function(e, className, depth) {
      depth = depth || 10;
      while(e && depth--) {
        if(e.classList && e.classList.contains(className)) {
          return e;
        }
        e = e.parentNode;
      }
      return null;
    },

    /**
     * @ngdoc method
     * @name ionic.DomUtil#rectContains
     * @param {number} x
     * @param {number} y
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @returns {boolean} Whether {x,y} fits within the rectangle defined by
     * {x1,y1,x2,y2}.
     */
    rectContains: function(x, y, x1, y1, x2, y2) {
      if(x < x1 || x > x2) return false;
      if(y < y1 || y > y2) return false;
      return true;
    }
  };

  //Shortcuts
  ionic.requestAnimationFrame = ionic.DomUtil.requestAnimationFrame;
  ionic.animationFrameThrottle = ionic.DomUtil.animationFrameThrottle;
})(this, document, ionic);

/**
 * ion-events.js
 *
 * Author: Max Lynch <max@drifty.com>
 *
 * Framework events handles various mobile browser events, and
 * detects special events like tap/swipe/etc. and emits them
 * as custom events that can be used in an app.
 *
 * Portions lovingly adapted from github.com/maker/ratchet and github.com/alexgibson/tap.js - thanks guys!
 */

(function(ionic) {

  // Custom event polyfill
  if(!window.CustomEvent) {
    (function() {
      var CustomEvent;

      CustomEvent = function(event, params) {
        var evt;
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined
        };
        try {
          evt = document.createEvent("CustomEvent");
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        } catch (error) {
          // fallback for browsers that don't support createEvent('CustomEvent')
          evt = document.createEvent("Event");
          for (var param in params) {
            evt[param] = params[param];
          }
          evt.initEvent(event, params.bubbles, params.cancelable);
        }
        return evt;
      };

      CustomEvent.prototype = window.Event.prototype;

      window.CustomEvent = CustomEvent;
    })();
  }


  /**
   * @ngdoc utility
   * @name ionic.EventController
   * @module ionic
   */
  ionic.EventController = {
    VIRTUALIZED_EVENTS: ['tap', 'swipe', 'swiperight', 'swipeleft', 'drag', 'hold', 'release'],

    /**
     * @ngdoc method
     * @name ionic.EventController#trigger
     * @alias ionic.trigger
     * @param {string} eventType The event to trigger.
     * @param {object} data The data for the event. Hint: pass in
     * `{target: targetElement}`
     * @param {boolean=} bubbles Whether the event should bubble up the DOM.
     * @param {boolean=} cancelable Whether the event should be cancelable.
     */
    // Trigger a new event
    trigger: function(eventType, data, bubbles, cancelable) {
      var event = new CustomEvent(eventType, {
        detail: data,
        bubbles: !!bubbles,
        cancelable: !!cancelable
      });

      // Make sure to trigger the event on the given target, or dispatch it from
      // the window if we don't have an event target
      data && data.target && data.target.dispatchEvent(event) || window.dispatchEvent(event);
    },

    /**
     * @ngdoc method
     * @name ionic.EventController#on
     * @alias ionic.on
     * @description Listen to an event on an element.
     * @param {string} type The event to listen for.
     * @param {function} callback The listener to be called.
     * @param {DOMElement} element The element to listen for the event on.
     */
    on: function(type, callback, element) {
      var e = element || window;

      // Bind a gesture if it's a virtual event
      for(var i = 0, j = this.VIRTUALIZED_EVENTS.length; i < j; i++) {
        if(type == this.VIRTUALIZED_EVENTS[i]) {
          var gesture = new ionic.Gesture(element);
          gesture.on(type, callback);
          return gesture;
        }
      }

      // Otherwise bind a normal event
      e.addEventListener(type, callback);
    },

    /**
     * @ngdoc method
     * @name ionic.EventController#off
     * @alias ionic.off
     * @description Remove an event listener.
     * @param {string} type
     * @param {function} callback
     * @param {DOMElement} element
     */
    off: function(type, callback, element) {
      element.removeEventListener(type, callback);
    },

    /**
     * @ngdoc method
     * @name ionic.EventController#onGesture
     * @alias ionic.onGesture
     * @description Add an event listener for a gesture on an element.
     * @param {string} eventType The gesture event to listen for.
     * @param {function(e)} callback The function to call when the gesture
     * happens.
     * @param {DOMElement} element The angular element to listen for the event on.
     */
    onGesture: function(type, callback, element) {
      var gesture = new ionic.Gesture(element);
      gesture.on(type, callback);
      return gesture;
    },

    /**
     * @ngdoc method
     * @name ionic.EventController#offGesture
     * @alias ionic.offGesture
     * @description Remove an event listener for a gesture on an element.
     * @param {string} eventType The gesture event.
     * @param {function(e)} callback The listener that was added earlier.
     * @param {DOMElement} element The element the listener was added on.
     */
    offGesture: function(gesture, type, callback) {
      gesture.off(type, callback);
    },

    handlePopState: function(event) {
    },
  };


  // Map some convenient top-level functions for event handling
  ionic.on = function() { ionic.EventController.on.apply(ionic.EventController, arguments); };
  ionic.off = function() { ionic.EventController.off.apply(ionic.EventController, arguments); };
  ionic.trigger = ionic.EventController.trigger;//function() { ionic.EventController.trigger.apply(ionic.EventController.trigger, arguments); };
  ionic.onGesture = function() { return ionic.EventController.onGesture.apply(ionic.EventController.onGesture, arguments); };
  ionic.offGesture = function() { return ionic.EventController.offGesture.apply(ionic.EventController.offGesture, arguments); };

})(window.ionic);

/**
  * Simple gesture controllers with some common gestures that emit
  * gesture events.
  *
  * Ported from github.com/EightMedia/hammer.js Gestures - thanks!
  */
(function(ionic) {

  /**
   * ionic.Gestures
   * use this to create instances
   * @param   {HTMLElement}   element
   * @param   {Object}        options
   * @returns {ionic.Gestures.Instance}
   * @constructor
   */
  ionic.Gesture = function(element, options) {
    return new ionic.Gestures.Instance(element, options || {});
  };

  ionic.Gestures = {};

  // default settings
  ionic.Gestures.defaults = {
    // add css to the element to prevent the browser from doing
    // its native behavior. this doesnt prevent the scrolling,
    // but cancels the contextmenu, tap highlighting etc
    // set to false to disable this
    stop_browser_behavior: 'disable-user-behavior'
  };

  // detect touchevents
  ionic.Gestures.HAS_POINTEREVENTS = window.navigator.pointerEnabled || window.navigator.msPointerEnabled;
  ionic.Gestures.HAS_TOUCHEVENTS = ('ontouchstart' in window);

  // dont use mouseevents on mobile devices
  ionic.Gestures.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i;
  ionic.Gestures.NO_MOUSEEVENTS = ionic.Gestures.HAS_TOUCHEVENTS && window.navigator.userAgent.match(ionic.Gestures.MOBILE_REGEX);

  // eventtypes per touchevent (start, move, end)
  // are filled by ionic.Gestures.event.determineEventTypes on setup
  ionic.Gestures.EVENT_TYPES = {};

  // direction defines
  ionic.Gestures.DIRECTION_DOWN = 'down';
  ionic.Gestures.DIRECTION_LEFT = 'left';
  ionic.Gestures.DIRECTION_UP = 'up';
  ionic.Gestures.DIRECTION_RIGHT = 'right';

  // pointer type
  ionic.Gestures.POINTER_MOUSE = 'mouse';
  ionic.Gestures.POINTER_TOUCH = 'touch';
  ionic.Gestures.POINTER_PEN = 'pen';

  // touch event defines
  ionic.Gestures.EVENT_START = 'start';
  ionic.Gestures.EVENT_MOVE = 'move';
  ionic.Gestures.EVENT_END = 'end';

  // hammer document where the base events are added at
  ionic.Gestures.DOCUMENT = window.document;

  // plugins namespace
  ionic.Gestures.plugins = {};

  // if the window events are set...
  ionic.Gestures.READY = false;

  /**
   * setup events to detect gestures on the document
   */
  function setup() {
    if(ionic.Gestures.READY) {
      return;
    }

    // find what eventtypes we add listeners to
    ionic.Gestures.event.determineEventTypes();

    // Register all gestures inside ionic.Gestures.gestures
    for(var name in ionic.Gestures.gestures) {
      if(ionic.Gestures.gestures.hasOwnProperty(name)) {
        ionic.Gestures.detection.register(ionic.Gestures.gestures[name]);
      }
    }

    // Add touch events on the document
    ionic.Gestures.event.onTouch(ionic.Gestures.DOCUMENT, ionic.Gestures.EVENT_MOVE, ionic.Gestures.detection.detect);
    ionic.Gestures.event.onTouch(ionic.Gestures.DOCUMENT, ionic.Gestures.EVENT_END, ionic.Gestures.detection.detect);

    // ionic.Gestures is ready...!
    ionic.Gestures.READY = true;
  }

  /**
   * create new hammer instance
   * all methods should return the instance itself, so it is chainable.
   * @param   {HTMLElement}       element
   * @param   {Object}            [options={}]
   * @returns {ionic.Gestures.Instance}
   * @name Gesture.Instance
   * @constructor
   */
  ionic.Gestures.Instance = function(element, options) {
    var self = this;

    // A null element was passed into the instance, which means
    // whatever lookup was done to find this element failed to find it
    // so we can't listen for events on it.
    if(element === null) {
      void 0;
      return;
    }

    // setup ionic.GesturesJS window events and register all gestures
    // this also sets up the default options
    setup();

    this.element = element;

    // start/stop detection option
    this.enabled = true;

    // merge options
    this.options = ionic.Gestures.utils.extend(
        ionic.Gestures.utils.extend({}, ionic.Gestures.defaults),
        options || {});

    // add some css to the element to prevent the browser from doing its native behavoir
    if(this.options.stop_browser_behavior) {
      ionic.Gestures.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior);
    }

    // start detection on touchstart
    ionic.Gestures.event.onTouch(element, ionic.Gestures.EVENT_START, function(ev) {
      if(self.enabled) {
        ionic.Gestures.detection.startDetect(self, ev);
      }
    });

    // return instance
    return this;
  };


  ionic.Gestures.Instance.prototype = {
    /**
     * bind events to the instance
     * @param   {String}      gesture
     * @param   {Function}    handler
     * @returns {ionic.Gestures.Instance}
     */
    on: function onEvent(gesture, handler){
      var gestures = gesture.split(' ');
      for(var t=0; t<gestures.length; t++) {
        this.element.addEventListener(gestures[t], handler, false);
      }
      return this;
    },


    /**
     * unbind events to the instance
     * @param   {String}      gesture
     * @param   {Function}    handler
     * @returns {ionic.Gestures.Instance}
     */
    off: function offEvent(gesture, handler){
      var gestures = gesture.split(' ');
      for(var t=0; t<gestures.length; t++) {
        this.element.removeEventListener(gestures[t], handler, false);
      }
      return this;
    },


    /**
     * trigger gesture event
     * @param   {String}      gesture
     * @param   {Object}      eventData
     * @returns {ionic.Gestures.Instance}
     */
    trigger: function triggerEvent(gesture, eventData){
      // create DOM event
      var event = ionic.Gestures.DOCUMENT.createEvent('Event');
      event.initEvent(gesture, true, true);
      event.gesture = eventData;

      // trigger on the target if it is in the instance element,
      // this is for event delegation tricks
      var element = this.element;
      if(ionic.Gestures.utils.hasParent(eventData.target, element)) {
        element = eventData.target;
      }

      element.dispatchEvent(event);
      return this;
    },


    /**
     * enable of disable hammer.js detection
     * @param   {Boolean}   state
     * @returns {ionic.Gestures.Instance}
     */
    enable: function enable(state) {
      this.enabled = state;
      return this;
    }
  };

  /**
   * this holds the last move event,
   * used to fix empty touchend issue
   * see the onTouch event for an explanation
   * type {Object}
   */
  var last_move_event = null;


  /**
   * when the mouse is hold down, this is true
   * type {Boolean}
   */
  var enable_detect = false;


  /**
   * when touch events have been fired, this is true
   * type {Boolean}
   */
  var touch_triggered = false;


  ionic.Gestures.event = {
    /**
     * simple addEventListener
     * @param   {HTMLElement}   element
     * @param   {String}        type
     * @param   {Function}      handler
     */
    bindDom: function(element, type, handler) {
      var types = type.split(' ');
      for(var t=0; t<types.length; t++) {
        element.addEventListener(types[t], handler, false);
      }
    },


    /**
     * touch events with mouse fallback
     * @param   {HTMLElement}   element
     * @param   {String}        eventType        like ionic.Gestures.EVENT_MOVE
     * @param   {Function}      handler
     */
    onTouch: function onTouch(element, eventType, handler) {
      var self = this;

      this.bindDom(element, ionic.Gestures.EVENT_TYPES[eventType], function bindDomOnTouch(ev) {
        var sourceEventType = ev.type.toLowerCase();

        // onmouseup, but when touchend has been fired we do nothing.
        // this is for touchdevices which also fire a mouseup on touchend
        if(sourceEventType.match(/mouse/) && touch_triggered) {
          return;
        }

        // mousebutton must be down or a touch event
        else if( sourceEventType.match(/touch/) ||   // touch events are always on screen
          sourceEventType.match(/pointerdown/) || // pointerevents touch
          (sourceEventType.match(/mouse/) && ev.which === 1)   // mouse is pressed
          ){
            enable_detect = true;
          }

        // mouse isn't pressed
        else if(sourceEventType.match(/mouse/) && ev.which !== 1) {
          enable_detect = false;
        }


        // we are in a touch event, set the touch triggered bool to true,
        // this for the conflicts that may occur on ios and android
        if(sourceEventType.match(/touch|pointer/)) {
          touch_triggered = true;
        }

        // count the total touches on the screen
        var count_touches = 0;

        // when touch has been triggered in this detection session
        // and we are now handling a mouse event, we stop that to prevent conflicts
        if(enable_detect) {
          // update pointerevent
          if(ionic.Gestures.HAS_POINTEREVENTS && eventType != ionic.Gestures.EVENT_END) {
            count_touches = ionic.Gestures.PointerEvent.updatePointer(eventType, ev);
          }
          // touch
          else if(sourceEventType.match(/touch/)) {
            count_touches = ev.touches.length;
          }
          // mouse
          else if(!touch_triggered) {
            count_touches = sourceEventType.match(/up/) ? 0 : 1;
          }

          // if we are in a end event, but when we remove one touch and
          // we still have enough, set eventType to move
          if(count_touches > 0 && eventType == ionic.Gestures.EVENT_END) {
            eventType = ionic.Gestures.EVENT_MOVE;
          }
          // no touches, force the end event
          else if(!count_touches) {
            eventType = ionic.Gestures.EVENT_END;
          }

          // store the last move event
          if(count_touches || last_move_event === null) {
            last_move_event = ev;
          }

          // trigger the handler
          handler.call(ionic.Gestures.detection, self.collectEventData(element, eventType, self.getTouchList(last_move_event, eventType), ev));

          // remove pointerevent from list
          if(ionic.Gestures.HAS_POINTEREVENTS && eventType == ionic.Gestures.EVENT_END) {
            count_touches = ionic.Gestures.PointerEvent.updatePointer(eventType, ev);
          }
        }

        //debug(sourceEventType +" "+ eventType);

        // on the end we reset everything
        if(!count_touches) {
          last_move_event = null;
          enable_detect = false;
          touch_triggered = false;
          ionic.Gestures.PointerEvent.reset();
        }
      });
    },


    /**
     * we have different events for each device/browser
     * determine what we need and set them in the ionic.Gestures.EVENT_TYPES constant
     */
    determineEventTypes: function determineEventTypes() {
      // determine the eventtype we want to set
      var types;

      // pointerEvents magic
      if(ionic.Gestures.HAS_POINTEREVENTS) {
        types = ionic.Gestures.PointerEvent.getEvents();
      }
      // on Android, iOS, blackberry, windows mobile we dont want any mouseevents
      else if(ionic.Gestures.NO_MOUSEEVENTS) {
        types = [
          'touchstart',
          'touchmove',
          'touchend touchcancel'];
      }
      // for non pointer events browsers and mixed browsers,
      // like chrome on windows8 touch laptop
      else {
        types = [
          'touchstart mousedown',
          'touchmove mousemove',
          'touchend touchcancel mouseup'];
      }

      ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_START]  = types[0];
      ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_MOVE]   = types[1];
      ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_END]    = types[2];
    },


    /**
     * create touchlist depending on the event
     * @param   {Object}    ev
     * @param   {String}    eventType   used by the fakemultitouch plugin
     */
    getTouchList: function getTouchList(ev/*, eventType*/) {
      // get the fake pointerEvent touchlist
      if(ionic.Gestures.HAS_POINTEREVENTS) {
        return ionic.Gestures.PointerEvent.getTouchList();
      }
      // get the touchlist
      else if(ev.touches) {
        return ev.touches;
      }
      // make fake touchlist from mouse position
      else {
        ev.indentifier = 1;
        return [ev];
      }
    },


    /**
     * collect event data for ionic.Gestures js
     * @param   {HTMLElement}   element
     * @param   {String}        eventType        like ionic.Gestures.EVENT_MOVE
     * @param   {Object}        eventData
     */
    collectEventData: function collectEventData(element, eventType, touches, ev) {

      // find out pointerType
      var pointerType = ionic.Gestures.POINTER_TOUCH;
      if(ev.type.match(/mouse/) || ionic.Gestures.PointerEvent.matchType(ionic.Gestures.POINTER_MOUSE, ev)) {
        pointerType = ionic.Gestures.POINTER_MOUSE;
      }

      return {
        center      : ionic.Gestures.utils.getCenter(touches),
                    timeStamp   : new Date().getTime(),
                    target      : ev.target,
                    touches     : touches,
                    eventType   : eventType,
                    pointerType : pointerType,
                    srcEvent    : ev,

                    /**
                     * prevent the browser default actions
                     * mostly used to disable scrolling of the browser
                     */
                    preventDefault: function() {
                      if(this.srcEvent.preventManipulation) {
                        this.srcEvent.preventManipulation();
                      }

                      if(this.srcEvent.preventDefault) {
                        //this.srcEvent.preventDefault();
                      }
                    },

                    /**
                     * stop bubbling the event up to its parents
                     */
                    stopPropagation: function() {
                      this.srcEvent.stopPropagation();
                    },

                    /**
                     * immediately stop gesture detection
                     * might be useful after a swipe was detected
                     * @return {*}
                     */
                    stopDetect: function() {
                      return ionic.Gestures.detection.stopDetect();
                    }
      };
    }
  };

  ionic.Gestures.PointerEvent = {
    /**
     * holds all pointers
     * type {Object}
     */
    pointers: {},

    /**
     * get a list of pointers
     * @returns {Array}     touchlist
     */
    getTouchList: function() {
      var self = this;
      var touchlist = [];

      // we can use forEach since pointerEvents only is in IE10
      Object.keys(self.pointers).sort().forEach(function(id) {
        touchlist.push(self.pointers[id]);
      });
      return touchlist;
    },

    /**
     * update the position of a pointer
     * @param   {String}   type             ionic.Gestures.EVENT_END
     * @param   {Object}   pointerEvent
     */
    updatePointer: function(type, pointerEvent) {
      if(type == ionic.Gestures.EVENT_END) {
        this.pointers = {};
      }
      else {
        pointerEvent.identifier = pointerEvent.pointerId;
        this.pointers[pointerEvent.pointerId] = pointerEvent;
      }

      return Object.keys(this.pointers).length;
    },

    /**
     * check if ev matches pointertype
     * @param   {String}        pointerType     ionic.Gestures.POINTER_MOUSE
     * @param   {PointerEvent}  ev
     */
    matchType: function(pointerType, ev) {
      if(!ev.pointerType) {
        return false;
      }

      var types = {};
      types[ionic.Gestures.POINTER_MOUSE] = (ev.pointerType == ev.MSPOINTER_TYPE_MOUSE || ev.pointerType == ionic.Gestures.POINTER_MOUSE);
      types[ionic.Gestures.POINTER_TOUCH] = (ev.pointerType == ev.MSPOINTER_TYPE_TOUCH || ev.pointerType == ionic.Gestures.POINTER_TOUCH);
      types[ionic.Gestures.POINTER_PEN] = (ev.pointerType == ev.MSPOINTER_TYPE_PEN || ev.pointerType == ionic.Gestures.POINTER_PEN);
      return types[pointerType];
    },


    /**
     * get events
     */
    getEvents: function() {
      return [
        'pointerdown MSPointerDown',
      'pointermove MSPointerMove',
      'pointerup pointercancel MSPointerUp MSPointerCancel'
        ];
    },

    /**
     * reset the list
     */
    reset: function() {
      this.pointers = {};
    }
  };


  ionic.Gestures.utils = {
    /**
     * extend method,
     * also used for cloning when dest is an empty object
     * @param   {Object}    dest
     * @param   {Object}    src
     * @param	{Boolean}	merge		do a merge
     * @returns {Object}    dest
     */
    extend: function extend(dest, src, merge) {
      for (var key in src) {
        if(dest[key] !== undefined && merge) {
          continue;
        }
        dest[key] = src[key];
      }
      return dest;
    },


    /**
     * find if a node is in the given parent
     * used for event delegation tricks
     * @param   {HTMLElement}   node
     * @param   {HTMLElement}   parent
     * @returns {boolean}       has_parent
     */
    hasParent: function(node, parent) {
      while(node){
        if(node == parent) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    },


    /**
     * get the center of all the touches
     * @param   {Array}     touches
     * @returns {Object}    center
     */
    getCenter: function getCenter(touches) {
      var valuesX = [], valuesY = [];

      for(var t= 0,len=touches.length; t<len; t++) {
        valuesX.push(touches[t].pageX);
        valuesY.push(touches[t].pageY);
      }

      return {
        pageX: ((Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2),
          pageY: ((Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2)
      };
    },


    /**
     * calculate the velocity between two points
     * @param   {Number}    delta_time
     * @param   {Number}    delta_x
     * @param   {Number}    delta_y
     * @returns {Object}    velocity
     */
    getVelocity: function getVelocity(delta_time, delta_x, delta_y) {
      return {
        x: Math.abs(delta_x / delta_time) || 0,
        y: Math.abs(delta_y / delta_time) || 0
      };
    },


    /**
     * calculate the angle between two coordinates
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {Number}    angle
     */
    getAngle: function getAngle(touch1, touch2) {
      var y = touch2.pageY - touch1.pageY,
      x = touch2.pageX - touch1.pageX;
      return Math.atan2(y, x) * 180 / Math.PI;
    },


    /**
     * angle to direction define
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {String}    direction constant, like ionic.Gestures.DIRECTION_LEFT
     */
    getDirection: function getDirection(touch1, touch2) {
      var x = Math.abs(touch1.pageX - touch2.pageX),
      y = Math.abs(touch1.pageY - touch2.pageY);

      if(x >= y) {
        return touch1.pageX - touch2.pageX > 0 ? ionic.Gestures.DIRECTION_LEFT : ionic.Gestures.DIRECTION_RIGHT;
      }
      else {
        return touch1.pageY - touch2.pageY > 0 ? ionic.Gestures.DIRECTION_UP : ionic.Gestures.DIRECTION_DOWN;
      }
    },


    /**
     * calculate the distance between two touches
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {Number}    distance
     */
    getDistance: function getDistance(touch1, touch2) {
      var x = touch2.pageX - touch1.pageX,
      y = touch2.pageY - touch1.pageY;
      return Math.sqrt((x*x) + (y*y));
    },


    /**
     * calculate the scale factor between two touchLists (fingers)
     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
     * @param   {Array}     start
     * @param   {Array}     end
     * @returns {Number}    scale
     */
    getScale: function getScale(start, end) {
      // need two fingers...
      if(start.length >= 2 && end.length >= 2) {
        return this.getDistance(end[0], end[1]) /
          this.getDistance(start[0], start[1]);
      }
      return 1;
    },


    /**
     * calculate the rotation degrees between two touchLists (fingers)
     * @param   {Array}     start
     * @param   {Array}     end
     * @returns {Number}    rotation
     */
    getRotation: function getRotation(start, end) {
      // need two fingers
      if(start.length >= 2 && end.length >= 2) {
        return this.getAngle(end[1], end[0]) -
          this.getAngle(start[1], start[0]);
      }
      return 0;
    },


    /**
     * boolean if the direction is vertical
     * @param    {String}    direction
     * @returns  {Boolean}   is_vertical
     */
    isVertical: function isVertical(direction) {
      return (direction == ionic.Gestures.DIRECTION_UP || direction == ionic.Gestures.DIRECTION_DOWN);
    },


    /**
     * stop browser default behavior with css class
     * @param   {HtmlElement}   element
     * @param   {Object}        css_class
     */
    stopDefaultBrowserBehavior: function stopDefaultBrowserBehavior(element, css_class) {
      // changed from making many style changes to just adding a preset classname
      // less DOM manipulations, less code, and easier to control in the CSS side of things
      // hammer.js doesn't come with CSS, but ionic does, which is why we prefer this method
      if(element && element.classList) {
        element.classList.add(css_class);
        element.onselectstart = function() {
          return false;
        };
      }
    }
  };


  ionic.Gestures.detection = {
    // contains all registred ionic.Gestures.gestures in the correct order
    gestures: [],

    // data of the current ionic.Gestures.gesture detection session
    current: null,

    // the previous ionic.Gestures.gesture session data
    // is a full clone of the previous gesture.current object
    previous: null,

    // when this becomes true, no gestures are fired
    stopped: false,


    /**
     * start ionic.Gestures.gesture detection
     * @param   {ionic.Gestures.Instance}   inst
     * @param   {Object}            eventData
     */
    startDetect: function startDetect(inst, eventData) {
      // already busy with a ionic.Gestures.gesture detection on an element
      if(this.current) {
        return;
      }

      this.stopped = false;

      this.current = {
        inst        : inst, // reference to ionic.GesturesInstance we're working for
        startEvent  : ionic.Gestures.utils.extend({}, eventData), // start eventData for distances, timing etc
        lastEvent   : false, // last eventData
        name        : '' // current gesture we're in/detected, can be 'tap', 'hold' etc
      };

      this.detect(eventData);
    },


    /**
     * ionic.Gestures.gesture detection
     * @param   {Object}    eventData
     */
    detect: function detect(eventData) {
      if(!this.current || this.stopped) {
        return;
      }

      // extend event data with calculations about scale, distance etc
      eventData = this.extendEventData(eventData);

      // instance options
      var inst_options = this.current.inst.options;

      // call ionic.Gestures.gesture handlers
      for(var g=0,len=this.gestures.length; g<len; g++) {
        var gesture = this.gestures[g];

        // only when the instance options have enabled this gesture
        if(!this.stopped && inst_options[gesture.name] !== false) {
          // if a handler returns false, we stop with the detection
          if(gesture.handler.call(gesture, eventData, this.current.inst) === false) {
            this.stopDetect();
            break;
          }
        }
      }

      // store as previous event event
      if(this.current) {
        this.current.lastEvent = eventData;
      }

      // endevent, but not the last touch, so dont stop
      if(eventData.eventType == ionic.Gestures.EVENT_END && !eventData.touches.length-1) {
        this.stopDetect();
      }

      return eventData;
    },


    /**
     * clear the ionic.Gestures.gesture vars
     * this is called on endDetect, but can also be used when a final ionic.Gestures.gesture has been detected
     * to stop other ionic.Gestures.gestures from being fired
     */
    stopDetect: function stopDetect() {
      // clone current data to the store as the previous gesture
      // used for the double tap gesture, since this is an other gesture detect session
      this.previous = ionic.Gestures.utils.extend({}, this.current);

      // reset the current
      this.current = null;

      // stopped!
      this.stopped = true;
    },


    /**
     * extend eventData for ionic.Gestures.gestures
     * @param   {Object}   ev
     * @returns {Object}   ev
     */
    extendEventData: function extendEventData(ev) {
      var startEv = this.current.startEvent;

      // if the touches change, set the new touches over the startEvent touches
      // this because touchevents don't have all the touches on touchstart, or the
      // user must place his fingers at the EXACT same time on the screen, which is not realistic
      // but, sometimes it happens that both fingers are touching at the EXACT same time
      if(startEv && (ev.touches.length != startEv.touches.length || ev.touches === startEv.touches)) {
        // extend 1 level deep to get the touchlist with the touch objects
        startEv.touches = [];
        for(var i=0,len=ev.touches.length; i<len; i++) {
          startEv.touches.push(ionic.Gestures.utils.extend({}, ev.touches[i]));
        }
      }

      var delta_time = ev.timeStamp - startEv.timeStamp,
          delta_x = ev.center.pageX - startEv.center.pageX,
          delta_y = ev.center.pageY - startEv.center.pageY,
          velocity = ionic.Gestures.utils.getVelocity(delta_time, delta_x, delta_y);

      ionic.Gestures.utils.extend(ev, {
        deltaTime   : delta_time,

        deltaX      : delta_x,
        deltaY      : delta_y,

        velocityX   : velocity.x,
        velocityY   : velocity.y,

        distance    : ionic.Gestures.utils.getDistance(startEv.center, ev.center),
        angle       : ionic.Gestures.utils.getAngle(startEv.center, ev.center),
        direction   : ionic.Gestures.utils.getDirection(startEv.center, ev.center),

        scale       : ionic.Gestures.utils.getScale(startEv.touches, ev.touches),
        rotation    : ionic.Gestures.utils.getRotation(startEv.touches, ev.touches),

        startEvent  : startEv
      });

      return ev;
    },


    /**
     * register new gesture
     * @param   {Object}    gesture object, see gestures.js for documentation
     * @returns {Array}     gestures
     */
    register: function register(gesture) {
      // add an enable gesture options if there is no given
      var options = gesture.defaults || {};
      if(options[gesture.name] === undefined) {
        options[gesture.name] = true;
      }

      // extend ionic.Gestures default options with the ionic.Gestures.gesture options
      ionic.Gestures.utils.extend(ionic.Gestures.defaults, options, true);

      // set its index
      gesture.index = gesture.index || 1000;

      // add ionic.Gestures.gesture to the list
      this.gestures.push(gesture);

      // sort the list by index
      this.gestures.sort(function(a, b) {
        if (a.index < b.index) {
          return -1;
        }
        if (a.index > b.index) {
          return 1;
        }
        return 0;
      });

      return this.gestures;
    }
  };


  ionic.Gestures.gestures = ionic.Gestures.gestures || {};

  /**
   * Custom gestures
   * ==============================
   *
   * Gesture object
   * --------------------
   * The object structure of a gesture:
   *
   * { name: 'mygesture',
   *   index: 1337,
   *   defaults: {
   *     mygesture_option: true
   *   }
   *   handler: function(type, ev, inst) {
   *     // trigger gesture event
   *     inst.trigger(this.name, ev);
   *   }
   * }

   * @param   {String}    name
   * this should be the name of the gesture, lowercase
   * it is also being used to disable/enable the gesture per instance config.
   *
   * @param   {Number}    [index=1000]
   * the index of the gesture, where it is going to be in the stack of gestures detection
   * like when you build an gesture that depends on the drag gesture, it is a good
   * idea to place it after the index of the drag gesture.
   *
   * @param   {Object}    [defaults={}]
   * the default settings of the gesture. these are added to the instance settings,
   * and can be overruled per instance. you can also add the name of the gesture,
   * but this is also added by default (and set to true).
   *
   * @param   {Function}  handler
   * this handles the gesture detection of your custom gesture and receives the
   * following arguments:
   *
   *      @param  {Object}    eventData
   *      event data containing the following properties:
   *          timeStamp   {Number}        time the event occurred
   *          target      {HTMLElement}   target element
   *          touches     {Array}         touches (fingers, pointers, mouse) on the screen
   *          pointerType {String}        kind of pointer that was used. matches ionic.Gestures.POINTER_MOUSE|TOUCH
   *          center      {Object}        center position of the touches. contains pageX and pageY
   *          deltaTime   {Number}        the total time of the touches in the screen
   *          deltaX      {Number}        the delta on x axis we haved moved
   *          deltaY      {Number}        the delta on y axis we haved moved
   *          velocityX   {Number}        the velocity on the x
   *          velocityY   {Number}        the velocity on y
   *          angle       {Number}        the angle we are moving
   *          direction   {String}        the direction we are moving. matches ionic.Gestures.DIRECTION_UP|DOWN|LEFT|RIGHT
   *          distance    {Number}        the distance we haved moved
   *          scale       {Number}        scaling of the touches, needs 2 touches
   *          rotation    {Number}        rotation of the touches, needs 2 touches *
   *          eventType   {String}        matches ionic.Gestures.EVENT_START|MOVE|END
   *          srcEvent    {Object}        the source event, like TouchStart or MouseDown *
   *          startEvent  {Object}        contains the same properties as above,
   *                                      but from the first touch. this is used to calculate
   *                                      distances, deltaTime, scaling etc
   *
   *      @param  {ionic.Gestures.Instance}    inst
   *      the instance we are doing the detection for. you can get the options from
   *      the inst.options object and trigger the gesture event by calling inst.trigger
   *
   *
   * Handle gestures
   * --------------------
   * inside the handler you can get/set ionic.Gestures.detectionic.current. This is the current
   * detection sessionic. It has the following properties
   *      @param  {String}    name
   *      contains the name of the gesture we have detected. it has not a real function,
   *      only to check in other gestures if something is detected.
   *      like in the drag gesture we set it to 'drag' and in the swipe gesture we can
   *      check if the current gesture is 'drag' by accessing ionic.Gestures.detectionic.current.name
   *
   *      readonly
   *      @param  {ionic.Gestures.Instance}    inst
   *      the instance we do the detection for
   *
   *      readonly
   *      @param  {Object}    startEvent
   *      contains the properties of the first gesture detection in this sessionic.
   *      Used for calculations about timing, distance, etc.
   *
   *      readonly
   *      @param  {Object}    lastEvent
   *      contains all the properties of the last gesture detect in this sessionic.
   *
   * after the gesture detection session has been completed (user has released the screen)
   * the ionic.Gestures.detectionic.current object is copied into ionic.Gestures.detectionic.previous,
   * this is usefull for gestures like doubletap, where you need to know if the
   * previous gesture was a tap
   *
   * options that have been set by the instance can be received by calling inst.options
   *
   * You can trigger a gesture event by calling inst.trigger("mygesture", event).
   * The first param is the name of your gesture, the second the event argument
   *
   *
   * Register gestures
   * --------------------
   * When an gesture is added to the ionic.Gestures.gestures object, it is auto registered
   * at the setup of the first ionic.Gestures instance. You can also call ionic.Gestures.detectionic.register
   * manually and pass your gesture object as a param
   *
   */

  /**
   * Hold
   * Touch stays at the same place for x time
   * events  hold
   */
  ionic.Gestures.gestures.Hold = {
    name: 'hold',
    index: 10,
    defaults: {
      hold_timeout	: 500,
      hold_threshold	: 1
    },
    timer: null,
    handler: function holdGesture(ev, inst) {
      switch(ev.eventType) {
        case ionic.Gestures.EVENT_START:
          // clear any running timers
          clearTimeout(this.timer);

          // set the gesture so we can check in the timeout if it still is
          ionic.Gestures.detection.current.name = this.name;

          // set timer and if after the timeout it still is hold,
          // we trigger the hold event
          this.timer = setTimeout(function() {
            if(ionic.Gestures.detection.current.name == 'hold') {
              inst.trigger('hold', ev);
            }
          }, inst.options.hold_timeout);
          break;

          // when you move or end we clear the timer
        case ionic.Gestures.EVENT_MOVE:
          if(ev.distance > inst.options.hold_threshold) {
            clearTimeout(this.timer);
          }
          break;

        case ionic.Gestures.EVENT_END:
          clearTimeout(this.timer);
          break;
      }
    }
  };


  /**
   * Tap/DoubleTap
   * Quick touch at a place or double at the same place
   * events  tap, doubletap
   */
  ionic.Gestures.gestures.Tap = {
    name: 'tap',
    index: 100,
    defaults: {
      tap_max_touchtime	: 250,
      tap_max_distance	: 10,
      tap_always			: true,
      doubletap_distance	: 20,
      doubletap_interval	: 300
    },
    handler: function tapGesture(ev, inst) {
      if(ev.eventType == ionic.Gestures.EVENT_END) {
        // previous gesture, for the double tap since these are two different gesture detections
        var prev = ionic.Gestures.detection.previous,
        did_doubletap = false;

        // when the touchtime is higher then the max touch time
        // or when the moving distance is too much
        if(ev.deltaTime > inst.options.tap_max_touchtime ||
            ev.distance > inst.options.tap_max_distance) {
              return;
            }

        // check if double tap
        if(prev && prev.name == 'tap' &&
            (ev.timeStamp - prev.lastEvent.timeStamp) < inst.options.doubletap_interval &&
            ev.distance < inst.options.doubletap_distance) {
              inst.trigger('doubletap', ev);
              did_doubletap = true;
            }

        // do a single tap
        if(!did_doubletap || inst.options.tap_always) {
          ionic.Gestures.detection.current.name = 'tap';
          inst.trigger(ionic.Gestures.detection.current.name, ev);
        }
      }
    }
  };


  /**
   * Swipe
   * triggers swipe events when the end velocity is above the threshold
   * events  swipe, swipeleft, swiperight, swipeup, swipedown
   */
  ionic.Gestures.gestures.Swipe = {
    name: 'swipe',
    index: 40,
    defaults: {
      // set 0 for unlimited, but this can conflict with transform
      swipe_max_touches  : 1,
      swipe_velocity     : 0.7
    },
    handler: function swipeGesture(ev, inst) {
      if(ev.eventType == ionic.Gestures.EVENT_END) {
        // max touches
        if(inst.options.swipe_max_touches > 0 &&
            ev.touches.length > inst.options.swipe_max_touches) {
              return;
            }

        // when the distance we moved is too small we skip this gesture
        // or we can be already in dragging
        if(ev.velocityX > inst.options.swipe_velocity ||
            ev.velocityY > inst.options.swipe_velocity) {
              // trigger swipe events
              inst.trigger(this.name, ev);
              inst.trigger(this.name + ev.direction, ev);
            }
      }
    }
  };


  /**
   * Drag
   * Move with x fingers (default 1) around on the page. Blocking the scrolling when
   * moving left and right is a good practice. When all the drag events are blocking
   * you disable scrolling on that area.
   * events  drag, drapleft, dragright, dragup, dragdown
   */
  ionic.Gestures.gestures.Drag = {
    name: 'drag',
    index: 50,
    defaults: {
      drag_min_distance : 10,
      // Set correct_for_drag_min_distance to true to make the starting point of the drag
      // be calculated from where the drag was triggered, not from where the touch started.
      // Useful to avoid a jerk-starting drag, which can make fine-adjustments
      // through dragging difficult, and be visually unappealing.
      correct_for_drag_min_distance : true,
      // set 0 for unlimited, but this can conflict with transform
      drag_max_touches  : 1,
      // prevent default browser behavior when dragging occurs
      // be careful with it, it makes the element a blocking element
      // when you are using the drag gesture, it is a good practice to set this true
      drag_block_horizontal   : true,
      drag_block_vertical     : true,
      // drag_lock_to_axis keeps the drag gesture on the axis that it started on,
      // It disallows vertical directions if the initial direction was horizontal, and vice versa.
      drag_lock_to_axis       : false,
      // drag lock only kicks in when distance > drag_lock_min_distance
      // This way, locking occurs only when the distance has become large enough to reliably determine the direction
      drag_lock_min_distance : 25
    },
    triggered: false,
    handler: function dragGesture(ev, inst) {
      // current gesture isnt drag, but dragged is true
      // this means an other gesture is busy. now call dragend
      if(ionic.Gestures.detection.current.name != this.name && this.triggered) {
        inst.trigger(this.name +'end', ev);
        this.triggered = false;
        return;
      }

      // max touches
      if(inst.options.drag_max_touches > 0 &&
          ev.touches.length > inst.options.drag_max_touches) {
            return;
          }

      switch(ev.eventType) {
        case ionic.Gestures.EVENT_START:
          this.triggered = false;
          break;

        case ionic.Gestures.EVENT_MOVE:
          // when the distance we moved is too small we skip this gesture
          // or we can be already in dragging
          if(ev.distance < inst.options.drag_min_distance &&
              ionic.Gestures.detection.current.name != this.name) {
                return;
              }

          // we are dragging!
          if(ionic.Gestures.detection.current.name != this.name) {
            ionic.Gestures.detection.current.name = this.name;
            if (inst.options.correct_for_drag_min_distance) {
              // When a drag is triggered, set the event center to drag_min_distance pixels from the original event center.
              // Without this correction, the dragged distance would jumpstart at drag_min_distance pixels instead of at 0.
              // It might be useful to save the original start point somewhere
              var factor = Math.abs(inst.options.drag_min_distance/ev.distance);
              ionic.Gestures.detection.current.startEvent.center.pageX += ev.deltaX * factor;
              ionic.Gestures.detection.current.startEvent.center.pageY += ev.deltaY * factor;

              // recalculate event data using new start point
              ev = ionic.Gestures.detection.extendEventData(ev);
            }
          }

          // lock drag to axis?
          if(ionic.Gestures.detection.current.lastEvent.drag_locked_to_axis || (inst.options.drag_lock_to_axis && inst.options.drag_lock_min_distance<=ev.distance)) {
            ev.drag_locked_to_axis = true;
          }
          var last_direction = ionic.Gestures.detection.current.lastEvent.direction;
          if(ev.drag_locked_to_axis && last_direction !== ev.direction) {
            // keep direction on the axis that the drag gesture started on
            if(ionic.Gestures.utils.isVertical(last_direction)) {
              ev.direction = (ev.deltaY < 0) ? ionic.Gestures.DIRECTION_UP : ionic.Gestures.DIRECTION_DOWN;
            }
            else {
              ev.direction = (ev.deltaX < 0) ? ionic.Gestures.DIRECTION_LEFT : ionic.Gestures.DIRECTION_RIGHT;
            }
          }

          // first time, trigger dragstart event
          if(!this.triggered) {
            inst.trigger(this.name +'start', ev);
            this.triggered = true;
          }

          // trigger normal event
          inst.trigger(this.name, ev);

          // direction event, like dragdown
          inst.trigger(this.name + ev.direction, ev);

          // block the browser events
          if( (inst.options.drag_block_vertical && ionic.Gestures.utils.isVertical(ev.direction)) ||
              (inst.options.drag_block_horizontal && !ionic.Gestures.utils.isVertical(ev.direction))) {
                ev.preventDefault();
              }
          break;

        case ionic.Gestures.EVENT_END:
          // trigger dragend
          if(this.triggered) {
            inst.trigger(this.name +'end', ev);
          }

          this.triggered = false;
          break;
      }
    }
  };


  /**
   * Transform
   * User want to scale or rotate with 2 fingers
   * events  transform, pinch, pinchin, pinchout, rotate
   */
  ionic.Gestures.gestures.Transform = {
    name: 'transform',
    index: 45,
    defaults: {
      // factor, no scale is 1, zoomin is to 0 and zoomout until higher then 1
      transform_min_scale     : 0.01,
      // rotation in degrees
      transform_min_rotation  : 1,
      // prevent default browser behavior when two touches are on the screen
      // but it makes the element a blocking element
      // when you are using the transform gesture, it is a good practice to set this true
      transform_always_block  : false
    },
    triggered: false,
    handler: function transformGesture(ev, inst) {
      // current gesture isnt drag, but dragged is true
      // this means an other gesture is busy. now call dragend
      if(ionic.Gestures.detection.current.name != this.name && this.triggered) {
        inst.trigger(this.name +'end', ev);
        this.triggered = false;
        return;
      }

      // atleast multitouch
      if(ev.touches.length < 2) {
        return;
      }

      // prevent default when two fingers are on the screen
      if(inst.options.transform_always_block) {
        ev.preventDefault();
      }

      switch(ev.eventType) {
        case ionic.Gestures.EVENT_START:
          this.triggered = false;
          break;

        case ionic.Gestures.EVENT_MOVE:
          var scale_threshold = Math.abs(1-ev.scale);
          var rotation_threshold = Math.abs(ev.rotation);

          // when the distance we moved is too small we skip this gesture
          // or we can be already in dragging
          if(scale_threshold < inst.options.transform_min_scale &&
              rotation_threshold < inst.options.transform_min_rotation) {
                return;
              }

          // we are transforming!
          ionic.Gestures.detection.current.name = this.name;

          // first time, trigger dragstart event
          if(!this.triggered) {
            inst.trigger(this.name +'start', ev);
            this.triggered = true;
          }

          inst.trigger(this.name, ev); // basic transform event

          // trigger rotate event
          if(rotation_threshold > inst.options.transform_min_rotation) {
            inst.trigger('rotate', ev);
          }

          // trigger pinch event
          if(scale_threshold > inst.options.transform_min_scale) {
            inst.trigger('pinch', ev);
            inst.trigger('pinch'+ ((ev.scale < 1) ? 'in' : 'out'), ev);
          }
          break;

        case ionic.Gestures.EVENT_END:
          // trigger dragend
          if(this.triggered) {
            inst.trigger(this.name +'end', ev);
          }

          this.triggered = false;
          break;
      }
    }
  };


  /**
   * Touch
   * Called as first, tells the user has touched the screen
   * events  touch
   */
  ionic.Gestures.gestures.Touch = {
    name: 'touch',
    index: -Infinity,
    defaults: {
      // call preventDefault at touchstart, and makes the element blocking by
      // disabling the scrolling of the page, but it improves gestures like
      // transforming and dragging.
      // be careful with using this, it can be very annoying for users to be stuck
      // on the page
      prevent_default: false,

      // disable mouse events, so only touch (or pen!) input triggers events
      prevent_mouseevents: false
    },
    handler: function touchGesture(ev, inst) {
      if(inst.options.prevent_mouseevents && ev.pointerType == ionic.Gestures.POINTER_MOUSE) {
        ev.stopDetect();
        return;
      }

      if(inst.options.prevent_default) {
        ev.preventDefault();
      }

      if(ev.eventType ==  ionic.Gestures.EVENT_START) {
        inst.trigger(this.name, ev);
      }
    }
  };


  /**
   * Release
   * Called as last, tells the user has released the screen
   * events  release
   */
  ionic.Gestures.gestures.Release = {
    name: 'release',
    index: Infinity,
    handler: function releaseGesture(ev, inst) {
      if(ev.eventType ==  ionic.Gestures.EVENT_END) {
        inst.trigger(this.name, ev);
      }
    }
  };
})(window.ionic);

(function(window, document, ionic) {

  /**
   * @ngdoc utility
   * @name ionic.Platform
   * @module ionic
   */
  ionic.Platform = {

    /**
     * @ngdoc property
     * @name ionic.Platform#isReady
     * @returns {boolean} Whether the device is ready.
     */
    isReady: false,
    /**
     * @ngdoc property
     * @name ionic.Platform#isFullScreen
     * @returns {boolean} Whether the device is fullscreen.
     */
    isFullScreen: false,
    /**
     * @ngdoc property
     * @name ionic.Platform#platforms
     * @returns {Array(string)} An array of all platforms found.
     */
    platforms: null,
    /**
     * @ngdoc property
     * @name ionic.Platform#grade
     * @returns {string} What grade the current platform is.
     */
    grade: null,
    ua: navigator.userAgent,

    /**
     * @ngdoc method
     * @name ionic.Platform#ready
     * @description
     * Trigger a callback once the device is ready,
     * or immediately if the device is already ready.
     * @param {function} callback The function to call.
     */
    ready: function(cb) {
      // run through tasks to complete now that the device is ready
      if(this.isReady) {
        cb();
      } else {
        // the platform isn't ready yet, add it to this array
        // which will be called once the platform is ready
        readyCallbacks.push(cb);
      }
    },

    /**
     * @private
     */
    detect: function() {
      ionic.Platform._checkPlatforms();

      ionic.requestAnimationFrame(function(){
        // only add to the body class if we got platform info
        for(var i = 0; i < ionic.Platform.platforms.length; i++) {
          document.body.classList.add('platform-' + ionic.Platform.platforms[i]);
        }
        document.body.classList.add('grade-' + ionic.Platform.grade);
      });
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#device
     * @description Return the current device (given by cordova).
     * @returns {object} The device object.
     */
    device: function() {
      if(window.device) return window.device;
      if(this.isCordova()) void 0;
      return {};
    },

    _checkPlatforms: function(platforms) {
      this.platforms = [];
      this.grade = 'a';

      if(this.isCordova()) this.platforms.push('cordova');
      if(this.isIPad()) this.platforms.push('ipad');

      var platform = this.platform();
      if(platform) {
        this.platforms.push(platform);

        var version = this.version();
        if(version) {
          var v = version.toString();
          if(v.indexOf('.') > 0) {
            v = v.replace('.', '_');
          } else {
            v += '_0';
          }
          this.platforms.push(platform + v.split('_')[0]);
          this.platforms.push(platform + v);

          if(this.isAndroid() && version < 4.4) {
            this.grade = (version < 4 ? 'c' : 'b');
          }
        }
      }
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#isCordova
     * @returns {boolean} Whether we are running on Cordova.
     */
    isCordova: function() {
      return !(!window.cordova && !window.PhoneGap && !window.phonegap);
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isIPad
     * @returns {boolean} Whether we are running on iPad.
     */
    isIPad: function() {
      return this.ua.toLowerCase().indexOf('ipad') >= 0;
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isIOS
     * @returns {boolean} Whether we are running on iOS.
     */
    isIOS: function() {
      return this.is('ios');
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isAndroid
     * @returns {boolean} Whether we are running on Android.
     */
    isAndroid: function() {
      return this.is('android');
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#platform
     * @returns {string} The name of the current platform.
     */
    platform: function() {
      // singleton to get the platform name
      if(platformName === null) this.setPlatform(this.device().platform);
      return platformName;
    },

    /**
     * @private
     */
    setPlatform: function(n) {
      if(typeof n != 'undefined' && n !== null && n.length) {
        platformName = n.toLowerCase();
      } else if(this.ua.indexOf('Android') > 0) {
        platformName = 'android';
      } else if(this.ua.indexOf('iPhone') > -1 || this.ua.indexOf('iPad') > -1 || this.ua.indexOf('iPod') > -1) {
        platformName = 'ios';
      } else {
        platformName = '';
      }
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#version
     * @returns {string} The version of the current device platform.
     */
    version: function() {
      // singleton to get the platform version
      if(platformVersion === null) this.setVersion(this.device().version);
      return platformVersion;
    },

    /**
     * @private
     */
    setVersion: function(v) {
      if(typeof v != 'undefined' && v !== null) {
        v = v.split('.');
        v = parseFloat(v[0] + '.' + (v.length > 1 ? v[1] : 0));
        if(!isNaN(v)) {
          platformVersion = v;
          return;
        }
      }

      platformVersion = 0;

      // fallback to user-agent checking
      var pName = this.platform();
      var versionMatch = {
        'android': /Android (\d+).(\d+)?/,
        'ios': /OS (\d+)_(\d+)?/
      };
      if(versionMatch[pName]) {
        v = this.ua.match( versionMatch[pName] );
        if(v.length > 2) {
          platformVersion = parseFloat( v[1] + '.' + v[2] );
        }
      }
    },

    // Check if the platform is the one detected by cordova
    is: function(type) {
      type = type.toLowerCase();
      // check if it has an array of platforms
      if(this.platforms) {
        for(var x = 0; x < this.platforms.length; x++) {
          if(this.platforms[x] === type) return true;
        }
      }
      // exact match
      var pName = this.platform();
      if(pName) {
        return pName === type.toLowerCase();
      }

      // A quick hack for to check userAgent
      return this.ua.toLowerCase().indexOf(type) >= 0;
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#exitApp
     * @description Exit the app.
     */
    exitApp: function() {
      this.ready(function(){
        navigator.app && navigator.app.exitApp && navigator.app.exitApp();
      });
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#showStatusBar
     * @description Shows or hides the device status bar (in Cordova).
     * @param {boolean} shouldShow Whether or not to show the status bar.
     */
    showStatusBar: function(val) {
      // Only useful when run within cordova
      this._showStatusBar = val;
      this.ready(function(){
        // run this only when or if the platform (cordova) is ready
        ionic.requestAnimationFrame(function(){
          if(ionic.Platform._showStatusBar) {
            // they do not want it to be full screen
            window.StatusBar && window.StatusBar.show();
            document.body.classList.remove('status-bar-hide');
          } else {
            // it should be full screen
            window.StatusBar && window.StatusBar.hide();
            document.body.classList.add('status-bar-hide');
          }
        });
      });
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#fullScreen
     * @description
     * Sets whether the app is fullscreen or not (in Cordova).
     * @param {boolean=} showFullScreen Whether or not to set the app to fullscreen. Defaults to true.
     * @param {boolean=} showStatusBar Whether or not to show the device's status bar. Defaults to false.
     */
    fullScreen: function(showFullScreen, showStatusBar) {
      // showFullScreen: default is true if no param provided
      this.isFullScreen = (showFullScreen !== false);

      // add/remove the fullscreen classname to the body
      ionic.DomUtil.ready(function(){
        // run this only when or if the DOM is ready
        ionic.requestAnimationFrame(function(){
          if(ionic.Platform.isFullScreen) {
            document.body.classList.add('fullscreen');
          } else {
            document.body.classList.remove('fullscreen');
          }
        });
        // showStatusBar: default is false if no param provided
        ionic.Platform.showStatusBar( (showStatusBar === true) );
      });
    }

  };

  var platformName = null, // just the name, like iOS or Android
  platformVersion = null, // a float of the major and minor, like 7.1
  readyCallbacks = [];

  // setup listeners to know when the device is ready to go
  function onWindowLoad() {
    if(ionic.Platform.isCordova()) {
      // the window and scripts are fully loaded, and a cordova/phonegap
      // object exists then let's listen for the deviceready
      document.addEventListener("deviceready", onPlatformReady, false);
    } else {
      // the window and scripts are fully loaded, but the window object doesn't have the
      // cordova/phonegap object, so its just a browser, not a webview wrapped w/ cordova
      onPlatformReady();
    }
    window.removeEventListener("load", onWindowLoad, false);
  }
  window.addEventListener("load", onWindowLoad, false);

  function onPlatformReady() {
    // the device is all set to go, init our own stuff then fire off our event
    ionic.Platform.isReady = true;
    ionic.Platform.detect();
    for(var x=0; x<readyCallbacks.length; x++) {
      // fire off all the callbacks that were added before the platform was ready
      readyCallbacks[x]();
    }
    readyCallbacks = [];
    ionic.trigger('platformready', { target: document });

    ionic.requestAnimationFrame(function(){
      document.body.classList.add('platform-ready');
    });
  }

})(this, document, ionic);

(function(document, ionic) {
  'use strict';

  // Ionic CSS polyfills
  ionic.CSS = {};

  (function() {

    // transform
    var i, keys = ['webkitTransform', 'transform', '-webkit-transform', 'webkit-transform',
                '-moz-transform', 'moz-transform', 'MozTransform', 'mozTransform'];

    for(i = 0; i < keys.length; i++) {
      if(document.documentElement.style[keys[i]] !== undefined) {
        ionic.CSS.TRANSFORM = keys[i];
        break;
      }
    }

    // transition
    keys = ['webkitTransition', 'mozTransition', 'transition'];
    for(i = 0; i < keys.length; i++) {
      if(document.documentElement.style[keys[i]] !== undefined) {
        ionic.CSS.TRANSITION = keys[i];
        break;
      }
    }

  })();

  // classList polyfill for them older Androids
  // https://gist.github.com/devongovett/1381839
  if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
      get: function() {
        var self = this;
        function update(fn) {
          return function() {
            var x, classes = self.className.split(/\s+/);

            for(x=0; x<arguments.length; x++) {
              fn(classes, classes.indexOf(arguments[x]), arguments[x]);
            }

            self.className = classes.join(" ");
          };
        }

        return {
          add: update(function(classes, index, value) {
            ~index || classes.push(value);
          }),

          remove: update(function(classes, index) {
            ~index && classes.splice(index, 1);
          }),

          toggle: update(function(classes, index, value) {
            ~index ? classes.splice(index, 1) : classes.push(value);
          }),

          contains: function(value) {
            return !!~self.className.split(/\s+/).indexOf(value);
          },

          item: function(i) {
            return self.className.split(/\s+/)[i] || null;
          }
        };

      }
    });
  }

})(document, ionic);

(function(window, document, ionic) {
  'use strict';

  // polyfill use to simulate native "tap"
  ionic.tapElement = function(target, e) {
    // simulate a normal click by running the element's click method then focus on it

    var ele = target.control || target;

    if(ele.disabled || ele.type === 'file' || ele.type === 'range') return;

    void 0;

    var c = getCoordinates(e);

    // using initMouseEvent instead of MouseEvent for our Android friends
    var clickEvent = document.createEvent("MouseEvents");
    clickEvent.initMouseEvent('click', true, true, window,
                              1, 0, 0, c.x, c.y,
                              false, false, false, false, 0, null);

    ele.dispatchEvent(clickEvent);

    if(ele.tagName === 'INPUT' || ele.tagName === 'TEXTAREA') {
      ele.focus();
      e.preventDefault();
    } else {
      blurActive();
    }

    // remember the coordinates of this tap so if it happens again we can ignore it
    // but only if the coordinates are not already being actively disabled
    if( !isRecentTap(e) ) {
      recordCoordinates(e);
    }

    if(target.control) {
      void 0;
      return stopEvent(e);
    }
  };

  function tapPolyfill(orgEvent) {
    // if the source event wasn't from a touch event then don't use this polyfill
    if(!orgEvent.gesture || !orgEvent.gesture.srcEvent) return;

    var e = orgEvent.gesture.srcEvent; // evaluate the actual source event, not the created event by gestures.js
    var ele = e.target;

    if( isRecentTap(e) ) {
      // if a tap in the same area just happened, don't continue
      void 0;
      return stopEvent(e);
    }

    for(var x=0; x<5; x++) {
      // climb up the DOM looking to see if the tapped element is, or has a parent, of one of these
      // only climb up a max of 5 parents, anything more probably isn't beneficial
      if(!ele) break;

      if( ele.tagName === "INPUT" ||
          ele.tagName === "A" ||
          ele.tagName === "BUTTON" ||
          ele.tagName === "LABEL" ||
          ele.tagName === "TEXTAREA" ) {

        return ionic.tapElement(ele, e);
      }
      ele = ele.parentElement;
    }

    // they didn't tap one of the above elements
    // if the currently active element is an input, and they tapped outside
    // of the current input, then unset its focus (blur) so the keyboard goes away
    blurActive();
  }

  function preventGhostClick(e) {

    void 0;


    if(e.target.control || isRecentTap(e) || isScrolledSinceStart(e)) {
      return stopEvent(e);
    }

    // remember the coordinates of this click so if a tap or click in the
    // same area quickly happened again we can ignore it
    recordCoordinates(e);
  }

  function isRecentTap(event) {
    // loop through the tap coordinates and see if the same area has been tapped recently
    var tapId, existingCoordinates, currentCoordinates;

    for(tapId in tapCoordinates) {
      existingCoordinates = tapCoordinates[tapId];
      if(!currentCoordinates) currentCoordinates = getCoordinates(event); // lazy load it when needed

      if(currentCoordinates.x > existingCoordinates.x - HIT_RADIUS &&
         currentCoordinates.x < existingCoordinates.x + HIT_RADIUS &&
         currentCoordinates.y > existingCoordinates.y - HIT_RADIUS &&
         currentCoordinates.y < existingCoordinates.y + HIT_RADIUS) {
        // the current tap coordinates are in the same area as a recent tap
        return existingCoordinates;
      }
    }
  }

  function isScrolledSinceStart(event) {
    // check if this click's coordinates are different than its touchstart/mousedown
    var c = getCoordinates(event);

    // Quick check for 0,0 which could be simulated mouse click for form submission
    if(c.x === 0 && c.y === 0) {
      return false;
    }

    return (c.x > startCoordinates.x + 2 ||
            c.x < startCoordinates.x - 2 ||
            c.y > startCoordinates.y + 2 ||
            c.y < startCoordinates.y - 2);
  }

  function recordCoordinates(event) {
    var c = getCoordinates(event);
    if(c.x && c.y) {
      var tapId = Date.now();

      // only record tap coordinates if we have valid ones
      tapCoordinates[tapId] = { x: c.x, y: c.y, id: tapId };

      setTimeout(function() {
        // delete the tap coordinates after X milliseconds, basically allowing
        // it so a tap can happen again in the same area in the future
        delete tapCoordinates[tapId];
      }, CLICK_PREVENT_DURATION);
    }
  }

  function getCoordinates(event) {
    // This method can get coordinates for both a mouse click
    // or a touch depending on the given event
    var gesture = (event.gesture ? event.gesture : event);

    if(gesture) {
      var touches = gesture.touches && gesture.touches.length ? gesture.touches : [gesture];
      var e = (gesture.changedTouches && gesture.changedTouches[0]) ||
          (gesture.originalEvent && gesture.originalEvent.changedTouches &&
              gesture.originalEvent.changedTouches[0]) ||
          touches[0].originalEvent || touches[0];

      if(e) return { x: e.clientX || e.pageX, y: e.clientY || e.pageY };
    }
    return { x:0, y:0 };
  }

  var clickPreventTimerId;
  function removeClickPrevent(e) {
    clearTimeout(clickPreventTimerId);
    clickPreventTimerId = setTimeout(function(){
      var tap = isRecentTap(e);
      if(tap) delete tapCoordinates[tap.id];
      startCoordinates = {};
    }, REMOVE_PREVENT_DELAY);
  }

  function stopEvent(e){
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  function blurActive() {
    var ele = document.activeElement;
    if(ele && (ele.tagName === "INPUT" ||
               ele.tagName === "TEXTAREA")) {
      // using a timeout to prevent funky scrolling while a keyboard hides
      setTimeout(function(){
        ele.blur();
      }, 400);
    }
  }

  function recordStartCoordinates(e) {
    startCoordinates = getCoordinates(e);
  }

  var tapCoordinates = {}; // used to remember coordinates to ignore if they happen again quickly
  var startCoordinates = {}; // used to remember where the coordinates of the start of the tap
  var CLICK_PREVENT_DURATION = 1500; // max milliseconds ghostclicks in the same area should be prevented
  var REMOVE_PREVENT_DELAY = 380; // delay after a touchend/mouseup before removing the ghostclick prevent
  var HIT_RADIUS = 15;

  ionic.Platform.ready(function(){

    if(ionic.Platform.grade === 'c') {
      // low performing phones should have a longer ghostclick prevent
      REMOVE_PREVENT_DELAY = 800;
    }

    // set global click handler and check if the event should stop or not
    document.addEventListener('click', preventGhostClick, true);

    // global release event listener polyfill for HTML elements that were tapped or held
    ionic.on("release", tapPolyfill, document);

    // listeners used to remove ghostclick prevention
    document.addEventListener('touchend', removeClickPrevent, false);
    document.addEventListener('mouseup', removeClickPrevent, false);

    // in the case the user touched the screen, then scrolled, it shouldn't fire the click
    document.addEventListener('touchstart', recordStartCoordinates, false);
    document.addEventListener('mousedown', recordStartCoordinates, false);
  });

})(this, document, ionic);

(function(document, ionic) {
  'use strict';

  var queueElements = {};   // elements that should get an active state in XX milliseconds
  var activeElements = {};  // elements that are currently active
  var keyId = 0;            // a counter for unique keys for the above ojects

  ionic.activator = {

    start: function(e) {
      // when an element is touched/clicked, it climbs up a few
      // parents to see if it is an .item or .button element
      ionic.requestAnimationFrame(function(){
        var ele = e.target;
        var eleToActivate;

        for(var x=0; x<4; x++) {
          if(!ele) break;
          if(eleToActivate && ele.classList.contains('item')) {
            eleToActivate = ele;
            break;
          }
          if( ele.tagName == 'A' || ele.tagName == 'BUTTON' || ele.getAttribute('ng-click') ) {
            eleToActivate = ele;
          }
          if( ele.classList.contains('button') ) {
            eleToActivate = ele;
            break;
          }
          ele = ele.parentElement;
        }

        if(eleToActivate) {
          // queue that this element should be set to active
          queueElements[keyId] = eleToActivate;

          // in XX milliseconds, set the queued elements to active
          // add listeners to clear all queued/active elements onMove
          if(e.type === 'touchstart') {
            document.body.removeEventListener('mousedown', ionic.activator.start);
            document.body.addEventListener('touchmove', clear, false);
            setTimeout(activateElements, 85);
          } else {
            document.body.addEventListener('mousemove', clear, false);
            ionic.requestAnimationFrame(activateElements);
          }

          keyId = (keyId > 19 ? 0 : keyId + 1);
        }

      });
    }
  };

  function activateElements() {
    // activate all elements in the queue
    for(var key in queueElements) {
      if(queueElements[key]) {
        queueElements[key].classList.add('active');
        activeElements[key] = queueElements[key];
      }
    }
    queueElements = {};
  }

  function deactivateElements() {
    for(var key in activeElements) {
      if(activeElements[key]) {
        activeElements[key].classList.remove('active');
        delete activeElements[key];
      }
    }
  }

  function onEnd(e) {
    // clear out any active/queued elements after XX milliseconds
    setTimeout(clear, 200);
  }

  function clear() {
    // clear out any elements that are queued to be set to active
    queueElements = {};

    // in the next frame, remove the active class from all active elements
    ionic.requestAnimationFrame(deactivateElements);

    // remove onMove listeners that clear out active elements
    document.body.removeEventListener('mousemove', clear);
    document.body.removeEventListener('touchmove', clear);
  }

  // use window.onload because this doesn't need to run immediately
  window.addEventListener('load', function(){
    // start an active element
    document.body.addEventListener('touchstart', ionic.activator.start, false);
    document.body.addEventListener('mousedown', ionic.activator.start, false);

    // clear all active elements after XX milliseconds
    document.body.addEventListener('touchend', onEnd, false);
    document.body.addEventListener('mouseup', onEnd, false);
    document.body.addEventListener('touchcancel', onEnd, false);
  }, false);

})(document, ionic);

(function(ionic) {

  /* for nextUid() function below */
  var uid = ['0','0','0'];

  /**
   * Various utilities used throughout Ionic
   *
   * Some of these are adopted from underscore.js and backbone.js, both also MIT licensed.
   */
  ionic.Utils = {

    arrayMove: function (arr, old_index, new_index) {
      if (new_index >= arr.length) {
        var k = new_index - arr.length;
        while ((k--) + 1) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr;
    },

    /**
     * Return a function that will be called with the given context
     */
    proxy: function(func, context) {
      var args = Array.prototype.slice.call(arguments, 2);
      return function() {
        return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
      };
    },

    /**
     * Only call a function once in the given interval.
     *
     * @param func {Function} the function to call
     * @param wait {int} how long to wait before/after to allow function calls
     * @param immediate {boolean} whether to call immediately or after the wait interval
     */
     debounce: function(func, wait, immediate) {
      var timeout, args, context, timestamp, result;
      return function() {
        context = this;
        args = arguments;
        timestamp = new Date();
        var later = function() {
          var last = (new Date()) - timestamp;
          if (last < wait) {
            timeout = setTimeout(later, wait - last);
          } else {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
          }
        };
        var callNow = immediate && !timeout;
        if (!timeout) {
          timeout = setTimeout(later, wait);
        }
        if (callNow) result = func.apply(context, args);
        return result;
      };
    },

    /**
     * Throttle the given fun, only allowing it to be
     * called at most every `wait` ms.
     */
    throttle: function(func, wait, options) {
      var context, args, result;
      var timeout = null;
      var previous = 0;
      options || (options = {});
      var later = function() {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
      };
      return function() {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    },
     // Borrowed from Backbone.js's extend
     // Helper function to correctly set up the prototype chain, for subclasses.
     // Similar to `goog.inherits`, but uses a hash of prototype properties and
     // class properties to be extended.
    inherit: function(protoProps, staticProps) {
      var parent = this;
      var child;

      // The constructor function for the new subclass is either defined by you
      // (the "constructor" property in your `extend` definition), or defaulted
      // by us to simply call the parent's constructor.
      if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
      } else {
        child = function(){ return parent.apply(this, arguments); };
      }

      // Add static properties to the constructor function, if supplied.
      ionic.extend(child, parent, staticProps);

      // Set the prototype chain to inherit from `parent`, without calling
      // `parent`'s constructor function.
      var Surrogate = function(){ this.constructor = child; };
      Surrogate.prototype = parent.prototype;
      child.prototype = new Surrogate;

      // Add prototype properties (instance properties) to the subclass,
      // if supplied.
      if (protoProps) ionic.extend(child.prototype, protoProps);

      // Set a convenience property in case the parent's prototype is needed
      // later.
      child.__super__ = parent.prototype;

      return child;
    },

    // Extend adapted from Underscore.js
    extend: function(obj) {
       var args = Array.prototype.slice.call(arguments, 1);
       for(var i = 0; i < args.length; i++) {
         var source = args[i];
         if (source) {
           for (var prop in source) {
             obj[prop] = source[prop];
           }
         }
       }
       return obj;
    },

    /**
     * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
     * characters such as '012ABC'. The reason why we are not using simply a number counter is that
     * the number string gets longer over time, and it can also overflow, where as the nextId
     * will grow much slower, it is a string, and it will never overflow.
     *
     * @returns an unique alpha-numeric string
     */
    nextUid: function() {
      var index = uid.length;
      var digit;

      while(index) {
        index--;
        digit = uid[index].charCodeAt(0);
        if (digit == 57 /*'9'*/) {
          uid[index] = 'A';
          return uid.join('');
        }
        if (digit == 90  /*'Z'*/) {
          uid[index] = '0';
        } else {
          uid[index] = String.fromCharCode(digit + 1);
          return uid.join('');
        }
      }
      uid.unshift('0');
      return uid.join('');
    }
  };

  // Bind a few of the most useful functions to the ionic scope
  ionic.inherit = ionic.Utils.inherit;
  ionic.extend = ionic.Utils.extend;
  ionic.throttle = ionic.Utils.throttle;
  ionic.proxy = ionic.Utils.proxy;
  ionic.debounce = ionic.Utils.debounce;

})(window.ionic);

(function(ionic) {

ionic.Platform.ready(function() {
  if (ionic.Platform.is('android')) {
    androidKeyboardFix();
  }
});

function androidKeyboardFix() {
  var rememberedDeviceWidth = window.innerWidth;
  var rememberedDeviceHeight = window.innerHeight;
  var keyboardHeight;

  window.addEventListener('resize', resize);

  function resize() {

    //If the width of the window changes, we have an orientation change
    if (rememberedDeviceWidth !== window.innerWidth) {
      rememberedDeviceWidth = window.innerWidth;
      rememberedDeviceHeight = window.innerHeight;
      void 0;

    //If the height changes, and it's less than before, we have a keyboard open
    } else if (rememberedDeviceHeight !== window.innerHeight &&
               window.innerHeight < rememberedDeviceHeight) {
      document.body.classList.add('footer-hide');
      //Wait for next frame so document.activeElement is set
      ionic.requestAnimationFrame(handleKeyboardChange);
    } else {
      //Otherwise we have a keyboard close or a *really* weird resize
      document.body.classList.remove('footer-hide');
    }

    function handleKeyboardChange() {
      //keyboard opens
      keyboardHeight = rememberedDeviceHeight - window.innerHeight;
      var activeEl = document.activeElement;
      if (activeEl) {
        //This event is caught by the nearest parent scrollView
        //of the activeElement
        ionic.trigger('scrollChildIntoView', {
          target: activeEl
        }, true);
      }

    }
  }
}

})(window.ionic);

(function(ionic) {
'use strict';
  ionic.views.View = function() {
    this.initialize.apply(this, arguments);
  };

  ionic.views.View.inherit = ionic.inherit;

  ionic.extend(ionic.views.View.prototype, {
    initialize: function() {}
  });

})(window.ionic);

var IS_INPUT_LIKE_REGEX = /input|textarea|select/i;
var IS_EMBEDDED_OBJECT_REGEX = /object|embed/i;
/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */

/**
 * Generic animation class with support for dropped frames both optional easing and duration.
 *
 * Optional duration is useful when the lifetime is defined by another condition than time
 * e.g. speed of an animating object, etc.
 *
 * Dropped frame logic allows to keep using the same updater logic independent from the actual
 * rendering. This eases a lot of cases where it might be pretty complex to break down a state
 * based on the pure time difference.
 */
(function(global) {
	var time = Date.now || function() {
		return +new Date();
	};
	var desiredFrames = 60;
	var millisecondsPerSecond = 1000;
	var running = {};
	var counter = 1;

	// Create namespaces
	if (!global.core) {
		var core = global.core = { effect : {} };

	} else if (!core.effect) {
		core.effect = {};
	}

	core.effect.Animate = {

		/**
		 * A requestAnimationFrame wrapper / polyfill.
		 *
		 * @param callback {Function} The callback to be invoked before the next repaint.
		 * @param root {HTMLElement} The root element for the repaint
		 */
		requestAnimationFrame: (function() {

			// Check for request animation Frame support
			var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame;
			var isNative = !!requestFrame;

			if (requestFrame && !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())) {
				isNative = false;
			}

			if (isNative) {
				return function(callback, root) {
					requestFrame(callback, root)
				};
			}

			var TARGET_FPS = 60;
			var requests = {};
			var requestCount = 0;
			var rafHandle = 1;
			var intervalHandle = null;
			var lastActive = +new Date();

			return function(callback, root) {
				var callbackHandle = rafHandle++;

				// Store callback
				requests[callbackHandle] = callback;
				requestCount++;

				// Create timeout at first request
				if (intervalHandle === null) {

					intervalHandle = setInterval(function() {

						var time = +new Date();
						var currentRequests = requests;

						// Reset data structure before executing callbacks
						requests = {};
						requestCount = 0;

						for(var key in currentRequests) {
							if (currentRequests.hasOwnProperty(key)) {
								currentRequests[key](time);
								lastActive = time;
							}
						}

						// Disable the timeout when nothing happens for a certain
						// period of time
						if (time - lastActive > 2500) {
							clearInterval(intervalHandle);
							intervalHandle = null;
						}

					}, 1000 / TARGET_FPS);
				}

				return callbackHandle;
			};

		})(),


		/**
		 * Stops the given animation.
		 *
		 * @param id {Integer} Unique animation ID
		 * @return {Boolean} Whether the animation was stopped (aka, was running before)
		 */
		stop: function(id) {
			var cleared = running[id] != null;
			if (cleared) {
				running[id] = null;
			}

			return cleared;
		},


		/**
		 * Whether the given animation is still running.
		 *
		 * @param id {Integer} Unique animation ID
		 * @return {Boolean} Whether the animation is still running
		 */
		isRunning: function(id) {
			return running[id] != null;
		},


		/**
		 * Start the animation.
		 *
		 * @param stepCallback {Function} Pointer to function which is executed on every step.
		 *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
		 * @param verifyCallback {Function} Executed before every animation step.
		 *   Signature of the method should be `function() { return continueWithAnimation; }`
		 * @param completedCallback {Function}
		 *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
		 * @param duration {Integer} Milliseconds to run the animation
		 * @param easingMethod {Function} Pointer to easing function
		 *   Signature of the method should be `function(percent) { return modifiedValue; }`
		 * @param root {Element} Render root, when available. Used for internal
		 *   usage of requestAnimationFrame.
		 * @return {Integer} Identifier of animation. Can be used to stop it any time.
		 */
		start: function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {

			var start = time();
			var lastFrame = start;
			var percent = 0;
			var dropCounter = 0;
			var id = counter++;

			if (!root) {
				root = document.body;
			}

			// Compacting running db automatically every few new animations
			if (id % 20 === 0) {
				var newRunning = {};
				for (var usedId in running) {
					newRunning[usedId] = true;
				}
				running = newRunning;
			}

			// This is the internal step method which is called every few milliseconds
			var step = function(virtual) {

				// Normalize virtual value
				var render = virtual !== true;

				// Get current time
				var now = time();

				// Verification is executed before next animation step
				if (!running[id] || (verifyCallback && !verifyCallback(id))) {

					running[id] = null;
					completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false);
					return;

				}

				// For the current rendering to apply let's update omitted steps in memory.
				// This is important to bring internal state variables up-to-date with progress in time.
				if (render) {

					var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
					for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
						step(true);
						dropCounter++;
					}

				}

				// Compute percent value
				if (duration) {
					percent = (now - start) / duration;
					if (percent > 1) {
						percent = 1;
					}
				}

				// Execute step callback, then...
				var value = easingMethod ? easingMethod(percent) : percent;
				if ((stepCallback(value, now, render) === false || percent === 1) && render) {
					running[id] = null;
					completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, percent === 1 || duration == null);
				} else if (render) {
					lastFrame = now;
					core.effect.Animate.requestAnimationFrame(step, root);
				}
			};

			// Mark as running
			running[id] = true;

			// Init first step
			core.effect.Animate.requestAnimationFrame(step, root);

			// Return unique animation ID
			return id;
		}
	};
})(this);

/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */

var Scroller;

(function(ionic) {
	var NOOP = function(){};

	// Easing Equations (c) 2003 Robert Penner, all rights reserved.
	// Open source under the BSD License.

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	var easeOutCubic = function(pos) {
		return (Math.pow((pos - 1), 3) + 1);
	};

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	var easeInOutCubic = function(pos) {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 3);
		}

		return 0.5 * (Math.pow((pos - 2), 3) + 2);
	};


/**
 * ionic.views.Scroll
 * A powerful scroll view with support for bouncing, pull to refresh, and paging.
 * @param   {Object}        options options for the scroll view
 * @class A scroll view system
 * @memberof ionic.views
 */
ionic.views.Scroll = ionic.views.View.inherit({
  initialize: function(options) {
    var self = this;

    this.__container = options.el;
    this.__content = options.el.firstElementChild;

    //Remove any scrollTop attached to these elements; they are virtual scroll now
    //This also stops on-load-scroll-to-window.location.hash that the browser does
    setTimeout(function() {
      if (self.__container && self.__content) {
        self.__container.scrollTop = 0;
        self.__content.scrollTop = 0;
      }
    });

		this.options = {

      /** Disable scrolling on x-axis by default */
      scrollingX: false,
      scrollbarX: true,

      /** Enable scrolling on y-axis */
      scrollingY: true,
      scrollbarY: true,

      startX: 0,
      startY: 0,

      /** The amount to dampen mousewheel events */
      wheelDampen: 6,

      /** The minimum size the scrollbars scale to while scrolling */
      minScrollbarSizeX: 5,
      minScrollbarSizeY: 5,

      /** Scrollbar fading after scrolling */
      scrollbarsFade: true,
      scrollbarFadeDelay: 300,
      /** The initial fade delay when the pane is resized or initialized */
      scrollbarResizeFadeDelay: 1000,

      /** Enable animations for deceleration, snap back, zooming and scrolling */
      animating: true,

      /** duration for animations triggered by scrollTo/zoomTo */
      animationDuration: 250,

      /** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
      bouncing: true,

      /** Enable locking to the main axis if user moves only slightly on one of them at start */
      locking: true,

      /** Enable pagination mode (switching between full page content panes) */
      paging: false,

      /** Enable snapping of content to a configured pixel grid */
      snapping: false,

      /** Enable zooming of content via API, fingers and mouse wheel */
      zooming: false,

      /** Minimum zoom level */
      minZoom: 0.5,

      /** Maximum zoom level */
      maxZoom: 3,

      /** Multiply or decrease scrolling speed **/
      speedMultiplier: 1,

      /** Callback that is fired on the later of touch end or deceleration end,
        provided that another scrolling action has not begun. Used to know
        when to fade out a scrollbar. */
      scrollingComplete: NOOP,

      /** This configures the amount of change applied to deceleration when reaching boundaries  **/
      penetrationDeceleration : 0.03,

      /** This configures the amount of change applied to acceleration when reaching boundaries  **/
      penetrationAcceleration : 0.08,

      // The ms interval for triggering scroll events
      scrollEventInterval: 50
		};

		for (var key in options) {
			this.options[key] = options[key];
		}

    this.hintResize = ionic.debounce(function() {
      self.resize();
    }, 1000, true);

    this.triggerScrollEvent = ionic.throttle(function() {
      ionic.trigger('scroll', {
        scrollTop: self.__scrollTop,
        scrollLeft: self.__scrollLeft,
        target: self.__container
      });
    }, this.options.scrollEventInterval);

    this.triggerScrollEndEvent = function() {
      ionic.trigger('scrollend', {
        scrollTop: self.__scrollTop,
        scrollLeft: self.__scrollLeft,
        target: self.__container
      });
    };

    this.__scrollLeft = this.options.startX;
    this.__scrollTop = this.options.startY;

    // Get the render update function, initialize event handlers,
    // and calculate the size of the scroll container
		this.__callback = this.getRenderFn();
    this.__initEventHandlers();
    this.__createScrollbars();

  },

  run: function() {
    this.resize();

    // Fade them out
    this.__fadeScrollbars('out', this.options.scrollbarResizeFadeDelay);
	},



  /*
  ---------------------------------------------------------------------------
    INTERNAL FIELDS :: STATUS
  ---------------------------------------------------------------------------
  */

  /** Whether only a single finger is used in touch handling */
  __isSingleTouch: false,

  /** Whether a touch event sequence is in progress */
  __isTracking: false,

  /** Whether a deceleration animation went to completion. */
  __didDecelerationComplete: false,

  /**
   * Whether a gesture zoom/rotate event is in progress. Activates when
   * a gesturestart event happens. This has higher priority than dragging.
   */
  __isGesturing: false,

  /**
   * Whether the user has moved by such a distance that we have enabled
   * dragging mode. Hint: It's only enabled after some pixels of movement to
   * not interrupt with clicks etc.
   */
  __isDragging: false,

  /**
   * Not touching and dragging anymore, and smoothly animating the
   * touch sequence using deceleration.
   */
  __isDecelerating: false,

  /**
   * Smoothly animating the currently configured change
   */
  __isAnimating: false,



  /*
  ---------------------------------------------------------------------------
    INTERNAL FIELDS :: DIMENSIONS
  ---------------------------------------------------------------------------
  */

  /** Available outer left position (from document perspective) */
  __clientLeft: 0,

  /** Available outer top position (from document perspective) */
  __clientTop: 0,

  /** Available outer width */
  __clientWidth: 0,

  /** Available outer height */
  __clientHeight: 0,

  /** Outer width of content */
  __contentWidth: 0,

  /** Outer height of content */
  __contentHeight: 0,

  /** Snapping width for content */
  __snapWidth: 100,

  /** Snapping height for content */
  __snapHeight: 100,

  /** Height to assign to refresh area */
  __refreshHeight: null,

  /** Whether the refresh process is enabled when the event is released now */
  __refreshActive: false,

  /** Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release */
  __refreshActivate: null,

  /** Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled */
  __refreshDeactivate: null,

  /** Callback to execute to start the actual refresh. Call {@link #refreshFinish} when done */
  __refreshStart: null,

  /** Zoom level */
  __zoomLevel: 1,

  /** Scroll position on x-axis */
  __scrollLeft: 0,

  /** Scroll position on y-axis */
  __scrollTop: 0,

  /** Maximum allowed scroll position on x-axis */
  __maxScrollLeft: 0,

  /** Maximum allowed scroll position on y-axis */
  __maxScrollTop: 0,

  /* Scheduled left position (final position when animating) */
  __scheduledLeft: 0,

  /* Scheduled top position (final position when animating) */
  __scheduledTop: 0,

  /* Scheduled zoom level (final scale when animating) */
  __scheduledZoom: 0,



  /*
  ---------------------------------------------------------------------------
    INTERNAL FIELDS :: LAST POSITIONS
  ---------------------------------------------------------------------------
  */

  /** Left position of finger at start */
  __lastTouchLeft: null,

  /** Top position of finger at start */
  __lastTouchTop: null,

  /** Timestamp of last move of finger. Used to limit tracking range for deceleration speed. */
  __lastTouchMove: null,

  /** List of positions, uses three indexes for each state: left, top, timestamp */
  __positions: null,



  /*
  ---------------------------------------------------------------------------
    INTERNAL FIELDS :: DECELERATION SUPPORT
  ---------------------------------------------------------------------------
  */

  /** Minimum left scroll position during deceleration */
  __minDecelerationScrollLeft: null,

  /** Minimum top scroll position during deceleration */
  __minDecelerationScrollTop: null,

  /** Maximum left scroll position during deceleration */
  __maxDecelerationScrollLeft: null,

  /** Maximum top scroll position during deceleration */
  __maxDecelerationScrollTop: null,

  /** Current factor to modify horizontal scroll position with on every step */
  __decelerationVelocityX: null,

  /** Current factor to modify vertical scroll position with on every step */
  __decelerationVelocityY: null,


  /** the browser-specific property to use for transforms */
  __transformProperty: null,
  __perspectiveProperty: null,

  /** scrollbar indicators */
  __indicatorX: null,
  __indicatorY: null,

  /** Timeout for scrollbar fading */
  __scrollbarFadeTimeout: null,

  /** whether we've tried to wait for size already */
  __didWaitForSize: null,
  __sizerTimeout: null,

  __initEventHandlers: function() {
    var self = this;

    // Event Handler
    var container = this.__container;

    //Broadcasted when keyboard is shown on some platforms.
    //See js/utils/keyboard.js
    container.addEventListener('scrollChildIntoView', function(e) {
      var deviceHeight = window.innerHeight;
      var element = e.target;
      var elementHeight = e.target.offsetHeight;

      //getBoundingClientRect() will actually give us position relative to the viewport
      var elementDeviceTop = element.getBoundingClientRect().top;
      var elementScrollTop = ionic.DomUtil.getPositionInParent(element, container).top;

      //If the element is positioned under the keyboard...
      if (elementDeviceTop + elementHeight > deviceHeight) {
        //Put element in middle of visible screen
        self.scrollTo(0, elementScrollTop + elementHeight - (deviceHeight * 0.5), true);
      }

      //Only the first scrollView parent of the element that broadcasted this event
      //(the active element that needs to be shown) should receive this event
      e.stopPropagation();
    });

    function shouldIgnorePress(e) {
      // Don't react if initial down happens on a form element
      return e.target.tagName.match(IS_INPUT_LIKE_REGEX) ||
             e.target.isContentEditable ||
             e.target.tagName.match(IS_EMBEDDED_OBJECT_REGEX) ||
             e.target.dataset.preventScroll;
    }


    if ('ontouchstart' in window) {

      container.addEventListener("touchstart", function(e) {
        if (e.defaultPrevented || shouldIgnorePress(e)) {
          return;
        }
        self.doTouchStart(e.touches, e.timeStamp);
        e.preventDefault();
      }, false);

      document.addEventListener("touchmove", function(e) {
        if(e.defaultPrevented) {
          return;
        }
        self.doTouchMove(e.touches, e.timeStamp);
      }, false);

      document.addEventListener("touchend", function(e) {
        self.doTouchEnd(e.timeStamp);
      }, false);

    } else {

      var mousedown = false;

      container.addEventListener("mousedown", function(e) {
        if (e.defaultPrevented || shouldIgnorePress(e)) {
          return;
        }
        self.doTouchStart([{
          pageX: e.pageX,
          pageY: e.pageY
        }], e.timeStamp);

        e.preventDefault();
        mousedown = true;
      }, false);

      document.addEventListener("mousemove", function(e) {
        if (!mousedown || e.defaultPrevented) {
          return;
        }

        self.doTouchMove([{
          pageX: e.pageX,
          pageY: e.pageY
        }], e.timeStamp);

        mousedown = true;
      }, false);

      document.addEventListener("mouseup", function(e) {
        if (!mousedown) {
          return;
        }

        self.doTouchEnd(e.timeStamp);

        mousedown = false;
      }, false);

      var wheelShowBarFn = ionic.debounce(function() {
        self.__fadeScrollbars('in');
      }, 500, true);

      var wheelHideBarFn = ionic.debounce(function() {
        self.__fadeScrollbars('out');
      }, 100, false);

      document.addEventListener("mousewheel", function(e) {
        wheelShowBarFn();
        self.scrollBy(e.wheelDeltaX/self.options.wheelDampen, -e.wheelDeltaY/self.options.wheelDampen);
        wheelHideBarFn();
      });
    }
  },

  /** Create a scroll bar div with the given direction **/
  __createScrollbar: function(direction) {
    var bar = document.createElement('div'),
      indicator = document.createElement('div');

    indicator.className = 'scroll-bar-indicator';

    if(direction == 'h') {
      bar.className = 'scroll-bar scroll-bar-h';
    } else {
      bar.className = 'scroll-bar scroll-bar-v';
    }

    bar.appendChild(indicator);
    return bar;
  },

  __createScrollbars: function() {
    var indicatorX, indicatorY;

    if(this.options.scrollingX) {
      indicatorX = {
        el: this.__createScrollbar('h'),
        sizeRatio: 1
      };
      indicatorX.indicator = indicatorX.el.children[0];

      if(this.options.scrollbarX) {
        this.__container.appendChild(indicatorX.el);
      }
      this.__indicatorX = indicatorX;
    }

    if(this.options.scrollingY) {
      indicatorY = {
        el: this.__createScrollbar('v'),
        sizeRatio: 1
      };
      indicatorY.indicator = indicatorY.el.children[0];

      if(this.options.scrollbarY) {
        this.__container.appendChild(indicatorY.el);
      }
      this.__indicatorY = indicatorY;
    }
  },

  __resizeScrollbars: function() {
    var self = this;

    // Update horiz bar
    if(self.__indicatorX) {
      var width = Math.max(Math.round(self.__clientWidth * self.__clientWidth / (self.__contentWidth)), 20);
      if(width > self.__contentWidth) {
        width = 0;
      }
      self.__indicatorX.size = width;
      self.__indicatorX.minScale = this.options.minScrollbarSizeX / width;
      self.__indicatorX.indicator.style.width = width + 'px';
      self.__indicatorX.maxPos = self.__clientWidth - width;
      self.__indicatorX.sizeRatio = self.__maxScrollLeft ? self.__indicatorX.maxPos / self.__maxScrollLeft : 1;
    }

    // Update vert bar
    if(self.__indicatorY) {
      var height = Math.max(Math.round(self.__clientHeight * self.__clientHeight / (self.__contentHeight)), 20);
      if(height > self.__contentHeight) {
        height = 0;
      }
      self.__indicatorY.size = height;
      self.__indicatorY.minScale = this.options.minScrollbarSizeY / height;
      self.__indicatorY.maxPos = self.__clientHeight - height;
      self.__indicatorY.indicator.style.height = height + 'px';
      self.__indicatorY.sizeRatio = self.__maxScrollTop ? self.__indicatorY.maxPos / self.__maxScrollTop : 1;
    }
  },

  /**
   * Move and scale the scrollbars as the page scrolls.
   */
  __repositionScrollbars: function() {
    var self = this, width, heightScale,
        widthDiff, heightDiff,
        x, y,
        xstop = 0, ystop = 0;

    if(self.__indicatorX) {
      // Handle the X scrollbar

      // Don't go all the way to the right if we have a vertical scrollbar as well
      if(self.__indicatorY) xstop = 10;

      x = Math.round(self.__indicatorX.sizeRatio * self.__scrollLeft) || 0,

      // The the difference between the last content X position, and our overscrolled one
      widthDiff = self.__scrollLeft - (self.__maxScrollLeft - xstop);

      if(self.__scrollLeft < 0) {

        widthScale = Math.max(self.__indicatorX.minScale,
            (self.__indicatorX.size - Math.abs(self.__scrollLeft)) / self.__indicatorX.size);

        // Stay at left
        x = 0;

        // Make sure scale is transformed from the left/center origin point
        self.__indicatorX.indicator.style[self.__transformOriginProperty] = 'left center';
      } else if(widthDiff > 0) {

        widthScale = Math.max(self.__indicatorX.minScale,
            (self.__indicatorX.size - widthDiff) / self.__indicatorX.size);

        // Stay at the furthest x for the scrollable viewport
        x = self.__indicatorX.maxPos - xstop;

        // Make sure scale is transformed from the right/center origin point
        self.__indicatorX.indicator.style[self.__transformOriginProperty] = 'right center';

      } else {

        // Normal motion
        x = Math.min(self.__maxScrollLeft, Math.max(0, x));
        widthScale = 1;

      }

      self.__indicatorX.indicator.style[self.__transformProperty] = 'translate3d(' + x + 'px, 0, 0) scaleX(' + widthScale + ')';
    }

    if(self.__indicatorY) {

      y = Math.round(self.__indicatorY.sizeRatio * self.__scrollTop) || 0;

      // Don't go all the way to the right if we have a vertical scrollbar as well
      if(self.__indicatorX) ystop = 10;

      heightDiff = self.__scrollTop - (self.__maxScrollTop - ystop);

      if(self.__scrollTop < 0) {

        heightScale = Math.max(self.__indicatorY.minScale, (self.__indicatorY.size - Math.abs(self.__scrollTop)) / self.__indicatorY.size);

        // Stay at top
        y = 0;

        // Make sure scale is transformed from the center/top origin point
        self.__indicatorY.indicator.style[self.__transformOriginProperty] = 'center top';

      } else if(heightDiff > 0) {

        heightScale = Math.max(self.__indicatorY.minScale, (self.__indicatorY.size - heightDiff) / self.__indicatorY.size);

        // Stay at bottom of scrollable viewport
        y = self.__indicatorY.maxPos - ystop;

        // Make sure scale is transformed from the center/bottom origin point
        self.__indicatorY.indicator.style[self.__transformOriginProperty] = 'center bottom';

      } else {

        // Normal motion
        y = Math.min(self.__maxScrollTop, Math.max(0, y));
        heightScale = 1;

      }

      self.__indicatorY.indicator.style[self.__transformProperty] = 'translate3d(0,' + y + 'px, 0) scaleY(' + heightScale + ')';
    }
  },

  __fadeScrollbars: function(direction, delay) {
    var self = this;

    if(!this.options.scrollbarsFade) {
      return;
    }

    var className = 'scroll-bar-fade-out';

    if(self.options.scrollbarsFade === true) {
      clearTimeout(self.__scrollbarFadeTimeout);

      if(direction == 'in') {
        if(self.__indicatorX) { self.__indicatorX.indicator.classList.remove(className); }
        if(self.__indicatorY) { self.__indicatorY.indicator.classList.remove(className); }
      } else {
        self.__scrollbarFadeTimeout = setTimeout(function() {
          if(self.__indicatorX) { self.__indicatorX.indicator.classList.add(className); }
          if(self.__indicatorY) { self.__indicatorY.indicator.classList.add(className); }
        }, delay || self.options.scrollbarFadeDelay);
      }
    }
  },

  __scrollingComplete: function() {
    var self = this;
    self.options.scrollingComplete();

    self.__fadeScrollbars('out');
  },

  resize: function() {
    // Update Scroller dimensions for changed content
    // Add padding to bottom of content
    this.setDimensions(
    	this.__container.clientWidth,
    	this.__container.clientHeight,
    	Math.max(this.__content.scrollWidth, this.__content.offsetWidth),
      Math.max(this.__content.scrollHeight, this.__content.offsetHeight)
    );
  },
  /*
  ---------------------------------------------------------------------------
    PUBLIC API
  ---------------------------------------------------------------------------
  */

  getRenderFn: function() {
    var self = this;

    var content = this.__content;

	  var docStyle = document.documentElement.style;

    var engine;
    if ('MozAppearance' in docStyle) {
      engine = 'gecko';
    } else if ('WebkitAppearance' in docStyle) {
      engine = 'webkit';
    } else if (typeof navigator.cpuClass === 'string') {
      engine = 'trident';
    }

    var vendorPrefix = {
      trident: 'ms',
      gecko: 'Moz',
      webkit: 'Webkit',
      presto: 'O'
    }[engine];

    var helperElem = document.createElement("div");
    var undef;

    var perspectiveProperty = vendorPrefix + "Perspective";
    var transformProperty = vendorPrefix + "Transform";
    var transformOriginProperty = vendorPrefix + 'TransformOrigin';

    self.__perspectiveProperty = transformProperty;
    self.__transformProperty = transformProperty;
    self.__transformOriginProperty = transformOriginProperty;

    if (helperElem.style[perspectiveProperty] !== undef) {

      return function(left, top, zoom) {
        content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0)';
        self.__repositionScrollbars();
        self.triggerScrollEvent();
      };

    } else if (helperElem.style[transformProperty] !== undef) {

      return function(left, top, zoom) {
        content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px)';
        self.__repositionScrollbars();
        self.triggerScrollEvent();
      };

    } else {

      return function(left, top, zoom) {
        content.style.marginLeft = left ? (-left/zoom) + 'px' : '';
        content.style.marginTop = top ? (-top/zoom) + 'px' : '';
        content.style.zoom = zoom || '';
        self.__repositionScrollbars();
        self.triggerScrollEvent();
      };

    }
  },


  /**
   * Configures the dimensions of the client (outer) and content (inner) elements.
   * Requires the available space for the outer element and the outer size of the inner element.
   * All values which are falsy (null or zero etc.) are ignored and the old value is kept.
   *
   * @param clientWidth {Integer} Inner width of outer element
   * @param clientHeight {Integer} Inner height of outer element
   * @param contentWidth {Integer} Outer width of inner element
   * @param contentHeight {Integer} Outer height of inner element
   */
  setDimensions: function(clientWidth, clientHeight, contentWidth, contentHeight) {

    var self = this;

    // Only update values which are defined
    if (clientWidth === +clientWidth) {
      self.__clientWidth = clientWidth;
    }

    if (clientHeight === +clientHeight) {
      self.__clientHeight = clientHeight;
    }

    if (contentWidth === +contentWidth) {
      self.__contentWidth = contentWidth;
    }

    if (contentHeight === +contentHeight) {
      self.__contentHeight = contentHeight;
    }

    // Refresh maximums
    self.__computeScrollMax();
    self.__resizeScrollbars();

    // Refresh scroll position
    self.scrollTo(self.__scrollLeft, self.__scrollTop, true);

  },


  /**
   * Sets the client coordinates in relation to the document.
   *
   * @param left {Integer} Left position of outer element
   * @param top {Integer} Top position of outer element
   */
  setPosition: function(left, top) {

    var self = this;

    self.__clientLeft = left || 0;
    self.__clientTop = top || 0;

  },


  /**
   * Configures the snapping (when snapping is active)
   *
   * @param width {Integer} Snapping width
   * @param height {Integer} Snapping height
   */
  setSnapSize: function(width, height) {

    var self = this;

    self.__snapWidth = width;
    self.__snapHeight = height;

  },


  /**
   * Activates pull-to-refresh. A special zone on the top of the list to start a list refresh whenever
   * the user event is released during visibility of this zone. This was introduced by some apps on iOS like
   * the official Twitter client.
   *
   * @param height {Integer} Height of pull-to-refresh zone on top of rendered list
   * @param activateCallback {Function} Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release.
   * @param deactivateCallback {Function} Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled.
   * @param startCallback {Function} Callback to execute to start the real async refresh action. Call {@link #finishPullToRefresh} after finish of refresh.
   */
  activatePullToRefresh: function(height, activateCallback, deactivateCallback, startCallback) {

    var self = this;

    self.__refreshHeight = height;
    self.__refreshActivate = activateCallback;
    self.__refreshDeactivate = deactivateCallback;
    self.__refreshStart = startCallback;

  },


  /**
   * Starts pull-to-refresh manually.
   */
  triggerPullToRefresh: function() {
    // Use publish instead of scrollTo to allow scrolling to out of boundary position
    // We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
    this.__publish(this.__scrollLeft, -this.__refreshHeight, this.__zoomLevel, true);

    if (this.__refreshStart) {
      this.__refreshStart();
    }
  },


  /**
   * Signalizes that pull-to-refresh is finished.
   */
  finishPullToRefresh: function() {

    var self = this;

    self.__refreshActive = false;
    if (self.__refreshDeactivate) {
      self.__refreshDeactivate();
    }

    self.scrollTo(self.__scrollLeft, self.__scrollTop, true);

  },


  /**
   * Returns the scroll position and zooming values
   *
   * @return {Map} `left` and `top` scroll position and `zoom` level
   */
  getValues: function() {

    var self = this;

    return {
      left: self.__scrollLeft,
      top: self.__scrollTop,
      zoom: self.__zoomLevel
    };

  },


  /**
   * Returns the maximum scroll values
   *
   * @return {Map} `left` and `top` maximum scroll values
   */
  getScrollMax: function() {

    var self = this;

    return {
      left: self.__maxScrollLeft,
      top: self.__maxScrollTop
    };

  },


  /**
   * Zooms to the given level. Supports optional animation. Zooms
   * the center when no coordinates are given.
   *
   * @param level {Number} Level to zoom to
   * @param animate {Boolean} Whether to use animation
   * @param originLeft {Number} Zoom in at given left coordinate
   * @param originTop {Number} Zoom in at given top coordinate
   */
  zoomTo: function(level, animate, originLeft, originTop) {

    var self = this;

    if (!self.options.zooming) {
      throw new Error("Zooming is not enabled!");
    }

    // Stop deceleration
    if (self.__isDecelerating) {
      core.effect.Animate.stop(self.__isDecelerating);
      self.__isDecelerating = false;
    }

    var oldLevel = self.__zoomLevel;

    // Normalize input origin to center of viewport if not defined
    if (originLeft == null) {
      originLeft = self.__clientWidth / 2;
    }

    if (originTop == null) {
      originTop = self.__clientHeight / 2;
    }

    // Limit level according to configuration
    level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);

    // Recompute maximum values while temporary tweaking maximum scroll ranges
    self.__computeScrollMax(level);

    // Recompute left and top coordinates based on new zoom level
    var left = ((originLeft + self.__scrollLeft) * level / oldLevel) - originLeft;
    var top = ((originTop + self.__scrollTop) * level / oldLevel) - originTop;

    // Limit x-axis
    if (left > self.__maxScrollLeft) {
      left = self.__maxScrollLeft;
    } else if (left < 0) {
      left = 0;
    }

    // Limit y-axis
    if (top > self.__maxScrollTop) {
      top = self.__maxScrollTop;
    } else if (top < 0) {
      top = 0;
    }

    // Push values out
    self.__publish(left, top, level, animate);

  },


  /**
   * Zooms the content by the given factor.
   *
   * @param factor {Number} Zoom by given factor
   * @param animate {Boolean} Whether to use animation
   * @param originLeft {Number} Zoom in at given left coordinate
   * @param originTop {Number} Zoom in at given top coordinate
   */
  zoomBy: function(factor, animate, originLeft, originTop) {

    var self = this;

    self.zoomTo(self.__zoomLevel * factor, animate, originLeft, originTop);

  },


  /**
   * Scrolls to the given position. Respect limitations and snapping automatically.
   *
   * @param left {Number} Horizontal scroll position, keeps current if value is <code>null</code>
   * @param top {Number} Vertical scroll position, keeps current if value is <code>null</code>
   * @param animate {Boolean} Whether the scrolling should happen using an animation
   * @param zoom {Number} Zoom level to go to
   */
  scrollTo: function(left, top, animate, zoom) {

    var self = this;

    // Stop deceleration
    if (self.__isDecelerating) {
      core.effect.Animate.stop(self.__isDecelerating);
      self.__isDecelerating = false;
    }

    // Correct coordinates based on new zoom level
    if (zoom != null && zoom !== self.__zoomLevel) {

      if (!self.options.zooming) {
        throw new Error("Zooming is not enabled!");
      }

      left *= zoom;
      top *= zoom;

      // Recompute maximum values while temporary tweaking maximum scroll ranges
      self.__computeScrollMax(zoom);

    } else {

      // Keep zoom when not defined
      zoom = self.__zoomLevel;

    }

    if (!self.options.scrollingX) {

      left = self.__scrollLeft;

    } else {

      if (self.options.paging) {
        left = Math.round(left / self.__clientWidth) * self.__clientWidth;
      } else if (self.options.snapping) {
        left = Math.round(left / self.__snapWidth) * self.__snapWidth;
      }

    }

    if (!self.options.scrollingY) {

      top = self.__scrollTop;

    } else {

      if (self.options.paging) {
        top = Math.round(top / self.__clientHeight) * self.__clientHeight;
      } else if (self.options.snapping) {
        top = Math.round(top / self.__snapHeight) * self.__snapHeight;
      }

    }

    // Limit for allowed ranges
    left = Math.max(Math.min(self.__maxScrollLeft, left), 0);
    top = Math.max(Math.min(self.__maxScrollTop, top), 0);

    // Don't animate when no change detected, still call publish to make sure
    // that rendered position is really in-sync with internal data
    if (left === self.__scrollLeft && top === self.__scrollTop) {
      animate = false;
    }

    // Publish new values
    self.__publish(left, top, zoom, animate);

  },


  /**
   * Scroll by the given offset
   *
   * @param left {Number} Scroll x-axis by given offset
   * @param top {Number} Scroll x-axis by given offset
   * @param animate {Boolean} Whether to animate the given change
   */
  scrollBy: function(left, top, animate) {

    var self = this;

    var startLeft = self.__isAnimating ? self.__scheduledLeft : self.__scrollLeft;
    var startTop = self.__isAnimating ? self.__scheduledTop : self.__scrollTop;

    self.scrollTo(startLeft + (left || 0), startTop + (top || 0), animate);

  },



  /*
  ---------------------------------------------------------------------------
    EVENT CALLBACKS
  ---------------------------------------------------------------------------
  */

  /**
   * Mouse wheel handler for zooming support
   */
  doMouseZoom: function(wheelDelta, timeStamp, pageX, pageY) {

    var self = this;
    var change = wheelDelta > 0 ? 0.97 : 1.03;

    return self.zoomTo(self.__zoomLevel * change, false, pageX - self.__clientLeft, pageY - self.__clientTop);

  },


  /**
   * Touch start handler for scrolling support
   */
  doTouchStart: function(touches, timeStamp) {
    this.hintResize();

    // Array-like check is enough here
    if (touches.length == null) {
      throw new Error("Invalid touch list: " + touches);
    }

    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }
    if (typeof timeStamp !== "number") {
      throw new Error("Invalid timestamp value: " + timeStamp);
    }

    var self = this;

    // Reset interruptedAnimation flag
    self.__interruptedAnimation = true;

    // Stop deceleration
    if (self.__isDecelerating) {
      core.effect.Animate.stop(self.__isDecelerating);
      self.__isDecelerating = false;
      self.__interruptedAnimation = true;
    }

    // Stop animation
    if (self.__isAnimating) {
      core.effect.Animate.stop(self.__isAnimating);
      self.__isAnimating = false;
      self.__interruptedAnimation = true;
    }

    // Use center point when dealing with two fingers
    var currentTouchLeft, currentTouchTop;
    var isSingleTouch = touches.length === 1;
    if (isSingleTouch) {
      currentTouchLeft = touches[0].pageX;
      currentTouchTop = touches[0].pageY;
    } else {
      currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
      currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
    }

    // Store initial positions
    self.__initialTouchLeft = currentTouchLeft;
    self.__initialTouchTop = currentTouchTop;

    // Store current zoom level
    self.__zoomLevelStart = self.__zoomLevel;

    // Store initial touch positions
    self.__lastTouchLeft = currentTouchLeft;
    self.__lastTouchTop = currentTouchTop;

    // Store initial move time stamp
    self.__lastTouchMove = timeStamp;

    // Reset initial scale
    self.__lastScale = 1;

    // Reset locking flags
    self.__enableScrollX = !isSingleTouch && self.options.scrollingX;
    self.__enableScrollY = !isSingleTouch && self.options.scrollingY;

    // Reset tracking flag
    self.__isTracking = true;

    // Reset deceleration complete flag
    self.__didDecelerationComplete = false;

    // Dragging starts directly with two fingers, otherwise lazy with an offset
    self.__isDragging = !isSingleTouch;

    // Some features are disabled in multi touch scenarios
    self.__isSingleTouch = isSingleTouch;

    // Clearing data structure
    self.__positions = [];

  },


  /**
   * Touch move handler for scrolling support
   */
  doTouchMove: function(touches, timeStamp, scale) {

    // Array-like check is enough here
    if (touches.length == null) {
      throw new Error("Invalid touch list: " + touches);
    }

    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }
    if (typeof timeStamp !== "number") {
      throw new Error("Invalid timestamp value: " + timeStamp);
    }

    var self = this;

    // Ignore event when tracking is not enabled (event might be outside of element)
    if (!self.__isTracking) {
      return;
    }


    var currentTouchLeft, currentTouchTop;

    // Compute move based around of center of fingers
    if (touches.length === 2) {
      currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
      currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
    } else {
      currentTouchLeft = touches[0].pageX;
      currentTouchTop = touches[0].pageY;
    }

    var positions = self.__positions;

    // Are we already is dragging mode?
    if (self.__isDragging) {

      // Compute move distance
      var moveX = currentTouchLeft - self.__lastTouchLeft;
      var moveY = currentTouchTop - self.__lastTouchTop;

      // Read previous scroll position and zooming
      var scrollLeft = self.__scrollLeft;
      var scrollTop = self.__scrollTop;
      var level = self.__zoomLevel;

      // Work with scaling
      if (scale != null && self.options.zooming) {

        var oldLevel = level;

        // Recompute level based on previous scale and new scale
        level = level / self.__lastScale * scale;

        // Limit level according to configuration
        level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);

        // Only do further compution when change happened
        if (oldLevel !== level) {

          // Compute relative event position to container
          var currentTouchLeftRel = currentTouchLeft - self.__clientLeft;
          var currentTouchTopRel = currentTouchTop - self.__clientTop;

          // Recompute left and top coordinates based on new zoom level
          scrollLeft = ((currentTouchLeftRel + scrollLeft) * level / oldLevel) - currentTouchLeftRel;
          scrollTop = ((currentTouchTopRel + scrollTop) * level / oldLevel) - currentTouchTopRel;

          // Recompute max scroll values
          self.__computeScrollMax(level);

        }
      }

      if (self.__enableScrollX) {

        scrollLeft -= moveX * this.options.speedMultiplier;
        var maxScrollLeft = self.__maxScrollLeft;

        if (scrollLeft > maxScrollLeft || scrollLeft < 0) {

          // Slow down on the edges
          if (self.options.bouncing) {

            scrollLeft += (moveX / 2  * this.options.speedMultiplier);

          } else if (scrollLeft > maxScrollLeft) {

            scrollLeft = maxScrollLeft;

          } else {

            scrollLeft = 0;

          }
        }
      }

      // Compute new vertical scroll position
      if (self.__enableScrollY) {

        scrollTop -= moveY * this.options.speedMultiplier;
        var maxScrollTop = self.__maxScrollTop;

        if (scrollTop > maxScrollTop || scrollTop < 0) {

          // Slow down on the edges
          if (self.options.bouncing || (self.__refreshHeight && scrollTop < 0)) {

            scrollTop += (moveY / 2 * this.options.speedMultiplier);

            // Support pull-to-refresh (only when only y is scrollable)
            if (!self.__enableScrollX && self.__refreshHeight != null) {

              if (!self.__refreshActive && scrollTop <= -self.__refreshHeight) {

                self.__refreshActive = true;
                if (self.__refreshActivate) {
                  self.__refreshActivate();
                }

              } else if (self.__refreshActive && scrollTop > -self.__refreshHeight) {

                self.__refreshActive = false;
                if (self.__refreshDeactivate) {
                  self.__refreshDeactivate();
                }

              }
            }

          } else if (scrollTop > maxScrollTop) {

            scrollTop = maxScrollTop;

          } else {

            scrollTop = 0;

          }
        }
      }

      // Keep list from growing infinitely (holding min 10, max 20 measure points)
      if (positions.length > 60) {
        positions.splice(0, 30);
      }

      // Track scroll movement for decleration
      positions.push(scrollLeft, scrollTop, timeStamp);

      // Sync scroll position
      self.__publish(scrollLeft, scrollTop, level);

    // Otherwise figure out whether we are switching into dragging mode now.
    } else {

      var minimumTrackingForScroll = self.options.locking ? 3 : 0;
      var minimumTrackingForDrag = 5;

      var distanceX = Math.abs(currentTouchLeft - self.__initialTouchLeft);
      var distanceY = Math.abs(currentTouchTop - self.__initialTouchTop);

      self.__enableScrollX = self.options.scrollingX && distanceX >= minimumTrackingForScroll;
      self.__enableScrollY = self.options.scrollingY && distanceY >= minimumTrackingForScroll;

      positions.push(self.__scrollLeft, self.__scrollTop, timeStamp);

      self.__isDragging = (self.__enableScrollX || self.__enableScrollY) && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);
      if (self.__isDragging) {
        self.__interruptedAnimation = false;
        self.__fadeScrollbars('in');
      }

    }

    // Update last touch positions and time stamp for next event
    self.__lastTouchLeft = currentTouchLeft;
    self.__lastTouchTop = currentTouchTop;
    self.__lastTouchMove = timeStamp;
    self.__lastScale = scale;

  },


  /**
   * Touch end handler for scrolling support
   */
  doTouchEnd: function(timeStamp) {

    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }
    if (typeof timeStamp !== "number") {
      throw new Error("Invalid timestamp value: " + timeStamp);
    }

    var self = this;

    // Ignore event when tracking is not enabled (no touchstart event on element)
    // This is required as this listener ('touchmove') sits on the document and not on the element itself.
    if (!self.__isTracking) {
      return;
    }

    // Not touching anymore (when two finger hit the screen there are two touch end events)
    self.__isTracking = false;

    // Be sure to reset the dragging flag now. Here we also detect whether
    // the finger has moved fast enough to switch into a deceleration animation.
    if (self.__isDragging) {

      // Reset dragging flag
      self.__isDragging = false;

      // Start deceleration
      // Verify that the last move detected was in some relevant time frame
      if (self.__isSingleTouch && self.options.animating && (timeStamp - self.__lastTouchMove) <= 100) {

        // Then figure out what the scroll position was about 100ms ago
        var positions = self.__positions;
        var endPos = positions.length - 1;
        var startPos = endPos;

        // Move pointer to position measured 100ms ago
        for (var i = endPos; i > 0 && positions[i] > (self.__lastTouchMove - 100); i -= 3) {
          startPos = i;
        }

        // If start and stop position is identical in a 100ms timeframe,
        // we cannot compute any useful deceleration.
        if (startPos !== endPos) {

          // Compute relative movement between these two points
          var timeOffset = positions[endPos] - positions[startPos];
          var movedLeft = self.__scrollLeft - positions[startPos - 2];
          var movedTop = self.__scrollTop - positions[startPos - 1];

          // Based on 50ms compute the movement to apply for each render step
          self.__decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
          self.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60);

          // How much velocity is required to start the deceleration
          var minVelocityToStartDeceleration = self.options.paging || self.options.snapping ? 4 : 1;

          // Verify that we have enough velocity to start deceleration
          if (Math.abs(self.__decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(self.__decelerationVelocityY) > minVelocityToStartDeceleration) {

            // Deactivate pull-to-refresh when decelerating
            if (!self.__refreshActive) {
              self.__startDeceleration(timeStamp);
            }
          }
        } else {
          self.__scrollingComplete();
        }
      } else if ((timeStamp - self.__lastTouchMove) > 100) {
        self.__scrollingComplete();
      }
    }

    // If this was a slower move it is per default non decelerated, but this
    // still means that we want snap back to the bounds which is done here.
    // This is placed outside the condition above to improve edge case stability
    // e.g. touchend fired without enabled dragging. This should normally do not
    // have modified the scroll positions or even showed the scrollbars though.
    if (!self.__isDecelerating) {

      if (self.__refreshActive && self.__refreshStart) {

        // Use publish instead of scrollTo to allow scrolling to out of boundary position
        // We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
        self.__publish(self.__scrollLeft, -self.__refreshHeight, self.__zoomLevel, true);

        if (self.__refreshStart) {
          self.__refreshStart();
        }

      } else {

        if (self.__interruptedAnimation || self.__isDragging) {
          self.__scrollingComplete();
        }
        self.scrollTo(self.__scrollLeft, self.__scrollTop, true, self.__zoomLevel);

        // Directly signalize deactivation (nothing todo on refresh?)
        if (self.__refreshActive) {

          self.__refreshActive = false;
          if (self.__refreshDeactivate) {
            self.__refreshDeactivate();
          }

        }
      }
    }

    // Fully cleanup list
    self.__positions.length = 0;

  },



  /*
  ---------------------------------------------------------------------------
    PRIVATE API
  ---------------------------------------------------------------------------
  */

  /**
   * Applies the scroll position to the content element
   *
   * @param left {Number} Left scroll position
   * @param top {Number} Top scroll position
   * @param animate {Boolean} Whether animation should be used to move to the new coordinates
   */
  __publish: function(left, top, zoom, animate) {

    var self = this;

    // Remember whether we had an animation, then we try to continue based on the current "drive" of the animation
    var wasAnimating = self.__isAnimating;
    if (wasAnimating) {
      core.effect.Animate.stop(wasAnimating);
      self.__isAnimating = false;
    }

    if (animate && self.options.animating) {

      // Keep scheduled positions for scrollBy/zoomBy functionality
      self.__scheduledLeft = left;
      self.__scheduledTop = top;
      self.__scheduledZoom = zoom;

      var oldLeft = self.__scrollLeft;
      var oldTop = self.__scrollTop;
      var oldZoom = self.__zoomLevel;

      var diffLeft = left - oldLeft;
      var diffTop = top - oldTop;
      var diffZoom = zoom - oldZoom;

      var step = function(percent, now, render) {

        if (render) {

          self.__scrollLeft = oldLeft + (diffLeft * percent);
          self.__scrollTop = oldTop + (diffTop * percent);
          self.__zoomLevel = oldZoom + (diffZoom * percent);

          // Push values out
          if (self.__callback) {
            self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel);
          }

        }
      };

      var verify = function(id) {
        return self.__isAnimating === id;
      };

      var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
        if (animationId === self.__isAnimating) {
          self.__isAnimating = false;
        }
        if (self.__didDecelerationComplete || wasFinished) {
          self.__scrollingComplete();
        }

        if (self.options.zooming) {
          self.__computeScrollMax();
        }
      };

      // When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
      self.__isAnimating = core.effect.Animate.start(step, verify, completed, self.options.animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic);

    } else {

      self.__scheduledLeft = self.__scrollLeft = left;
      self.__scheduledTop = self.__scrollTop = top;
      self.__scheduledZoom = self.__zoomLevel = zoom;

      // Push values out
      if (self.__callback) {
        self.__callback(left, top, zoom);
      }

      // Fix max scroll ranges
      if (self.options.zooming) {
        self.__computeScrollMax();
      }
    }
  },


  /**
   * Recomputes scroll minimum values based on client dimensions and content dimensions.
   */
  __computeScrollMax: function(zoomLevel) {

    var self = this;

    if (zoomLevel == null) {
      zoomLevel = self.__zoomLevel;
    }

    self.__maxScrollLeft = Math.max((self.__contentWidth * zoomLevel) - self.__clientWidth, 0);
    self.__maxScrollTop = Math.max((self.__contentHeight * zoomLevel) - self.__clientHeight, 0);

    if(!self.__didWaitForSize && self.__maxScrollLeft == 0 && self.__maxScrollTop == 0) {
      self.__didWaitForSize = true;
      self.__waitForSize();
    }
  },


  /**
   * If the scroll view isn't sized correctly on start, wait until we have at least some size
   */
  __waitForSize: function() {

    var self = this;

    clearTimeout(self.__sizerTimeout);

    var sizer = function() {
      self.resize();

      if((self.options.scrollingX && self.__maxScrollLeft == 0) || (self.options.scrollingY && self.__maxScrollTop == 0)) {
        //self.__sizerTimeout = setTimeout(sizer, 1000);
      }
    };

    sizer();
    self.__sizerTimeout = setTimeout(sizer, 1000);
  },

  /*
  ---------------------------------------------------------------------------
    ANIMATION (DECELERATION) SUPPORT
  ---------------------------------------------------------------------------
  */

  /**
   * Called when a touch sequence end and the speed of the finger was high enough
   * to switch into deceleration mode.
   */
  __startDeceleration: function(timeStamp) {

    var self = this;

    if (self.options.paging) {

      var scrollLeft = Math.max(Math.min(self.__scrollLeft, self.__maxScrollLeft), 0);
      var scrollTop = Math.max(Math.min(self.__scrollTop, self.__maxScrollTop), 0);
      var clientWidth = self.__clientWidth;
      var clientHeight = self.__clientHeight;

      // We limit deceleration not to the min/max values of the allowed range, but to the size of the visible client area.
      // Each page should have exactly the size of the client area.
      self.__minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
      self.__minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
      self.__maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
      self.__maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;

    } else {

      self.__minDecelerationScrollLeft = 0;
      self.__minDecelerationScrollTop = 0;
      self.__maxDecelerationScrollLeft = self.__maxScrollLeft;
      self.__maxDecelerationScrollTop = self.__maxScrollTop;

    }

    // Wrap class method
    var step = function(percent, now, render) {
      self.__stepThroughDeceleration(render);
    };

    // How much velocity is required to keep the deceleration running
    self.__minVelocityToKeepDecelerating = self.options.snapping ? 4 : 0.1;

    // Detect whether it's still worth to continue animating steps
    // If we are already slow enough to not being user perceivable anymore, we stop the whole process here.
    var verify = function() {
      var shouldContinue = Math.abs(self.__decelerationVelocityX) >= self.__minVelocityToKeepDecelerating ||
        Math.abs(self.__decelerationVelocityY) >= self.__minVelocityToKeepDecelerating;
      if (!shouldContinue) {
        self.__didDecelerationComplete = true;
      }
      return shouldContinue;
    };

    var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
      self.__isDecelerating = false;
      if (self.__didDecelerationComplete) {
        self.__scrollingComplete();
      }

      // Animate to grid when snapping is active, otherwise just fix out-of-boundary positions
      if(self.options.paging) {
        self.scrollTo(self.__scrollLeft, self.__scrollTop, self.options.snapping);
      }
    };

    // Start animation and switch on flag
    self.__isDecelerating = core.effect.Animate.start(step, verify, completed);

  },


  /**
   * Called on every step of the animation
   *
   * @param inMemory {Boolean} Whether to not render the current step, but keep it in memory only. Used internally only!
   */
  __stepThroughDeceleration: function(render) {

    var self = this;


    //
    // COMPUTE NEXT SCROLL POSITION
    //

    // Add deceleration to scroll position
    var scrollLeft = self.__scrollLeft + self.__decelerationVelocityX;
    var scrollTop = self.__scrollTop + self.__decelerationVelocityY;


    //
    // HARD LIMIT SCROLL POSITION FOR NON BOUNCING MODE
    //

    if (!self.options.bouncing) {

      var scrollLeftFixed = Math.max(Math.min(self.__maxDecelerationScrollLeft, scrollLeft), self.__minDecelerationScrollLeft);
      if (scrollLeftFixed !== scrollLeft) {
        scrollLeft = scrollLeftFixed;
        self.__decelerationVelocityX = 0;
      }

      var scrollTopFixed = Math.max(Math.min(self.__maxDecelerationScrollTop, scrollTop), self.__minDecelerationScrollTop);
      if (scrollTopFixed !== scrollTop) {
        scrollTop = scrollTopFixed;
        self.__decelerationVelocityY = 0;
      }

    }


    //
    // UPDATE SCROLL POSITION
    //

    if (render) {

      self.__publish(scrollLeft, scrollTop, self.__zoomLevel);

    } else {

      self.__scrollLeft = scrollLeft;
      self.__scrollTop = scrollTop;

    }


    //
    // SLOW DOWN
    //

    // Slow down velocity on every iteration
    if (!self.options.paging) {

      // This is the factor applied to every iteration of the animation
      // to slow down the process. This should emulate natural behavior where
      // objects slow down when the initiator of the movement is removed
      var frictionFactor = 0.95;

      self.__decelerationVelocityX *= frictionFactor;
      self.__decelerationVelocityY *= frictionFactor;

    }


    //
    // BOUNCING SUPPORT
    //

    if (self.options.bouncing) {

      var scrollOutsideX = 0;
      var scrollOutsideY = 0;

      // This configures the amount of change applied to deceleration/acceleration when reaching boundaries
      var penetrationDeceleration = self.options.penetrationDeceleration;
      var penetrationAcceleration = self.options.penetrationAcceleration;

      // Check limits
      if (scrollLeft < self.__minDecelerationScrollLeft) {
        scrollOutsideX = self.__minDecelerationScrollLeft - scrollLeft;
      } else if (scrollLeft > self.__maxDecelerationScrollLeft) {
        scrollOutsideX = self.__maxDecelerationScrollLeft - scrollLeft;
      }

      if (scrollTop < self.__minDecelerationScrollTop) {
        scrollOutsideY = self.__minDecelerationScrollTop - scrollTop;
      } else if (scrollTop > self.__maxDecelerationScrollTop) {
        scrollOutsideY = self.__maxDecelerationScrollTop - scrollTop;
      }

      // Slow down until slow enough, then flip back to snap position
      if (scrollOutsideX !== 0) {
        var isHeadingOutwardsX = scrollOutsideX * self.__decelerationVelocityX <= self.__minDecelerationScrollLeft;
        if (isHeadingOutwardsX) {
          self.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
        }
        var isStoppedX = Math.abs(self.__decelerationVelocityX) <= self.__minVelocityToKeepDecelerating;
        //If we're not heading outwards, or if the above statement got us below minDeceleration, go back towards bounds
        if (!isHeadingOutwardsX || isStoppedX) {
          self.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
        }
      }

      if (scrollOutsideY !== 0) {
        var isHeadingOutwardsY = scrollOutsideY * self.__decelerationVelocityY <= self.__minDecelerationScrollTop;
        if (isHeadingOutwardsY) {
          self.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
        }
        var isStoppedY = Math.abs(self.__decelerationVelocityY) <= self.__minVelocityToKeepDecelerating;
        //If we're not heading outwards, or if the above statement got us below minDeceleration, go back towards bounds
        if (!isHeadingOutwardsY || isStoppedY) {
          self.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
        }
      }
    }
  }
});

})(ionic);

(function(ionic) {
'use strict';
  /**
   * An ActionSheet is the slide up menu popularized on iOS.
   *
   * You see it all over iOS apps, where it offers a set of options 
   * triggered after an action.
   */
  ionic.views.ActionSheet = ionic.views.View.inherit({
    initialize: function(opts) {
      this.el = opts.el;
    },
    show: function() {
      // Force a reflow so the animation will actually run
      this.el.offsetWidth;

      this.el.classList.add('active');
    },
    hide: function() {
      // Force a reflow so the animation will actually run
      this.el.offsetWidth;
      this.el.classList.remove('active');
    }
  });

})(ionic);

(function(ionic) {
'use strict';

  ionic.views.HeaderBar = ionic.views.View.inherit({
    initialize: function(opts) {
      this.el = opts.el;

      ionic.extend(this, {
        alignTitle: 'center'
      }, opts);

      this.align();
    },

    align: function(align) {

      align || (align = this.alignTitle);

      // Find the titleEl element
      var titleEl = this.el.querySelector('.title');
      if(!titleEl) {
        return;
      }

      var i, c, childSize;
      var childNodes = this.el.childNodes;
      var leftWidth = 0;
      var rightWidth = 0;
      var isCountingRightWidth = false;

      // Compute how wide the left children are
      // Skip all titles (there may still be two titles, one leaving the dom)
      // Once we encounter a titleEl, realize we are now counting the right-buttons, not left
      for(i = 0; i < childNodes.length; i++) {
        c = childNodes[i];
        if (c.tagName && c.tagName.toLowerCase() == 'h1') {
          isCountingRightWidth = true;
          continue;
        }

        childSize = null;
        if(c.nodeType == 3) {
          childSize = ionic.DomUtil.getTextBounds(c);
        } else if(c.nodeType == 1) {
          childSize = c.getBoundingClientRect();
        }
        if(childSize) {
          if (isCountingRightWidth) {
            rightWidth += childSize.width;
          } else {
            leftWidth += childSize.width;
          }
        }
      }

      var self = this;
      ionic.requestAnimationFrame(function() {
        var margin = Math.max(leftWidth, rightWidth) + 10;

        // Size and align the header titleEl based on the sizes of the left and
        // right children, and the desired alignment mode
        if(align == 'center') {
          if(margin > 10) {
            titleEl.style.left = margin + 'px';
            titleEl.style.right = margin + 'px';
          }
          if(titleEl.offsetWidth < titleEl.scrollWidth) {
            if(rightWidth > 0) {
              titleEl.style.right = (rightWidth + 5) + 'px';
            }
          }
        } else if(align == 'left') {
          titleEl.classList.add('title-left');
          if(leftWidth > 0) {
            titleEl.style.left = (leftWidth + 15) + 'px';
          }
        } else if(align == 'right') {
          titleEl.classList.add('title-right');
          if(rightWidth > 0) {
            titleEl.style.right = (rightWidth + 15) + 'px';
          }
        }
      });
    }
  });

})(ionic);

(function(ionic) {
'use strict';

  var ITEM_CLASS = 'item';
  var ITEM_CONTENT_CLASS = 'item-content';
  var ITEM_SLIDING_CLASS = 'item-sliding';
  var ITEM_OPTIONS_CLASS = 'item-options';
  var ITEM_PLACEHOLDER_CLASS = 'item-placeholder';
  var ITEM_REORDERING_CLASS = 'item-reordering';
  var ITEM_REORDER_BTN_CLASS = 'item-reorder';

  var DragOp = function() {};
  DragOp.prototype = {
    start: function(e) {
    },
    drag: function(e) {
    },
    end: function(e) {
    },
    isSameItem: function(item) {
      return false;
    }
  };



  var SlideDrag = function(opts) {
    this.dragThresholdX = opts.dragThresholdX || 10;
    this.el = opts.el;
  };

  SlideDrag.prototype = new DragOp();

  SlideDrag.prototype.start = function(e) {
    var content, buttons, offsetX, buttonsWidth;

    if(e.target.classList.contains(ITEM_CONTENT_CLASS)) {
      content = e.target;
    } else if(e.target.classList.contains(ITEM_CLASS)) {
      content = e.target.querySelector('.' + ITEM_CONTENT_CLASS);
    } else {
      content = ionic.DomUtil.getParentWithClass(e.target, ITEM_CONTENT_CLASS);
    }

    // If we don't have a content area as one of our children (or ourselves), skip
    if(!content) {
      return;
    }

    // Make sure we aren't animating as we slide
    content.classList.remove(ITEM_SLIDING_CLASS);

    // Grab the starting X point for the item (for example, so we can tell whether it is open or closed to start)
    offsetX = parseFloat(content.style[ionic.CSS.TRANSFORM].replace('translate3d(', '').split(',')[0]) || 0;

    // Grab the buttons
    buttons = content.parentNode.querySelector('.' + ITEM_OPTIONS_CLASS);
    if(!buttons) {
      return;
    }

    buttonsWidth = buttons.offsetWidth;

    this._currentDrag = {
      buttonsWidth: buttonsWidth,
      content: content,
      startOffsetX: offsetX
    };
  };

  /**
   * Check if this is the same item that was previously dragged.
   */
  SlideDrag.prototype.isSameItem = function(op) {
    if(op._lastDrag && this._currentDrag) {
      return this._currentDrag.content == op._lastDrag.content;
    }
    return false;
  };

  SlideDrag.prototype.clean = function(e) {
    var lastDrag = this._lastDrag;

    if(!lastDrag) return;

    ionic.requestAnimationFrame(function() {
      lastDrag.content.style[ionic.CSS.TRANSITION] = '';
      lastDrag.content.style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
    });
  };

  SlideDrag.prototype.drag = ionic.animationFrameThrottle(function(e) {
    var buttonsWidth;

    // We really aren't dragging
    if(!this._currentDrag) {
      return;
    }

    // Check if we should start dragging. Check if we've dragged past the threshold,
    // or we are starting from the open state.
    if(!this._isDragging &&
        ((Math.abs(e.gesture.deltaX) > this.dragThresholdX) ||
        (Math.abs(this._currentDrag.startOffsetX) > 0)))
    {
      this._isDragging = true;
    }

    if(this._isDragging) {
      buttonsWidth = this._currentDrag.buttonsWidth;

      // Grab the new X point, capping it at zero
      var newX = Math.min(0, this._currentDrag.startOffsetX + e.gesture.deltaX);

      // If the new X position is past the buttons, we need to slow down the drag (rubber band style)
      if(newX < -buttonsWidth) {
        // Calculate the new X position, capped at the top of the buttons
        newX = Math.min(-buttonsWidth, -buttonsWidth + (((e.gesture.deltaX + buttonsWidth) * 0.4)));
      }

      this._currentDrag.content.style[ionic.CSS.TRANSFORM] = 'translate3d(' + newX + 'px, 0, 0)';
      this._currentDrag.content.style[ionic.CSS.TRANSITION] = 'none';
    }
  });

  SlideDrag.prototype.end = function(e, doneCallback) {
    var _this = this;

    // There is no drag, just end immediately
    if(!this._currentDrag) {
      doneCallback && doneCallback();
      return;
    }

    // If we are currently dragging, we want to snap back into place
    // The final resting point X will be the width of the exposed buttons
    var restingPoint = -this._currentDrag.buttonsWidth;

    // Check if the drag didn't clear the buttons mid-point
    // and we aren't moving fast enough to swipe open
    if(e.gesture.deltaX > -(this._currentDrag.buttonsWidth/2)) {

      // If we are going left but too slow, or going right, go back to resting
      if(e.gesture.direction == "left" && Math.abs(e.gesture.velocityX) < 0.3) {
        restingPoint = 0;
      } else if(e.gesture.direction == "right") {
        restingPoint = 0;
      }

    }

    ionic.requestAnimationFrame(function() {
      if(restingPoint === 0) {
        _this._currentDrag.content.style[ionic.CSS.TRANSFORM] = '';
      } else {
        _this._currentDrag.content.style[ionic.CSS.TRANSFORM] = 'translate3d(' + restingPoint + 'px, 0, 0)';
      }
      _this._currentDrag.content.style[ionic.CSS.TRANSITION] = '';


      // Kill the current drag
      _this._lastDrag = _this._currentDrag;
      _this._currentDrag = null;

      // We are done, notify caller
      doneCallback && doneCallback();
    });
  };

  var ReorderDrag = function(opts) {
    this.dragThresholdY = opts.dragThresholdY || 0;
    this.onReorder = opts.onReorder;
    this.el = opts.el;
    this.scrollEl = opts.scrollEl;
    this.scrollView = opts.scrollView;
  };

  ReorderDrag.prototype = new DragOp();

  ReorderDrag.prototype._moveElement = function(e) {
    var y = (e.gesture.center.pageY - this._currentDrag.elementHeight/2);
    this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(0, '+y+'px, 0)';
  };

  ReorderDrag.prototype.start = function(e) {
    var content;


    // Grab the starting Y point for the item
    var offsetY = this.el.offsetTop;//parseFloat(this.el.style[ionic.CSS.TRANSFORM].replace('translate3d(', '').split(',')[1]) || 0;

    var startIndex = ionic.DomUtil.getChildIndex(this.el, this.el.nodeName.toLowerCase());
    var elementHeight = this.el.offsetHeight;
    var placeholder = this.el.cloneNode(true);

    // If we have a scroll pane, move our draggable element outside of it
    // We do this because when we drag our element down below the edge of the page
    // and scroll the scroll-pane, if the element is *part* of the scroll-pane,
    // it will scroll 'with' the scroll-pane's contents and change position.
    var appendToElement = (this.scrollEl || this.el).parentNode;

    placeholder.classList.add(ITEM_PLACEHOLDER_CLASS);

    this.el.parentNode.insertBefore(placeholder, this.el);
    this.el.classList.add(ITEM_REORDERING_CLASS);

    appendToElement.parentNode.appendChild(this.el);

    this._currentDrag = {
      elementHeight: elementHeight,
      startIndex: startIndex,
      placeholder: placeholder,
      scrollHeight: scroll,
      list: placeholder.parentNode
    };

    this._moveElement(e);
  };

  ReorderDrag.prototype.drag = ionic.animationFrameThrottle(function(e) {
    // We really aren't dragging
    if(!this._currentDrag) {
      return;
    }

    var scrollY = 0;
    var pageY = e.gesture.center.pageY;

    //If we have a scrollView, check scroll boundaries for dragged element and scroll if necessary
    if (this.scrollView) {
      var container = this.scrollEl;

      scrollY = this.scrollView.getValues().top;

      var containerTop = container.offsetTop;
      var pixelsPastTop = containerTop - pageY + this._currentDrag.elementHeight/2;
      var pixelsPastBottom = pageY + this._currentDrag.elementHeight/2 - containerTop - container.offsetHeight;

      if (e.gesture.deltaY < 0 && pixelsPastTop > 0 && scrollY > 0) {
        this.scrollView.scrollBy(null, -pixelsPastTop);
      }
      if (e.gesture.deltaY > 0 && pixelsPastBottom > 0) {
        if (scrollY < this.scrollView.getScrollMax().top) {
          this.scrollView.scrollBy(null, pixelsPastBottom);
        }
      }
    }

    // Check if we should start dragging. Check if we've dragged past the threshold,
    // or we are starting from the open state.
    if(!this._isDragging && Math.abs(e.gesture.deltaY) > this.dragThresholdY) {
      this._isDragging = true;
    }

    if(this._isDragging) {
      this._moveElement(e);

      this._currentDrag.currentY = scrollY + pageY - this._currentDrag.placeholder.parentNode.offsetTop;

      this._reorderItems();
    }
  });

  // When an item is dragged, we need to reorder any items for sorting purposes
  ReorderDrag.prototype._reorderItems = function() {
    var placeholder = this._currentDrag.placeholder;
    var siblings = Array.prototype.slice.call(this._currentDrag.placeholder.parentNode.children);

    var index = siblings.indexOf(this._currentDrag.placeholder);
    var topSibling = siblings[Math.max(0, index - 1)];
    var bottomSibling = siblings[Math.min(siblings.length, index+1)];
    var thisOffsetTop = this._currentDrag.currentY;// + this._currentDrag.startOffsetTop;

    if(topSibling && (thisOffsetTop < topSibling.offsetTop + topSibling.offsetHeight/2)) {
      ionic.DomUtil.swapNodes(this._currentDrag.placeholder, topSibling);
      return index - 1;
    } else if(bottomSibling && thisOffsetTop > (bottomSibling.offsetTop + bottomSibling.offsetHeight/2)) {
      ionic.DomUtil.swapNodes(bottomSibling, this._currentDrag.placeholder);
      return index + 1;
    }
  };

  ReorderDrag.prototype.end = function(e, doneCallback) {
    if(!this._currentDrag) {
      doneCallback && doneCallback();
      return;
    }

    var placeholder = this._currentDrag.placeholder;
    var finalPosition = ionic.DomUtil.getChildIndex(placeholder, placeholder.nodeName.toLowerCase());

    // Reposition the element
    this.el.classList.remove(ITEM_REORDERING_CLASS);
    this.el.style[ionic.CSS.TRANSFORM] = '';

    placeholder.parentNode.insertBefore(this.el, placeholder);
    placeholder.parentNode.removeChild(placeholder);

    this.onReorder && this.onReorder(this.el, this._currentDrag.startIndex, finalPosition);

    this._currentDrag = null;
    doneCallback && doneCallback();
  };



  /**
   * The ListView handles a list of items. It will process drag animations, edit mode,
   * and other operations that are common on mobile lists or table views.
   */
  ionic.views.ListView = ionic.views.View.inherit({
    initialize: function(opts) {
      var _this = this;

      opts = ionic.extend({
        onReorder: function(el, oldIndex, newIndex) {},
        virtualRemoveThreshold: -200,
        virtualAddThreshold: 200,
        canSwipe: false
      }, opts);

      ionic.extend(this, opts);

      if(!this.itemHeight && this.listEl) {
        this.itemHeight = this.listEl.children[0] && parseInt(this.listEl.children[0].style.height, 10);
      }

      //ionic.views.ListView.__super__.initialize.call(this, opts);

      this.onRefresh = opts.onRefresh || function() {};
      this.onRefreshOpening = opts.onRefreshOpening || function() {};
      this.onRefreshHolding = opts.onRefreshHolding || function() {};

      window.ionic.onGesture('release', function(e) {
        _this._handleEndDrag(e);
      }, this.el);

      window.ionic.onGesture('drag', function(e) {
        _this._handleDrag(e);
      }, this.el);
      // Start the drag states
      this._initDrag();
    },
    /**
     * Called to tell the list to stop refreshing. This is useful
     * if you are refreshing the list and are done with refreshing.
     */
    stopRefreshing: function() {
      var refresher = this.el.querySelector('.list-refresher');
      refresher.style.height = '0px';
    },

    /**
     * If we scrolled and have virtual mode enabled, compute the window
     * of active elements in order to figure out the viewport to render.
     */
    didScroll: function(e) {
      if(this.isVirtual) {
        var itemHeight = this.itemHeight;

        // TODO: This would be inaccurate if we are windowed
        var totalItems = this.listEl.children.length;

        // Grab the total height of the list
        var scrollHeight = e.target.scrollHeight;

        // Get the viewport height
        var viewportHeight = this.el.parentNode.offsetHeight;

        // scrollTop is the current scroll position
        var scrollTop = e.scrollTop;

        // High water is the pixel position of the first element to include (everything before
        // that will be removed)
        var highWater = Math.max(0, e.scrollTop + this.virtualRemoveThreshold);

        // Low water is the pixel position of the last element to include (everything after
        // that will be removed)
        var lowWater = Math.min(scrollHeight, Math.abs(e.scrollTop) + viewportHeight + this.virtualAddThreshold);

        // Compute how many items per viewport size can show
        var itemsPerViewport = Math.floor((lowWater - highWater) / itemHeight);

        // Get the first and last elements in the list based on how many can fit
        // between the pixel range of lowWater and highWater
        var first = parseInt(Math.abs(highWater / itemHeight), 10);
        var last = parseInt(Math.abs(lowWater / itemHeight), 10);

        // Get the items we need to remove
        this._virtualItemsToRemove = Array.prototype.slice.call(this.listEl.children, 0, first);

        // Grab the nodes we will be showing
        var nodes = Array.prototype.slice.call(this.listEl.children, first, first + itemsPerViewport);

        this.renderViewport && this.renderViewport(highWater, lowWater, first, last);
      }
    },

    didStopScrolling: function(e) {
      if(this.isVirtual) {
        for(var i = 0; i < this._virtualItemsToRemove.length; i++) {
          var el = this._virtualItemsToRemove[i];
          //el.parentNode.removeChild(el);
          this.didHideItem && this.didHideItem(i);
        }
        // Once scrolling stops, check if we need to remove old items

      }
    },

    /**
     * Clear any active drag effects on the list.
     */
    clearDragEffects: function() {
      if(this._lastDragOp) {
        this._lastDragOp.clean && this._lastDragOp.clean();
        this._lastDragOp = null;
      }
    },

    _initDrag: function() {
      //ionic.views.ListView.__super__._initDrag.call(this);

      // Store the last one
      this._lastDragOp = this._dragOp;

      this._dragOp = null;
    },

    // Return the list item from the given target
    _getItem: function(target) {
      while(target) {
        if(target.classList.contains(ITEM_CLASS)) {
          return target;
        }
        target = target.parentNode;
      }
      return null;
    },


    _startDrag: function(e) {
      var _this = this;

      var didStart = false;

      this._isDragging = false;

      var lastDragOp = this._lastDragOp;

      // Check if this is a reorder drag
      if(ionic.DomUtil.getParentOrSelfWithClass(e.target, ITEM_REORDER_BTN_CLASS) && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
        var item = this._getItem(e.target);

        if(item) {
          this._dragOp = new ReorderDrag({
            el: item,
            scrollEl: this.scrollEl,
            scrollView: this.scrollView,
            onReorder: function(el, start, end) {
              _this.onReorder && _this.onReorder(el, start, end);
            }
          });
          this._dragOp.start(e);
          e.preventDefault();
        }
      }

      // Or check if this is a swipe to the side drag
      else if(!this._didDragUpOrDown && (e.gesture.direction == 'left' || e.gesture.direction == 'right') && Math.abs(e.gesture.deltaX) > 5) {

        // Make sure this is an item with buttons
        var item = this._getItem(e.target);
        if(item && item.querySelector('.item-options')) {
          this._dragOp = new SlideDrag({ el: this.el });
          this._dragOp.start(e);
          e.preventDefault();
        }
      }

      // If we had a last drag operation and this is a new one on a different item, clean that last one
      if(lastDragOp && this._dragOp && !this._dragOp.isSameItem(lastDragOp) && e.defaultPrevented) {
        lastDragOp.clean && lastDragOp.clean();
      }
    },


    _handleEndDrag: function(e) {
      var _this = this;

      this._didDragUpOrDown = false;

      if(!this._dragOp) {
        //ionic.views.ListView.__super__._handleEndDrag.call(this, e);
        return;
      }

      this._dragOp.end(e, function() {
        _this._initDrag();
      });
    },

    /**
     * Process the drag event to move the item to the left or right.
     */
    _handleDrag: function(e) {
      var _this = this, content, buttons;

      if (!this.canSwipe) {
        return;
      }

      if(Math.abs(e.gesture.deltaY) > 5) {
        this._didDragUpOrDown = true;
      }

      // If we get a drag event, make sure we aren't in another drag, then check if we should
      // start one
      if(!this.isDragging && !this._dragOp) {
        this._startDrag(e);
      }

      // No drag still, pass it up
      if(!this._dragOp) {
        //ionic.views.ListView.__super__._handleDrag.call(this, e);
        return;
      }

      e.gesture.srcEvent.preventDefault();
      this._dragOp.drag(e);
    }

  });

})(ionic);

(function(ionic) {
'use strict';
  /**
   * Loading
   *
   * The Loading is an overlay that can be used to indicate
   * activity while blocking user interaction.
   */
  ionic.views.Loading = ionic.views.View.inherit({
    initialize: function(opts) {
      var _this = this;

      this.el = opts.el;

      this.maxWidth = opts.maxWidth || 200;

      this.showDelay = opts.showDelay || 0;

      this._loadingBox = this.el.querySelector('.loading') || this.el;
    },
    show: function() {
      var _this = this;

      if(this._loadingBox) {
        var lb = _this._loadingBox;

        var width = Math.min(_this.maxWidth, Math.max(window.outerWidth - 40, lb.offsetWidth));

        lb.style.width = width + 'px';

        lb.style.marginLeft = (-lb.offsetWidth) / 2 + 'px';
        lb.style.marginTop = (-lb.offsetHeight) / 2 + 'px';

        // Wait 'showDelay' ms before showing the loading screen
        this._showDelayTimeout = window.setTimeout(function() {
          _this.el.classList.add('active');
        }, _this.showDelay);
      }
    },
    hide: function() {
      // Force a reflow so the animation will actually run
      this.el.offsetWidth;

      // Prevent unnecessary 'show' after 'hide' has already been called
      window.clearTimeout(this._showDelayTimeout);

      this.el.classList.remove('active');
    },
    setContent: function(html) {
      if (this._loadingBox) {
        this._loadingBox.innerHTML = html || '';
      }
    }
  });

})(ionic);

(function(ionic) {
'use strict';

  ionic.views.Modal = ionic.views.View.inherit({
    initialize: function(opts) {
      opts = ionic.extend({
        focusFirstInput: false,
        unfocusOnHide: true,
        focusFirstDelay: 600
      }, opts);

      ionic.extend(this, opts);

      this.el = opts.el;
    },
    show: function() {
      var self = this;

      if(self.focusFirstInput) {
        // Let any animations run first
        window.setTimeout(function() {
          var input = self.el.querySelector('input, textarea');
          input && input.focus && input.focus();
        }, self.focusFirstDelay);
      }
    },
    hide: function() {
      // Unfocus all elements
      if(this.unfocusOnHide) {
        var inputs = this.el.querySelectorAll('input, textarea');
        // Let any animations run first
        window.setTimeout(function() {
          for(var i = 0; i < inputs.length; i++) {
            inputs[i].blur && inputs[i].blur();
          }
        });
      }
    }
  });

})(ionic);

(function(ionic) {
'use strict';

  ionic.views.NavBar = ionic.views.View.inherit({
    initialize: function(opts) {
      this.el = opts.el;

      this._titleEl = this.el.querySelector('.title');

      if(opts.hidden) {
        this.hide();
      }
    },
    hide: function() {
      this.el.classList.add('hidden');
    },
    show: function() {
      this.el.classList.remove('hidden');
    },
    shouldGoBack: function() {},

    setTitle: function(title) {
      if(!this._titleEl) {
        return;
      }
      this._titleEl.innerHTML = title;
    },

    showBackButton: function(shouldShow) {
      var _this = this;

      if(!this._currentBackButton) {
        var back = document.createElement('a');
        back.className = 'button back';
        back.innerHTML = 'Back';

        this._currentBackButton = back;
        this._currentBackButton.onclick = function(event) {
          _this.shouldGoBack && _this.shouldGoBack();
        };
      }

      if(shouldShow && !this._currentBackButton.parentNode) {
        // Prepend the back button
        this.el.insertBefore(this._currentBackButton, this.el.firstChild);
      } else if(!shouldShow && this._currentBackButton.parentNode) {
        // Remove the back button if it's there
        this._currentBackButton.parentNode.removeChild(this._currentBackButton);
      }
    }
  });

})(ionic);

(function(ionic) {
'use strict';

  /**
   * The side menu view handles one of the side menu's in a Side Menu Controller
   * configuration.
   * It takes a DOM reference to that side menu element.
   */
  ionic.views.SideMenu = ionic.views.View.inherit({
    initialize: function(opts) {
      this.el = opts.el;
      this.isEnabled = (typeof opts.isEnabled === 'undefined') ? true : opts.isEnabled;
      this.setWidth(opts.width);
    },

    getFullWidth: function() {
      return this.width;
    },
    setWidth: function(width) {
      this.width = width;
      this.el.style.width = width + 'px';
    },
    setIsEnabled: function(isEnabled) {
      this.isEnabled = isEnabled;
    },
    bringUp: function() {
      if(this.el.style.zIndex !== '0') {
        this.el.style.zIndex = '0';
      }
    },
    pushDown: function() {
      if(this.el.style.zIndex !== '-1') {
        this.el.style.zIndex = '-1';
      }
    }
  });

  ionic.views.SideMenuContent = ionic.views.View.inherit({
    initialize: function(opts) {
      var _this = this;

      ionic.extend(this, {
        animationClass: 'menu-animated',
        onDrag: function(e) {},
        onEndDrag: function(e) {},
      }, opts);

      ionic.onGesture('drag', ionic.proxy(this._onDrag, this), this.el);
      ionic.onGesture('release', ionic.proxy(this._onEndDrag, this), this.el);
    },
    _onDrag: function(e) {
      this.onDrag && this.onDrag(e);
    },
    _onEndDrag: function(e) {
      this.onEndDrag && this.onEndDrag(e);
    },
    disableAnimation: function() {
      this.el.classList.remove(this.animationClass);
    },
    enableAnimation: function() {
      this.el.classList.add(this.animationClass);
    },
    getTranslateX: function() {
      return parseFloat(this.el.style[ionic.CSS.TRANSFORM].replace('translate3d(', '').split(',')[0]);
    },
    setTranslateX: ionic.animationFrameThrottle(function(x) {
      this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + x + 'px, 0, 0)';
    })
  });

})(ionic);

/*
 * Adapted from Swipe.js 2.0
 *
 * Brad Birdsall
 * Copyright 2013, MIT License
 *
*/

(function(ionic) {
'use strict';

ionic.views.Slider = ionic.views.View.inherit({
  initialize: function (options) {
    // utilities
    var noop = function() {}; // simple no operation function
    var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; // offload a functions execution

    // check browser capabilities
    var browser = {
      addEventListener: !!window.addEventListener,
      touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
      transitions: (function(temp) {
        var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
        for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
        return false;
      })(document.createElement('swipe'))
    };


    var container = options.el;

    // quit if no root element
    if (!container) return;
    var element = container.children[0];
    var slides, slidePos, width, length;
    options = options || {};
    var index = parseInt(options.startSlide, 10) || 0;
    var speed = options.speed || 300;
    options.continuous = options.continuous !== undefined ? options.continuous : true;

    function setup() {

      // cache slides
      slides = element.children;
      length = slides.length;

      // set continuous to false if only one slide
      if (slides.length < 2) options.continuous = false;

      //special case if two slides
      if (browser.transitions && options.continuous && slides.length < 3) {
        element.appendChild(slides[0].cloneNode(true));
        element.appendChild(element.children[1].cloneNode(true));
        slides = element.children;
      }

      // create an array to store current positions of each slide
      slidePos = new Array(slides.length);

      // determine width of each slide
      width = container.getBoundingClientRect().width || container.offsetWidth;

      element.style.width = (slides.length * width) + 'px';

      // stack elements
      var pos = slides.length;
      while(pos--) {

        var slide = slides[pos];

        slide.style.width = width + 'px';
        slide.setAttribute('data-index', pos);

        if (browser.transitions) {
          slide.style.left = (pos * -width) + 'px';
          move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
        }

      }

      // reposition elements before and after index
      if (options.continuous && browser.transitions) {
        move(circle(index-1), -width, 0);
        move(circle(index+1), width, 0);
      }

      if (!browser.transitions) element.style.left = (index * -width) + 'px';

      container.style.visibility = 'visible';

      options.slidesChanged && options.slidesChanged();
    }

    function prev() {

      if (options.continuous) slide(index-1);
      else if (index) slide(index-1);

    }

    function next() {

      if (options.continuous) slide(index+1);
      else if (index < slides.length - 1) slide(index+1);

    }

    function circle(index) {

      // a simple positive modulo using slides.length
      return (slides.length + (index % slides.length)) % slides.length;

    }

    function slide(to, slideSpeed) {

      // do nothing if already on requested slide
      if (index == to) return;

      if (browser.transitions) {

        var direction = Math.abs(index-to) / (index-to); // 1: backward, -1: forward

        // get the actual position of the slide
        if (options.continuous) {
          var natural_direction = direction;
          direction = -slidePos[circle(to)] / width;

          // if going forward but to < index, use to = slides.length + to
          // if going backward but to > index, use to = -slides.length + to
          if (direction !== natural_direction) to =  -direction * slides.length + to;

        }

        var diff = Math.abs(index-to) - 1;

        // move all the slides between index and to in the right direction
        while (diff--) move( circle((to > index ? to : index) - diff - 1), width * direction, 0);

        to = circle(to);

        move(index, width * direction, slideSpeed || speed);
        move(to, 0, slideSpeed || speed);

        if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place

      } else {

        to = circle(to);
        animate(index * -width, to * -width, slideSpeed || speed);
        //no fallback for a circular continuous if the browser does not accept transitions
      }

      index = to;
      offloadFn(options.callback && options.callback(index, slides[index]));
    }

    function move(index, dist, speed) {

      translate(index, dist, speed);
      slidePos[index] = dist;

    }

    function translate(index, dist, speed) {

      var slide = slides[index];
      var style = slide && slide.style;

      if (!style) return;

      style.webkitTransitionDuration =
      style.MozTransitionDuration =
      style.msTransitionDuration =
      style.OTransitionDuration =
      style.transitionDuration = speed + 'ms';

      style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
      style.msTransform =
      style.MozTransform =
      style.OTransform = 'translateX(' + dist + 'px)';

    }

    function animate(from, to, speed) {

      // if not an animation, just reposition
      if (!speed) {

        element.style.left = to + 'px';
        return;

      }

      var start = +new Date;

      var timer = setInterval(function() {

        var timeElap = +new Date - start;

        if (timeElap > speed) {

          element.style.left = to + 'px';

          if (delay) begin();

          options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

          clearInterval(timer);
          return;

        }

        element.style.left = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

      }, 4);

    }

    // setup auto slideshow
    var delay = options.auto || 0;
    var interval;

    function begin() {

      interval = setTimeout(next, delay);

    }

    function stop() {

      delay = options.auto || 0;
      clearTimeout(interval);

    }


    // setup initial vars
    var start = {};
    var delta = {};
    var isScrolling;

    // setup event capturing
    var events = {

      handleEvent: function(event) {
        if(event.type == 'mousedown' || event.type == 'mouseup' || event.type == 'mousemove') {
          event.touches = [{
            pageX: event.pageX,
            pageY: event.pageY
          }];
        }

        switch (event.type) {
          case 'mousedown': this.start(event); break;
          case 'touchstart': this.start(event); break;
          case 'touchmove': this.move(event); break;
          case 'mousemove': this.move(event); break;
          case 'touchend': offloadFn(this.end(event)); break;
          case 'mouseup': offloadFn(this.end(event)); break;
          case 'webkitTransitionEnd':
          case 'msTransitionEnd':
          case 'oTransitionEnd':
          case 'otransitionend':
          case 'transitionend': offloadFn(this.transitionEnd(event)); break;
          case 'resize': offloadFn(setup); break;
        }

        if (options.stopPropagation) event.stopPropagation();

      },
      start: function(event) {

        var touches = event.touches[0];

        // measure start values
        start = {

          // get initial touch coords
          x: touches.pageX,
          y: touches.pageY,

          // store time to determine touch duration
          time: +new Date

        };

        // used for testing first move event
        isScrolling = undefined;

        // reset delta and end measurements
        delta = {};

        // attach touchmove and touchend listeners
        if(browser.touch) {
          element.addEventListener('touchmove', this, false);
          element.addEventListener('touchend', this, false);
        } else {
          element.addEventListener('mousemove', this, false);
          element.addEventListener('mouseup', this, false);
          document.addEventListener('mouseup', this, false);
        }
      },
      move: function(event) {

        // ensure swiping with one touch and not pinching
        if ( event.touches.length > 1 || event.scale && event.scale !== 1) return

        if (options.disableScroll) event.preventDefault();

        var touches = event.touches[0];

        // measure change in x and y
        delta = {
          x: touches.pageX - start.x,
          y: touches.pageY - start.y
        }

        // determine if scrolling test has run - one time test
        if ( typeof isScrolling == 'undefined') {
          isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
        }

        // if user is not trying to scroll vertically
        if (!isScrolling) {

          // prevent native scrolling
          event.preventDefault();

          // stop slideshow
          stop();

          // increase resistance if first or last slide
          if (options.continuous) { // we don't add resistance at the end

            translate(circle(index-1), delta.x + slidePos[circle(index-1)], 0);
            translate(index, delta.x + slidePos[index], 0);
            translate(circle(index+1), delta.x + slidePos[circle(index+1)], 0);

          } else {

            delta.x =
              delta.x /
                ( (!index && delta.x > 0               // if first slide and sliding left
                  || index == slides.length - 1        // or if last slide and sliding right
                  && delta.x < 0                       // and if sliding at all
                ) ?
                ( Math.abs(delta.x) / width + 1 )      // determine resistance level
                : 1 );                                 // no resistance if false

            // translate 1:1
            translate(index-1, delta.x + slidePos[index-1], 0);
            translate(index, delta.x + slidePos[index], 0);
            translate(index+1, delta.x + slidePos[index+1], 0);
          }

        }

      },
      end: function(event) {

        // measure duration
        var duration = +new Date - start.time;

        // determine if slide attempt triggers next/prev slide
        var isValidSlide =
              Number(duration) < 250               // if slide duration is less than 250ms
              && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
              || Math.abs(delta.x) > width/2;      // or if slide amt is greater than half the width

        // determine if slide attempt is past start and end
        var isPastBounds =
              !index && delta.x > 0                            // if first slide and slide amt is greater than 0
              || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

        if (options.continuous) isPastBounds = false;

        // determine direction of swipe (true:right, false:left)
        var direction = delta.x < 0;

        // if not scrolling vertically
        if (!isScrolling) {

          if (isValidSlide && !isPastBounds) {

            if (direction) {

              if (options.continuous) { // we need to get the next in this direction in place

                move(circle(index-1), -width, 0);
                move(circle(index+2), width, 0);

              } else {
                move(index-1, -width, 0);
              }

              move(index, slidePos[index]-width, speed);
              move(circle(index+1), slidePos[circle(index+1)]-width, speed);
              index = circle(index+1);

            } else {
              if (options.continuous) { // we need to get the next in this direction in place

                move(circle(index+1), width, 0);
                move(circle(index-2), -width, 0);

              } else {
                move(index+1, width, 0);
              }

              move(index, slidePos[index]+width, speed);
              move(circle(index-1), slidePos[circle(index-1)]+width, speed);
              index = circle(index-1);

            }

            options.callback && options.callback(index, slides[index]);

          } else {

            if (options.continuous) {

              move(circle(index-1), -width, speed);
              move(index, 0, speed);
              move(circle(index+1), width, speed);

            } else {

              move(index-1, -width, speed);
              move(index, 0, speed);
              move(index+1, width, speed);
            }

          }

        }

        // kill touchmove and touchend event listeners until touchstart called again
        if(browser.touch) {
          element.removeEventListener('touchmove', events, false)
          element.removeEventListener('touchend', events, false)
        } else {
          element.removeEventListener('mousemove', events, false)
          element.removeEventListener('mouseup', events, false)
          document.removeEventListener('mouseup', events, false);
        }

      },
      transitionEnd: function(event) {

        if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

          if (delay) begin();

          options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

        }

      }

    }

    // Public API
    this.update = function() {
      setTimeout(setup);
    };
    this.setup = function() {
      setup();
    };

    this.slide = function(to, speed) {
      // cancel slideshow
      stop();

      slide(to, speed);
    };

    this.prev = this.previous = function() {
      // cancel slideshow
      stop();

      prev();
    };

    this.next = function() {
      // cancel slideshow
      stop();

      next();
    };

    this.stop = function() {
      // cancel slideshow
      stop();
    };

    this.currentIndex = function() {
      // return current index position
      return index;
    };

    this.slidesCount = function() {
      // return total number of slides
      return length;
    };

    this.kill = function() {
      // cancel slideshow
      stop();

      // reset element
      element.style.width = '';
      element.style.left = '';

      // reset slides
      var pos = slides.length;
      while(pos--) {

        var slide = slides[pos];
        slide.style.width = '';
        slide.style.left = '';

        if (browser.transitions) translate(pos, 0, 0);

      }

      // removed event listeners
      if (browser.addEventListener) {

        // remove current event listeners
        element.removeEventListener('touchstart', events, false);
        element.removeEventListener('webkitTransitionEnd', events, false);
        element.removeEventListener('msTransitionEnd', events, false);
        element.removeEventListener('oTransitionEnd', events, false);
        element.removeEventListener('otransitionend', events, false);
        element.removeEventListener('transitionend', events, false);
        window.removeEventListener('resize', events, false);

      }
      else {

        window.onresize = null;

      }
    };

    this.load = function() {
      // trigger setup
      setup();

      // start auto slideshow if applicable
      if (delay) begin();


      // add event listeners
      if (browser.addEventListener) {

        // set touchstart event on element
        if (browser.touch) {
          element.addEventListener('touchstart', events, false);
        } else {
          element.addEventListener('mousedown', events, false);
        }

        if (browser.transitions) {
          element.addEventListener('webkitTransitionEnd', events, false);
          element.addEventListener('msTransitionEnd', events, false);
          element.addEventListener('oTransitionEnd', events, false);
          element.addEventListener('otransitionend', events, false);
          element.addEventListener('transitionend', events, false);
        }

        // set resize event on window
        window.addEventListener('resize', events, false);

      } else {

        window.onresize = function () { setup() }; // to play nice with old IE

      }
    }

  }
});

})(ionic);

(function(ionic) {
'use strict';

ionic.views.TabBarItem = ionic.views.View.inherit({
  initialize: function(el) {
    this.el = el;

    this._buildItem();
  },

  // Factory for creating an item from a given javascript object
  create: function(itemData) {
    var item = document.createElement('a');
    item.className = 'tab-item';

    // If there is an icon, add the icon element
    if(itemData.icon) {
      var icon = document.createElement('i');
      icon.className = itemData.icon;
      item.appendChild(icon);
    }

    // If there is a badge, add the badge element
    if(itemData.badge) {
      var badge = document.createElement('i');
      badge.className = 'badge';
      badge.innerHTML = itemData.badge;
      item.appendChild(badge);
      item.className = 'tab-item has-badge';
    }

    item.appendChild(document.createTextNode(itemData.title));

    return new ionic.views.TabBarItem(item);
  },

  _buildItem: function() {
    var _this = this, child, children = Array.prototype.slice.call(this.el.children);

    for(var i = 0, j = children.length; i < j; i++) {
      child = children[i];

      // Test if this is a "i" tag with icon in the class name
      // TODO: This heuristic might not be sufficient
      if(child.tagName.toLowerCase() == 'i' && /icon/.test(child.className)) {
        this.icon = child.className;
      }

      // Test if this is a "i" tag with badge in the class name
      // TODO: This heuristic might not be sufficient
      if(child.tagName.toLowerCase() == 'i' && /badge/.test(child.className)) {
        this.badge = child.textContent.trim();
      }
    }

    this.title = '';
    for(i = 0, j = this.el.childNodes.length; i < j; i++) {
      child = this.el.childNodes[i];

      if (child.nodeName === "#text") {
        this.title += child.nodeValue.trim();
      }
    }

    this._tapHandler = function(e) {
      _this.onTap && _this.onTap(e);
    };

    ionic.on('tap', this._tapHandler, this.el);
  },
  onTap: function(e) {
  },

  // Remove the event listeners from this object
  destroy: function() {
    ionic.off('tap', this._tapHandler, this.el);
  },

  getIcon: function() {
    return this.icon;
  },

  getTitle: function() {
    return this.title;
  },

  getBadge: function() {
    return this.badge;
  },

  setSelected: function(isSelected) {
    this.isSelected = isSelected;
    if(isSelected) {
      this.el.classList.add('active');
    } else {
      this.el.classList.remove('active');
    }
  }
});

ionic.views.TabBar = ionic.views.View.inherit({
  initialize: function(opts) {
    this.el = opts.el;
     
    this.items = [];

    this._buildItems();
  },
  // get all the items for the TabBar
  getItems: function() {
    return this.items;
  },

  // Add an item to the tab bar
  addItem: function(item) {
    // Create a new TabItem
    var tabItem = ionic.views.TabBarItem.prototype.create(item);

    this.appendItemElement(tabItem);

    this.items.push(tabItem);
    this._bindEventsOnItem(tabItem);
  },

  appendItemElement: function(item) {
    if(!this.el) {
      return;
    }
    this.el.appendChild(item.el);
  },

  // Remove an item from the tab bar
  removeItem: function(index) {
    var item = this.items[index];
    if(!item) {
      return;
    }
    item.onTap = undefined;
    item.destroy();
  },

  _bindEventsOnItem: function(item) {
    var _this = this;

    if(!this._itemTapHandler) {
      this._itemTapHandler = function(e) {
        //_this.selectItem(this);
        _this.trySelectItem(this);
      };
    }
    item.onTap = this._itemTapHandler;
  },

  // Get the currently selected item
  getSelectedItem: function() {
    return this.selectedItem;
  },

  // Set the currently selected item by index
  setSelectedItem: function(index) {
    this.selectedItem = this.items[index];

    // Deselect all
    for(var i = 0, j = this.items.length; i < j; i += 1) {
      this.items[i].setSelected(false);
    }

    // Select the new item
    if(this.selectedItem) {
      this.selectedItem.setSelected(true);
      //this.onTabSelected && this.onTabSelected(this.selectedItem, index);
    }
  },

  // Select the given item assuming we can find it in our
  // item list.
  selectItem: function(item) {
    for(var i = 0, j = this.items.length; i < j; i += 1) {
      if(this.items[i] == item) {
        this.setSelectedItem(i);
        return;
      }
    }
  },

  // Try to select a given item. This triggers an event such
  // that the view controller managing this tab bar can decide
  // whether to select the item or cancel it.
  trySelectItem: function(item) {
    for(var i = 0, j = this.items.length; i < j; i += 1) {
      if(this.items[i] == item) {
        this.tryTabSelect && this.tryTabSelect(i);
        return;
      }
    }
  },

  // Build the initial items list from the given DOM node.
  _buildItems: function() {

    var item, items = Array.prototype.slice.call(this.el.children);

    for(var i = 0, j = items.length; i < j; i += 1) {
      item =  new ionic.views.TabBarItem(items[i]);
      this.items[i] = item;
      this._bindEventsOnItem(item);
    }
  
    if(this.items.length > 0) {
      this.selectedItem = this.items[0];
    }

  },

  // Destroy this tab bar
  destroy: function() {
    for(var i = 0, j = this.items.length; i < j; i += 1) {
      this.items[i].destroy();
    }
    this.items.length = 0;
  }
});

})(window.ionic);

(function(ionic) {
'use strict';

  ionic.views.Toggle = ionic.views.View.inherit({
    initialize: function(opts) {
      var self = this;

      this.el = opts.el;
      this.checkbox = opts.checkbox;
      this.track = opts.track;
      this.handle = opts.handle;
      this.openPercent = -1;
      this.onChange = opts.onChange || function() {};

      this.triggerThreshold = opts.triggerThreshold || 20;

      this.dragStartHandler = function(e) {
        self.dragStart(e);
      };
      this.dragHandler = function(e) {
        self.drag(e);
      };
      this.holdHandler = function(e) {
        self.hold(e);
      };
      this.releaseHandler = function(e) {
        self.release(e);
      };

      this.dragStartGesture = ionic.onGesture('dragstart', this.dragStartHandler, this.el);
      this.dragGesture = ionic.onGesture('drag', this.dragHandler, this.el);
      this.dragHoldGesture = ionic.onGesture('hold', this.holdHandler, this.el);
      this.dragReleaseGesture = ionic.onGesture('release', this.releaseHandler, this.el);
    },

    destroy: function() {
      ionic.offGesture(this.dragStartGesture, 'dragstart', this.dragStartGesture);
      ionic.offGesture(this.dragGesture, 'drag', this.dragGesture);
      ionic.offGesture(this.dragHoldGesture, 'hold', this.holdHandler);
      ionic.offGesture(this.dragReleaseGesture, 'release', this.releaseHandler);
    },

    tap: function(e) {
      if(this.el.getAttribute('disabled') !== 'disabled') {
        this.val( !this.checkbox.checked );
      }
    },

    dragStart: function(e) {
      if(this.checkbox.disabled) return;

      this._dragInfo = {
        width: this.el.offsetWidth,
        left: this.el.offsetLeft,
        right: this.el.offsetLeft + this.el.offsetWidth,
        triggerX: this.el.offsetWidth / 2,
        initialState: this.checkbox.checked
      };

      // Stop any parent dragging
      e.gesture.srcEvent.preventDefault();

      // Trigger hold styles
      this.hold(e);
    },

    drag: function(e) {
      var self = this;
      if(!this._dragInfo) { return; }

      // Stop any parent dragging
      e.gesture.srcEvent.preventDefault();

      ionic.requestAnimationFrame(function(amount) {

        var slidePageLeft = self.track.offsetLeft + (self.handle.offsetWidth / 2);
        var slidePageRight = self.track.offsetLeft + self.track.offsetWidth - (self.handle.offsetWidth / 2);
        var dx = e.gesture.deltaX;

        var px = e.gesture.touches[0].pageX - self._dragInfo.left;
        var mx = self._dragInfo.width - self.triggerThreshold;

        // The initial state was on, so "tend towards" on
        if(self._dragInfo.initialState) {
          if(px < self.triggerThreshold) {
            self.setOpenPercent(0);
          } else if(px > self._dragInfo.triggerX) {
            self.setOpenPercent(100);
          }
        } else {
          // The initial state was off, so "tend towards" off
          if(px < self._dragInfo.triggerX) {
            self.setOpenPercent(0);
          } else if(px > mx) {
            self.setOpenPercent(100);
          }
        }
      });
    },

    endDrag: function(e) {
      this._dragInfo = null;
    },

    hold: function(e) {
      this.el.classList.add('dragging');
    },
    release: function(e) {
      this.el.classList.remove('dragging');
      this.endDrag(e);
    },


    setOpenPercent: function(openPercent) {
      // only make a change if the new open percent has changed
      if(this.openPercent < 0 || (openPercent < (this.openPercent - 3) || openPercent > (this.openPercent + 3) ) ) {
        this.openPercent = openPercent;

        if(openPercent === 0) {
          this.val(false);
        } else if(openPercent === 100) {
          this.val(true);
        } else {
          var openPixel = Math.round( (openPercent / 100) * this.track.offsetWidth - (this.handle.offsetWidth) );
          openPixel = (openPixel < 1 ? 0 : openPixel);
          this.handle.style[ionic.CSS.TRANSFORM] = 'translate3d(' + openPixel + 'px,0,0)';
        }
      }
    },

    val: function(value) {
      if(value === true || value === false) {
        if(this.handle.style[ionic.CSS.TRANSFORM] !== "") {
          this.handle.style[ionic.CSS.TRANSFORM] = "";
        }
        this.checkbox.checked = value;
        this.openPercent = (value ? 100 : 0);
        this.onChange && this.onChange();
      }
      return this.checkbox.checked;
    }

  });

})(ionic);

(function(ionic) {
'use strict';
  ionic.controllers.ViewController = function(options) {
    this.initialize.apply(this, arguments);
  };

  ionic.controllers.ViewController.inherit = ionic.inherit;

  ionic.extend(ionic.controllers.ViewController.prototype, {
    initialize: function() {},
    // Destroy this view controller, including all child views
    destroy: function() {
    }
  });

})(window.ionic);

(function(ionic) {
'use strict';

/**
 * The NavController makes it easy to have a stack
 * of views or screens that can be pushed and popped
 * for a dynamic navigation flow. This API is modelled
 * off of the UINavigationController in iOS.
 *
 * The NavController can drive a nav bar to show a back button
 * if the stack can be poppped to go back to the last view, and
 * it will handle updating the title of the nav bar and processing animations.
 */
ionic.controllers.NavController = ionic.controllers.ViewController.inherit({
  initialize: function(opts) {
    var _this = this;

    this.navBar = opts.navBar;
    this.content = opts.content;
    this.controllers = opts.controllers || [];

    this._updateNavBar();

    // TODO: Is this the best way?
    this.navBar.shouldGoBack = function() {
      _this.pop();
    };
  },

  /**
   * @return {array} the array of controllers on the stack.
   */
  getControllers: function() {
    return this.controllers;
  },

  /**
   * @return {object} the controller at the top of the stack.
   */
  getTopController: function() {
    return this.controllers[this.controllers.length-1];
  },

  /**
   * Push a new controller onto the navigation stack. The new controller
   * will automatically become the new visible view.
   *
   * @param {object} controller the controller to push on the stack.
   */
  push: function(controller) {
    var last = this.controllers[this.controllers.length - 1];

    this.controllers.push(controller);

    // Indicate we are switching controllers
    var shouldSwitch = this.switchingController && this.switchingController(controller) || true;

    // Return if navigation cancelled
    if(shouldSwitch === false)
      return;

    // Actually switch the active controllers
    if(last) {
      last.isVisible = false;
      last.visibilityChanged && last.visibilityChanged('push');
    }

    // Grab the top controller on the stack
    var next = this.controllers[this.controllers.length - 1];

    next.isVisible = true;
    // Trigger visibility change, but send 'first' if this is the first page
    next.visibilityChanged && next.visibilityChanged(last ? 'push' : 'first');

    this._updateNavBar();

    return controller;
  },

  /**
   * Pop the top controller off the stack, and show the last one. This is the
   * "back" operation.
   *
   * @return {object} the last popped controller
   */
  pop: function() {
    var next, last;

    // Make sure we keep one on the stack at all times
    if(this.controllers.length < 2) {
      return;
    }

    // Grab the controller behind the top one on the stack
    last = this.controllers.pop();
    if(last) {
      last.isVisible = false;
      last.visibilityChanged && last.visibilityChanged('pop');
    }
    
    // Remove the old one
    //last && last.detach();

    next = this.controllers[this.controllers.length - 1];

    // TODO: No DOM stuff here
    //this.content.el.appendChild(next.el);
    next.isVisible = true;
    next.visibilityChanged && next.visibilityChanged('pop');

    // Switch to it (TODO: Animate or such things here)

    this._updateNavBar();

    return last;
  },

  /**
   * Show the NavBar (if any)
   */
  showNavBar: function() {
    if(this.navBar) {
      this.navBar.show();
    }
  },

  /**
   * Hide the NavBar (if any)
   */
  hideNavBar: function() {
    if(this.navBar) {
      this.navBar.hide();
    }
  },

  // Update the nav bar after a push or pop
  _updateNavBar: function() {
    if(!this.getTopController() || !this.navBar) {
      return;
    }

    this.navBar.setTitle(this.getTopController().title);

    if(this.controllers.length > 1) {
      this.navBar.showBackButton(true);
    } else {
      this.navBar.showBackButton(false);
    }
  }
});

})(window.ionic);

(function(ionic) {
'use strict';

  /**
   * The SideMenuController is a controller with a left and/or right menu that
   * can be slid out and toggled. Seen on many an app.
   *
   * The right or left menu can be disabled or not used at all, if desired.
   */
  ionic.controllers.SideMenuController = ionic.controllers.ViewController.inherit({
    initialize: function(options) {
      var self = this;

      this.left = options.left;
      this.right = options.right;
      this.content = options.content;
      this.dragThresholdX = options.dragThresholdX || 10;

      this._rightShowing = false;
      this._leftShowing = false;
      this._isDragging = false;

      if(this.content) {
        this.content.onDrag = function(e) {
          self._handleDrag(e);
        };

        this.content.onEndDrag =function(e) {
          self._endDrag(e);
        };
      }
    },
    /**
     * Set the content view controller if not passed in the constructor options.
     *
     * @param {object} content
     */
    setContent: function(content) {
      var self = this;

      this.content = content;

      this.content.onDrag = function(e) {
        self._handleDrag(e);
      };

      this.content.endDrag = function(e) {
        self._endDrag(e);
      };
    },

    isOpenLeft: function() {
      return this.getOpenAmount() > 0;
    },

    isOpenRight: function() {
      return this.getOpenAmount() < 0;
    },

    /**
     * Toggle the left menu to open 100%
     */
    toggleLeft: function(shouldOpen) {
      var openAmount = this.getOpenAmount();
      if (arguments.length === 0) {
        shouldOpen = openAmount <= 0;
      }
      this.content.enableAnimation();
      if(!shouldOpen) {
        this.openPercentage(0);
      } else {
        this.openPercentage(100);
      }
    },

    /**
     * Toggle the right menu to open 100%
     */
    toggleRight: function(shouldOpen) {
      var openAmount = this.getOpenAmount();
      if (arguments.length === 0) {
        shouldOpen = openAmount >= 0;
      }
      this.content.enableAnimation();
      if(!shouldOpen) {
        this.openPercentage(0);
      } else {
        this.openPercentage(-100);
      }
    },

    /**
     * Close all menus.
     */
    close: function() {
      this.openPercentage(0);
    },

    /**
     * @return {float} The amount the side menu is open, either positive or negative for left (positive), or right (negative)
     */
    getOpenAmount: function() {
      return this.content && this.content.getTranslateX() || 0;
    },

    /**
     * @return {float} The ratio of open amount over menu width. For example, a
     * menu of width 100 open 50 pixels would be open 50% or a ratio of 0.5. Value is negative
     * for right menu.
     */
    getOpenRatio: function() {
      var amount = this.getOpenAmount();
      if(amount >= 0) {
        return amount / this.left.width;
      }
      return amount / this.right.width;
    },

    isOpen: function() {
      return this.getOpenRatio() == 1;
    },

    /**
     * @return {float} The percentage of open amount over menu width. For example, a
     * menu of width 100 open 50 pixels would be open 50%. Value is negative
     * for right menu.
     */
    getOpenPercentage: function() {
      return this.getOpenRatio() * 100;
    },

    /**
     * Open the menu with a given percentage amount.
     * @param {float} percentage The percentage (positive or negative for left/right) to open the menu.
     */
    openPercentage: function(percentage) {
      var p = percentage / 100;

      if(this.left && percentage >= 0) {
        this.openAmount(this.left.width * p);
      } else if(this.right && percentage < 0) {
        var maxRight = this.right.width;
        this.openAmount(this.right.width * p);
      }
    },

    /**
     * Open the menu the given pixel amount.
     * @param {float} amount the pixel amount to open the menu. Positive value for left menu,
     * negative value for right menu (only one menu will be visible at a time).
     */
    openAmount: function(amount) {
      var maxLeft = this.left && this.left.width || 0;
      var maxRight = this.right && this.right.width || 0;

      // Check if we can move to that side, depending if the left/right panel is enabled
      if(!(this.left && this.left.isEnabled) && amount > 0) {
        this.content.setTranslateX(0);
        return;
      }

      if(!(this.right && this.right.isEnabled) && amount < 0) {
        this.content.setTranslateX(0);
        return;
      }

      if(this._leftShowing && amount > maxLeft) {
        this.content.setTranslateX(maxLeft);
        return;
      }

      if(this._rightShowing && amount < -maxRight) {
        this.content.setTranslateX(-maxRight);
        return;
      }

      this.content.setTranslateX(amount);

      if(amount >= 0) {
        this._leftShowing = true;
        this._rightShowing = false;

        if(amount > 0) {
          // Push the z-index of the right menu down
          this.right && this.right.pushDown && this.right.pushDown();
          // Bring the z-index of the left menu up
          this.left && this.left.bringUp && this.left.bringUp();
        }
      } else {
        this._rightShowing = true;
        this._leftShowing = false;

        // Bring the z-index of the right menu up
        this.right && this.right.bringUp && this.right.bringUp();
        // Push the z-index of the left menu down
        this.left && this.left.pushDown && this.left.pushDown();
      }
    },

    /**
     * Given an event object, find the final resting position of this side
     * menu. For example, if the user "throws" the content to the right and
     * releases the touch, the left menu should snap open (animated, of course).
     *
     * @param {Event} e the gesture event to use for snapping
     */
    snapToRest: function(e) {
      // We want to animate at the end of this
      this.content.enableAnimation();
      this._isDragging = false;

      // Check how much the panel is open after the drag, and
      // what the drag velocity is
      var ratio = this.getOpenRatio();

      if(ratio === 0) {
        // Just to be safe
        this.openPercentage(0);
        return;
      }

      var velocityThreshold = 0.3;
      var velocityX = e.gesture.velocityX;
      var direction = e.gesture.direction;

      // Less than half, going left
      //if(ratio > 0 && ratio < 0.5 && direction == 'left' && velocityX < velocityThreshold) {
      //this.openPercentage(0);
      //}

      // Going right, less than half, too slow (snap back)
      if(ratio > 0 && ratio < 0.5 && direction == 'right' && velocityX < velocityThreshold) {
        this.openPercentage(0);
      }

      // Going left, more than half, too slow (snap back)
      else if(ratio > 0.5 && direction == 'left' && velocityX < velocityThreshold) {
        this.openPercentage(100);
      }

      // Going left, less than half, too slow (snap back)
      else if(ratio < 0 && ratio > -0.5 && direction == 'left' && velocityX < velocityThreshold) {
        this.openPercentage(0);
      }

      // Going right, more than half, too slow (snap back)
      else if(ratio < 0.5 && direction == 'right' && velocityX < velocityThreshold) {
        this.openPercentage(-100);
      }

      // Going right, more than half, or quickly (snap open)
      else if(direction == 'right' && ratio >= 0 && (ratio >= 0.5 || velocityX > velocityThreshold)) {
        this.openPercentage(100);
      }

      // Going left, more than half, or quickly (span open)
      else if(direction == 'left' && ratio <= 0 && (ratio <= -0.5 || velocityX > velocityThreshold)) {
        this.openPercentage(-100);
      }

      // Snap back for safety
      else {
        this.openPercentage(0);
      }
    },

    // End a drag with the given event
    _endDrag: function(e) {
      if(this._isDragging) {
        this.snapToRest(e);
      }
      this._startX = null;
      this._lastX = null;
      this._offsetX = null;
    },

    // Handle a drag event
    _handleDrag: function(e) {
      // If we don't have start coords, grab and store them
      if(!this._startX) {
        this._startX = e.gesture.touches[0].pageX;
        this._lastX = this._startX;
      } else {
        // Grab the current tap coords
        this._lastX = e.gesture.touches[0].pageX;
      }

      // Calculate difference from the tap points
      if(!this._isDragging && Math.abs(this._lastX - this._startX) > this.dragThresholdX) {
        // if the difference is greater than threshold, start dragging using the current
        // point as the starting point
        this._startX = this._lastX;

        this._isDragging = true;
        // Initialize dragging
        this.content.disableAnimation();
        this._offsetX = this.getOpenAmount();
      }

      if(this._isDragging) {
        this.openAmount(this._offsetX + (this._lastX - this._startX));
      }
    }
  });

})(ionic);

(function(ionic) {
'use strict';

/**
 * The TabBarController handles a set of view controllers powered by a tab strip
 * at the bottom (or possibly top) of a screen.
 *
 * The API here is somewhat modelled off of UITabController in the sense that the
 * controllers actually define what the tab will look like (title, icon, etc.).
 *
 * Tabs shouldn't be interacted with through your own code. Instead, use the controller
 * methods which will power the tab bar.
 */
ionic.controllers.TabBarController = ionic.controllers.ViewController.inherit({
  initialize: function(options) {
    this.tabBar = options.tabBar;

    this._bindEvents();

    this.controllers = [];

    var controllers = options.controllers || [];

    for(var i = 0; i < controllers.length; i++) {
      this.addController(controllers[i]);
    }

    // Bind or set our tabWillChange callback
    this.controllerWillChange = options.controllerWillChange || function(controller) {};
    this.controllerChanged = options.controllerChanged || function(controller) {};

    // Try to select the first controller if we have one
    this.setSelectedController(0);
  },
  // Start listening for events on our tab bar
  _bindEvents: function() {
    var _this = this;

    this.tabBar.tryTabSelect = function(index) {
      _this.setSelectedController(index);
    };
  },


  selectController: function(index) {
    var shouldChange = true;

    // Check if we should switch to this tab. This lets the app
    // cancel tab switches if the context isn't right, for example.
    if(this.controllerWillChange) {
      if(this.controllerWillChange(this.controllers[index], index) === false) {
        shouldChange = false;
      }
    }

    if(shouldChange) {
      this.setSelectedController(index);
    }
  },

  // Force the selection of a controller at the given index
  setSelectedController: function(index) {
    if(index >= this.controllers.length) {
      return;
    }
    var lastController = this.selectedController;
    var lastIndex = this.selectedIndex;

    this.selectedController = this.controllers[index];
    this.selectedIndex = index;

    this._showController(index);
    this.tabBar.setSelectedItem(index);

    this.controllerChanged && this.controllerChanged(lastController, lastIndex, this.selectedController, this.selectedIndex);
  },

  _showController: function(index) {
    var c;

    for(var i = 0, j = this.controllers.length; i < j; i ++) {
      c = this.controllers[i];
      //c.detach && c.detach();
      c.isVisible = false;
      c.visibilityChanged && c.visibilityChanged();
    }

    c = this.controllers[index];
    //c.attach && c.attach();
    c.isVisible = true;
    c.visibilityChanged && c.visibilityChanged();
  },

  _clearSelected: function() {
    this.selectedController = null;
    this.selectedIndex = -1;
  },

  // Return the tab at the given index
  getController: function(index) {
    return this.controllers[index];
  },

  // Return the current tab list
  getControllers: function() {
    return this.controllers;
  },

  // Get the currently selected controller
  getSelectedController: function() {
    return this.selectedController;
  },

  // Get the index of the currently selected controller
  getSelectedControllerIndex: function() {
    return this.selectedIndex;
  },

  // Add a tab
  addController: function(controller) {
    this.controllers.push(controller);

    this.tabBar.addItem({
      title: controller.title,
      icon: controller.icon,
      badge: controller.badge
    });

    // If we don't have a selected controller yet, select the first one.
    if(!this.selectedController) {
      this.setSelectedController(0);
    }
  },

  // Set the tabs and select the first
  setControllers: function(controllers) {
    this.controllers = controllers;
    this._clearSelected();
    this.selectController(0);
  },
});

})(window.ionic);

})();