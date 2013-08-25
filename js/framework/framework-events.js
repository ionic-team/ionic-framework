/**
 * framework-events.js
 *
 * Author: Max Lynch <max@drifty.com>
 *
 * Framework events handles various mobile browser events, and 
 * detects special events like tap/swipe/etc. and emits them
 * as custom events that can be used in an app.
 */

(function(window, document, framework) {
  framework.EventController = function (){};

  // A map of event types that we virtually detect and emit
  framework.EventController.prototype.VIRTUAL_EVENT_TYPES = ['tap', 'swipeleft', 'swiperight'];

  // Some convenient top-level event functions

  framework.trigger = function(type, data) {
    window.dispatchEvent(new CustomEvent(type, data));
  };

  framework.on = function(type, callback, element) {
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
  };

  var _touchStart = function(event) {
    console.log("EVENT: touchstart", event);
    framework.EventController.isTouching = true;
  };

  var _touchMove = function(event) {
    console.log("EVENT: touchmove", event);
  };

  var _touchEnd = function(event) {
    console.log("EVENT: touchend", event);
    if(framework.EventController.isTouching) {
      console.log("EVENT: (virtual) tap", event);
      framework.trigger('tap', {
      });
    }
    framework.EventController.isTouching = false;
  };

  // With a click event, we need to check the target
  // and if it's an internal target that doesn't want
  // a click, cancel it
  var _click = function(e) {
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
  }
  
  var _popstate = function(event) {
    console.log("EVENT: popstate", event);
  }

  // Set up various listeners
  window.addEventListener('touchstart', _touchStart);
  window.addEventListener('touchmove', _touchMove);
  window.addEventListener('touchend', _touchEnd);
  window.addEventListener('click', _click);
  window.addEventListener('popstate', _popstate);
})(this, document, this.FM = this.FM || {});
