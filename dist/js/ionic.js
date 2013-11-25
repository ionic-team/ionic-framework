/**
 * Copyright 2013 Drifty Co.
 * http://drifty.com/

 * Ionic - a powerful HTML5 mobile app framework.
 * http://ionicframework.com/
 *
 *
 * By @maxlynch, @helloimben, @adamdbradley <3
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 * 
 */
;

// Create namespaces 
window.ionic = {
  controllers: {},
  views: {}
};
;
(function(ionic) {

  var bezierCoord = function (x,y) {
    if(!x) var x=0;
    if(!y) var y=0;
    return {x: x, y: y};
  }

  function B1(t) { return t*t*t }
  function B2(t) { return 3*t*t*(1-t) }
  function B3(t) { return 3*t*(1-t)*(1-t) }
  function B4(t) { return (1-t)*(1-t)*(1-t) }

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
          t2 = (t1 - t0) * .5 + t0;
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
;
(function(ionic) {
  ionic.DomUtil = {
    getTextBounds: function(textNode) {
      if(document.createRange) {
        var range = document.createRange();
        range.selectNodeContents(textNode);
        if(range.getBoundingClientRect) {
          var rect = range.getBoundingClientRect();

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
      return null
    },

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
    swapNodes: function(src, dest) {
      dest.parentNode.insertBefore(src, dest);
    },
    /**
     * {returns} the closest parent matching the className
     */
    getParentWithClass: function(e, className) {
      while(e.parentNode) {
        if(e.parentNode.classList && e.parentNode.classList.contains(className)) {
          return e.parentNode;
        }
        e = e.parentNode;
      }
      return null;
    },
    /**
     * {returns} the closest parent or self matching the className
     */
    getParentOrSelfWithClass: function(e, className) {
      while(e) {
        if(e.classList && e.classList.contains(className)) {
          return e;
        }
        e = e.parentNode;
      }
      return null;
    }
  };
})(window.ionic);
;
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
        evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      };

      CustomEvent.prototype = window.Event.prototype;

      window.CustomEvent = CustomEvent;
    })();
  }

  ionic.EventController = {
    VIRTUALIZED_EVENTS: ['tap', 'swipe', 'swiperight', 'swipeleft', 'drag', 'hold', 'release'],

    // Trigger a new event
    trigger: function(eventType, data) {
      var event = new CustomEvent(eventType, { detail: data });

      // Make sure to trigger the event on the given target, or dispatch it from
      // the window if we don't have an event target
      data && data.target && data.target.dispatchEvent(event) || window.dispatchEvent(event);
    },
  
    // Bind an event
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

    off: function(type, callback, element) {
      element.removeEventListener(type, callback);
    },

    // Register for a new gesture event on the given element
    onGesture: function(type, callback, element) {
      var gesture = new ionic.Gesture(element);
      gesture.on(type, callback);
      return gesture;
    },

    // Unregister a previous gesture event
    offGesture: function(gesture, type, callback) {
      gesture.off(type, callback);
    },

    handlePopState: function(event) {
    },
  };
  
  
  // Map some convenient top-level functions for event handling
  ionic.on = function() { ionic.EventController.on.apply(ionic.EventController, arguments); };
  ionic.off = function() { ionic.EventController.off.apply(ionic.EventController, arguments); };
  ionic.trigger = function() { ionic.EventController.trigger.apply(ionic.EventController.trigger, arguments); };
  ionic.onGesture = function() { return ionic.EventController.onGesture.apply(ionic.EventController.onGesture, arguments); };
  ionic.offGesture = function() { return ionic.EventController.offGesture.apply(ionic.EventController.offGesture, arguments); };

})(window.ionic);
;
/**
  * Simple gesture controllers with some common gestures that emit
  * gesture events.
  *
  * Ported from github.com/EightMedia/ionic.Gestures.js - thanks!
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
    // add styles and attributes to the element to prevent the browser from doing
    // its native behavior. this doesnt prevent the scrolling, but cancels
    // the contextmenu, tap highlighting etc
    // set to false to disable this
    stop_browser_behavior: {
      // this also triggers onselectstart=false for IE
      userSelect: 'none',
      // this makes the element blocking in IE10 >, you could experiment with the value
      // see for more options this issue; https://github.com/EightMedia/hammer.js/issues/241
      touchAction: 'none',
      touchCallout: 'none',
      contentZooming: 'none',
      userDrag: 'none',
      tapHighlightColor: 'rgba(0,0,0,0)'
    }

                           // more settings are defined per gesture at gestures.js
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
   * @constructor
   */
  ionic.Gestures.Instance = function(element, options) {
    var self = this;

    // A null element was passed into the instance, which means
    // whatever lookup was done to find this element failed to find it
    // so we can't listen for events on it.
    if(element === null) {
      console.error('Null element passed to gesture (element does not exist). Not listening for gesture');
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
   * @type {Object}
   */
  var last_move_event = null;


  /**
   * when the mouse is hold down, this is true
   * @type {Boolean}
   */
  var enable_detect = false;


  /**
   * when touch events have been fired, this is true
   * @type {Boolean}
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
     * @type {Object}
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
     * @parm	{Boolean}	merge		do a merge
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
     * stop browser default behavior with css props
     * @param   {HtmlElement}   element
     * @param   {Object}        css_props
     */
    stopDefaultBrowserBehavior: function stopDefaultBrowserBehavior(element, css_props) {
      var prop,
      vendors = ['webkit','khtml','moz','Moz','ms','o',''];

      if(!css_props || !element.style) {
        return;
      }

      // with css properties for modern browsers
      for(var i = 0; i < vendors.length; i++) {
        for(var p in css_props) {
          if(css_props.hasOwnProperty(p)) {
            prop = p;

            // vender prefix at the property
            if(vendors[i]) {
              prop = vendors[i] + prop.substring(0, 1).toUpperCase() + prop.substring(1);
            }

            // set the style
            element.style[prop] = css_props[p];
          }
        }
      }

      // also the disable onselectstart
      if(css_props.userSelect == 'none') {
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
    *      @readonly
    *      @param  {ionic.Gestures.Instance}    inst
    *      the instance we do the detection for
    *
    *      @readonly
    *      @param  {Object}    startEvent
    *      contains the properties of the first gesture detection in this sessionic.
    *      Used for calculations about timing, distance, etc.
    *
    *      @readonly
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
       * @events  hold
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
   * @events  tap, doubletap
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
   * @events  swipe, swipeleft, swiperight, swipeup, swipedown
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
   * @events  drag, drapleft, dragright, dragup, dragdown
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
   * @events  transform, pinch, pinchin, pinchout, rotate
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
   * @events  touch
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
   * @events  release
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
;
(function(ionic) {

  ionic.Platform = {
    detect: function() {
      var platforms = [];

      this._checkPlatforms(platforms);

      for(var i = 0; i < platforms.length; i++) {
        document.body.classList.add('platform-' + platforms[i]);
      }

    },
    _checkPlatforms: function(platforms) {
      if(this.isCordova()) {
        platforms.push('cordova');
      }
      if(this.isIOS7()) {
        platforms.push('ios7');
      }
    },

    // Check if we are running in Cordova, which will have
    // window.device available.
    isCordova: function() {
      return (window.cordova || window.PhoneGap || window.phonegap);
      //&& /^file:\/{3}[^\/]/i.test(window.location.href) 
      //&& /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
    },
    isIOS7: function() {
      if(!window.device) {
        return false;
      }
      return parseFloat(window.device.version) >= 7.0;
    }
  };

  ionic.Platform.detect();
})(window.ionic);
;
(function(window, document, ionic) {
  'use strict';

  // From the man himself, Mr. Paul Irish.
  // The requestAnimationFrame polyfill
  window.rAF = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  // Ionic CSS polyfills
  ionic.CSS = {};
  
  (function() {
    var d = document.createElement('div');
    var keys = ['webkitTransform', 'transform', '-webkit-transform', 'webkit-transform',
                '-moz-transform', 'moz-transform', 'MozTransform', 'mozTransform'];

    for(var i = 0; i < keys.length; i++) {
      if(d.style[keys[i]] !== undefined) {
        ionic.CSS.TRANSFORM = keys[i];
        break;
      }
    }
  })();

  // polyfill use to simulate native "tap"
  function inputTapPolyfill(ele, e) {
    if(ele.type === "radio" || ele.type === "checkbox") {
      //ele.checked = !ele.checked;
    } else if(ele.type === "submit" || ele.type === "button") {
      ionic.trigger('click', {
        target: ele
      });
    } else {
      ele.focus();
    }
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  function tapPolyfill(e) {
    // if the source event wasn't from a touch event then don't use this polyfill
    if(!e.gesture || e.gesture.pointerType !== "touch" || !e.gesture.srcEvent) return;

    // An internal Ionic indicator for angular directives that contain
    // elements that normally need poly behavior, but are already processed
    // (like the radio directive that has a radio button in it, but handles
    // the tap stuff itself). This is in contrast to preventDefault which will
    // mess up other operations like change events and such
    if(e.alreadyHandled) {
      return;
    }

    e = e.gesture.srcEvent; // evaluate the actual source event, not the created event by gestures.js

    var ele = e.target;

    while(ele) {
      if( ele.tagName === "INPUT" || ele.tagName === "TEXTAREA" || ele.tagName === "SELECT" ) {
        return inputTapPolyfill(ele, e);
      } else if( ele.tagName === "LABEL" ) {
        if(ele.control) {
          return inputTapPolyfill(ele.control, e);
        }
      } else if( ele.tagName === "A" ) {
        var href = ele.getAttribute('href');
        if(href) {
          ionic.trigger('click', {
            target: ele
          });
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
      }
      ele = ele.parentElement;
    }

    // they didn't tap one of the above elements
    // if the currently active element is an input, and they tapped outside
    // of the current input, then unset its focus (blur) so the keyboard goes away
    var activeElement = document.activeElement;
    if(activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.tagName === "SELECT")) {
      activeElement.blur();
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
  }

  // global tap event listener polyfill for HTML elements that were "tapped" by the user
  ionic.on("tap", tapPolyfill, window);

})(this, document, ionic);
;
(function(ionic) {
  
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
    }
  };

  // Bind a few of the most useful functions to the ionic scope
  ionic.inherit = ionic.Utils.inherit;
  ionic.extend = ionic.Utils.extend;
  ionic.throttle = ionic.Utils.throttle;
  ionic.proxy = ionic.Utils.proxy;
  ionic.debounce = ionic.Utils.debounce;

})(window.ionic);
;
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
;
/**
 * ionic.views.Scroll. Portions lovingly adapted from the great iScroll 5, which is
 * also MIT licensed.
 * iScroll v5.0.5 ~ (c) 2008-2013 Matteo Spinelli ~ http://cubiq.org/license
 *
 * Think of ionic.views.Scroll like a Javascript version of UIScrollView or any 
 * scroll container in any UI library. You could just use -webkit-overflow-scrolling: touch,
 * but you lose control over scroll behavior that native developers have with things
 * like UIScrollView, and you don't get events after the finger stops touching the
 * device (after a flick, for example).
 *
 * Some people are afraid of using Javascript powered scrolling, but
 * with today's devices, Javascript is probably the best solution for
 * scrolling in hybrid apps. Someone's code is running somewhere, even on native, right?
 */
(function(ionic) {
'use strict';

  // Some easing functions for animations
  var EASING_FUNCTIONS = {
    quadratic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
		circular: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
    circular2: 'cubic-bezier(0.075, 0.82, 0.165, 1)',

    bounce: 'cubic-bezier(.02,.69,.67,1)',

    // It closes like a high-end toilet seat. Fast, then nice and slow.
    // Thanks to our @xtheglobe for that.
    toiletSeat: 'cubic-bezier(0.05, 0.60, 0.05, 0.60)'
  };

  ionic.views.Scroll = ionic.views.View.inherit({

    initialize: function(opts) {
      var _this = this;

      // Extend the options with our defaults
      opts = ionic.Utils.extend({
        decelerationRate: ionic.views.Scroll.prototype.DECEL_RATE_NORMAL,
        dragThreshold: 10,
        
        // Resistance when scrolling too far up or down
        rubberBandResistance: 2,

        // Scroll event names. These are custom so can be configured
        scrollEventName: 'momentumScrolled',
        scrollEndEventName: 'momentumScrollEnd',

        hasPullToRefresh: true,

        // Whether to disable overflow rubber banding when content is small
        // enough to fit in the viewport (i.e. doesn't need scrolling)
        disableNonOverflowRubberBand: true,

        // Called as the refresher is opened, an amount is passed
        onRefreshOpening: function() {},
        // Called when let go and is refreshing
        onRefresh: function() {},
        refreshEasing: EASING_FUNCTIONS.bounce,
        // ms transition time
        refreshEasingTime: 400,
        refreshOpeningInterval: 100,

        // How frequently to fire scroll events in the case of 
        // a flick or momentum scroll where the finger is no longer
        // touching the screen. If your event handler is a performance
        // hog, change this millisecond value to cut down on the frequency
        // of events triggered in those instances.
        inertialEventInterval: 50,

        // How quickly to scroll with a mouse wheel. 20 is a good default
        mouseWheelSpeed: 20,

        // Invert the mouse wheel? This makes sense on new Macbooks, but
        // nowhere else.
        invertWheel: false,

        // Enable vertical scrolling
        isVerticalEnabled: true,

        // Enable horizontal scrolling
        isHorizontalEnabled: false,

        // The easing function to use for bouncing up or down on the bounds
        // of the scrolling area
        bounceEasing: EASING_FUNCTIONS.bounce,

        //how long to take when bouncing back in a rubber band
        bounceTime: 600 
      }, opts);

      ionic.extend(this, opts);

      this.el = opts.el;

      this.y = 0;
      this.x = 0;

      // Create a throttled pull to refresh "opening" function
      // which will get called as the refresh "opens" from drag
      var refreshOpening = _this.onRefreshOpening;
      _this.onRefreshOpening = ionic.throttle(function(ratio) {
        refreshOpening && refreshOpening(ratio);
      }, 100);

      // Listen for drag and release events
      ionic.onGesture('drag', function(e) {
        _this._handleDrag(e);
        e.gesture.srcEvent.preventDefault();
      }, this.el);
      ionic.onGesture('release', function(e) {
        _this._handleEndDrag(e);
      }, this.el);
      ionic.on('mousewheel', function(e) {
        _this._wheel(e);
      }, this.el);
      ionic.on('DOMMouseScroll', function(e) {
        _this._wheel(e);
      }, this.el);
      ionic.on(this.scrollEndEventName, function(e) {
        _this._onScrollEnd(e);
      }, this.el);
      ionic.on('webkitTransitionEnd', function(e) {
        _this._onTransitionEnd(e);
      });
    },

    // Called by user to tell the scroll view to stop pull to refresh
    doneRefreshing: function() {
      var _this = this;

      this._scrollTo(0, 0, this.refreshEasingTime, this.refreshEasing);

      this._isHoldingRefresh = false;

      // Hide the refresher
      setTimeout(function() {
        _this._refresher.style.display = 'none';
        _this._isRefresherHidden = true;
      }, this.refreshEasingTime);
    },

    /**
     * Scroll to the given X and Y point, taking 
     * the given amount of time, with the given
     * easing function defined as a CSS3 timing function.
     *
     * Note: the x and y values will be converted to negative offsets due to
     * the way scrolling works internally.
     *
     * @param {float} the x position to scroll to (CURRENTLY NOT SUPPORTED!)
     * @param {float} the y position to scroll to
     * @param {float} the time to take scrolling to the new position
     * @param {easing} the animation function to use for easing
     */
    scrollTo: function(x, y, time, easing) {
      this._scrollTo(-x, -y, time, easing);
    },

    _scrollTo: function(x, y, time, easing) {
      var _this = this;

      time = time || 0;

      var start = Date.now();

      easing = easing || 'cubic-bezier(0.1, 0.57, 0.1, 1)';
      var easingValues = easing.replace('cubic-bezier(', '').replace(')', '').split(',');
      easingValues = [parseFloat(easingValues[0]), parseFloat(easingValues[1]), parseFloat(easingValues[2]), parseFloat(easingValues[3])];

      var cubicBezierFunction = ionic.Animator.getCubicBezier(easingValues[0], easingValues[1], easingValues[2], easingValues[3], time);

      var ox = this.x, oy = this.y;


      var el = this.el;

      if(x !== null) {
        this.x = x;
      } else {
        x = this.x;
      }
      if(y !== null) {
        this.y = y;
      } else {
        y = this.y;
      }

      if(ox == x && oy == y) {
        time = 0;
      }

      var dx = ox - x;
      var dy = oy - y;

      el.offsetHeight;
      el.style.webkitTransitionTimingFunction = easing;
      el.style.webkitTransitionDuration = time;
      el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + x + 'px,' + y + 'px, 0)';

      // Stop any other momentum event callbacks
      clearTimeout(this._momentumStepTimeout);

      // Start triggering events as the element scrolls from inertia.
      // This is important because we need to receive scroll events
      // even after a "flick" and adjust, etc.
      if(time > 0) {
        this._momentumStepTimeout = setTimeout(function eventNotify() {
          // Calculate where in the animation process we might be
          var diff = Math.min(time, Math.abs(Date.now() - start));

          // How far along in time have we moved
          var timeRatio = diff / time;

          // Interpolate the transition values, using the same
          // cubic bezier animation function used in the transition.
          var bx = ox - dx * cubicBezierFunction(timeRatio);
          var by = oy - dy * cubicBezierFunction(timeRatio);

          _this.didScroll && _this.didScroll({
            target: _this.el,
            scrollLeft: -bx,
            scrollTop: -by
          });
          ionic.trigger(_this.scrollEventName, {
            target: _this.el,
            scrollLeft: -bx,
            scrollTop: -by
          });

          if(_this.isDragging) {
            _this._momentumStepTimeout = setTimeout(eventNotify, _this.inertialEventInterval);
          }
        }, this.inertialEventInterval);
      } else {
        this.didScroll && this.didScroll({
          target: this.el,
          scrollLeft: -this.x,
          scrollTop: -this.y
        });
        ionic.trigger(this.scrollEventName, {
          target: this.el,
          scrollLeft: -this.x,
          scrollTop: -this.y
        });
      }
    },

    /**
     * Check if the current scroll bounds needs to be brought back to the min/max
     * allowable given the total scrollable area.
     */
    needsWrapping: function() {
      var _this = this;

      var totalWidth = this.el.scrollWidth;
      var totalHeight = this.el.scrollHeight;
      var parentWidth = this.el.parentNode.offsetWidth;
      var parentHeight = this.el.parentNode.offsetHeight;

      var maxX = Math.min(0, (-totalWidth + parentWidth));
      var maxY = Math.min(0, (-totalHeight + parentHeight));

      if (this.isHorizontalEnabled && (this.x > 0 || this.x < maxX)) {
        return true;
      }
      
      if (this.isVerticalEnabled && (this.y > 0 || this.y < maxY)) {
        return true;
      }

      return false;
    },

    /**
     * If the scroll position is outside the current bounds,
     * animate it back.
     */
    wrapScrollPosition: function(transitionTime) {
      var _this = this;

      var totalWidth = _this.el.scrollWidth;
      var totalHeight = _this.el.scrollHeight;
      var parentWidth = _this.el.parentNode.offsetWidth;
      var parentHeight = _this.el.parentNode.offsetHeight;

      var maxX = Math.min(0, (-totalWidth + parentWidth));
      var maxY = Math.min(0, (-totalHeight + parentHeight));

        //this._execEvent('scrollEnd');
      var x = _this.x, y = _this.y;

      if (!_this.isHorizontalEnabled || _this.x > 0) {
        x = 0;
      } else if ( _this.x < maxX) {
        x = maxX;
      }

      if (!_this.isVerticalEnabled || _this.y > 0) {
        y = 0;
      } else if (_this.y < maxY) {
        y = maxY;
      }

      // No change
      if (x == _this.x && y == _this.y) {
        return false;
      }
      _this._scrollTo(x, y, transitionTime || 0, _this.bounceEasing);
    
      return true;
    },

    _wheel: function(e) {
      var wheelDeltaX, wheelDeltaY,
        newX, newY,
        that = this;

      var totalWidth = this.el.scrollWidth;
      var totalHeight = this.el.scrollHeight;
      var parentWidth = this.el.parentNode.offsetWidth;
      var parentHeight = this.el.parentNode.offsetHeight;

      var maxX = Math.min(0, (-totalWidth + parentWidth));
      var maxY = Math.min(0, (-totalHeight + parentHeight));

      // Execute the scrollEnd event after 400ms the wheel stopped scrolling
      clearTimeout(this.wheelTimeout);
      this.wheelTimeout = setTimeout(function () {
        that._doneScrolling();
      }, 400);

      e.preventDefault();

      if('wheelDeltaX' in e) {
        wheelDeltaX = e.wheelDeltaX / 120;
        wheelDeltaY = e.wheelDeltaY / 120;
      } else if ('wheelDelta' in e) {
        wheelDeltaX = wheelDeltaY = e.wheelDelta / 120;
      } else if ('detail' in e) {
        wheelDeltaX = wheelDeltaY = -e.detail / 3;
      } else {
        return;
      }

      wheelDeltaX *= this.mouseWheelSpeed;
      wheelDeltaY *= this.mouseWheelSpeed;

      if(!this.isVerticalEnabled) {
        wheelDeltaX = wheelDeltaY;
        wheelDeltaY = 0;
      }

      newX = this.x + (this.isHorizontalEnabled ? wheelDeltaX * (this.invertWheel ? -1 : 1) : 0);
      newY = this.y + (this.isVerticalEnabled ? wheelDeltaY * (this.invertWheel ? -1 : 1) : 0);

      if(newX > 0) {
        newX = 0;
      } else if (newX < maxX) {
        newX = maxX;
      }

      if(newY > 0) {
        newY = 0;
      } else if (newY < maxY) {
        newY = maxY;
      }

      this._scrollTo(newX, newY, 0);
    },

    _getMomentum: function (current, start, time, lowerMargin, wrapperSize) {
      var distance = current - start,
        speed = Math.abs(distance) / time,
        destination,
        duration,
        deceleration = 0.0006;

      // Calculate the final desination
      destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
      duration = speed / deceleration;

      if(speed === 0) {
        return {
          destination: current,
          duration: 0
        };
      }

      // Check if the final destination needs to be rubber banded
      if ( destination < lowerMargin ) {
        // We have dragged too far down, snap back to the maximum
        destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
        distance = Math.abs(destination - current);
        duration = distance / speed;
      } else if ( destination > 0 ) {

        // We have dragged too far up, snap back to 0
        destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
        distance = Math.abs(current) + destination;
        duration = distance / speed;
      }

      return {
        destination: Math.round(destination),
        duration: duration
      };
    },

    _onTransitionEnd: function(e) {
      var _this = this;

      if (e.target != this.el) {
        return;
      }

      if(this._isHoldingRefresh) {
        return;
      }

      var needsWrapping = this.needsWrapping();

      // Triggered to end scroll, once the final animation has ended
      if(needsWrapping && this._didEndScroll) {
        this._didEndScroll = false;
        this._doneScrolling();
      } else if(!needsWrapping) {
        this._didEndScroll = false;
        this._doneScrolling();
      }

      this.el.style.webkitTransitionDuration = '0';

      window.rAF(function() {
        if(_this.wrapScrollPosition(_this.bounceTime)) {
          _this._didEndScroll = true;
        }
      });
    },

    _onScrollEnd: function() {
      this.isDragging = false;
      this._drag = null;
      this.el.classList.remove('scroll-scrolling');

      this.el.style.webkitTransitionDuration = '0';

      clearTimeout(this._momentumStepTimeout)
    },


    _initDrag: function() {
      this._onScrollEnd();
      this._isStopped = false;
    },


    /**
     * Initialize a drag by grabbing the content area to drag, and any other
     * info we might need for the dragging.
     */
    _startDrag: function(e) {
      var offsetX, content;

      this._initDrag();

      var scrollLeft = parseFloat(this.el.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;
      var scrollTop = parseFloat(this.el.style.webkitTransform.replace('translate3d(', '').split(',')[1]) || 0;

      var totalWidth = this.el.scrollWidth;
      var totalHeight = this.el.scrollHeight;
      var parentWidth = this.el.parentNode.offsetWidth;
      var parentHeight = this.el.parentNode.offsetHeight;

      this.x = scrollLeft;
      this.y = scrollTop;

      // Grab the refresher element if using Pull to Refresh
      if(this.hasPullToRefresh) {
        this._refresher = document.querySelector('.scroll-refresher');

        if(this._refresher) {
          this._refresherHeight = parseFloat(this._refresher.firstElementChild.offsetHeight) || 100;
          // We always start the refresher hidden
          if(this.y < 0) {
            this._isRefresherHidden = true;
            this._refresher.style.display = 'none';
          } else {
            this._isRefresherHidden = false;
            this._didTriggerRefresh = false;
            this._refresher.style.display = 'block';
          }

          this._isHoldingRefresh = false;

          if(this._refresher) {
            this._refresher.classList.remove('scroll-refreshing');
          }
        }
      }

      this._drag = {
        direction: 'v',
        pointX: e.gesture.touches[0].pageX,
        pointY: e.gesture.touches[0].pageY,
        startX: scrollLeft,
        startY: scrollTop,
        resist: 1,
        startTime: Date.now()
      };

      // If the viewport is too small and we aren't using pull to refresh,
      // don't rubber band the drag
      if(this.disableNonOverflowRubberBand === true && !this._refresher) {
        var maxX = Math.min(0, (-totalWidth + parentWidth));
        var maxY = Math.min(0, (-totalHeight + parentHeight));

        // Check if we even have enough content to scroll, if not, don't start the drag
        if((this.isHorizontalEnabled && maxX == 0) || (this.isVerticalEnabled && maxY == 0)) {
          this._drag.noRubberBand = true;
        }
      }
    },

    /**
     * Process the drag event to move the item to the left or right.
     *
     * This function needs to be as fast as possible to make sure scrolling
     * performance is high.
     */
    _handleDrag: function(e) {
      var _this = this;

      var content;

      // The drag stopped already, don't process this one
      if(_this._isStopped) {
        _this._initDrag();
        return;
      }

      // We really aren't dragging
      if(!_this._drag) {
        _this._startDrag(e);
        if(!_this._drag) { return; }
      }

      // Stop any default events during the drag
      e.preventDefault();

      var px = e.gesture.touches[0].pageX;
      var py = e.gesture.touches[0].pageY;

      var deltaX = px - _this._drag.pointX;
      var deltaY = py - _this._drag.pointY;

      _this._drag.pointX = px;
      _this._drag.pointY = py;

      // Check if we should start dragging. Check if we've dragged past the threshold.
      if(!_this.isDragging && 
          ((Math.abs(e.gesture.deltaY) > _this.dragThreshold) ||
          (Math.abs(e.gesture.deltaX) > _this.dragThreshold))) {
        _this.isDragging = true;
      }

      if(_this.isDragging) {
        var drag = _this._drag;

        // Request an animation frame to batch DOM reads/writes
        window.rAF(function() {
          // We are dragging, grab the current content height

          var totalWidth = _this.el.scrollWidth;
          var totalHeight = _this.el.scrollHeight;
          var parentWidth = _this.el.parentNode.offsetWidth;
          var parentHeight = _this.el.parentNode.offsetHeight;
          var maxX = Math.min(0, (-totalWidth + parentWidth));
          var maxY = Math.min(0, (-totalHeight + parentHeight));

          // Grab current timestamp to keep our speend, etc.
          // calculations in a window
          var timestamp = Date.now();

          // Calculate the new Y point for the container
          // TODO: Only enable certain axes
          var newX = _this.x + deltaX;
          var newY = _this.y + deltaY;

          if(drag.noRubberBand === true) {
            if(newY > 0) {
              newY = 0;
            } else if(newY < maxY) {
              newY = maxY;
            }
            if(newX > 0) {
              newX = 0;
            } else if(newX < maxX) {
              newX = maxX;
            }
          } else {
            // Check if the dragging is beyond the bottom or top
            if(newY > 0 || (-newY + parentHeight) > totalHeight) {
              newY = _this.y + deltaY / _this.rubberBandResistance;
            }
          }

          if(!_this.isHorizontalEnabled) {
            newX = 0;
          }
          if(!_this.isVerticalEnabled) {
            newY = 0;
          }

          if(_this._refresher && newY > 0) {
            // We are pulling to refresh, so update the refresher
            if(_this._isRefresherHidden) {
              // Show it only in a drag and if we haven't showed it yet
              _this._refresher.style.display = 'block';
              _this._isRefresherHidden = false;
            }

            if(newY > _this._refresherHeight && !_this._isHoldingRefresh) {
              _this._isHoldingRefresh = true;
              // Trigger refresh holding event here
            } else {
              // Trigger refresh open amount
              var ratio = Math.min(1, newY / _this._refresherHeight);
              _this.onRefreshOpening(ratio);
            }

            // Update the new translated Y point of the container
            _this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + newX + 'px,' + newY + 'px, 0)';
          } else {

            _this._isHoldingRefresh = false;

            // Hide the refresher
            if(_this.refresher && !_this._isRefresherHidden) {
              _this._refresher.style.display = 'none';
              _this._isRefresherHidden = true;
            }
            // Update the new translated Y point of the container
            _this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + newX + 'px,' + newY + 'px, 0)';
          }

          // Store the last points
          _this.x = newX;
          _this.y = newY;

          // Check if we need to reset the drag initial states if we've
          // been dragging for a bit
          if(timestamp - drag.startTime > 300) {
            drag.startTime = timestamp;
            drag.startX = _this.x;
            drag.startY = _this.y;
          }

          _this.didScroll && _this.didScroll({
            target: _this.el,
            scrollLeft: -newX,
            scrollTop: -newY
          });

          // Trigger a scroll event
          ionic.trigger(_this.scrollEventName, {
            target: _this.el,
            scrollLeft: -newX,
            scrollTop: -newY
          });
        });
      }
    },



    _handleEndDrag: function(e) {
      // We didn't have a drag, so just init and leave
      if(!this._drag) {
        this._initDrag();
        return;
      }

      // Set a flag in case we don't cleanup completely after the
      // drag animation so we can cleanup the next time a drag starts
      this._isStopped = true;

      // Animate to the finishing point
      this._animateToStop(e);

    },


    // Find the stopping point given the current velocity and acceleration rate, and
    // animate to that position
    _animateToStop: function(e) {
      var _this = this;
      window.rAF(function() {

        var drag = _this._drag;

        // Calculate the viewport height and the height of the content
        var totalWidth = _this.el.scrollWidth;
        var totalHeight = _this.el.scrollHeight;

        // The parent bounding box helps us figure max/min scroll amounts
        var parentWidth = _this.el.parentNode.offsetWidth;
        var parentHeight = _this.el.parentNode.offsetHeight;

        // Calculate how long we've been dragging for, with a max of 300ms
        var duration = Date.now() - _this._drag.startTime;
        var time = 0;
        var easing = '';


        if(_this._refresher && _this.y > 0) {
          // Pull to refresh

          if(Math.ceil(_this.y) >= _this._refresherHeight) {
            // REFRESH
            _this._refresher.classList.add('scroll-refreshing');
            //_this._refresher.style.height = firstChildHeight + 'px';
            _this._scrollTo(0, _this._refresherHeight, 100, _this.refreshEasing);
            if(!_this._didTriggerRefresh) {
              _this.onRefresh && _this.onRefresh();
              _this._didTriggerRefresh = true;
            }
          } else {
            _this._refresher.classList.add('scroll-refreshing');
            //_this._refresher.style.height = 0 + 'px';
            _this._scrollTo(0, 0, _this.refreshEasingTime, _this.refreshEasing);
          }
          return;
        }

        var newX = Math.round(_this.x);
        var newY = Math.round(_this.y);

        _this._scrollTo(newX, newY);

        // Check if we just snap back to bounds
        if(_this.wrapScrollPosition(_this.bounceTime)) {
          return;
        }

        // If the duration is within reasonable bounds, enable momentum scrolling so we
        // can "slide" to a finishing point
        if(duration < 300) {
          var momentumX = _this._getMomentum(_this.x, drag.startX, duration, parentWidth - totalWidth, parentWidth);
          var momentumY = _this._getMomentum(_this.y, drag.startY, duration, parentHeight - totalHeight, parentHeight);
          //var newX = momentumX.destination;
          newX = momentumX.destination;
          newY = momentumY.destination;

          // Calculate the longest required time for the momentum animation and
          // use that.
          time = Math.max(momentumX.duration, momentumY.duration);
        }
        
        // If we've moved, we will need to scroll
        if(newX != _this.x || newY != _this.y) {
          // If the end position is out of bounds, change the function we use for easing
          // to get a different animation for the rubber banding
          if ( newX > 0 || newX < (-totalWidth + parentWidth) || newY > 0 || newY < (-totalHeight + parentHeight)) {
            easing = EASING_FUNCTIONS.bounce;
          }

          _this._scrollTo(newX, newY, time, easing);
        } else {
          // We are done
          _this._doneScrolling();
        }
      });
    },

    /**
     * Trigger a done scrolling event.
     */
    _doneScrolling: function() {
      this.didStopScrolling && this.didStopScrolling({
        target: this.el,
        scrollLeft: this.x,
        scrollTop: this.y
      });
      ionic.trigger(this.scrollEndEventName, {
        target: this.el,
        scrollLeft: this.x,
        scrollTop: this.y
      });
    }
  }, {
    DECEL_RATE_NORMAL: 0.998,
    DECEL_RATE_FAST: 0.99,
    DECEL_RATE_SLOW: 0.996,
  });

})(ionic);
;
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
;
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

    /**
     * Align the title text given the buttons in the header
     * so that the header text size is maximized and aligned
     * correctly as long as possible.
     */
    align: function() {
      var _this = this;

      window.rAF(ionic.proxy(function() {
        var i, c, childSize, childStyle;
        var children = this.el.children;
        var childNodes = this.el.childNodes;
        var styles = window.getComputedStyle(this.el, null);

        // Get the padding of the header for calculations
        var paddingLeft = parseFloat(styles['paddingLeft']);
        var paddingRight = parseFloat(styles['paddingRight']);

        // Get the full width of the header
        var headerWidth = this.el.offsetWidth;

        // Find the title element
        var title = this.el.querySelector('.title');
        if(!title) {
          return;
        }
      
        var leftWidth = 0;
        var rightWidth = 0;
        var titlePos = Array.prototype.indexOf.call(this.el.childNodes, title);

        // Compute how wide the left children are
        for(i = 0; i < titlePos; i++) {
          childSize = null;
          c = childNodes[i];
          if(c.nodeType == 3) {
            childSize = ionic.DomUtil.getTextBounds(c);
          } else if(c.nodeType == 1) {
            childSize = c.getBoundingClientRect();
          }
          if(childSize) {
            leftWidth += childSize.width;
          }
        }

        // Compute how wide the right children are
        for(i = titlePos + 1; i < childNodes.length; i++) {
          childSize = null;
          c = childNodes[i];
          if(c.nodeType == 3) {
            childSize = ionic.DomUtil.getTextBounds(c);
          } else if(c.nodeType == 1) {
            childSize = c.getBoundingClientRect();
          }
          if(childSize) {
            rightWidth += childSize.width;
          }
        }

        var margin = Math.max(leftWidth, rightWidth) + 10;

        // Size and align the header title based on the sizes of the left and
        // right children, and the desired alignment mode
        if(this.alignTitle == 'center') {
          title.style.left = margin + 'px';
          title.style.right = margin + 'px';

          if(title.offsetWidth < title.scrollWidth) {
            title.style.textAlign = 'left';
            title.style.right = (rightWidth + 5) + 'px';
          } else {
            title.style.textAlign = 'center';
          }
        } else if(this.alignTitle == 'left') {
          title.style.textAlign = 'left';
          title.style.left = (leftWidth + 15) + 'px';
        } else if(this.alignTitle == 'right') {
          title.style.textAlign = 'right';
          title.style.right = (rightWidth + 15) + 'px';
        }
      }, this));
    }
  });

})(ionic);
;
(function(ionic) {
'use strict';

  var ITEM_CLASS = 'item';
  var ITEM_CONTENT_CLASS = 'item-content';
  var ITEM_SLIDING_CLASS = 'item-sliding';
  var ITEM_OPTIONS_CLASS = 'item-options';
  var ITEM_PLACEHOLDER_CLASS = 'item-placeholder';
  var ITEM_REORDERING_CLASS = 'item-reordering';
  var ITEM_DRAG_CLASS = 'item-drag';

  var DragOp = function() {};
  DragOp.prototype = {
    start: function(e) {
    },
    drag: function(e) {
    },
    end: function(e) {
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
    }

    // If we don't have a content area as one of our children (or ourselves), skip
    if(!content) {
      return;
    }

    // Make sure we aren't animating as we slide
    content.classList.remove(ITEM_SLIDING_CLASS);

    // Grab the starting X point for the item (for example, so we can tell whether it is open or closed to start)
    offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;

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

  SlideDrag.prototype.drag = function(e) {
    var _this = this, buttonsWidth;

    window.rAF(function() {
      // We really aren't dragging
      if(!_this._currentDrag) {
        return;
      }

      // Check if we should start dragging. Check if we've dragged past the threshold,
      // or we are starting from the open state.
      if(!_this._isDragging &&
          ((Math.abs(e.gesture.deltaX) > _this.dragThresholdX) ||
          (Math.abs(_this._currentDrag.startOffsetX) > 0)))
      {
        _this._isDragging = true;
      }

      if(_this._isDragging) {
        buttonsWidth = _this._currentDrag.buttonsWidth;

        // Grab the new X point, capping it at zero
        var newX = Math.min(0, _this._currentDrag.startOffsetX + e.gesture.deltaX);

        // If the new X position is past the buttons, we need to slow down the drag (rubber band style)
        if(newX < -buttonsWidth) {
          // Calculate the new X position, capped at the top of the buttons
          newX = Math.min(-buttonsWidth, -buttonsWidth + (((e.gesture.deltaX + buttonsWidth) * 0.4)));
        }

        _this._currentDrag.content.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
      }
    });
  };

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

    var content = this._currentDrag.content;

    var onRestingAnimationEnd = function(e) {
      if(e.propertyName == '-webkit-transform') {
        content.classList.remove(ITEM_SLIDING_CLASS);
      }
      e.target.removeEventListener('webkitTransitionEnd', onRestingAnimationEnd);
    };

    window.rAF(function() {
      var currentX = parseFloat(_this._currentDrag.content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;
      if(currentX !== restingPoint) {
        _this._currentDrag.content.classList.add(ITEM_SLIDING_CLASS);
        _this._currentDrag.content.addEventListener('webkitTransitionEnd', onRestingAnimationEnd);
      }
      _this._currentDrag.content.style.webkitTransform = 'translate3d(' + restingPoint + 'px, 0, 0)';

      // Kill the current drag
      _this._currentDrag = null;


      // We are done, notify caller
      doneCallback && doneCallback();
    });
  };

  var ReorderDrag = function(opts) {
    this.dragThresholdY = opts.dragThresholdY || 0;
    this.onReorder = opts.onReorder;
    this.el = opts.el;
  };

  ReorderDrag.prototype = new DragOp();

  ReorderDrag.prototype.start = function(e) {
    var content;


    // Grab the starting Y point for the item
    var offsetY = this.el.offsetTop;//parseFloat(this.el.style.webkitTransform.replace('translate3d(', '').split(',')[1]) || 0;

    var startIndex = ionic.DomUtil.getChildIndex(this.el, this.el.nodeName.toLowerCase());

    var placeholder = this.el.cloneNode(true);

    placeholder.classList.add(ITEM_PLACEHOLDER_CLASS);

    this.el.parentNode.insertBefore(placeholder, this.el);

    this.el.classList.add(ITEM_REORDERING_CLASS);

    this._currentDrag = {
      startOffsetTop: offsetY,
      startIndex: startIndex,
      placeholder: placeholder
    };
  };

  ReorderDrag.prototype.drag = function(e) {
    var _this = this;

    window.rAF(function() {
      // We really aren't dragging
      if(!_this._currentDrag) {
        return;
      }

      // Check if we should start dragging. Check if we've dragged past the threshold,
      // or we are starting from the open state.
      if(!_this._isDragging && Math.abs(e.gesture.deltaY) > _this.dragThresholdY) {
        _this._isDragging = true;
      }

      if(_this._isDragging) {
        var newY = _this._currentDrag.startOffsetTop + e.gesture.deltaY;
        
        _this.el.style.top = newY + 'px';

        _this._currentDrag.currentY = newY;

        _this._reorderItems();
      }
    });
  };

  // When an item is dragged, we need to reorder any items for sorting purposes
  ReorderDrag.prototype._reorderItems = function() {
    var placeholder = this._currentDrag.placeholder;
    var siblings = Array.prototype.slice.call(this._currentDrag.placeholder.parentNode.children);
    
    // Remove the floating element from the child search list
    siblings.splice(siblings.indexOf(this.el), 1);

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

    // Reposition the element
    this.el.classList.remove(ITEM_REORDERING_CLASS);
    this.el.style.top = 0;

    var finalPosition = ionic.DomUtil.getChildIndex(placeholder, placeholder.nodeName.toLowerCase());
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
  ionic.views.ListView = ionic.views.Scroll.inherit({
    initialize: function(opts) {
      var _this = this;

      opts = ionic.extend({
        onReorder: function(el, oldIndex, newIndex) {},
        virtualRemoveThreshold: -200,
        virtualAddThreshold: 200
      }, opts);

      ionic.extend(this, opts);

      if(!this.itemHeight && this.listEl) {
        this.itemHeight = this.listEl.children[0] && parseInt(this.listEl.children[0].style.height);
      }

      ionic.views.ListView.__super__.initialize.call(this, opts);

      this.onRefresh = opts.onRefresh || function() {};
      this.onRefreshOpening = opts.onRefreshOpening || function() {};
      this.onRefreshHolding = opts.onRefreshHolding || function() {};

      window.ionic.onGesture('touch', function(e) {
        _this._handleTouch(e);
      }, this.el);

      window.ionic.onGesture('release', function(e) {
        _this._handleTouchRelease(e);
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
        var first = parseInt(Math.abs(highWater / itemHeight));
        var last = parseInt(Math.abs(lowWater / itemHeight));

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

    _initDrag: function() {
      ionic.views.ListView.__super__._initDrag.call(this);

      //this._isDragging = false;
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

      this._isDragging = false;

      // Check if this is a reorder drag
      if(ionic.DomUtil.getParentOrSelfWithClass(e.target, ITEM_DRAG_CLASS) && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
        var item = this._getItem(e.target);

        if(item) {
          this._dragOp = new ReorderDrag({
            el: item,
            onReorder: function(el, start, end) {
              _this.onReorder && _this.onReorder(el, start, end);
            }
          });
          this._dragOp.start(e);
          e.preventDefault();
          return;
        }
      }

      // Or check if this is a swipe to the side drag
      else if((e.gesture.direction == 'left' || e.gesture.direction == 'right') && Math.abs(e.gesture.deltaX) > 5) {
        this._dragOp = new SlideDrag({ el: this.el });
        this._dragOp.start(e);
        e.preventDefault();
        return;
      }

      // We aren't handling it, so pass it up the chain
      ionic.views.ListView.__super__._startDrag.call(this, e);
    },


    _handleEndDrag: function(e) {
      var _this = this;
      
      if(!this._dragOp) {
        ionic.views.ListView.__super__._handleEndDrag.call(this, e);
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
          
      // If the user has a touch timeout to highlight an element, clear it if we
      // get sufficient draggage
      if(Math.abs(e.gesture.deltaX) > 10 || Math.abs(e.gesture.deltaY) > 10) {
        clearTimeout(this._touchTimeout);
      }

      clearTimeout(this._touchTimeout);
      // If we get a drag event, make sure we aren't in another drag, then check if we should
      // start one
      if(!this.isDragging && !this._dragOp) {
        this._startDrag(e);
      }

      // No drag still, pass it up
      if(!this._dragOp) { 
        ionic.views.ListView.__super__._handleDrag.call(this, e);
        return;
      }

      e.preventDefault();
      this._dragOp.drag(e);
    },

    /**
     * Handle the touch event to show the active state on an item if necessary.
     */
    _handleTouch: function(e) {
      var _this = this;

      var item = ionic.DomUtil.getParentOrSelfWithClass(e.target, ITEM_CLASS);
      if(!item) { return; }

      this._touchTimeout = setTimeout(function() {
        var items = _this.el.querySelectorAll('.item');
        for(var i = 0, l = items.length; i < l; i++) {
          items[i].classList.remove('active');
        }
        item.classList.add('active');
      }, 250);
    },

    /**
     * Handle the release event to remove the active state on an item if necessary.
     */
    _handleTouchRelease: function(e) {
      var _this = this;

      // Cancel touch timeout
      clearTimeout(this._touchTimeout);
      var items = _this.el.querySelectorAll('.item');
      for(var i = 0, l = items.length; i < l; i++) {
        items[i].classList.remove('active');
      }
    }
  });

})(ionic);
;
(function(ionic) {
'use strict';
  /**
   * An ActionSheet is the slide up menu popularized on iOS.
   *
   * You see it all over iOS apps, where it offers a set of options 
   * triggered after an action.
   */
  ionic.views.Loading = ionic.views.View.inherit({
    initialize: function(opts) {
      var _this = this;

      this.el = opts.el;

      this.maxWidth = opts.maxWidth || 200;

      this._loadingBox = this.el.querySelector('.loading');
    },
    show: function() {
      var _this = this;

      if(this._loadingBox) {
        var lb = _this._loadingBox;

        var width = Math.min(_this.maxWidth, Math.max(window.outerWidth - 40, lb.offsetWidth));

        lb.style.width = width;

        lb.style.marginLeft = (-lb.offsetWidth) / 2 + 'px';
        lb.style.marginTop = (-lb.offsetHeight) / 2 + 'px';

        _this.el.classList.add('active');
      }
    },
    hide: function() {
      // Force a reflow so the animation will actually run
      this.el.offsetWidth;

      this.el.classList.remove('active');
    }
  });

})(ionic);
;
(function(ionic) {
'use strict';

  ionic.views.Modal = ionic.views.View.inherit({
    initialize: function(opts) {
      opts = ionic.extend({
        focusFirstInput: true,
        unfocusOnHide: true
      }, opts);

      ionic.extend(this, opts);

      this.el = opts.el;
    },
    show: function() {
      this.el.classList.add('active');

      if(this.focusFirstInput) {
        var input = this.el.querySelector('input, textarea');
        input && input.focus && input.focus();
      }
    },
    hide: function() {
      this.el.classList.remove('active');

      // Unfocus all elements
      if(this.unfocusOnHide) {
        var inputs = this.el.querySelectorAll('input, textarea');
        for(var i = 0; i < inputs.length; i++) {
          inputs[i].blur && inputs[i].blur();
        }
      }
    }
  });

})(ionic);
;
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
;
(function(ionic) {
'use strict';
  /**
   * An ActionSheet is the slide up menu popularized on iOS.
   *
   * You see it all over iOS apps, where it offers a set of options 
   * triggered after an action.
   */
  ionic.views.Popup = ionic.views.View.inherit({
    initialize: function(opts) {
      var _this = this;

      this.el = opts.el;
    },

    setTitle: function(title) {
      var titleEl = el.querySelector('.popup-title');
      if(titleEl) {
        titleEl.innerHTML = title;
      }
    },
    alert: function(message) {
      var _this = this;

      window.rAF(function() {
        _this.setTitle(message);
        _this.el.classList.add('active');
      });
    },
    hide: function() {
      // Force a reflow so the animation will actually run
      this.el.offsetWidth;

      this.el.classList.remove('active');
    }
  });

})(ionic);
;
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
      this.width = opts.width;
      this.isEnabled = opts.isEnabled || true;
    },

    getFullWidth: function() {
      return this.width;
    },
    setIsEnabled: function(isEnabled) {
      this.isEnabled = isEnabled;
    },
    bringUp: function() {
      this.el.style.zIndex = 0;
    },
    pushDown: function() {
      this.el.style.zIndex = -1;
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
      return parseFloat(this.el.style.webkitTransform.replace('translate3d(', '').split(',')[0]);
    },
    setTranslateX: function(x) {
      this.el.style.webkitTransform = 'translate3d(' + x + 'px, 0, 0)';
    }
  });

})(ionic);
;
/**
 * The SlideBox is a swipeable, slidable, slideshowable box. Think of any image gallery
 * or iOS "dot" pager gallery, or maybe a carousel.
 *
 * Each screen fills the full width and height of the viewport, and screens can
 * be swiped between, or set to automatically transition.
 */
(function(ionic) {
'use strict';

  ionic.views.SlideBox = ionic.views.View.inherit({
    initialize: function(opts) {
      var _this = this;

      this.slideChanged = opts.slideChanged || function() {};
      this.el = opts.el;
      this.pager = this.el.querySelector('.slide-box-pager');

      // The drag threshold is the pixel delta that will trigger a drag (to 
      // avoid accidental dragging)
      this.dragThresholdX = opts.dragThresholdX || 10;
      // The velocity threshold is a velocity of drag that indicates a "swipe". This
      // number is taken from hammer.js's calculations
      this.velocityXThreshold = opts.velocityXThreshold || 0.3;

      // Initialize the slide index to the first page and update the pager
      this.slideIndex = 0;
      this._updatePager();

      // Listen for drag and release events
      window.ionic.onGesture('drag', function(e) {
        _this._handleDrag(e);
        e.gesture.srcEvent.preventDefault();
      }, this.el);
      window.ionic.onGesture('release', function(e) {
        _this._handleEndDrag(e);
      }, this.el);
    },

    /**
     * Tell the pager to update itself if content is added or
     * removed. 
     */
    update: function() {
      this._updatePager();
    },

    prependSlide: function(el) {
      var content = this.el.firstElementChild;
      if(!content) { return; }

      var slideWidth = content.offsetWidth;
      var offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;
      var newOffsetX = Math.min(0, offsetX - slideWidth);
          
      content.insertBefore(el, content.firstChild);

      content.classList.remove('slide-box-animating');
      content.style.webkitTransform = 'translate3d(' + newOffsetX + 'px, 0, 0)';

      this._prependPagerIcon();
      this.slideIndex = (this.slideIndex + 1) % content.children.length;
      this._updatePager();
    },

    appendSlide: function(el) {
      var content = this.el.firstElementChild;
      if(!content) { return; }

      content.classList.remove('slide-box-animating');
      content.appendChild(el);

      this._appendPagerIcon();
      this._updatePager();
    },

    removeSlide: function(index) {
      var content = this.el.firstElementChild;
      if(!content) { return; }

      var items = this.el.firstElementChild;
      items.removeChild(items.firstElementChild);

      var slideWidth = content.offsetWidth;
      var offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;
      var newOffsetX = Math.min(0, offsetX + slideWidth);
          
      content.classList.remove('slide-box-animating');
      content.style.webkitTransform = 'translate3d(' + newOffsetX + 'px, 0, 0)';

      this._removePagerIcon();
      this.slideIndex = Math.max(0, (this.slideIndex - 1) % content.children.length);
      this._updatePager();
    },

    /**
     * Slide to the given slide index.
     *
     * @param {int} the index of the slide to animate to.
     */
    slideToSlide: function(index) {
      var content = this.el.firstElementChild;
      if(!content) {
        return;
      }

      // Get the width of one slide
      var slideWidth = content.offsetWidth;

      // Calculate the new offsetX position which is just
      // N slides to the left, where N is the given index
      var offsetX = index * slideWidth;

      // Calculate the max X position we'd allow based on how many slides
      // there are.
      var maxX = Math.max(0, content.children.length - 1) * slideWidth;

      // Bounds the offset X position in the range maxX >= offsetX >= 0
      offsetX = offsetX < 0 ? 0 : offsetX > maxX ? maxX : offsetX;

      // Animate and slide the slides over
      content.classList.add('slide-box-animating');
      content.style.webkitTransform = 'translate3d(' + -offsetX + 'px, 0, 0)';

      var lastSlide = this.slideIndex;

      // Update the slide index
      this.slideIndex = Math.ceil(offsetX / slideWidth);

      if(lastSlide !== this.slideIndex) {
        this.slideChanged && this.slideChanged(this.slideIndex);
      }

      this._updatePager();
    },

    /**
     * Get the currently set slide index. This method
     * is updated before any transitions run, so the
     * value could be early.
     *
     * @return {int} the current slide index
     */
    getSlideIndex: function() {
      return this.slideIndex;
    },

    _appendPagerIcon: function() {
      if(!this.pager || !this.pager.children.length) { return; }

      var newPagerChild = this.pager.children[0].cloneNode();
      this.pager.appendChild(newPagerChild);
    },

    _prependPagerIcon: function() {
      if(!this.pager || !this.pager.children.length) { return; }

      var newPagerChild = this.pager.children[0].cloneNode();
      this.pager.insertBefore(newPagerChild, this.pager.firstChild);
    },

    _removePagerIcon: function() {
      if(!this.pager || !this.pager.children.length) { return; }

      this.pager.removeChild(this.pager.firstElementChild);
    },

    /**
     * If we have a pager, update the active page when the current slide
     * changes.
     */
    _updatePager: function() {
      if(!this.pager) {
        return;
      }

      var numPagerChildren = this.pager.children.length;
      if(!numPagerChildren) {
        // No children to update
        return;
      }

      // Update the active state of the pager icons
      for(var i = 0, j = this.pager.children.length; i < j; i++) {
        if(i == this.slideIndex) {
          this.pager.children[i].classList.add('active');
        } else {
          this.pager.children[i].classList.remove('active');
        }
      }
    },

    _initDrag: function() {
      this._isDragging = false;
      this._drag = null;
    },

    _handleEndDrag: function(e) {
      var _this = this,
          finalOffsetX, content, ratio, slideWidth, totalWidth, offsetX;

      window.rAF(function() {
      
        // We didn't have a drag, so just init and leave
        if(!_this._drag) {
          _this._initDrag();
          return;
        }

        // We did have a drag, so we need to snap to the correct spot

        // Grab the content layer
        content = _this._drag.content;

        // Enable transition duration
        content.classList.add('slide-box-animating');

        // Grab the current offset X position
        offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;

        // Calculate how wide a single slide is, and their total width
        slideWidth = content.offsetWidth;
        totalWidth = content.offsetWidth * content.children.length;

        // Calculate how far in this slide we've dragged
        ratio = (offsetX % slideWidth) / slideWidth;

        if(ratio >= 0) {
          // Anything greater than zero is too far left, this is an extreme case
          // TODO: Do we need this anymore?
          finalOffsetX = 0;
        } else if(ratio >= -0.5) {
          // We are less than half-way through a drag
          // Sliiide to the left
          finalOffsetX = Math.max(0, Math.floor(Math.abs(offsetX) / slideWidth) * slideWidth);
        } else {
          // We are more than half-way through a drag
          // Sliiide to the right
          finalOffsetX = Math.min(totalWidth - slideWidth, Math.ceil(Math.abs(offsetX) / slideWidth) * slideWidth);
        }


        if(e.gesture.velocityX > _this.velocityXThreshold) {
          if(e.gesture.direction == 'left') {
            _this.slideToSlide(_this.slideIndex + 1);
          } else if(e.gesture.direction == 'right') {
            _this.slideToSlide(_this.slideIndex - 1);
          }
        } else {
          // Calculate the new slide index (or "page")
          _this.slideIndex = Math.ceil(finalOffsetX / slideWidth);

          // Negative offsetX to slide correctly
          content.style.webkitTransform = 'translate3d(' + -finalOffsetX + 'px, 0, 0)';
        }

        _this._initDrag();
      });
    },

    /**
     * Initialize a drag by grabbing the content area to drag, and any other
     * info we might need for the dragging.
     */
    _startDrag: function(e) {
      var offsetX, content;

      this._initDrag();

      // Make sure to grab the element we will slide as our target
      content = ionic.DomUtil.getParentOrSelfWithClass(e.target, 'slide-box-slides');
      if(!content) {
        return;
      }

      // Disable transitions during drag
      content.classList.remove('slide-box-animating');

      // Grab the starting X point for the item (for example, so we can tell whether it is open or closed to start)
      offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;

      this._drag = {
        content: content,
        startOffsetX: offsetX,
        resist: 1
      };
    },

    /**
     * Process the drag event to move the item to the left or right.
     */
    _handleDrag: function(e) {
      var _this = this;

      window.rAF(function() {
        var content;

        // We really aren't dragging
        if(!_this._drag) {
          _this._startDrag(e);
        }

        // Sanity
        if(!_this._drag) { return; }

        // Stop any default events during the drag
        e.preventDefault();

        // Check if we should start dragging. Check if we've dragged past the threshold.
        if(!_this._isDragging && (Math.abs(e.gesture.deltaX) > _this.dragThresholdX)) {
          _this._isDragging = true;
        }

        if(_this._isDragging) {
          content = _this._drag.content;

          var newX = _this._drag.startOffsetX + (e.gesture.deltaX / _this._drag.resist);

          var rightMostX = -(content.offsetWidth * Math.max(0, content.children.length - 1));

          if(newX > 0) {
            // We are dragging past the leftmost pane, rubber band
            _this._drag.resist = (newX / content.offsetWidth) + 1.4;
          } else if(newX < rightMostX) {
            // Dragging past the rightmost pane, rubber band
            //newX = Math.min(rightMostX, + (((e.gesture.deltaX + buttonsWidth) * 0.4)));
            _this._drag.resist = (Math.abs(newX) / content.offsetWidth) - 0.6;
          }

          _this._drag.content.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
        }
      });
    }
  });

})(window.ionic);
;
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
        break;
      }

    }

    // Set the title to the text content of the tab.
    this.title = this.el.textContent.trim();

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
;
(function(ionic) {
'use strict';

  ionic.views.Toggle = ionic.views.View.inherit({
    initialize: function(opts) {
      this.el = opts.el;
      this.checkbox = opts.checkbox;
      this.handle = opts.handle;
      this.openPercent = -1;
    },

    tap: function(e) {
      this.val( !this.checkbox.checked );
    },

    drag: function(e) {
      var slidePageLeft = this.checkbox.offsetLeft + (this.handle.offsetWidth / 2);
      var slidePageRight = this.checkbox.offsetLeft + this.checkbox.offsetWidth - (this.handle.offsetWidth / 2);

      if(e.pageX >= slidePageRight - 4) {
        this.val(true);
      } else if(e.pageX <= slidePageLeft) {
        this.val(false);
      } else {
        this.setOpenPercent( Math.round( (1 - ((slidePageRight - e.pageX) / (slidePageRight - slidePageLeft) )) * 100) );
      }
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
          var openPixel = Math.round( (openPercent / 100) * this.checkbox.offsetWidth - (this.handle.offsetWidth) );
          openPixel = (openPixel < 1 ? 0 : openPixel);
          this.handle.style.webkitTransform = 'translate3d(' + openPixel + 'px,0,0)';
        }
      }
    },

    release: function(e) {
      this.val( this.openPercent >= 50 );
    },

    val: function(value) {
      if(value === true || value === false) {
        if(this.handle.style.webkitTransform !== "") {
          this.handle.style.webkitTransform = "";
        }
        this.checkbox.checked = value;
        this.openPercent = (value ? 100 : 0);
      }
      return this.checkbox.checked;
    }

  });

})(ionic);
;
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
;
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
;
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

    /**
     * Toggle the left menu to open 100%
     */
    toggleLeft: function() {
      var openAmount = this.getOpenAmount();
      if(openAmount > 0) {
        this.openPercentage(0);
      } else {
        this.openPercentage(100);
      }
    },

    /**
     * Toggle the right menu to open 100%
     */
    toggleRight: function() {
      var openAmount = this.getOpenAmount();
      if(openAmount < 0) {
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
      return this.content.getTranslateX() || 0;
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
      if((!(this.left && this.left.isEnabled) && amount > 0) || (!(this.right && this.right.isEnabled) && amount < 0)) {
        return;
      }

      if((this._leftShowing && amount > maxLeft) || (this._rightShowing && amount < -maxRight)) {
        return;
      }
      
      this.content.setTranslateX(amount);

      if(amount >= 0) {
        this._leftShowing = true;
        this._rightShowing = false;

        // Push the z-index of the right menu down
        this.right && this.right.pushDown && this.right.pushDown();
        // Bring the z-index of the left menu up
        this.left && this.left.bringUp && this.left.bringUp();
      } else {
        this._rightShowing = true;
        this._leftShowing = false;

        // Bring the z-index of the right menu up
        this.right && this.right.bringUp();
        // Push the z-index of the left menu down
        this.left && this.left.pushDown();
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

      if(ratio === 0)
        return;

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
      this.snapToRest(e);
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
;
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
      icon: controller.icon
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
