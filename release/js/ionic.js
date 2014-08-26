/*!
 * Copyright 2014 Drifty Co.
 * http://drifty.com/
 *
 * Ionic, v1.0.0-beta.11
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
  version: '1.0.0-beta.11'
};

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
     * @private
     */
    centerElementByMargin: function(el) {
      el.style.marginLeft = (-el.offsetWidth) / 2 + 'px';
      el.style.marginTop = (-el.offsetHeight) / 2 + 'px';
    },
    //Center twice, after raf, to fix a bug with ios and showing elements
    //that have just been attached to the DOM.
    centerElementByMarginTwice: function(el) {
      ionic.requestAnimationFrame(function() {
        ionic.DomUtil.centerElementByMargin(el);
        setTimeout(function() {
          ionic.DomUtil.centerElementByMargin(el);
          setTimeout(function() {
            ionic.DomUtil.centerElementByMargin(el);
          });
        });
      });
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
     * @name ionic.DomUtil#getParentOrSelfWithClass
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
     * `transform`, `transformstart`, `transformend`, `rotate`, `pinch`, `pinchin`, `pinchout`, </br>
     * `touch`, `release`
     *
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

    handlePopState: function(event) {}
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
      tap_max_touchtime	: 250,
      tap_max_distance	: 10,
      tap_always			: true,
      doubletap_distance	: 20,
      doubletap_interval	: 300
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

  var IOS = 'ios';
  var ANDROID = 'android';
  var WINDOWS_PHONE = 'windowsphone';

  /**
   * @ngdoc utility
   * @name ionic.Platform
   * @module ionic
   */
  ionic.Platform = {

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
      var oldGrade = this.grade;
      this.grade = grade;
      ionic.requestAnimationFrame(function() {
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
      if(window.device) return window.device;
      if(this.isWebView()) void 0;
      return {};
    },

    _checkPlatforms: function(platforms) {
      this.platforms = [];
      var grade = 'a';

      if(this.isWebView()) {
        this.platforms.push('webview');
        this.platforms.push('cordova');
      } else {
        this.platforms.push('browser');
      }
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
            grade = (version < 4 ? 'c' : 'b');
          } else if(this.isWindowsPhone()) {
            grade = 'b';
          }
        }
      }

      this.setGrade(grade);
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#isWebView
     * @returns {boolean} Check if we are running within a WebView (such as Cordova).
     */
    isWebView: function() {
      return !(!window.cordova && !window.PhoneGap && !window.phonegap);
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isIPad
     * @returns {boolean} Whether we are running on iPad.
     */
    isIPad: function() {
      if( /iPad/i.test(ionic.Platform.navigator.platform) ) {
        return true;
      }
      return /iPad/i.test(this.ua);
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isIOS
     * @returns {boolean} Whether we are running on iOS.
     */
    isIOS: function() {
      return this.is(IOS);
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isAndroid
     * @returns {boolean} Whether we are running on Android.
     */
    isAndroid: function() {
      return this.is(ANDROID);
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isWindowsPhone
     * @returns {boolean} Whether we are running on Windows Phone.
     */
    isWindowsPhone: function() {
      return this.is(WINDOWS_PHONE);
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
        platformName = ANDROID;
      } else if(this.ua.indexOf('iPhone') > -1 || this.ua.indexOf('iPad') > -1 || this.ua.indexOf('iPod') > -1) {
        platformName = IOS;
      } else if(this.ua.indexOf('Windows Phone') > -1) {
        platformName = WINDOWS_PHONE;
      } else {
        platformName = ionic.Platform.navigator.platform && navigator.platform.toLowerCase().split(' ')[0] || '';
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
        'ios': /OS (\d+)_(\d+)?/,
        'windowsphone': /Windows Phone (\d+).(\d+)?/
      };
      if(versionMatch[pName]) {
        v = this.ua.match( versionMatch[pName] );
        if(v &&  v.length > 2) {
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
    if(ionic.Platform.isWebView()) {
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
                   '-moz-transform', 'moz-transform', 'MozTransform', 'mozTransform', 'msTransform'];

    for(i = 0; i < keys.length; i++) {
      if(document.documentElement.style[keys[i]] !== undefined) {
        ionic.CSS.TRANSFORM = keys[i];
        break;
      }
    }

    // transition
    keys = ['webkitTransition', 'mozTransition', 'msTransition', 'transition'];
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
var TAP_RELEASE_TOLERANCE = 6; // default tolerance
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

    if( window.navigator.pointerEnabled ) {
      tapEventListener('pointerdown');
      tapEventListener('pointerup');
      tapEventListener('pointcancel');
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
      for(var type in tapEventListeners) {
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
           (e.target.isContentEditable) ||
           (/^(file|range)$/i).test(e.target.type) ||
           (e.target.dataset ? e.target.dataset.preventScroll : e.target.getAttribute('data-prevent-default')) == 'true' || // manually set within an elements attributes
           (!!(/^(object|embed)$/i).test(e.target.tagName)) ||  // flash/movie/object touches should not try to scroll
           ionic.tap.isElementTapDisabled(e.target); // check if this element, or an ancestor, has `data-tap-disabled` attribute
  },

  isTextInput: function(ele) {
    return !!ele &&
           (ele.tagName == 'TEXTAREA' ||
            ele.contentEditable === 'true' ||
            (ele.tagName == 'INPUT' && !(/^(radio|checkbox|range|file|submit|reset)$/i).test(ele.type)) );
  },

  isDateInput: function(ele) {
    return !!ele &&
            (ele.tagName == 'INPUT' && (/^(date|time|datetime-local|month|week)$/i).test(ele.type));
  },

  isLabelWithTextInput: function(ele) {
    var container = tapContainingElement(ele, false);

    return !!container &&
           ionic.tap.isTextInput( tapTargetElement( container ) );
  },

  containsOrIsTextInput: function(ele) {
    return ionic.tap.isTextInput(ele) || ionic.tap.isLabelWithTextInput(ele);
  },

  cloneFocusedInput: function(container, scrollIntance) {
    if(ionic.tap.hasCheckedClone) return;
    ionic.tap.hasCheckedClone = true;

    ionic.requestAnimationFrame(function(){
      var focusInput = container.querySelector(':focus');
      if( ionic.tap.isTextInput(focusInput) ) {
        var clonedInput = focusInput.parentElement.querySelector('.cloned-text-input');
        if(!clonedInput) {
          clonedInput = document.createElement(focusInput.tagName);
          clonedInput.placeholder = focusInput.placeholder;
          clonedInput.type = focusInput.type;
          clonedInput.value = focusInput.value;
          clonedInput.style = focusInput.style;
          clonedInput.className = focusInput.className;
          clonedInput.classList.add('cloned-text-input');
          clonedInput.readOnly = true;
          focusInput.parentElement.insertBefore(clonedInput, focusInput);
          focusInput.style.top = focusInput.offsetTop;
          focusInput.classList.add('previous-input-focus');
        }
      }
    });
  },

  hasCheckedClone: false,

  removeClonedInputs: function(container, scrollIntance) {
    ionic.tap.hasCheckedClone = false;

    ionic.requestAnimationFrame(function(){
      var clonedInputs = container.querySelectorAll('.cloned-text-input');
      var previousInputFocus = container.querySelectorAll('.previous-input-focus');
      var x;

      for(x=0; x<clonedInputs.length; x++) {
        clonedInputs[x].parentElement.removeChild( clonedInputs[x] );
      }

      for(x=0; x<previousInputFocus.length; x++) {
        previousInputFocus[x].classList.remove('previous-input-focus');
        previousInputFocus[x].style.top = '';
        previousInputFocus[x].focus();
      }
    });
  },

  requiresNativeClick: function(ele) {
    if(!ele || ele.disabled || (/^(file|range)$/i).test(ele.type) || (/^(object|video)$/i).test(ele.tagName) || ionic.tap.isLabelContainingFileInput(ele) ) {
      return true;
    }
    return ionic.tap.isElementTapDisabled(ele);
  },

  isLabelContainingFileInput: function(ele) {
    var lbl = tapContainingElement(ele);
    if(lbl.tagName !== 'LABEL') return false;
    var fileInput = lbl.querySelector('input[type=file]');
    if(fileInput && fileInput.disabled === false) return true;
    return false;
  },

  isElementTapDisabled: function(ele) {
    if(ele && ele.nodeType === 1) {
      var element = ele;
      while(element) {
        if( (element.dataset ? element.dataset.tapDisabled : element.getAttribute('data-tap-disabled')) == 'true' ) {
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
  }

};

function tapEventListener(type, enable, useCapture) {
  if(enable !== false) {
    tapDoc.addEventListener(type, tapEventListeners[type], useCapture);
  } else {
    tapDoc.removeEventListener(type, tapEventListeners[type]);
  }
}

function tapClick(e) {
  // simulate a normal click by running the element's click method then focus on it
  var container = tapContainingElement(e.target);
  var ele = tapTargetElement(container);

  if( ionic.tap.requiresNativeClick(ele) || tapPointerMoved ) return false;

  var c = getPointerCoordinates(e);

  void 0;
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
  if(e.target.type == 'submit' && e.detail === 0) {
    // do not prevent click if it came from an "Enter" or "Go" keypress submit
    return;
  }

  // do not allow through any click events that were not created by ionic.tap
  if( (ionic.scroll.isScrolling && ionic.tap.containsOrIsTextInput(e.target) ) ||
      (!e.isIonicTap && !ionic.tap.requiresNativeClick(e.target)) ) {
    void 0;
    e.stopPropagation();

    if( !ionic.tap.isLabelWithTextInput(e.target) ) {
      // labels clicks from native should not preventDefault othersize keyboard will not show on input focus
      e.preventDefault();
    }
    return false;
  }
}

// MOUSE
function tapMouseDown(e) {
  if(e.isIonicTap || tapIgnoreEvent(e)) return;

  if(tapEnabledTouchEvents) {
    void 0;
    e.stopPropagation();

    if( (!ionic.tap.isTextInput(e.target) || tapLastTouchTarget !== e.target) && !(/^(select|option)$/i).test(e.target.tagName) ) {
      // If you preventDefault on a text input then you cannot move its text caret/cursor.
      // Allow through only the text input default. However, without preventDefault on an
      // input the 300ms delay can change focus on inputs after the keyboard shows up.
      // The focusin event handles the chance of focus changing after the keyboard shows.
      e.preventDefault();
    }

    return false;
  }

  tapPointerMoved = false;
  tapPointerStart = getPointerCoordinates(e);

  tapEventListener('mousemove');
  ionic.activator.start(e);
}

function tapMouseUp(e) {
  if(tapEnabledTouchEvents) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  if( tapIgnoreEvent(e) || (/^(select|option)$/i).test(e.target.tagName) ) return false;

  if( !tapHasPointerMoved(e) ) {
    tapClick(e);
  }
  tapEventListener('mousemove', false);
  ionic.activator.end();
  tapPointerMoved = false;
}

function tapMouseMove(e) {
  if( tapHasPointerMoved(e) ) {
    tapEventListener('mousemove', false);
    ionic.activator.end();
    tapPointerMoved = true;
    return false;
  }
}


// TOUCH
function tapTouchStart(e) {
  if( tapIgnoreEvent(e) ) return;

  tapPointerMoved = false;

  tapEnableTouchEvents();
  tapPointerStart = getPointerCoordinates(e);

  tapEventListener(tapTouchMoveListener);
  ionic.activator.start(e);

  if( ionic.Platform.isIOS() && ionic.tap.isLabelWithTextInput(e.target) ) {
    // if the tapped element is a label, which has a child input
    // then preventDefault so iOS doesn't ugly auto scroll to the input
    // but do not prevent default on Android or else you cannot move the text caret
    // and do not prevent default on Android or else no virtual keyboard shows up

    var textInput = tapTargetElement( tapContainingElement(e.target) );
    if( textInput !== tapActiveEle ) {
      // don't preventDefault on an already focused input or else iOS's text caret isn't usable
      e.preventDefault();
    }
  }
}

function tapTouchEnd(e) {
  if( tapIgnoreEvent(e) ) return;

  tapEnableTouchEvents();
  if( !tapHasPointerMoved(e) ) {
    tapClick(e);

    if( (/^(select|option)$/i).test(e.target.tagName) ) {
      e.preventDefault();
    }
  }

  tapLastTouchTarget = e.target;
  tapTouchCancel();
}

function tapTouchMove(e) {
  if( tapHasPointerMoved(e) ) {
    tapPointerMoved = true;
    tapEventListener(tapTouchMoveListener, false);
    ionic.activator.end();
    return false;
  }
}

function tapTouchCancel(e) {
  tapEventListener(tapTouchMoveListener, false);
  ionic.activator.end();
  tapPointerMoved = false;
}

function tapEnableTouchEvents() {
  tapEnabledTouchEvents = true;
  clearTimeout(tapMouseResetTimer);
  tapMouseResetTimer = setTimeout(function(){
    tapEnabledTouchEvents = false;
  }, 2000);
}

function tapIgnoreEvent(e) {
  if(e.isTapHandled) return true;
  e.isTapHandled = true;

  if( ionic.scroll.isScrolling && ionic.tap.containsOrIsTextInput(e.target) ) {
    e.preventDefault();
    return true;
  }
}

function tapHandleFocus(ele) {
  tapTouchFocusedInput = null;

  var triggerFocusIn = false;

  if(ele.tagName == 'SELECT') {
    // trick to force Android options to show up
    triggerMouseEvent('mousedown', ele, 0, 0);
    ele.focus && ele.focus();
    triggerFocusIn = true;

  } else if(tapActiveElement() === ele) {
    // already is the active element and has focus
    triggerFocusIn = true;

  } else if( (/^(input|textarea)$/i).test(ele.tagName) ) {
    triggerFocusIn = true;
    ele.focus && ele.focus();
    ele.value = ele.value;
    if( tapEnabledTouchEvents ) {
      tapTouchFocusedInput = ele;
    }

  } else {
    tapFocusOutActive();
  }

  if(triggerFocusIn) {
    tapActiveElement(ele);
    ionic.trigger('ionic.focusin', {
      target: ele
    }, true);
  }
}

function tapFocusOutActive() {
  var ele = tapActiveElement();
  if(ele && (/^(input|textarea|select)$/i).test(ele.tagName) ) {
    void 0;
    ele.blur();
  }
  tapActiveElement(null);
}

function tapFocusIn(e) {
  // Because a text input doesn't preventDefault (so the caret still works) there's a chance
  // that it's mousedown event 300ms later will change the focus to another element after
  // the keyboard shows up.

  if( tapEnabledTouchEvents &&
      ionic.tap.isTextInput( tapActiveElement() ) &&
      ionic.tap.isTextInput(tapTouchFocusedInput) &&
      tapTouchFocusedInput !== e.target ) {

    // 1) The pointer is from touch events
    // 2) There is an active element which is a text input
    // 3) A text input was just set to be focused on by a touch event
    // 4) A new focus has been set, however the target isn't the one the touch event wanted
    void 0;
    tapTouchFocusedInput.focus();
    tapTouchFocusedInput = null;
  }
  ionic.scroll.isScrolling = false;
}

function tapFocusOut() {
  tapActiveElement(null);
}

function tapActiveElement(ele) {
  if(arguments.length) {
    tapActiveEle = ele;
  }
  return tapActiveEle || document.activeElement;
}

function tapHasPointerMoved(endEvent) {
  if(!endEvent || endEvent.target.nodeType !== 1 || !tapPointerStart || ( tapPointerStart.x === 0 && tapPointerStart.y === 0 )) {
    return false;
  }
  var endCoordinates = getPointerCoordinates(endEvent);

  var hasClassList = !!(endEvent.target.classList && endEvent.target.classList.contains);
  var releaseTolerance = hasClassList & endEvent.target.classList.contains('button') ?
    TAP_RELEASE_BUTTON_TOLERANCE :
    TAP_RELEASE_TOLERANCE;

  return Math.abs(tapPointerStart.x - endCoordinates.x) > releaseTolerance ||
         Math.abs(tapPointerStart.y - endCoordinates.y) > releaseTolerance;
}

function getPointerCoordinates(event) {
  // This method can get coordinates for both a mouse click
  // or a touch depending on the given event
  var c = { x:0, y:0 };
  if(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var e = (event.changedTouches && event.changedTouches[0]) || touches[0];
    if(e) {
      c.x = e.clientX || e.pageX || 0;
      c.y = e.clientY || e.pageY || 0;
    }
  }
  return c;
}

function tapContainingElement(ele, allowSelf) {
  var climbEle = ele;
  for(var x=0; x<6; x++) {
    if(!climbEle) break;
    if(climbEle.tagName === 'LABEL') return climbEle;
    climbEle = climbEle.parentElement;
  }
  if(allowSelf !== false) return ele;
}

function tapTargetElement(ele) {
  if(ele && ele.tagName === 'LABEL') {
    if(ele.control) return ele.control;

    // older devices do not support the "control" property
    if(ele.querySelector) {
      var control = ele.querySelector('input,textarea,select');
      if(control) return control;
    }
  }
  return ele;
}

ionic.DomUtil.ready(function(){
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
      var self = this;

      // when an element is touched/clicked, it climbs up a few
      // parents to see if it is an .item or .button element
      ionic.requestAnimationFrame(function(){
        if ( ionic.tap.requiresNativeClick(e.target) ) return;
        var ele = e.target;
        var eleToActivate;

        for(var x=0; x<4; x++) {
          if(!ele || ele.nodeType !== 1) break;
          if(eleToActivate && ele.classList.contains('item')) {
            eleToActivate = ele;
            break;
          }
          if( ele.tagName == 'A' || ele.tagName == 'BUTTON' || ele.hasAttribute('ng-click') ) {
            eleToActivate = ele;
            break;
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
          if(e.type === 'touchstart') {
            self._activateTimeout = setTimeout(activateElements, 80);
          } else {
            ionic.requestAnimationFrame(activateElements);
          }

          keyId = (keyId > 19 ? 0 : keyId + 1);
        }

      });
    },

    end: function() {
      // clear out any active/queued elements after XX milliseconds
      clearTimeout(this._activateTimeout);
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
    for(var key in queueElements) {
      if(queueElements[key]) {
        queueElements[key].classList.add(ACTIVATED_CLASS);
        activeElements[key] = queueElements[key];
      }
    }
    queueElements = {};
  }

  function deactivateElements() {
    for(var key in activeElements) {
      if(activeElements[key]) {
        activeElements[key].classList.remove(ACTIVATED_CLASS);
        delete activeElements[key];
      }
    }
  }

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

var keyboardViewportHeight = window.innerHeight;
var keyboardIsOpen;
var keyboardActiveElement;
var keyboardFocusOutTimer;
var keyboardFocusInTimer;
var keyboardLastShow = 0;

var KEYBOARD_OPEN_CSS = 'keyboard-open';
var SCROLL_CONTAINER_CSS = 'scroll';

ionic.keyboard = {
  isOpen: false,
  height: null,
  landscape: false,
};

function keyboardInit() {
  if( keyboardHasPlugin() ) {
    window.addEventListener('native.keyboardshow', keyboardNativeShow);
    window.addEventListener('native.keyboardhide', keyboardFocusOut);

    //deprecated
    window.addEventListener('native.showkeyboard', keyboardNativeShow);
    window.addEventListener('native.hidekeyboard', keyboardFocusOut);
  }
  else {
    document.body.addEventListener('focusout', keyboardFocusOut);
  }

  document.body.addEventListener('ionic.focusin', keyboardBrowserFocusIn);
  document.body.addEventListener('focusin', keyboardBrowserFocusIn);

  document.body.addEventListener('orientationchange', keyboardOrientationChange);

  document.removeEventListener('touchstart', keyboardInit);
}

function keyboardNativeShow(e) {
  clearTimeout(keyboardFocusOutTimer);
  ionic.keyboard.height = e.keyboardHeight;
}

function keyboardBrowserFocusIn(e) {
  if( !e.target || !ionic.tap.isTextInput(e.target) || ionic.tap.isDateInput(e.target) || !keyboardIsWithinScroll(e.target) ) return;

  document.addEventListener('keydown', keyboardOnKeyDown, false);

  document.body.scrollTop = 0;
  document.body.querySelector('.scroll-content').scrollTop = 0;

  keyboardActiveElement = e.target;

  keyboardSetShow(e);
}

function keyboardSetShow(e) {
  clearTimeout(keyboardFocusInTimer);
  clearTimeout(keyboardFocusOutTimer);

  keyboardFocusInTimer = setTimeout(function(){
    if ( keyboardLastShow + 350 > Date.now() ) return;
    keyboardLastShow = Date.now();
    var keyboardHeight;
    var elementBounds = keyboardActiveElement.getBoundingClientRect();
    var count = 0;

    var pollKeyboardHeight = setInterval(function(){

      keyboardHeight = keyboardGetHeight();
      if (count > 10){
        clearInterval(pollKeyboardHeight);
        //waited long enough, just guess
        keyboardHeight = 275;
      }
      if (keyboardHeight){
        keyboardShow(e.target, elementBounds.top, elementBounds.bottom, keyboardViewportHeight, keyboardHeight);
        clearInterval(pollKeyboardHeight);
      }
      count++;

    }, 100);
  }, 32);
}

function keyboardShow(element, elementTop, elementBottom, viewportHeight, keyboardHeight) {
  var details = {
    target: element,
    elementTop: Math.round(elementTop),
    elementBottom: Math.round(elementBottom),
    keyboardHeight: keyboardHeight,
    viewportHeight: viewportHeight
  };

  details.hasPlugin = keyboardHasPlugin();

  details.contentHeight = viewportHeight - keyboardHeight;

  void 0;

  // figure out if the element is under the keyboard
  details.isElementUnderKeyboard = (details.elementBottom > details.contentHeight);

  ionic.keyboard.isOpen = true;

  // send event so the scroll view adjusts
  keyboardActiveElement = element;
  ionic.trigger('scrollChildIntoView', details, true);

  ionic.requestAnimationFrame(function(){
    document.body.classList.add(KEYBOARD_OPEN_CSS);
  });

  // any showing part of the document that isn't within the scroll the user
  // could touchmove and cause some ugly changes to the app, so disable
  // any touchmove events while the keyboard is open using e.preventDefault()
  document.addEventListener('touchmove', keyboardPreventDefault, false);

  return details;
}

function keyboardFocusOut(e) {
  clearTimeout(keyboardFocusOutTimer);

  keyboardFocusOutTimer = setTimeout(keyboardHide, 350);
}

function keyboardHide() {
  void 0;
  ionic.keyboard.isOpen = false;

  ionic.trigger('resetScrollView', {
    target: keyboardActiveElement
  }, true);

  ionic.requestAnimationFrame(function(){
    document.body.classList.remove(KEYBOARD_OPEN_CSS);
  });

  // the keyboard is gone now, remove the touchmove that disables native scroll
  document.removeEventListener('touchmove', keyboardPreventDefault);
  document.removeEventListener('keydown', keyboardOnKeyDown);
}

function keyboardUpdateViewportHeight() {
  if( window.innerHeight > keyboardViewportHeight ) {
    keyboardViewportHeight = window.innerHeight;
  }
}

function keyboardOnKeyDown(e) {
  if( ionic.scroll.isScrolling ) {
    keyboardPreventDefault(e);
  }
}

function keyboardPreventDefault(e) {
  if( e.target.tagName !== 'TEXTAREA' ) {
    e.preventDefault();
  }
}

function keyboardOrientationChange() {
  var updatedViewportHeight = window.innerHeight;

  //too slow, have to wait for updated height
  if (updatedViewportHeight === keyboardViewportHeight){
    var count = 0;
    var pollViewportHeight = setInterval(function(){
      //give up
      if (count > 10){
        clearInterval(pollViewportHeight);
      }

      updatedViewportHeight = window.innerHeight;

      if (updatedViewportHeight !== keyboardViewportHeight){
        if (updatedViewportHeight < keyboardViewportHeight){
          ionic.keyboard.landscape = true;
        }
        else {
          ionic.keyboard.landscape = false;
        }
        keyboardViewportHeight = updatedViewportHeight;
        clearInterval(pollViewportHeight);
      }
      count++;

    }, 50);
  }
  else {
    keyboardViewportHeight = updatedViewportHeight;
  }
}

function keyboardGetHeight() {
  // check if we are already have a keyboard height from the plugin
  if ( ionic.keyboard.height ) {
    return ionic.keyboard.height;
  }

  if ( ionic.Platform.isAndroid() ){
    //should be using the plugin, no way to know how big the keyboard is, so guess
    if ( ionic.Platform.isFullScreen ){
      return 275;
    }
    //otherwise, wait for the screen to resize
    if ( window.innerHeight < keyboardViewportHeight ){
      return keyboardViewportHeight - window.innerHeight;
    }
    else {
      return 0;
    }
  }

  // fallback for when its the webview without the plugin
  // or for just the standard web browser
  if( ionic.Platform.isIOS() ) {
    if ( ionic.keyboard.landscape ){
      return 206;
    }

    if (!ionic.Platform.isWebView()){
      return 216;
    }

    return 260;
  }

  // safe guess
  return 275;
}

function keyboardIsWithinScroll(ele) {
  while(ele) {
    if(ele.classList.contains(SCROLL_CONTAINER_CSS)) {
      return true;
    }
    ele = ele.parentElement;
  }
  return false;
}

function keyboardHasPlugin() {
  return !!(window.cordova && cordova.plugins && cordova.plugins.Keyboard);
}

ionic.Platform.ready(function() {
  keyboardUpdateViewportHeight();

  // Android sometimes reports bad innerHeight on window.load
  // try it again in a lil bit to play it safe
  setTimeout(keyboardUpdateViewportHeight, 999);

  // only initialize the adjustments for the virtual keyboard
  // if a touchstart event happens
  document.addEventListener('touchstart', keyboardInit, false);
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

  for(x=0; x<document.head.children.length; x++) {
    if(document.head.children[x].name == 'viewport') {
      viewportTag = document.head.children[x];
      break;
    }
  }

  if(viewportTag) {
    var props = viewportTag.content.toLowerCase().replace(/\s+/g, '').split(',');
    var keyValue;
    for(x=0; x<props.length; x++) {
      if(props[x]) {
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

  if( p.isIPad() ) {
    // iPad

    if( version > 7 ) {
      // iPad >= 7.1
      // https://issues.apache.org/jira/browse/CB-4323
      delete viewportProperties.width;

    } else {
      // iPad <= 7.0

      if( p.isWebView() ) {
        // iPad <= 7.0 WebView

        if( orientation == 90 ) {
          // iPad <= 7.0 WebView Landscape
          viewportProperties.height = '0';

        } else if(version == 7) {
          // iPad <= 7.0 WebView Portait
          viewportProperties.height = DEVICE_HEIGHT;
        }
      } else {
        // iPad <= 6.1 Browser
        if(version < 7) {
          viewportProperties.height = '0';
        }
      }
    }

  } else if( p.isIOS() ) {
    // iPhone

    if( p.isWebView() ) {
      // iPhone WebView

      if(version > 7) {
        // iPhone >= 7.1 WebView
        delete viewportProperties.width;

      } else if(version < 7) {
        // iPhone <= 6.1 WebView
        // if height was set it needs to get removed with this hack for <= 6.1
        if( initHeight ) viewportProperties.height = '0';

      } else if(version == 7) {
        //iPhone == 7.0 WebView
        viewportProperties.height = DEVICE_HEIGHT;
      }

    } else {
      // iPhone Browser

      if (version < 7) {
        // iPhone <= 6.1 Browser
        // if height was set it needs to get removed with this hack for <= 6.1
        if( initHeight ) viewportProperties.height = '0';
      }
    }

  }

  // only update the viewport tag if there was a change
  if(initWidth !== viewportProperties.width || initHeight !== viewportProperties.height) {
    viewportTagUpdate();
  }
}

function viewportTagUpdate() {
  var key, props = [];
  for(key in viewportProperties) {
    if( viewportProperties[key] ) {
      props.push(key + (viewportProperties[key] == '_' ? '' : '=' + viewportProperties[key]) );
    }
  }

  viewportTag.content = props.join(', ');
}

ionic.Platform.ready(function() {
  viewportLoadTag();

  window.addEventListener("orientationchange", function(){
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

      deceleration: 0.97,

      /** Callback that is fired on the later of touch end or deceleration end,
        provided that another scrolling action has not begun. Used to know
        when to fade out a scrollbar. */
      scrollingComplete: NOOP,

      /** This configures the amount of change applied to deceleration when reaching boundaries  **/
      penetrationDeceleration : 0.03,

      /** This configures the amount of change applied to acceleration when reaching boundaries  **/
      penetrationAcceleration : 0.08,

      // The ms interval for triggering scroll events
      scrollEventInterval: 10,

      getContentWidth: function() {
        return Math.max(self.__content.scrollWidth, self.__content.offsetWidth);
      },
      getContentHeight: function() {
        return Math.max(self.__content.scrollHeight, self.__content.offsetHeight + self.__content.offsetTop);
      }
		};

    for (var key in options) {
      this.options[key] = options[key];
    }

    this.hintResize = ionic.debounce(function() {
      self.resize();
    }, 1000, true);

    this.onScroll = function() {

      if(!ionic.scroll.isScrolling) {
        setTimeout(self.setScrollStart, 50);
      } else {
        clearTimeout(self.scrollTimer);
        self.scrollTimer = setTimeout(self.setScrollStop, 80);
      }

    };

    this.setScrollStart = function() {
      ionic.scroll.isScrolling = Math.abs(ionic.scroll.lastTop - self.__scrollTop) > 1;
      clearTimeout(self.scrollTimer);
      self.scrollTimer = setTimeout(self.setScrollStop, 80);
    };

    this.setScrollStop = function() {
      ionic.scroll.isScrolling = false;
      ionic.scroll.lastTop = self.__scrollTop;
    };

    this.triggerScrollEvent = ionic.throttle(function() {
      self.onScroll();
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

      //distance from bottom of scrollview to top of viewport
      var scrollBottomOffsetToTop;

      if( !self.isScrolledIntoView ) {
        // shrink scrollview so we can actually scroll if the input is hidden
        // if it isn't shrink so we can scroll to inputs under the keyboard
        if (ionic.Platform.isIOS() || ionic.Platform.isFullScreen){
          // if there are things below the scroll view account for them and
          // subtract them from the keyboard height when resizing
          scrollBottomOffsetToTop = container.getBoundingClientRect().bottom;
          var scrollBottomOffsetToBottom = e.detail.viewportHeight - scrollBottomOffsetToTop;
          var keyboardOffset = Math.max(0, e.detail.keyboardHeight - scrollBottomOffsetToBottom);
          container.style.height = (container.clientHeight - keyboardOffset) + "px";
          container.style.overflow = "visible";
          //update scroll view
          self.resize();
        }
        self.isScrolledIntoView = true;
      }

      //If the element is positioned under the keyboard...
      if( e.detail.isElementUnderKeyboard ) {
        var delay;
        // Wait on android for web view to resize
        if ( ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen ) {
          // android y u resize so slow
          if ( ionic.Platform.version() < 4.4) {
            delay = 500;
          } else {
            // probably overkill for chrome
            delay = 350;
          }
        } else {
          delay = 80;
        }

        //Put element in middle of visible screen
        //Wait for android to update view height and resize() to reset scroll position
        ionic.scroll.isScrolling = true;
        setTimeout(function(){
          //middle of the scrollview, where we want to scroll to
          var scrollMidpointOffset = container.clientHeight * 0.5;

          scrollBottomOffsetToTop = container.getBoundingClientRect().bottom;
          //distance from top of focused element to the bottom of the scroll view
          var elementTopOffsetToScrollBottom = e.detail.elementTop - scrollBottomOffsetToTop;

          var scrollTop = elementTopOffsetToScrollBottom  + scrollMidpointOffset;

          if (scrollTop > 0){
            ionic.tap.cloneFocusedInput(container, self);
            self.scrollBy(0, scrollTop, true);
            self.onScroll();
          }
        }, delay);
      }

      //Only the first scrollView parent of the element that broadcasted this event
      //(the active element that needs to be shown) should receive this event
      e.stopPropagation();
    });

    container.addEventListener('resetScrollView', function(e) {
      //return scrollview to original height once keyboard has hidden
      self.isScrolledIntoView = false;
      container.style.height = "";
      container.style.overflow = "";
      self.resize();
      ionic.scroll.isScrolling = false;
    });

    function getEventTouches(e) {
      return e.touches && e.touches.length ? e.touches : [{
        pageX: e.pageX,
        pageY: e.pageY
      }];
    }

    self.touchStart = function(e) {
      self.startCoordinates = getPointerCoordinates(e);

      if ( ionic.tap.ignoreScrollStart(e) ) {
        return;
      }

      self.__isDown = true;

      if( ionic.tap.containsOrIsTextInput(e.target) || e.target.tagName === 'SELECT' ) {
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
      if(!self.__isDown ||
        e.defaultPrevented ||
        (e.target.tagName === 'TEXTAREA' && e.target.parentElement.querySelector(':focus')) ) {
        return;
      }

      if( !self.__hasStarted && ( ionic.tap.containsOrIsTextInput(e.target) || e.target.tagName === 'SELECT' ) ) {
        // the target is a text input and scroll has started
        // since the text input doesn't start on touchStart, do it here
        self.__hasStarted = true;
        self.doTouchStart(getEventTouches(e), e.timeStamp);
        e.preventDefault();
        return;
      }

      if(self.startCoordinates) {
        // we have start coordinates, so get this touch move's current coordinates
        var currentCoordinates = getPointerCoordinates(e);

        if( self.__isSelectable &&
            ionic.tap.isTextInput(e.target) &&
            Math.abs(self.startCoordinates.x - currentCoordinates.x) > 20 ) {
          // user slid the text input's caret on its x axis, disable any future y scrolling
          self.__enableScrollY = false;
          self.__isSelectable = true;
        }

        if( self.__enableScrollY && Math.abs(self.startCoordinates.y - currentCoordinates.y) > 10 ) {
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

    self.touchEnd = function(e) {
      if(!self.__isDown) return;

      self.doTouchEnd(e.timeStamp);
      self.__isDown = false;
      self.__hasStarted = false;
      self.__isSelectable = true;
      self.__enableScrollY = true;

      if( !self.__isDragging && !self.__isDecelerating && !self.__isAnimating ) {
        ionic.tap.removeClonedInputs(container, self);
      }
    };

    self.options.orgScrollingComplete = self.options.scrollingComplete;
    self.options.scrollingComplete = function() {
      ionic.tap.removeClonedInputs(container, self);
      self.options.orgScrollingComplete();
    };

    if ('ontouchstart' in window) {
      // Touch Events
      container.addEventListener("touchstart", self.touchStart, false);
      document.addEventListener("touchmove", self.touchMove, false);
      document.addEventListener("touchend", self.touchEnd, false);
      document.addEventListener("touchcancel", self.touchEnd, false);

    } else if (window.navigator.pointerEnabled) {
      // Pointer Events
      container.addEventListener("pointerdown", self.touchStart, false);
      document.addEventListener("pointermove", self.touchMove, false);
      document.addEventListener("pointerup", self.touchEnd, false);
      document.addEventListener("pointercancel", self.touchEnd, false);

    } else if (window.navigator.msPointerEnabled) {
      // IE10, WP8 (Pointer Events)
      container.addEventListener("MSPointerDown", self.touchStart, false);
      document.addEventListener("MSPointerMove", self.touchMove, false);
      document.addEventListener("MSPointerUp", self.touchEnd, false);
      document.addEventListener("MSPointerCancel", self.touchEnd, false);

    } else {
      // Mouse Events
      var mousedown = false;

      self.mouseDown = function(e) {
        if ( ionic.tap.ignoreScrollStart(e) || e.target.tagName === 'SELECT' ) {
          return;
        }
        self.doTouchStart(getEventTouches(e), e.timeStamp);

        if( !ionic.tap.isTextInput(e.target) ) {
          e.preventDefault();
        }
        mousedown = true;
      };

      self.mouseMove = function(e) {
        if (!mousedown || e.defaultPrevented) {
          return;
        }

        self.doTouchMove(getEventTouches(e), e.timeStamp);

        mousedown = true;
      };

      self.mouseUp = function(e) {
        if (!mousedown) {
          return;
        }

        self.doTouchEnd(e.timeStamp);

        mousedown = false;
      };

      self.mouseWheel = ionic.animationFrameThrottle(function(e) {
        var scrollParent = ionic.DomUtil.getParentOrSelfWithClass(e.target, 'ionic-scroll');
        if (scrollParent === self.__container) {

          self.hintResize();
          self.scrollBy(
            e.wheelDeltaX/self.options.wheelDampen,
            -e.wheelDeltaY/self.options.wheelDampen
          );

          self.__fadeScrollbars('in');
          clearTimeout(self.__wheelHideBarTimeout);
          self.__wheelHideBarTimeout = setTimeout(function() {
            self.__fadeScrollbars('out');
          }, 100);
        }
      });

      container.addEventListener("mousedown", self.mouseDown, false);
      document.addEventListener("mousemove", self.mouseMove, false);
      document.addEventListener("mouseup", self.mouseUp, false);
      document.addEventListener('mousewheel', self.mouseWheel, false);
    }
  },

  __removeEventHandlers: function() {
    var container = this.__container;

    container.removeEventListener('touchstart', self.touchStart);
    document.removeEventListener('touchmove', self.touchMove);
    document.removeEventListener('touchend', self.touchEnd);
    document.removeEventListener('touchcancel', self.touchCancel);

    container.removeEventListener("pointerdown", self.touchStart);
    document.removeEventListener("pointermove", self.touchMove);
    document.removeEventListener("pointerup", self.touchEnd);
    document.removeEventListener("pointercancel", self.touchEnd);

    container.removeEventListener("MSPointerDown", self.touchStart);
    document.removeEventListener("MSPointerMove", self.touchMove);
    document.removeEventListener("MSPointerUp", self.touchEnd);
    document.removeEventListener("MSPointerCancel", self.touchEnd);

    container.removeEventListener("mousedown", self.mouseDown);
    document.removeEventListener("mousemove", self.mouseMove);
    document.removeEventListener("mouseup", self.mouseUp);
    document.removeEventListener('mousewheel', self.mouseWheel);
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
      this.options.getContentWidth(),
      this.options.getContentHeight()
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

      return function(left, top, zoom, wasResize) {
        content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
        self.__repositionScrollbars();
        if(!wasResize) {
          self.triggerScrollEvent();
        }
      };

    } else if (helperElem.style[transformProperty] !== undef) {

      return function(left, top, zoom, wasResize) {
        content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
        self.__repositionScrollbars();
        if(!wasResize) {
          self.triggerScrollEvent();
        }
      };

    } else {

      return function(left, top, zoom, wasResize) {
        content.style.marginLeft = left ? (-left/zoom) + 'px' : '';
        content.style.marginTop = top ? (-top/zoom) + 'px' : '';
        content.style.zoom = zoom || '';
        self.__repositionScrollbars();
        if(!wasResize) {
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
    self.scrollTo(self.__scrollLeft, self.__scrollTop, true, null, true);

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

    var self = this;
    var change = wheelDelta > 0 ? 0.97 : 1.03;

    return self.zoomTo(self.__zoomLevel * change, false, pageX - self.__clientLeft, pageY - self.__clientTop);

  },

  /**
   * Touch start handler for scrolling support
   */
  doTouchStart: function(touches, timeStamp) {
    this.hintResize();

    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }
    if (typeof timeStamp !== "number") {
      timeStamp = Date.now();
    }

    var self = this;

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

    if(!self.__didWaitForSize && !self.__maxScrollLeft && !self.__maxScrollTop) {
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

      if((self.options.scrollingX && !self.__maxScrollLeft) || (self.options.scrollingY && !self.__maxScrollTop)) {
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

        //Make sure the scroll values are within the boundaries after a bounce,
        //not below 0 or above maximum
        if (self.options.bouncing) {
          self.scrollTo(
            Math.min( Math.max(self.__scrollLeft, 0), self.__maxScrollLeft ),
            Math.min( Math.max(self.__scrollTop, 0), self.__maxScrollTop ),
            false
          );
        }
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
    return Math.sqrt((x*x) + (y*y));
  },


  /**
   * calculate the scale factor between two touchLists (fingers)
   * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
   * @param   {Array}     start
   * @param   {Array}     end
   * @returns {Number}    scale
   */
  __getScale: function getScale(start, end) {

    var self = this;

    // need two fingers...
    if(start.length >= 2 && end.length >= 2) {
      return self.__getDistance(end[0], end[1]) /
        self.__getDistance(start[0], start[1]);
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

      var self = this;
      //We have to rAF here so all of the elements have time to initialize
      ionic.requestAnimationFrame(function() {
        var i, c, childSize;
        var childNodes = self.el.childNodes;
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
            var bounds = ionic.DomUtil.getTextBounds(c);
            if(bounds) {
              childSize = bounds.width;
            }
          } else if(c.nodeType == 1) {
            childSize = c.offsetWidth;
          }
          if(childSize) {
            if (isCountingRightWidth) {
              rightWidth += childSize;
            } else {
              leftWidth += childSize;
            }
          }
        }

        var margin = Math.max(leftWidth, rightWidth) + 10;

        //Reset left and right before setting again
        titleEl.style.left = titleEl.style.right = '';

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
    this.canSwipe = opts.canSwipe;
  };

  SlideDrag.prototype = new DragOp();

  SlideDrag.prototype.start = function(e) {
    var content, buttons, offsetX, buttonsWidth;

    if (!this.canSwipe()) {
      return;
    }

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
    if(op._lastDrag && this._currentDrag) {
      return this._currentDrag.content == op._lastDrag.content;
    }
    return false;
  };

  SlideDrag.prototype.clean = function(e) {
    var lastDrag = this._lastDrag;

    if(!lastDrag) return;

    lastDrag.content.style[ionic.CSS.TRANSITION] = '';
    lastDrag.content.style[ionic.CSS.TRANSFORM] = '';
    ionic.requestAnimationFrame(function() {
      setTimeout(function() {
        lastDrag.buttons && lastDrag.buttons.classList.add('invisible');
      }, 250);
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
        var buttons = _this._currentDrag.buttons;
        setTimeout(function() {
          buttons && buttons.classList.add('invisible');
        }, 250);
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
    this.listEl = opts.listEl;
    this.el = opts.el;
    this.scrollEl = opts.scrollEl;
    this.scrollView = opts.scrollView;
    // Get the True Top of the list el http://www.quirksmode.org/js/findpos.html
    this.listElTrueTop = 0;
    if (this.listEl.offsetParent) {
      var obj = this.listEl;
      do {
        this.listElTrueTop += obj.offsetTop;
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
    this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(0, '+y+'px, 0)';
  };

  ReorderDrag.prototype.start = function(e) {
    var content;

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
    if(!this._currentDrag) {
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
      var pixelsPastTop = containerTop - pageY + this._currentDrag.elementHeight/2;
      var pixelsPastBottom = pageY + this._currentDrag.elementHeight/2 - containerTop - container.offsetHeight;

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
    if(!this._isDragging && Math.abs(e.gesture.deltaY) > this.dragThresholdY) {
      this._isDragging = true;
    }

    if(this._isDragging) {
      this._moveElement(e);

      this._currentDrag.currentY = scrollY + pageY - offset;

      // this._reorderItems();
    }
  });

  // When an item is dragged, we need to reorder any items for sorting purposes
  ReorderDrag.prototype._getReorderIndex = function() {
    var self = this;
    var placeholder = this._currentDrag.placeholder;
    var siblings = Array.prototype.slice.call(this._currentDrag.placeholder.parentNode.children)
      .filter(function(el) {
        return el.nodeName === self.el.nodeName && el !== self.el;
      });

    var dragOffsetTop = this._currentDrag.currentY;
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
                 dragOffsetTop < el.offsetTop + el.offsetHeight * 1.5) {
        return i;
      }
    }
    return this._currentDrag.startIndex;
  };

  ReorderDrag.prototype.end = function(e, doneCallback) {
    if(!this._currentDrag) {
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
        canSwipe: function() {
          return true;
        }
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
        if(target.classList && target.classList.contains(ITEM_CLASS)) {
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
      var item;

      // Check if this is a reorder drag
      if(ionic.DomUtil.getParentOrSelfWithClass(e.target, ITEM_REORDER_BTN_CLASS) && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
        item = this._getItem(e.target);

        if(item) {
          this._dragOp = new ReorderDrag({
            listEl: this.el,
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
        item = this._getItem(e.target);
        if(item && item.querySelector('.item-options')) {
          this._dragOp = new SlideDrag({ el: this.el, canSwipe: this.canSwipe });
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
    var slider = this;

    // utilities
    var noop = function() {}; // simple no operation function
    var offloadFn = function(fn) { setTimeout(fn || noop, 0); }; // offload a functions execution

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
        if(event.type == 'mousedown' || event.type == 'mouseup' || event.type == 'mousemove') {
          event.touches = [{
            pageX: event.pageX,
            pageY: event.pageY
          }];
        }

        switch (event.type) {
          case 'mousedown': this.start(event); break;
          case 'touchstart': this.start(event); break;
          case 'touchmove': this.touchmove(event); break;
          case 'mousemove': this.touchmove(event); break;
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
          time: +new Date()

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
      touchmove: function(event) {

        // ensure swiping with one touch and not pinching
        // ensure sliding is enabled
        if (event.touches.length > 1 ||
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

            translate(circle(index-1), delta.x + slidePos[circle(index-1)], 0);
            translate(index, delta.x + slidePos[index], 0);
            translate(circle(index+1), delta.x + slidePos[circle(index+1)], 0);

          } else {

            delta.x =
              delta.x /
                ( (!index && delta.x > 0 ||         // if first slide and sliding left
                  index == slides.length - 1 &&     // or if last slide and sliding right
                  delta.x < 0                       // and if sliding at all
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
        var duration = +new Date() - start.time;

        // determine if slide attempt triggers next/prev slide
        var isValidSlide =
              Number(duration) < 250 &&         // if slide duration is less than 250ms
              Math.abs(delta.x) > 20 ||         // and if slide amt is greater than 20px
              Math.abs(delta.x) > width/2;      // or if slide amt is greater than half the width

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
          element.removeEventListener('touchmove', events, false);
          element.removeEventListener('touchend', events, false);
        } else {
          element.removeEventListener('mousemove', events, false);
          element.removeEventListener('mouseup', events, false);
          document.removeEventListener('mouseup', events, false);
        }

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

    this.enableSlide = function(shouldEnable) {
      if (arguments.length) {
        this.slideIsDisabled = !shouldEnable;
      }
      return !this.slideIsDisabled;
    },
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

    this.start = function() {
      begin();
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

        window.onresize = function () { setup(); }; // to play nice with old IE

      }
    };

  }
});

})(ionic);

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
        if (!self._dragInfo) { return; }

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
      return this.getOpenAmount() !== 0;
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

      if(percentage !== 0) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
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

})();