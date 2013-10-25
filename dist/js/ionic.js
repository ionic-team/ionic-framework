/*
Copyright 2013 Drifty Co.
http://drifty.com/

Ionic - an amazing HTML5 mobile app framework.
http://ionicframework.com/

By @maxlynch, @helloimben, @adamdbradley <3

Licensed under the MIT license. Please see LICENSE for more information.
*/
;

// Create namespaces 
window.ionic = {
  controllers: {},
  views: {}
};
;

(function(ionic) {
  ionic.Animator = {
    animate: function(element, className, fn) {
      return {
        leave: function() {
          var endFunc = function() {
            console.log('Animation finished for element', element);

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
            console.log('Animation finished for element', element);

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
    getChildIndex: function(element) {
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

    // // With a click event, we need to check the target
    // // and if it's an internal target that doesn't want
    // // a click, cancel it
    // handleClick: function(e) {
    //   var target = e.target;

    //   if(ionic.Gestures.HAS_TOUCHEVENTS) {
    //     // We don't allow any clicks on mobile
    //     e.preventDefault();
    //     return false;
    //   }

    //   if (
    //     !  target
    //     || e.which > 1
    //     || e.metaKey
    //     || e.ctrlKey
    //     //|| isScrolling
    //     // || location.protocol !== target.protocol
    //     // || location.host     !== target.host
    //     // // Not sure abotu this one
    //     // //|| !target.hash && /#/.test(target.href)
    //     // || target.hash && target.href.replace(target.hash, '') === location.href.replace(location.hash, '')
    //     //|| target.getAttribute('data-ignore') == 'push'
    //   ) {
    //     // Allow it
    //     return;
    //   }
    //   // We need to cancel this one
    //   e.preventDefault();

    // },
    
    handlePopState: function(event) {
      console.log("EVENT: popstate", event);
    },
  };
  
  
  // Map some convenient top-level functions for event handling
  ionic.on = function() { ionic.EventController.on.apply(ionic.EventController, arguments); };
  ionic.off = function() { ionic.EventController.off.apply(ionic.EventController, arguments); };
  ionic.trigger = function() { ionic.EventController.trigger.apply(ionic.EventController.trigger, arguments); };
  ionic.onGesture = function() { ionic.EventController.onGesture.apply(ionic.EventController.onGesture, arguments); };
  ionic.offGesture = function() { ionic.EventController.offGesture.apply(ionic.EventController.offGesture, arguments); };

  // DISABLING FOR NOW. THE TAP CODE AT THE EXT LEVEL SHOULD BE DOING THIS
  // Set up various listeners
  //window.addEventListener('click', ionic.EventController.handleClick);

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
                        this.srcEvent.preventDefault();
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

  // polyfill use to simulate native "tap"
  function inputTapPolyfill(ele, e) {
    if(ele.type === "radio" || ele.type === "checkbox") {
      ele.checked = !ele.checked;
    } else if(ele.type === "submit" || ele.type === "button") {
      ele.click();
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

    e = e.gesture.srcEvent; // evaluate the actual source event, not the created event by gestures.js

    var ele = e.target;

    while(ele) {
      if( ele.tagName === "INPUT" || ele.tagName === "TEXTAREA" || ele.tagName === "SELECT" ) {
        return inputTapPolyfill(ele, e);
      } else if( ele.tagName === "LABEL" ) {
        if(ele.control) {
          return inputTapPolyfill(ele.control, e);
        }
      } else if( ele.tagName === "A" || ele.tagName === "BUTTON" ) {
        ele.click();
        e.stopPropagation();
        e.preventDefault();
        return false;
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
  
  ionic.Utils = {
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
  };
})(window.ionic);
;
(function(ionic) {
'use strict';
  /**
   * An ActionSheet is the slide up menu popularized on iOS.
   *
   * You see it all over iOS apps, where it offers a set of options 
   * triggered after an action.
   */
  ionic.views.ActionSheet = function(opts) {
    this.el = opts.el;
  };

  ionic.views.ActionSheet.prototype = {
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
  };

})(ionic);
;
(function(ionic) {
'use strict';

  ionic.views.Checkbox = function(opts) {
    this.el = opts.el;
    this.checkbox = opts.checkbox;
    this.handle = opts.handle;
  };

  ionic.views.Checkbox.prototype = {

    tap: function(e) {
      this.val( !this.checkbox.checked );
    },

    val: function(value) {
      if(value === true || value === false) {
        this.checkbox.checked = value;
      }
      return this.checkbox.checked;
    }

  };

})(ionic);
;
(function(ionic) {
'use strict';

  ionic.views.HeaderBar = function(opts) {
    this.el = opts.el;

    this._titleEl = this.el.querySelector('.title');
  };

  ionic.views.HeaderBar.prototype = {
    resizeTitle: function() {
      var e, j, i,
      title,
      titleWidth,
      children = this.el.children;

      for(i = 0, j = children.length; i < j; i++) {
        e = children[i];
        if(/h\d/.test(e.nodeName.toLowerCase())) {
          title = e;
        }
      }

      titleWidth = title.offsetWidth;
    }
  };

})(ionic);
;
(function(ionic) {
'use strict';


  var DragOp = function() {};
  DragOp.prototype = {
    start: function(e) {
    },
    drag: function(e) {
    },
    end: function(e) {
    }
  };


  /**
   * The Pull To Refresh drag operation handles the well-known
   * "pull to refresh" concept seen on various apps. This lets
   * the user indicate they want to refresh a given list by dragging
   * down.
   *
   * @param {object} opts the options for the pull to refresh drag.
   */
  var PullToRefreshDrag = function(opts) {
    this.dragThresholdY = opts.dragThresholdY || 10;
    this.onRefreshOpening = opts.onRefreshOpening || function() {};
    this.onRefresh = opts.onRefresh || function() {};
    this.onRefreshHolding = opts.onRefreshHolding || function() {};
    this.el = opts.el;
  };

  PullToRefreshDrag.prototype = new DragOp();

  PullToRefreshDrag.prototype.start = function(e) {
    var content, refresher;

    content = ionic.DomUtil.getParentOrSelfWithClass(e.target, 'list');
    if(!content) { return; }

    // Grab the refresher element that will show as you drag down
    refresher = content.querySelector('.list-refresher');
    if(!refresher) {
      refresher = this._injectRefresher();
    }

    // Disable animations while dragging
    refresher.classList.remove('list-refreshing');

    this._currentDrag = {
      refresher: refresher,
      content: content,
      isHolding: false
    };
  };

  PullToRefreshDrag.prototype._injectRefresher = function() {
    var refresher = document.createElement('div');
    refresher.className = 'list-refresher';
    this.el.insertBefore(refresher, this.el.firstChild);
    return refresher;
  };

  PullToRefreshDrag.prototype.drag = function(e) {
    var _this = this;

    window.requestAnimationFrame(function() {
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
        var refresher = _this._currentDrag.refresher;

        var currentHeight = parseFloat(refresher.style.height);
        refresher.style.height = e.gesture.deltaY + 'px';

        var newHeight = parseFloat(refresher.style.height);
        var firstChildHeight = parseFloat(refresher.firstElementChild.offsetHeight);

        if(newHeight > firstChildHeight && !_this._currentDrag.isHolding) {
          // The user is holding the refresh but hasn't let go of it
          _this._currentDrag.isHolding = true;
          _this.onRefreshHolding && _this.onRefreshHolding();
        } else {
          // Indicate what ratio of opening the list refresh drag is
          var ratio = Math.min(1, newHeight / firstChildHeight);
          _this.onRefreshOpening && _this.onRefreshOpening(ratio);
        }
      }
    });
  };

  PullToRefreshDrag.prototype.end = function(e, doneCallback) {
    var _this = this;

    // There is no drag, just end immediately
    if(!this._currentDrag) {
      return;
    }

    var refresher = this._currentDrag.refresher;

    var currentHeight = parseFloat(refresher.style.height);
    refresher.style.height = e.gesture.deltaY + 'px';

    var firstChildHeight = parseFloat(refresher.firstElementChild.offsetHeight);

    if(currentHeight > firstChildHeight) {
      //this.refreshing();
      refresher.classList.add('list-refreshing');
      refresher.style.height = firstChildHeight + 'px';
      this.onRefresh && _this.onRefresh();
    } else {
      // Enable animations
      refresher.classList.add('list-refreshing');
      refresher.style.height = '0px';
      this.onRefresh && _this.onRefresh();
    }

    this._currentDrag = null;
    doneCallback && doneCallback();
  };


  var SlideDrag = function(opts) {
    this.dragThresholdX = opts.dragThresholdX || 10;
    this.el = opts.el;
  };

  SlideDrag.prototype = new DragOp();
  SlideDrag.prototype.start = function(e) {
    var content, buttons, offsetX, buttonsWidth;

    if(e.target.classList.contains('list-item-content')) {
      content = e.target;
    } else if(e.target.classList.contains('list-item')) {
      content = e.target.querySelector('.list-item-content');
    }

    // If we don't have a content area as one of our children (or ourselves), skip
    if(!content) {
      return;
    }

    // Make sure we aren't animating as we slide
    content.classList.remove('list-item-sliding');

    // Grab the starting X point for the item (for example, so we can tell whether it is open or closed to start)
    offsetX = parseFloat(content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;

    // Grab the buttons
    buttons = content.parentNode.querySelector('.list-item-buttons');
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

    window.requestAnimationFrame(function() {
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
        content.classList.remove('list-item-sliding');
      }
      e.target.removeEventListener('webkitTransitionEnd', onRestingAnimationEnd);
    };

    window.requestAnimationFrame(function() {
      var currentX = parseFloat(_this._currentDrag.content.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;
      if(currentX !== restingPoint) {
        _this._currentDrag.content.classList.add('list-item-sliding');
        _this._currentDrag.content.addEventListener('webkitTransitionEnd', onRestingAnimationEnd);
      }
      _this._currentDrag.content.style.webkitTransform = 'translate3d(' + restingPoint + 'px, 0, 0)';

      // Kill the current drag
      this._currentDrag = null;


      // We are done, notify caller
      doneCallback && doneCallback();
    });
  };

  var ReorderDrag = function(opts) {
    this.dragThresholdY = opts.dragThresholdY || 0;
    this.el = opts.el;
  };

  ReorderDrag.prototype = new DragOp();

  ReorderDrag.prototype.start = function(e) {
    var content;


    // Grab the starting Y point for the item
    var offsetY = this.el.offsetTop;//parseFloat(this.el.style.webkitTransform.replace('translate3d(', '').split(',')[1]) || 0;

    var placeholder = this.el.cloneNode(true);

    placeholder.classList.add('list-item-placeholder');

    this.el.parentNode.insertBefore(placeholder, this.el);

    this.el.classList.add('list-item-reordering');


    this._currentDrag = {
      startOffsetTop: offsetY,
      placeholder: placeholder
    };
  };

  ReorderDrag.prototype.drag = function(e) {
    var _this = this;

    window.requestAnimationFrame(function() {
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
    this.el.classList.remove('list-item-reordering');
    this.el.style.top = 0;

    var finalPosition = ionic.DomUtil.getChildIndex(placeholder);
    placeholder.parentNode.insertBefore(this.el, placeholder);
    placeholder.parentNode.removeChild(placeholder);

    this._currentDrag = null;
    doneCallback && doneCallback();
  };



  /**
   * The ListView handles a list of items. It will process drag animations, edit mode,
   * and other operations that are common on mobile lists or table views.
   */
  ionic.views.List = function(opts) {
    var _this = this;

    this.el = opts.el;

    // The amount of dragging required to start sliding the element over (in pixels)
    this.dragThresholdX = opts.dragThresholdX || 10;

    this.onRefresh = opts.onRefresh || function() {};
    this.onRefreshOpening = opts.onRefreshOpening || function() {};
    this.onRefreshHolding = opts.onRefreshHolding || function() {};
      
    // Start the drag states
    this._initDrag();

    // Listen for drag and release events
    window.ionic.onGesture('drag', function(e) {
      _this._handleDrag(e);
    }, this.el);
    window.ionic.onGesture('release', function(e) {
      _this._handleEndDrag(e);
    }, this.el);
  };

  ionic.views.List.prototype = {
    /**
     * Called to tell the list to stop refreshing. This is useful
     * if you are refreshing the list and are done with refreshing.
     */
    stopRefreshing: function() {
      var refresher = this.el.querySelector('.list-refresher');
      refresher.style.height = '0px';
    },

    _initDrag: function() {
      this._isDragging = false;
      this._dragOp = null;
    },

    // Return the list item from the given target
    _getItem: function(target) {
      while(target) {
        if(target.classList.contains('list-item')) {
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
      if(ionic.DomUtil.getParentOrSelfWithClass(e.target, 'list-item-drag') && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
        var item = this._getItem(e.target);

        if(item) {
          this._dragOp = new ReorderDrag({ el: item });
          this._dragOp.start(e);
        }
      }
      
      // Check if this is a "pull down" drag for pull to refresh
      else if(e.gesture.direction == 'down') {
        this._dragOp = new PullToRefreshDrag({
          el: this.el,
          onRefresh: function() {
            _this.onRefresh && _this.onRefresh();
          },
          onRefreshHolding: function() {
            _this.onRefreshHolding && _this.onRefreshHolding();
          },
          onRefreshOpening: function(ratio) {
            _this.onRefreshOpening && _this.onRefreshOpening(ratio);
          }
        });
        this._dragOp.start(e);
      } 

      // Or check if this is a swipe to the side drag
      else if(e.gesture.direction == 'left' || e.gesture.direction == 'right') {
        this._dragOp = new SlideDrag({ el: this.el });
        this._dragOp.start(e);
      }
    },


    _handleEndDrag: function(e) {
      var _this = this;
      
      if(!this._dragOp) {
        this._initDrag();
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

      if(!this._dragOp) {
        this._startDrag(e);
        if(!this._dragOp) { return; }
      }

      this._dragOp.drag(e);
    }
  };

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
  ionic.views.Loading = function(opts) {
    var _this = this;

    this.el = opts.el;

    this.maxWidth = opts.maxWidth || 200;

    this._loadingBox = this.el.querySelector('.loading');
  };

  ionic.views.Loading.prototype = {
    show: function() {
      var _this = this;

      if(this._loadingBox) {
        //window.requestAnimationFrame(function() {
          var lb = _this._loadingBox;

          var width = Math.min(_this.maxWidth, Math.max(window.outerWidth - 40, lb.offsetWidth));

          lb.style.width = width;

          lb.style.marginLeft = (-lb.offsetWidth) / 2 + 'px';
          lb.style.marginTop = (-lb.offsetHeight) / 2 + 'px';

          _this.el.classList.add('active');
        //});
      }
    },
    hide: function() {
      // Force a reflow so the animation will actually run
      this.el.offsetWidth;

      this.el.classList.remove('active');
    }
  };

})(ionic);
;
(function(ionic) {
'use strict';
  ionic.views.Modal = function(opts) {
    this.el = opts.el;
  };

  ionic.views.Modal.prototype = {
    show: function() {
      this.el.classList.add('active');
    },
    hide: function() {
      this.el.classList.remove('active');
    }
  };

})(ionic);
;
(function(ionic) {
'use strict';

  ionic.views.NavBar = function(opts) {
    this.el = opts.el;

    this._titleEl = this.el.querySelector('.title');

    if(opts.hidden) {
      this.hide();
    }
  };

  ionic.views.NavBar.prototype = {
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
  };

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
  ionic.views.Popup = function(opts) {
    var _this = this;

    this.el = opts.el;
  };

  ionic.views.Popup.prototype = {
    setTitle: function(title) {
      var titleEl = el.querySelector('.popup-title');
      if(titleEl) {
        titleEl.innerHTML = title;
      }
    },
    alert: function(message) {
      var _this = this;

      window.requestAnimationFrame(function() {
        _this.setTitle(message);
        _this.el.classList.add('active');
      });
    },
    hide: function() {
      // Force a reflow so the animation will actually run
      this.el.offsetWidth;

      this.el.classList.remove('active');
    }
  };

})(ionic);
;
(function(ionic) {
'use strict';
  var EASING_FUNCTIONS = {
    quadratic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
		circular: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
    circular2: 'cubic-bezier(0.075, 0.82, 0.165, 1)',

    // It closes like a high-end toilet seat. Fast, then nice and slow.
    // Thanks to our @xtheglobe for that.
    toiletSeat: 'cubic-bezier(0.05, 0.60, 0.05, 0.60)'
  };

  ionic.views.ScrollView = function(opts) {
    var _this = this;

    // Extend the options with our defaults
    opts = ionic.Utils.extend({
      decelerationRate: ionic.views.ScrollView.prototype.DECEL_RATE_NORMAL,
      dragThreshold: 10,
      resistance: 2,
      scrollEventName: 'momentumScrolled',
      scrollEndEventName: 'momentumScrollEnd',
      intertialEventInterval: 50,
      mouseWheelSpeed: 20,
      invertWheel: false,
      isVerticalEnabled: true,
      isHorizontalEnabled: false,
      bounceEasing: EASING_FUNCTIONS.circular,
      bounceTime: 600 //how long to take when bouncing back in a rubber band
    }, opts);

    ionic.Utils.extend(this, opts);

    this.el = opts.el;

    this.y = 0;
    this.x = 0;

    // Listen for drag and release events
    ionic.onGesture('drag', function(e) {
      _this._handleDrag(e);
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
  };

  ionic.views.ScrollView.prototype = {
    DECEL_RATE_NORMAL: 0.998,
    DECEL_RATE_FAST: 0.99,
    DECEL_RATE_SLOW: 0.996,

    /**
     * Scroll to the given X and Y point, taking 
     * the given amount of time, with the given
     * easing function defined as a CSS3 timing function.
     *
     * @param {float} the x position to scroll to (CURRENTLY NOT SUPPORTED!)
     * @param {float} the y position to scroll to
     * @param {float} the time to take scrolling to the new position
     * @param {easing} the animation function to use for easing
     */
    scrollTo: function(x, y, time, easing) {
      var _this = this;

      easing = easing || 'cubic-bezier(0.1, 0.57, 0.1, 1)';

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

      el.style.webkitTransitionTimingFunction = easing;
      el.style.webkitTransitionDuration = time;
      el.style.webkitTransform = 'translate3d(' + x + 'px,' + y + 'px, 0)';

      // Start triggering events as the element scrolls from inertia.
      // This is important because we need to receive scroll events
      // even after a "flick" and adjust, etc.
      this._momentumStepTimeout = setTimeout(function eventNotify() {
        var scrollTop = parseFloat(_this.el.style.webkitTransform.replace('translate3d(', '').split(',')[1]) || 0;
        ionic.trigger(_this.scrollEventName, {
          target: _this.el,
          scrollTop: -scrollTop
        });

        if(_this._isDragging) {
          _this._momentumStepTimeout = setTimeout(eventNotify, _this.inertialEventInterval);
        }
      }, this.inertialEventInterval)

      console.log('TRANSITION ADDED!');
    },

    /**
     * If the scroll position is outside the current bounds,
     * animate it back.
     */
    wrapScrollPosition: function(transitionTime) {
      var _this = this;

      window.requestAnimationFrame(function() {
        var totalWidth = _this.el.scrollWidth;
        var totalHeight = _this.el.offsetHeight;
        var parentWidth = _this.el.parentNode.offsetWidth;
        var parentHeight = _this.el.parentNode.offsetHeight;

        var maxX = (-totalWidth + parentWidth);
        var maxY = (-totalHeight + parentHeight);

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
        _this.scrollTo(x, y, transitionTime || 0, _this.bounceEasing);
      
        return true;
      });
    },

    _wheel: function(e) {
      var wheelDeltaX, wheelDeltaY,
        newX, newY,
        that = this;

      var totalHeight = this.el.offsetHeight;
      var parentHeight = this.el.parentNode.offsetHeight;
      var maxY = totalHeight - parentHeight;
      var maxX = 0;

      // Execute the scrollEnd event after 400ms the wheel stopped scrolling
      clearTimeout(this.wheelTimeout);
      this.wheelTimeout = setTimeout(function () {
        //that._execEvent('scrollEnd');
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

      /*
      if(newX > 0) {
        newX = 0;
      } else if (newX < this.maxScrollX) {
        newX = this.maxScrollX;
      }
      */

      if(newY > 0) {
        newY = 0;
      } else if (newY < -maxY) {
        newY = -maxY;
      }

      this.scrollTo(0, newY, 0);
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

      console.log('Momentum: time:', time, 'speed:',speed, 'dest:',destination, 'dur:',duration);
      return {
        destination: Math.round(destination),
        duration: duration
      };
    },

    _onTransitionEnd: function(e) {
      if (e.target != this.el) {
        return;
      }

      this.el.style.webkitTransitionDuration = '0';

      if(this.wrapScrollPosition(this.bounceTime)) {
        ionic.trigger(this.scrollEndEventName, {
          target: this.el,
          scrollLeft: this.x,
          scrollTop: this.y
        });
      }
    },

    _onScrollEnd: function() {
      this._isDragging = false;
      this._drag = null;
      this.el.classList.remove('scroll-scrolling');

      console.log('REMOVING TRANSITION');
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

      this.x = scrollLeft;
      this.y = scrollTop;

      this._drag = {
        direction: 'v',
        pointX: e.gesture.touches[0].pageX,
        pointY: e.gesture.touches[0].pageY,
        startX: scrollLeft,
        startY: scrollTop,
        resist: 1,
        startTime: Date.now()
      };
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
      }

      // Stop any default events during the drag
      e.preventDefault();

      var px = e.gesture.touches[0].pageX;
      var py = e.gesture.touches[0].pageY;

      var deltaX = px - _this._drag.pointX;
      var deltaY = py - _this._drag.pointY;

      //console.log("Delta x", deltaX);
      //console.log("Delta y", deltaY);

      _this._drag.pointX = px;
      _this._drag.pointY = py;

      // Check if we should start dragging. Check if we've dragged past the threshold.
      if(!_this._isDragging && 
          ((Math.abs(e.gesture.deltaY) > _this.dragThreshold) ||
          (Math.abs(e.gesture.deltaX) > _this.dragThreshold))) {
        _this._isDragging = true;
      }

      if(_this._isDragging) {
        var drag = _this._drag;

        // Request an animation frame to batch DOM reads/writes
        window.requestAnimationFrame(function() {
          // We are dragging, grab the current content height

          var totalWidth = _this.el.scrollWidth;
          var totalHeight = _this.el.offsetHeight;
          var parentWidth = _this.el.parentNode.offsetWidth;
          var parentHeight = _this.el.parentNode.offsetHeight;

          // Grab current timestamp to keep our speend, etc.
          // calculations in a window
          var timestamp = Date.now();

          // Calculate the new Y point for the container
          // TODO: Only enable certain axes
          var newX = _this.x + deltaX;
          var newY = _this.y + deltaY;

          if(newX > 0 || (-newX + parentWidth) > totalWidth) {
            // Rubber band
            newX = _this.x + deltaX / 3;
          }
          // Check if the dragging is beyond the bottom or top
          if(newY > 0 || (-newY + parentHeight) > totalHeight) {
            // Rubber band
            newY = _this.y + deltaY / 3;//(-_this.resistance);
          }

          if(!_this.isHorizontalEnabled) {
            newX = 0;
          }
          if(!_this.isVerticalEnabled) {
            newY = 0;
          }

          // Update the new translated Y point of the container
          _this.el.style.webkitTransform = 'translate3d(' + newX + 'px,' + newY + 'px, 0)';

          // Store the last points
          _this.x = newX;
          _this.y = newY;

          console.log('Moving to', newX, newY);

          // Check if we need to reset the drag initial states if we've
          // been dragging for a bit
          if(timestamp - drag.startTime > 300) {
            console.log('Resetting timer');
            drag.startTime = timestamp;
            drag.startX = _this.x;
            drag.startY = _this.y;
          }

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
      window.requestAnimationFrame(function() {

        var drag = _this._drag;

        // Calculate the viewport height and the height of the content
        var totalWidth = _this.el.scrollWidth;
        var totalHeight = _this.el.scrollHeight;
        var parentWidth = _this.el.offsetWidth;
        var parentHeight = _this.el.offsetHeight;

        // Calculate how long we've been dragging for, with a max of 300ms
        var duration = Date.now() - _this._drag.startTime;
        var time = 0;
        var easing = '';

        var newX = Math.round(_this.x);
        var newY = Math.round(_this.y);

        _this.scrollTo(newX, newY);


        // Check if we just snap back to bounds
        if(_this.wrapScrollPosition(_this.bounceTime)) {
          return;
        }

        // If the duration is within reasonable bounds, enable momentum scrolling
        if(duration < 300) {
          var momentumX = _this._getMomentum(_this.x, drag.startX, duration, parentWidth - totalWidth, parentWidth);
          var momentumY = _this._getMomentum(_this.y, drag.startY, duration, parentHeight - totalHeight, parentHeight);
          //var newX = momentumX.destination;
          newX = momentumX.destination;
          newY = momentumY.destination;

          // Calcualte the longest required time for the momentum animation and
          // use that.
          time = Math.max(momentumX.duration, momentumY.duration);
        }
        
        // If we've moved, we will need to scroll
        if(newX != _this.x || newY != _this.y) {

          // If the end position is out of bounds, change the function we use for easing
          // to get a different animation for the rubber banding
          if ( newX > 0 || newX < (-totalWidth + parentWidth) || newY > 0 || newY < (-totalHeight + parentHeight)) {
            easing = EASING_FUNCTIONS.quadratic;
          }

          _this.scrollTo(newX, newY, time, easing);
        }
      });
    }
  };

})(ionic);
;
/**
 * Adapted from the great iScroll 5 for Ionic. iScroll is licensed under MIT just like Ionic.
 * iScroll v5.0.5 ~ (c) 2008-2013 Matteo Spinelli ~ http://cubiq.org/license
 *
 * Think of ionic.views.Scroll like a Javascript version of UIScrollView or any 
 * scroll container in any UI library. You could just use -webkit-overflow-scrolling: touch,
 * but you lose control over scroll behavior that native developers have with things
 * like UIScrollView, and you don't get events after the finger stops touching the
 * device (after a flick, for example)
 *
 */
(function (window, document, Math, ionic) {
  'use strict';

var rAF = window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame		||
	function (callback) { window.setTimeout(callback, 1000 / 60); };

/**
 * Utilities for calculating momentum, etc.
 */
var utils = (function () {
	var me = {};

	var _elementStyle = document.createElement('div').style;
	var _vendor = (function () {
		var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
			transform,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			transform = vendors[i] + 'ransform';
			if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
		}

		return false;
	})();

	function _prefixStyle (style) {
		if ( _vendor === false ) return false;
		if ( _vendor === '' ) return style;
		return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
	}

	me.getTime = Date.now || function getTime () { return new Date().getTime(); };

	me.extend = function (target, obj) {
		for ( var i in obj ) {
			target[i] = obj[i];
		}
	};

	me.addEvent = function (el, type, fn, capture) {
		el.addEventListener(type, fn, !!capture);
	};

	me.removeEvent = function (el, type, fn, capture) {
		el.removeEventListener(type, fn, !!capture);
	};

	me.momentum = function (current, start, time, lowerMargin, wrapperSize) {
		var distance = current - start,
			speed = Math.abs(distance) / time,
			destination,
			duration,
			deceleration = 0.0006;

		destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
		duration = speed / deceleration;

		if ( destination < lowerMargin ) {
			destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
			distance = Math.abs(destination - current);
			duration = distance / speed;
		} else if ( destination > 0 ) {
			destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
			distance = Math.abs(current) + destination;
			duration = distance / speed;
		}

		return {
			destination: Math.round(destination),
			duration: duration
		};
	};

	var _transform = _prefixStyle('transform');

	me.extend(me, {
		hasTransform: _transform !== false,
		hasPerspective: _prefixStyle('perspective') in _elementStyle,
		hasTouch: 'ontouchstart' in window,
		hasPointer: navigator.msPointerEnabled,
		hasTransition: _prefixStyle('transition') in _elementStyle
	});

	me.isAndroidBrowser = /Android/.test(window.navigator.appVersion) && /Version\/\d/.test(window.navigator.appVersion);

	me.extend(me.style = {}, {
		transform: _transform,
		transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
		transitionDuration: _prefixStyle('transitionDuration'),
		transformOrigin: _prefixStyle('transformOrigin')
	});

	me.hasClass = function (e, c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
		return re.test(e.className);
	};

	me.addClass = function (e, c) {
		if ( me.hasClass(e, c) ) {
			return;
		}

		var newclass = e.className.split(' ');
		newclass.push(c);
		e.className = newclass.join(' ');
	};

	me.removeClass = function (e, c) {
		if ( !me.hasClass(e, c) ) {
			return;
		}

		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
		e.className = e.className.replace(re, ' ');
	};

	me.offset = function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;

		// jshint -W084
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		// jshint +W084

		return {
			left: left,
			top: top
		};
	};

	me.preventDefaultException = function (el, exceptions) {
		for ( var i in exceptions ) {
			if ( exceptions[i].test(el[i]) ) {
				return true;
			}
		}

		return false;
	};

	me.extend(me.eventType = {}, {
		touchstart: 1,
		touchmove: 1,
		touchend: 1,

		mousedown: 2,
		mousemove: 2,
		mouseup: 2,

		MSPointerDown: 3,
		MSPointerMove: 3,
		MSPointerUp: 3
	});

	me.extend(me.ease = {}, {
		quadratic: {
			style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fn: function (k) {
				return k * ( 2 - k );
			}
		},
		circular: {
			style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
			fn: function (k) {
				return Math.sqrt( 1 - ( --k * k ) );
			}
		},
		back: {
			style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			fn: function (k) {
				var b = 4;
				return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
			}
		},
		bounce: {
			style: '',
			fn: function (k) {
				if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
					return 7.5625 * k * k;
				} else if ( k < ( 2 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
				} else if ( k < ( 2.5 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
				} else {
					return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
				}
			}
		},
		elastic: {
			style: '',
			fn: function (k) {
				var f = 0.22,
					e = 0.4;

				if ( k === 0 ) { return 0; }
				if ( k == 1 ) { return 1; }

				return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
			}
		}
	});

	me.tap = function (e, eventName) {
		var ev = document.createEvent('Event');
		ev.initEvent(eventName, true, true);
		ev.pageX = e.pageX;
		ev.pageY = e.pageY;
		e.target.dispatchEvent(ev);
	};

	me.click = function (e) {
		var target = e.target,
			ev;

		if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
			ev = document.createEvent('MouseEvents');
			ev.initMouseEvent('click', true, true, e.view, 1,
				target.screenX, target.screenY, target.clientX, target.clientY,
				e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
				0, null);

			ev._constructed = true;
			target.dispatchEvent(ev);
		}
	};

	return me;
})();

ionic.views.Scroll = function (options) {
  var el = options.el;

	this.wrapper = el;//typeof el == 'string' ? document.querySelector(el) : el;
	this.scroller = this.wrapper.children[0];
	this.scrollerStyle = this.scroller.style;		// cache style for better performance

	this.options = {

		resizeIndicator: true,

		mouseWheelSpeed: 20,

		snapThreshold: 0.334,

		startX: 0,
		startY: 0,
		scrollY: true,
		directionLockThreshold: 5,
		momentum: true,

		bounce: true,
		bounceTime: 600,
		bounceEasing: '',

		preventDefault: true,
		preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

		HWCompositing: true,
		useTransition: true,
		useTransform: true
	};

	for ( var i in options ) {
		this.options[i] = options[i];
	}

	// Normalize options
	this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

	this.options.useTransition = utils.hasTransition && this.options.useTransition;
	this.options.useTransform = utils.hasTransform && this.options.useTransform;

	this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
	this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

	// If you want eventPassthrough I have to lock one of the axes
	this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
	this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

	// With eventPassthrough we also need lockDirection mechanism
	this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
	this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

	this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

	this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

	if ( this.options.tap === true ) {
		this.options.tap = 'tap';
	}

	this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

	// Some defaults	
	this.x = 0;
	this.y = 0;
	this.directionX = 0;
	this.directionY = 0;
	this._events = {};

	this._init();
	this.refresh();

	this.scrollTo(this.options.startX, this.options.startY);
	this.enable();
}

ionic.views.Scroll.prototype = {
	version: '5.0.5',

	_init: function () {
		this._initEvents();

		if ( this.options.scrollbars || this.options.indicators ) {
			this._initIndicators();
		}

		if ( this.options.mouseWheel ) {
			this._initWheel();
		}

		if ( this.options.snap ) {
			this._initSnap();
		}

		if ( this.options.keyBindings ) {
			this._initKeys();
		}

	},

	destroy: function () {
		this._initEvents(true);

		this._execEvent('destroy');
	},

	_transitionEnd: function (e) {
		if ( e.target != this.scroller ) {
			return;
		}

		this._transitionTime(0);
		if ( !this.resetPosition(this.options.bounceTime) ) {
			this._execEvent('scrollEnd');
		}
	},

	_start: function (e) {
		// React to left mouse button only
		if ( utils.eventType[e.type] != 1 ) {
			if ( e.button !== 0 ) {
				return;
			}
		}

		if ( !this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated) ) {
			return;
		}

		if ( this.options.preventDefault && !utils.isAndroidBrowser && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();		// This seems to break default Android browser
		}

		var point = e.touches ? e.touches[0] : e,
			pos;

		this.initiated	= utils.eventType[e.type];
		this.moved		= false;
		this.distX		= 0;
		this.distY		= 0;
		this.directionX = 0;
		this.directionY = 0;
		this.directionLocked = 0;

		this._transitionTime();

		this.isAnimating = false;
		this.startTime = utils.getTime();

		if ( this.options.useTransition && this.isInTransition ) {
			pos = this.getComputedPosition();

			this._translate(Math.round(pos.x), Math.round(pos.y));
			this.isInTransition = false;
		}

		this.startX    = this.x;
		this.startY    = this.y;
		this.absStartX = this.x;
		this.absStartY = this.y;
		this.pointX    = point.pageX;
		this.pointY    = point.pageY;

		this._execEvent('scrollStart');
	},

	_move: function (e) {
    // Make sure scrolling is enabled
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

    // Prevent default if necessary
		if ( this.options.preventDefault ) {	// increases performance on Android? TODO: check!
			e.preventDefault();
		}

    // Grab the current touch point
		var point		= e.touches ? e.touches[0] : e,
      // Check how far we've scrolled in the X direction
			deltaX		= this.hasHorizontalScroll ? point.pageX - this.pointX : 0,
      // Check how far we've scrolled in the Y direction
			deltaY		= this.hasVerticalScroll   ? point.pageY - this.pointY : 0,
      // Get current timestmap
			timestamp	= utils.getTime(),
			newX, newY,
			absDistX, absDistY;

    // Store the current finger points
		this.pointX		= point.pageX;
		this.pointY		= point.pageY;

    // Calculate the total distance travelled
		this.distX		+= deltaX;
		this.distY		+= deltaY;
		absDistX		= Math.abs(this.distX);
		absDistY		= Math.abs(this.distY);

		// We need to move at least 10 pixels for the scrolling to initiate
		if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
			return;
		}

		// If you are scrolling in one direction lock the other
		if ( !this.directionLocked && !this.options.freeScroll ) {
			if ( absDistX > absDistY + this.options.directionLockThreshold ) {
				this.directionLocked = 'h';		// lock horizontally
			} else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
				this.directionLocked = 'v';		// lock vertically
			} else {
				this.directionLocked = 'n';		// no lock
			}
		}

		if ( this.directionLocked == 'h' ) {
			if ( this.options.eventPassthrough == 'vertical' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'horizontal' ) {
				this.initiated = false;
				return;
			}

			deltaY = 0;
		} else if ( this.directionLocked == 'v' ) {
			if ( this.options.eventPassthrough == 'horizontal' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'vertical' ) {
				this.initiated = false;
				return;
			}

			deltaX = 0;
		}

    // The new scroll point is the current position plus the delta moved since
    // last
		newX = this.x + deltaX;
		newY = this.y + deltaY;

		// Slow down if outside of the boundaries (rubber banding)
		if ( newX > 0 || newX < this.maxScrollX ) {
			newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
		}
		if ( newY > 0 || newY < this.maxScrollY ) {
			newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
		}

    // Calcualte the directional multiplier
		this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

    // We moved
		this.moved = true;

    // Translate to the new position
		this._translate(newX, newY);

    // Check if the difference between right now and when we started is bigger than 300ms.
    // We then reset the start positions to reduce the possibility of large errors
		if ( timestamp - this.startTime > 300 ) {
			this.startTime = timestamp;
			this.startX = this.x;
			this.startY = this.y;
		}

	},

	_end: function (e) {
    // Check if scrolling is enabled
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

    // Prevent default if enabled
		if ( this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

    // Get the current point
		var point = e.changedTouches ? e.changedTouches[0] : e,
			momentumX,
			momentumY,
      // Calculate how long we've been dragging for time wise
			duration = utils.getTime() - this.startTime,
      // Store the new position rounded
			newX = Math.round(this.x),
			newY = Math.round(this.y),
      // Calculate the total distance travelled
			distanceX = Math.abs(newX - this.startX),
			distanceY = Math.abs(newY - this.startY),
			time = 0,
			easing = '';

		this.scrollTo(newX, newY);	// ensures that the last position is rounded

		this.isInTransition = 0;
		this.initiated = 0;
		this.endTime = utils.getTime();

		// reset if we are outside of the boundaries
		if ( this.resetPosition(this.options.bounceTime) ) {
			return;
		}

		// we scrolled less than 10 pixels
		if ( !this.moved ) {
			if ( this.options.tap ) {
				utils.tap(e, this.options.tap);
			}

			if ( this.options.click ) {
				utils.click(e);
			}

			return;
		}

		if ( this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100 ) {
			this._execEvent('flick');
			return;
		}

		// start momentum animation if needed
		if ( this.options.momentum && duration < 300 ) {
			momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0) : { destination: newX, duration: 0 };
			momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0) : { destination: newY, duration: 0 };
			newX = momentumX.destination;
			newY = momentumY.destination;
			time = Math.max(momentumX.duration, momentumY.duration);
			this.isInTransition = 1;
		}


    // If they enabled snapping (for page stuff), scroll to the next snap
		if ( this.options.snap ) {
			var snap = this._nearestSnap(newX, newY);
			this.currentPage = snap;
			time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(newX - snap.x), 1000),
						Math.min(Math.abs(newY - snap.y), 1000)
					), 300);
			newX = snap.x;
			newY = snap.y;

			this.directionX = 0;
			this.directionY = 0;
			easing = this.options.bounceEasing;
		}

		if ( newX != this.x || newY != this.y ) {
			// change easing function when scroller goes out of the boundaries
			if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
				easing = utils.ease.quadratic;
			}

			this.scrollTo(newX, newY, time, easing);
			return;
		}

		this._execEvent('scrollEnd');
	},

	_resize: function () {
		var that = this;

		clearTimeout(this.resizeTimeout);

		this.resizeTimeout = setTimeout(function () {
			that.refresh();
		}, this.options.resizePolling);
	},

	resetPosition: function (time) {
		var x = this.x,
			y = this.y;

		time = time || 0;

		if ( !this.hasHorizontalScroll || this.x > 0 ) {
			x = 0;
		} else if ( this.x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( !this.hasVerticalScroll || this.y > 0 ) {
			y = 0;
		} else if ( this.y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		if ( x == this.x && y == this.y ) {
			return false;
		}

		this.scrollTo(x, y, time, this.options.bounceEasing);

		return true;
	},

	disable: function () {
		this.enabled = false;
	},

	enable: function () {
		this.enabled = true;
	},

	refresh: function () {
		var rf = this.wrapper.offsetHeight;		// Force reflow

		this.wrapperWidth	= this.wrapper.clientWidth;
		this.wrapperHeight	= this.wrapper.clientHeight;

		this.scrollerWidth	= this.scroller.offsetWidth;
		this.scrollerHeight	= this.scroller.offsetHeight;

		this.maxScrollX		= this.wrapperWidth - this.scrollerWidth;
		this.maxScrollY		= this.wrapperHeight - this.scrollerHeight;

		this.hasHorizontalScroll	= this.options.scrollX && this.maxScrollX < 0;
		this.hasVerticalScroll		= this.options.scrollY && this.maxScrollY < 0;

		if ( !this.hasHorizontalScroll ) {
			this.maxScrollX = 0;
			this.scrollerWidth = this.wrapperWidth;
		}

		if ( !this.hasVerticalScroll ) {
			this.maxScrollY = 0;
			this.scrollerHeight = this.wrapperHeight;
		}

		this.endTime = 0;
		this.directionX = 0;
		this.directionY = 0;

		this.wrapperOffset = utils.offset(this.wrapper);

		this._execEvent('refresh');

		this.resetPosition();

	},

	on: function (type, fn) {
		if ( !this._events[type] ) {
			this._events[type] = [];
		}

		this._events[type].push(fn);
	},

	_execEvent: function (type) {
		if ( !this._events[type] ) {
			return;
		}

		var i = 0,
			l = this._events[type].length;

		if ( !l ) {
			return;
		}

		for ( ; i < l; i++ ) {
			this._events[type][i].call(this);
		}
	},

	scrollBy: function (x, y, time, easing) {
		x = this.x + x;
		y = this.y + y;
		time = time || 0;

		this.scrollTo(x, y, time, easing);
	},

	scrollTo: function (x, y, time, easing) {
		easing = easing || utils.ease.circular;

		if ( !time || (this.options.useTransition && easing.style) ) {
			this._transitionTimingFunction(easing.style);
			this._transitionTime(time);
			this._translate(x, y);
		} else {
			this._animate(x, y, time, easing.fn);
		}
	},

	scrollToElement: function (el, time, offsetX, offsetY, easing) {
		el = el.nodeType ? el : this.scroller.querySelector(el);

		if ( !el ) {
			return;
		}

		var pos = utils.offset(el);

		pos.left -= this.wrapperOffset.left;
		pos.top  -= this.wrapperOffset.top;

		// if offsetX/Y are true we center the element to the screen
		if ( offsetX === true ) {
			offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
		}
		if ( offsetY === true ) {
			offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
		}

		pos.left -= offsetX || 0;
		pos.top  -= offsetY || 0;

		pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
		pos.top  = pos.top  > 0 ? 0 : pos.top  < this.maxScrollY ? this.maxScrollY : pos.top;

		time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x-pos.left), Math.abs(this.y-pos.top)) : time;

		this.scrollTo(pos.left, pos.top, time, easing);
	},

	_transitionTime: function (time) {
		time = time || 0;
		this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';


		if ( this.indicator1 ) {
			this.indicator1.transitionTime(time);
		}

		if ( this.indicator2 ) {
			this.indicator2.transitionTime(time);
		}

	},

	_transitionTimingFunction: function (easing) {
		this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


		if ( this.indicator1 ) {
			this.indicator1.transitionTimingFunction(easing);
		}

		if ( this.indicator2 ) {
			this.indicator2.transitionTimingFunction(easing);
		}


	},

	_translate: function (x, y) {
		if ( this.options.useTransform ) {

			this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

		} else {
			x = Math.round(x);
			y = Math.round(y);
			this.scrollerStyle.left = x + 'px';
			this.scrollerStyle.top = y + 'px';
		}

		this.x = x;
		this.y = y;


	if ( this.indicator1 ) {	// usually the vertical
		this.indicator1.updatePosition();
	}

	if ( this.indicator2 ) {
		this.indicator2.updatePosition();
	}

	},

	_initEvents: function (remove) {
		var eventType = remove ? utils.removeEvent : utils.addEvent,
			target = this.options.bindToWrapper ? this.wrapper : window;

		eventType(window, 'orientationchange', this);
		eventType(window, 'resize', this);

		eventType(this.wrapper, 'mousedown', this);
		eventType(target, 'mousemove', this);
		eventType(target, 'mousecancel', this);
		eventType(target, 'mouseup', this);

		if ( utils.hasPointer ) {
			eventType(this.wrapper, 'MSPointerDown', this);
			eventType(target, 'MSPointerMove', this);
			eventType(target, 'MSPointerCancel', this);
			eventType(target, 'MSPointerUp', this);
		}

		if ( utils.hasTouch ) {
			eventType(this.wrapper, 'touchstart', this);
			eventType(target, 'touchmove', this);
			eventType(target, 'touchcancel', this);
			eventType(target, 'touchend', this);
		}

		eventType(this.scroller, 'transitionend', this);
		eventType(this.scroller, 'webkitTransitionEnd', this);
		eventType(this.scroller, 'oTransitionEnd', this);
		eventType(this.scroller, 'MSTransitionEnd', this);
	},

	getComputedPosition: function () {
		var matrix = window.getComputedStyle(this.scroller, null),
			x, y;

		if ( this.options.useTransform ) {
			matrix = matrix[utils.style.transform].split(')')[0].split(', ');
			x = +(matrix[12] || matrix[4]);
			y = +(matrix[13] || matrix[5]);
		} else {
			x = +matrix.left.replace(/[^-\d]/g, '');
			y = +matrix.top.replace(/[^-\d]/g, '');
		}

		return { x: x, y: y };
	},

	_initIndicators: function () {
		var interactive = this.options.interactiveScrollbars,
			defaultScrollbars = typeof this.options.scrollbars != 'object',
			customStyle = typeof this.options.scrollbars != 'string',
			indicator1,
			indicator2;

		if ( this.options.scrollbars ) {
			// Vertical scrollbar
			if ( this.options.scrollY ) {
				indicator1 = {
					el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.options.resizeIndicator,
					listenX: false
				};

				this.wrapper.appendChild(indicator1.el);
			}

			// Horizontal scrollbar
			if ( this.options.scrollX ) {
				indicator2 = {
					el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.options.resizeIndicator,
					listenY: false
				};

				this.wrapper.appendChild(indicator2.el);
			}
		} else {
			indicator1 = this.options.indicators.length ? this.options.indicators[0] : this.options.indicators;
			indicator2 = this.options.indicators[1] && this.options.indicators[1];
		}

		if ( indicator1 ) {
			this.indicator1 = new Indicator(this, indicator1);
		}

		if ( indicator2 ) {
			this.indicator2 = new Indicator(this, indicator2);
		}

		this.on('refresh', function () {
			if ( this.indicator1 ) {
				this.indicator1.refresh();
			}

			if ( this.indicator2 ) {
				this.indicator2.refresh();
			}
		});

		this.on('destroy', function () {
			if ( this.indicator1 ) {
				this.indicator1.destroy();
				this.indicator1 = null;
			}

			if ( this.indicator2 ) {
				this.indicator2.destroy();
				this.indicator2 = null;
			}
		});
	},

	_initWheel: function () {
		utils.addEvent(this.wrapper, 'mousewheel', this);
		utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

		this.on('destroy', function () {
			utils.removeEvent(this.wrapper, 'mousewheel', this);
			utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
		});
	},

	_wheel: function (e) {
		if ( !this.enabled ) {
			return;
		}

		var wheelDeltaX, wheelDeltaY,
			newX, newY,
			that = this;

		// Execute the scrollEnd event after 400ms the wheel stopped scrolling
		clearTimeout(this.wheelTimeout);
		this.wheelTimeout = setTimeout(function () {
			that._execEvent('scrollEnd');
		}, 400);

		e.preventDefault();

		if ( 'wheelDeltaX' in e ) {
			wheelDeltaX = e.wheelDeltaX / 120;
			wheelDeltaY = e.wheelDeltaY / 120;
		} else if ( 'wheelDelta' in e ) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 120;
		} else if ( 'detail' in e ) {
			wheelDeltaX = wheelDeltaY = -e.detail / 3;
		} else {
			return;
		}

		wheelDeltaX *= this.options.mouseWheelSpeed;
		wheelDeltaY *= this.options.mouseWheelSpeed;

		if ( !this.hasVerticalScroll ) {
			wheelDeltaX = wheelDeltaY;
			wheelDeltaY = 0;
		}

		if ( this.options.snap ) {
			newX = this.currentPage.pageX;
			newY = this.currentPage.pageY;

			if ( wheelDeltaX > 0 ) {
				newX--;
			} else if ( wheelDeltaX < 0 ) {
				newX++;
			}

			if ( wheelDeltaY > 0 ) {
				newY--;
			} else if ( wheelDeltaY < 0 ) {
				newY++;
			}

			this.goToPage(newX, newY);

			return;
		}

		newX = this.x + (this.hasHorizontalScroll ? wheelDeltaX * this.options.invertWheelDirection : 0);
		newY = this.y + (this.hasVerticalScroll ? wheelDeltaY * this.options.invertWheelDirection : 0);

		if ( newX > 0 ) {
			newX = 0;
		} else if ( newX < this.maxScrollX ) {
			newX = this.maxScrollX;
		}

		if ( newY > 0 ) {
			newY = 0;
		} else if ( newY < this.maxScrollY ) {
			newY = this.maxScrollY;
		}

		this.scrollTo(newX, newY, 0);

	},

	_initSnap: function () {
		this.currentPage = {};

		if ( typeof this.options.snap == 'string' ) {
			this.options.snap = this.scroller.querySelectorAll(this.options.snap);
		}

		this.on('refresh', function () {
			var i = 0, l,
				m = 0, n,
				cx, cy,
				x = 0, y,
				stepX = this.options.snapStepX || this.wrapperWidth,
				stepY = this.options.snapStepY || this.wrapperHeight,
				el;

			this.pages = [];

			if ( !this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight ) {
				return;
			}

			if ( this.options.snap === true ) {
				cx = Math.round( stepX / 2 );
				cy = Math.round( stepY / 2 );

				while ( x > -this.scrollerWidth ) {
					this.pages[i] = [];
					l = 0;
					y = 0;

					while ( y > -this.scrollerHeight ) {
						this.pages[i][l] = {
							x: Math.max(x, this.maxScrollX),
							y: Math.max(y, this.maxScrollY),
							width: stepX,
							height: stepY,
							cx: x - cx,
							cy: y - cy
						};

						y -= stepY;
						l++;
					}

					x -= stepX;
					i++;
				}
			} else {
				el = this.options.snap;
				l = el.length;
				n = -1;

				for ( ; i < l; i++ ) {
					if ( i === 0 || el[i].offsetLeft <= el[i-1].offsetLeft ) {
						m = 0;
						n++;
					}

					if ( !this.pages[m] ) {
						this.pages[m] = [];
					}

					x = Math.max(-el[i].offsetLeft, this.maxScrollX);
					y = Math.max(-el[i].offsetTop, this.maxScrollY);
					cx = x - Math.round(el[i].offsetWidth / 2);
					cy = y - Math.round(el[i].offsetHeight / 2);

					this.pages[m][n] = {
						x: x,
						y: y,
						width: el[i].offsetWidth,
						height: el[i].offsetHeight,
						cx: cx,
						cy: cy
					};

					if ( x > this.maxScrollX ) {
						m++;
					}
				}
			}

			this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

			// Update snap threshold if needed
			if ( this.options.snapThreshold % 1 === 0 ) {
				this.snapThresholdX = this.options.snapThreshold;
				this.snapThresholdY = this.options.snapThreshold;
			} else {
				this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
				this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
			}
		});

		this.on('flick', function () {
			var time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(this.x - this.startX), 1000),
						Math.min(Math.abs(this.y - this.startY), 1000)
					), 300);

			this.goToPage(
				this.currentPage.pageX + this.directionX,
				this.currentPage.pageY + this.directionY,
				time
			);
		});
	},

	_nearestSnap: function (x, y) {
		if ( !this.pages.length ) {
			return { x: 0, y: 0, pageX: 0, pageY: 0 };
		}

		var i = 0,
			l = this.pages.length,
			m = 0;

		// Check if we exceeded the snap threshold
		if ( Math.abs(x - this.absStartX) < this.snapThresholdX &&
			Math.abs(y - this.absStartY) < this.snapThresholdY ) {
			return this.currentPage;
		}

		if ( x > 0 ) {
			x = 0;
		} else if ( x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( y > 0 ) {
			y = 0;
		} else if ( y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		for ( ; i < l; i++ ) {
			if ( x >= this.pages[i][0].cx ) {
				x = this.pages[i][0].x;
				break;
			}
		}

		l = this.pages[i].length;

		for ( ; m < l; m++ ) {
			if ( y >= this.pages[0][m].cy ) {
				y = this.pages[0][m].y;
				break;
			}
		}

		if ( i == this.currentPage.pageX ) {
			i += this.directionX;

			if ( i < 0 ) {
				i = 0;
			} else if ( i >= this.pages.length ) {
				i = this.pages.length - 1;
			}

			x = this.pages[i][0].x;
		}

		if ( m == this.currentPage.pageY ) {
			m += this.directionY;

			if ( m < 0 ) {
				m = 0;
			} else if ( m >= this.pages[0].length ) {
				m = this.pages[0].length - 1;
			}

			y = this.pages[0][m].y;
		}

		return {
			x: x,
			y: y,
			pageX: i,
			pageY: m
		};
	},

	goToPage: function (x, y, time, easing) {
		easing = easing || this.options.bounceEasing;

		if ( x >= this.pages.length ) {
			x = this.pages.length - 1;
		} else if ( x < 0 ) {
			x = 0;
		}

		if ( y >= this.pages[x].length ) {
			y = this.pages[x].length - 1;
		} else if ( y < 0 ) {
			y = 0;
		}

		var posX = this.pages[x][y].x,
			posY = this.pages[x][y].y;

		time = time === undefined ? this.options.snapSpeed || Math.max(
			Math.max(
				Math.min(Math.abs(posX - this.x), 1000),
				Math.min(Math.abs(posY - this.y), 1000)
			), 300) : time;

		this.currentPage = {
			x: posX,
			y: posY,
			pageX: x,
			pageY: y
		};

		this.scrollTo(posX, posY, time, easing);
	},

	next: function (time, easing) {
		var x = this.currentPage.pageX,
			y = this.currentPage.pageY;

		x++;

		if ( x >= this.pages.length && this.hasVerticalScroll ) {
			x = 0;
			y++;
		}

		this.goToPage(x, y, time, easing);
	},

	prev: function (time, easing) {
		var x = this.currentPage.pageX,
			y = this.currentPage.pageY;

		x--;

		if ( x < 0 && this.hasVerticalScroll ) {
			x = 0;
			y--;
		}

		this.goToPage(x, y, time, easing);
	},

	_initKeys: function (e) {
		// default key bindings
		var keys = {
			pageUp: 33,
			pageDown: 34,
			end: 35,
			home: 36,
			left: 37,
			up: 38,
			right: 39,
			down: 40
		};
		var i;

		// if you give me characters I give you keycode
		if ( typeof this.options.keyBindings == 'object' ) {
			for ( i in this.options.keyBindings ) {
				if ( typeof this.options.keyBindings[i] == 'string' ) {
					this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
				}
			}
		} else {
			this.options.keyBindings = {};
		}

		for ( i in keys ) {
			this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
		}

		utils.addEvent(window, 'keydown', this);

		this.on('destroy', function () {
			utils.removeEvent(window, 'keydown', this);
		});
	},

	_key: function (e) {
		if ( !this.enabled ) {
			return;
		}

		var snap = this.options.snap,	// we are using this alot, better to cache it
			newX = snap ? this.currentPage.pageX : this.x,
			newY = snap ? this.currentPage.pageY : this.y,
			now = utils.getTime(),
			prevTime = this.keyTime || 0,
			acceleration = 0.250,
			pos;

		if ( this.options.useTransition && this.isInTransition ) {
			pos = this.getComputedPosition();

			this._translate(Math.round(pos.x), Math.round(pos.y));
			this.isInTransition = false;
		}

		this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

		switch ( e.keyCode ) {
			case this.options.keyBindings.pageUp:
				if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
					newX += snap ? 1 : this.wrapperWidth;
				} else {
					newY += snap ? 1 : this.wrapperHeight;
				}
				break;
			case this.options.keyBindings.pageDown:
				if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
					newX -= snap ? 1 : this.wrapperWidth;
				} else {
					newY -= snap ? 1 : this.wrapperHeight;
				}
				break;
			case this.options.keyBindings.end:
				newX = snap ? this.pages.length-1 : this.maxScrollX;
				newY = snap ? this.pages[0].length-1 : this.maxScrollY;
				break;
			case this.options.keyBindings.home:
				newX = 0;
				newY = 0;
				break;
			case this.options.keyBindings.left:
				newX += snap ? -1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.up:
				newY += snap ? 1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.right:
				newX -= snap ? -1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.down:
				newY -= snap ? 1 : 5 + this.keyAcceleration>>0;
				break;
		}

		if ( snap ) {
			this.goToPage(newX, newY);
			return;
		}

		if ( newX > 0 ) {
			newX = 0;
			this.keyAcceleration = 0;
		} else if ( newX < this.maxScrollX ) {
			newX = this.maxScrollX;
			this.keyAcceleration = 0;
		}

		if ( newY > 0 ) {
			newY = 0;
			this.keyAcceleration = 0;
		} else if ( newY < this.maxScrollY ) {
			newY = this.maxScrollY;
			this.keyAcceleration = 0;
		}

		this.scrollTo(newX, newY, 0);

		this.keyTime = now;
	},

	_animate: function (destX, destY, duration, easingFn) {
		var that = this,
			startX = this.x,
			startY = this.y,
			startTime = utils.getTime(),
			destTime = startTime + duration;

		function step () {
			var now = utils.getTime(),
				newX, newY,
				easing;

			if ( now >= destTime ) {
				that.isAnimating = false;
				that._translate(destX, destY);

				if ( !that.resetPosition(that.options.bounceTime) ) {
					that._execEvent('scrollEnd');
				}

				return;
			}

			now = ( now - startTime ) / duration;
			easing = easingFn(now);
			newX = ( destX - startX ) * easing + startX;
			newY = ( destY - startY ) * easing + startY;
			that._translate(newX, newY);

			if ( that.isAnimating ) {
				rAF(step);
			}
		}

		this.isAnimating = true;
		step();
	},
	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
			case 'orientationchange':
			case 'resize':
				this._resize();
				break;
			case 'transitionend':
			case 'webkitTransitionEnd':
			case 'oTransitionEnd':
			case 'MSTransitionEnd':
				this._transitionEnd(e);
				break;
			case 'DOMMouseScroll':
			case 'mousewheel':
				this._wheel(e);
				break;
			case 'keydown':
				this._key(e);
				break;
		}
	}
};
function createDefaultScrollbar (direction, interactive, type) {
	var scrollbar = document.createElement('div'),
		indicator = document.createElement('div');

	if ( type === true ) {
		scrollbar.style.cssText = 'position:absolute;z-index:9999';
		indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
	}

	indicator.className = 'iScrollIndicator';

	if ( direction == 'h' ) {
		if ( type === true ) {
			scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
			indicator.style.height = '100%';
		}
		scrollbar.className = 'iScrollHorizontalScrollbar';
	} else {
		if ( type === true ) {
			scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
			indicator.style.width = '100%';
		}
		scrollbar.className = 'iScrollVerticalScrollbar';
	}

	if ( !interactive ) {
		scrollbar.style.pointerEvents = 'none';
	}

	scrollbar.appendChild(indicator);

	return scrollbar;
}

function Indicator (scroller, options) {
	this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
	this.indicator = this.wrapper.children[0];
	this.indicatorStyle = this.indicator.style;
	this.scroller = scroller;

	this.options = {
		listenX: true,
		listenY: true,
		interactive: false,
		resize: true,
		defaultScrollbars: false,
		speedRatioX: 0,
		speedRatioY: 0
	};

	for ( var i in options ) {
		this.options[i] = options[i];
	}

	this.sizeRatioX = 1;
	this.sizeRatioY = 1;
	this.maxPosX = 0;
	this.maxPosY = 0;

	if ( this.options.interactive ) {
		utils.addEvent(this.indicator, 'touchstart', this);
		utils.addEvent(this.indicator, 'MSPointerDown', this);
		utils.addEvent(this.indicator, 'mousedown', this);

		utils.addEvent(window, 'touchend', this);
		utils.addEvent(window, 'MSPointerUp', this);
		utils.addEvent(window, 'mouseup', this);
	}
}

Indicator.prototype = {
	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
		}
	},

	destroy: function () {
		if ( this.options.interactive ) {
			utils.removeEvent(this.indicator, 'touchstart', this);
			utils.removeEvent(this.indicator, 'MSPointerDown', this);
			utils.removeEvent(this.indicator, 'mousedown', this);

			utils.removeEvent(window, 'touchmove', this);
			utils.removeEvent(window, 'MSPointerMove', this);
			utils.removeEvent(window, 'mousemove', this);

			utils.removeEvent(window, 'touchend', this);
			utils.removeEvent(window, 'MSPointerUp', this);
			utils.removeEvent(window, 'mouseup', this);
		}

		if ( this.options.defaultScrollbars ) {
			this.wrapper.parentNode.removeChild(this.wrapper);
		}
	},

	_start: function (e) {
		var point = e.touches ? e.touches[0] : e;

		e.preventDefault();
		e.stopPropagation();

		this.transitionTime(0);

		this.initiated = true;
		this.moved = false;
		this.lastPointX	= point.pageX;
		this.lastPointY	= point.pageY;

		this.startTime	= utils.getTime();

		utils.addEvent(window, 'touchmove', this);
		utils.addEvent(window, 'MSPointerMove', this);
		utils.addEvent(window, 'mousemove', this);

		this.scroller._execEvent('scrollStart');
	},

	_move: function (e) {
		var point = e.touches ? e.touches[0] : e,
			deltaX, deltaY,
			newX, newY,
			timestamp = utils.getTime();

		this.moved = true;

		deltaX = point.pageX - this.lastPointX;
		this.lastPointX = point.pageX;

		deltaY = point.pageY - this.lastPointY;
		this.lastPointY = point.pageY;

		newX = this.x + deltaX;
		newY = this.y + deltaY;

		this._pos(newX, newY);

		e.preventDefault();
		e.stopPropagation();
	},

	_end: function (e) {
		if ( !this.initiated ) {
			return;
		}

		this.initiated = false;

		e.preventDefault();
		e.stopPropagation();

		utils.removeEvent(window, 'touchmove', this);
		utils.removeEvent(window, 'MSPointerMove', this);
		utils.removeEvent(window, 'mousemove', this);

		if ( this.scroller.options.snap ) {
			var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

			var time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(this.scroller.x - snap.x), 1000),
						Math.min(Math.abs(this.scroller.y - snap.y), 1000)
					), 300);

			if ( this.scroller.x != snap.x || this.scroller.y != snap.y ) {
				this.scroller.directionX = 0;
				this.scroller.directionY = 0;
				this.scroller.currentPage = snap;
				this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
			}
		}

		if ( this.moved ) {
			this.scroller._execEvent('scrollEnd');
		}
	},

	transitionTime: function (time) {
		time = time || 0;
		this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';
	},

	transitionTimingFunction: function (easing) {
		this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
	},

	refresh: function () {
		this.transitionTime(0);

		if ( this.options.listenX && !this.options.listenY ) {
			this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
		} else if ( this.options.listenY && !this.options.listenX ) {
			this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
		} else {
			this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
		}

		if ( this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ) {
			utils.addClass(this.wrapper, 'iScrollBothScrollbars');
			utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

			if ( this.options.defaultScrollbars && this.options.customStyle ) {
				if ( this.options.listenX ) {
					this.wrapper.style.right = '8px';
				} else {
					this.wrapper.style.bottom = '8px';
				}
			}
		} else {
			utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
			utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

			if ( this.options.defaultScrollbars && this.options.customStyle ) {
				if ( this.options.listenX ) {
					this.wrapper.style.right = '2px';
				} else {
					this.wrapper.style.bottom = '2px';
				}
			}
		}

		var r = this.wrapper.offsetHeight;	// force refresh

		if ( this.options.listenX ) {
			this.wrapperWidth = this.wrapper.clientWidth;
			if ( this.options.resize ) {
				this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
				this.indicatorStyle.width = this.indicatorWidth + 'px';
			} else {
				this.indicatorWidth = this.indicator.clientWidth;
			}
			this.maxPosX = this.wrapperWidth - this.indicatorWidth;
			this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));	
		}

		if ( this.options.listenY ) {
			this.wrapperHeight = this.wrapper.clientHeight;
			if ( this.options.resize ) {
				this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
				this.indicatorStyle.height = this.indicatorHeight + 'px';
			} else {
				this.indicatorHeight = this.indicator.clientHeight;
			}

			this.maxPosY = this.wrapperHeight - this.indicatorHeight;
			this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
		}

		this.updatePosition();
	},

	updatePosition: function () {
		var x = Math.round(this.sizeRatioX * this.scroller.x) || 0,
			y = Math.round(this.sizeRatioY * this.scroller.y) || 0;

		if ( !this.options.ignoreBoundaries ) {
			if ( x < 0 ) {
				x = 0;
			} else if ( x > this.maxPosX ) {
				x = this.maxPosX;
			}

			if ( y < 0 ) {
				y = 0;
			} else if ( y > this.maxPosY ) {
				y = this.maxPosY;
			}		
		}

		this.x = x;
		this.y = y;

		if ( this.scroller.options.useTransform ) {
			this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
		} else {
			this.indicatorStyle.left = x + 'px';
			this.indicatorStyle.top = y + 'px';
		}
	},

	_pos: function (x, y) {
		if ( x < 0 ) {
			x = 0;
		} else if ( x > this.maxPosX ) {
			x = this.maxPosX;
		}

		if ( y < 0 ) {
			y = 0;
		} else if ( y > this.maxPosY ) {
			y = this.maxPosY;
		}

		x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
		y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

		this.scroller.scrollTo(x, y);
	}
};

