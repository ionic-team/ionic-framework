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

    isAndroidBrowser: (navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Chrome') < 0),

    // Trigger a new event
    trigger: function(eventType, data) {
      var event = new CustomEvent(eventType, { detail: data });

      // Make sure to trigger the event on the given target, or dispatch it from
      // the window if we don't have an event target
      if(data && data.target) {

        // fire the event
        data.target.dispatchEvent(event) || window.dispatchEvent(event);

        // fix for "click" firing twice on our Android friends
        if(ionic.EventController.isAndroidBrowser && eventType === 'click') {
          // Due to a bug, old Android browser fires both touchstart/touchend
          // and mousedown/mouseup. Because both are fired it results in
          // the "click" running twice on an element. Since this was a 
          // triggered "click", which probably came from our "tap", then 
          // set this element to be disabled for X milliseconds. While this 
          // element is disabled, a second "click" by the browser would not 
          // execute, hence the "click" only fires once from the initial "tap".
          var orgVal = data.target.disabled;
          data.target.disabled = true;

          // After X milliseconds set the disabled value back to what it was
          setTimeout(function(){
            data.target.disabled = orgVal;
          }, 200);
        }
      }
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
  ionic.trigger = ionic.EventController.trigger;//function() { ionic.EventController.trigger.apply(ionic.EventController.trigger, arguments); };
  ionic.onGesture = function() { return ionic.EventController.onGesture.apply(ionic.EventController.onGesture, arguments); };
  ionic.offGesture = function() { return ionic.EventController.offGesture.apply(ionic.EventController.offGesture, arguments); };

})(window.ionic);
