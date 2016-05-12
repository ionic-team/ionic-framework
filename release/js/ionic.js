/*!
 * Copyright 2015 Drifty Co.
 * http://drifty.com/
 *
 * Ionic, v1.3.1
 * A powerful HTML5 mobile app framework.
 * http://ionicframework.com/
 *
 * By @maxlynch, @benjsperry, @adamdbradley <3
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 *
 */

(function() {

// Create global ionic obj and its namespaces
// build processes may have already created an ionic obj
window.ionic = window.ionic || {};
window.ionic.views = {};
window.ionic.version = '1.3.1';

(function (ionic) {

  ionic.DelegateService = function(methodNames) {

    if (methodNames.indexOf('$getByHandle') > -1) {
      throw new Error("Method '$getByHandle' is implicitly added to each delegate service. Do not list it as a method.");
    }

    function trueFn() { return true; }

    return ['$log', function($log) {

      /*
       * Creates a new object that will have all the methodNames given,
       * and call them on the given the controller instance matching given
       * handle.
       * The reason we don't just let $getByHandle return the controller instance
       * itself is that the controller instance might not exist yet.
       *
       * We want people to be able to do
       * `var instance = $ionicScrollDelegate.$getByHandle('foo')` on controller
       * instantiation, but on controller instantiation a child directive
       * may not have been compiled yet!
       *
       * So this is our way of solving this problem: we create an object
       * that will only try to fetch the controller with given handle
       * once the methods are actually called.
       */
      function DelegateInstance(instances, handle) {
        this._instances = instances;
        this.handle = handle;
      }
      methodNames.forEach(function(methodName) {
        DelegateInstance.prototype[methodName] = instanceMethodCaller(methodName);
      });


      /**
       * The delegate service (eg $ionicNavBarDelegate) is just an instance
       * with a non-defined handle, a couple extra methods for registering
       * and narrowing down to a specific handle.
       */
      function DelegateService() {
        this._instances = [];
      }
      DelegateService.prototype = DelegateInstance.prototype;
      DelegateService.prototype._registerInstance = function(instance, handle, filterFn) {
        var instances = this._instances;
        instance.$$delegateHandle = handle;
        instance.$$filterFn = filterFn || trueFn;
        instances.push(instance);

        return function deregister() {
          var index = instances.indexOf(instance);
          if (index !== -1) {
            instances.splice(index, 1);
          }
        };
      };
      DelegateService.prototype.$getByHandle = function(handle) {
        return new DelegateInstance(this._instances, handle);
      };

      return new DelegateService();

      function instanceMethodCaller(methodName) {
        return function caller() {
          var handle = this.handle;
          var args = arguments;
          var foundInstancesCount = 0;
          var returnValue;

          this._instances.forEach(function(instance) {
            if ((!handle || handle == instance.$$delegateHandle) && instance.$$filterFn(instance)) {
              foundInstancesCount++;
              var ret = instance[methodName].apply(instance, args);
              //Only return the value from the first call
              if (foundInstancesCount === 1) {
                returnValue = ret;
              }
            }
          });

          if (!foundInstancesCount && handle) {
            return $log.warn(
              'Delegate for handle "' + handle + '" could not find a ' +
              'corresponding element with delegate-handle="' + handle + '"! ' +
              methodName + '() was not called!\n' +
              'Possible cause: If you are calling ' + methodName + '() immediately, and ' +
              'your element with delegate-handle="' + handle + '" is a child of your ' +
              'controller, then your element may not be compiled yet. Put a $timeout ' +
              'around your call to ' + methodName + '() and try again.'
            );
          }
          return returnValue;
        };
      }

    }];
  };

})(window.ionic);

(function(window, document, ionic) {

  var readyCallbacks = [];
  var isDomReady = document.readyState === 'complete' || document.readyState === 'interactive';

  function domReady() {
    isDomReady = true;
    for (var x = 0; x < readyCallbacks.length; x++) {
      ionic.requestAnimationFrame(readyCallbacks[x]);
    }
    readyCallbacks = [];
    document.removeEventListener('DOMContentLoaded', domReady);
  }
  if (!isDomReady) {
    document.addEventListener('DOMContentLoaded', domReady);
  }


  // From the man himself, Mr. Paul Irish.
  // The requestAnimationFrame polyfill
  // Put it on window just to preserve its context
  // without having to use .call
  window._rAF = (function() {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           function(callback) {
             window.setTimeout(callback, 16);
           };
  })();

  var cancelAnimationFrame = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame;

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
      return window._rAF(cb);
    },

    cancelAnimationFrame: function(requestId) {
      cancelAnimationFrame(requestId);
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

    contains: function(parentNode, otherNode) {
      var current = otherNode;
      while (current) {
        if (current === parentNode) return true;
        current = current.parentNode;
      }
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

    getOffsetTop: function(el) {
      var curtop = 0;
      if (el.offsetParent) {
        do {
          curtop += el.offsetTop;
          el = el.offsetParent;
        } while (el)
        return curtop;
      }
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
      if (isDomReady) {
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
     *   - `{number}` `left` The left position of the textNode.
     *   - `{number}` `right` The right position of the textNode.
     *   - `{number}` `top` The top position of the textNode.
     *   - `{number}` `bottom` The bottom position of the textNode.
     *   - `{number}` `width` The width of the textNode.
     *   - `{number}` `height` The height of the textNode.
     */
    getTextBounds: function(textNode) {
      if (document.createRange) {
        var range = document.createRange();
        range.selectNodeContents(textNode);
        if (range.getBoundingClientRect) {
          var rect = range.getBoundingClientRect();
          if (rect) {
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
      if (type) {
        var ch = element.parentNode.children;
        var c;
        for (var i = 0, k = 0, j = ch.length; i < j; i++) {
          c = ch[i];
          if (c.nodeName && c.nodeName.toLowerCase() == type) {
            if (c == element) {
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

    elementIsDescendant: function(el, parent, stopAt) {
      var current = el;
      do {
        if (current === parent) return true;
        current = current.parentNode;
      } while (current && current !== stopAt);
      return false;
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
      while (e.parentNode && depth--) {
        if (e.parentNode.classList && e.parentNode.classList.contains(className)) {
          return e.parentNode;
        }
        e = e.parentNode;
      }
      return null;
    },
    /**
     * @ngdoc method
     * @name ionic.DomUtil#getParentOrSelfWithClass
     * @param {DOMElement} element
     * @param {string} className
     * @returns {DOMElement} The closest parent or self matching the
     * className, or null.
     */
    getParentOrSelfWithClass: function(e, className, depth) {
      depth = depth || 10;
      while (e && depth--) {
        if (e.classList && e.classList.contains(className)) {
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
      if (x < x1 || x > x2) return false;
      if (y < y1 || y > y2) return false;
      return true;
    },

    /**
     * @ngdoc method
     * @name ionic.DomUtil#blurAll
     * @description
     * Blurs any currently focused input element
     * @returns {DOMElement} The element blurred or null
     */
    blurAll: function() {
      if (document.activeElement && document.activeElement != document.body) {
        document.activeElement.blur();
        return document.activeElement;
      }
      return null;
    },

    cachedAttr: function(ele, key, value) {
      ele = ele && ele.length && ele[0] || ele;
      if (ele && ele.setAttribute) {
        var dataKey = '$attr-' + key;
        if (arguments.length > 2) {
          if (ele[dataKey] !== value) {
            ele.setAttribute(key, value);
            ele[dataKey] = value;
          }
        } else if (typeof ele[dataKey] == 'undefined') {
          ele[dataKey] = ele.getAttribute(key);
        }
        return ele[dataKey];
      }
    },

    cachedStyles: function(ele, styles) {
      ele = ele && ele.length && ele[0] || ele;
      if (ele && ele.style) {
        for (var prop in styles) {
          if (ele['$style-' + prop] !== styles[prop]) {
            ele.style[prop] = ele['$style-' + prop] = styles[prop];
          }
        }
      }
    }

  };

  //Shortcuts
  ionic.requestAnimationFrame = ionic.DomUtil.requestAnimationFrame;
  ionic.cancelAnimationFrame = ionic.DomUtil.cancelAnimationFrame;
  ionic.animationFrameThrottle = ionic.DomUtil.animationFrameThrottle;

})(window, document, ionic);

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
  ionic.CustomEvent = (function() {
    if( typeof window.CustomEvent === 'function' ) return CustomEvent;

    var customEvent = function(event, params) {
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
    customEvent.prototype = window.Event.prototype;
    return customEvent;
  })();


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
      var event = new ionic.CustomEvent(eventType, {
        detail: data,
        bubbles: !!bubbles,
        cancelable: !!cancelable
      });

      // Make sure to trigger the event on the given target, or dispatch it from
      // the window if we don't have an event target
      data && data.target && data.target.dispatchEvent && data.target.dispatchEvent(event) || window.dispatchEvent(event);
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
     *
     * Available eventTypes (from [hammer.js](http://eightmedia.github.io/hammer.js/)):
     *
     * `hold`, `tap`, `doubletap`, `drag`, `dragstart`, `dragend`, `dragup`, `dragdown`, <br/>
     * `dragleft`, `dragright`, `swipe`, `swipeup`, `swipedown`, `swipeleft`, `swiperight`, <br/>
     * `transform`, `transformstart`, `transformend`, `rotate`, `pinch`, `pinchin`, `pinchout`, <br/>
     * `touch`, `release`
     *
     * @param {string} eventType The gesture event to listen for.
     * @param {function(e)} callback The function to call when the gesture
     * happens.
     * @param {DOMElement} element The angular element to listen for the event on.
     * @param {object} options object.
     * @returns {ionic.Gesture} The gesture object (use this to remove the gesture later on).
     */
    onGesture: function(type, callback, element, options) {
      var gesture = new ionic.Gesture(element, options);
      gesture.on(type, callback);
      return gesture;
    },

    /**
     * @ngdoc method
     * @name ionic.EventController#offGesture
     * @alias ionic.offGesture
     * @description Remove an event listener for a gesture created on an element.
     * @param {ionic.Gesture} gesture The gesture that should be removed.
     * @param {string} eventType The gesture event to remove the listener for.
     * @param {function(e)} callback The listener to remove.

     */
    offGesture: function(gesture, type, callback) {
      gesture && gesture.off(type, callback);
    },

    handlePopState: function() {}
  };


  // Map some convenient top-level functions for event handling
  ionic.on = function() { ionic.EventController.on.apply(ionic.EventController, arguments); };
  ionic.off = function() { ionic.EventController.off.apply(ionic.EventController, arguments); };
  ionic.trigger = ionic.EventController.trigger;//function() { ionic.EventController.trigger.apply(ionic.EventController.trigger, arguments); };
  ionic.onGesture = function() { return ionic.EventController.onGesture.apply(ionic.EventController.onGesture, arguments); };
  ionic.offGesture = function() { return ionic.EventController.offGesture.apply(ionic.EventController.offGesture, arguments); };

})(window.ionic);

/* eslint camelcase:0 */
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
      return this;
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
      for(var t = 0; t < gestures.length; t++) {
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
      for(var t = 0; t < gestures.length; t++) {
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
      for(var t = 0; t < types.length; t++) {
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

      ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_START] = types[0];
      ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_MOVE] = types[1];
      ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_END] = types[2];
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
        ev.identifier = 1;
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
        center: ionic.Gestures.utils.getCenter(touches),
        timeStamp: new Date().getTime(),
        target: ev.target,
        touches: touches,
        eventType: eventType,
        pointerType: pointerType,
        srcEvent: ev,

        /**
         * prevent the browser default actions
         * mostly used to disable scrolling of the browser
         */
        preventDefault: function() {
          if(this.srcEvent.preventManipulation) {
            this.srcEvent.preventManipulation();
          }

          if(this.srcEvent.preventDefault) {
            // this.srcEvent.preventDefault();
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

      for(var t = 0, len = touches.length; t < len; t++) {
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
      return Math.sqrt((x * x) + (y * y));
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
        inst: inst, // reference to ionic.GesturesInstance we're working for
        startEvent: ionic.Gestures.utils.extend({}, eventData), // start eventData for distances, timing etc
        lastEvent: false, // last eventData
        name: '' // current gesture we're in/detected, can be 'tap', 'hold' etc
      };

      this.detect(eventData);
    },


    /**
     * ionic.Gestures.gesture detection
     * @param   {Object}    eventData
     */
    detect: function detect(eventData) {
      if(!this.current || this.stopped) {
        return null;
      }

      // extend event data with calculations about scale, distance etc
      eventData = this.extendEventData(eventData);

      // instance options
      var inst_options = this.current.inst.options;

      // call ionic.Gestures.gesture handlers
      for(var g = 0, len = this.gestures.length; g < len; g++) {
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
      if(eventData.eventType == ionic.Gestures.EVENT_END && !eventData.touches.length - 1) {
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
        for(var i = 0, len = ev.touches.length; i < len; i++) {
          startEv.touches.push(ionic.Gestures.utils.extend({}, ev.touches[i]));
        }
      }

      var delta_time = ev.timeStamp - startEv.timeStamp,
          delta_x = ev.center.pageX - startEv.center.pageX,
          delta_y = ev.center.pageY - startEv.center.pageY,
          velocity = ionic.Gestures.utils.getVelocity(delta_time, delta_x, delta_y);

      ionic.Gestures.utils.extend(ev, {
        deltaTime: delta_time,
        deltaX: delta_x,
        deltaY: delta_y,

        velocityX: velocity.x,
        velocityY: velocity.y,

        distance: ionic.Gestures.utils.getDistance(startEv.center, ev.center),
        angle: ionic.Gestures.utils.getAngle(startEv.center, ev.center),
        direction: ionic.Gestures.utils.getDirection(startEv.center, ev.center),

        scale: ionic.Gestures.utils.getScale(startEv.touches, ev.touches),
        rotation: ionic.Gestures.utils.getRotation(startEv.touches, ev.touches),

        startEvent: startEv
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
      hold_timeout: 500,
      hold_threshold: 9
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
              ionic.tap.cancelClick();
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
      tap_max_touchtime: 250,
      tap_max_distance: 10,
      tap_always: true,
      doubletap_distance: 20,
      doubletap_interval: 300
    },
    handler: function tapGesture(ev, inst) {
      if(ev.eventType == ionic.Gestures.EVENT_END && ev.srcEvent.type != 'touchcancel') {
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
          inst.trigger('tap', ev);
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
      swipe_max_touches: 1,
      swipe_velocity: 0.4
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
      drag_min_distance: 10,
      // Set correct_for_drag_min_distance to true to make the starting point of the drag
      // be calculated from where the drag was triggered, not from where the touch started.
      // Useful to avoid a jerk-starting drag, which can make fine-adjustments
      // through dragging difficult, and be visually unappealing.
      correct_for_drag_min_distance: true,
      // set 0 for unlimited, but this can conflict with transform
      drag_max_touches: 1,
      // prevent default browser behavior when dragging occurs
      // be careful with it, it makes the element a blocking element
      // when you are using the drag gesture, it is a good practice to set this true
      drag_block_horizontal: true,
      drag_block_vertical: true,
      // drag_lock_to_axis keeps the drag gesture on the axis that it started on,
      // It disallows vertical directions if the initial direction was horizontal, and vice versa.
      drag_lock_to_axis: false,
      // drag lock only kicks in when distance > drag_lock_min_distance
      // This way, locking occurs only when the distance has become large enough to reliably determine the direction
      drag_lock_min_distance: 25,
      // prevent default if the gesture is going the given direction
      prevent_default_directions: []
    },
    triggered: false,
    handler: function dragGesture(ev, inst) {
      if (ev.srcEvent.type == 'touchstart' || ev.srcEvent.type == 'touchend') {
        this.preventedFirstMove = false;

      } else if (!this.preventedFirstMove && ev.srcEvent.type == 'touchmove') {
        // Prevent gestures that are not intended for this event handler from firing subsequent times
        if (inst.options.prevent_default_directions.length > 0
            && inst.options.prevent_default_directions.indexOf(ev.direction) != -1) {
          ev.srcEvent.preventDefault();
        }
        this.preventedFirstMove = true;
      }

      // current gesture isnt drag, but dragged is true
      // this means an other gesture is busy. now call dragend
      if(ionic.Gestures.detection.current.name != this.name && this.triggered) {
        inst.trigger(this.name + 'end', ev);
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
              var factor = Math.abs(inst.options.drag_min_distance / ev.distance);
              ionic.Gestures.detection.current.startEvent.center.pageX += ev.deltaX * factor;
              ionic.Gestures.detection.current.startEvent.center.pageY += ev.deltaY * factor;

              // recalculate event data using new start point
              ev = ionic.Gestures.detection.extendEventData(ev);
            }
          }

          // lock drag to axis?
          if(ionic.Gestures.detection.current.lastEvent.drag_locked_to_axis || (inst.options.drag_lock_to_axis && inst.options.drag_lock_min_distance <= ev.distance)) {
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
            inst.trigger(this.name + 'start', ev);
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
            inst.trigger(this.name + 'end', ev);
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
      transform_min_scale: 0.01,
      // rotation in degrees
      transform_min_rotation: 1,
      // prevent default browser behavior when two touches are on the screen
      // but it makes the element a blocking element
      // when you are using the transform gesture, it is a good practice to set this true
      transform_always_block: false
    },
    triggered: false,
    handler: function transformGesture(ev, inst) {
      // current gesture isnt drag, but dragged is true
      // this means an other gesture is busy. now call dragend
      if(ionic.Gestures.detection.current.name != this.name && this.triggered) {
        inst.trigger(this.name + 'end', ev);
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
          var scale_threshold = Math.abs(1 - ev.scale);
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
            inst.trigger(this.name + 'start', ev);
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
            inst.trigger('pinch' + ((ev.scale < 1) ? 'in' : 'out'), ev);
          }
          break;

        case ionic.Gestures.EVENT_END:
          // trigger dragend
          if(this.triggered) {
            inst.trigger(this.name + 'end', ev);
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

      if(ev.eventType == ionic.Gestures.EVENT_START) {
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
      if(ev.eventType == ionic.Gestures.EVENT_END) {
        inst.trigger(this.name, ev);
      }
    }
  };
})(window.ionic);

(function(window, document, ionic) {

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  var IOS = 'ios';
  var ANDROID = 'android';
  var WINDOWS_PHONE = 'windowsphone';
  var EDGE = 'edge';
  var CROSSWALK = 'crosswalk';
  var requestAnimationFrame = ionic.requestAnimationFrame;

  /**
   * @ngdoc utility
   * @name ionic.Platform
   * @module ionic
   * @description
   * A set of utility methods that can be used to retrieve the device ready state and
   * various other information such as what kind of platform the app is currently installed on.
   *
   * @usage
   * ```js
   * angular.module('PlatformApp', ['ionic'])
   * .controller('PlatformCtrl', function($scope) {
   *
   *   ionic.Platform.ready(function(){
   *     // will execute when device is ready, or immediately if the device is already ready.
   *   });
   *
   *   var deviceInformation = ionic.Platform.device();
   *
   *   var isWebView = ionic.Platform.isWebView();
   *   var isIPad = ionic.Platform.isIPad();
   *   var isIOS = ionic.Platform.isIOS();
   *   var isAndroid = ionic.Platform.isAndroid();
   *   var isWindowsPhone = ionic.Platform.isWindowsPhone();
   *
   *   var currentPlatform = ionic.Platform.platform();
   *   var currentPlatformVersion = ionic.Platform.version();
   *
   *   ionic.Platform.exitApp(); // stops the app
   * });
   * ```
   */
  var self = ionic.Platform = {

    // Put navigator on platform so it can be mocked and set
    // the browser does not allow window.navigator to be set
    navigator: window.navigator,

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
    /**
     * @ngdoc property
     * @name ionic.Platform#ua
     * @returns {string} What User Agent is.
     */
    ua: navigator.userAgent,

    /**
     * @ngdoc method
     * @name ionic.Platform#ready
     * @description
     * Trigger a callback once the device is ready, or immediately
     * if the device is already ready. This method can be run from
     * anywhere and does not need to be wrapped by any additonal methods.
     * When the app is within a WebView (Cordova), it'll fire
     * the callback once the device is ready. If the app is within
     * a web browser, it'll fire the callback after `window.load`.
     * Please remember that Cordova features (Camera, FileSystem, etc) still
     * will not work in a web browser.
     * @param {function} callback The function to call.
     */
    ready: function(cb) {
      // run through tasks to complete now that the device is ready
      if (self.isReady) {
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
      self._checkPlatforms();

      requestAnimationFrame(function() {
        // only add to the body class if we got platform info
        for (var i = 0; i < self.platforms.length; i++) {
          document.body.classList.add('platform-' + self.platforms[i]);
        }
      });
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#setGrade
     * @description Set the grade of the device: 'a', 'b', or 'c'. 'a' is the best
     * (most css features enabled), 'c' is the worst.  By default, sets the grade
     * depending on the current device.
     * @param {string} grade The new grade to set.
     */
    setGrade: function(grade) {
      var oldGrade = self.grade;
      self.grade = grade;
      requestAnimationFrame(function() {
        if (oldGrade) {
          document.body.classList.remove('grade-' + oldGrade);
        }
        document.body.classList.add('grade-' + grade);
      });
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#device
     * @description Return the current device (given by cordova).
     * @returns {object} The device object.
     */
    device: function() {
      return window.device || {};
    },

    _checkPlatforms: function() {
      self.platforms = [];
      var grade = 'a';

      if (self.isWebView()) {
        self.platforms.push('webview');
        if (!(!window.cordova && !window.PhoneGap && !window.phonegap)) {
          self.platforms.push('cordova');
        } else if (typeof window.forge === 'object') {
          self.platforms.push('trigger');
        }
      } else {
        self.platforms.push('browser');
      }
      if (self.isIPad()) self.platforms.push('ipad');

      var platform = self.platform();
      if (platform) {
        self.platforms.push(platform);

        var version = self.version();
        if (version) {
          var v = version.toString();
          if (v.indexOf('.') > 0) {
            v = v.replace('.', '_');
          } else {
            v += '_0';
          }
          self.platforms.push(platform + v.split('_')[0]);
          self.platforms.push(platform + v);

          if (self.isAndroid() && version < 4.4) {
            grade = (version < 4 ? 'c' : 'b');
          } else if (self.isWindowsPhone()) {
            grade = 'b';
          }
        }
      }

      self.setGrade(grade);
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#isWebView
     * @returns {boolean} Check if we are running within a WebView (such as Cordova).
     */
    isWebView: function() {
      return !(!window.cordova && !window.PhoneGap && !window.phonegap && window.forge !== 'object');
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isIPad
     * @returns {boolean} Whether we are running on iPad.
     */
    isIPad: function() {
      if (/iPad/i.test(self.navigator.platform)) {
        return true;
      }
      return /iPad/i.test(self.ua);
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isIOS
     * @returns {boolean} Whether we are running on iOS.
     */
    isIOS: function() {
      return self.is(IOS);
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isAndroid
     * @returns {boolean} Whether we are running on Android.
     */
    isAndroid: function() {
      return self.is(ANDROID);
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isWindowsPhone
     * @returns {boolean} Whether we are running on Windows Phone.
     */
    isWindowsPhone: function() {
      return self.is(WINDOWS_PHONE);
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isEdge
     * @returns {boolean} Whether we are running on MS Edge/Windows 10 (inc. Phone)
     */
    isEdge: function() {
      return self.is(EDGE);
    },

    isCrosswalk: function() {
      return self.is(CROSSWALK);
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#platform
     * @returns {string} The name of the current platform.
     */
    platform: function() {
      // singleton to get the platform name
      if (platformName === null) self.setPlatform(self.device().platform);
      return platformName;
    },

    /**
     * @private
     */
    setPlatform: function(n) {
      if (typeof n != 'undefined' && n !== null && n.length) {
        platformName = n.toLowerCase();
      } else if (getParameterByName('ionicplatform')) {
        platformName = getParameterByName('ionicplatform');
      } else if (self.ua.indexOf('Edge') > -1) {
        platformName = EDGE;
      } else if (self.ua.indexOf('Windows Phone') > -1) {
        platformName = WINDOWS_PHONE;
      } else if (self.ua.indexOf('Android') > 0) {
        platformName = ANDROID;
      } else if (/iPhone|iPad|iPod/.test(self.ua)) {
        platformName = IOS;
      } else {
        platformName = self.navigator.platform && navigator.platform.toLowerCase().split(' ')[0] || '';
      }
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#version
     * @returns {number} The version of the current device platform.
     */
    version: function() {
      // singleton to get the platform version
      if (platformVersion === null) self.setVersion(self.device().version);
      return platformVersion;
    },

    /**
     * @private
     */
    setVersion: function(v) {
      if (typeof v != 'undefined' && v !== null) {
        v = v.split('.');
        v = parseFloat(v[0] + '.' + (v.length > 1 ? v[1] : 0));
        if (!isNaN(v)) {
          platformVersion = v;
          return;
        }
      }

      platformVersion = 0;

      // fallback to user-agent checking
      var pName = self.platform();
      var versionMatch = {
        'android': /Android (\d+).(\d+)?/,
        'ios': /OS (\d+)_(\d+)?/,
        'windowsphone': /Windows Phone (\d+).(\d+)?/
      };
      if (versionMatch[pName]) {
        v = self.ua.match(versionMatch[pName]);
        if (v && v.length > 2) {
          platformVersion = parseFloat(v[1] + '.' + v[2]);
        }
      }
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#is
     * @param {string} Platform name.
     * @returns {boolean} Whether the platform name provided is detected.
     */
    is: function(type) {
      type = type.toLowerCase();
      // check if it has an array of platforms
      if (self.platforms) {
        for (var x = 0; x < self.platforms.length; x++) {
          if (self.platforms[x] === type) return true;
        }
      }
      // exact match
      var pName = self.platform();
      if (pName) {
        return pName === type.toLowerCase();
      }

      // A quick hack for to check userAgent
      return self.ua.toLowerCase().indexOf(type) >= 0;
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#exitApp
     * @description Exit the app.
     */
    exitApp: function() {
      self.ready(function() {
        navigator.app && navigator.app.exitApp && navigator.app.exitApp();
      });
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#showStatusBar
     * @description Shows or hides the device status bar (in Cordova). Requires `cordova plugin add org.apache.cordova.statusbar`
     * @param {boolean} shouldShow Whether or not to show the status bar.
     */
    showStatusBar: function(val) {
      // Only useful when run within cordova
      self._showStatusBar = val;
      self.ready(function() {
        // run this only when or if the platform (cordova) is ready
        requestAnimationFrame(function() {
          if (self._showStatusBar) {
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
     * @param {boolean=} showFullScreen Whether or not to set the app to fullscreen. Defaults to true. Requires `cordova plugin add org.apache.cordova.statusbar`
     * @param {boolean=} showStatusBar Whether or not to show the device's status bar. Defaults to false.
     */
    fullScreen: function(showFullScreen, showStatusBar) {
      // showFullScreen: default is true if no param provided
      self.isFullScreen = (showFullScreen !== false);

      // add/remove the fullscreen classname to the body
      ionic.DomUtil.ready(function() {
        // run this only when or if the DOM is ready
        requestAnimationFrame(function() {
          if (self.isFullScreen) {
            document.body.classList.add('fullscreen');
          } else {
            document.body.classList.remove('fullscreen');
          }
        });
        // showStatusBar: default is false if no param provided
        self.showStatusBar((showStatusBar === true));
      });
    }

  };

  var platformName = null, // just the name, like iOS or Android
  platformVersion = null, // a float of the major and minor, like 7.1
  readyCallbacks = [],
  windowLoadListenderAttached,
  platformReadyTimer = 2000; // How long to wait for platform ready before emitting a warning

  verifyPlatformReady();

  // Warn the user if deviceready did not fire in a reasonable amount of time, and how to fix it.
  function verifyPlatformReady() {
    setTimeout(function() {
      if(!self.isReady && self.isWebView()) {
        void 0;
      }
    }, platformReadyTimer);
  }

  // setup listeners to know when the device is ready to go
  function onWindowLoad() {
    if (self.isWebView()) {
      // the window and scripts are fully loaded, and a cordova/phonegap
      // object exists then let's listen for the deviceready
      document.addEventListener("deviceready", onPlatformReady, false);
    } else {
      // the window and scripts are fully loaded, but the window object doesn't have the
      // cordova/phonegap object, so its just a browser, not a webview wrapped w/ cordova
      onPlatformReady();
    }
    if (windowLoadListenderAttached) {
      window.removeEventListener("load", onWindowLoad, false);
    }
  }
  if (document.readyState === 'complete') {
    onWindowLoad();
  } else {
    windowLoadListenderAttached = true;
    window.addEventListener("load", onWindowLoad, false);
  }

  function onPlatformReady() {
    // the device is all set to go, init our own stuff then fire off our event
    self.isReady = true;
    self.detect();
    for (var x = 0; x < readyCallbacks.length; x++) {
      // fire off all the callbacks that were added before the platform was ready
      readyCallbacks[x]();
    }
    readyCallbacks = [];
    ionic.trigger('platformready', { target: document });

    requestAnimationFrame(function() {
      document.body.classList.add('platform-ready');
    });
  }

})(window, document, ionic);

(function(document, ionic) {
  'use strict';

  // Ionic CSS polyfills
  ionic.CSS = {};
  ionic.CSS.TRANSITION = [];
  ionic.CSS.TRANSFORM = [];

  ionic.EVENTS = {};

  (function() {

    // transform
    var i, keys = ['webkitTransform', 'transform', '-webkit-transform', 'webkit-transform',
                   '-moz-transform', 'moz-transform', 'MozTransform', 'mozTransform', 'msTransform'];

    for (i = 0; i < keys.length; i++) {
      if (document.documentElement.style[keys[i]] !== undefined) {
        ionic.CSS.TRANSFORM = keys[i];
        break;
      }
    }

    // transition
    keys = ['webkitTransition', 'mozTransition', 'msTransition', 'transition'];
    for (i = 0; i < keys.length; i++) {
      if (document.documentElement.style[keys[i]] !== undefined) {
        ionic.CSS.TRANSITION = keys[i];
        break;
      }
    }

    // Fallback in case the keys don't exist at all
    ionic.CSS.TRANSITION = ionic.CSS.TRANSITION || 'transition';

    // The only prefix we care about is webkit for transitions.
    var isWebkit = ionic.CSS.TRANSITION.indexOf('webkit') > -1;

    // transition duration
    ionic.CSS.TRANSITION_DURATION = (isWebkit ? '-webkit-' : '') + 'transition-duration';

    // To be sure transitionend works everywhere, include *both* the webkit and non-webkit events
    ionic.CSS.TRANSITIONEND = (isWebkit ? 'webkitTransitionEnd ' : '') + 'transitionend';
  })();

  (function() {
      var touchStartEvent = 'touchstart';
      var touchMoveEvent = 'touchmove';
      var touchEndEvent = 'touchend';
      var touchCancelEvent = 'touchcancel';

      if (window.navigator.pointerEnabled) {
        touchStartEvent = 'pointerdown';
        touchMoveEvent = 'pointermove';
        touchEndEvent = 'pointerup';
        touchCancelEvent = 'pointercancel';
      } else if (window.navigator.msPointerEnabled) {
        touchStartEvent = 'MSPointerDown';
        touchMoveEvent = 'MSPointerMove';
        touchEndEvent = 'MSPointerUp';
        touchCancelEvent = 'MSPointerCancel';
      }

      ionic.EVENTS.touchstart = touchStartEvent;
      ionic.EVENTS.touchmove = touchMoveEvent;
      ionic.EVENTS.touchend = touchEndEvent;
      ionic.EVENTS.touchcancel = touchCancelEvent;
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

            for (x = 0; x < arguments.length; x++) {
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


/**
 * @ngdoc page
 * @name tap
 * @module ionic
 * @description
 * On touch devices such as a phone or tablet, some browsers implement a 300ms delay between
 * the time the user stops touching the display and the moment the browser executes the
 * click. This delay was initially introduced so the browser can know whether the user wants to
 * double-tap to zoom in on the webpage.  Basically, the browser waits roughly 300ms to see if
 * the user is double-tapping, or just tapping on the display once.
 *
 * Out of the box, Ionic automatically removes the 300ms delay in order to make Ionic apps
 * feel more "native" like. Resultingly, other solutions such as
 * [fastclick](https://github.com/ftlabs/fastclick) and Angular's
 * [ngTouch](https://docs.angularjs.org/api/ngTouch) should not be included, to avoid conflicts.
 *
 * Some browsers already remove the delay with certain settings, such as the CSS property
 * `touch-events: none` or with specific meta tag viewport values. However, each of these
 * browsers still handle clicks differently, such as when to fire off or cancel the event
 * (like scrolling when the target is a button, or holding a button down).
 * For browsers that already remove the 300ms delay, consider Ionic's tap system as a way to
 * normalize how clicks are handled across the various devices so there's an expected response
 * no matter what the device, platform or version. Additionally, Ionic will prevent
 * ghostclicks which even browsers that remove the delay still experience.
 *
 * In some cases, third-party libraries may also be working with touch events which can interfere
 * with the tap system. For example, mapping libraries like Google or Leaflet Maps often implement
 * a touch detection system which conflicts with Ionic's tap system.
 *
 * ### Disabling the tap system
 *
 * To disable the tap for an element and all of its children elements,
 * add the attribute `data-tap-disabled="true"`.
 *
 * ```html
 * <div data-tap-disabled="true">
 *     <div id="google-map"></div>
 * </div>
 * ```
 *
 * ### Additional Notes:
 *
 * - Ionic tap  works with Ionic's JavaScript scrolling
 * - Elements can come and go from the DOM and Ionic tap doesn't keep adding and removing
 *   listeners
 * - No "tap delay" after the first "tap" (you can tap as fast as you want, they all click)
 * - Minimal events listeners, only being added to document
 * - Correct focus in/out on each input type (select, textearea, range) on each platform/device
 * - Shows and hides virtual keyboard correctly for each platform/device
 * - Works with labels surrounding inputs
 * - Does not fire off a click if the user moves the pointer too far
 * - Adds and removes an 'activated' css class
 * - Multiple [unit tests](https://github.com/driftyco/ionic/blob/master/test/unit/utils/tap.unit.js) for each scenario
 *
 */
/*

 IONIC TAP
 ---------------
 - Both touch and mouse events are added to the document.body on DOM ready
 - If a touch event happens, it does not use mouse event listeners
 - On touchend, if the distance between start and end was small, trigger a click
 - In the triggered click event, add a 'isIonicTap' property
 - The triggered click receives the same x,y coordinates as as the end event
 - On document.body click listener (with useCapture=true), only allow clicks with 'isIonicTap'
 - Triggering clicks with mouse events work the same as touch, except with mousedown/mouseup
 - Tapping inputs is disabled during scrolling
*/

var tapDoc; // the element which the listeners are on (document.body)
var tapActiveEle; // the element which is active (probably has focus)
var tapEnabledTouchEvents;
var tapMouseResetTimer;
var tapPointerMoved;
var tapPointerStart;
var tapTouchFocusedInput;
var tapLastTouchTarget;
var tapTouchMoveListener = 'touchmove';

// how much the coordinates can be off between start/end, but still a click
var TAP_RELEASE_TOLERANCE = 12; // default tolerance
var TAP_RELEASE_BUTTON_TOLERANCE = 50; // button elements should have a larger tolerance

var tapEventListeners = {
  'click': tapClickGateKeeper,

  'mousedown': tapMouseDown,
  'mouseup': tapMouseUp,
  'mousemove': tapMouseMove,

  'touchstart': tapTouchStart,
  'touchend': tapTouchEnd,
  'touchcancel': tapTouchCancel,
  'touchmove': tapTouchMove,

  'pointerdown': tapTouchStart,
  'pointerup': tapTouchEnd,
  'pointercancel': tapTouchCancel,
  'pointermove': tapTouchMove,

  'MSPointerDown': tapTouchStart,
  'MSPointerUp': tapTouchEnd,
  'MSPointerCancel': tapTouchCancel,
  'MSPointerMove': tapTouchMove,

  'focusin': tapFocusIn,
  'focusout': tapFocusOut
};

ionic.tap = {

  register: function(ele) {
    tapDoc = ele;

    tapEventListener('click', true, true);
    tapEventListener('mouseup');
    tapEventListener('mousedown');

    if (window.navigator.pointerEnabled) {
      tapEventListener('pointerdown');
      tapEventListener('pointerup');
      tapEventListener('pointercancel');
      tapTouchMoveListener = 'pointermove';

    } else if (window.navigator.msPointerEnabled) {
      tapEventListener('MSPointerDown');
      tapEventListener('MSPointerUp');
      tapEventListener('MSPointerCancel');
      tapTouchMoveListener = 'MSPointerMove';

    } else {
      tapEventListener('touchstart');
      tapEventListener('touchend');
      tapEventListener('touchcancel');
    }

    tapEventListener('focusin');
    tapEventListener('focusout');

    return function() {
      for (var type in tapEventListeners) {
        tapEventListener(type, false);
      }
      tapDoc = null;
      tapActiveEle = null;
      tapEnabledTouchEvents = false;
      tapPointerMoved = false;
      tapPointerStart = null;
    };
  },

  ignoreScrollStart: function(e) {
    return (e.defaultPrevented) ||  // defaultPrevented has been assigned by another component handling the event
           (/^(file|range)$/i).test(e.target.type) ||
           (e.target.dataset ? e.target.dataset.preventScroll : e.target.getAttribute('data-prevent-scroll')) == 'true' || // manually set within an elements attributes
           (!!(/^(object|embed)$/i).test(e.target.tagName)) ||  // flash/movie/object touches should not try to scroll
           ionic.tap.isElementTapDisabled(e.target); // check if this element, or an ancestor, has `data-tap-disabled` attribute
  },

  isTextInput: function(ele) {
    return !!ele &&
           (ele.tagName == 'TEXTAREA' ||
            ele.contentEditable === 'true' ||
            (ele.tagName == 'INPUT' && !(/^(radio|checkbox|range|file|submit|reset|color|image|button)$/i).test(ele.type)));
  },

  isDateInput: function(ele) {
    return !!ele &&
            (ele.tagName == 'INPUT' && (/^(date|time|datetime-local|month|week)$/i).test(ele.type));
  },

  isVideo: function(ele) {
    return !!ele &&
            (ele.tagName == 'VIDEO');
  },

  isKeyboardElement: function(ele) {
    if ( !ionic.Platform.isIOS() || ionic.Platform.isIPad() ) {
      return ionic.tap.isTextInput(ele) && !ionic.tap.isDateInput(ele);
    } else {
      return ionic.tap.isTextInput(ele) || ( !!ele && ele.tagName == "SELECT");
    }
  },

  isLabelWithTextInput: function(ele) {
    var container = tapContainingElement(ele, false);

    return !!container &&
           ionic.tap.isTextInput(tapTargetElement(container));
  },

  containsOrIsTextInput: function(ele) {
    return ionic.tap.isTextInput(ele) || ionic.tap.isLabelWithTextInput(ele);
  },

  cloneFocusedInput: function(container) {
    if (ionic.tap.hasCheckedClone) return;
    ionic.tap.hasCheckedClone = true;

    ionic.requestAnimationFrame(function() {
      var focusInput = container.querySelector(':focus');
      if (ionic.tap.isTextInput(focusInput) && !ionic.tap.isDateInput(focusInput)) {
        var clonedInput = focusInput.cloneNode(true);

        clonedInput.value = focusInput.value;
        clonedInput.classList.add('cloned-text-input');
        clonedInput.readOnly = true;
        if (focusInput.isContentEditable) {
          clonedInput.contentEditable = focusInput.contentEditable;
          clonedInput.innerHTML = focusInput.innerHTML;
        }
        focusInput.parentElement.insertBefore(clonedInput, focusInput);
        focusInput.classList.add('previous-input-focus');

        clonedInput.scrollTop = focusInput.scrollTop;
      }
    });
  },

  hasCheckedClone: false,

  removeClonedInputs: function(container) {
    ionic.tap.hasCheckedClone = false;

    ionic.requestAnimationFrame(function() {
      var clonedInputs = container.querySelectorAll('.cloned-text-input');
      var previousInputFocus = container.querySelectorAll('.previous-input-focus');
      var x;

      for (x = 0; x < clonedInputs.length; x++) {
        clonedInputs[x].parentElement.removeChild(clonedInputs[x]);
      }

      for (x = 0; x < previousInputFocus.length; x++) {
        previousInputFocus[x].classList.remove('previous-input-focus');
        previousInputFocus[x].style.top = '';
        if ( ionic.keyboard.isOpen && !ionic.keyboard.isClosing ) previousInputFocus[x].focus();
      }
    });
  },

  requiresNativeClick: function(ele) {
    if (ionic.Platform.isWindowsPhone() && (ele.tagName == 'A' || ele.tagName == 'BUTTON' || ele.hasAttribute('ng-click') || (ele.tagName == 'INPUT' && (ele.type == 'button' || ele.type == 'submit')))) {
      return true; //Windows Phone edge case, prevent ng-click (and similar) events from firing twice on this platform
    }
    if (!ele || ele.disabled || (/^(file|range)$/i).test(ele.type) || (/^(object|video)$/i).test(ele.tagName) || ionic.tap.isLabelContainingFileInput(ele)) {
      return true;
    }
    return ionic.tap.isElementTapDisabled(ele);
  },

  isLabelContainingFileInput: function(ele) {
    var lbl = tapContainingElement(ele);
    if (lbl.tagName !== 'LABEL') return false;
    var fileInput = lbl.querySelector('input[type=file]');
    if (fileInput && fileInput.disabled === false) return true;
    return false;
  },

  isElementTapDisabled: function(ele) {
    if (ele && ele.nodeType === 1) {
      var element = ele;
      while (element) {
        if (element.getAttribute && element.getAttribute('data-tap-disabled') == 'true') {
          return true;
        }
        element = element.parentElement;
      }
    }
    return false;
  },

  setTolerance: function(releaseTolerance, releaseButtonTolerance) {
    TAP_RELEASE_TOLERANCE = releaseTolerance;
    TAP_RELEASE_BUTTON_TOLERANCE = releaseButtonTolerance;
  },

  cancelClick: function() {
    // used to cancel any simulated clicks which may happen on a touchend/mouseup
    // gestures uses this method within its tap and hold events
    tapPointerMoved = true;
  },

  pointerCoord: function(event) {
    // This method can get coordinates for both a mouse click
    // or a touch depending on the given event
    var c = { x: 0, y: 0 };
    if (event) {
      var touches = event.touches && event.touches.length ? event.touches : [event];
      var e = (event.changedTouches && event.changedTouches[0]) || touches[0];
      if (e) {
        c.x = e.clientX || e.pageX || 0;
        c.y = e.clientY || e.pageY || 0;
      }
    }
    return c;
  }

};

function tapEventListener(type, enable, useCapture) {
  if (enable !== false) {
    tapDoc.addEventListener(type, tapEventListeners[type], useCapture);
  } else {
    tapDoc.removeEventListener(type, tapEventListeners[type]);
  }
}

function tapClick(e) {
  // simulate a normal click by running the element's click method then focus on it
  var container = tapContainingElement(e.target);
  var ele = tapTargetElement(container);

  if (ionic.tap.requiresNativeClick(ele) || tapPointerMoved) return false;

  var c = ionic.tap.pointerCoord(e);

  //console.log('tapClick', e.type, ele.tagName, '('+c.x+','+c.y+')');
  triggerMouseEvent('click', ele, c.x, c.y);

  // if it's an input, focus in on the target, otherwise blur
  tapHandleFocus(ele);
}

function triggerMouseEvent(type, ele, x, y) {
  // using initMouseEvent instead of MouseEvent for our Android friends
  var clickEvent = document.createEvent("MouseEvents");
  clickEvent.initMouseEvent(type, true, true, window, 1, 0, 0, x, y, false, false, false, false, 0, null);
  clickEvent.isIonicTap = true;
  ele.dispatchEvent(clickEvent);
}

function tapClickGateKeeper(e) {
  //console.log('click ' + Date.now() + ' isIonicTap: ' + (e.isIonicTap ? true : false));
  if (e.target.type == 'submit' && e.detail === 0) {
    // do not prevent click if it came from an "Enter" or "Go" keypress submit
    return null;
  }

  // do not allow through any click events that were not created by ionic.tap
  if ((ionic.scroll.isScrolling && ionic.tap.containsOrIsTextInput(e.target)) ||
      (!e.isIonicTap && !ionic.tap.requiresNativeClick(e.target))) {
    //console.log('clickPrevent', e.target.tagName);
    e.stopPropagation();

    if (!ionic.tap.isLabelWithTextInput(e.target)) {
      // labels clicks from native should not preventDefault othersize keyboard will not show on input focus
      e.preventDefault();
    }
    return false;
  }
}

// MOUSE
function tapMouseDown(e) {
  //console.log('mousedown ' + Date.now());
  if (e.isIonicTap || tapIgnoreEvent(e)) return null;

  if (tapEnabledTouchEvents) {
    //console.log('mousedown', 'stop event');
    e.stopPropagation();

    if (!ionic.Platform.isEdge() && (!ionic.tap.isTextInput(e.target) || tapLastTouchTarget !== e.target) &&
      !isSelectOrOption(e.target.tagName) && !ionic.tap.isVideo(e.target)) {
      // If you preventDefault on a text input then you cannot move its text caret/cursor.
      // Allow through only the text input default. However, without preventDefault on an
      // input the 300ms delay can change focus on inputs after the keyboard shows up.
      // The focusin event handles the chance of focus changing after the keyboard shows.
      // Windows Phone - if you preventDefault on a video element then you cannot operate
      // its native controls.
      e.preventDefault();
    }

    return false;
  }

  tapPointerMoved = false;
  tapPointerStart = ionic.tap.pointerCoord(e);

  tapEventListener('mousemove');
  ionic.activator.start(e);
}

function tapMouseUp(e) {
  //console.log("mouseup " + Date.now());
  if (tapEnabledTouchEvents) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  if (tapIgnoreEvent(e) || isSelectOrOption(e.target.tagName)) return false;

  if (!tapHasPointerMoved(e)) {
    tapClick(e);
  }
  tapEventListener('mousemove', false);
  ionic.activator.end();
  tapPointerMoved = false;
}

function tapMouseMove(e) {
  if (tapHasPointerMoved(e)) {
    tapEventListener('mousemove', false);
    ionic.activator.end();
    tapPointerMoved = true;
    return false;
  }
}


// TOUCH
function tapTouchStart(e) {
  //console.log("touchstart " + Date.now());
  if (tapIgnoreEvent(e)) return;

  tapPointerMoved = false;

  tapEnableTouchEvents();
  tapPointerStart = ionic.tap.pointerCoord(e);

  tapEventListener(tapTouchMoveListener);
  ionic.activator.start(e);

  if (ionic.Platform.isIOS() && ionic.tap.isLabelWithTextInput(e.target)) {
    // if the tapped element is a label, which has a child input
    // then preventDefault so iOS doesn't ugly auto scroll to the input
    // but do not prevent default on Android or else you cannot move the text caret
    // and do not prevent default on Android or else no virtual keyboard shows up

    var textInput = tapTargetElement(tapContainingElement(e.target));
    if (textInput !== tapActiveEle) {
      // don't preventDefault on an already focused input or else iOS's text caret isn't usable
      //console.log('Would prevent default here');
      e.preventDefault();
    }
  }
}

function tapTouchEnd(e) {
  //console.log('touchend ' + Date.now());
  if (tapIgnoreEvent(e)) return;

  tapEnableTouchEvents();
  if (!tapHasPointerMoved(e)) {
    tapClick(e);

    if (isSelectOrOption(e.target.tagName)) {
      e.preventDefault();
    }
  }

  tapLastTouchTarget = e.target;
  tapTouchCancel();
}

function tapTouchMove(e) {
  if (tapHasPointerMoved(e)) {
    tapPointerMoved = true;
    tapEventListener(tapTouchMoveListener, false);
    ionic.activator.end();
    return false;
  }
}

function tapTouchCancel() {
  tapEventListener(tapTouchMoveListener, false);
  ionic.activator.end();
  tapPointerMoved = false;
}

function tapEnableTouchEvents() {
  tapEnabledTouchEvents = true;
  clearTimeout(tapMouseResetTimer);
  tapMouseResetTimer = setTimeout(function() {
    tapEnabledTouchEvents = false;
  }, 600);
}

function tapIgnoreEvent(e) {
  if (e.isTapHandled) return true;
  e.isTapHandled = true;

  if(ionic.tap.isElementTapDisabled(e.target)) {
    return true;
  }

  if (ionic.scroll.isScrolling && ionic.tap.containsOrIsTextInput(e.target)) {
    e.preventDefault();
    return true;
  }
}

function tapHandleFocus(ele) {
  tapTouchFocusedInput = null;

  var triggerFocusIn = false;

  if (ele.tagName == 'SELECT') {
    // trick to force Android options to show up
    triggerMouseEvent('mousedown', ele, 0, 0);
    ele.focus && ele.focus();
    triggerFocusIn = true;

  } else if (tapActiveElement() === ele) {
    // already is the active element and has focus
    triggerFocusIn = true;

  } else if ((/^(input|textarea|ion-label)$/i).test(ele.tagName) || ele.isContentEditable) {
    triggerFocusIn = true;
    ele.focus && ele.focus();
    ele.value = ele.value;
    if (tapEnabledTouchEvents) {
      tapTouchFocusedInput = ele;
    }

  } else {
    tapFocusOutActive();
  }

  if (triggerFocusIn) {
    tapActiveElement(ele);
    ionic.trigger('ionic.focusin', {
      target: ele
    }, true);
  }
}

function tapFocusOutActive() {
  var ele = tapActiveElement();
  if (ele && ((/^(input|textarea|select)$/i).test(ele.tagName) || ele.isContentEditable)) {
    //console.log('tapFocusOutActive', ele.tagName);
    ele.blur();
  }
  tapActiveElement(null);
}

function tapFocusIn(e) {
  //console.log('focusin ' + Date.now());
  // Because a text input doesn't preventDefault (so the caret still works) there's a chance
  // that its mousedown event 300ms later will change the focus to another element after
  // the keyboard shows up.

  if (tapEnabledTouchEvents &&
      ionic.tap.isTextInput(tapActiveElement()) &&
      ionic.tap.isTextInput(tapTouchFocusedInput) &&
      tapTouchFocusedInput !== e.target) {

    // 1) The pointer is from touch events
    // 2) There is an active element which is a text input
    // 3) A text input was just set to be focused on by a touch event
    // 4) A new focus has been set, however the target isn't the one the touch event wanted
    //console.log('focusin', 'tapTouchFocusedInput');
    tapTouchFocusedInput.focus();
    tapTouchFocusedInput = null;
  }
  ionic.scroll.isScrolling = false;
}

function tapFocusOut() {
  //console.log("focusout");
  tapActiveElement(null);
}

function tapActiveElement(ele) {
  if (arguments.length) {
    tapActiveEle = ele;
  }
  return tapActiveEle || document.activeElement;
}

function tapHasPointerMoved(endEvent) {
  if (!endEvent || endEvent.target.nodeType !== 1 || !tapPointerStart || (tapPointerStart.x === 0 && tapPointerStart.y === 0)) {
    return false;
  }
  var endCoordinates = ionic.tap.pointerCoord(endEvent);

  var hasClassList = !!(endEvent.target.classList && endEvent.target.classList.contains &&
    typeof endEvent.target.classList.contains === 'function');
  var releaseTolerance = hasClassList && endEvent.target.classList.contains('button') ?
    TAP_RELEASE_BUTTON_TOLERANCE :
    TAP_RELEASE_TOLERANCE;

  return Math.abs(tapPointerStart.x - endCoordinates.x) > releaseTolerance ||
         Math.abs(tapPointerStart.y - endCoordinates.y) > releaseTolerance;
}

function tapContainingElement(ele, allowSelf) {
  var climbEle = ele;
  for (var x = 0; x < 6; x++) {
    if (!climbEle) break;
    if (climbEle.tagName === 'LABEL') return climbEle;
    climbEle = climbEle.parentElement;
  }
  if (allowSelf !== false) return ele;
}

function tapTargetElement(ele) {
  if (ele && ele.tagName === 'LABEL') {
    if (ele.control) return ele.control;

    // older devices do not support the "control" property
    if (ele.querySelector) {
      var control = ele.querySelector('input,textarea,select');
      if (control) return control;
    }
  }
  return ele;
}

function isSelectOrOption(tagName){
  return (/^(select|option)$/i).test(tagName);
}

ionic.DomUtil.ready(function() {
  var ng = typeof angular !== 'undefined' ? angular : null;
  //do nothing for e2e tests
  if (!ng || (ng && !ng.scenario)) {
    ionic.tap.register(document);
  }
});

(function(document, ionic) {
  'use strict';

  var queueElements = {};   // elements that should get an active state in XX milliseconds
  var activeElements = {};  // elements that are currently active
  var keyId = 0;            // a counter for unique keys for the above ojects
  var ACTIVATED_CLASS = 'activated';

  ionic.activator = {

    start: function(e) {
      var hitX = ionic.tap.pointerCoord(e).x;
      if (hitX > 0 && hitX < 30) {
        return;
      }

      // when an element is touched/clicked, it climbs up a few
      // parents to see if it is an .item or .button element
      ionic.requestAnimationFrame(function() {
        if ((ionic.scroll && ionic.scroll.isScrolling) || ionic.tap.requiresNativeClick(e.target)) return;
        var ele = e.target;
        var eleToActivate;

        for (var x = 0; x < 6; x++) {
          if (!ele || ele.nodeType !== 1) break;
          if (eleToActivate && ele.classList && ele.classList.contains('item')) {
            eleToActivate = ele;
            break;
          }
          if (ele.tagName == 'A' || ele.tagName == 'BUTTON' || ele.hasAttribute('ng-click')) {
            eleToActivate = ele;
            break;
          }
          if (ele.classList && ele.classList.contains('button')) {
            eleToActivate = ele;
            break;
          }
          // no sense climbing past these
          if (ele.tagName == 'ION-CONTENT' || (ele.classList && ele.classList.contains('pane')) || ele.tagName == 'BODY') {
            break;
          }
          ele = ele.parentElement;
        }

        if (eleToActivate) {
          // queue that this element should be set to active
          queueElements[keyId] = eleToActivate;

          // on the next frame, set the queued elements to active
          ionic.requestAnimationFrame(activateElements);

          keyId = (keyId > 29 ? 0 : keyId + 1);
        }

      });
    },

    end: function() {
      // clear out any active/queued elements after XX milliseconds
      setTimeout(clear, 200);
    }

  };

  function clear() {
    // clear out any elements that are queued to be set to active
    queueElements = {};

    // in the next frame, remove the active class from all active elements
    ionic.requestAnimationFrame(deactivateElements);
  }

  function activateElements() {
    // activate all elements in the queue
    for (var key in queueElements) {
      if (queueElements[key]) {
        queueElements[key].classList.add(ACTIVATED_CLASS);
        activeElements[key] = queueElements[key];
      }
    }
    queueElements = {};
  }

  function deactivateElements() {
    if (ionic.transition && ionic.transition.isActive) {
      setTimeout(deactivateElements, 400);
      return;
    }

    for (var key in activeElements) {
      if (activeElements[key]) {
        activeElements[key].classList.remove(ACTIVATED_CLASS);
        delete activeElements[key];
      }
    }
  }

})(document, ionic);

(function(ionic) {
  /* for nextUid function below */
  var nextId = 0;

  /**
   * Various utilities used throughout Ionic
   *
   * Some of these are adopted from underscore.js and backbone.js, both also MIT licensed.
   */
  ionic.Utils = {

    arrayMove: function(arr, oldIndex, newIndex) {
      if (newIndex >= arr.length) {
        var k = newIndex - arr.length;
        while ((k--) + 1) {
          arr.push(undefined);
        }
      }
      arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
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
        child = function() { return parent.apply(this, arguments); };
      }

      // Add static properties to the constructor function, if supplied.
      ionic.extend(child, parent, staticProps);

      // Set the prototype chain to inherit from `parent`, without calling
      // `parent`'s constructor function.
      var Surrogate = function() { this.constructor = child; };
      Surrogate.prototype = parent.prototype;
      child.prototype = new Surrogate();

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
       for (var i = 0; i < args.length; i++) {
         var source = args[i];
         if (source) {
           for (var prop in source) {
             obj[prop] = source[prop];
           }
         }
       }
       return obj;
    },

    nextUid: function() {
      return 'ion' + (nextId++);
    },

    disconnectScope: function disconnectScope(scope) {
      if (!scope) return;

      if (scope.$root === scope) {
        return; // we can't disconnect the root node;
      }
      var parent = scope.$parent;
      scope.$$disconnected = true;
      scope.$broadcast('$ionic.disconnectScope', scope);

      // See Scope.$destroy
      if (parent.$$childHead === scope) {
        parent.$$childHead = scope.$$nextSibling;
      }
      if (parent.$$childTail === scope) {
        parent.$$childTail = scope.$$prevSibling;
      }
      if (scope.$$prevSibling) {
        scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
      }
      if (scope.$$nextSibling) {
        scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;
      }
      scope.$$nextSibling = scope.$$prevSibling = null;
    },

    reconnectScope: function reconnectScope(scope) {
      if (!scope) return;

      if (scope.$root === scope) {
        return; // we can't disconnect the root node;
      }
      if (!scope.$$disconnected) {
        return;
      }
      var parent = scope.$parent;
      scope.$$disconnected = false;
      scope.$broadcast('$ionic.reconnectScope', scope);
      // See Scope.$new for this logic...
      scope.$$prevSibling = parent.$$childTail;
      if (parent.$$childHead) {
        parent.$$childTail.$$nextSibling = scope;
        parent.$$childTail = scope;
      } else {
        parent.$$childHead = parent.$$childTail = scope;
      }
    },

    isScopeDisconnected: function(scope) {
      var climbScope = scope;
      while (climbScope) {
        if (climbScope.$$disconnected) return true;
        climbScope = climbScope.$parent;
      }
      return false;
    }
  };

  // Bind a few of the most useful functions to the ionic scope
  ionic.inherit = ionic.Utils.inherit;
  ionic.extend = ionic.Utils.extend;
  ionic.throttle = ionic.Utils.throttle;
  ionic.proxy = ionic.Utils.proxy;
  ionic.debounce = ionic.Utils.debounce;

})(window.ionic);

/**
 * @ngdoc page
 * @name keyboard
 * @module ionic
 * @description
 * On both Android and iOS, Ionic will attempt to prevent the keyboard from
 * obscuring inputs and focusable elements when it appears by scrolling them
 * into view.  In order for this to work, any focusable elements must be within
 * a [Scroll View](http://ionicframework.com/docs/api/directive/ionScroll/)
 * or a directive such as [Content](http://ionicframework.com/docs/api/directive/ionContent/)
 * that has a Scroll View.
 *
 * It will also attempt to prevent the native overflow scrolling on focus,
 * which can cause layout issues such as pushing headers up and out of view.
 *
 * The keyboard fixes work best in conjunction with the
 * [Ionic Keyboard Plugin](https://github.com/driftyco/ionic-plugins-keyboard),
 * although it will perform reasonably well without.  However, if you are using
 * Cordova there is no reason not to use the plugin.
 *
 * ### Hide when keyboard shows
 *
 * To hide an element when the keyboard is open, add the class `hide-on-keyboard-open`.
 *
 * ```html
 * <div class="hide-on-keyboard-open">
 *   <div id="google-map"></div>
 * </div>
 * ```
 *
 * Note: For performance reasons, elements will not be hidden for 400ms after the start of the `native.keyboardshow` event
 * from the Ionic Keyboard plugin. If you would like them to disappear immediately, you could do something
 * like:
 *
 * ```js
 *   window.addEventListener('native.keyboardshow', function(){
 *     document.body.classList.add('keyboard-open');
 *   });
 * ```
 * This adds the same `keyboard-open` class that is normally added by Ionic 400ms after the keyboard
 * opens. However, bear in mind that adding this class to the body immediately may cause jank in any
 * animations on Android that occur when the keyboard opens (for example, scrolling any obscured inputs into view).
 *
 * ----------
 *
 * ### Plugin Usage
 * Information on using the plugin can be found at
 * [https://github.com/driftyco/ionic-plugins-keyboard](https://github.com/driftyco/ionic-plugins-keyboard).
 *
 * ----------
 *
 * ### Android Notes
 * - If your app is running in fullscreen, i.e. you have
 *   `<preference name="Fullscreen" value="true" />` in your `config.xml` file
 *   you will need to set `ionic.Platform.isFullScreen = true` manually.
 *
 * - You can configure the behavior of the web view when the keyboard shows by setting
 *   [android:windowSoftInputMode](http://developer.android.com/reference/android/R.attr.html#windowSoftInputMode)
 *   to either `adjustPan`, `adjustResize` or `adjustNothing` in your app's
 *   activity in `AndroidManifest.xml`. `adjustResize` is the recommended setting
 *   for Ionic, but if for some reason you do use `adjustPan` you will need to
 *   set `ionic.Platform.isFullScreen = true`.
 *
 *   ```xml
 *   <activity android:windowSoftInputMode="adjustResize">
 *
 *   ```
 *
 * ### iOS Notes
 * - If the content of your app (including the header) is being pushed up and
 *   out of view on input focus, try setting `cordova.plugins.Keyboard.disableScroll(true)`.
 *   This does **not** disable scrolling in the Ionic scroll view, rather it
 *   disables the native overflow scrolling that happens automatically as a
 *   result of focusing on inputs below the keyboard.
 *
 */

/**
 * The current viewport height.
 */
var keyboardCurrentViewportHeight = 0;

/**
 * The viewport height when in portrait orientation.
 */
var keyboardPortraitViewportHeight = 0;

/**
 * The viewport height when in landscape orientation.
 */
var keyboardLandscapeViewportHeight = 0;

/**
 * The currently focused input.
 */
var keyboardActiveElement;

/**
 * The previously focused input used to reset keyboard after focusing on a
 * new non-keyboard element
 */
var lastKeyboardActiveElement;

/**
 * The scroll view containing the currently focused input.
 */
var scrollView;

/**
 * Timer for the setInterval that polls window.innerHeight to determine whether
 * the layout has updated for the keyboard showing/hiding.
 */
var waitForResizeTimer;

/**
 * Sometimes when switching inputs or orientations, focusout will fire before
 * focusin, so this timer is for the small setTimeout to determine if we should
 * really focusout/hide the keyboard.
 */
var keyboardFocusOutTimer;

/**
 * on Android, orientationchange will fire before the keyboard plugin notifies
 * the browser that the keyboard will show/is showing, so this flag indicates
 * to nativeShow that there was an orientationChange and we should update
 * the viewport height with an accurate keyboard height value
 */
var wasOrientationChange = false;

/**
 * CSS class added to the body indicating the keyboard is open.
 */
var KEYBOARD_OPEN_CSS = 'keyboard-open';

/**
 * CSS class that indicates a scroll container.
 */
var SCROLL_CONTAINER_CSS = 'scroll-content';

/**
 * Debounced keyboardFocusIn function
 */
var debouncedKeyboardFocusIn = ionic.debounce(keyboardFocusIn, 200, true);

/**
 * Debounced keyboardNativeShow function
 */
var debouncedKeyboardNativeShow = ionic.debounce(keyboardNativeShow, 100, true);

/**
 * Ionic keyboard namespace.
 * @namespace keyboard
 */
ionic.keyboard = {

  /**
   * Whether the keyboard is open or not.
   */
  isOpen: false,

  /**
   * Whether the keyboard is closing or not.
   */
  isClosing: false,

  /**
   * Whether the keyboard is opening or not.
   */
  isOpening: false,

  /**
   * The height of the keyboard in pixels, as reported by the keyboard plugin.
   * If the plugin is not available, calculated as the difference in
   * window.innerHeight after the keyboard has shown.
   */
  height: 0,

  /**
   * Whether the device is in landscape orientation or not.
   */
  isLandscape: false,

  /**
   * Whether the keyboard event listeners have been added or not
   */
  isInitialized: false,

  /**
   * Hide the keyboard, if it is open.
   */
  hide: function() {
    if (keyboardHasPlugin()) {
      cordova.plugins.Keyboard.close();
    }
    keyboardActiveElement && keyboardActiveElement.blur();
  },

  /**
   * An alias for cordova.plugins.Keyboard.show(). If the keyboard plugin
   * is installed, show the keyboard.
   */
  show: function() {
    if (keyboardHasPlugin()) {
      cordova.plugins.Keyboard.show();
    }
  },

  /**
   * Remove all keyboard related event listeners, effectively disabling Ionic's
   * keyboard adjustments.
   */
  disable: function() {
    if (keyboardHasPlugin()) {
      window.removeEventListener('native.keyboardshow', debouncedKeyboardNativeShow );
      window.removeEventListener('native.keyboardhide', keyboardFocusOut);
    } else {
      document.body.removeEventListener('focusout', keyboardFocusOut);
    }

    document.body.removeEventListener('ionic.focusin', debouncedKeyboardFocusIn);
    document.body.removeEventListener('focusin', debouncedKeyboardFocusIn);

    window.removeEventListener('orientationchange', keyboardOrientationChange);

    if ( window.navigator.msPointerEnabled ) {
      document.removeEventListener("MSPointerDown", keyboardInit);
    } else {
      document.removeEventListener('touchstart', keyboardInit);
    }
    ionic.keyboard.isInitialized = false;
  },

  /**
   * Alias for keyboardInit, initialize all keyboard related event listeners.
   */
  enable: function() {
    keyboardInit();
  }
};

// Initialize the viewport height (after ionic.keyboard.height has been
// defined).
keyboardCurrentViewportHeight = getViewportHeight();


                             /* Event handlers */
/* ------------------------------------------------------------------------- */

/**
 * Event handler for first touch event, initializes all event listeners
 * for keyboard related events. Also aliased by ionic.keyboard.enable.
 */
function keyboardInit() {

  if (ionic.keyboard.isInitialized) return;

  if (keyboardHasPlugin()) {
    window.addEventListener('native.keyboardshow', debouncedKeyboardNativeShow);
    window.addEventListener('native.keyboardhide', keyboardFocusOut);
  } else {
    document.body.addEventListener('focusout', keyboardFocusOut);
  }

  document.body.addEventListener('ionic.focusin', debouncedKeyboardFocusIn);
  document.body.addEventListener('focusin', debouncedKeyboardFocusIn);

  if (window.navigator.msPointerEnabled) {
    document.removeEventListener("MSPointerDown", keyboardInit);
  } else {
    document.removeEventListener('touchstart', keyboardInit);
  }

  ionic.keyboard.isInitialized = true;
}

/**
 * Event handler for 'native.keyboardshow' event, sets keyboard.height to the
 * reported height and keyboard.isOpening to true. Then calls
 * keyboardWaitForResize with keyboardShow or keyboardUpdateViewportHeight as
 * the callback depending on whether the event was triggered by a focusin or
 * an orientationchange.
 */
function keyboardNativeShow(e) {
  clearTimeout(keyboardFocusOutTimer);
  //console.log("keyboardNativeShow fired at: " + Date.now());
  //console.log("keyboardNativeshow window.innerHeight: " + window.innerHeight);

  if (!ionic.keyboard.isOpen || ionic.keyboard.isClosing) {
    ionic.keyboard.isOpening = true;
    ionic.keyboard.isClosing = false;
  }

  ionic.keyboard.height = e.keyboardHeight;
  //console.log('nativeshow keyboard height:' + e.keyboardHeight);

  if (wasOrientationChange) {
    keyboardWaitForResize(keyboardUpdateViewportHeight, true);
  } else {
    keyboardWaitForResize(keyboardShow, true);
  }
}

/**
 * Event handler for 'focusin' and 'ionic.focusin' events. Initializes
 * keyboard state (keyboardActiveElement and keyboard.isOpening) for the
 * appropriate adjustments once the window has resized.  If not using the
 * keyboard plugin, calls keyboardWaitForResize with keyboardShow as the
 * callback or keyboardShow right away if the keyboard is already open.  If
 * using the keyboard plugin does nothing and lets keyboardNativeShow handle
 * adjustments with a more accurate keyboard height.
 */
function keyboardFocusIn(e) {
  clearTimeout(keyboardFocusOutTimer);
  //console.log("keyboardFocusIn from: " + e.type + " at: " + Date.now());

  if (!e.target ||
      e.target.readOnly ||
      !ionic.tap.isKeyboardElement(e.target) ||
      !(scrollView = ionic.DomUtil.getParentWithClass(e.target, SCROLL_CONTAINER_CSS))) {
    if (keyboardActiveElement) {
        lastKeyboardActiveElement = keyboardActiveElement;
    }
    keyboardActiveElement = null;
    return;
  }

  keyboardActiveElement = e.target;

  // if using JS scrolling, undo the effects of native overflow scroll so the
  // scroll view is positioned correctly
  if (!scrollView.classList.contains("overflow-scroll")) {
    document.body.scrollTop = 0;
    scrollView.scrollTop = 0;
    ionic.requestAnimationFrame(function(){
      document.body.scrollTop = 0;
      scrollView.scrollTop = 0;
    });

    // any showing part of the document that isn't within the scroll the user
    // could touchmove and cause some ugly changes to the app, so disable
    // any touchmove events while the keyboard is open using e.preventDefault()
    if (window.navigator.msPointerEnabled) {
      document.addEventListener("MSPointerMove", keyboardPreventDefault, false);
    } else {
      document.addEventListener('touchmove', keyboardPreventDefault, false);
    }
  }

  if (!ionic.keyboard.isOpen || ionic.keyboard.isClosing) {
    ionic.keyboard.isOpening = true;
    ionic.keyboard.isClosing = false;
  }

  // attempt to prevent browser from natively scrolling input into view while
  // we are trying to do the same (while we are scrolling) if the user taps the
  // keyboard
  document.addEventListener('keydown', keyboardOnKeyDown, false);



  // if we aren't using the plugin and the keyboard isn't open yet, wait for the
  // window to resize so we can get an accurate estimate of the keyboard size,
  // otherwise we do nothing and let nativeShow call keyboardShow once we have
  // an exact keyboard height
  // if the keyboard is already open, go ahead and scroll the input into view
  // if necessary
  if (!ionic.keyboard.isOpen && !keyboardHasPlugin()) {
    keyboardWaitForResize(keyboardShow, true);

  } else if (ionic.keyboard.isOpen) {
    keyboardShow();
  }
}

/**
 * Event handler for 'focusout' events. Sets keyboard.isClosing to true and
 * calls keyboardWaitForResize with keyboardHide as the callback after a small
 * timeout.
 */
function keyboardFocusOut() {
  clearTimeout(keyboardFocusOutTimer);
  //console.log("keyboardFocusOut fired at: " + Date.now());
  //console.log("keyboardFocusOut event type: " + e.type);

  if (ionic.keyboard.isOpen || ionic.keyboard.isOpening) {
    ionic.keyboard.isClosing = true;
    ionic.keyboard.isOpening = false;
  }

  // Call keyboardHide with a slight delay because sometimes on focus or
  // orientation change focusin is called immediately after, so we give it time
  // to cancel keyboardHide
  keyboardFocusOutTimer = setTimeout(function() {
    ionic.requestAnimationFrame(function() {
      // focusOut during or right after an orientationchange, so we didn't get
      // a chance to update the viewport height yet, do it and keyboardHide
      //console.log("focusOut, wasOrientationChange: " + wasOrientationChange);
      if (wasOrientationChange) {
        keyboardWaitForResize(function(){
          keyboardUpdateViewportHeight();
          keyboardHide();
        }, false);
      } else {
        keyboardWaitForResize(keyboardHide, false);
      }
    });
  }, 50);
}

/**
 * Event handler for 'orientationchange' events. If using the keyboard plugin
 * and the keyboard is open on Android, sets wasOrientationChange to true so
 * nativeShow can update the viewport height with an accurate keyboard height.
 * If the keyboard isn't open or keyboard plugin isn't being used,
 * waits for the window to resize before updating the viewport height.
 *
 * On iOS, where orientationchange fires after the keyboard has already shown,
 * updates the viewport immediately, regardless of if the keyboard is already
 * open.
 */
function keyboardOrientationChange() {
  //console.log("orientationchange fired at: " + Date.now());
  //console.log("orientation was: " + (ionic.keyboard.isLandscape ? "landscape" : "portrait"));

  // toggle orientation
  ionic.keyboard.isLandscape = !ionic.keyboard.isLandscape;
  // //console.log("now orientation is: " + (ionic.keyboard.isLandscape ? "landscape" : "portrait"));

  // no need to wait for resizing on iOS, and orientationchange always fires
  // after the keyboard has opened, so it doesn't matter if it's open or not
  if (ionic.Platform.isIOS()) {
    keyboardUpdateViewportHeight();
  }

  // On Android, if the keyboard isn't open or we aren't using the keyboard
  // plugin, update the viewport height once everything has resized. If the
  // keyboard is open and we are using the keyboard plugin do nothing and let
  // nativeShow handle it using an accurate keyboard height.
  if ( ionic.Platform.isAndroid()) {
    if (!ionic.keyboard.isOpen || !keyboardHasPlugin()) {
      keyboardWaitForResize(keyboardUpdateViewportHeight, false);
    } else {
      wasOrientationChange = true;
    }
  }
}

/**
 * Event handler for 'keydown' event. Tries to prevent browser from natively
 * scrolling an input into view when a user taps the keyboard while we are
 * scrolling the input into view ourselves with JS.
 */
function keyboardOnKeyDown(e) {
  if (ionic.scroll.isScrolling) {
    keyboardPreventDefault(e);
  }
}

/**
 * Event for 'touchmove' or 'MSPointerMove'. Prevents native scrolling on
 * elements outside the scroll view while the keyboard is open.
 */
function keyboardPreventDefault(e) {
  if (e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
  }
}

                              /* Private API */
/* -------------------------------------------------------------------------- */

/**
 * Polls window.innerHeight until it has updated to an expected value (or
 * sufficient time has passed) before calling the specified callback function.
 * Only necessary for non-fullscreen Android which sometimes reports multiple
 * window.innerHeight values during interim layouts while it is resizing.
 *
 * On iOS, the window.innerHeight will already be updated, but we use the 50ms
 * delay as essentially a timeout so that scroll view adjustments happen after
 * the keyboard has shown so there isn't a white flash from us resizing too
 * quickly.
 *
 * @param {Function} callback the function to call once the window has resized
 * @param {boolean} isOpening whether the resize is from the keyboard opening
 * or not
 */
function keyboardWaitForResize(callback, isOpening) {
  clearInterval(waitForResizeTimer);
  var count = 0;
  var maxCount;
  var initialHeight = getViewportHeight();
  var viewportHeight = initialHeight;

  //console.log("waitForResize initial viewport height: " + viewportHeight);
  //var start = Date.now();
  //console.log("start: " + start);

  // want to fail relatively quickly on modern android devices, since it's much
  // more likely we just have a bad keyboard height
  if (ionic.Platform.isAndroid() && ionic.Platform.version() < 4.4) {
    maxCount = 30;
  } else if (ionic.Platform.isAndroid()) {
    maxCount = 10;
  } else {
    maxCount = 1;
  }

  // poll timer
  waitForResizeTimer = setInterval(function(){
    viewportHeight = getViewportHeight();

    // height hasn't updated yet, try again in 50ms
    // if not using plugin, wait for maxCount to ensure we have waited long enough
    // to get an accurate keyboard height
    if (++count < maxCount &&
        ((!isPortraitViewportHeight(viewportHeight) &&
         !isLandscapeViewportHeight(viewportHeight)) ||
         !ionic.keyboard.height)) {
      return;
    }

    // infer the keyboard height from the resize if not using the keyboard plugin
    if (!keyboardHasPlugin()) {
      ionic.keyboard.height = Math.abs(initialHeight - window.innerHeight);
    }

    // set to true if we were waiting for the keyboard to open
    ionic.keyboard.isOpen = isOpening;

    clearInterval(waitForResizeTimer);
    //var end = Date.now();
    //console.log("waitForResize count: " + count);
    //console.log("end: " + end);
    //console.log("difference: " + ( end - start ) + "ms");

    //console.log("callback: " + callback.name);
    callback();

  }, 50);

  return maxCount; //for tests
}

/**
 * On keyboard close sets keyboard state to closed, resets the scroll view,
 * removes CSS from body indicating keyboard was open, removes any event
 * listeners for when the keyboard is open and on Android blurs the active
 * element (which in some cases will still have focus even if the keyboard
 * is closed and can cause it to reappear on subsequent taps).
 */
function keyboardHide() {
  clearTimeout(keyboardFocusOutTimer);
  //console.log("keyboardHide");

  ionic.keyboard.isOpen = false;
  ionic.keyboard.isClosing = false;

  if (keyboardActiveElement || lastKeyboardActiveElement) {
    ionic.trigger('resetScrollView', {
      target: keyboardActiveElement || lastKeyboardActiveElement
    }, true);
  }

  ionic.requestAnimationFrame(function(){
    document.body.classList.remove(KEYBOARD_OPEN_CSS);
  });

  // the keyboard is gone now, remove the touchmove that disables native scroll
  if (window.navigator.msPointerEnabled) {
    document.removeEventListener("MSPointerMove", keyboardPreventDefault);
  } else {
    document.removeEventListener('touchmove', keyboardPreventDefault);
  }
  document.removeEventListener('keydown', keyboardOnKeyDown);

  if (ionic.Platform.isAndroid()) {
    // on android closing the keyboard with the back/dismiss button won't remove
    // focus and keyboard can re-appear on subsequent taps (like scrolling)
    if (keyboardHasPlugin()) cordova.plugins.Keyboard.close();
    keyboardActiveElement && keyboardActiveElement.blur();
  }

  keyboardActiveElement = null;
  lastKeyboardActiveElement = null;
}

/**
 * On keyboard open sets keyboard state to open, adds CSS to the body
 * indicating the keyboard is open and tells the scroll view to resize and
 * the currently focused input into view if necessary.
 */
function keyboardShow() {

  ionic.keyboard.isOpen = true;
  ionic.keyboard.isOpening = false;

  var details = {
    keyboardHeight: keyboardGetHeight(),
    viewportHeight: keyboardCurrentViewportHeight
  };

  if (keyboardActiveElement) {
    details.target = keyboardActiveElement;

    var elementBounds = keyboardActiveElement.getBoundingClientRect();

    details.elementTop = Math.round(elementBounds.top);
    details.elementBottom = Math.round(elementBounds.bottom);

    details.windowHeight = details.viewportHeight - details.keyboardHeight;
    //console.log("keyboardShow viewportHeight: " + details.viewportHeight +
    //", windowHeight: " + details.windowHeight +
    //", keyboardHeight: " + details.keyboardHeight);

    // figure out if the element is under the keyboard
    details.isElementUnderKeyboard = (details.elementBottom > details.windowHeight);
    //console.log("isUnderKeyboard: " + details.isElementUnderKeyboard);
    //console.log("elementBottom: " + details.elementBottom);

    // send event so the scroll view adjusts
    ionic.trigger('scrollChildIntoView', details, true);
  }

  setTimeout(function(){
    document.body.classList.add(KEYBOARD_OPEN_CSS);
  }, 400);

  return details; //for testing
}

/* eslint no-unused-vars:0 */
function keyboardGetHeight() {
  // check if we already have a keyboard height from the plugin or resize calculations
  if (ionic.keyboard.height) {
    return ionic.keyboard.height;
  }

  if (ionic.Platform.isAndroid()) {
    // should be using the plugin, no way to know how big the keyboard is, so guess
    if ( ionic.Platform.isFullScreen ) {
      return 275;
    }
    // otherwise just calculate it
    var contentHeight = window.innerHeight;
    if (contentHeight < keyboardCurrentViewportHeight) {
      return keyboardCurrentViewportHeight - contentHeight;
    } else {
      return 0;
    }
  }

  // fallback for when it's the webview without the plugin
  // or for just the standard web browser
  // TODO: have these be based on device
  if (ionic.Platform.isIOS()) {
    if (ionic.keyboard.isLandscape) {
      return 206;
    }

    if (!ionic.Platform.isWebView()) {
      return 216;
    }

    return 260;
  }

  // safe guess
  return 275;
}

function isPortraitViewportHeight(viewportHeight) {
  return !!(!ionic.keyboard.isLandscape &&
         keyboardPortraitViewportHeight &&
         (Math.abs(keyboardPortraitViewportHeight - viewportHeight) < 2));
}

function isLandscapeViewportHeight(viewportHeight) {
  return !!(ionic.keyboard.isLandscape &&
         keyboardLandscapeViewportHeight &&
         (Math.abs(keyboardLandscapeViewportHeight - viewportHeight) < 2));
}

function keyboardUpdateViewportHeight() {
  wasOrientationChange = false;
  keyboardCurrentViewportHeight = getViewportHeight();

  if (ionic.keyboard.isLandscape && !keyboardLandscapeViewportHeight) {
    //console.log("saved landscape: " + keyboardCurrentViewportHeight);
    keyboardLandscapeViewportHeight = keyboardCurrentViewportHeight;

  } else if (!ionic.keyboard.isLandscape && !keyboardPortraitViewportHeight) {
    //console.log("saved portrait: " + keyboardCurrentViewportHeight);
    keyboardPortraitViewportHeight = keyboardCurrentViewportHeight;
  }

  if (keyboardActiveElement) {
    ionic.trigger('resetScrollView', {
      target: keyboardActiveElement
    }, true);
  }

  if (ionic.keyboard.isOpen && ionic.tap.isTextInput(keyboardActiveElement)) {
    keyboardShow();
  }
}

function keyboardInitViewportHeight() {
  var viewportHeight = getViewportHeight();
  //console.log("Keyboard init VP: " + viewportHeight + " " + window.innerWidth);
  // can't just use window.innerHeight in case the keyboard is opened immediately
  if ((viewportHeight / window.innerWidth) < 1) {
    ionic.keyboard.isLandscape = true;
  }
  //console.log("ionic.keyboard.isLandscape is: " + ionic.keyboard.isLandscape);

  // initialize or update the current viewport height values
  keyboardCurrentViewportHeight = viewportHeight;
  if (ionic.keyboard.isLandscape && !keyboardLandscapeViewportHeight) {
    keyboardLandscapeViewportHeight = keyboardCurrentViewportHeight;
  } else if (!ionic.keyboard.isLandscape && !keyboardPortraitViewportHeight) {
    keyboardPortraitViewportHeight = keyboardCurrentViewportHeight;
  }
}

function getViewportHeight() {
  var windowHeight = window.innerHeight;
  //console.log('window.innerHeight is: ' + windowHeight);
  //console.log('kb height is: ' + ionic.keyboard.height);
  //console.log('kb isOpen: ' + ionic.keyboard.isOpen);

  //TODO: add iPad undocked/split kb once kb plugin supports it
  // the keyboard overlays the window on Android fullscreen
  if (!(ionic.Platform.isAndroid() && ionic.Platform.isFullScreen) &&
      (ionic.keyboard.isOpen || ionic.keyboard.isOpening) &&
      !ionic.keyboard.isClosing) {

     return windowHeight + keyboardGetHeight();
  }
  return windowHeight;
}

function keyboardHasPlugin() {
  return !!(window.cordova && cordova.plugins && cordova.plugins.Keyboard);
}

ionic.Platform.ready(function() {
  keyboardInitViewportHeight();

  window.addEventListener('orientationchange', keyboardOrientationChange);

  // if orientation changes while app is in background, update on resuming
  /*
  if ( ionic.Platform.isWebView() ) {
    document.addEventListener('resume', keyboardInitViewportHeight);

    if (ionic.Platform.isAndroid()) {
      //TODO: onbackpressed to detect keyboard close without focusout or plugin
    }
  }
  */

  // if orientation changes while app is in background, update on resuming
/*  if ( ionic.Platform.isWebView() ) {
    document.addEventListener('pause', function() {
      window.removeEventListener('orientationchange', keyboardOrientationChange);
    })
    document.addEventListener('resume', function() {
      keyboardInitViewportHeight();
      window.addEventListener('orientationchange', keyboardOrientationChange)
    });
  }*/

  // Android sometimes reports bad innerHeight on window.load
  // try it again in a lil bit to play it safe
  setTimeout(keyboardInitViewportHeight, 999);

  // only initialize the adjustments for the virtual keyboard
  // if a touchstart event happens
  if (window.navigator.msPointerEnabled) {
    document.addEventListener("MSPointerDown", keyboardInit, false);
  } else {
    document.addEventListener('touchstart', keyboardInit, false);
  }
});



var viewportTag;
var viewportProperties = {};

ionic.viewport = {
  orientation: function() {
    // 0 = Portrait
    // 90 = Landscape
    // not using window.orientation because each device has a different implementation
    return (window.innerWidth > window.innerHeight ? 90 : 0);
  }
};

function viewportLoadTag() {
  var x;

  for (x = 0; x < document.head.children.length; x++) {
    if (document.head.children[x].name == 'viewport') {
      viewportTag = document.head.children[x];
      break;
    }
  }

  if (viewportTag) {
    var props = viewportTag.content.toLowerCase().replace(/\s+/g, '').split(',');
    var keyValue;
    for (x = 0; x < props.length; x++) {
      if (props[x]) {
        keyValue = props[x].split('=');
        viewportProperties[ keyValue[0] ] = (keyValue.length > 1 ? keyValue[1] : '_');
      }
    }
    viewportUpdate();
  }
}

function viewportUpdate() {
  // unit tests in viewport.unit.js

  var initWidth = viewportProperties.width;
  var initHeight = viewportProperties.height;
  var p = ionic.Platform;
  var version = p.version();
  var DEVICE_WIDTH = 'device-width';
  var DEVICE_HEIGHT = 'device-height';
  var orientation = ionic.viewport.orientation();

  // Most times we're removing the height and adding the width
  // So this is the default to start with, then modify per platform/version/oreintation
  delete viewportProperties.height;
  viewportProperties.width = DEVICE_WIDTH;

  if (p.isIPad()) {
    // iPad

    if (version > 7) {
      // iPad >= 7.1
      // https://issues.apache.org/jira/browse/CB-4323
      delete viewportProperties.width;

    } else {
      // iPad <= 7.0

      if (p.isWebView()) {
        // iPad <= 7.0 WebView

        if (orientation == 90) {
          // iPad <= 7.0 WebView Landscape
          viewportProperties.height = '0';

        } else if (version == 7) {
          // iPad <= 7.0 WebView Portait
          viewportProperties.height = DEVICE_HEIGHT;
        }
      } else {
        // iPad <= 6.1 Browser
        if (version < 7) {
          viewportProperties.height = '0';
        }
      }
    }

  } else if (p.isIOS()) {
    // iPhone

    if (p.isWebView()) {
      // iPhone WebView

      if (version > 7) {
        // iPhone >= 7.1 WebView
        delete viewportProperties.width;

      } else if (version < 7) {
        // iPhone <= 6.1 WebView
        // if height was set it needs to get removed with this hack for <= 6.1
        if (initHeight) viewportProperties.height = '0';

      } else if (version == 7) {
        //iPhone == 7.0 WebView
        viewportProperties.height = DEVICE_HEIGHT;
      }

    } else {
      // iPhone Browser

      if (version < 7) {
        // iPhone <= 6.1 Browser
        // if height was set it needs to get removed with this hack for <= 6.1
        if (initHeight) viewportProperties.height = '0';
      }
    }

  }

  // only update the viewport tag if there was a change
  if (initWidth !== viewportProperties.width || initHeight !== viewportProperties.height) {
    viewportTagUpdate();
  }
}

function viewportTagUpdate() {
  var key, props = [];
  for (key in viewportProperties) {
    if (viewportProperties[key]) {
      props.push(key + (viewportProperties[key] == '_' ? '' : '=' + viewportProperties[key]));
    }
  }

  viewportTag.content = props.join(', ');
}

ionic.Platform.ready(function() {
  viewportLoadTag();

  window.addEventListener("orientationchange", function() {
    setTimeout(viewportUpdate, 1000);
  }, false);
});

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

/* jshint eqnull: true */

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
var zyngaCore = { effect: {} };
(function(global) {
  var time = Date.now || function() {
    return +new Date();
  };
  var desiredFrames = 60;
  var millisecondsPerSecond = 1000;
  var running = {};
  var counter = 1;

  zyngaCore.effect.Animate = {

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
          requestFrame(callback, root);
        };
      }

      var TARGET_FPS = 60;
      var requests = {};
      var requestCount = 0;
      var rafHandle = 1;
      var intervalHandle = null;
      var lastActive = +new Date();

      return function(callback) {
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
          zyngaCore.effect.Animate.requestAnimationFrame(step, root);
        }
      };

      // Mark as running
      running[id] = true;

      // Init first step
      zyngaCore.effect.Animate.requestAnimationFrame(step, root);

      // Return unique animation ID
      return id;
    }
  };
})(window);

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

    self.__container = options.el;
    self.__content = options.el.firstElementChild;

    //Remove any scrollTop attached to these elements; they are virtual scroll now
    //This also stops on-load-scroll-to-window.location.hash that the browser does
    setTimeout(function() {
      if (self.__container && self.__content) {
        self.__container.scrollTop = 0;
        self.__content.scrollTop = 0;
      }
    });

    self.options = {

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

      /** The velocity required to make the scroll view "slide" after touchend */
      decelVelocityThreshold: 4,

      /** The velocity required to make the scroll view "slide" after touchend when using paging */
      decelVelocityThresholdPaging: 4,

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

      deceleration: 0.97,

      /** Whether to prevent default on a scroll operation to capture drag events **/
      preventDefault: false,

      /** Callback that is fired on the later of touch end or deceleration end,
        provided that another scrolling action has not begun. Used to know
        when to fade out a scrollbar. */
      scrollingComplete: NOOP,

      /** This configures the amount of change applied to deceleration when reaching boundaries  **/
      penetrationDeceleration: 0.03,

      /** This configures the amount of change applied to acceleration when reaching boundaries  **/
      penetrationAcceleration: 0.08,

      // The ms interval for triggering scroll events
      scrollEventInterval: 10,

      freeze: false,

      getContentWidth: function() {
        return Math.max(self.__content.scrollWidth, self.__content.offsetWidth);
      },
      getContentHeight: function() {
        return Math.max(self.__content.scrollHeight, self.__content.offsetHeight + (self.__content.offsetTop * 2));
      }
    };

    for (var key in options) {
      self.options[key] = options[key];
    }

    self.hintResize = ionic.debounce(function() {
      self.resize();
    }, 1000, true);

    self.onScroll = function() {

      if (!ionic.scroll.isScrolling) {
        setTimeout(self.setScrollStart, 50);
      } else {
        clearTimeout(self.scrollTimer);
        self.scrollTimer = setTimeout(self.setScrollStop, 80);
      }

    };

    self.freeze = function(shouldFreeze) {
      if (arguments.length) {
        self.options.freeze = shouldFreeze;
      }
      return self.options.freeze;
    };

    // We can just use the standard freeze pop in our mouth
    self.freezeShut = self.freeze;

    self.setScrollStart = function() {
      ionic.scroll.isScrolling = Math.abs(ionic.scroll.lastTop - self.__scrollTop) > 1;
      clearTimeout(self.scrollTimer);
      self.scrollTimer = setTimeout(self.setScrollStop, 80);
    };

    self.setScrollStop = function() {
      ionic.scroll.isScrolling = false;
      ionic.scroll.lastTop = self.__scrollTop;
    };

    self.triggerScrollEvent = ionic.throttle(function() {
      self.onScroll();
      ionic.trigger('scroll', {
        scrollTop: self.__scrollTop,
        scrollLeft: self.__scrollLeft,
        target: self.__container
      });
    }, self.options.scrollEventInterval);

    self.triggerScrollEndEvent = function() {
      ionic.trigger('scrollend', {
        scrollTop: self.__scrollTop,
        scrollLeft: self.__scrollLeft,
        target: self.__container
      });
    };

    self.__scrollLeft = self.options.startX;
    self.__scrollTop = self.options.startY;

    // Get the render update function, initialize event handlers,
    // and calculate the size of the scroll container
    self.__callback = self.getRenderFn();
    self.__initEventHandlers();
    self.__createScrollbars();

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
    var container = self.__container;

    // save height when scroll view is shrunk so we don't need to reflow
    var scrollViewOffsetHeight;

    /**
     * Shrink the scroll view when the keyboard is up if necessary and if the
     * focused input is below the bottom of the shrunk scroll view, scroll it
     * into view.
     */
    self.scrollChildIntoView = function(e) {
      //console.log("scrollChildIntoView at: " + Date.now());

      // D
      var scrollBottomOffsetToTop = container.getBoundingClientRect().bottom;
      // D - A
      scrollViewOffsetHeight = container.offsetHeight;
      var alreadyShrunk = self.isShrunkForKeyboard;

      var isModal = container.parentNode.classList.contains('modal');
      // 680px is when the media query for 60% modal width kicks in
      var isInsetModal = isModal && window.innerWidth >= 680;

     /*
      *  _______
      * |---A---| <- top of scroll view
      * |       |
      * |---B---| <- keyboard
      * |   C   | <- input
      * |---D---| <- initial bottom of scroll view
      * |___E___| <- bottom of viewport
      *
      *  All commented calculations relative to the top of the viewport (ie E
      *  is the viewport height, not 0)
      */
      if (!alreadyShrunk) {
        // shrink scrollview so we can actually scroll if the input is hidden
        // if it isn't shrink so we can scroll to inputs under the keyboard
        // inset modals won't shrink on Android on their own when the keyboard appears
        if ( ionic.Platform.isIOS() || ionic.Platform.isFullScreen || isInsetModal ) {
          // if there are things below the scroll view account for them and
          // subtract them from the keyboard height when resizing
          // E - D                         E                         D
          var scrollBottomOffsetToBottom = e.detail.viewportHeight - scrollBottomOffsetToTop;

          // 0 or D - B if D > B           E - B                     E - D
          var keyboardOffset = Math.max(0, e.detail.keyboardHeight - scrollBottomOffsetToBottom);

          ionic.requestAnimationFrame(function(){
            // D - A or B - A if D > B       D - A             max(0, D - B)
            scrollViewOffsetHeight = scrollViewOffsetHeight - keyboardOffset;
            container.style.height = scrollViewOffsetHeight + "px";
            container.style.overflow = "visible";

            //update scroll view
            self.resize();
          });
        }

        self.isShrunkForKeyboard = true;
      }

      /*
       *  _______
       * |---A---| <- top of scroll view
       * |   *   | <- where we want to scroll to
       * |--B-D--| <- keyboard, bottom of scroll view
       * |   C   | <- input
       * |       |
       * |___E___| <- bottom of viewport
       *
       *  All commented calculations relative to the top of the viewport (ie E
       *  is the viewport height, not 0)
       */
      // if the element is positioned under the keyboard scroll it into view
      if (e.detail.isElementUnderKeyboard) {

        ionic.requestAnimationFrame(function(){
          container.scrollTop = 0;
          // update D if we shrunk
          if (self.isShrunkForKeyboard && !alreadyShrunk) {
            scrollBottomOffsetToTop = container.getBoundingClientRect().bottom;
          }

          // middle of the scrollview, this is where we want to scroll to
          // (D - A) / 2
          var scrollMidpointOffset = scrollViewOffsetHeight * 0.5;
          //console.log("container.offsetHeight: " + scrollViewOffsetHeight);

          // middle of the input we want to scroll into view
          // C
          var inputMidpoint = ((e.detail.elementBottom + e.detail.elementTop) / 2);

          // distance from middle of input to the bottom of the scroll view
          // C - D                                C               D
          var inputMidpointOffsetToScrollBottom = inputMidpoint - scrollBottomOffsetToTop;

          //C - D + (D - A)/2          C - D                     (D - A)/ 2
          var scrollTop = inputMidpointOffsetToScrollBottom + scrollMidpointOffset;

          if ( scrollTop > 0) {
            if (ionic.Platform.isIOS()) ionic.tap.cloneFocusedInput(container, self);
            self.scrollBy(0, scrollTop, true);
            self.onScroll();
          }
        });
      }

      // Only the first scrollView parent of the element that broadcasted this event
      // (the active element that needs to be shown) should receive this event
      e.stopPropagation();
    };

    self.resetScrollView = function() {
      //return scrollview to original height once keyboard has hidden
      if ( self.isShrunkForKeyboard ) {
        self.isShrunkForKeyboard = false;
        container.style.height = "";
        container.style.overflow = "";
      }
      self.resize();
    };

    //Broadcasted when keyboard is shown on some platforms.
    //See js/utils/keyboard.js
    container.addEventListener('scrollChildIntoView', self.scrollChildIntoView);

    // Listen on document because container may not have had the last
    // keyboardActiveElement, for example after closing a modal with a focused
    // input and returning to a previously resized scroll view in an ion-content.
    // Since we can only resize scroll views that are currently visible, just resize
    // the current scroll view when the keyboard is closed.
    document.addEventListener('resetScrollView', self.resetScrollView);

    function getEventTouches(e) {
      return e.touches && e.touches.length ? e.touches : [{
        pageX: e.pageX,
        pageY: e.pageY
      }];
    }

    self.touchStart = function(e) {
      self.startCoordinates = ionic.tap.pointerCoord(e);

      if ( ionic.tap.ignoreScrollStart(e) ) {
        return;
      }

      self.__isDown = true;

      if ( ionic.tap.containsOrIsTextInput(e.target) || e.target.tagName === 'SELECT' ) {
        // do not start if the target is a text input
        // if there is a touchmove on this input, then we can start the scroll
        self.__hasStarted = false;
        return;
      }

      self.__isSelectable = true;
      self.__enableScrollY = true;
      self.__hasStarted = true;
      self.doTouchStart(getEventTouches(e), e.timeStamp);
      e.preventDefault();
    };

    self.touchMove = function(e) {
      if (self.options.freeze || !self.__isDown ||
        (!self.__isDown && e.defaultPrevented) ||
        (e.target.tagName === 'TEXTAREA' && e.target.parentElement.querySelector(':focus')) ) {
        return;
      }

      if ( !self.__hasStarted && ( ionic.tap.containsOrIsTextInput(e.target) || e.target.tagName === 'SELECT' ) ) {
        // the target is a text input and scroll has started
        // since the text input doesn't start on touchStart, do it here
        self.__hasStarted = true;
        self.doTouchStart(getEventTouches(e), e.timeStamp);
        e.preventDefault();
        return;
      }

      if (self.startCoordinates) {
        // we have start coordinates, so get this touch move's current coordinates
        var currentCoordinates = ionic.tap.pointerCoord(e);

        if ( self.__isSelectable &&
            ionic.tap.isTextInput(e.target) &&
            Math.abs(self.startCoordinates.x - currentCoordinates.x) > 20 ) {
          // user slid the text input's caret on its x axis, disable any future y scrolling
          self.__enableScrollY = false;
          self.__isSelectable = true;
        }

        if ( self.__enableScrollY && Math.abs(self.startCoordinates.y - currentCoordinates.y) > 10 ) {
          // user scrolled the entire view on the y axis
          // disabled being able to select text on an input
          // hide the input which has focus, and show a cloned one that doesn't have focus
          self.__isSelectable = false;
          ionic.tap.cloneFocusedInput(container, self);
        }
      }

      self.doTouchMove(getEventTouches(e), e.timeStamp, e.scale);
      self.__isDown = true;
    };

    self.touchMoveBubble = function(e) {
      if(self.__isDown && self.options.preventDefault) {
        e.preventDefault();
      }
    };

    self.touchEnd = function(e) {
      if (!self.__isDown) return;

      self.doTouchEnd(e, e.timeStamp);
      self.__isDown = false;
      self.__hasStarted = false;
      self.__isSelectable = true;
      self.__enableScrollY = true;

      if ( !self.__isDragging && !self.__isDecelerating && !self.__isAnimating ) {
        ionic.tap.removeClonedInputs(container, self);
      }
    };

    self.mouseWheel = ionic.animationFrameThrottle(function(e) {
      var scrollParent = ionic.DomUtil.getParentOrSelfWithClass(e.target, 'ionic-scroll');
      if (!self.options.freeze && scrollParent === self.__container) {

        self.hintResize();
        self.scrollBy(
          (e.wheelDeltaX || e.deltaX || 0) / self.options.wheelDampen,
          (-e.wheelDeltaY || e.deltaY || 0) / self.options.wheelDampen
        );

        self.__fadeScrollbars('in');
        clearTimeout(self.__wheelHideBarTimeout);
        self.__wheelHideBarTimeout = setTimeout(function() {
          self.__fadeScrollbars('out');
        }, 100);
      }
    });

    if ('ontouchstart' in window) {
      // Touch Events
      container.addEventListener("touchstart", self.touchStart, false);
      if(self.options.preventDefault) container.addEventListener("touchmove", self.touchMoveBubble, false);
      document.addEventListener("touchmove", self.touchMove, false);
      document.addEventListener("touchend", self.touchEnd, false);
      document.addEventListener("touchcancel", self.touchEnd, false);
      document.addEventListener("wheel", self.mouseWheel, false);

    } else if (window.navigator.pointerEnabled) {
      // Pointer Events
      container.addEventListener("pointerdown", self.touchStart, false);
      if(self.options.preventDefault) container.addEventListener("pointermove", self.touchMoveBubble, false);
      document.addEventListener("pointermove", self.touchMove, false);
      document.addEventListener("pointerup", self.touchEnd, false);
      document.addEventListener("pointercancel", self.touchEnd, false);
      document.addEventListener("wheel", self.mouseWheel, false);

    } else if (window.navigator.msPointerEnabled) {
      // IE10, WP8 (Pointer Events)
      container.addEventListener("MSPointerDown", self.touchStart, false);
      if(self.options.preventDefault) container.addEventListener("MSPointerMove", self.touchMoveBubble, false);
      document.addEventListener("MSPointerMove", self.touchMove, false);
      document.addEventListener("MSPointerUp", self.touchEnd, false);
      document.addEventListener("MSPointerCancel", self.touchEnd, false);
      document.addEventListener("wheel", self.mouseWheel, false);

    } else {
      // Mouse Events
      var mousedown = false;

      self.mouseDown = function(e) {
        if ( ionic.tap.ignoreScrollStart(e) || e.target.tagName === 'SELECT' ) {
          return;
        }
        self.doTouchStart(getEventTouches(e), e.timeStamp);

        if ( !ionic.tap.isTextInput(e.target) ) {
          e.preventDefault();
        }
        mousedown = true;
      };

      self.mouseMove = function(e) {
        if (self.options.freeze || !mousedown || (!mousedown && e.defaultPrevented)) {
          return;
        }

        self.doTouchMove(getEventTouches(e), e.timeStamp);

        mousedown = true;
      };

      self.mouseMoveBubble = function(e) {
        if (mousedown && self.options.preventDefault) {
          e.preventDefault();
        }
      };

      self.mouseUp = function(e) {
        if (!mousedown) {
          return;
        }

        self.doTouchEnd(e, e.timeStamp);

        mousedown = false;
      };

      container.addEventListener("mousedown", self.mouseDown, false);
      if(self.options.preventDefault) container.addEventListener("mousemove", self.mouseMoveBubble, false);
      document.addEventListener("mousemove", self.mouseMove, false);
      document.addEventListener("mouseup", self.mouseUp, false);
      document.addEventListener('mousewheel', self.mouseWheel, false);
      document.addEventListener('wheel', self.mouseWheel, false);
    }
  },

  __cleanup: function() {
    var self = this;
    var container = self.__container;

    container.removeEventListener('touchstart', self.touchStart);
    container.removeEventListener('touchmove', self.touchMoveBubble);
    document.removeEventListener('touchmove', self.touchMove);
    document.removeEventListener('touchend', self.touchEnd);
    document.removeEventListener('touchcancel', self.touchEnd);

    container.removeEventListener("pointerdown", self.touchStart);
    container.removeEventListener("pointermove", self.touchMoveBubble);
    document.removeEventListener("pointermove", self.touchMove);
    document.removeEventListener("pointerup", self.touchEnd);
    document.removeEventListener("pointercancel", self.touchEnd);

    container.removeEventListener("MSPointerDown", self.touchStart);
    container.removeEventListener("MSPointerMove", self.touchMoveBubble);
    document.removeEventListener("MSPointerMove", self.touchMove);
    document.removeEventListener("MSPointerUp", self.touchEnd);
    document.removeEventListener("MSPointerCancel", self.touchEnd);

    container.removeEventListener("mousedown", self.mouseDown);
    container.removeEventListener("mousemove", self.mouseMoveBubble);
    document.removeEventListener("mousemove", self.mouseMove);
    document.removeEventListener("mouseup", self.mouseUp);
    document.removeEventListener('mousewheel', self.mouseWheel);
    document.removeEventListener('wheel', self.mouseWheel);

    container.removeEventListener('scrollChildIntoView', self.scrollChildIntoView);
    document.removeEventListener('resetScrollView', self.resetScrollView);

    ionic.tap.removeClonedInputs(container, self);

    delete self.__container;
    delete self.__content;
    delete self.__indicatorX;
    delete self.__indicatorY;
    delete self.options.el;

    self.__callback = self.scrollChildIntoView = self.resetScrollView = NOOP;

    self.mouseMove = self.mouseDown = self.mouseUp = self.mouseWheel =
      self.touchStart = self.touchMove = self.touchEnd = self.touchCancel = NOOP;

    self.resize = self.scrollTo = self.zoomTo =
      self.__scrollingComplete = NOOP;
    container = null;
  },

  /** Create a scroll bar div with the given direction **/
  __createScrollbar: function(direction) {
    var bar = document.createElement('div'),
      indicator = document.createElement('div');

    indicator.className = 'scroll-bar-indicator scroll-bar-fade-out';

    if (direction == 'h') {
      bar.className = 'scroll-bar scroll-bar-h';
    } else {
      bar.className = 'scroll-bar scroll-bar-v';
    }

    bar.appendChild(indicator);
    return bar;
  },

  __createScrollbars: function() {
    var self = this;
    var indicatorX, indicatorY;

    if (self.options.scrollingX) {
      indicatorX = {
        el: self.__createScrollbar('h'),
        sizeRatio: 1
      };
      indicatorX.indicator = indicatorX.el.children[0];

      if (self.options.scrollbarX) {
        self.__container.appendChild(indicatorX.el);
      }
      self.__indicatorX = indicatorX;
    }

    if (self.options.scrollingY) {
      indicatorY = {
        el: self.__createScrollbar('v'),
        sizeRatio: 1
      };
      indicatorY.indicator = indicatorY.el.children[0];

      if (self.options.scrollbarY) {
        self.__container.appendChild(indicatorY.el);
      }
      self.__indicatorY = indicatorY;
    }
  },

  __resizeScrollbars: function() {
    var self = this;

    // Update horiz bar
    if (self.__indicatorX) {
      var width = Math.max(Math.round(self.__clientWidth * self.__clientWidth / (self.__contentWidth)), 20);
      if (width > self.__contentWidth) {
        width = 0;
      }
      if (width !== self.__indicatorX.size) {
        ionic.requestAnimationFrame(function(){
          self.__indicatorX.indicator.style.width = width + 'px';
        });
      }
      self.__indicatorX.size = width;
      self.__indicatorX.minScale = self.options.minScrollbarSizeX / width;
      self.__indicatorX.maxPos = self.__clientWidth - width;
      self.__indicatorX.sizeRatio = self.__maxScrollLeft ? self.__indicatorX.maxPos / self.__maxScrollLeft : 1;
    }

    // Update vert bar
    if (self.__indicatorY) {
      var height = Math.max(Math.round(self.__clientHeight * self.__clientHeight / (self.__contentHeight)), 20);
      if (height > self.__contentHeight) {
        height = 0;
      }
      if (height !== self.__indicatorY.size) {
        ionic.requestAnimationFrame(function(){
          self.__indicatorY && (self.__indicatorY.indicator.style.height = height + 'px');
        });
      }
      self.__indicatorY.size = height;
      self.__indicatorY.minScale = self.options.minScrollbarSizeY / height;
      self.__indicatorY.maxPos = self.__clientHeight - height;
      self.__indicatorY.sizeRatio = self.__maxScrollTop ? self.__indicatorY.maxPos / self.__maxScrollTop : 1;
    }
  },

  /**
   * Move and scale the scrollbars as the page scrolls.
   */
  __repositionScrollbars: function() {
    var self = this,
        heightScale, widthScale,
        widthDiff, heightDiff,
        x, y,
        xstop = 0, ystop = 0;

    if (self.__indicatorX) {
      // Handle the X scrollbar

      // Don't go all the way to the right if we have a vertical scrollbar as well
      if (self.__indicatorY) xstop = 10;

      x = Math.round(self.__indicatorX.sizeRatio * self.__scrollLeft) || 0;

      // The the difference between the last content X position, and our overscrolled one
      widthDiff = self.__scrollLeft - (self.__maxScrollLeft - xstop);

      if (self.__scrollLeft < 0) {

        widthScale = Math.max(self.__indicatorX.minScale,
            (self.__indicatorX.size - Math.abs(self.__scrollLeft)) / self.__indicatorX.size);

        // Stay at left
        x = 0;

        // Make sure scale is transformed from the left/center origin point
        self.__indicatorX.indicator.style[self.__transformOriginProperty] = 'left center';
      } else if (widthDiff > 0) {

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

      var translate3dX = 'translate3d(' + x + 'px, 0, 0) scaleX(' + widthScale + ')';
      if (self.__indicatorX.transformProp !== translate3dX) {
        self.__indicatorX.indicator.style[self.__transformProperty] = translate3dX;
        self.__indicatorX.transformProp = translate3dX;
      }
    }

    if (self.__indicatorY) {

      y = Math.round(self.__indicatorY.sizeRatio * self.__scrollTop) || 0;

      // Don't go all the way to the right if we have a vertical scrollbar as well
      if (self.__indicatorX) ystop = 10;

      heightDiff = self.__scrollTop - (self.__maxScrollTop - ystop);

      if (self.__scrollTop < 0) {

        heightScale = Math.max(self.__indicatorY.minScale, (self.__indicatorY.size - Math.abs(self.__scrollTop)) / self.__indicatorY.size);

        // Stay at top
        y = 0;

        // Make sure scale is transformed from the center/top origin point
        if (self.__indicatorY.originProp !== 'center top') {
          self.__indicatorY.indicator.style[self.__transformOriginProperty] = 'center top';
          self.__indicatorY.originProp = 'center top';
        }

      } else if (heightDiff > 0) {

        heightScale = Math.max(self.__indicatorY.minScale, (self.__indicatorY.size - heightDiff) / self.__indicatorY.size);

        // Stay at bottom of scrollable viewport
        y = self.__indicatorY.maxPos - ystop;

        // Make sure scale is transformed from the center/bottom origin point
        if (self.__indicatorY.originProp !== 'center bottom') {
          self.__indicatorY.indicator.style[self.__transformOriginProperty] = 'center bottom';
          self.__indicatorY.originProp = 'center bottom';
        }

      } else {

        // Normal motion
        y = Math.min(self.__maxScrollTop, Math.max(0, y));
        heightScale = 1;

      }

      var translate3dY = 'translate3d(0,' + y + 'px, 0) scaleY(' + heightScale + ')';
      if (self.__indicatorY.transformProp !== translate3dY) {
        self.__indicatorY.indicator.style[self.__transformProperty] = translate3dY;
        self.__indicatorY.transformProp = translate3dY;
      }
    }
  },

  __fadeScrollbars: function(direction, delay) {
    var self = this;

    if (!self.options.scrollbarsFade) {
      return;
    }

    var className = 'scroll-bar-fade-out';

    if (self.options.scrollbarsFade === true) {
      clearTimeout(self.__scrollbarFadeTimeout);

      if (direction == 'in') {
        if (self.__indicatorX) { self.__indicatorX.indicator.classList.remove(className); }
        if (self.__indicatorY) { self.__indicatorY.indicator.classList.remove(className); }
      } else {
        self.__scrollbarFadeTimeout = setTimeout(function() {
          if (self.__indicatorX) { self.__indicatorX.indicator.classList.add(className); }
          if (self.__indicatorY) { self.__indicatorY.indicator.classList.add(className); }
        }, delay || self.options.scrollbarFadeDelay);
      }
    }
  },

  __scrollingComplete: function() {
    this.options.scrollingComplete();
    ionic.tap.removeClonedInputs(this.__container, this);
    this.__fadeScrollbars('out');
  },

  resize: function(continueScrolling) {
    var self = this;
    if (!self.__container || !self.options) return;

    // Update Scroller dimensions for changed content
    // Add padding to bottom of content
    self.setDimensions(
      self.__container.clientWidth,
      self.__container.clientHeight,
      self.options.getContentWidth(),
      self.options.getContentHeight(),
      continueScrolling
    );
  },
  /*
  ---------------------------------------------------------------------------
    PUBLIC API
  ---------------------------------------------------------------------------
  */

  getRenderFn: function() {
    var self = this;

    var content = self.__content;

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

      return function(left, top, zoom, wasResize) {
        var translate3d = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
        if (translate3d !== self.contentTransform) {
          content.style[transformProperty] = translate3d;
          self.contentTransform = translate3d;
        }
        self.__repositionScrollbars();
        if (!wasResize) {
          self.triggerScrollEvent();
        }
      };

    } else if (helperElem.style[transformProperty] !== undef) {

      return function(left, top, zoom, wasResize) {
        content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
        self.__repositionScrollbars();
        if (!wasResize) {
          self.triggerScrollEvent();
        }
      };

    } else {

      return function(left, top, zoom, wasResize) {
        content.style.marginLeft = left ? (-left / zoom) + 'px' : '';
        content.style.marginTop = top ? (-top / zoom) + 'px' : '';
        content.style.zoom = zoom || '';
        self.__repositionScrollbars();
        if (!wasResize) {
          self.triggerScrollEvent();
        }
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
  setDimensions: function(clientWidth, clientHeight, contentWidth, contentHeight, continueScrolling) {
    var self = this;

    if (!clientWidth && !clientHeight && !contentWidth && !contentHeight) {
      // this scrollview isn't rendered, don't bother
      return;
    }

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
    if (!continueScrolling) {
      self.scrollTo(self.__scrollLeft, self.__scrollTop, true, null, true);
    }

  },


  /**
   * Sets the client coordinates in relation to the document.
   *
   * @param left {Integer} Left position of outer element
   * @param top {Integer} Top position of outer element
   */
  setPosition: function(left, top) {
    this.__clientLeft = left || 0;
    this.__clientTop = top || 0;
  },


  /**
   * Configures the snapping (when snapping is active)
   *
   * @param width {Integer} Snapping width
   * @param height {Integer} Snapping height
   */
  setSnapSize: function(width, height) {
    this.__snapWidth = width;
    this.__snapHeight = height;
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
   * @param showCallback {Function} Callback to execute when the refresher should be shown. This is for showing the refresher during a negative scrollTop.
   * @param hideCallback {Function} Callback to execute when the refresher should be hidden. This is for hiding the refresher when it's behind the nav bar.
   * @param tailCallback {Function} Callback to execute just before the refresher returns to it's original state. This is for zooming out the refresher.
   * @param pullProgressCallback Callback to state the progress while pulling to refresh
   */
  activatePullToRefresh: function(height, refresherMethods) {
    var self = this;

    self.__refreshHeight = height;
    self.__refreshActivate = function() { ionic.requestAnimationFrame(refresherMethods.activate); };
    self.__refreshDeactivate = function() { ionic.requestAnimationFrame(refresherMethods.deactivate); };
    self.__refreshStart = function() { ionic.requestAnimationFrame(refresherMethods.start); };
    self.__refreshShow = function() { ionic.requestAnimationFrame(refresherMethods.show); };
    self.__refreshHide = function() { ionic.requestAnimationFrame(refresherMethods.hide); };
    self.__refreshTail = function() { ionic.requestAnimationFrame(refresherMethods.tail); };
    self.__refreshTailTime = 100;
    self.__minSpinTime = 600;
  },


  /**
   * Starts pull-to-refresh manually.
   */
  triggerPullToRefresh: function() {
    // Use publish instead of scrollTo to allow scrolling to out of boundary position
    // We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
    this.__publish(this.__scrollLeft, -this.__refreshHeight, this.__zoomLevel, true);

    var d = new Date();
    this.refreshStartTime = d.getTime();

    if (this.__refreshStart) {
      this.__refreshStart();
    }
  },


  /**
   * Signalizes that pull-to-refresh is finished.
   */
  finishPullToRefresh: function() {
    var self = this;
    // delay to make sure the spinner has a chance to spin for a split second before it's dismissed
    var d = new Date();
    var delay = 0;
    if (self.refreshStartTime + self.__minSpinTime > d.getTime()) {
      delay = self.refreshStartTime + self.__minSpinTime - d.getTime();
    }
    setTimeout(function() {
      if (self.__refreshTail) {
        self.__refreshTail();
      }
      setTimeout(function() {
        self.__refreshActive = false;
        if (self.__refreshDeactivate) {
          self.__refreshDeactivate();
        }
        if (self.__refreshHide) {
          self.__refreshHide();
        }

        self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
      }, self.__refreshTailTime);
    }, delay);
  },


  /**
   * Returns the scroll position and zooming values
   *
   * @return {Map} `left` and `top` scroll position and `zoom` level
   */
  getValues: function() {
    return {
      left: this.__scrollLeft,
      top: this.__scrollTop,
      zoom: this.__zoomLevel
    };
  },


  /**
   * Returns the maximum scroll values
   *
   * @return {Map} `left` and `top` maximum scroll values
   */
  getScrollMax: function() {
    return {
      left: this.__maxScrollLeft,
      top: this.__maxScrollTop
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
      zyngaCore.effect.Animate.stop(self.__isDecelerating);
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
    this.zoomTo(this.__zoomLevel * factor, animate, originLeft, originTop);
  },


  /**
   * Scrolls to the given position. Respect limitations and snapping automatically.
   *
   * @param left {Number} Horizontal scroll position, keeps current if value is <code>null</code>
   * @param top {Number} Vertical scroll position, keeps current if value is <code>null</code>
   * @param animate {Boolean} Whether the scrolling should happen using an animation
   * @param zoom {Number} Zoom level to go to
   */
  scrollTo: function(left, top, animate, zoom, wasResize) {
    var self = this;

    // Stop deceleration
    if (self.__isDecelerating) {
      zyngaCore.effect.Animate.stop(self.__isDecelerating);
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
    self.__publish(left, top, zoom, animate, wasResize);

  },


  /**
   * Scroll by the given offset
   *
   * @param left {Number} Scroll x-axis by given offset
   * @param top {Number} Scroll y-axis by given offset
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
    var change = wheelDelta > 0 ? 0.97 : 1.03;
    return this.zoomTo(this.__zoomLevel * change, false, pageX - this.__clientLeft, pageY - this.__clientTop);
  },

  /**
   * Touch start handler for scrolling support
   */
  doTouchStart: function(touches, timeStamp) {
    var self = this;

    // remember if the deceleration was just stopped
    self.__decStopped = !!(self.__isDecelerating || self.__isAnimating);

    self.hintResize();

    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }
    if (typeof timeStamp !== "number") {
      timeStamp = Date.now();
    }

    // Reset interruptedAnimation flag
    self.__interruptedAnimation = true;

    // Stop deceleration
    if (self.__isDecelerating) {
      zyngaCore.effect.Animate.stop(self.__isDecelerating);
      self.__isDecelerating = false;
      self.__interruptedAnimation = true;
    }

    // Stop animation
    if (self.__isAnimating) {
      zyngaCore.effect.Animate.stop(self.__isAnimating);
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

    // Store initial touchList for scale calculation
    self.__initialTouches = touches;

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
    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }
    if (typeof timeStamp !== "number") {
      timeStamp = Date.now();
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

      // Calculate scale when not present and only when touches are used
      if (!scale && self.options.zooming) {
        scale = self.__getScale(self.__initialTouches, touches);
      }
    } else {
      currentTouchLeft = touches[0].pageX;
      currentTouchTop = touches[0].pageY;
    }

    var positions = self.__positions;

    // Are we already is dragging mode?
    if (self.__isDragging) {
        self.__decStopped = false;

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

        scrollLeft -= moveX * self.options.speedMultiplier;
        var maxScrollLeft = self.__maxScrollLeft;

        if (scrollLeft > maxScrollLeft || scrollLeft < 0) {

          // Slow down on the edges
          if (self.options.bouncing) {

            scrollLeft += (moveX / 2 * self.options.speedMultiplier);

          } else if (scrollLeft > maxScrollLeft) {

            scrollLeft = maxScrollLeft;

          } else {

            scrollLeft = 0;

          }
        }
      }

      // Compute new vertical scroll position
      if (self.__enableScrollY) {

        scrollTop -= moveY * self.options.speedMultiplier;
        var maxScrollTop = self.__maxScrollTop;

        if (scrollTop > maxScrollTop || scrollTop < 0) {

          // Slow down on the edges
          if (self.options.bouncing || (self.__refreshHeight && scrollTop < 0)) {

            scrollTop += (moveY / 2 * self.options.speedMultiplier);

            // Support pull-to-refresh (only when only y is scrollable)
            if (!self.__enableScrollX && self.__refreshHeight != null) {

              // hide the refresher when it's behind the header bar in case of header transparency
              if (scrollTop < 0) {
                self.__refreshHidden = false;
                self.__refreshShow();
              } else {
                self.__refreshHide();
                self.__refreshHidden = true;
              }

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
        } else if (self.__refreshHeight && !self.__refreshHidden) {
          // if a positive scroll value and the refresher is still not hidden, hide it
          self.__refreshHide();
          self.__refreshHidden = true;
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
  doTouchEnd: function(e, timeStamp) {
    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }
    if (typeof timeStamp !== "number") {
      timeStamp = Date.now();
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
          var minVelocityToStartDeceleration = self.options.paging || self.options.snapping ? self.options.decelVelocityThresholdPaging : self.options.decelVelocityThreshold;

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

    } else if (self.__decStopped) {
      // the deceleration was stopped
      // user flicked the scroll fast, and stop dragging, then did a touchstart to stop the srolling
      // tell the touchend event code to do nothing, we don't want to actually send a click
      e.isTapHandled = true;
      self.__decStopped = false;
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

        var d = new Date();
        self.refreshStartTime = d.getTime();

        if (self.__refreshStart) {
          self.__refreshStart();
        }
        // for iOS-ey style scrolling
        if (!ionic.Platform.isAndroid())self.__startDeceleration();
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
  __publish: function(left, top, zoom, animate, wasResize) {

    var self = this;

    // Remember whether we had an animation, then we try to continue based on the current "drive" of the animation
    var wasAnimating = self.__isAnimating;
    if (wasAnimating) {
      zyngaCore.effect.Animate.stop(wasAnimating);
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
            self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel, wasResize);
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
      self.__isAnimating = zyngaCore.effect.Animate.start(step, verify, completed, self.options.animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic);

    } else {

      self.__scheduledLeft = self.__scrollLeft = left;
      self.__scheduledTop = self.__scrollTop = top;
      self.__scheduledZoom = self.__zoomLevel = zoom;

      // Push values out
      if (self.__callback) {
        self.__callback(left, top, zoom, wasResize);
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

    if (!self.__didWaitForSize && !self.__maxScrollLeft && !self.__maxScrollTop) {
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
      self.resize(true);
    };

    sizer();
    self.__sizerTimeout = setTimeout(sizer, 500);
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
  __startDeceleration: function() {
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
      if (self.__refreshActive) self.__minDecelerationScrollTop = self.__refreshHeight * -1;
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

        //Make sure the scroll values are within the boundaries after a bounce,
        //not below 0 or above maximum
        if (self.options.bouncing && !self.__refreshActive) {
          self.scrollTo(
            Math.min( Math.max(self.__scrollLeft, 0), self.__maxScrollLeft ),
            Math.min( Math.max(self.__scrollTop, 0), self.__maxScrollTop ),
            self.__refreshActive
          );
        }
      }
      return shouldContinue;
    };

    var completed = function() {
      self.__isDecelerating = false;
      if (self.__didDecelerationComplete) {
        self.__scrollingComplete();
      }

      // Animate to grid when snapping is active, otherwise just fix out-of-boundary positions
      if (self.options.paging) {
        self.scrollTo(self.__scrollLeft, self.__scrollTop, self.options.snapping);
      }
    };

    // Start animation and switch on flag
    self.__isDecelerating = zyngaCore.effect.Animate.start(step, verify, completed);

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
    var scrollLeft = self.__scrollLeft + self.__decelerationVelocityX;// * self.options.deceleration);
    var scrollTop = self.__scrollTop + self.__decelerationVelocityY;// * self.options.deceleration);


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
      var frictionFactor = self.options.deceleration;

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
  },


  /**
   * calculate the distance between two touches
   * @param   {Touch}     touch1
   * @param   {Touch}     touch2
   * @returns {Number}    distance
   */
  __getDistance: function getDistance(touch1, touch2) {
    var x = touch2.pageX - touch1.pageX,
    y = touch2.pageY - touch1.pageY;
    return Math.sqrt((x * x) + (y * y));
  },


  /**
   * calculate the scale factor between two touchLists (fingers)
   * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
   * @param   {Array}     start
   * @param   {Array}     end
   * @returns {Number}    scale
   */
  __getScale: function getScale(start, end) {
    // need two fingers...
    if (start.length >= 2 && end.length >= 2) {
      return this.__getDistance(end[0], end[1]) /
        this.__getDistance(start[0], start[1]);
    }
    return 1;
  }
});

ionic.scroll = {
  isScrolling: false,
  lastTop: 0
};

})(ionic);

(function(ionic) {
  var NOOP = function() {};
  var deprecated = function(name) {
    void 0;
  };
  ionic.views.ScrollNative = ionic.views.View.inherit({

    initialize: function(options) {
      var self = this;
      self.__container = self.el = options.el;
      self.__content = options.el.firstElementChild;
      // Whether scrolling is frozen or not
      self.__frozen = false;
      self.isNative = true;

      self.__scrollTop = self.el.scrollTop;
      self.__scrollLeft = self.el.scrollLeft;
      self.__clientHeight = self.__content.clientHeight;
      self.__clientWidth = self.__content.clientWidth;
      self.__maxScrollTop = Math.max((self.__contentHeight) - self.__clientHeight, 0);
      self.__maxScrollLeft = Math.max((self.__contentWidth) - self.__clientWidth, 0);

      if(options.startY >= 0 || options.startX >= 0) {
        ionic.requestAnimationFrame(function() {
          self.el.scrollTop = options.startY || 0;
          self.el.scrollLeft = options.startX || 0;

          self.__scrollTop = self.el.scrollTop;
          self.__scrollLeft = self.el.scrollLeft;
        });
      }

      self.options = {

        freeze: false,

        getContentWidth: function() {
          return Math.max(self.__content.scrollWidth, self.__content.offsetWidth);
        },

        getContentHeight: function() {
          return Math.max(self.__content.scrollHeight, self.__content.offsetHeight + (self.__content.offsetTop * 2));
        }

      };

      for (var key in options) {
        self.options[key] = options[key];
      }

      /**
       * Sets isScrolling to true, and automatically deactivates if not called again in 80ms.
       */
      self.onScroll = function() {
        if (!ionic.scroll.isScrolling) {
          ionic.scroll.isScrolling = true;
        }

        clearTimeout(self.scrollTimer);
        self.scrollTimer = setTimeout(function() {
          ionic.scroll.isScrolling = false;
        }, 80);
      };

      self.freeze = function(shouldFreeze) {
        self.__frozen = shouldFreeze;
      };
      // A more powerful freeze pop that dominates all other freeze pops
      self.freezeShut = function(shouldFreezeShut) {
        self.__frozenShut = shouldFreezeShut;
      };

      self.__initEventHandlers();
    },

    /**  Methods not used in native scrolling */
    __callback: function() { deprecated('__callback'); },
    zoomTo: function() { deprecated('zoomTo'); },
    zoomBy: function() { deprecated('zoomBy'); },
    activatePullToRefresh: function() { deprecated('activatePullToRefresh'); },

    /**
     * Returns the scroll position and zooming values
     *
     * @return {Map} `left` and `top` scroll position and `zoom` level
     */
    resize: function(continueScrolling) {
      var self = this;
      if (!self.__container || !self.options) return;

      // Update Scroller dimensions for changed content
      // Add padding to bottom of content
      self.setDimensions(
        self.__container.clientWidth,
        self.__container.clientHeight,
        self.options.getContentWidth(),
        self.options.getContentHeight(),
        continueScrolling
      );
    },

    /**
     * Initialize the scrollview
     * In native scrolling, this only means we need to gather size information
     */
    run: function() {
      this.resize();
    },

    /**
     * Returns the scroll position and zooming values
     *
     * @return {Map} `left` and `top` scroll position and `zoom` level
     */
    getValues: function() {
      var self = this;
      self.update();
      return {
        left: self.__scrollLeft,
        top: self.__scrollTop,
        zoom: 1
      };
    },

    /**
     * Updates the __scrollLeft and __scrollTop values to el's current value
     */
    update: function() {
      var self = this;
      self.__scrollLeft = self.el.scrollLeft;
      self.__scrollTop = self.el.scrollTop;
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

      if (!clientWidth && !clientHeight && !contentWidth && !contentHeight) {
        // this scrollview isn't rendered, don't bother
        return;
      }

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
    },

    /**
     * Returns the maximum scroll values
     *
     * @return {Map} `left` and `top` maximum scroll values
     */
    getScrollMax: function() {
      return {
        left: this.__maxScrollLeft,
        top: this.__maxScrollTop
      };
    },

    /**
     * Scrolls by the given amount in px.
     *
     * @param left {Number} Horizontal scroll position, keeps current if value is <code>null</code>
     * @param top {Number} Vertical scroll position, keeps current if value is <code>null</code>
     * @param animate {Boolean} Whether the scrolling should happen using an animation
     */

    scrollBy: function(left, top, animate) {
      var self = this;

      // update scroll vars before refferencing them
      self.update();

      var startLeft = self.__isAnimating ? self.__scheduledLeft : self.__scrollLeft;
      var startTop = self.__isAnimating ? self.__scheduledTop : self.__scrollTop;

      self.scrollTo(startLeft + (left || 0), startTop + (top || 0), animate);
    },

    /**
     * Scrolls to the given position in px.
     *
     * @param left {Number} Horizontal scroll position, keeps current if value is <code>null</code>
     * @param top {Number} Vertical scroll position, keeps current if value is <code>null</code>
     * @param animate {Boolean} Whether the scrolling should happen using an animation
     */
    scrollTo: function(left, top, animate) {
      var self = this;
      if (!animate) {
        self.el.scrollTop = top;
        self.el.scrollLeft = left;
        self.resize();
        return;
      }

      var oldOverflowX = self.el.style.overflowX;
      var oldOverflowY = self.el.style.overflowY;

      clearTimeout(self.__scrollToCleanupTimeout);
      self.__scrollToCleanupTimeout = setTimeout(function() {
        self.el.style.overflowX = oldOverflowX;
        self.el.style.overflowY = oldOverflowY;
      }, 500);

      self.el.style.overflowY = 'hidden';
      self.el.style.overflowX = 'hidden';

      animateScroll(top, left);

      function animateScroll(Y, X) {
        // scroll animation loop w/ easing
        // credit https://gist.github.com/dezinezync/5487119
        var start = Date.now(),
          duration = 250, //milliseconds
          fromY = self.el.scrollTop,
          fromX = self.el.scrollLeft;

        if (fromY === Y && fromX === X) {
          self.el.style.overflowX = oldOverflowX;
          self.el.style.overflowY = oldOverflowY;
          self.resize();
          return; /* Prevent scrolling to the Y point if already there */
        }

        // decelerating to zero velocity
        function easeOutCubic(t) {
          return (--t) * t * t + 1;
        }

        // scroll loop
        function animateScrollStep() {
          var currentTime = Date.now(),
            time = Math.min(1, ((currentTime - start) / duration)),
          // where .5 would be 50% of time on a linear scale easedT gives a
          // fraction based on the easing method
            easedT = easeOutCubic(time);

          if (fromY != Y) {
            self.el.scrollTop = parseInt((easedT * (Y - fromY)) + fromY, 10);
          }
          if (fromX != X) {
            self.el.scrollLeft = parseInt((easedT * (X - fromX)) + fromX, 10);
          }

          if (time < 1) {
            ionic.requestAnimationFrame(animateScrollStep);

          } else {
            // done
            ionic.tap.removeClonedInputs(self.__container, self);
            self.el.style.overflowX = oldOverflowX;
            self.el.style.overflowY = oldOverflowY;
            self.resize();
          }
        }

        // start scroll loop
        ionic.requestAnimationFrame(animateScrollStep);
      }
    },



    /*
     ---------------------------------------------------------------------------
     PRIVATE API
     ---------------------------------------------------------------------------
     */

    /**
     * If the scroll view isn't sized correctly on start, wait until we have at least some size
     */
    __waitForSize: function() {
      var self = this;

      clearTimeout(self.__sizerTimeout);

      var sizer = function() {
        self.resize(true);
      };

      sizer();
      self.__sizerTimeout = setTimeout(sizer, 500);
    },


    /**
     * Recomputes scroll minimum values based on client dimensions and content dimensions.
     */
    __computeScrollMax: function() {
      var self = this;

      self.__maxScrollLeft = Math.max((self.__contentWidth) - self.__clientWidth, 0);
      self.__maxScrollTop = Math.max((self.__contentHeight) - self.__clientHeight, 0);

      if (!self.__didWaitForSize && !self.__maxScrollLeft && !self.__maxScrollTop) {
        self.__didWaitForSize = true;
        self.__waitForSize();
      }
    },

    __initEventHandlers: function() {
      var self = this;

      // Event Handler
      var container = self.__container;
      // save height when scroll view is shrunk so we don't need to reflow
      var scrollViewOffsetHeight;

      var lastKeyboardHeight;

      /**
       * Shrink the scroll view when the keyboard is up if necessary and if the
       * focused input is below the bottom of the shrunk scroll view, scroll it
       * into view.
       */
      self.scrollChildIntoView = function(e) {
        var rect = container.getBoundingClientRect();
        if(!self.__originalContainerHeight) {
          self.__originalContainerHeight = rect.height;
        }

        // D
        //var scrollBottomOffsetToTop = rect.bottom;
        // D - A
        scrollViewOffsetHeight = self.__originalContainerHeight;
        //console.log('Scroll view offset height', scrollViewOffsetHeight);
        //console.dir(container);
        var alreadyShrunk = self.isShrunkForKeyboard;

        var isModal = container.parentNode.classList.contains('modal');
        var isPopover = container.parentNode.classList.contains('popover');
        // 680px is when the media query for 60% modal width kicks in
        var isInsetModal = isModal && window.innerWidth >= 680;

       /*
        *  _______
        * |---A---| <- top of scroll view
        * |       |
        * |---B---| <- keyboard
        * |   C   | <- input
        * |---D---| <- initial bottom of scroll view
        * |___E___| <- bottom of viewport
        *
        *  All commented calculations relative to the top of the viewport (ie E
        *  is the viewport height, not 0)
        */


        var changedKeyboardHeight = lastKeyboardHeight && (lastKeyboardHeight !== e.detail.keyboardHeight);

        if (!alreadyShrunk || changedKeyboardHeight) {
          // shrink scrollview so we can actually scroll if the input is hidden
          // if it isn't shrink so we can scroll to inputs under the keyboard
          // inset modals won't shrink on Android on their own when the keyboard appears
          if ( !isPopover && (ionic.Platform.isIOS() || ionic.Platform.isFullScreen || isInsetModal) ) {
            // if there are things below the scroll view account for them and
            // subtract them from the keyboard height when resizing
            // E - D                         E                         D
            //var scrollBottomOffsetToBottom = e.detail.viewportHeight - scrollBottomOffsetToTop;

            // 0 or D - B if D > B           E - B                     E - D
            //var keyboardOffset = e.detail.keyboardHeight - scrollBottomOffsetToBottom;

            ionic.requestAnimationFrame(function(){
              // D - A or B - A if D > B       D - A             max(0, D - B)
              scrollViewOffsetHeight = Math.max(0, Math.min(self.__originalContainerHeight, self.__originalContainerHeight - (e.detail.keyboardHeight - 43)));//keyboardOffset >= 0 ? scrollViewOffsetHeight - keyboardOffset : scrollViewOffsetHeight + keyboardOffset;

              //console.log('Old container height', self.__originalContainerHeight, 'New container height', scrollViewOffsetHeight, 'Keyboard height', e.detail.keyboardHeight);

              container.style.height = scrollViewOffsetHeight + "px";

              /*
              if (ionic.Platform.isIOS()) {
                // Force redraw to avoid disappearing content
                var disp = container.style.display;
                container.style.display = 'none';
                var trick = container.offsetHeight;
                container.style.display = disp;
              }
              */
              container.classList.add('keyboard-up');
              //update scroll view
              self.resize();
            });
          }

          self.isShrunkForKeyboard = true;
        }

        lastKeyboardHeight = e.detail.keyboardHeight;

        /*
         *  _______
         * |---A---| <- top of scroll view
         * |   *   | <- where we want to scroll to
         * |--B-D--| <- keyboard, bottom of scroll view
         * |   C   | <- input
         * |       |
         * |___E___| <- bottom of viewport
         *
         *  All commented calculations relative to the top of the viewport (ie E
         *  is the viewport height, not 0)
         */
        // if the element is positioned under the keyboard scroll it into view
        if (e.detail.isElementUnderKeyboard) {

          ionic.requestAnimationFrame(function(){
            var pos = ionic.DomUtil.getOffsetTop(e.detail.target);
            setTimeout(function() {
              if (ionic.Platform.isIOS()) {
                ionic.tap.cloneFocusedInput(container, self);
              }
              // Scroll the input into view, with a 100px buffer
              self.scrollTo(0, pos - (rect.top + 100), true);
              self.onScroll();
            }, 32);

            /*
            // update D if we shrunk
            if (self.isShrunkForKeyboard && !alreadyShrunk) {
              scrollBottomOffsetToTop = container.getBoundingClientRect().bottom;
              console.log('Scroll bottom', scrollBottomOffsetToTop);
            }

            // middle of the scrollview, this is where we want to scroll to
            // (D - A) / 2
            var scrollMidpointOffset = scrollViewOffsetHeight * 0.5;
            console.log('Midpoint', scrollMidpointOffset);
            //console.log("container.offsetHeight: " + scrollViewOffsetHeight);

            // middle of the input we want to scroll into view
            // C
            var inputMidpoint = ((e.detail.elementBottom + e.detail.elementTop) / 2);
            console.log('Input midpoint');

            // distance from middle of input to the bottom of the scroll view
            // C - D                                C               D
            var inputMidpointOffsetToScrollBottom = inputMidpoint - scrollBottomOffsetToTop;
            console.log('Input midpoint offset', inputMidpointOffsetToScrollBottom);

            //C - D + (D - A)/2          C - D                     (D - A)/ 2
            var scrollTop = inputMidpointOffsetToScrollBottom + scrollMidpointOffset;
            console.log('Scroll top', scrollTop);

            if ( scrollTop > 0) {
              if (ionic.Platform.isIOS()) {
                //just shrank scroll view, give it some breathing room before scrolling
                setTimeout(function(){
                  ionic.tap.cloneFocusedInput(container, self);
                  self.scrollBy(0, scrollTop, true);
                  self.onScroll();
                }, 32);
              } else {
                self.scrollBy(0, scrollTop, true);
                self.onScroll();
              }
            }
            */
          });
        }

        // Only the first scrollView parent of the element that broadcasted this event
        // (the active element that needs to be shown) should receive this event
        e.stopPropagation();
      };

      self.resetScrollView = function() {
        //return scrollview to original height once keyboard has hidden
        if (self.isShrunkForKeyboard) {
          self.isShrunkForKeyboard = false;
          container.style.height = "";

          /*
          if (ionic.Platform.isIOS()) {
            // Force redraw to avoid disappearing content
            var disp = container.style.display;
            container.style.display = 'none';
            var trick = container.offsetHeight;
            container.style.display = disp;
          }
          */

          self.__originalContainerHeight = container.getBoundingClientRect().height;

          if (ionic.Platform.isIOS()) {
            ionic.requestAnimationFrame(function() {
              container.classList.remove('keyboard-up');
            });
          }

        }
        self.resize();
      };

      self.handleTouchMove = function(e) {
        if (self.__frozenShut) {
          e.preventDefault();
          e.stopPropagation();
          return false;

        } else if ( self.__frozen ){
          e.preventDefault();
          // let it propagate so other events such as drag events can happen,
          // but don't let it actually scroll
          return false;
        }
        return true;
      };

      container.addEventListener('scroll', self.onScroll);

      //Broadcasted when keyboard is shown on some platforms.
      //See js/utils/keyboard.js
      container.addEventListener('scrollChildIntoView', self.scrollChildIntoView);

      container.addEventListener(ionic.EVENTS.touchstart, self.handleTouchMove);
      container.addEventListener(ionic.EVENTS.touchmove, self.handleTouchMove);

      // Listen on document because container may not have had the last
      // keyboardActiveElement, for example after closing a modal with a focused
      // input and returning to a previously resized scroll view in an ion-content.
      // Since we can only resize scroll views that are currently visible, just resize
      // the current scroll view when the keyboard is closed.
      document.addEventListener('resetScrollView', self.resetScrollView);
    },

    __cleanup: function() {
      var self = this;
      var container = self.__container;

      container.removeEventListener('resetScrollView', self.resetScrollView);
      container.removeEventListener('scroll', self.onScroll);

      container.removeEventListener('scrollChildIntoView', self.scrollChildIntoView);
      container.removeEventListener('resetScrollView', self.resetScrollView);

      container.removeEventListener(ionic.EVENTS.touchstart, self.handleTouchMove);
      container.removeEventListener(ionic.EVENTS.touchmove, self.handleTouchMove);

      ionic.tap.removeClonedInputs(container, self);

      delete self.__container;
      delete self.__content;
      delete self.__indicatorX;
      delete self.__indicatorY;
      delete self.options.el;

      self.resize = self.scrollTo = self.onScroll = self.resetScrollView = NOOP;
      self.scrollChildIntoView = NOOP;
      container = null;
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
    start: function(){},
    drag: function(){},
    end: function(){},
    isSameItem: function() {
      return false;
    }
  };

  var SlideDrag = function(opts) {
    this.dragThresholdX = opts.dragThresholdX || 10;
    this.el = opts.el;
    this.item = opts.item;
    this.canSwipe = opts.canSwipe;
  };

  SlideDrag.prototype = new DragOp();

  SlideDrag.prototype.start = function(e) {
    var content, buttons, offsetX, buttonsWidth;

    if (!this.canSwipe()) {
      return;
    }

    if (e.target.classList.contains(ITEM_CONTENT_CLASS)) {
      content = e.target;
    } else if (e.target.classList.contains(ITEM_CLASS)) {
      content = e.target.querySelector('.' + ITEM_CONTENT_CLASS);
    } else {
      content = ionic.DomUtil.getParentWithClass(e.target, ITEM_CONTENT_CLASS);
    }

    // If we don't have a content area as one of our children (or ourselves), skip
    if (!content) {
      return;
    }

    // Make sure we aren't animating as we slide
    content.classList.remove(ITEM_SLIDING_CLASS);

    // Grab the starting X point for the item (for example, so we can tell whether it is open or closed to start)
    offsetX = parseFloat(content.style[ionic.CSS.TRANSFORM].replace('translate3d(', '').split(',')[0]) || 0;

    // Grab the buttons
    buttons = content.parentNode.querySelector('.' + ITEM_OPTIONS_CLASS);
    if (!buttons) {
      return;
    }
    buttons.classList.remove('invisible');

    buttonsWidth = buttons.offsetWidth;

    this._currentDrag = {
      buttons: buttons,
      buttonsWidth: buttonsWidth,
      content: content,
      startOffsetX: offsetX
    };
  };

  /**
   * Check if this is the same item that was previously dragged.
   */
  SlideDrag.prototype.isSameItem = function(op) {
    if (op._lastDrag && this._currentDrag) {
      return this._currentDrag.content == op._lastDrag.content;
    }
    return false;
  };

  SlideDrag.prototype.clean = function(isInstant) {
    var lastDrag = this._lastDrag;

    if (!lastDrag || !lastDrag.content) return;

    lastDrag.content.style[ionic.CSS.TRANSITION] = '';
    lastDrag.content.style[ionic.CSS.TRANSFORM] = '';
    if (isInstant) {
      lastDrag.content.style[ionic.CSS.TRANSITION] = 'none';
      makeInvisible();
      ionic.requestAnimationFrame(function() {
        lastDrag.content.style[ionic.CSS.TRANSITION] = '';
      });
    } else {
      ionic.requestAnimationFrame(function() {
        setTimeout(makeInvisible, 250);
      });
    }
    function makeInvisible() {
      lastDrag.buttons && lastDrag.buttons.classList.add('invisible');
    }
  };

  SlideDrag.prototype.drag = ionic.animationFrameThrottle(function(e) {
    var buttonsWidth;

    // We really aren't dragging
    if (!this._currentDrag) {
      return;
    }

    // Check if we should start dragging. Check if we've dragged past the threshold,
    // or we are starting from the open state.
    if (!this._isDragging &&
        ((Math.abs(e.gesture.deltaX) > this.dragThresholdX) ||
        (Math.abs(this._currentDrag.startOffsetX) > 0))) {
      this._isDragging = true;
    }

    if (this._isDragging) {
      buttonsWidth = this._currentDrag.buttonsWidth;

      // Grab the new X point, capping it at zero
      var newX = Math.min(0, this._currentDrag.startOffsetX + e.gesture.deltaX);

      // If the new X position is past the buttons, we need to slow down the drag (rubber band style)
      if (newX < -buttonsWidth) {
        // Calculate the new X position, capped at the top of the buttons
        newX = Math.min(-buttonsWidth, -buttonsWidth + (((e.gesture.deltaX + buttonsWidth) * 0.4)));
      }

      this._currentDrag.content.$$ionicOptionsOpen = newX !== 0;

      this._currentDrag.content.style[ionic.CSS.TRANSFORM] = 'translate3d(' + newX + 'px, 0, 0)';
      this._currentDrag.content.style[ionic.CSS.TRANSITION] = 'none';
    }
  });

  SlideDrag.prototype.end = function(e, doneCallback) {
    var self = this;

    // There is no drag, just end immediately
    if (!self._currentDrag) {
      doneCallback && doneCallback();
      return;
    }

    // If we are currently dragging, we want to snap back into place
    // The final resting point X will be the width of the exposed buttons
    var restingPoint = -self._currentDrag.buttonsWidth;

    // Check if the drag didn't clear the buttons mid-point
    // and we aren't moving fast enough to swipe open
    if (e.gesture.deltaX > -(self._currentDrag.buttonsWidth / 2)) {

      // If we are going left but too slow, or going right, go back to resting
      if (e.gesture.direction == "left" && Math.abs(e.gesture.velocityX) < 0.3) {
        restingPoint = 0;

      } else if (e.gesture.direction == "right") {
        restingPoint = 0;
      }

    }

    ionic.requestAnimationFrame(function() {
      if (restingPoint === 0) {
        self._currentDrag.content.style[ionic.CSS.TRANSFORM] = '';
        var buttons = self._currentDrag.buttons;
        setTimeout(function() {
          buttons && buttons.classList.add('invisible');
        }, 250);
      } else {
        self._currentDrag.content.style[ionic.CSS.TRANSFORM] = 'translate3d(' + restingPoint + 'px,0,0)';
      }
      self._currentDrag.content.style[ionic.CSS.TRANSITION] = '';


      // Kill the current drag
      if (!self._lastDrag) {
        self._lastDrag = {};
      }
      ionic.extend(self._lastDrag, self._currentDrag);
      if (self._currentDrag) {
        self._currentDrag.buttons = null;
        self._currentDrag.content = null;
      }
      self._currentDrag = null;

      // We are done, notify caller
      doneCallback && doneCallback();
    });
  };

  var ReorderDrag = function(opts) {
    var self = this;

    self.dragThresholdY = opts.dragThresholdY || 0;
    self.onReorder = opts.onReorder;
    self.listEl = opts.listEl;
    self.el = self.item = opts.el;
    self.scrollEl = opts.scrollEl;
    self.scrollView = opts.scrollView;
    // Get the True Top of the list el http://www.quirksmode.org/js/findpos.html
    self.listElTrueTop = 0;
    if (self.listEl.offsetParent) {
      var obj = self.listEl;
      do {
        self.listElTrueTop += obj.offsetTop;
        obj = obj.offsetParent;
      } while (obj);
    }
  };

  ReorderDrag.prototype = new DragOp();

  ReorderDrag.prototype._moveElement = function(e) {
    var y = e.gesture.center.pageY +
      this.scrollView.getValues().top -
      (this._currentDrag.elementHeight / 2) -
      this.listElTrueTop;
    this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + y + 'px, 0)';
  };

  ReorderDrag.prototype.deregister = function() {
    this.listEl = this.el = this.scrollEl = this.scrollView = null;
  };

  ReorderDrag.prototype.start = function(e) {

    var startIndex = ionic.DomUtil.getChildIndex(this.el, this.el.nodeName.toLowerCase());
    var elementHeight = this.el.scrollHeight;
    var placeholder = this.el.cloneNode(true);

    placeholder.classList.add(ITEM_PLACEHOLDER_CLASS);

    this.el.parentNode.insertBefore(placeholder, this.el);
    this.el.classList.add(ITEM_REORDERING_CLASS);

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
    var self = this;
    if (!this._currentDrag) {
      return;
    }

    var scrollY = 0;
    var pageY = e.gesture.center.pageY;
    var offset = this.listElTrueTop;

    //If we have a scrollView, check scroll boundaries for dragged element and scroll if necessary
    if (this.scrollView) {

      var container = this.scrollView.__container;
      scrollY = this.scrollView.getValues().top;

      var containerTop = container.offsetTop;
      var pixelsPastTop = containerTop - pageY + this._currentDrag.elementHeight / 2;
      var pixelsPastBottom = pageY + this._currentDrag.elementHeight / 2 - containerTop - container.offsetHeight;

      if (e.gesture.deltaY < 0 && pixelsPastTop > 0 && scrollY > 0) {
        this.scrollView.scrollBy(null, -pixelsPastTop);
        //Trigger another drag so the scrolling keeps going
        ionic.requestAnimationFrame(function() {
          self.drag(e);
        });
      }
      if (e.gesture.deltaY > 0 && pixelsPastBottom > 0) {
        if (scrollY < this.scrollView.getScrollMax().top) {
          this.scrollView.scrollBy(null, pixelsPastBottom);
          //Trigger another drag so the scrolling keeps going
          ionic.requestAnimationFrame(function() {
            self.drag(e);
          });
        }
      }
    }

    // Check if we should start dragging. Check if we've dragged past the threshold,
    // or we are starting from the open state.
    if (!this._isDragging && Math.abs(e.gesture.deltaY) > this.dragThresholdY) {
      this._isDragging = true;
    }

    if (this._isDragging) {
      this._moveElement(e);

      this._currentDrag.currentY = scrollY + pageY - offset;

      // this._reorderItems();
    }
  });

  // When an item is dragged, we need to reorder any items for sorting purposes
  ReorderDrag.prototype._getReorderIndex = function() {
    var self = this;

    var siblings = Array.prototype.slice.call(self._currentDrag.placeholder.parentNode.children)
      .filter(function(el) {
        return el.nodeName === self.el.nodeName && el !== self.el;
      });

    var dragOffsetTop = self._currentDrag.currentY;
    var el;
    for (var i = 0, len = siblings.length; i < len; i++) {
      el = siblings[i];
      if (i === len - 1) {
        if (dragOffsetTop > el.offsetTop) {
          return i;
        }
      } else if (i === 0) {
        if (dragOffsetTop < el.offsetTop + el.offsetHeight) {
          return i;
        }
      } else if (dragOffsetTop > el.offsetTop - el.offsetHeight / 2 &&
                 dragOffsetTop < el.offsetTop + el.offsetHeight) {
        return i;
      }
    }
    return self._currentDrag.startIndex;
  };

  ReorderDrag.prototype.end = function(e, doneCallback) {
    if (!this._currentDrag) {
      doneCallback && doneCallback();
      return;
    }

    var placeholder = this._currentDrag.placeholder;
    var finalIndex = this._getReorderIndex();

    // Reposition the element
    this.el.classList.remove(ITEM_REORDERING_CLASS);
    this.el.style[ionic.CSS.TRANSFORM] = '';

    placeholder.parentNode.insertBefore(this.el, placeholder);
    placeholder.parentNode.removeChild(placeholder);

    this.onReorder && this.onReorder(this.el, this._currentDrag.startIndex, finalIndex);

    this._currentDrag = {
      placeholder: null,
      content: null
    };
    this._currentDrag = null;
    doneCallback && doneCallback();
  };



  /**
   * The ListView handles a list of items. It will process drag animations, edit mode,
   * and other operations that are common on mobile lists or table views.
   */
  ionic.views.ListView = ionic.views.View.inherit({
    initialize: function(opts) {
      var self = this;

      opts = ionic.extend({
        onReorder: function() {},
        virtualRemoveThreshold: -200,
        virtualAddThreshold: 200,
        canSwipe: function() {
          return true;
        }
      }, opts);

      ionic.extend(self, opts);

      if (!self.itemHeight && self.listEl) {
        self.itemHeight = self.listEl.children[0] && parseInt(self.listEl.children[0].style.height, 10);
      }

      self.onRefresh = opts.onRefresh || function() {};
      self.onRefreshOpening = opts.onRefreshOpening || function() {};
      self.onRefreshHolding = opts.onRefreshHolding || function() {};

      var gestureOpts = {};
      // don't prevent native scrolling
      if (ionic.DomUtil.getParentOrSelfWithClass(self.el, 'overflow-scroll')) {
        gestureOpts.prevent_default_directions = ['left', 'right'];
      }

      window.ionic.onGesture('release', function(e) {
        self._handleEndDrag(e);
      }, self.el, gestureOpts);

      window.ionic.onGesture('drag', function(e) {
        self._handleDrag(e);
      }, self.el, gestureOpts);
      // Start the drag states
      self._initDrag();
    },

    /**
     * Be sure to cleanup references.
     */
    deregister: function() {
      this.el = this.listEl = this.scrollEl = this.scrollView = null;

      // ensure no scrolls have been left frozen
      if (this.isScrollFreeze) {
        self.scrollView.freeze(false);
      }
    },

    /**
     * Called to tell the list to stop refreshing. This is useful
     * if you are refreshing the list and are done with refreshing.
     */
    stopRefreshing: function() {
      var refresher = this.el.querySelector('.list-refresher');
      refresher.style.height = '0';
    },

    /**
     * If we scrolled and have virtual mode enabled, compute the window
     * of active elements in order to figure out the viewport to render.
     */
    didScroll: function(e) {
      var self = this;

      if (self.isVirtual) {
        var itemHeight = self.itemHeight;

        // Grab the total height of the list
        var scrollHeight = e.target.scrollHeight;

        // Get the viewport height
        var viewportHeight = self.el.parentNode.offsetHeight;

        // High water is the pixel position of the first element to include (everything before
        // that will be removed)
        var highWater = Math.max(0, e.scrollTop + self.virtualRemoveThreshold);

        // Low water is the pixel position of the last element to include (everything after
        // that will be removed)
        var lowWater = Math.min(scrollHeight, Math.abs(e.scrollTop) + viewportHeight + self.virtualAddThreshold);

        // Get the first and last elements in the list based on how many can fit
        // between the pixel range of lowWater and highWater
        var first = parseInt(Math.abs(highWater / itemHeight), 10);
        var last = parseInt(Math.abs(lowWater / itemHeight), 10);

        // Get the items we need to remove
        self._virtualItemsToRemove = Array.prototype.slice.call(self.listEl.children, 0, first);

        self.renderViewport && self.renderViewport(highWater, lowWater, first, last);
      }
    },

    didStopScrolling: function() {
      if (this.isVirtual) {
        for (var i = 0; i < this._virtualItemsToRemove.length; i++) {
          //el.parentNode.removeChild(el);
          this.didHideItem && this.didHideItem(i);
        }
        // Once scrolling stops, check if we need to remove old items

      }
    },

    /**
     * Clear any active drag effects on the list.
     */
    clearDragEffects: function(isInstant) {
      if (this._lastDragOp) {
        this._lastDragOp.clean && this._lastDragOp.clean(isInstant);
        this._lastDragOp.deregister && this._lastDragOp.deregister();
        this._lastDragOp = null;
      }
    },

    _initDrag: function() {
      // Store the last one
      if (this._lastDragOp) {
        this._lastDragOp.deregister && this._lastDragOp.deregister();
      }
      this._lastDragOp = this._dragOp;

      this._dragOp = null;
    },

    // Return the list item from the given target
    _getItem: function(target) {
      while (target) {
        if (target.classList && target.classList.contains(ITEM_CLASS)) {
          return target;
        }
        target = target.parentNode;
      }
      return null;
    },


    _startDrag: function(e) {
      var self = this;

      self._isDragging = false;

      var lastDragOp = self._lastDragOp;
      var item;

      // If we have an open SlideDrag and we're scrolling the list. Clear it.
      if (self._didDragUpOrDown && lastDragOp instanceof SlideDrag) {
          lastDragOp.clean && lastDragOp.clean();
      }

      // Check if this is a reorder drag
      if (ionic.DomUtil.getParentOrSelfWithClass(e.target, ITEM_REORDER_BTN_CLASS) && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
        item = self._getItem(e.target);

        if (item) {
          self._dragOp = new ReorderDrag({
            listEl: self.el,
            el: item,
            scrollEl: self.scrollEl,
            scrollView: self.scrollView,
            onReorder: function(el, start, end) {
              self.onReorder && self.onReorder(el, start, end);
            }
          });
          self._dragOp.start(e);
          e.preventDefault();
        }
      }

      // Or check if this is a swipe to the side drag
      else if (!self._didDragUpOrDown && (e.gesture.direction == 'left' || e.gesture.direction == 'right') && Math.abs(e.gesture.deltaX) > 5) {

        // Make sure this is an item with buttons
        item = self._getItem(e.target);
        if (item && item.querySelector('.item-options')) {
          self._dragOp = new SlideDrag({
            el: self.el,
            item: item,
            canSwipe: self.canSwipe
          });
          self._dragOp.start(e);
          e.preventDefault();
          self.isScrollFreeze = self.scrollView.freeze(true);
        }
      }

      // If we had a last drag operation and this is a new one on a different item, clean that last one
      if (lastDragOp && self._dragOp && !self._dragOp.isSameItem(lastDragOp) && e.defaultPrevented) {
        lastDragOp.clean && lastDragOp.clean();
      }
    },


    _handleEndDrag: function(e) {
      var self = this;

      if (self.scrollView) {
        self.isScrollFreeze = self.scrollView.freeze(false);
      }

      self._didDragUpOrDown = false;

      if (!self._dragOp) {
        return;
      }

      self._dragOp.end(e, function() {
        self._initDrag();
      });
    },

    /**
     * Process the drag event to move the item to the left or right.
     */
    _handleDrag: function(e) {
      var self = this;

      if (Math.abs(e.gesture.deltaY) > 5) {
        self._didDragUpOrDown = true;
      }

      // If we get a drag event, make sure we aren't in another drag, then check if we should
      // start one
      if (!self.isDragging && !self._dragOp) {
        self._startDrag(e);
      }

      // No drag still, pass it up
      if (!self._dragOp) {
        return;
      }

      e.gesture.srcEvent.preventDefault();
      self._dragOp.drag(e);
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
        focusFirstDelay: 600,
        backdropClickToClose: true,
        hardwareBackButtonClose: true,
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
      ionic.extend(this, {
        animationClass: 'menu-animated',
        onDrag: function() {},
        onEndDrag: function() {}
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
    var slider = this;

    var touchStartEvent, touchMoveEvent, touchEndEvent;
    if (window.navigator.pointerEnabled) {
      touchStartEvent = 'pointerdown';
      touchMoveEvent = 'pointermove';
      touchEndEvent = 'pointerup';
    } else if (window.navigator.msPointerEnabled) {
      touchStartEvent = 'MSPointerDown';
      touchMoveEvent = 'MSPointerMove';
      touchEndEvent = 'MSPointerUp';
    } else {
      touchStartEvent = 'touchstart';
      touchMoveEvent = 'touchmove';
      touchEndEvent = 'touchend';
    }

    var mouseStartEvent = 'mousedown';
    var mouseMoveEvent = 'mousemove';
    var mouseEndEvent = 'mouseup';

    // utilities
    var noop = function() {}; // simple no operation function
    var offloadFn = function(fn) { setTimeout(fn || noop, 0); }; // offload a functions execution

    // check browser capabilities
    var browser = {
      addEventListener: !!window.addEventListener,
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

      // do not setup if the container has no width
      if (!container.offsetWidth) {
        return;
      }

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
      width = container.offsetWidth || container.getBoundingClientRect().width;

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
        move(circle(index - 1), -width, 0);
        move(circle(index + 1), width, 0);
      }

      if (!browser.transitions) element.style.left = (index * -width) + 'px';

      container.style.visibility = 'visible';

      options.slidesChanged && options.slidesChanged();
    }

    function prev(slideSpeed) {

      if (options.continuous) slide(index - 1, slideSpeed);
      else if (index) slide(index - 1, slideSpeed);

    }

    function next(slideSpeed) {

      if (options.continuous) slide(index + 1, slideSpeed);
      else if (index < slides.length - 1) slide(index + 1, slideSpeed);

    }

    function circle(index) {

      // a simple positive modulo using slides.length
      return (slides.length + (index % slides.length)) % slides.length;

    }

    function slide(to, slideSpeed) {

      // do nothing if already on requested slide
      if (index == to) return;

      if (!slides) {
        index = to;
        return;
      }

      if (browser.transitions) {

        var direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward

        // get the actual position of the slide
        if (options.continuous) {
          var naturalDirection = direction;
          direction = -slidePos[circle(to)] / width;

          // if going forward but to < index, use to = slides.length + to
          // if going backward but to > index, use to = -slides.length + to
          if (direction !== naturalDirection) to = -direction * slides.length + to;

        }

        var diff = Math.abs(index - to) - 1;

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

      var start = +new Date();

      var timer = setInterval(function() {

        var timeElap = +new Date() - start;

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
        if(!event.touches && event.pageX && event.pageY) {
          event.touches = [{
            pageX: event.pageX,
            pageY: event.pageY
          }];
        }

        switch (event.type) {
          case touchStartEvent: this.start(event); break;
          case mouseStartEvent: this.start(event); break;
          case touchMoveEvent: this.touchmove(event); break;
          case mouseMoveEvent: this.touchmove(event); break;
          case touchEndEvent: offloadFn(this.end(event)); break;
          case mouseEndEvent: offloadFn(this.end(event)); break;
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

        // prevent to start if there is no valid event
        if (!event.touches) {
          return;
        }

        var touches = event.touches[0];

        // measure start values
        start = {

          // get initial touch coords
          x: touches.pageX,
          y: touches.pageY,

          // store time to determine touch duration
          time: +new Date()

        };

        // used for testing first move event
        isScrolling = undefined;

        // reset delta and end measurements
        delta = {};

        // attach touchmove and touchend listeners
        element.addEventListener(touchMoveEvent, this, false);
        element.addEventListener(mouseMoveEvent, this, false);

        element.addEventListener(touchEndEvent, this, false);
        element.addEventListener(mouseEndEvent, this, false);

        document.addEventListener(touchEndEvent, this, false);
        document.addEventListener(mouseEndEvent, this, false);
      },
      touchmove: function(event) {

        // ensure there is a valid event
        // ensure swiping with one touch and not pinching
        // ensure sliding is enabled
        if (!event.touches ||
            event.touches.length > 1 ||
            event.scale && event.scale !== 1 ||
            slider.slideIsDisabled) {
          return;
        }

        if (options.disableScroll) event.preventDefault();

        var touches = event.touches[0];

        // measure change in x and y
        delta = {
          x: touches.pageX - start.x,
          y: touches.pageY - start.y
        };

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

            translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
            translate(index, delta.x + slidePos[index], 0);
            translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);

          } else {
            // If the slider bounces, do the bounce!
            if(options.bouncing) {
              delta.x =
               delta.x /
                 ( (!index && delta.x > 0 ||         // if first slide and sliding left
                   index == slides.length - 1 &&     // or if last slide and sliding right
                   delta.x < 0                       // and if sliding at all
                 ) ?
                 ( Math.abs(delta.x) / width + 1 )      // determine resistance level
                 : 1 );                                 // no resistance if false
             } else {
               if(width * index - delta.x < 0) {               //We are trying scroll past left boundary
                 delta.x = Math.min(delta.x, width * index);  //Set delta.x so we don't go past left screen
               }
               if(Math.abs(delta.x) > width * (slides.length - index - 1)){         //We are trying to scroll past right bondary
                 delta.x = Math.max( -width * (slides.length - index - 1), delta.x);  //Set delta.x so we don't go past right screen
               }
             }

            // translate 1:1
            translate(index - 1, delta.x + slidePos[index - 1], 0);
            translate(index, delta.x + slidePos[index], 0);
            translate(index + 1, delta.x + slidePos[index + 1], 0);
          }

          options.onDrag && options.onDrag();
        }

      },
      end: function() {

        // measure duration
        var duration = +new Date() - start.time;

        // determine if slide attempt triggers next/prev slide
        var isValidSlide =
              Number(duration) < 250 &&         // if slide duration is less than 250ms
              Math.abs(delta.x) > 20 ||         // and if slide amt is greater than 20px
              Math.abs(delta.x) > width / 2;      // or if slide amt is greater than half the width

        // determine if slide attempt is past start and end
        var isPastBounds = (!index && delta.x > 0) ||      // if first slide and slide amt is greater than 0
              (index == slides.length - 1 && delta.x < 0); // or if last slide and slide amt is less than 0

        if (options.continuous) isPastBounds = false;

        // determine direction of swipe (true:right, false:left)
        var direction = delta.x < 0;

        // if not scrolling vertically
        if (!isScrolling) {

          if (isValidSlide && !isPastBounds) {

            if (direction) {

              if (options.continuous) { // we need to get the next in this direction in place

                move(circle(index - 1), -width, 0);
                move(circle(index + 2), width, 0);

              } else {
                move(index - 1, -width, 0);
              }

              move(index, slidePos[index] - width, speed);
              move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
              index = circle(index + 1);

            } else {
              if (options.continuous) { // we need to get the next in this direction in place

                move(circle(index + 1), width, 0);
                move(circle(index - 2), -width, 0);

              } else {
                move(index + 1, width, 0);
              }

              move(index, slidePos[index] + width, speed);
              move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
              index = circle(index - 1);

            }

            options.callback && options.callback(index, slides[index]);

          } else {

            if (options.continuous) {

              move(circle(index - 1), -width, speed);
              move(index, 0, speed);
              move(circle(index + 1), width, speed);

            } else {

              move(index - 1, -width, speed);
              move(index, 0, speed);
              move(index + 1, width, speed);
            }

          }

        }

        // kill touchmove and touchend event listeners until touchstart called again
        element.removeEventListener(touchMoveEvent, events, false);
        element.removeEventListener(mouseMoveEvent, events, false);

        element.removeEventListener(touchEndEvent, events, false);
        element.removeEventListener(mouseEndEvent, events, false);

        document.removeEventListener(touchEndEvent, events, false);
        document.removeEventListener(mouseEndEvent, events, false);

        options.onDragEnd && options.onDragEnd();
      },
      transitionEnd: function(event) {

        if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

          if (delay) begin();

          options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

        }

      }

    };

    // Public API
    this.update = function() {
      setTimeout(setup);
    };
    this.setup = function() {
      setup();
    };

    this.loop = function(value) {
      if (arguments.length) options.continuous = !!value;
      return options.continuous;
    };

    this.enableSlide = function(shouldEnable) {
      if (arguments.length) {
        this.slideIsDisabled = !shouldEnable;
      }
      return !this.slideIsDisabled;
    };

    this.slide = this.select = function(to, speed) {
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

    this.start = function() {
      begin();
    };

    this.autoPlay = function(newDelay) {
      if (!delay || delay < 0) {
        stop();
      } else {
        delay = newDelay;
        begin();
      }
    };

    this.currentIndex = this.selected = function() {
      // return current index position
      return index;
    };

    this.slidesCount = this.count = function() {
      // return total number of slides
      return length;
    };

    this.kill = function() {
      // cancel slideshow
      stop();

      // reset element
      element.style.width = '';
      element.style.left = '';

      // reset slides so no refs are held on to
      slides && (slides = []);

      // removed event listeners
      if (browser.addEventListener) {

        // remove current event listeners
        element.removeEventListener(touchStartEvent, events, false);
        element.removeEventListener(mouseStartEvent, events, false);
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
        element.addEventListener(touchStartEvent, events, false);
        element.addEventListener(mouseStartEvent, events, false);

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

        window.onresize = function () { setup(); }; // to play nice with old IE

      }
    };

  }
});

})(ionic);

/*eslint space-after-keywords: 0*/

/**
 * Swiper 3.2.7
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 *
 * http://www.idangero.us/swiper/
 *
 * Copyright 2015, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under MIT
 *
 * Released on: December 7, 2015
 */
(function () {
    'use strict';
    var $;
    /*===========================
    Swiper
    ===========================*/
    var Swiper = function (container, params, _scope, $compile) {

        if (!(this instanceof Swiper)) return new Swiper(container, params);

        var defaults = {
            direction: 'horizontal',
            touchEventsTarget: 'container',
            initialSlide: 0,
            speed: 300,
            // autoplay
            autoplay: false,
            autoplayDisableOnInteraction: true,
            // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
            iOSEdgeSwipeDetection: false,
            iOSEdgeSwipeThreshold: 20,
            // Free mode
            freeMode: false,
            freeModeMomentum: true,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: true,
            freeModeMomentumBounceRatio: 1,
            freeModeSticky: false,
            freeModeMinimumVelocity: 0.02,
            // Autoheight
            autoHeight: false,
            // Set wrapper width
            setWrapperSize: false,
            // Virtual Translate
            virtualTranslate: false,
            // Effects
            effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow'
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows : true
            },
            cube: {
                slideShadows: true,
                shadow: true,
                shadowOffset: 20,
                shadowScale: 0.94
            },
            fade: {
                crossFade: false
            },
            // Parallax
            parallax: false,
            // Scrollbar
            scrollbar: null,
            scrollbarHide: true,
            scrollbarDraggable: false,
            scrollbarSnapOnRelease: false,
            // Keyboard Mousewheel
            keyboardControl: false,
            mousewheelControl: false,
            mousewheelReleaseOnEdges: false,
            mousewheelInvert: false,
            mousewheelForceToAxis: false,
            mousewheelSensitivity: 1,
            // Hash Navigation
            hashnav: false,
            // Breakpoints
            breakpoints: undefined,
            // Slides grid
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerColumnFill: 'column',
            slidesPerGroup: 1,
            centeredSlides: false,
            slidesOffsetBefore: 0, // in px
            slidesOffsetAfter: 0, // in px
            // Round length
            roundLengths: false,
            // Touches
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: true,
            shortSwipes: true,
            longSwipes: true,
            longSwipesRatio: 0.5,
            longSwipesMs: 300,
            followFinger: true,
            onlyExternal: false,
            threshold: 0,
            touchMoveStopPropagation: true,
            // Pagination
            pagination: null,
            paginationElement: 'span',
            paginationClickable: false,
            paginationHide: false,
            paginationBulletRender: null,
            // Resistance
            resistance: true,
            resistanceRatio: 0.85,
            // Next/prev buttons
            nextButton: null,
            prevButton: null,
            // Progress
            watchSlidesProgress: false,
            watchSlidesVisibility: false,
            // Cursor
            grabCursor: false,
            // Clicks
            preventClicks: true,
            preventClicksPropagation: true,
            slideToClickedSlide: false,
            // Lazy Loading
            lazyLoading: false,
            lazyLoadingInPrevNext: false,
            lazyLoadingOnTransitionStart: false,
            // Images
            preloadImages: true,
            updateOnImagesReady: true,
            // loop
            loop: false,
            loopAdditionalSlides: 0,
            loopedSlides: null,
            // Control
            control: undefined,
            controlInverse: false,
            controlBy: 'slide', //or 'container'
            // Swiping/no swiping
            allowSwipeToPrev: true,
            allowSwipeToNext: true,
            swipeHandler: null, //'.swipe-handler',
            noSwiping: true,
            noSwipingClass: 'swiper-no-swiping',
            // NS
            slideClass: 'swiper-slide',
            slideActiveClass: 'swiper-slide-active',
            slideVisibleClass: 'swiper-slide-visible',
            slideDuplicateClass: 'swiper-slide-duplicate',
            slideNextClass: 'swiper-slide-next',
            slidePrevClass: 'swiper-slide-prev',
            wrapperClass: 'swiper-wrapper',
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
            buttonDisabledClass: 'swiper-button-disabled',
            paginationHiddenClass: 'swiper-pagination-hidden',
            // Observer
            observer: false,
            observeParents: false,
            // Accessibility
            a11y: false,
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide',
            paginationBulletMessage: 'Go to slide {{index}}',
            // Callbacks
            runCallbacksOnInit: true
            /*
            Callbacks:
            onInit: function (swiper)
            onDestroy: function (swiper)
            onClick: function (swiper, e)
            onTap: function (swiper, e)
            onDoubleTap: function (swiper, e)
            onSliderMove: function (swiper, e)
            onSlideChangeStart: function (swiper)
            onSlideChangeEnd: function (swiper)
            onTransitionStart: function (swiper)
            onTransitionEnd: function (swiper)
            onImagesReady: function (swiper)
            onProgress: function (swiper, progress)
            onTouchStart: function (swiper, e)
            onTouchMove: function (swiper, e)
            onTouchMoveOpposite: function (swiper, e)
            onTouchEnd: function (swiper, e)
            onReachBeginning: function (swiper)
            onReachEnd: function (swiper)
            onSetTransition: function (swiper, duration)
            onSetTranslate: function (swiper, translate)
            onAutoplayStart: function (swiper)
            onAutoplayStop: function (swiper),
            onLazyImageLoad: function (swiper, slide, image)
            onLazyImageReady: function (swiper, slide, image)
            */

        };
        var initialVirtualTranslate = params && params.virtualTranslate;

        params = params || {};
        var originalParams = {};
        for (var param in params) {
            if (typeof params[param] === 'object' && !(params[param].nodeType || params[param] === window || params[param] === document || (typeof Dom7 !== 'undefined' && params[param] instanceof Dom7) || (typeof jQuery !== 'undefined' && params[param] instanceof jQuery))) {
                originalParams[param] = {};
                for (var deepParam in params[param]) {
                    originalParams[param][deepParam] = params[param][deepParam];
                }
            }
            else {
                originalParams[param] = params[param];
            }
        }
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
            else if (typeof params[def] === 'object') {
                for (var deepDef in defaults[def]) {
                    if (typeof params[def][deepDef] === 'undefined') {
                        params[def][deepDef] = defaults[def][deepDef];
                    }
                }
            }
        }

        // Swiper
        var s = this;

        // Params
        s.params = params;
        s.originalParams = originalParams;

        // Classname
        s.classNames = [];
        /*=========================
          Dom Library and plugins
          ===========================*/
        if (typeof $ !== 'undefined' && typeof Dom7 !== 'undefined'){
            $ = Dom7;
        }
        if (typeof $ === 'undefined') {
            if (typeof Dom7 === 'undefined') {
                $ = window.Dom7 || window.Zepto || window.jQuery;
            }
            else {
                $ = Dom7;
            }
            if (!$) return;
        }
        // Export it to Swiper instance
        s.$ = $;

        /*=========================
          Breakpoints
          ===========================*/
        s.currentBreakpoint = undefined;
        s.getActiveBreakpoint = function () {
            //Get breakpoint for window width
            if (!s.params.breakpoints) return false;
            var breakpoint = false;
            var points = [], point;
            for ( point in s.params.breakpoints ) {
                if (s.params.breakpoints.hasOwnProperty(point)) {
                    points.push(point);
                }
            }
            points.sort(function (a, b) {
                return parseInt(a, 10) > parseInt(b, 10);
            });
            for (var i = 0; i < points.length; i++) {
                point = points[i];
                if (point >= window.innerWidth && !breakpoint) {
                    breakpoint = point;
                }
            }
            return breakpoint || 'max';
        };
        s.setBreakpoint = function () {
            //Set breakpoint for window width and update parameters
            var breakpoint = s.getActiveBreakpoint();
            if (breakpoint && s.currentBreakpoint !== breakpoint) {
                var breakPointsParams = breakpoint in s.params.breakpoints ? s.params.breakpoints[breakpoint] : s.originalParams;
                for ( var param in breakPointsParams ) {
                    s.params[param] = breakPointsParams[param];
                }
                s.currentBreakpoint = breakpoint;
            }
        };
        // Set breakpoint on load
        if (s.params.breakpoints) {
            s.setBreakpoint();
        }

        /*=========================
          Preparation - Define Container, Wrapper and Pagination
          ===========================*/
        s.container = $(container);
        if (s.container.length === 0) return;
        if (s.container.length > 1) {
            s.container.each(function () {
                new Swiper(this, params);
            });
            return;
        }

        // Save instance in container HTML Element and in data
        s.container[0].swiper = s;
        s.container.data('swiper', s);

        s.classNames.push('swiper-container-' + s.params.direction);

        if (s.params.freeMode) {
            s.classNames.push('swiper-container-free-mode');
        }
        if (!s.support.flexbox) {
            s.classNames.push('swiper-container-no-flexbox');
            s.params.slidesPerColumn = 1;
        }
        if (s.params.autoHeight) {
            s.classNames.push('swiper-container-autoheight');
        }
        // Enable slides progress when required
        if (s.params.parallax || s.params.watchSlidesVisibility) {
            s.params.watchSlidesProgress = true;
        }
        // Coverflow / 3D
        if (['cube', 'coverflow'].indexOf(s.params.effect) >= 0) {
            if (s.support.transforms3d) {
                s.params.watchSlidesProgress = true;
                s.classNames.push('swiper-container-3d');
            }
            else {
                s.params.effect = 'slide';
            }
        }
        if (s.params.effect !== 'slide') {
            s.classNames.push('swiper-container-' + s.params.effect);
        }
        if (s.params.effect === 'cube') {
            s.params.resistanceRatio = 0;
            s.params.slidesPerView = 1;
            s.params.slidesPerColumn = 1;
            s.params.slidesPerGroup = 1;
            s.params.centeredSlides = false;
            s.params.spaceBetween = 0;
            s.params.virtualTranslate = true;
            s.params.setWrapperSize = false;
        }
        if (s.params.effect === 'fade') {
            s.params.slidesPerView = 1;
            s.params.slidesPerColumn = 1;
            s.params.slidesPerGroup = 1;
            s.params.watchSlidesProgress = true;
            s.params.spaceBetween = 0;
            if (typeof initialVirtualTranslate === 'undefined') {
                s.params.virtualTranslate = true;
            }
        }

        // Grab Cursor
        if (s.params.grabCursor && s.support.touch) {
            s.params.grabCursor = false;
        }

        // Wrapper
        s.wrapper = s.container.children('.' + s.params.wrapperClass);

        // Pagination
        if (s.params.pagination) {
            s.paginationContainer = $(s.params.pagination);
            if (s.params.paginationClickable) {
                s.paginationContainer.addClass('swiper-pagination-clickable');
            }
        }

        // Is Horizontal
        function isH() {
            return s.params.direction === 'horizontal';
        }

        // RTL
        s.rtl = isH() && (s.container[0].dir.toLowerCase() === 'rtl' || s.container.css('direction') === 'rtl');
        if (s.rtl) {
            s.classNames.push('swiper-container-rtl');
        }

        // Wrong RTL support
        if (s.rtl) {
            s.wrongRTL = s.wrapper.css('display') === '-webkit-box';
        }

        // Columns
        if (s.params.slidesPerColumn > 1) {
            s.classNames.push('swiper-container-multirow');
        }

        // Check for Android
        if (s.device.android) {
            s.classNames.push('swiper-container-android');
        }

        // Add classes
        s.container.addClass(s.classNames.join(' '));

        // Translate
        s.translate = 0;

        // Progress
        s.progress = 0;

        // Velocity
        s.velocity = 0;

        /*=========================
          Locks, unlocks
          ===========================*/
        s.lockSwipeToNext = function () {
            s.params.allowSwipeToNext = false;
        };
        s.lockSwipeToPrev = function () {
            s.params.allowSwipeToPrev = false;
        };
        s.lockSwipes = function () {
            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = false;
        };
        s.unlockSwipeToNext = function () {
            s.params.allowSwipeToNext = true;
        };
        s.unlockSwipeToPrev = function () {
            s.params.allowSwipeToPrev = true;
        };
        s.unlockSwipes = function () {
            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = true;
        };

        /*=========================
          Round helper
          ===========================*/
        function round(a) {
            return Math.floor(a);
        }
        /*=========================
          Set grab cursor
          ===========================*/
        if (s.params.grabCursor) {
            s.container[0].style.cursor = 'move';
            s.container[0].style.cursor = '-webkit-grab';
            s.container[0].style.cursor = '-moz-grab';
            s.container[0].style.cursor = 'grab';
        }
        /*=========================
          Update on Images Ready
          ===========================*/
        s.imagesToLoad = [];
        s.imagesLoaded = 0;

        s.loadImage = function (imgElement, src, srcset, checkForComplete, callback) {
            var image;
            function onReady () {
                if (callback) callback();
            }
            if (!imgElement.complete || !checkForComplete) {
                if (src) {
                    image = new window.Image();
                    image.onload = onReady;
                    image.onerror = onReady;
                    if (srcset) {
                        image.srcset = srcset;
                    }
                    if (src) {
                        image.src = src;
                    }
                } else {
                    onReady();
                }

            } else {//image already loaded...
                onReady();
            }
        };
        s.preloadImages = function () {
            s.imagesToLoad = s.container.find('img');
            function _onReady() {
                if (typeof s === 'undefined' || s === null) return;
                if (s.imagesLoaded !== undefined) s.imagesLoaded++;
                if (s.imagesLoaded === s.imagesToLoad.length) {
                    if (s.params.updateOnImagesReady) s.update();
                    s.emit('onImagesReady', s);
                }
            }
            for (var i = 0; i < s.imagesToLoad.length; i++) {
                s.loadImage(s.imagesToLoad[i], (s.imagesToLoad[i].currentSrc || s.imagesToLoad[i].getAttribute('src')), (s.imagesToLoad[i].srcset || s.imagesToLoad[i].getAttribute('srcset')), true, _onReady);
            }
        };

        /*=========================
          Autoplay
          ===========================*/
        s.autoplayTimeoutId = undefined;
        s.autoplaying = false;
        s.autoplayPaused = false;
        function autoplay() {
            s.autoplayTimeoutId = setTimeout(function () {
                if (s.params.loop) {
                    s.fixLoop();
                    s._slideNext();
                }
                else {
                    if (!s.isEnd) {
                        s._slideNext();
                    }
                    else {
                        if (!params.autoplayStopOnLast) {
                            s._slideTo(0);
                        }
                        else {
                            s.stopAutoplay();
                        }
                    }
                }
            }, s.params.autoplay);
        }
        s.startAutoplay = function () {
            if (typeof s.autoplayTimeoutId !== 'undefined') return false;
            if (!s.params.autoplay) return false;
            if (s.autoplaying) return false;
            s.autoplaying = true;
            s.emit('onAutoplayStart', s);
            autoplay();
        };
        s.stopAutoplay = function (internal) {
            if (!s.autoplayTimeoutId) return;
            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
            s.autoplaying = false;
            s.autoplayTimeoutId = undefined;
            s.emit('onAutoplayStop', s);
        };
        s.pauseAutoplay = function (speed) {
            if (s.autoplayPaused) return;
            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
            s.autoplayPaused = true;
            if (speed === 0) {
                s.autoplayPaused = false;
                autoplay();
            }
            else {
                s.wrapper.transitionEnd(function () {
                    if (!s) return;
                    s.autoplayPaused = false;
                    if (!s.autoplaying) {
                        s.stopAutoplay();
                    }
                    else {
                        autoplay();
                    }
                });
            }
        };
        /*=========================
          Min/Max Translate
          ===========================*/
        s.minTranslate = function () {
            return (-s.snapGrid[0]);
        };
        s.maxTranslate = function () {
            return (-s.snapGrid[s.snapGrid.length - 1]);
        };
        /*=========================
          Slider/slides sizes
          ===========================*/
        s.updateAutoHeight = function () {
            // Update Height
            var newHeight = s.slides.eq(s.activeIndex)[0].offsetHeight;
            if (newHeight) s.wrapper.css('height', s.slides.eq(s.activeIndex)[0].offsetHeight + 'px');
        };
        s.updateContainerSize = function () {
            var width, height;
            if (typeof s.params.width !== 'undefined') {
                width = s.params.width;
            }
            else {
                width = s.container[0].clientWidth;
            }
            if (typeof s.params.height !== 'undefined') {
                height = s.params.height;
            }
            else {
                height = s.container[0].clientHeight;
            }
            if (width === 0 && isH() || height === 0 && !isH()) {
                return;
            }

            //Subtract paddings
            width = width - parseInt(s.container.css('padding-left'), 10) - parseInt(s.container.css('padding-right'), 10);
            height = height - parseInt(s.container.css('padding-top'), 10) - parseInt(s.container.css('padding-bottom'), 10);

            // Store values
            s.width = width;
            s.height = height;
            s.size = isH() ? s.width : s.height;
        };

        s.updateSlidesSize = function () {
            s.slides = s.wrapper.children('.' + s.params.slideClass);
            s.snapGrid = [];
            s.slidesGrid = [];
            s.slidesSizesGrid = [];

            var spaceBetween = s.params.spaceBetween,
                slidePosition = -s.params.slidesOffsetBefore,
                i,
                prevSlideSize = 0,
                index = 0;
            if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
                spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * s.size;
            }

            s.virtualSize = -spaceBetween;
            // reset margins
            if (s.rtl) s.slides.css({marginLeft: '', marginTop: ''});
            else s.slides.css({marginRight: '', marginBottom: ''});

            var slidesNumberEvenToRows;
            if (s.params.slidesPerColumn > 1) {
                if (Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn) {
                    slidesNumberEvenToRows = s.slides.length;
                }
                else {
                    slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn;
                }
                if (s.params.slidesPerView !== 'auto' && s.params.slidesPerColumnFill === 'row') {
                    slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, s.params.slidesPerView * s.params.slidesPerColumn);
                }
            }

            // Calc slides
            var slideSize;
            var slidesPerColumn = s.params.slidesPerColumn;
            var slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
            var numFullColumns = slidesPerRow - (s.params.slidesPerColumn * slidesPerRow - s.slides.length);
            for (i = 0; i < s.slides.length; i++) {
                slideSize = 0;
                var slide = s.slides.eq(i);
                if (s.params.slidesPerColumn > 1) {
                    // Set slides order
                    var newSlideOrderIndex;
                    var column, row;
                    if (s.params.slidesPerColumnFill === 'column') {
                        column = Math.floor(i / slidesPerColumn);
                        row = i - column * slidesPerColumn;
                        if (column > numFullColumns || (column === numFullColumns && row === slidesPerColumn-1)) {
                            if (++row >= slidesPerColumn) {
                                row = 0;
                                column++;
                            }
                        }
                        newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
                        slide
                            .css({
                                '-webkit-box-ordinal-group': newSlideOrderIndex,
                                '-moz-box-ordinal-group': newSlideOrderIndex,
                                '-ms-flex-order': newSlideOrderIndex,
                                '-webkit-order': newSlideOrderIndex,
                                'order': newSlideOrderIndex
                            });
                    }
                    else {
                        row = Math.floor(i / slidesPerRow);
                        column = i - row * slidesPerRow;
                    }
                    slide
                        .css({
                            'margin-top': (row !== 0 && s.params.spaceBetween) && (s.params.spaceBetween + 'px')
                        })
                        .attr('data-swiper-column', column)
                        .attr('data-swiper-row', row);

                }
                if (slide.css('display') === 'none') continue;
                if (s.params.slidesPerView === 'auto') {
                    slideSize = isH() ? slide.outerWidth(true) : slide.outerHeight(true);
                    if (s.params.roundLengths) slideSize = round(slideSize);
                }
                else {
                    slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;
                    if (s.params.roundLengths) slideSize = round(slideSize);

                    if (isH()) {
                        s.slides[i].style.width = slideSize + 'px';
                    }
                    else {
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
                }
                else {
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
                s.rtl && s.wrongRTL && (s.params.effect === 'slide' || s.params.effect === 'coverflow')) {
                s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
            }
            if (!s.support.flexbox || s.params.setWrapperSize) {
                if (isH()) s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
                else s.wrapper.css({height: s.virtualSize + s.params.spaceBetween + 'px'});
            }

            if (s.params.slidesPerColumn > 1) {
                s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;
                s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween;
                s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
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
                if (Math.floor(s.virtualSize - s.size) > Math.floor(s.snapGrid[s.snapGrid.length - 1])) {
                    s.snapGrid.push(s.virtualSize - s.size);
                }
            }
            if (s.snapGrid.length === 0) s.snapGrid = [0];

            if (s.params.spaceBetween !== 0) {
                if (isH()) {
                    if (s.rtl) s.slides.css({marginLeft: spaceBetween + 'px'});
                    else s.slides.css({marginRight: spaceBetween + 'px'});
                }
                else s.slides.css({marginBottom: spaceBetween + 'px'});
            }
            if (s.params.watchSlidesProgress) {
                s.updateSlidesOffset();
            }
        };
        s.updateSlidesOffset = function () {
            for (var i = 0; i < s.slides.length; i++) {
                s.slides[i].swiperSlideOffset = isH() ? s.slides[i].offsetLeft : s.slides[i].offsetTop;
            }
        };

        /*=========================
          Slider/slides progress
          ===========================*/
        s.updateSlidesProgress = function (translate) {
            if (typeof translate === 'undefined') {
                translate = s.translate || 0;
            }
            if (s.slides.length === 0) return;
            if (typeof s.slides[0].swiperSlideOffset === 'undefined') s.updateSlidesOffset();

            var offsetCenter = -translate;
            if (s.rtl) offsetCenter = translate;

            // Visible Slides
            s.slides.removeClass(s.params.slideVisibleClass);
            for (var i = 0; i < s.slides.length; i++) {
                var slide = s.slides[i];
                var slideProgress = (offsetCenter - slide.swiperSlideOffset) / (slide.swiperSlideSize + s.params.spaceBetween);
                if (s.params.watchSlidesVisibility) {
                    var slideBefore = -(offsetCenter - slide.swiperSlideOffset);
                    var slideAfter = slideBefore + s.slidesSizesGrid[i];
                    var isVisible =
                        (slideBefore >= 0 && slideBefore < s.size) ||
                        (slideAfter > 0 && slideAfter <= s.size) ||
                        (slideBefore <= 0 && slideAfter >= s.size);
                    if (isVisible) {
                        s.slides.eq(i).addClass(s.params.slideVisibleClass);
                    }
                }
                slide.progress = s.rtl ? -slideProgress : slideProgress;
            }
        };
        s.updateProgress = function (translate) {
            if (typeof translate === 'undefined') {
                translate = s.translate || 0;
            }
            var translatesDiff = s.maxTranslate() - s.minTranslate();
            var wasBeginning = s.isBeginning;
            var wasEnd = s.isEnd;
            if (translatesDiff === 0) {
                s.progress = 0;
                s.isBeginning = s.isEnd = true;
            }
            else {
                s.progress = (translate - s.minTranslate()) / (translatesDiff);
                s.isBeginning = s.progress <= 0;
                s.isEnd = s.progress >= 1;
            }
            if (s.isBeginning && !wasBeginning) s.emit('onReachBeginning', s);
            if (s.isEnd && !wasEnd) s.emit('onReachEnd', s);

            if (s.params.watchSlidesProgress) s.updateSlidesProgress(translate);
            s.emit('onProgress', s, s.progress);
        };
        s.updateActiveIndex = function () {
            var translate = s.rtl ? s.translate : -s.translate;
            var newActiveIndex, i, snapIndex;
            for (i = 0; i < s.slidesGrid.length; i ++) {
                if (typeof s.slidesGrid[i + 1] !== 'undefined') {
                    if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2) {
                        newActiveIndex = i;
                    }
                    else if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]) {
                        newActiveIndex = i + 1;
                    }
                }
                else {
                    if (translate >= s.slidesGrid[i]) {
                        newActiveIndex = i;
                    }
                }
            }
            // Normalize slideIndex
            if (newActiveIndex < 0 || typeof newActiveIndex === 'undefined') newActiveIndex = 0;
            // for (i = 0; i < s.slidesGrid.length; i++) {
                // if (- translate >= s.slidesGrid[i]) {
                    // newActiveIndex = i;
                // }
            // }
            snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);
            if (snapIndex >= s.snapGrid.length) snapIndex = s.snapGrid.length - 1;

            if (newActiveIndex === s.activeIndex) {
                return;
            }
            s.snapIndex = snapIndex;
            s.previousIndex = s.activeIndex;
            s.activeIndex = newActiveIndex;
            s.updateClasses();
        };

        /*=========================
          Classes
          ===========================*/
        s.updateClasses = function () {
            s.slides.removeClass(s.params.slideActiveClass + ' ' + s.params.slideNextClass + ' ' + s.params.slidePrevClass);
            var activeSlide = s.slides.eq(s.activeIndex);
            // Active classes
            activeSlide.addClass(s.params.slideActiveClass);
            activeSlide.next('.' + s.params.slideClass).addClass(s.params.slideNextClass);
            activeSlide.prev('.' + s.params.slideClass).addClass(s.params.slidePrevClass);

            // Pagination
            if (s.bullets && s.bullets.length > 0) {
                s.bullets.removeClass(s.params.bulletActiveClass);
                var bulletIndex;
                if (s.params.loop) {
                    bulletIndex = Math.ceil(s.activeIndex - s.loopedSlides)/s.params.slidesPerGroup;
                    if (bulletIndex > s.slides.length - 1 - s.loopedSlides * 2) {
                        bulletIndex = bulletIndex - (s.slides.length - s.loopedSlides * 2);
                    }
                    if (bulletIndex > s.bullets.length - 1) bulletIndex = bulletIndex - s.bullets.length;
                }
                else {
                    if (typeof s.snapIndex !== 'undefined') {
                        bulletIndex = s.snapIndex;
                    }
                    else {
                        bulletIndex = s.activeIndex || 0;
                    }
                }
                if (s.paginationContainer.length > 1) {
                    s.bullets.each(function () {
                        if ($(this).index() === bulletIndex) $(this).addClass(s.params.bulletActiveClass);
                    });
                }
                else {
                    s.bullets.eq(bulletIndex).addClass(s.params.bulletActiveClass);
                }
            }

            // Next/active buttons
            if (!s.params.loop) {
                if (s.params.prevButton) {
                    if (s.isBeginning) {
                        $(s.params.prevButton).addClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.disable($(s.params.prevButton));
                    }
                    else {
                        $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.enable($(s.params.prevButton));
                    }
                }
                if (s.params.nextButton) {
                    if (s.isEnd) {
                        $(s.params.nextButton).addClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.disable($(s.params.nextButton));
                    }
                    else {
                        $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.enable($(s.params.nextButton));
                    }
                }
            }
        };

        /*=========================
          Pagination
          ===========================*/
        s.updatePagination = function () {
            if (!s.params.pagination) return;
            if (s.paginationContainer && s.paginationContainer.length > 0) {
                var bulletsHTML = '';
                var numberOfBullets = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
                for (var i = 0; i < numberOfBullets; i++) {
                    if (s.params.paginationBulletRender) {
                        bulletsHTML += s.params.paginationBulletRender(i, s.params.bulletClass);
                    }
                    else {
                        bulletsHTML += '<' + s.params.paginationElement+' class="' + s.params.bulletClass + '"></' + s.params.paginationElement + '>';
                    }
                }
                s.paginationContainer.html(bulletsHTML);
                s.bullets = s.paginationContainer.find('.' + s.params.bulletClass);
                if (s.params.paginationClickable && s.params.a11y && s.a11y) {
                    s.a11y.initPagination();
                }
            }
        };
        /*=========================
          Common update method
          ===========================*/
        s.update = function (updateTranslate) {
            s.updateContainerSize();
            s.updateSlidesSize();
            s.updateProgress();
            s.updatePagination();
            s.updateClasses();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
            }
            function forceSetTranslate() {
                newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                s.setWrapperTranslate(newTranslate);
                s.updateActiveIndex();
                s.updateClasses();
            }
            if (updateTranslate) {
                var translated, newTranslate;
                if (s.controller && s.controller.spline) {
                    s.controller.spline = undefined;
                }
                if (s.params.freeMode) {
                    forceSetTranslate();
                    if (s.params.autoHeight) {
                        s.updateAutoHeight();
                    }
                }
                else {
                    if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
                        translated = s.slideTo(s.slides.length - 1, 0, false, true);
                    }
                    else {
                        translated = s.slideTo(s.activeIndex, 0, false, true);
                    }
                    if (!translated) {
                        forceSetTranslate();
                    }
                }
            }
            else if (s.params.autoHeight) {
                s.updateAutoHeight();
            }
        };

        /*=========================
          Resize Handler
          ===========================*/
        s.onResize = function (forceUpdatePagination) {
            //Breakpoints
            if (s.params.breakpoints) {
                s.setBreakpoint();
            }

            // Disable locks on resize
            var allowSwipeToPrev = s.params.allowSwipeToPrev;
            var allowSwipeToNext = s.params.allowSwipeToNext;
            s.params.allowSwipeToPrev = s.params.allowSwipeToNext = true;

            s.updateContainerSize();
            s.updateSlidesSize();
            if (s.params.slidesPerView === 'auto' || s.params.freeMode || forceUpdatePagination) s.updatePagination();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
            }
            if (s.controller && s.controller.spline) {
                s.controller.spline = undefined;
            }
            if (s.params.freeMode) {
                var newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                s.setWrapperTranslate(newTranslate);
                s.updateActiveIndex();
                s.updateClasses();

                if (s.params.autoHeight) {
                    s.updateAutoHeight();
                }
            }
            else {
                s.updateClasses();
                if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
                    s.slideTo(s.slides.length - 1, 0, false, true);
                }
                else {
                    s.slideTo(s.activeIndex, 0, false, true);
                }
            }
            // Return locks after resize
            s.params.allowSwipeToPrev = allowSwipeToPrev;
            s.params.allowSwipeToNext = allowSwipeToNext;
        };

        /*=========================
          Events
          ===========================*/

        //Define Touch Events
        var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
        if (window.navigator.pointerEnabled) desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
        else if (window.navigator.msPointerEnabled) desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
        s.touchEvents = {
            start : s.support.touch || !s.params.simulateTouch  ? 'touchstart' : desktopEvents[0],
            move : s.support.touch || !s.params.simulateTouch ? 'touchmove' : desktopEvents[1],
            end : s.support.touch || !s.params.simulateTouch ? 'touchend' : desktopEvents[2]
        };


        // WP8 Touch Events Fix
        if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) {
            (s.params.touchEventsTarget === 'container' ? s.container : s.wrapper).addClass('swiper-wp8-' + s.params.direction);
        }

        // Attach/detach events
        s.initEvents = function (detach) {
            var actionDom = detach ? 'off' : 'on';
            var action = detach ? 'removeEventListener' : 'addEventListener';
            var touchEventsTarget = s.params.touchEventsTarget === 'container' ? s.container[0] : s.wrapper[0];
            var target = s.support.touch ? touchEventsTarget : document;

            var moveCapture = s.params.nested ? true : false;

            //Touch Events
            if (s.browser.ie) {
                touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
                target[action](s.touchEvents.move, s.onTouchMove, moveCapture);
                target[action](s.touchEvents.end, s.onTouchEnd, false);
            }
            else {
                if (s.support.touch) {
                    touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
                    touchEventsTarget[action](s.touchEvents.move, s.onTouchMove, moveCapture);
                    touchEventsTarget[action](s.touchEvents.end, s.onTouchEnd, false);
                }
                if (params.simulateTouch && !s.device.ios && !s.device.android) {
                    touchEventsTarget[action]('mousedown', s.onTouchStart, false);
                    document[action]('mousemove', s.onTouchMove, moveCapture);
                    document[action]('mouseup', s.onTouchEnd, false);
                }
            }
            window[action]('resize', s.onResize);

            // Next, Prev, Index
            if (s.params.nextButton) {
                $(s.params.nextButton)[actionDom]('click', s.onClickNext);
                if (s.params.a11y && s.a11y) $(s.params.nextButton)[actionDom]('keydown', s.a11y.onEnterKey);
            }
            if (s.params.prevButton) {
                $(s.params.prevButton)[actionDom]('click', s.onClickPrev);
                if (s.params.a11y && s.a11y) $(s.params.prevButton)[actionDom]('keydown', s.a11y.onEnterKey);
            }
            if (s.params.pagination && s.params.paginationClickable) {
                $(s.paginationContainer)[actionDom]('click', '.' + s.params.bulletClass, s.onClickIndex);
                if (s.params.a11y && s.a11y) $(s.paginationContainer)[actionDom]('keydown', '.' + s.params.bulletClass, s.a11y.onEnterKey);
            }

            // Prevent Links Clicks
            if (s.params.preventClicks || s.params.preventClicksPropagation) touchEventsTarget[action]('click', s.preventClicks, true);
        };
        s.attachEvents = function (detach) {
            s.initEvents();
        };
        s.detachEvents = function () {
            s.initEvents(true);
        };

        /*=========================
          Handle Clicks
          ===========================*/
        // Prevent Clicks
        s.allowClick = true;
        s.preventClicks = function (e) {
            if (!s.allowClick) {
                if (s.params.preventClicks) e.preventDefault();
                if (s.params.preventClicksPropagation && s.animating) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            }
        };
        // Clicks
        s.onClickNext = function (e) {
            e.preventDefault();
            if (s.isEnd && !s.params.loop) return;
            s.slideNext();
        };
        s.onClickPrev = function (e) {
            e.preventDefault();
            if (s.isBeginning && !s.params.loop) return;
            s.slidePrev();
        };
        s.onClickIndex = function (e) {
            e.preventDefault();
            var index = $(this).index() * s.params.slidesPerGroup;
            if (s.params.loop) index = index + s.loopedSlides;
            s.slideTo(index);
        };

        /*=========================
          Handle Touches
          ===========================*/
        function findElementInEvent(e, selector) {
            var el = $(e.target);
            if (!el.is(selector)) {
                if (typeof selector === 'string') {
                    el = el.parents(selector);
                }
                else if (selector.nodeType) {
                    var found;
                    el.parents().each(function (index, _el) {
                        if (_el === selector) found = selector;
                    });
                    if (!found) return undefined;
                    else return selector;
                }
            }
            if (el.length === 0) {
                return undefined;
            }
            return el[0];
        }
        s.updateClickedSlide = function (e) {
            var slide = findElementInEvent(e, '.' + s.params.slideClass);
            var slideFound = false;
            if (slide) {
                for (var i = 0; i < s.slides.length; i++) {
                    if (s.slides[i] === slide) slideFound = true;
                }
            }

            if (slide && slideFound) {
                s.clickedSlide = slide;
                s.clickedIndex = $(slide).index();
            }
            else {
                s.clickedSlide = undefined;
                s.clickedIndex = undefined;
                return;
            }
            if (s.params.slideToClickedSlide && s.clickedIndex !== undefined && s.clickedIndex !== s.activeIndex) {
                var slideToIndex = s.clickedIndex,
                    realIndex,
                    duplicatedSlides;
                if (s.params.loop) {
                    if (s.animating) return;
                    realIndex = $(s.clickedSlide).attr('data-swiper-slide-index');
                    if (s.params.centeredSlides) {
                        if ((slideToIndex < s.loopedSlides - s.params.slidesPerView/2) || (slideToIndex > s.slides.length - s.loopedSlides + s.params.slidesPerView/2)) {
                            s.fixLoop();
                            slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index();
                            setTimeout(function () {
                                s.slideTo(slideToIndex);
                            }, 0);
                        }
                        else {
                            s.slideTo(slideToIndex);
                        }
                    }
                    else {
                        if (slideToIndex > s.slides.length - s.params.slidesPerView) {
                            s.fixLoop();
                            slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index();
                            setTimeout(function () {
                                s.slideTo(slideToIndex);
                            }, 0);
                        }
                        else {
                            s.slideTo(slideToIndex);
                        }
                    }
                }
                else {
                    s.slideTo(slideToIndex);
                }
            }
        };

        var isTouched,
            isMoved,
            allowTouchCallbacks,
            touchStartTime,
            isScrolling,
            currentTranslate,
            startTranslate,
            allowThresholdMove,
            // Form elements to match
            formElements = 'input, select, textarea, button',
            // Last click time
            lastClickTime = Date.now(), clickTimeout,
            //Velocities
            velocities = [],
            allowMomentumBounce;

        // Animating Flag
        s.animating = false;

        // Touches information
        s.touches = {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            diff: 0
        };

        // Touch handlers
        var isTouchEvent, startMoving;
        s.onTouchStart = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            isTouchEvent = e.type === 'touchstart';
            if (!isTouchEvent && 'which' in e && e.which === 3) return;
            if (s.params.noSwiping && findElementInEvent(e, '.' + s.params.noSwipingClass)) {
                s.allowClick = true;
                return;
            }
            if (s.params.swipeHandler) {
                if (!findElementInEvent(e, s.params.swipeHandler)) return;
            }

            var startX = s.touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            var startY = s.touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;

            // Do NOT start if iOS edge swipe is detected. Otherwise iOS app (UIWebView) cannot swipe-to-go-back anymore
            if(s.device.ios && s.params.iOSEdgeSwipeDetection && startX <= s.params.iOSEdgeSwipeThreshold) {
                return;
            }

            isTouched = true;
            isMoved = false;
            allowTouchCallbacks = true;
            isScrolling = undefined;
            startMoving = undefined;
            s.touches.startX = startX;
            s.touches.startY = startY;
            touchStartTime = Date.now();
            s.allowClick = true;
            s.updateContainerSize();
            s.swipeDirection = undefined;
            if (s.params.threshold > 0) allowThresholdMove = false;
            if (e.type !== 'touchstart') {
                var preventDefault = true;
                if ($(e.target).is(formElements)) preventDefault = false;
                if (document.activeElement && $(document.activeElement).is(formElements)) {
                    document.activeElement.blur();
                }
                if (preventDefault) {
                    e.preventDefault();
                }
            }
            s.emit('onTouchStart', s, e);
        };

        s.onTouchMove = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            if (isTouchEvent && e.type === 'mousemove') return;
            if (e.preventedByNestedSwiper) return;
            if (s.params.onlyExternal) {
                // isMoved = true;
                s.allowClick = false;
                if (isTouched) {
                    s.touches.startX = s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                    s.touches.startY = s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                    touchStartTime = Date.now();
                }
                return;
            }
            if (isTouchEvent && document.activeElement) {
                if (e.target === document.activeElement && $(e.target).is(formElements)) {
                    isMoved = true;
                    s.allowClick = false;
                    return;
                }
            }
            if (allowTouchCallbacks) {
                s.emit('onTouchMove', s, e);
            }
            if (e.targetTouches && e.targetTouches.length > 1) return;

            s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

            if (typeof isScrolling === 'undefined') {
                var touchAngle = Math.atan2(Math.abs(s.touches.currentY - s.touches.startY), Math.abs(s.touches.currentX - s.touches.startX)) * 180 / Math.PI;
                isScrolling = isH() ? touchAngle > s.params.touchAngle : (90 - touchAngle > s.params.touchAngle);
            }
            if (isScrolling) {
                s.emit('onTouchMoveOpposite', s, e);
            }
            if (typeof startMoving === 'undefined' && s.browser.ieTouch) {
                if (s.touches.currentX !== s.touches.startX || s.touches.currentY !== s.touches.startY) {
                    startMoving = true;
                }
            }
            if (!isTouched) return;
            if (isScrolling)  {
                isTouched = false;
                return;
            }
            if (!startMoving && s.browser.ieTouch) {
                return;
            }
            s.allowClick = false;
            s.emit('onSliderMove', s, e);
            e.preventDefault();
            if (s.params.touchMoveStopPropagation && !s.params.nested) {
                e.stopPropagation();
            }

            if (!isMoved) {
                if (params.loop) {
                    s.fixLoop();
                }
                startTranslate = s.getWrapperTranslate();
                s.setWrapperTransition(0);
                if (s.animating) {
                    s.wrapper.trigger('webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd');
                }
                if (s.params.autoplay && s.autoplaying) {
                    if (s.params.autoplayDisableOnInteraction) {
                        s.stopAutoplay();
                    }
                    else {
                        s.pauseAutoplay();
                    }
                }
                allowMomentumBounce = false;
                //Grab Cursor
                if (s.params.grabCursor) {
                    s.container[0].style.cursor = 'move';
                    s.container[0].style.cursor = '-webkit-grabbing';
                    s.container[0].style.cursor = '-moz-grabbin';
                    s.container[0].style.cursor = 'grabbing';
                }
            }
            isMoved = true;

            var diff = s.touches.diff = isH() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;

            diff = diff * s.params.touchRatio;
            if (s.rtl) diff = -diff;

            s.swipeDirection = diff > 0 ? 'prev' : 'next';
            currentTranslate = diff + startTranslate;

            var disableParentSwiper = true;
            if ((diff > 0 && currentTranslate > s.minTranslate())) {
                disableParentSwiper = false;
                if (s.params.resistance) currentTranslate = s.minTranslate() - 1 + Math.pow(-s.minTranslate() + startTranslate + diff, s.params.resistanceRatio);
            }
            else if (diff < 0 && currentTranslate < s.maxTranslate()) {
                disableParentSwiper = false;
                if (s.params.resistance) currentTranslate = s.maxTranslate() + 1 - Math.pow(s.maxTranslate() - startTranslate - diff, s.params.resistanceRatio);
            }

            if (disableParentSwiper) {
                e.preventedByNestedSwiper = true;
            }

            // Directions locks
            if (!s.params.allowSwipeToNext && s.swipeDirection === 'next' && currentTranslate < startTranslate) {
                currentTranslate = startTranslate;
            }
            if (!s.params.allowSwipeToPrev && s.swipeDirection === 'prev' && currentTranslate > startTranslate) {
                currentTranslate = startTranslate;
            }

            if (!s.params.followFinger) return;

            // Threshold
            if (s.params.threshold > 0) {
                if (Math.abs(diff) > s.params.threshold || allowThresholdMove) {
                    if (!allowThresholdMove) {
                        allowThresholdMove = true;
                        s.touches.startX = s.touches.currentX;
                        s.touches.startY = s.touches.currentY;
                        currentTranslate = startTranslate;
                        s.touches.diff = isH() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
                        return;
                    }
                }
                else {
                    currentTranslate = startTranslate;
                    return;
                }
            }
            // Update active index in free mode
            if (s.params.freeMode || s.params.watchSlidesProgress) {
                s.updateActiveIndex();
            }
            if (s.params.freeMode) {
                //Velocity
                if (velocities.length === 0) {
                    velocities.push({
                        position: s.touches[isH() ? 'startX' : 'startY'],
                        time: touchStartTime
                    });
                }
                velocities.push({
                    position: s.touches[isH() ? 'currentX' : 'currentY'],
                    time: (new window.Date()).getTime()
                });
            }
            // Update progress
            s.updateProgress(currentTranslate);
            // Update translate
            s.setWrapperTranslate(currentTranslate);
        };
        s.onTouchEnd = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            if (allowTouchCallbacks) {
                s.emit('onTouchEnd', s, e);
            }
            allowTouchCallbacks = false;
            if (!isTouched) return;
            //Return Grab Cursor
            if (s.params.grabCursor && isMoved && isTouched) {
                s.container[0].style.cursor = 'move';
                s.container[0].style.cursor = '-webkit-grab';
                s.container[0].style.cursor = '-moz-grab';
                s.container[0].style.cursor = 'grab';
            }

            // Time diff
            var touchEndTime = Date.now();
            var timeDiff = touchEndTime - touchStartTime;

            // Tap, doubleTap, Click
            if (s.allowClick) {
                s.updateClickedSlide(e);
                s.emit('onTap', s, e);
                if (timeDiff < 300 && (touchEndTime - lastClickTime) > 300) {
                    if (clickTimeout) clearTimeout(clickTimeout);
                    clickTimeout = setTimeout(function () {
                        if (!s) return;
                        if (s.params.paginationHide && s.paginationContainer.length > 0 && !$(e.target).hasClass(s.params.bulletClass)) {
                            s.paginationContainer.toggleClass(s.params.paginationHiddenClass);
                        }
                        s.emit('onClick', s, e);
                    }, 300);

                }
                if (timeDiff < 300 && (touchEndTime - lastClickTime) < 300) {
                    if (clickTimeout) clearTimeout(clickTimeout);
                    s.emit('onDoubleTap', s, e);
                }
            }

            lastClickTime = Date.now();
            setTimeout(function () {
                if (s) s.allowClick = true;
            }, 0);

            if (!isTouched || !isMoved || !s.swipeDirection || s.touches.diff === 0 || currentTranslate === startTranslate) {
                isTouched = isMoved = false;
                return;
            }
            isTouched = isMoved = false;

            var currentPos;
            if (s.params.followFinger) {
                currentPos = s.rtl ? s.translate : -s.translate;
            }
            else {
                currentPos = -currentTranslate;
            }
            if (s.params.freeMode) {
                if (currentPos < -s.minTranslate()) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                else if (currentPos > -s.maxTranslate()) {
                    if (s.slides.length < s.snapGrid.length) {
                        s.slideTo(s.snapGrid.length - 1);
                    }
                    else {
                        s.slideTo(s.slides.length - 1);
                    }
                    return;
                }

                if (s.params.freeModeMomentum) {
                    if (velocities.length > 1) {
                        var lastMoveEvent = velocities.pop(), velocityEvent = velocities.pop();

                        var distance = lastMoveEvent.position - velocityEvent.position;
                        var time = lastMoveEvent.time - velocityEvent.time;
                        s.velocity = distance / time;
                        s.velocity = s.velocity / 2;
                        if (Math.abs(s.velocity) < s.params.freeModeMinimumVelocity) {
                            s.velocity = 0;
                        }
                        // this implies that the user stopped moving a finger then released.
                        // There would be no events with distance zero, so the last event is stale.
                        if (time > 150 || (new window.Date().getTime() - lastMoveEvent.time) > 300) {
                            s.velocity = 0;
                        }
                    } else {
                        s.velocity = 0;
                    }

                    velocities.length = 0;
                    var momentumDuration = 1000 * s.params.freeModeMomentumRatio;
                    var momentumDistance = s.velocity * momentumDuration;

                    var newPosition = s.translate + momentumDistance;
                    if (s.rtl) newPosition = - newPosition;
                    var doBounce = false;
                    var afterBouncePosition;
                    var bounceAmount = Math.abs(s.velocity) * 20 * s.params.freeModeMomentumBounceRatio;
                    if (newPosition < s.maxTranslate()) {
                        if (s.params.freeModeMomentumBounce) {
                            if (newPosition + s.maxTranslate() < -bounceAmount) {
                                newPosition = s.maxTranslate() - bounceAmount;
                            }
                            afterBouncePosition = s.maxTranslate();
                            doBounce = true;
                            allowMomentumBounce = true;
                        }
                        else {
                            newPosition = s.maxTranslate();
                        }
                    }
                    else if (newPosition > s.minTranslate()) {
                        if (s.params.freeModeMomentumBounce) {
                            if (newPosition - s.minTranslate() > bounceAmount) {
                                newPosition = s.minTranslate() + bounceAmount;
                            }
                            afterBouncePosition = s.minTranslate();
                            doBounce = true;
                            allowMomentumBounce = true;
                        }
                        else {
                            newPosition = s.minTranslate();
                        }
                    }
                    else if (s.params.freeModeSticky) {
                        var j = 0,
                            nextSlide;
                        for (j = 0; j < s.snapGrid.length; j += 1) {
                            if (s.snapGrid[j] > -newPosition) {
                                nextSlide = j;
                                break;
                            }

                        }
                        if (Math.abs(s.snapGrid[nextSlide] - newPosition) < Math.abs(s.snapGrid[nextSlide - 1] - newPosition) || s.swipeDirection === 'next') {
                            newPosition = s.snapGrid[nextSlide];
                        } else {
                            newPosition = s.snapGrid[nextSlide - 1];
                        }
                        if (!s.rtl) newPosition = - newPosition;
                    }
                    //Fix duration
                    if (s.velocity !== 0) {
                        if (s.rtl) {
                            momentumDuration = Math.abs((-newPosition - s.translate) / s.velocity);
                        }
                        else {
                            momentumDuration = Math.abs((newPosition - s.translate) / s.velocity);
                        }
                    }
                    else if (s.params.freeModeSticky) {
                        s.slideReset();
                        return;
                    }

                    if (s.params.freeModeMomentumBounce && doBounce) {
                        s.updateProgress(afterBouncePosition);
                        s.setWrapperTransition(momentumDuration);
                        s.setWrapperTranslate(newPosition);
                        s.onTransitionStart();
                        s.animating = true;
                        s.wrapper.transitionEnd(function () {
                            if (!s || !allowMomentumBounce) return;
                            s.emit('onMomentumBounce', s);

                            s.setWrapperTransition(s.params.speed);
                            s.setWrapperTranslate(afterBouncePosition);
                            s.wrapper.transitionEnd(function () {
                                if (!s) return;
                                s.onTransitionEnd();
                            });
                        });
                    } else if (s.velocity) {
                        s.updateProgress(newPosition);
                        s.setWrapperTransition(momentumDuration);
                        s.setWrapperTranslate(newPosition);
                        s.onTransitionStart();
                        if (!s.animating) {
                            s.animating = true;
                            s.wrapper.transitionEnd(function () {
                                if (!s) return;
                                s.onTransitionEnd();
                            });
                        }

                    } else {
                        s.updateProgress(newPosition);
                    }

                    s.updateActiveIndex();
                }
                if (!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs) {
                    s.updateProgress();
                    s.updateActiveIndex();
                }
                return;
            }

            // Find current slide
            var i, stopIndex = 0, groupSize = s.slidesSizesGrid[0];
            for (i = 0; i < s.slidesGrid.length; i += s.params.slidesPerGroup) {
                if (typeof s.slidesGrid[i + s.params.slidesPerGroup] !== 'undefined') {
                    if (currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup]) {
                        stopIndex = i;
                        groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i];
                    }
                }
                else {
                    if (currentPos >= s.slidesGrid[i]) {
                        stopIndex = i;
                        groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2];
                    }
                }
            }

            // Find current slide size
            var ratio = (currentPos - s.slidesGrid[stopIndex]) / groupSize;

            if (timeDiff > s.params.longSwipesMs) {
                // Long touches
                if (!s.params.longSwipes) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                if (s.swipeDirection === 'next') {
                    if (ratio >= s.params.longSwipesRatio) s.slideTo(stopIndex + s.params.slidesPerGroup);
                    else s.slideTo(stopIndex);

                }
                if (s.swipeDirection === 'prev') {
                    if (ratio > (1 - s.params.longSwipesRatio)) s.slideTo(stopIndex + s.params.slidesPerGroup);
                    else s.slideTo(stopIndex);
                }
            }
            else {
                // Short swipes
                if (!s.params.shortSwipes) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                if (s.swipeDirection === 'next') {
                    s.slideTo(stopIndex + s.params.slidesPerGroup);

                }
                if (s.swipeDirection === 'prev') {
                    s.slideTo(stopIndex);
                }
            }
        };
        /*=========================
          Transitions
          ===========================*/
        s._slideTo = function (slideIndex, speed) {
            return s.slideTo(slideIndex, speed, true, true);
        };
        s.slideTo = function (slideIndex, speed, runCallbacks, internal) {
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (typeof slideIndex === 'undefined') slideIndex = 0;
            if (slideIndex < 0) slideIndex = 0;
            s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup);
            if (s.snapIndex >= s.snapGrid.length) s.snapIndex = s.snapGrid.length - 1;

            var translate = - s.snapGrid[s.snapIndex];
            // Stop autoplay
            if (s.params.autoplay && s.autoplaying) {
                if (internal || !s.params.autoplayDisableOnInteraction) {
                    s.pauseAutoplay(speed);
                }
                else {
                    s.stopAutoplay();
                }
            }
            // Update progress
            s.updateProgress(translate);

            // Normalize slideIndex
            for (var i = 0; i < s.slidesGrid.length; i++) {
                if (- Math.floor(translate * 100) >= Math.floor(s.slidesGrid[i] * 100)) {
                    slideIndex = i;
                }
            }

            // Directions locks
            if (!s.params.allowSwipeToNext && translate < s.translate && translate < s.minTranslate()) {
                return false;
            }
            if (!s.params.allowSwipeToPrev && translate > s.translate && translate > s.maxTranslate()) {
                if ((s.activeIndex || 0) !== slideIndex ) return false;
            }

            // Update Index
            if (typeof speed === 'undefined') speed = s.params.speed;
            s.previousIndex = s.activeIndex || 0;
            s.activeIndex = slideIndex;

            if ((s.rtl && -translate === s.translate) || (!s.rtl && translate === s.translate)) {
                // Update Height
                if (s.params.autoHeight) {
                    s.updateAutoHeight();
                }
                s.updateClasses();
                if (s.params.effect !== 'slide') {
                    s.setWrapperTranslate(translate);
                }
                return false;
            }
            s.updateClasses();
            s.onTransitionStart(runCallbacks);

            if (speed === 0) {
                s.setWrapperTranslate(translate);
                s.setWrapperTransition(0);
                s.onTransitionEnd(runCallbacks);
            }
            else {
                s.setWrapperTranslate(translate);
                s.setWrapperTransition(speed);
                if (!s.animating) {
                    s.animating = true;
                    s.wrapper.transitionEnd(function () {
                        if (!s) return;
                        s.onTransitionEnd(runCallbacks);
                    });
                }

            }

            return true;
        };

        s.onTransitionStart = function (runCallbacks) {
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (s.params.autoHeight) {
                s.updateAutoHeight();
            }
            if (s.lazy) s.lazy.onTransitionStart();
            if (runCallbacks) {
                s.emit('onTransitionStart', s);
                if (s.activeIndex !== s.previousIndex) {
                    s.emit('onSlideChangeStart', s);
                    _scope.$emit("$ionicSlides.slideChangeStart", {
                      slider: s,
                      activeIndex: s.getSlideDataIndex(s.activeIndex),
                      previousIndex: s.getSlideDataIndex(s.previousIndex)
                    });
                    if (s.activeIndex > s.previousIndex) {
                        s.emit('onSlideNextStart', s);
                    }
                    else {
                        s.emit('onSlidePrevStart', s);
                    }
                }

            }
        };
        s.onTransitionEnd = function (runCallbacks) {
            s.animating = false;
            s.setWrapperTransition(0);
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (s.lazy) s.lazy.onTransitionEnd();
            if (runCallbacks) {
                s.emit('onTransitionEnd', s);
                if (s.activeIndex !== s.previousIndex) {
                    s.emit('onSlideChangeEnd', s);
                    _scope.$emit("$ionicSlides.slideChangeEnd", {
                      slider: s,
                      activeIndex: s.getSlideDataIndex(s.activeIndex),
                      previousIndex: s.getSlideDataIndex(s.previousIndex)
                    });
                    if (s.activeIndex > s.previousIndex) {
                        s.emit('onSlideNextEnd', s);
                    }
                    else {
                        s.emit('onSlidePrevEnd', s);
                    }
                }
            }
            if (s.params.hashnav && s.hashnav) {
                s.hashnav.setHash();
            }

        };
        s.slideNext = function (runCallbacks, speed, internal) {
            if (s.params.loop) {
                if (s.animating) return false;
                s.fixLoop();
                var clientLeft = s.container[0].clientLeft;
                return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
            }
            else return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
        };
        s._slideNext = function (speed) {
            return s.slideNext(true, speed, true);
        };
        s.slidePrev = function (runCallbacks, speed, internal) {
            if (s.params.loop) {
                if (s.animating) return false;
                s.fixLoop();
                var clientLeft = s.container[0].clientLeft;
                return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
            }
            else return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
        };
        s._slidePrev = function (speed) {
            return s.slidePrev(true, speed, true);
        };
        s.slideReset = function (runCallbacks, speed, internal) {
            return s.slideTo(s.activeIndex, speed, runCallbacks);
        };

        /*=========================
          Translate/transition helpers
          ===========================*/
        s.setWrapperTransition = function (duration, byController) {
            s.wrapper.transition(duration);
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                s.effects[s.params.effect].setTransition(duration);
            }
            if (s.params.parallax && s.parallax) {
                s.parallax.setTransition(duration);
            }
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.setTransition(duration);
            }
            if (s.params.control && s.controller) {
                s.controller.setTransition(duration, byController);
            }
            s.emit('onSetTransition', s, duration);
        };
        s.setWrapperTranslate = function (translate, updateActiveIndex, byController) {
            var x = 0, y = 0, z = 0;
            if (isH()) {
                x = s.rtl ? -translate : translate;
            }
            else {
                y = translate;
            }

            if (s.params.roundLengths) {
                x = round(x);
                y = round(y);
            }

            if (!s.params.virtualTranslate) {
                if (s.support.transforms3d) s.wrapper.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
                else s.wrapper.transform('translate(' + x + 'px, ' + y + 'px)');
            }

            s.translate = isH() ? x : y;

            // Check if we need to update progress
            var progress;
            var translatesDiff = s.maxTranslate() - s.minTranslate();
            if (translatesDiff === 0) {
                progress = 0;
            }
            else {
                progress = (translate - s.minTranslate()) / (translatesDiff);
            }
            if (progress !== s.progress) {
                s.updateProgress(translate);
            }

            if (updateActiveIndex) s.updateActiveIndex();
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                s.effects[s.params.effect].setTranslate(s.translate);
            }
            if (s.params.parallax && s.parallax) {
                s.parallax.setTranslate(s.translate);
            }
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.setTranslate(s.translate);
            }
            if (s.params.control && s.controller) {
                s.controller.setTranslate(s.translate, byController);
            }
            s.emit('onSetTranslate', s, s.translate);
        };

        s.getTranslate = function (el, axis) {
            var matrix, curTransform, curStyle, transformMatrix;

            // automatic axis detection
            if (typeof axis === 'undefined') {
                axis = 'x';
            }

            if (s.params.virtualTranslate) {
                return s.rtl ? -s.translate : s.translate;
            }

            curStyle = window.getComputedStyle(el, null);
            if (window.WebKitCSSMatrix) {
                curTransform = curStyle.transform || curStyle.webkitTransform;
                if (curTransform.split(',').length > 6) {
                    curTransform = curTransform.split(', ').map(function(a){
                        return a.replace(',','.');
                    }).join(', ');
                }
                // Some old versions of Webkit choke when 'none' is passed; pass
                // empty string instead in this case
                transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
            }
            else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
                matrix = transformMatrix.toString().split(',');
            }

            if (axis === 'x') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m41;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[12]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[4]);
            }
            if (axis === 'y') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m42;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[13]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[5]);
            }
            if (s.rtl && curTransform) curTransform = -curTransform;
            return curTransform || 0;
        };
        s.getWrapperTranslate = function (axis) {
            if (typeof axis === 'undefined') {
                axis = isH() ? 'x' : 'y';
            }
            return s.getTranslate(s.wrapper[0], axis);
        };

        /*=========================
          Observer
          ===========================*/
        s.observers = [];
        function initObserver(target, options) {
            options = options || {};
            // create an observer instance
            var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            var observer = new ObserverFunc(function (mutations) {
                mutations.forEach(function (mutation) {
                    s.onResize(true);
                    s.emit('onObserverUpdate', s, mutation);
                });
            });

            observer.observe(target, {
                attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
                childList: typeof options.childList === 'undefined' ? true : options.childList,
                characterData: typeof options.characterData === 'undefined' ? true : options.characterData
            });

            s.observers.push(observer);
        }
        s.initObservers = function () {
            if (s.params.observeParents) {
                var containerParents = s.container.parents();
                for (var i = 0; i < containerParents.length; i++) {
                    initObserver(containerParents[i]);
                }
            }

            // Observe container
            initObserver(s.container[0], {childList: false});

            // Observe wrapper
            initObserver(s.wrapper[0], {attributes: false});
        };
        s.disconnectObservers = function () {
            for (var i = 0; i < s.observers.length; i++) {
                s.observers[i].disconnect();
            }
            s.observers = [];
        };

        s.updateLoop = function(){
          var currentSlide = s.slides.eq(s.activeIndex);
          if ( angular.element(currentSlide).hasClass(s.params.slideDuplicateClass) ){
            // we're on a duplicate, so slide to the non-duplicate
            var swiperSlideIndex = angular.element(currentSlide).attr("data-swiper-slide-index");
            var slides = s.wrapper.children('.' + s.params.slideClass);
            for ( var i = 0; i < slides.length; i++ ){
              if ( !angular.element(slides[i]).hasClass(s.params.slideDuplicateClass) && angular.element(slides[i]).attr("data-swiper-slide-index") === swiperSlideIndex ){
                s.slideTo(i, 0, false, true);
                break;
              }
            }
            // if we needed to switch slides, we did that.  So, now call the createLoop function internally
            setTimeout(function(){
              s.createLoop();
            }, 50);
          }
        }

        s.getSlideDataIndex = function(slideIndex){
          // this is an Ionic custom function
          // Swiper loops utilize duplicate DOM elements for slides when in a loop
          // which means that we cannot rely on the actual slide index for our events
          // because index 0 does not necessarily point to index 0
          // and index n+1 does not necessarily point to the expected piece of data
          // therefore, rather than using the actual slide index we should
          // use the data index that swiper includes as an attribute on the dom elements
          // because this is what will be meaningful to the consumer of our events
          var slide = s.slides.eq(slideIndex);
          var attributeIndex = angular.element(slide).attr("data-swiper-slide-index");
          return parseInt(attributeIndex);
        }

        /*=========================
          Loop
          ===========================*/
        // Create looped slides
        s.createLoop = function () {
          //console.log("Slider create loop method");
            //var toRemove = s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass);
            //angular.element(toRemove).remove();
            s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();

            var slides = s.wrapper.children('.' + s.params.slideClass);

            if(s.params.slidesPerView === 'auto' && !s.params.loopedSlides) s.params.loopedSlides = slides.length;

            s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView, 10);
            s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides;
            if (s.loopedSlides > slides.length) {
                s.loopedSlides = slides.length;
            }

            var prependSlides = [], appendSlides = [], i, scope, newNode;
            slides.each(function (index, el) {
                var slide = $(this);
                if (index < s.loopedSlides) appendSlides.push(el);
                if (index < slides.length && index >= slides.length - s.loopedSlides) prependSlides.push(el);
                slide.attr('data-swiper-slide-index', index);
            });
            for (i = 0; i < appendSlides.length; i++) {

              newNode = angular.element(appendSlides[i]).clone().addClass(s.params.slideDuplicateClass);
              newNode.removeAttr('ng-transclude');
              newNode.removeAttr('ng-repeat');
              scope = angular.element(appendSlides[i]).scope();
              newNode = $compile(newNode)(scope);
              angular.element(s.wrapper).append(newNode);
              //s.wrapper.append($(appendSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
            }
            for (i = prependSlides.length - 1; i >= 0; i--) {
              //s.wrapper.prepend($(prependSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));

              newNode = angular.element(prependSlides[i]).clone().addClass(s.params.slideDuplicateClass);
              newNode.removeAttr('ng-transclude');
              newNode.removeAttr('ng-repeat');

              scope = angular.element(prependSlides[i]).scope();
              newNode = $compile(newNode)(scope);
              angular.element(s.wrapper).prepend(newNode);
            }
        };
        s.destroyLoop = function () {
            s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();
            s.slides.removeAttr('data-swiper-slide-index');
        };
        s.fixLoop = function () {
            var newIndex;
            //Fix For Negative Oversliding
            if (s.activeIndex < s.loopedSlides) {
                newIndex = s.slides.length - s.loopedSlides * 3 + s.activeIndex;
                newIndex = newIndex + s.loopedSlides;
                s.slideTo(newIndex, 0, false, true);
            }
            //Fix For Positive Oversliding
            else if ((s.params.slidesPerView === 'auto' && s.activeIndex >= s.loopedSlides * 2) || (s.activeIndex > s.slides.length - s.params.slidesPerView * 2)) {
                newIndex = -s.slides.length + s.activeIndex + s.loopedSlides;
                newIndex = newIndex + s.loopedSlides;
                s.slideTo(newIndex, 0, false, true);
            }
        };
        /*=========================
          Append/Prepend/Remove Slides
          ===========================*/
        s.appendSlide = function (slides) {
            if (s.params.loop) {
                s.destroyLoop();
            }
            if (typeof slides === 'object' && slides.length) {
                for (var i = 0; i < slides.length; i++) {
                    if (slides[i]) s.wrapper.append(slides[i]);
                }
            }
            else {
                s.wrapper.append(slides);
            }
            if (s.params.loop) {
                s.createLoop();
            }
            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
        };
        s.prependSlide = function (slides) {
            if (s.params.loop) {
                s.destroyLoop();
            }
            var newActiveIndex = s.activeIndex + 1;
            if (typeof slides === 'object' && slides.length) {
                for (var i = 0; i < slides.length; i++) {
                    if (slides[i]) s.wrapper.prepend(slides[i]);
                }
                newActiveIndex = s.activeIndex + slides.length;
            }
            else {
                s.wrapper.prepend(slides);
            }
            if (s.params.loop) {
                s.createLoop();
            }
            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
            s.slideTo(newActiveIndex, 0, false);
        };
        s.removeSlide = function (slidesIndexes) {
            if (s.params.loop) {
                s.destroyLoop();
                s.slides = s.wrapper.children('.' + s.params.slideClass);
            }
            var newActiveIndex = s.activeIndex,
                indexToRemove;
            if (typeof slidesIndexes === 'object' && slidesIndexes.length) {
                for (var i = 0; i < slidesIndexes.length; i++) {
                    indexToRemove = slidesIndexes[i];
                    if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
                    if (indexToRemove < newActiveIndex) newActiveIndex--;
                }
                newActiveIndex = Math.max(newActiveIndex, 0);
            }
            else {
                indexToRemove = slidesIndexes;
                if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
                if (indexToRemove < newActiveIndex) newActiveIndex--;
                newActiveIndex = Math.max(newActiveIndex, 0);
            }

            if (s.params.loop) {
                s.createLoop();
            }

            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
            if (s.params.loop) {
                s.slideTo(newActiveIndex + s.loopedSlides, 0, false);
            }
            else {
                s.slideTo(newActiveIndex, 0, false);
            }

        };
        s.removeAllSlides = function () {
            var slidesIndexes = [];
            for (var i = 0; i < s.slides.length; i++) {
                slidesIndexes.push(i);
            }
            s.removeSlide(slidesIndexes);
        };


        /*=========================
          Effects
          ===========================*/
        s.effects = {
            fade: {
                setTranslate: function () {
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides.eq(i);
                        var offset = slide[0].swiperSlideOffset;
                        var tx = -offset;
                        if (!s.params.virtualTranslate) tx = tx - s.translate;
                        var ty = 0;
                        if (!isH()) {
                            ty = tx;
                            tx = 0;
                        }
                        var slideOpacity = s.params.fade.crossFade ?
                                Math.max(1 - Math.abs(slide[0].progress), 0) :
                                1 + Math.min(Math.max(slide[0].progress, -1), 0);
                        slide
                            .css({
                                opacity: slideOpacity
                            })
                            .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px)');

                    }

                },
                setTransition: function (duration) {
                    s.slides.transition(duration);
                    if (s.params.virtualTranslate && duration !== 0) {
                        var eventTriggered = false;
                        s.slides.transitionEnd(function () {
                            if (eventTriggered) return;
                            if (!s) return;
                            eventTriggered = true;
                            s.animating = false;
                            var triggerEvents = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
                            for (var i = 0; i < triggerEvents.length; i++) {
                                s.wrapper.trigger(triggerEvents[i]);
                            }
                        });
                    }
                }
            },
            cube: {
                setTranslate: function () {
                    var wrapperRotate = 0, cubeShadow;
                    if (s.params.cube.shadow) {
                        if (isH()) {
                            cubeShadow = s.wrapper.find('.swiper-cube-shadow');
                            if (cubeShadow.length === 0) {
                                cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                                s.wrapper.append(cubeShadow);
                            }
                            cubeShadow.css({height: s.width + 'px'});
                        }
                        else {
                            cubeShadow = s.container.find('.swiper-cube-shadow');
                            if (cubeShadow.length === 0) {
                                cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                                s.container.append(cubeShadow);
                            }
                        }
                    }
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides.eq(i);
                        var slideAngle = i * 90;
                        var round = Math.floor(slideAngle / 360);
                        if (s.rtl) {
                            slideAngle = -slideAngle;
                            round = Math.floor(-slideAngle / 360);
                        }
                        var progress = Math.max(Math.min(slide[0].progress, 1), -1);
                        var tx = 0, ty = 0, tz = 0;
                        if (i % 4 === 0) {
                            tx = - round * 4 * s.size;
                            tz = 0;
                        }
                        else if ((i - 1) % 4 === 0) {
                            tx = 0;
                            tz = - round * 4 * s.size;
                        }
                        else if ((i - 2) % 4 === 0) {
                            tx = s.size + round * 4 * s.size;
                            tz = s.size;
                        }
                        else if ((i - 3) % 4 === 0) {
                            tx = - s.size;
                            tz = 3 * s.size + s.size * 4 * round;
                        }
                        if (s.rtl) {
                            tx = -tx;
                        }

                        if (!isH()) {
                            ty = tx;
                            tx = 0;
                        }

                        var transform = 'rotateX(' + (isH() ? 0 : -slideAngle) + 'deg) rotateY(' + (isH() ? slideAngle : 0) + 'deg) translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px)';
                        if (progress <= 1 && progress > -1) {
                            wrapperRotate = i * 90 + progress * 90;
                            if (s.rtl) wrapperRotate = -i * 90 - progress * 90;
                        }
                        slide.transform(transform);
                        if (s.params.cube.slideShadows) {
                            //Set shadows
                            var shadowBefore = isH() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                            var shadowAfter = isH() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                            if (shadowBefore.length === 0) {
                                shadowBefore = $('<div class="swiper-slide-shadow-' + (isH() ? 'left' : 'top') + '"></div>');
                                slide.append(shadowBefore);
                            }
                            if (shadowAfter.length === 0) {
                                shadowAfter = $('<div class="swiper-slide-shadow-' + (isH() ? 'right' : 'bottom') + '"></div>');
                                slide.append(shadowAfter);
                            }
                            var shadowOpacity = slide[0].progress;
                            if (shadowBefore.length) shadowBefore[0].style.opacity = -slide[0].progress;
                            if (shadowAfter.length) shadowAfter[0].style.opacity = slide[0].progress;
                        }
                    }
                    s.wrapper.css({
                        '-webkit-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        '-moz-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        '-ms-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        'transform-origin': '50% 50% -' + (s.size / 2) + 'px'
                    });

                    if (s.params.cube.shadow) {
                        if (isH()) {
                            cubeShadow.transform('translate3d(0px, ' + (s.width / 2 + s.params.cube.shadowOffset) + 'px, ' + (-s.width / 2) + 'px) rotateX(90deg) rotateZ(0deg) scale(' + (s.params.cube.shadowScale) + ')');
                        }
                        else {
                            var shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
                            var multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
                            var scale1 = s.params.cube.shadowScale,
                                scale2 = s.params.cube.shadowScale / multiplier,
                                offset = s.params.cube.shadowOffset;
                            cubeShadow.transform('scale3d(' + scale1 + ', 1, ' + scale2 + ') translate3d(0px, ' + (s.height / 2 + offset) + 'px, ' + (-s.height / 2 / scale2) + 'px) rotateX(-90deg)');
                        }
                    }
                    var zFactor = (s.isSafari || s.isUiWebView) ? (-s.size / 2) : 0;
                    s.wrapper.transform('translate3d(0px,0,' + zFactor + 'px) rotateX(' + (isH() ? 0 : wrapperRotate) + 'deg) rotateY(' + (isH() ? -wrapperRotate : 0) + 'deg)');
                },
                setTransition: function (duration) {
                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                    if (s.params.cube.shadow && !isH()) {
                        s.container.find('.swiper-cube-shadow').transition(duration);
                    }
                }
            },
            coverflow: {
                setTranslate: function () {
                    var transform = s.translate;
                    var center = isH() ? -transform + s.width / 2 : -transform + s.height / 2;
                    var rotate = isH() ? s.params.coverflow.rotate: -s.params.coverflow.rotate;
                    var translate = s.params.coverflow.depth;
                    //Each slide offset from center
                    for (var i = 0, length = s.slides.length; i < length; i++) {
                        var slide = s.slides.eq(i);
                        var slideSize = s.slidesSizesGrid[i];
                        var slideOffset = slide[0].swiperSlideOffset;
                        var offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * s.params.coverflow.modifier;

                        var rotateY = isH() ? rotate * offsetMultiplier : 0;
                        var rotateX = isH() ? 0 : rotate * offsetMultiplier;
                        // var rotateZ = 0
                        var translateZ = -translate * Math.abs(offsetMultiplier);

                        var translateY = isH() ? 0 : s.params.coverflow.stretch * (offsetMultiplier);
                        var translateX = isH() ? s.params.coverflow.stretch * (offsetMultiplier) : 0;

                        //Fix for ultra small values
                        if (Math.abs(translateX) < 0.001) translateX = 0;
                        if (Math.abs(translateY) < 0.001) translateY = 0;
                        if (Math.abs(translateZ) < 0.001) translateZ = 0;
                        if (Math.abs(rotateY) < 0.001) rotateY = 0;
                        if (Math.abs(rotateX) < 0.001) rotateX = 0;

                        var slideTransform = 'translate3d(' + translateX + 'px,' + translateY + 'px,' + translateZ + 'px)  rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';

                        slide.transform(slideTransform);
                        slide[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
                        if (s.params.coverflow.slideShadows) {
                            //Set shadows
                            var shadowBefore = isH() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                            var shadowAfter = isH() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                            if (shadowBefore.length === 0) {
                                shadowBefore = $('<div class="swiper-slide-shadow-' + (isH() ? 'left' : 'top') + '"></div>');
                                slide.append(shadowBefore);
                            }
                            if (shadowAfter.length === 0) {
                                shadowAfter = $('<div class="swiper-slide-shadow-' + (isH() ? 'right' : 'bottom') + '"></div>');
                                slide.append(shadowAfter);
                            }
                            if (shadowBefore.length) shadowBefore[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
                            if (shadowAfter.length) shadowAfter[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
                        }
                    }

                    //Set correct perspective for IE10
                    if (s.browser.ie) {
                        var ws = s.wrapper[0].style;
                        ws.perspectiveOrigin = center + 'px 50%';
                    }
                },
                setTransition: function (duration) {
                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                }
            }
        };

        /*=========================
          Images Lazy Loading
          ===========================*/
        s.lazy = {
            initialImageLoaded: false,
            loadImageInSlide: function (index, loadInDuplicate) {
                if (typeof index === 'undefined') return;
                if (typeof loadInDuplicate === 'undefined') loadInDuplicate = true;
                if (s.slides.length === 0) return;

                var slide = s.slides.eq(index);
                var img = slide.find('.swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)');
                if (slide.hasClass('swiper-lazy') && !slide.hasClass('swiper-lazy-loaded') && !slide.hasClass('swiper-lazy-loading')) {
                    img = img.add(slide[0]);
                }
                if (img.length === 0) return;

                img.each(function () {
                    var _img = $(this);
                    _img.addClass('swiper-lazy-loading');
                    var background = _img.attr('data-background');
                    var src = _img.attr('data-src'),
                        srcset = _img.attr('data-srcset');
                    s.loadImage(_img[0], (src || background), srcset, false, function () {
                        if (background) {
                            _img.css('background-image', 'url(' + background + ')');
                            _img.removeAttr('data-background');
                        }
                        else {
                            if (srcset) {
                                _img.attr('srcset', srcset);
                                _img.removeAttr('data-srcset');
                            }
                            if (src) {
                                _img.attr('src', src);
                                _img.removeAttr('data-src');
                            }

                        }

                        _img.addClass('swiper-lazy-loaded').removeClass('swiper-lazy-loading');
                        slide.find('.swiper-lazy-preloader, .preloader').remove();
                        if (s.params.loop && loadInDuplicate) {
                            var slideOriginalIndex = slide.attr('data-swiper-slide-index');
                            if (slide.hasClass(s.params.slideDuplicateClass)) {
                                var originalSlide = s.wrapper.children('[data-swiper-slide-index="' + slideOriginalIndex + '"]:not(.' + s.params.slideDuplicateClass + ')');
                                s.lazy.loadImageInSlide(originalSlide.index(), false);
                            }
                            else {
                                var duplicatedSlide = s.wrapper.children('.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + slideOriginalIndex + '"]');
                                s.lazy.loadImageInSlide(duplicatedSlide.index(), false);
                            }
                        }
                        s.emit('onLazyImageReady', s, slide[0], _img[0]);
                    });

                    s.emit('onLazyImageLoad', s, slide[0], _img[0]);
                });

            },
            load: function () {
                var i;
                if (s.params.watchSlidesVisibility) {
                    s.wrapper.children('.' + s.params.slideVisibleClass).each(function () {
                        s.lazy.loadImageInSlide($(this).index());
                    });
                }
                else {
                    if (s.params.slidesPerView > 1) {
                        for (i = s.activeIndex; i < s.activeIndex + s.params.slidesPerView ; i++) {
                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
                        }
                    }
                    else {
                        s.lazy.loadImageInSlide(s.activeIndex);
                    }
                }
                if (s.params.lazyLoadingInPrevNext) {
                    if (s.params.slidesPerView > 1) {
                        // Next Slides
                        for (i = s.activeIndex + s.params.slidesPerView; i < s.activeIndex + s.params.slidesPerView + s.params.slidesPerView; i++) {
                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
                        }
                        // Prev Slides
                        for (i = s.activeIndex - s.params.slidesPerView; i < s.activeIndex ; i++) {
                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
                        }
                    }
                    else {
                        var nextSlide = s.wrapper.children('.' + s.params.slideNextClass);
                        if (nextSlide.length > 0) s.lazy.loadImageInSlide(nextSlide.index());

                        var prevSlide = s.wrapper.children('.' + s.params.slidePrevClass);
                        if (prevSlide.length > 0) s.lazy.loadImageInSlide(prevSlide.index());
                    }
                }
            },
            onTransitionStart: function () {
                if (s.params.lazyLoading) {
                    if (s.params.lazyLoadingOnTransitionStart || (!s.params.lazyLoadingOnTransitionStart && !s.lazy.initialImageLoaded)) {
                        s.lazy.load();
                    }
                }
            },
            onTransitionEnd: function () {
                if (s.params.lazyLoading && !s.params.lazyLoadingOnTransitionStart) {
                    s.lazy.load();
                }
            }
        };


        /*=========================
          Scrollbar
          ===========================*/
        s.scrollbar = {
            isTouched: false,
            setDragPosition: function (e) {
                var sb = s.scrollbar;
                var x = 0, y = 0;
                var translate;
                var pointerPosition = isH() ?
                    ((e.type === 'touchstart' || e.type === 'touchmove') ? e.targetTouches[0].pageX : e.pageX || e.clientX) :
                    ((e.type === 'touchstart' || e.type === 'touchmove') ? e.targetTouches[0].pageY : e.pageY || e.clientY) ;
                var position = (pointerPosition) - sb.track.offset()[isH() ? 'left' : 'top'] - sb.dragSize / 2;
                var positionMin = -s.minTranslate() * sb.moveDivider;
                var positionMax = -s.maxTranslate() * sb.moveDivider;
                if (position < positionMin) {
                    position = positionMin;
                }
                else if (position > positionMax) {
                    position = positionMax;
                }
                position = -position / sb.moveDivider;
                s.updateProgress(position);
                s.setWrapperTranslate(position, true);
            },
            dragStart: function (e) {
                var sb = s.scrollbar;
                sb.isTouched = true;
                e.preventDefault();
                e.stopPropagation();

                sb.setDragPosition(e);
                clearTimeout(sb.dragTimeout);

                sb.track.transition(0);
                if (s.params.scrollbarHide) {
                    sb.track.css('opacity', 1);
                }
                s.wrapper.transition(100);
                sb.drag.transition(100);
                s.emit('onScrollbarDragStart', s);
            },
            dragMove: function (e) {
                var sb = s.scrollbar;
                if (!sb.isTouched) return;
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false;
                sb.setDragPosition(e);
                s.wrapper.transition(0);
                sb.track.transition(0);
                sb.drag.transition(0);
                s.emit('onScrollbarDragMove', s);
            },
            dragEnd: function (e) {
                var sb = s.scrollbar;
                if (!sb.isTouched) return;
                sb.isTouched = false;
                if (s.params.scrollbarHide) {
                    clearTimeout(sb.dragTimeout);
                    sb.dragTimeout = setTimeout(function () {
                        sb.track.css('opacity', 0);
                        sb.track.transition(400);
                    }, 1000);

                }
                s.emit('onScrollbarDragEnd', s);
                if (s.params.scrollbarSnapOnRelease) {
                    s.slideReset();
                }
            },
            enableDraggable: function () {
                var sb = s.scrollbar;
                var target = s.support.touch ? sb.track : document;
                $(sb.track).on(s.touchEvents.start, sb.dragStart);
                $(target).on(s.touchEvents.move, sb.dragMove);
                $(target).on(s.touchEvents.end, sb.dragEnd);
            },
            disableDraggable: function () {
                var sb = s.scrollbar;
                var target = s.support.touch ? sb.track : document;
                $(sb.track).off(s.touchEvents.start, sb.dragStart);
                $(target).off(s.touchEvents.move, sb.dragMove);
                $(target).off(s.touchEvents.end, sb.dragEnd);
            },
            set: function () {
                if (!s.params.scrollbar) return;
                var sb = s.scrollbar;
                sb.track = $(s.params.scrollbar);
                sb.drag = sb.track.find('.swiper-scrollbar-drag');
                if (sb.drag.length === 0) {
                    sb.drag = $('<div class="swiper-scrollbar-drag"></div>');
                    sb.track.append(sb.drag);
                }
                sb.drag[0].style.width = '';
                sb.drag[0].style.height = '';
                sb.trackSize = isH() ? sb.track[0].offsetWidth : sb.track[0].offsetHeight;

                sb.divider = s.size / s.virtualSize;
                sb.moveDivider = sb.divider * (sb.trackSize / s.size);
                sb.dragSize = sb.trackSize * sb.divider;

                if (isH()) {
                    sb.drag[0].style.width = sb.dragSize + 'px';
                }
                else {
                    sb.drag[0].style.height = sb.dragSize + 'px';
                }

                if (sb.divider >= 1) {
                    sb.track[0].style.display = 'none';
                }
                else {
                    sb.track[0].style.display = '';
                }
                if (s.params.scrollbarHide) {
                    sb.track[0].style.opacity = 0;
                }
            },
            setTranslate: function () {
                if (!s.params.scrollbar) return;
                var diff;
                var sb = s.scrollbar;
                var translate = s.translate || 0;
                var newPos;

                var newSize = sb.dragSize;
                newPos = (sb.trackSize - sb.dragSize) * s.progress;
                if (s.rtl && isH()) {
                    newPos = -newPos;
                    if (newPos > 0) {
                        newSize = sb.dragSize - newPos;
                        newPos = 0;
                    }
                    else if (-newPos + sb.dragSize > sb.trackSize) {
                        newSize = sb.trackSize + newPos;
                    }
                }
                else {
                    if (newPos < 0) {
                        newSize = sb.dragSize + newPos;
                        newPos = 0;
                    }
                    else if (newPos + sb.dragSize > sb.trackSize) {
                        newSize = sb.trackSize - newPos;
                    }
                }
                if (isH()) {
                    if (s.support.transforms3d) {
                        sb.drag.transform('translate3d(' + (newPos) + 'px, 0, 0)');
                    }
                    else {
                        sb.drag.transform('translateX(' + (newPos) + 'px)');
                    }
                    sb.drag[0].style.width = newSize + 'px';
                }
                else {
                    if (s.support.transforms3d) {
                        sb.drag.transform('translate3d(0px, ' + (newPos) + 'px, 0)');
                    }
                    else {
                        sb.drag.transform('translateY(' + (newPos) + 'px)');
                    }
                    sb.drag[0].style.height = newSize + 'px';
                }
                if (s.params.scrollbarHide) {
                    clearTimeout(sb.timeout);
                    sb.track[0].style.opacity = 1;
                    sb.timeout = setTimeout(function () {
                        sb.track[0].style.opacity = 0;
                        sb.track.transition(400);
                    }, 1000);
                }
            },
            setTransition: function (duration) {
                if (!s.params.scrollbar) return;
                s.scrollbar.drag.transition(duration);
            }
        };

        /*=========================
          Controller
          ===========================*/
        s.controller = {
            LinearSpline: function (x, y) {
                this.x = x;
                this.y = y;
                this.lastIndex = x.length - 1;
                // Given an x value (x2), return the expected y2 value:
                // (x1,y1) is the known point before given value,
                // (x3,y3) is the known point after given value.
                var i1, i3;
                var l = this.x.length;

                this.interpolate = function (x2) {
                    if (!x2) return 0;

                    // Get the indexes of x1 and x3 (the array indexes before and after given x2):
                    i3 = binarySearch(this.x, x2);
                    i1 = i3 - 1;

                    // We have our indexes i1 & i3, so we can calculate already:
                    // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1
                    return ((x2 - this.x[i1]) * (this.y[i3] - this.y[i1])) / (this.x[i3] - this.x[i1]) + this.y[i1];
                };

                var binarySearch = (function() {
                    var maxIndex, minIndex, guess;
                    return function(array, val) {
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
            //xxx: for now i will just save one spline function to to
            getInterpolateFunction: function(c){
                if(!s.controller.spline) s.controller.spline = s.params.loop ?
                    new s.controller.LinearSpline(s.slidesGrid, c.slidesGrid) :
                    new s.controller.LinearSpline(s.snapGrid, c.snapGrid);
            },
            setTranslate: function (translate, byController) {
               var controlled = s.params.control;
               var multiplier, controlledTranslate;
               function setControlledTranslate(c) {
                    // this will create an Interpolate function based on the snapGrids
                    // x is the Grid of the scrolled scroller and y will be the controlled scroller
                    // it makes sense to create this only once and recall it for the interpolation
                    // the function does a lot of value caching for performance
                    translate = c.rtl && c.params.direction === 'horizontal' ? -s.translate : s.translate;
                    if (s.params.controlBy === 'slide') {
                        s.controller.getInterpolateFunction(c);
                        // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
                        // but it did not work out
                        controlledTranslate = -s.controller.spline.interpolate(-translate);
                    }

                    if(!controlledTranslate || s.params.controlBy === 'container'){
                        multiplier = (c.maxTranslate() - c.minTranslate()) / (s.maxTranslate() - s.minTranslate());
                        controlledTranslate = (translate - s.minTranslate()) * multiplier + c.minTranslate();
                    }

                    if (s.params.controlInverse) {
                        controlledTranslate = c.maxTranslate() - controlledTranslate;
                    }
                    c.updateProgress(controlledTranslate);
                    c.setWrapperTranslate(controlledTranslate, false, s);
                    c.updateActiveIndex();
               }
               if (s.isArray(controlled)) {
                   for (var i = 0; i < controlled.length; i++) {
                       if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                           setControlledTranslate(controlled[i]);
                       }
                   }
               }
               else if (controlled instanceof Swiper && byController !== controlled) {

                   setControlledTranslate(controlled);
               }
            },
            setTransition: function (duration, byController) {
                var controlled = s.params.control;
                var i;
                function setControlledTransition(c) {
                    c.setWrapperTransition(duration, s);
                    if (duration !== 0) {
                        c.onTransitionStart();
                        c.wrapper.transitionEnd(function(){
                            if (!controlled) return;
                            if (c.params.loop && s.params.controlBy === 'slide') {
                                c.fixLoop();
                            }
                            c.onTransitionEnd();

                        });
                    }
                }
                if (s.isArray(controlled)) {
                    for (i = 0; i < controlled.length; i++) {
                        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                            setControlledTransition(controlled[i]);
                        }
                    }
                }
                else if (controlled instanceof Swiper && byController !== controlled) {
                    setControlledTransition(controlled);
                }
            }
        };

        /*=========================
          Hash Navigation
          ===========================*/
        s.hashnav = {
            init: function () {
                if (!s.params.hashnav) return;
                s.hashnav.initialized = true;
                var hash = document.location.hash.replace('#', '');
                if (!hash) return;
                var speed = 0;
                for (var i = 0, length = s.slides.length; i < length; i++) {
                    var slide = s.slides.eq(i);
                    var slideHash = slide.attr('data-hash');
                    if (slideHash === hash && !slide.hasClass(s.params.slideDuplicateClass)) {
                        var index = slide.index();
                        s.slideTo(index, speed, s.params.runCallbacksOnInit, true);
                    }
                }
            },
            setHash: function () {
                if (!s.hashnav.initialized || !s.params.hashnav) return;
                document.location.hash = s.slides.eq(s.activeIndex).attr('data-hash') || '';
            }
        };

        /*=========================
          Keyboard Control
          ===========================*/
        function handleKeyboard(e) {
            if (e.originalEvent) e = e.originalEvent; //jquery fix
            var kc = e.keyCode || e.charCode;
            // Directions locks
            if (!s.params.allowSwipeToNext && (isH() && kc === 39 || !isH() && kc === 40)) {
                return false;
            }
            if (!s.params.allowSwipeToPrev && (isH() && kc === 37 || !isH() && kc === 38)) {
                return false;
            }
            if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
                return;
            }
            if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
                return;
            }
            if (kc === 37 || kc === 39 || kc === 38 || kc === 40) {
                var inView = false;
                //Check that swiper should be inside of visible area of window
                if (s.container.parents('.swiper-slide').length > 0 && s.container.parents('.swiper-slide-active').length === 0) {
                    return;
                }
                var windowScroll = {
                    left: window.pageXOffset,
                    top: window.pageYOffset
                };
                var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                var swiperOffset = s.container.offset();
                if (s.rtl) swiperOffset.left = swiperOffset.left - s.container[0].scrollLeft;
                var swiperCoord = [
                    [swiperOffset.left, swiperOffset.top],
                    [swiperOffset.left + s.width, swiperOffset.top],
                    [swiperOffset.left, swiperOffset.top + s.height],
                    [swiperOffset.left + s.width, swiperOffset.top + s.height]
                ];
                for (var i = 0; i < swiperCoord.length; i++) {
                    var point = swiperCoord[i];
                    if (
                        point[0] >= windowScroll.left && point[0] <= windowScroll.left + windowWidth &&
                        point[1] >= windowScroll.top && point[1] <= windowScroll.top + windowHeight
                    ) {
                        inView = true;
                    }

                }
                if (!inView) return;
            }
            if (isH()) {
                if (kc === 37 || kc === 39) {
                    if (e.preventDefault) e.preventDefault();
                    else e.returnValue = false;
                }
                if ((kc === 39 && !s.rtl) || (kc === 37 && s.rtl)) s.slideNext();
                if ((kc === 37 && !s.rtl) || (kc === 39 && s.rtl)) s.slidePrev();
            }
            else {
                if (kc === 38 || kc === 40) {
                    if (e.preventDefault) e.preventDefault();
                    else e.returnValue = false;
                }
                if (kc === 40) s.slideNext();
                if (kc === 38) s.slidePrev();
            }
        }
        s.disableKeyboardControl = function () {
            s.params.keyboardControl = false;
            $(document).off('keydown', handleKeyboard);
        };
        s.enableKeyboardControl = function () {
            s.params.keyboardControl = true;
            $(document).on('keydown', handleKeyboard);
        };


        /*=========================
          Mousewheel Control
          ===========================*/
        s.mousewheel = {
            event: false,
            lastScrollTime: (new window.Date()).getTime()
        };
        if (s.params.mousewheelControl) {
            try {
                new window.WheelEvent('wheel');
                s.mousewheel.event = 'wheel';
            } catch (e) {}

            if (!s.mousewheel.event && document.onmousewheel !== undefined) {
                s.mousewheel.event = 'mousewheel';
            }
            if (!s.mousewheel.event) {
                s.mousewheel.event = 'DOMMouseScroll';
            }
        }
        function handleMousewheel(e) {
            if (e.originalEvent) e = e.originalEvent; //jquery fix
            var we = s.mousewheel.event;
            var delta = 0;
            var rtlFactor = s.rtl ? -1 : 1;
            //Opera & IE
            if (e.detail) delta = -e.detail;
            //WebKits
            else if (we === 'mousewheel') {
                if (s.params.mousewheelForceToAxis) {
                    if (isH()) {
                        if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) delta = e.wheelDeltaX * rtlFactor;
                        else return;
                    }
                    else {
                        if (Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)) delta = e.wheelDeltaY;
                        else return;
                    }
                }
                else {
                    delta = Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY) ? - e.wheelDeltaX * rtlFactor : - e.wheelDeltaY;
                }
            }
            //Old FireFox
            else if (we === 'DOMMouseScroll') delta = -e.detail;
            //New FireFox
            else if (we === 'wheel') {
                if (s.params.mousewheelForceToAxis) {
                    if (isH()) {
                        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) delta = -e.deltaX * rtlFactor;
                        else return;
                    }
                    else {
                        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) delta = -e.deltaY;
                        else return;
                    }
                }
                else {
                    delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? - e.deltaX * rtlFactor : - e.deltaY;
                }
            }
            if (delta === 0) return;

            if (s.params.mousewheelInvert) delta = -delta;

            if (!s.params.freeMode) {
                if ((new window.Date()).getTime() - s.mousewheel.lastScrollTime > 60) {
                    if (delta < 0) {
                        if ((!s.isEnd || s.params.loop) && !s.animating) s.slideNext();
                        else if (s.params.mousewheelReleaseOnEdges) return true;
                    }
                    else {
                        if ((!s.isBeginning || s.params.loop) && !s.animating) s.slidePrev();
                        else if (s.params.mousewheelReleaseOnEdges) return true;
                    }
                }
                s.mousewheel.lastScrollTime = (new window.Date()).getTime();

            }
            else {
                //Freemode or scrollContainer:
                var position = s.getWrapperTranslate() + delta * s.params.mousewheelSensitivity;
                var wasBeginning = s.isBeginning,
                    wasEnd = s.isEnd;

                if (position >= s.minTranslate()) position = s.minTranslate();
                if (position <= s.maxTranslate()) position = s.maxTranslate();

                s.setWrapperTransition(0);
                s.setWrapperTranslate(position);
                s.updateProgress();
                s.updateActiveIndex();

                if (!wasBeginning && s.isBeginning || !wasEnd && s.isEnd) {
                    s.updateClasses();
                }

                if (s.params.freeModeSticky) {
                    clearTimeout(s.mousewheel.timeout);
                    s.mousewheel.timeout = setTimeout(function () {
                        s.slideReset();
                    }, 300);
                }

                // Return page scroll on edge positions
                if (position === 0 || position === s.maxTranslate()) return;
            }
            if (s.params.autoplay) s.stopAutoplay();

            if (e.preventDefault) e.preventDefault();
            else e.returnValue = false;
            return false;
        }
        s.disableMousewheelControl = function () {
            if (!s.mousewheel.event) return false;
            s.container.off(s.mousewheel.event, handleMousewheel);
            return true;
        };

        s.enableMousewheelControl = function () {
            if (!s.mousewheel.event) return false;
            s.container.on(s.mousewheel.event, handleMousewheel);
            return true;
        };


        /*=========================
          Parallax
          ===========================*/
        function setParallaxTransform(el, progress) {
            el = $(el);
            var p, pX, pY;
            var rtlFactor = s.rtl ? -1 : 1;

            p = el.attr('data-swiper-parallax') || '0';
            pX = el.attr('data-swiper-parallax-x');
            pY = el.attr('data-swiper-parallax-y');
            if (pX || pY) {
                pX = pX || '0';
                pY = pY || '0';
            }
            else {
                if (isH()) {
                    pX = p;
                    pY = '0';
                }
                else {
                    pY = p;
                    pX = '0';
                }
            }

            if ((pX).indexOf('%') >= 0) {
                pX = parseInt(pX, 10) * progress * rtlFactor + '%';
            }
            else {
                pX = pX * progress * rtlFactor + 'px' ;
            }
            if ((pY).indexOf('%') >= 0) {
                pY = parseInt(pY, 10) * progress + '%';
            }
            else {
                pY = pY * progress + 'px' ;
            }

            el.transform('translate3d(' + pX + ', ' + pY + ',0px)');
        }
        s.parallax = {
            setTranslate: function () {
                s.container.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
                    setParallaxTransform(this, s.progress);

                });
                s.slides.each(function () {
                    var slide = $(this);
                    slide.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function () {
                        var progress = Math.min(Math.max(slide[0].progress, -1), 1);
                        setParallaxTransform(this, progress);
                    });
                });
            },
            setTransition: function (duration) {
                if (typeof duration === 'undefined') duration = s.params.speed;
                s.container.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
                    var el = $(this);
                    var parallaxDuration = parseInt(el.attr('data-swiper-parallax-duration'), 10) || duration;
                    if (duration === 0) parallaxDuration = 0;
                    el.transition(parallaxDuration);
                });
            }
        };


        /*=========================
          Plugins API. Collect all and init all plugins
          ===========================*/
        s._plugins = [];
        for (var plugin in s.plugins) {
            var p = s.plugins[plugin](s, s.params[plugin]);
            if (p) s._plugins.push(p);
        }
        // Method to call all plugins event/method
        s.callPlugins = function (eventName) {
            for (var i = 0; i < s._plugins.length; i++) {
                if (eventName in s._plugins[i]) {
                    s._plugins[i][eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
        };

        /*=========================
          Events/Callbacks/Plugins Emitter
          ===========================*/
        function normalizeEventName (eventName) {
            if (eventName.indexOf('on') !== 0) {
                if (eventName[0] !== eventName[0].toUpperCase()) {
                    eventName = 'on' + eventName[0].toUpperCase() + eventName.substring(1);
                }
                else {
                    eventName = 'on' + eventName;
                }
            }
            return eventName;
        }
        s.emitterEventListeners = {

        };
        s.emit = function (eventName) {
            // Trigger callbacks
            if (s.params[eventName]) {
                s.params[eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            }
            var i;
            // Trigger events
            if (s.emitterEventListeners[eventName]) {
                for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
                    s.emitterEventListeners[eventName][i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
            // Trigger plugins
            if (s.callPlugins) s.callPlugins(eventName, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        };
        s.on = function (eventName, handler) {
            eventName = normalizeEventName(eventName);
            if (!s.emitterEventListeners[eventName]) s.emitterEventListeners[eventName] = [];
            s.emitterEventListeners[eventName].push(handler);
            return s;
        };
        s.off = function (eventName, handler) {
            var i;
            eventName = normalizeEventName(eventName);
            if (typeof handler === 'undefined') {
                // Remove all handlers for such event
                s.emitterEventListeners[eventName] = [];
                return s;
            }
            if (!s.emitterEventListeners[eventName] || s.emitterEventListeners[eventName].length === 0) return;
            for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
                if(s.emitterEventListeners[eventName][i] === handler) s.emitterEventListeners[eventName].splice(i, 1);
            }
            return s;
        };
        s.once = function (eventName, handler) {
            eventName = normalizeEventName(eventName);
            var _handler = function () {
                handler(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                s.off(eventName, _handler);
            };
            s.on(eventName, _handler);
            return s;
        };

        // Accessibility tools
        s.a11y = {
            makeFocusable: function ($el) {
                $el.attr('tabIndex', '0');
                return $el;
            },
            addRole: function ($el, role) {
                $el.attr('role', role);
                return $el;
            },

            addLabel: function ($el, label) {
                $el.attr('aria-label', label);
                return $el;
            },

            disable: function ($el) {
                $el.attr('aria-disabled', true);
                return $el;
            },

            enable: function ($el) {
                $el.attr('aria-disabled', false);
                return $el;
            },

            onEnterKey: function (event) {
                if (event.keyCode !== 13) return;
                if ($(event.target).is(s.params.nextButton)) {
                    s.onClickNext(event);
                    if (s.isEnd) {
                        s.a11y.notify(s.params.lastSlideMessage);
                    }
                    else {
                        s.a11y.notify(s.params.nextSlideMessage);
                    }
                }
                else if ($(event.target).is(s.params.prevButton)) {
                    s.onClickPrev(event);
                    if (s.isBeginning) {
                        s.a11y.notify(s.params.firstSlideMessage);
                    }
                    else {
                        s.a11y.notify(s.params.prevSlideMessage);
                    }
                }
                if ($(event.target).is('.' + s.params.bulletClass)) {
                    $(event.target)[0].click();
                }
            },

            liveRegion: $('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),

            notify: function (message) {
                var notification = s.a11y.liveRegion;
                if (notification.length === 0) return;
                notification.html('');
                notification.html(message);
            },
            init: function () {
                // Setup accessibility
                if (s.params.nextButton) {
                    var nextButton = $(s.params.nextButton);
                    s.a11y.makeFocusable(nextButton);
                    s.a11y.addRole(nextButton, 'button');
                    s.a11y.addLabel(nextButton, s.params.nextSlideMessage);
                }
                if (s.params.prevButton) {
                    var prevButton = $(s.params.prevButton);
                    s.a11y.makeFocusable(prevButton);
                    s.a11y.addRole(prevButton, 'button');
                    s.a11y.addLabel(prevButton, s.params.prevSlideMessage);
                }

                $(s.container).append(s.a11y.liveRegion);
            },
            initPagination: function () {
                if (s.params.pagination && s.params.paginationClickable && s.bullets && s.bullets.length) {
                    s.bullets.each(function () {
                        var bullet = $(this);
                        s.a11y.makeFocusable(bullet);
                        s.a11y.addRole(bullet, 'button');
                        s.a11y.addLabel(bullet, s.params.paginationBulletMessage.replace(/{{index}}/, bullet.index() + 1));
                    });
                }
            },
            destroy: function () {
                if (s.a11y.liveRegion && s.a11y.liveRegion.length > 0) s.a11y.liveRegion.remove();
            }
        };


        /*=========================
          Init/Destroy
          ===========================*/
        s.init = function () {
            if (s.params.loop) s.createLoop();
            s.updateContainerSize();
            s.updateSlidesSize();
            s.updatePagination();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
                if (s.params.scrollbarDraggable) {
                    s.scrollbar.enableDraggable();
                }
            }
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                if (!s.params.loop) s.updateProgress();
                s.effects[s.params.effect].setTranslate();
            }
            if (s.params.loop) {
                s.slideTo(s.params.initialSlide + s.loopedSlides, 0, s.params.runCallbacksOnInit);
            }
            else {
                s.slideTo(s.params.initialSlide, 0, s.params.runCallbacksOnInit);
                if (s.params.initialSlide === 0) {
                    if (s.parallax && s.params.parallax) s.parallax.setTranslate();
                    if (s.lazy && s.params.lazyLoading) {
                        s.lazy.load();
                        s.lazy.initialImageLoaded = true;
                    }
                }
            }
            s.attachEvents();
            if (s.params.observer && s.support.observer) {
                s.initObservers();
            }
            if (s.params.preloadImages && !s.params.lazyLoading) {
                s.preloadImages();
            }
            if (s.params.autoplay) {
                s.startAutoplay();
            }
            if (s.params.keyboardControl) {
                if (s.enableKeyboardControl) s.enableKeyboardControl();
            }
            if (s.params.mousewheelControl) {
                if (s.enableMousewheelControl) s.enableMousewheelControl();
            }
            if (s.params.hashnav) {
                if (s.hashnav) s.hashnav.init();
            }
            if (s.params.a11y && s.a11y) s.a11y.init();
            s.emit('onInit', s);
        };

        // Cleanup dynamic styles
        s.cleanupStyles = function () {
            // Container
            s.container.removeClass(s.classNames.join(' ')).removeAttr('style');

            // Wrapper
            s.wrapper.removeAttr('style');

            // Slides
            if (s.slides && s.slides.length) {
                s.slides
                    .removeClass([
                      s.params.slideVisibleClass,
                      s.params.slideActiveClass,
                      s.params.slideNextClass,
                      s.params.slidePrevClass
                    ].join(' '))
                    .removeAttr('style')
                    .removeAttr('data-swiper-column')
                    .removeAttr('data-swiper-row');
            }

            // Pagination/Bullets
            if (s.paginationContainer && s.paginationContainer.length) {
                s.paginationContainer.removeClass(s.params.paginationHiddenClass);
            }
            if (s.bullets && s.bullets.length) {
                s.bullets.removeClass(s.params.bulletActiveClass);
            }

            // Buttons
            if (s.params.prevButton) $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
            if (s.params.nextButton) $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);

            // Scrollbar
            if (s.params.scrollbar && s.scrollbar) {
                if (s.scrollbar.track && s.scrollbar.track.length) s.scrollbar.track.removeAttr('style');
                if (s.scrollbar.drag && s.scrollbar.drag.length) s.scrollbar.drag.removeAttr('style');
            }
        };

        // Destroy
        s.destroy = function (deleteInstance, cleanupStyles) {
            // Detach evebts
            s.detachEvents();
            // Stop autoplay
            s.stopAutoplay();
            // Disable draggable
            if (s.params.scrollbar && s.scrollbar) {
                if (s.params.scrollbarDraggable) {
                    s.scrollbar.disableDraggable();
                }
            }
            // Destroy loop
            if (s.params.loop) {
                s.destroyLoop();
            }
            // Cleanup styles
            if (cleanupStyles) {
                s.cleanupStyles();
            }
            // Disconnect observer
            s.disconnectObservers();
            // Disable keyboard/mousewheel
            if (s.params.keyboardControl) {
                if (s.disableKeyboardControl) s.disableKeyboardControl();
            }
            if (s.params.mousewheelControl) {
                if (s.disableMousewheelControl) s.disableMousewheelControl();
            }
            // Disable a11y
            if (s.params.a11y && s.a11y) s.a11y.destroy();
            // Destroy callback
            s.emit('onDestroy');
            // Delete instance
            if (deleteInstance !== false) s = null;
        };

        s.init();



        // Return swiper instance
        return s;
    };


    /*==================================================
        Prototype
    ====================================================*/
    Swiper.prototype = {
        isSafari: (function () {
            var ua = navigator.userAgent.toLowerCase();
            return (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0);
        })(),
        isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
        isArray: function (arr) {
            return Object.prototype.toString.apply(arr) === '[object Array]';
        },
        /*==================================================
        Browser
        ====================================================*/
        browser: {
            ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
            ieTouch: (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1) || (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1)
        },
        /*==================================================
        Devices
        ====================================================*/
        device: (function () {
            var ua = navigator.userAgent;
            var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
            var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
            return {
                ios: ipad || iphone || ipod,
                android: android
            };
        })(),
        /*==================================================
        Feature Detection
        ====================================================*/
        support: {
            touch : (window.Modernizr && Modernizr.touch === true) || (function () {
                return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
            })(),

            transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
                var div = document.createElement('div').style;
                return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
            })(),

            flexbox: (function () {
                var div = document.createElement('div').style;
                var styles = ('alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient').split(' ');
                for (var i = 0; i < styles.length; i++) {
                    if (styles[i] in div) return true;
                }
            })(),

            observer: (function () {
                return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
            })()
        },
        /*==================================================
        Plugins
        ====================================================*/
        plugins: {}
    };


    /*===========================
    Dom7 Library
    ===========================*/
    var Dom7 = (function () {
        var Dom7 = function (arr) {
            var _this = this, i = 0;
            // Create array-like object
            for (i = 0; i < arr.length; i++) {
                _this[i] = arr[i];
            }
            _this.length = arr.length;
            // Return collection with methods
            return this;
        };
        var $ = function (selector, context) {
            var arr = [], i = 0;
            if (selector && !context) {
                if (selector instanceof Dom7) {
                    return selector;
                }
            }
            if (selector) {
                // String
                if (typeof selector === 'string') {
                    var els, tempParent, html = selector.trim();
                    if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
                        var toCreate = 'div';
                        if (html.indexOf('<li') === 0) toCreate = 'ul';
                        if (html.indexOf('<tr') === 0) toCreate = 'tbody';
                        if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
                        if (html.indexOf('<tbody') === 0) toCreate = 'table';
                        if (html.indexOf('<option') === 0) toCreate = 'select';
                        tempParent = document.createElement(toCreate);
                        tempParent.innerHTML = selector;
                        for (i = 0; i < tempParent.childNodes.length; i++) {
                            arr.push(tempParent.childNodes[i]);
                        }
                    }
                    else {
                        if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                            // Pure ID selector
                            els = [document.getElementById(selector.split('#')[1])];
                        }
                        else {
                            // Other selectors
                            els = (context || document).querySelectorAll(selector);
                        }
                        for (i = 0; i < els.length; i++) {
                            if (els[i]) arr.push(els[i]);
                        }
                    }
                }
                // Node/element
                else if (selector.nodeType || selector === window || selector === document) {
                    arr.push(selector);
                }
                //Array of elements or instance of Dom
                else if (selector.length > 0 && selector[0].nodeType) {
                    for (i = 0; i < selector.length; i++) {
                        arr.push(selector[i]);
                    }
                }
            }
            return new Dom7(arr);
        };
        Dom7.prototype = {
            // Classes and attriutes
            addClass: function (className) {
                if (typeof className === 'undefined') {
                    return this;
                }
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        this[j].classList.add(classes[i]);
                    }
                }
                return this;
            },
            removeClass: function (className) {
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        this[j].classList.remove(classes[i]);
                    }
                }
                return this;
            },
            hasClass: function (className) {
                if (!this[0]) return false;
                else return this[0].classList.contains(className);
            },
            toggleClass: function (className) {
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        this[j].classList.toggle(classes[i]);
                    }
                }
                return this;
            },
            attr: function (attrs, value) {
                if (arguments.length === 1 && typeof attrs === 'string') {
                    // Get attr
                    if (this[0]) return this[0].getAttribute(attrs);
                    else return undefined;
                }
                else {
                    // Set attrs
                    for (var i = 0; i < this.length; i++) {
                        if (arguments.length === 2) {
                            // String
                            this[i].setAttribute(attrs, value);
                        }
                        else {
                            // Object
                            for (var attrName in attrs) {
                                this[i][attrName] = attrs[attrName];
                                this[i].setAttribute(attrName, attrs[attrName]);
                            }
                        }
                    }
                    return this;
                }
            },
            removeAttr: function (attr) {
                for (var i = 0; i < this.length; i++) {
                    this[i].removeAttribute(attr);
                }
                return this;
            },
            data: function (key, value) {
                if (typeof value === 'undefined') {
                    // Get value
                    if (this[0]) {
                        var dataKey = this[0].getAttribute('data-' + key);
                        if (dataKey) return dataKey;
                        else if (this[0].dom7ElementDataStorage && (key in this[0].dom7ElementDataStorage)) return this[0].dom7ElementDataStorage[key];
                        else return undefined;
                    }
                    else return undefined;
                }
                else {
                    // Set value
                    for (var i = 0; i < this.length; i++) {
                        var el = this[i];
                        if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
                        el.dom7ElementDataStorage[key] = value;
                    }
                    return this;
                }
            },
            // Transforms
            transform : function (transform) {
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
                }
                return this;
            },
            transition: function (duration) {
                if (typeof duration !== 'string') {
                    duration = duration + 'ms';
                }
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
                }
                return this;
            },
            //Events
            on: function (eventName, targetSelector, listener, capture) {
                function handleLiveEvent(e) {
                    var target = e.target;
                    if ($(target).is(targetSelector)) listener.call(target, e);
                    else {
                        var parents = $(target).parents();
                        for (var k = 0; k < parents.length; k++) {
                            if ($(parents[k]).is(targetSelector)) listener.call(parents[k], e);
                        }
                    }
                }
                var events = eventName.split(' ');
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof targetSelector === 'function' || targetSelector === false) {
                        // Usual events
                        if (typeof targetSelector === 'function') {
                            listener = arguments[1];
                            capture = arguments[2] || false;
                        }
                        for (j = 0; j < events.length; j++) {
                            this[i].addEventListener(events[j], listener, capture);
                        }
                    }
                    else {
                        //Live events
                        for (j = 0; j < events.length; j++) {
                            if (!this[i].dom7LiveListeners) this[i].dom7LiveListeners = [];
                            this[i].dom7LiveListeners.push({listener: listener, liveListener: handleLiveEvent});
                            this[i].addEventListener(events[j], handleLiveEvent, capture);
                        }
                    }
                }

                return this;
            },
            off: function (eventName, targetSelector, listener, capture) {
                var events = eventName.split(' ');
                for (var i = 0; i < events.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        if (typeof targetSelector === 'function' || targetSelector === false) {
                            // Usual events
                            if (typeof targetSelector === 'function') {
                                listener = arguments[1];
                                capture = arguments[2] || false;
                            }
                            this[j].removeEventListener(events[i], listener, capture);
                        }
                        else {
                            // Live event
                            if (this[j].dom7LiveListeners) {
                                for (var k = 0; k < this[j].dom7LiveListeners.length; k++) {
                                    if (this[j].dom7LiveListeners[k].listener === listener) {
                                        this[j].removeEventListener(events[i], this[j].dom7LiveListeners[k].liveListener, capture);
                                    }
                                }
                            }
                        }
                    }
                }
                return this;
            },
            once: function (eventName, targetSelector, listener, capture) {
                var dom = this;
                if (typeof targetSelector === 'function') {
                    targetSelector = false;
                    listener = arguments[1];
                    capture = arguments[2];
                }
                function proxy(e) {
                    listener(e);
                    dom.off(eventName, targetSelector, proxy, capture);
                }
                dom.on(eventName, targetSelector, proxy, capture);
            },
            trigger: function (eventName, eventData) {
                for (var i = 0; i < this.length; i++) {
                    var evt;
                    try {
                        evt = new window.CustomEvent(eventName, {detail: eventData, bubbles: true, cancelable: true});
                    }
                    catch (e) {
                        evt = document.createEvent('Event');
                        evt.initEvent(eventName, true, true);
                        evt.detail = eventData;
                    }
                    this[i].dispatchEvent(evt);
                }
                return this;
            },
            transitionEnd: function (callback) {
                var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
                    i, j, dom = this;
                function fireCallBack(e) {
                    /*jshint validthis:true */
                    if (e.target !== this) return;
                    callback.call(this, e);
                    for (i = 0; i < events.length; i++) {
                        dom.off(events[i], fireCallBack);
                    }
                }
                if (callback) {
                    for (i = 0; i < events.length; i++) {
                        dom.on(events[i], fireCallBack);
                    }
                }
                return this;
            },
            // Sizing/Styles
            width: function () {
                if (this[0] === window) {
                    return window.innerWidth;
                }
                else {
                    if (this.length > 0) {
                        return parseFloat(this.css('width'));
                    }
                    else {
                        return null;
                    }
                }
            },
            outerWidth: function (includeMargins) {
                if (this.length > 0) {
                    if (includeMargins)
                        return this[0].offsetWidth + parseFloat(this.css('margin-right')) + parseFloat(this.css('margin-left'));
                    else
                        return this[0].offsetWidth;
                }
                else return null;
            },
            height: function () {
                if (this[0] === window) {
                    return window.innerHeight;
                }
                else {
                    if (this.length > 0) {
                        return parseFloat(this.css('height'));
                    }
                    else {
                        return null;
                    }
                }
            },
            outerHeight: function (includeMargins) {
                if (this.length > 0) {
                    if (includeMargins)
                        return this[0].offsetHeight + parseFloat(this.css('margin-top')) + parseFloat(this.css('margin-bottom'));
                    else
                        return this[0].offsetHeight;
                }
                else return null;
            },
            offset: function () {
                if (this.length > 0) {
                    var el = this[0];
                    var box = el.getBoundingClientRect();
                    var body = document.body;
                    var clientTop  = el.clientTop  || body.clientTop  || 0;
                    var clientLeft = el.clientLeft || body.clientLeft || 0;
                    var scrollTop  = window.pageYOffset || el.scrollTop;
                    var scrollLeft = window.pageXOffset || el.scrollLeft;
                    return {
                        top: box.top  + scrollTop  - clientTop,
                        left: box.left + scrollLeft - clientLeft
                    };
                }
                else {
                    return null;
                }
            },
            css: function (props, value) {
                var i;
                if (arguments.length === 1) {
                    if (typeof props === 'string') {
                        if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
                    }
                    else {
                        for (i = 0; i < this.length; i++) {
                            for (var prop in props) {
                                this[i].style[prop] = props[prop];
                            }
                        }
                        return this;
                    }
                }
                if (arguments.length === 2 && typeof props === 'string') {
                    for (i = 0; i < this.length; i++) {
                        this[i].style[props] = value;
                    }
                    return this;
                }
                return this;
            },

            //Dom manipulation
            each: function (callback) {
                for (var i = 0; i < this.length; i++) {
                    callback.call(this[i], i, this[i]);
                }
                return this;
            },
            html: function (html) {
                if (typeof html === 'undefined') {
                    return this[0] ? this[0].innerHTML : undefined;
                }
                else {
                    for (var i = 0; i < this.length; i++) {
                        this[i].innerHTML = html;
                    }
                    return this;
                }
            },
            is: function (selector) {
                if (!this[0]) return false;
                var compareWith, i;
                if (typeof selector === 'string') {
                    var el = this[0];
                    if (el === document) return selector === document;
                    if (el === window) return selector === window;

                    if (el.matches) return el.matches(selector);
                    else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
                    else if (el.mozMatchesSelector) return el.mozMatchesSelector(selector);
                    else if (el.msMatchesSelector) return el.msMatchesSelector(selector);
                    else {
                        compareWith = $(selector);
                        for (i = 0; i < compareWith.length; i++) {
                            if (compareWith[i] === this[0]) return true;
                        }
                        return false;
                    }
                }
                else if (selector === document) return this[0] === document;
                else if (selector === window) return this[0] === window;
                else {
                    if (selector.nodeType || selector instanceof Dom7) {
                        compareWith = selector.nodeType ? [selector] : selector;
                        for (i = 0; i < compareWith.length; i++) {
                            if (compareWith[i] === this[0]) return true;
                        }
                        return false;
                    }
                    return false;
                }

            },
            index: function () {
                if (this[0]) {
                    var child = this[0];
                    var i = 0;
                    while ((child = child.previousSibling) !== null) {
                        if (child.nodeType === 1) i++;
                    }
                    return i;
                }
                else return undefined;
            },
            eq: function (index) {
                if (typeof index === 'undefined') return this;
                var length = this.length;
                var returnIndex;
                if (index > length - 1) {
                    return new Dom7([]);
                }
                if (index < 0) {
                    returnIndex = length + index;
                    if (returnIndex < 0) return new Dom7([]);
                    else return new Dom7([this[returnIndex]]);
                }
                return new Dom7([this[index]]);
            },
            append: function (newChild) {
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof newChild === 'string') {
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = newChild;
                        while (tempDiv.firstChild) {
                            this[i].appendChild(tempDiv.firstChild);
                        }
                    }
                    else if (newChild instanceof Dom7) {
                        for (j = 0; j < newChild.length; j++) {
                            this[i].appendChild(newChild[j]);
                        }
                    }
                    else {
                        this[i].appendChild(newChild);
                    }
                }
                return this;
            },
            prepend: function (newChild) {
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof newChild === 'string') {
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = newChild;
                        for (j = tempDiv.childNodes.length - 1; j >= 0; j--) {
                            this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
                        }
                        // this[i].insertAdjacentHTML('afterbegin', newChild);
                    }
                    else if (newChild instanceof Dom7) {
                        for (j = 0; j < newChild.length; j++) {
                            this[i].insertBefore(newChild[j], this[i].childNodes[0]);
                        }
                    }
                    else {
                        this[i].insertBefore(newChild, this[i].childNodes[0]);
                    }
                }
                return this;
            },
            insertBefore: function (selector) {
                var before = $(selector);
                for (var i = 0; i < this.length; i++) {
                    if (before.length === 1) {
                        before[0].parentNode.insertBefore(this[i], before[0]);
                    }
                    else if (before.length > 1) {
                        for (var j = 0; j < before.length; j++) {
                            before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
                        }
                    }
                }
            },
            insertAfter: function (selector) {
                var after = $(selector);
                for (var i = 0; i < this.length; i++) {
                    if (after.length === 1) {
                        after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
                    }
                    else if (after.length > 1) {
                        for (var j = 0; j < after.length; j++) {
                            after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
                        }
                    }
                }
            },
            next: function (selector) {
                if (this.length > 0) {
                    if (selector) {
                        if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) return new Dom7([this[0].nextElementSibling]);
                        else return new Dom7([]);
                    }
                    else {
                        if (this[0].nextElementSibling) return new Dom7([this[0].nextElementSibling]);
                        else return new Dom7([]);
                    }
                }
                else return new Dom7([]);
            },
            nextAll: function (selector) {
                var nextEls = [];
                var el = this[0];
                if (!el) return new Dom7([]);
                while (el.nextElementSibling) {
                    var next = el.nextElementSibling;
                    if (selector) {
                        if($(next).is(selector)) nextEls.push(next);
                    }
                    else nextEls.push(next);
                    el = next;
                }
                return new Dom7(nextEls);
            },
            prev: function (selector) {
                if (this.length > 0) {
                    if (selector) {
                        if (this[0].previousElementSibling && $(this[0].previousElementSibling).is(selector)) return new Dom7([this[0].previousElementSibling]);
                        else return new Dom7([]);
                    }
                    else {
                        if (this[0].previousElementSibling) return new Dom7([this[0].previousElementSibling]);
                        else return new Dom7([]);
                    }
                }
                else return new Dom7([]);
            },
            prevAll: function (selector) {
                var prevEls = [];
                var el = this[0];
                if (!el) return new Dom7([]);
                while (el.previousElementSibling) {
                    var prev = el.previousElementSibling;
                    if (selector) {
                        if($(prev).is(selector)) prevEls.push(prev);
                    }
                    else prevEls.push(prev);
                    el = prev;
                }
                return new Dom7(prevEls);
            },
            parent: function (selector) {
                var parents = [];
                for (var i = 0; i < this.length; i++) {
                    if (selector) {
                        if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
                    }
                    else {
                        parents.push(this[i].parentNode);
                    }
                }
                return $($.unique(parents));
            },
            parents: function (selector) {
                var parents = [];
                for (var i = 0; i < this.length; i++) {
                    var parent = this[i].parentNode;
                    while (parent) {
                        if (selector) {
                            if ($(parent).is(selector)) parents.push(parent);
                        }
                        else {
                            parents.push(parent);
                        }
                        parent = parent.parentNode;
                    }
                }
                return $($.unique(parents));
            },
            find : function (selector) {
                var foundElements = [];
                for (var i = 0; i < this.length; i++) {
                    var found = this[i].querySelectorAll(selector);
                    for (var j = 0; j < found.length; j++) {
                        foundElements.push(found[j]);
                    }
                }
                return new Dom7(foundElements);
            },
            children: function (selector) {
                var children = [];
                for (var i = 0; i < this.length; i++) {
                    var childNodes = this[i].childNodes;

                    for (var j = 0; j < childNodes.length; j++) {
                        if (!selector) {
                            if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
                        }
                        else {
                            if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) children.push(childNodes[j]);
                        }
                    }
                }
                return new Dom7($.unique(children));
            },
            remove: function () {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
                }
                return this;
            },
            add: function () {
                var dom = this;
                var i, j;
                for (i = 0; i < arguments.length; i++) {
                    var toAdd = $(arguments[i]);
                    for (j = 0; j < toAdd.length; j++) {
                        dom[dom.length] = toAdd[j];
                        dom.length++;
                    }
                }
                return dom;
            }
        };
        $.fn = Dom7.prototype;
        $.unique = function (arr) {
            var unique = [];
            for (var i = 0; i < arr.length; i++) {
                if (unique.indexOf(arr[i]) === -1) unique.push(arr[i]);
            }
            return unique;
        };

        return $;
    })();


    /*===========================
     Get Dom libraries
     ===========================*/
    var swiperDomPlugins = ['jQuery', 'Zepto', 'Dom7'];
    for (var i = 0; i < swiperDomPlugins.length; i++) {
    	if (window[swiperDomPlugins[i]]) {
    		addLibraryPlugin(window[swiperDomPlugins[i]]);
    	}
    }
    // Required DOM Plugins
    var domLib;
    if (typeof Dom7 === 'undefined') {
    	domLib = window.Dom7 || window.Zepto || window.jQuery;
    }
    else {
    	domLib = Dom7;
    }

    /*===========================
    Add .swiper plugin from Dom libraries
    ===========================*/
    function addLibraryPlugin(lib) {
        lib.fn.swiper = function (params) {
            var firstInstance;
            lib(this).each(function () {
                var s = new Swiper(this, params);
                if (!firstInstance) firstInstance = s;
            });
            return firstInstance;
        };
    }

    if (domLib) {
        if (!('transitionEnd' in domLib.fn)) {
            domLib.fn.transitionEnd = function (callback) {
                var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
                    i, j, dom = this;
                function fireCallBack(e) {
                    /*jshint validthis:true */
                    if (e.target !== this) return;
                    callback.call(this, e);
                    for (i = 0; i < events.length; i++) {
                        dom.off(events[i], fireCallBack);
                    }
                }
                if (callback) {
                    for (i = 0; i < events.length; i++) {
                        dom.on(events[i], fireCallBack);
                    }
                }
                return this;
            };
        }
        if (!('transform' in domLib.fn)) {
            domLib.fn.transform = function (transform) {
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
                }
                return this;
            };
        }
        if (!('transition' in domLib.fn)) {
            domLib.fn.transition = function (duration) {
                if (typeof duration !== 'string') {
                    duration = duration + 'ms';
                }
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
                }
                return this;
            };
        }
    }

    ionic.views.Swiper = Swiper;
})();

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

    tap: function() {
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

      ionic.requestAnimationFrame(function () {
        if (!self._dragInfo) { return; }

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

    endDrag: function() {
      this._dragInfo = null;
    },

    hold: function() {
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

})();