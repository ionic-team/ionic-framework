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
      // TODO: Do we need to use the old-school createEvent stuff?
      var event = new CustomEvent(eventType, data);

      // Make sure to trigger the event on the given target, or dispatch it from
      // the window if we don't have an event target
      data.target && data.target.dispatchEvent(event) || window.dispatchEvent(event);
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

    // With a click event, we need to check the target
    // and if it's an internal target that doesn't want
    // a click, cancel it
    handleClick: function(e) {
      var target = e.target;

      if(ionic.Gestures.HAS_TOUCHEVENTS) {
        // We don't allow any clicks on mobile
        e.preventDefault();
        return false;
      }

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
        return;
      }
      // We need to cancel this one
      e.preventDefault();

    },
    
    handlePopState: function(event) {
      console.log("EVENT: popstate", event);
    },
  };
  
  
  // Map some convenient top-level functions for event handling
  ionic.on = function() { ionic.EventController.on.apply(ionic.EventController, arguments); }
  ionic.off = function() { ionic.EventController.off.apply(ionic.EventController, arguments); }
  ionic.trigger = function() { ionic.EventController.trigger.apply(ionic.EventController.trigger, arguments); }
  ionic.onGesture = function() { ionic.EventController.onGesture.apply(ionic.EventController.onGesture, arguments); }
  ionic.offGesture = function() { ionic.EventController.offGesture.apply(ionic.EventController.offGesture, arguments); }

  // Set up various listeners
  window.addEventListener('click', ionic.EventController.handleClick);

})(ionic = window.ionic || {});
