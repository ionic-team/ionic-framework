(function(window, document, ionic) {
  'use strict';

  // From the man himself, Mr. Paul Irish.
  // The requestAnimationFrame polyfill
  window.rAF = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 16);
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
  ionic.tapElement = function(ele, e) {
    // simulate a normal click by running the element's click method then focus on it
    if(ele.disabled) return;

    console.debug('tapElement', ele.tagName, ele.className);

    var c = getCoordinates(e);

    // using initMouseEvent instead of MouseEvent for our Android friends
    var clickEvent = document.createEvent("MouseEvents");
    clickEvent.initMouseEvent('click', true, true, window,
                              1, 0, 0, c.x, c.y,
                              false, false, false, false, 0, null);
    
    ele.dispatchEvent(clickEvent);

    if(ele.tagName === 'INPUT' || ele.tagName === 'TEXTAREA' || ele.tagName === 'SELECT') {
      ele.focus(); 
    } else {
      ele.blur();
    }

    // remember the coordinates of this tap so if it happens again we can ignore it
    // but only if the coordinates are not already being actively disabled
    if( !isRecentTap(e) ) {
      recordCoordinates(e);
    }

    // set the last tap time so if a click event quickly happens it knows to ignore it
    ele.lastTap = Date.now();
  };

  function tapPolyfill(orgEvent) {
    // if the source event wasn't from a touch event then don't use this polyfill
    if(!orgEvent.gesture || !orgEvent.gesture.srcEvent) return;

    var e = orgEvent.gesture.srcEvent; // evaluate the actual source event, not the created event by gestures.js
    var ele = e.target;

    if( isRecentTap(e) ) {
      // if a tap in the same area just happened, don't continue
      console.debug('tapPolyfill', 'isRecentTap', ele.tagName);
      return;
    }

    if(ele.lastClick && ele.lastClick + CLICK_PREVENT_DURATION > Date.now()) {
      // if a click recently happend on this element, don't continue
      // (yes on some devices it's possible for a click to happen before a touchend)
      console.debug('tapPolyfill', 'recent lastClick', ele.tagName);
      return;
    }

    while(ele) {
      // climb up the DOM looking to see if the tapped element is, or has a parent, of one of these
      if( ele.tagName === "INPUT" ||
          ele.tagName === "A" || 
          ele.tagName === "BUTTON" || 
          ele.tagName === "TEXTAREA" || 
          ele.tagName === "SELECT" ) {

        return ionic.tapElement(ele, e);

      } else if( ele.tagName === "LABEL" ) {
        // check if the tapped label has an input associated to it
        if(ele.control) {
          return ionic.tapElement(ele.control, e);
        }
      }
      ele = ele.parentElement;
    }

    // they didn't tap one of the above elements
    // if the currently active element is an input, and they tapped outside
    // of the current input, then unset its focus (blur) so the keyboard goes away
    ele = document.activeElement;
    if(ele && (ele.tagName === "INPUT" || 
               ele.tagName === "TEXTAREA" || 
               ele.tagName === "SELECT")) {
      ele.blur();
    }
  }

  function preventGhostClick(e) {
    if(e.target.tagName === "LABEL" && e.target.control) {
      // this is a label that has an associated input

      if(e.target.control.labelLastTap && e.target.control.labelLastTap + CLICK_PREVENT_DURATION > Date.now()) {
        // Android will fire a click for the label, and a click for the input which it is associated to
        // this stops the second ghost click from the label from continuing
        console.debug('preventGhostClick', 'labelLastTap');
        e.stopPropagation();
        e.preventDefault();
        return false;
      }

      // remember the last time this label was clicked to it can prevent a second label ghostclick
      e.target.control.labelLastTap = Date.now();

      // The input's click event will propagate so don't bother letting this label's click 
      // propagate cuz it causes double clicks. However, do NOT e.preventDefault(), because 
      // the label still needs to click the input
      console.debug('preventGhostClick', 'label stopPropagation');
      e.stopPropagation();
      return;
    }

    if( isRecentTap(e) ) {
      // a tap has already happened at these coordinates recently, ignore this event
      console.debug('preventGhostClick', 'isRecentTap', e.target.tagName);
      e.stopPropagation();
      e.preventDefault();
      return false;
    }

    if(e.target.lastTap && e.target.lastTap + CLICK_PREVENT_DURATION > Date.now()) {
      // this element has already had the tap poly fill run on it recently, ignore this event
      console.debug('preventGhostClick', 'e.target.lastTap', e.target.tagName);
      e.stopPropagation();
      e.preventDefault();
      return false;
    }

    // remember the last time this element was clicked
    e.target.lastClick = Date.now();

    // remember the coordinates of this click so if a tap or click in the 
    // same area quickly happened again we can ignore it
    recordCoordinates(e);
  }

  function isRecentTap(event) {
    // loop through the tap coordinates and see if the same area has been tapped recently
    var tapId, existingCoordinates, currentCoordinates,
    hitRadius = 15;

    for(tapId in tapCoordinates) {
      existingCoordinates = tapCoordinates[tapId];
      if(!currentCoordinates) currentCoordinates = getCoordinates(event); // lazy load it when needed

      if(currentCoordinates.x > existingCoordinates.x - hitRadius &&
         currentCoordinates.x < existingCoordinates.x + hitRadius &&
         currentCoordinates.y > existingCoordinates.y - hitRadius &&
         currentCoordinates.y < existingCoordinates.y + hitRadius) {
        // the current tap coordinates are in the same area as a recent tap
        return true;
      }
    }
  }

  function recordCoordinates(event) {
    var c = getCoordinates(event);
    if(c.x && c.y) {
      var tapId = 't' + Date.now();

      // only record tap coordinates if we have valid ones
      tapCoordinates[tapId] = { x: c.x, y:c.y };

      setTimeout(function() {
        // delete the tap coordinates after X milliseconds, basically allowing
        // it so a tap can happen again in the same area in the future
        delete tapCoordinates[tapId];
      }, CLICK_PREVENT_DURATION);
    }
  }

  function getCoordinates(event) {
    // This method can get coordinates for both a mouse click
    // or a touch depending on the given event
    var gesture = (event.gesture ? event.gesture : event);

    if(gesture) {
      var touches = gesture.touches && gesture.touches.length ? gesture.touches : [gesture];
      var e = (gesture.changedTouches && gesture.changedTouches[0]) ||
          (gesture.originalEvent && gesture.originalEvent.changedTouches &&
              gesture.originalEvent.changedTouches[0]) ||
          touches[0].originalEvent || touches[0];

      if(e) return { x: e.clientX, y: e.clientY };
    }
    return { x:0, y:0 };
  }

  var tapCoordinates = {}; // used to remember coordinates to ignore if they happen again quickly
  var CLICK_PREVENT_DURATION = 450; // amount of milliseconds to check for ghostclicks

  // set global click handler and check if the event should stop or not
  document.addEventListener('click', preventGhostClick, true);

  // global tap event listener polyfill for HTML elements that were "tapped" by the user
  ionic.on("tap", tapPolyfill, document);

})(this, document, ionic);