ionic.views.Scroll.ease = utils.ease;

})(window, document, Math, ionic);
;
(function(ionic) {
'use strict';

  ionic.views.SideMenu = function(opts) {
    this.el = opts.el;
    this.width = opts.width;
    this.isEnabled = opts.isEnabled || true;
  };

  ionic.views.SideMenu.prototype = {
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
  };

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

  ionic.views.SlideBox = function(opts) {
    var _this = this;

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
    }, this.el);
    window.ionic.onGesture('release', function(e) {
      _this._handleEndDrag(e);
    }, this.el);
  };

  ionic.views.SlideBox.prototype = {
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

      // Update the slide index
      this.slideIndex = Math.ceil(offsetX / slideWidth);

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

      window.requestAnimationFrame(function() {
      
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

      window.requestAnimationFrame(function() {
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
  };

})(window.ionic);
;
(function(ionic) {
'use strict';

ionic.views.TabBarItem = function(el) {
  this.el = el;

  this._buildItem();
};
ionic.views.TabBarItem.prototype = {
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
    this.title = this.el.innerText.trim();

    this._tapHandler = function(e) {
      _this.onTap && _this.onTap(e);
    };

    ionic.on('tap', this._tapHandler, this.el);
  },
  onTap: function(e) {
    console.log('On tap');
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
};

ionic.views.TabBar = function(opts) {
  this.el = opts.el;
   
  this.items = [];

  this._buildItems();
};

ionic.views.TabBar.prototype = {
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
};

})(window.ionic);
;
(function(ionic) {
'use strict';

  ionic.views.Toggle = function(opts) {
    this.el = opts.el;
    this.checkbox = opts.checkbox;
    this.handle = opts.handle;
    this.openPercent = -1;
  };

  ionic.views.Toggle.prototype = {

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

  };

})(ionic);
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
ionic.controllers.NavController = function(opts) {
  var _this = this;

  this.navBar = opts.navBar;
  this.content = opts.content;
  this.controllers = opts.controllers || [];

  this._updateNavBar();

  // TODO: Is this the best way?
  this.navBar.shouldGoBack = function() {
    _this.pop();
  };
};

ionic.controllers.NavController.prototype = {
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

    // Remove the old one
    //last && last.detach();
    if(last) {
      last.isVisible = false;
      last.visibilityChanged && last.visibilityChanged();
    }

    // Grab the top controller on the stack
    var next = this.controllers[this.controllers.length - 1];

    // TODO: No DOM stuff here
    //this.content.el.appendChild(next.el);
    next.isVisible = true;
    next.visibilityChanged && next.visibilityChanged();

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
      last.visibilityChanged && last.visibilityChanged();
    }
    
    // Remove the old one
    //last && last.detach();

    next = this.controllers[this.controllers.length - 1];

    // TODO: No DOM stuff here
    //this.content.el.appendChild(next.el);
    next.isVisible = true;
    next.visibilityChanged && next.visibilityChanged();

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
};
})(window.ionic);
;
/**
 * Adapted from Backbone.js
 */
