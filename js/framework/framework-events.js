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
  framework.EventController = function (){};

  // A map of event types that we virtually detect and emit
  framework.EventController.prototype.VIRTUAL_EVENT_TYPES = ['tap', 'swipeleft', 'swiperight'];

  
  /**
   * Trigger a new event.
   */
  framework.EventController.prototype.trigger = function(eventType, data) {
    // TODO: Do we need to use the old-school createEvent stuff?

    window.dispatchEvent(new CustomEvent(eventType, data));
  };
  
  /**
   * Shorthand for binding a new event listener to the given
   * event type.
   */
  framework.EventController.prototype.on = function(type, callback, element) {
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


  /**
   * Process a touchstart event.
   */
  framework.EventController.prototype.handleTouchStart = function(e) {
    console.log("EVENT: touchstart", e);
    if(e.type === 'touchstart') {
      // We are now touching
      this._isTouching = true;
    }
    
    // Reset the movement indicator
    this._hasMoved = false;

    // Store touch coords
    this._touchStartX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    this._touchStartY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
  };

  /**
   * Process a touchmove event.
   */
  framework.EventController.prototype.handleTouchMove = function(e) {
    console.log("EVENT: touchmove", e);

    var x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX,
        y = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    // Check if the finger moved more than 10px, and then indicate we should cancel the tap
    if (Math.abs(x - this._touchStartX) > 10 || Math.abs(y - this._touchStartY) > 10) {
      this._hasMoved = true;
      console.log('DID MOVE');
    }
  };

  /**
   * Process a touchend event.
   */
  framework.EventController.prototype.handleTouchEnd = function(e) {
    console.log("EVENT: touchend", e);

    if(this._isTouching && !this._hasMoved) {
      console.log("EVENT: (virtual) tap", event);
      framework.trigger('tap', {
        bubbles: true,
        cancelable: true
      });
    }
    framework.EventController._isTouching = false;
  };


  /**
   * Process a touchcancel event.
   */
  framework.EventController.prototype.handleTouchCancel = function(e) {
    this._hasMoved = false;
    this._touchStartX = null;
    this._touchStartY = null;
  };

  // With a click event, we need to check the target
  // and if it's an internal target that doesn't want
  // a click, cancel it
  framework.EventController.prototype.handleClick = function(e) {
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
  }
  
  framework.EventController.prototype.handlePopState = function(event) {
    console.log("EVENT: popstate", event);
  }
  
  
  // Map some convenient top-level functions for event handling
  framework.on = framework.EventController.prototype.on;
  framework.trigger = framework.EventController.prototype.trigger;


  // Set up various listeners
  window.addEventListener('touchstart', framework.EventController.prototype.handleTouchStart);
  window.addEventListener('touchmove', framework.EventController.prototype.handleTouchMove);
  window.addEventListener('touchcancel', framework.EventController.prototype.handleTouchCancel);
  window.addEventListener('touchend', framework.EventController.prototype.handleTouchEnd);
  window.addEventListener('click', framework.EventController.prototype.handleClick);
  window.addEventListener('popstate', framework.EventController.prototype.handlePopState);

})(this, document, FM = this.FM || {});
