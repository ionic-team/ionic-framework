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
    document.removeEventListener('touchcancel', self.touchCancel);

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