(function(ionic) {
'use strict';
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  ionic.controllers.RouteViewController = function(options) {
    this.options = options;

    this.root = this.options.root || '/';
    this.root = ('/' + this.root + '/').replace(rootStripper, '/');

    this.handlers = [];

    this._bindEvents();

    this.location = window.location;
    this.history = window.history;
  };

  ionic.controllers.RouteViewController.prototype = {
    when: function(route, callback) {
      var _this = this;

      route = this._routeToRegExp(route);

      this.handlers.unshift({
        route: route,
        callback: function(fragment)  {
          var args = _this._extractParameters(route, fragment);
          callback && callback.apply(_this, args);
        }
      });
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional){
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      var extracted = [];
      for(var i = 0; i < params.length; i++) {
        if(param) {
          extracted.push(decodeURIComponent(param));
        }
      }
    },

    _bindEvents: function() {
      var _this = this;

      window.addEventListener('popstate', function(event) {
        _this.checkUrl(event);
      });
    },
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment) return false;
      this.loadUrl() || this.loadUrl(this.getHash());
    },
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        fragment = this.location.pathname;
        var root = this.root.replace(this.trailingSlash, '');
        if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
      }
      return fragment.replace(routeStripper, '');
    },
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = false;
      for(var i = 0; i < this.handlers.length; i++) {
        var h = this.handlers[i];
        if (h.route.test(fragment)) {
          h.callback(fragment);
          matched = true;
        }
      }
      return matched;
    },
  };
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
  ionic.controllers.SideMenuController = function(options) {
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

      this.content.endDrag = function(e) {
        self._endDrag(e);
      };
    }
  };

  ionic.controllers.SideMenuController.prototype = {
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
      var maxLeft = this.left.width;
      var maxRight = this.right.width;
      if(percentage >= 0) {
        this.openAmount(maxLeft * p);
      } else {
        this.openAmount(maxRight * p);
      }
    },

    /**
     * Open the menu the given pixel amount.
     * @param {float} amount the pixel amount to open the menu. Positive value for left menu,
     * negative value for right menu (only one menu will be visible at a time).
     */
    openAmount: function(amount) {
      var maxLeft = this.left.width;
      var maxRight = this.right.width;

      // Check if we can move to that side, depending if the left/right panel is enabled
      if((!this.left.isEnabled && amount > 0) || (!this.right.isEnabled && amount < 0)) {
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
        this.right.pushDown();
        // Bring the z-index of the left menu up
        this.left.bringUp();
      } else {
        this._rightShowing = true;
        this._leftShowing = false;

        // Bring the z-index of the right menu up
        this.right.bringUp();
        // Push the z-index of the left menu down
        this.left.pushDown();
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
  };

})(ionic);
;
(function(ionic) {
'use strict';

ionic.controllers.TabBarController = function(options) {
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

  this.setSelectedController(0);
};

ionic.controllers.TabBarController.prototype = {
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
      this.controllerChanged && this.controllerChanged(this.selectedController, this.selectedIndex);
    }
  },

  // Force the selection of a controller at the given index
  setSelectedController: function(index) {
    if(index >= this.controllers.length) {
      return;
    }
    this.selectedController = this.controllers[index];
    this.selectedIndex = index;

    this._showController(index);
    this.tabBar.setSelectedItem(index);
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

  // Get the currently selected tab
  getSelectedController: function() {
    return this.selectedController;
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
};

})(window.ionic);
;
(function(ionic) {
'use strict';
  ionic.ViewController = function(options) {
    this.init();
  };

  ionic.ViewController.prototype = {
    // Initialize this view controller
    init: function() {
    },
    // Destroy this view controller, including all child views
    destroy: function() {
    }
  };
})(window.ionic);
