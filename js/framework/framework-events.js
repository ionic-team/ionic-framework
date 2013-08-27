/**
 * framework-events.js
 *
 * Author: Max Lynch <max@drifty.com>
 *
 * Framework events handles various mobile browser events, and 
 * detects special events like tap/swipe/etc. and emits them
 * as custom events that can be used in an app.
 *
 * Portions lovingly adapted from github.com/maker/ratchet and github.com/alexgibson/tap.js - thanks guys!
 */

(function(window, document, framework) {
  framework.EventController = {

    // A map of event types that we virtually detect and emit
    VIRTUAL_EVENT_TYPES: ['tap', 'swipeleft', 'swiperight'],
  
    /**
     * Trigger a new event.
     */
    trigger: function(eventType, data) {
      // TODO: Do we need to use the old-school createEvent stuff?

      window.dispatchEvent(new CustomEvent(eventType, data));
    },
  
    /**
     * Shorthand for binding a new event listener to the given
     * event type.
     */
    on: function(type, callback, element) {
      var i;
      var e = element || window;
      /*
      var virtualTypes = framework.EventController.VIRTUAL_EVENT_TYPES;

      for(i = 0; i < virtualTypes.length; i++) {
        if(type.toLowerCase() == virtualTypes[i]) {
          // TODO: listen for virtual event
          return;
        }
      }
      */

      // Native listener
      e.addEventListener(type, callback);
    },


    /**
     * Process a touchstart event.
     */
    handleTouchStart: function(e) {
      console.log("EVENT: touchstart", e);
      framework.GestureController.startGesture(e);
    },

    /**
     * Process a touchmove event.
     */
    handleTouchMove: function(e) {
      console.log("EVENT: touchmove", e);
      framework.GestureController.detectGesture(e);

    },

    /**
     * Process a touchend event.
     */
    handleTouchEnd: function(e) {
      console.log("EVENT: touchend", e);
      framework.GestureController.detectGesture(e);
    },


    /**
     * Process a touchcancel event.
     */
    handleTouchCancel: function(e) {
      this._hasMoved = false;
      this._touchStartX = null;
      this._touchStartY = null;
    },

    // With a click event, we need to check the target
    // and if it's an internal target that doesn't want
    // a click, cancel it
    handleClick: function(e) {
      var target = e.target;

      if (
        !  target
        || e.which > 1
        || e.metaKey
        || e.ctrlKey
        //|| isScrolling
        || location.protocol !== target.protocol
        || location.host     !== target.host
        // Not sure abotu this one
        //|| !target.hash && /#/.test(target.href)
        || target.hash && target.href.replace(target.hash, '') === location.href.replace(location.hash, '')
        //|| target.getAttribute('data-ignore') == 'push'
      ) {
        // Allow it
        console.log("EVENT: click", e);
        return;
      }
      // We need to cancel this one
      e.preventDefault();

      // TODO: should we do this?
      // e.stopPropagation();
    },
    
    handlePopState: function(event) {
      console.log("EVENT: popstate", event);
    },
  };
  
  
  // Map some convenient top-level functions for event handling
  framework.on = framework.EventController.on;
  framework.trigger = framework.EventController.trigger;

  // Set up various listeners
  window.addEventListener('touchstart', framework.EventController.handleTouchStart);
  window.addEventListener('touchmove', framework.EventController.handleTouchMove);
  window.addEventListener('touchcancel', framework.EventController.handleTouchCancel);
  window.addEventListener('touchend', framework.EventController.handleTouchEnd);
  window.addEventListener('click', framework.EventController.handleClick);
  window.addEventListener('popstate', framework.EventController.handlePopState);

})(this, document, FM = this.FM || {});
