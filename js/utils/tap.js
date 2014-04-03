(function(window, document, ionic) {
  'use strict';

  var CLICK_PREVENT_DURATION = 1500; // max milliseconds ghostclicks in the same area should be prevented
  var REMOVE_PREVENT_DELAY = 380; // delay after a touchend/mouseup before removing the ghostclick prevent
  var REMOVE_PREVENT_DELAY_GRADE_C = 800; // same as REMOVE_PREVENT_DELAY, but for grade c devices
  var HIT_RADIUS = 15; // surrounding area of a click that if a ghostclick happens it would get ignored
  var TOUCH_TOLERANCE_X = 4; // how much the X coordinates can be off between start/end, but still a click
  var TOUCH_TOLERANCE_Y = 2; // how much the Y coordinates can be off between start/end, but still a click
  var tapCoordinates = {}; // used to remember coordinates to ignore if they happen again quickly
  var startCoordinates = {}; // used to remember where the coordinates of the start of a touch
  var clickPreventTimerId;


  ionic.tap = {

    tapInspect: function(orgEvent) {
      // if the event doesn't have a gesture then don't continue
      if(!orgEvent.gesture || !orgEvent.gesture.srcEvent) return;

      var e = orgEvent.gesture.srcEvent; // evaluate the actual source event, not the created event by gestures.js
      var ele = e.target; // get the target element that was actually tapped

      if( ionic.tap.isRecentTap(e) || e.type === 'touchcancel' ) {
        // if a tap in the same area just happened,
        // or it was a touchcanel event, don't continue
        console.debug('tapInspect', 'isRecentTap', ele.tagName, 'type:', e.type);
        return stopEvent(e);
      }

      for(var x=0; x<5; x++) {
        // climb up the DOM looking to see if the tapped element is, or has a parent, of one of these
        // only climb up a max of 5 parents, anything more probably isn't beneficial
        if(!ele) break;

        if( ele.tagName === "INPUT" ||
            ele.tagName === "A" ||
            ele.tagName === "BUTTON" ||
            ele.tagName === "LABEL" ||
            ele.tagName === "TEXTAREA" ) {

          return ionic.tap.simulateClick(ele, e);
        }
        ele = ele.parentElement;
      }

      // they didn't tap one of the above elements
      // if the currently active element is an input, and they tapped outside
      // of the current input, then unset its focus (blur) so the keyboard goes away
      ionic.tap.blurActive();
    },

    simulateClick: function(target, e) {
      // simulate a normal click by running the element's click method then focus on it

      var ele = target.control || target;

      if(ele.disabled || ele.type === 'file' || ele.type === 'range') {
        e.tapIgnored = true;
        return;
      }

      console.debug('simulateClick', ele.tagName, ele.className);

      var c = ionic.tap.getCoordinates(e);

      // using initMouseEvent instead of MouseEvent for our Android friends
      var clickEvent = document.createEvent("MouseEvents");
      clickEvent.initMouseEvent('click', true, true, window,
                                1, 0, 0, c.x, c.y,
                                false, false, false, false, 0, null);

      ele.dispatchEvent(clickEvent);

      if(ele.tagName === 'INPUT' || ele.tagName === 'TEXTAREA') {
        if(!ionic.tap.hasScrolled(e)) {
          ele.focus();
        }
        e.preventDefault();
      } else {
        ionic.tap.blurActive();
      }

      // remember the coordinates of this tap so if it happens again we can ignore it
      // but only if the coordinates are not already being actively disabled
      if( !ionic.tap.isRecentTap(e) ) {
        ionic.tap.recordCoordinates(e);
      }

      if(target.control) {
        console.debug('simulateClick, target.control, stop');
        return stopEvent(e);
      }

    },

    preventGhostClick: function(e) {

      console.debug((function(){
        // Great for debugging, and thankfully this gets removed from the build, OMG it's ugly

        if(e.target.control) {
          // this is a label that has an associated input
          // the native layer will send the actual event, so stop this one
          console.debug('preventGhostClick', 'label');

        } else if(ionic.tap.isRecentTap(e)) {
          // a tap has already happened at these coordinates recently, ignore this event
          console.debug('preventGhostClick', 'isRecentTap', e.target.tagName);

        } else if(ionic.tap.hasScrolled(e)) {
          // this click's coordinates are different than its touchstart/mousedown, must have been scrolling
          console.debug('preventGhostClick', 'hasScrolled, startCoordinates, x:' + startCoordinates.x + ' y:' + startCoordinates.y);
        }

        var c = ionic.tap.getCoordinates(e);
        return 'click at x:' + c.x + ', y:' + c.y;
      })());


      if(e.target.control || ionic.tap.isRecentTap(e) || ionic.tap.hasScrolled(e)) {
        return stopEvent(e);
      }

      // remember the coordinates of this click so if a tap or click in the
      // same area quickly happened again we can ignore it
      ionic.tap.recordCoordinates(e);
    },

    getCoordinates: function(event) {
      // This method can get coordinates for both a mouse click
      // or a touch depending on the given event
      var gesture = (event.gesture ? event.gesture : event);

      if(gesture) {
        var touches = gesture.touches && gesture.touches.length ? gesture.touches : [gesture];
        var e = (gesture.changedTouches && gesture.changedTouches[0]) ||
            (gesture.originalEvent && gesture.originalEvent.changedTouches &&
                gesture.originalEvent.changedTouches[0]) ||
            touches[0].originalEvent || touches[0];

        if(e) return { x: e.clientX || e.pageX || 0, y: e.clientY || e.pageY || 0 };
      }
      return { x:0, y:0 };
    },

    hasScrolled: function(event) {
      // check if this click's coordinates are different than its touchstart/mousedown
      var c = ionic.tap.getCoordinates(event);

      // Quick check for 0,0 which could be simulated mouse click for form submission
      if(c.x === 0 && c.y === 0) {
        return false;
      }

      return (c.x > startCoordinates.x + TOUCH_TOLERANCE_X ||
              c.x < startCoordinates.x - TOUCH_TOLERANCE_X ||
              c.y > startCoordinates.y + TOUCH_TOLERANCE_Y ||
              c.y < startCoordinates.y - TOUCH_TOLERANCE_Y);
    },

    recordCoordinates: function(event) {
      // get the coordinates of this event and remember them for later
      var c = ionic.tap.getCoordinates(event);
      if(c.x && c.y) {
        var tapId = Date.now();

        // only record tap coordinates if we have valid ones
        tapCoordinates[tapId] = { x: c.x, y: c.y, id: tapId };

        setTimeout(function() {
          // delete the tap coordinates after X milliseconds, basically allowing
          // it so a tap can happen again in the same area in the future
          // this is only a fallback, most tap coordinates will be removed
          // from the removeClickPrevent event fired by touchend/mouseup
          delete tapCoordinates[tapId];
        }, CLICK_PREVENT_DURATION);
      }
    },

    removeClickPrevent: function(e) {
      // fired by touchend/mouseup
      // after X milliseconds, remove tap coordinates
      clearTimeout(clickPreventTimerId);
      clickPreventTimerId = setTimeout(function(){
        var tap = ionic.tap.isRecentTap(e);
        if(tap) delete tapCoordinates[tap.id];
      }, REMOVE_PREVENT_DELAY);
    },

    isRecentTap: function(event) {
      // loop through the tap coordinates and see if the same area has been tapped recently
      var tapId, existingCoordinates, currentCoordinates;

      for(tapId in tapCoordinates) {
        existingCoordinates = tapCoordinates[tapId];
        if(!currentCoordinates) currentCoordinates = ionic.tap.getCoordinates(event); // lazy load it when needed

        if(currentCoordinates.x > existingCoordinates.x - HIT_RADIUS &&
           currentCoordinates.x < existingCoordinates.x + HIT_RADIUS &&
           currentCoordinates.y > existingCoordinates.y - HIT_RADIUS &&
           currentCoordinates.y < existingCoordinates.y + HIT_RADIUS) {
          // the current tap coordinates are in the same area as a recent tap
          return existingCoordinates;
        }
      }
    },

    blurActive: function() {
      var ele = document.activeElement;
      if(ele && (ele.tagName === "INPUT" ||
                 ele.tagName === "TEXTAREA")) {
        // using a timeout to prevent funky scrolling while a keyboard hides
        setTimeout(function(){
          ele.blur();
        }, 400);
      }
    },

    setStart: function(e) {
      startCoordinates = ionic.tap.getCoordinates(e);
    },

    reset: function() {
      tapCoordinates = {};
      startCoordinates = {};
    }

  };

  function stopEvent(e){
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  ionic.Platform.ready(function(){
    if(ionic.Platform.grade === 'c') {
      // low performing devices should have a longer ghostclick prevent
      REMOVE_PREVENT_DELAY = REMOVE_PREVENT_DELAY_GRADE_C;
    }
  });

  // set click handler and check if the event should be stopped or not
  document.addEventListener('click', ionic.tap.preventGhostClick, true);

  // set release event listener for HTML elements that were tapped or held
  ionic.on("release", ionic.tap.tapInspect, document);

  // listeners used to clear out active taps which are used to prevention ghostclicks
  document.addEventListener('touchend', ionic.tap.removeClickPrevent, false);
  document.addEventListener('mouseup', ionic.tap.removeClickPrevent, false);

  // remember where the user first started touching the screen
  // so that if they scrolled, it shouldn't fire the click
  document.addEventListener('touchstart', ionic.tap.setStart, false);

})(this, document, ionic);
