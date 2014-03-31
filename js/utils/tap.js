(function(window, document, ionic) {
  'use strict';

  // polyfill use to simulate native "tap"
  ionic.tapElement = function(target, e) {
    // simulate a normal click by running the element's click method then focus on it

    var ele = target.control || target;

    if(ele.disabled || ele.type === 'file' || ele.type === 'range') return;

    console.debug('tapElement', ele.tagName, ele.className);

    var c = getCoordinates(e);

    // using initMouseEvent instead of MouseEvent for our Android friends
    var clickEvent = document.createEvent("MouseEvents");
    clickEvent.initMouseEvent('click', true, true, window,
                              1, 0, 0, c.x, c.y,
                              false, false, false, false, 0, null);

    ele.dispatchEvent(clickEvent);

    if(ele.tagName === 'INPUT' || ele.tagName === 'TEXTAREA') {
      ele.focus();
      e.preventDefault();
    } else {
      blurActive();
    }

    // remember the coordinates of this tap so if it happens again we can ignore it
    // but only if the coordinates are not already being actively disabled
    if( !isRecentTap(e) ) {
      recordCoordinates(e);
    }

    if(target.control) {
      console.debug('tapElement, target.control, stop');
      return stopEvent(e);
    }
  };

  function tapPolyfill(orgEvent) {
    // if the source event wasn't from a touch event then don't use this polyfill
    if(!orgEvent.gesture || !orgEvent.gesture.srcEvent) return;

    var e = orgEvent.gesture.srcEvent; // evaluate the actual source event, not the created event by gestures.js
    var ele = e.target;

    if( isRecentTap(e) ) {
      // if a tap in the same area just happened, don't continue
      console.debug('tapPolyfill', 'isRecentTap', ele.tagName);
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

        return ionic.tapElement(ele, e);
      }
      ele = ele.parentElement;
    }

    // they didn't tap one of the above elements
    // if the currently active element is an input, and they tapped outside
    // of the current input, then unset its focus (blur) so the keyboard goes away
    blurActive();
  }

  function preventGhostClick(e) {

    console.debug((function(){
      // Great for debugging, and thankfully this gets removed from the build, OMG it's ugly

      if(e.target.control) {
        // this is a label that has an associated input
        // the native layer will send the actual event, so stop this one
        console.debug('preventGhostClick', 'label');

      } else if(isRecentTap(e)) {
        // a tap has already happened at these coordinates recently, ignore this event
        console.debug('preventGhostClick', 'isRecentTap', e.target.tagName);

      } else if(isScrolledSinceStart(e)) {
        // this click's coordinates are different than its touchstart/mousedown, must have been scrolling
        console.debug('preventGhostClick', 'isScrolledSinceStart, startCoordinates, x:' + startCoordinates.x + ' y:' + startCoordinates.y);
      }

      var c = getCoordinates(e);
      return 'click at x:' + c.x + ', y:' + c.y;
    })());


    if(e.target.control || isRecentTap(e) || isScrolledSinceStart(e)) {
      return stopEvent(e);
    }

    // remember the coordinates of this click so if a tap or click in the
    // same area quickly happened again we can ignore it
    recordCoordinates(e);
  }

  function isRecentTap(event) {
    // loop through the tap coordinates and see if the same area has been tapped recently
    var tapId, existingCoordinates, currentCoordinates;

    for(tapId in tapCoordinates) {
      existingCoordinates = tapCoordinates[tapId];
      if(!currentCoordinates) currentCoordinates = getCoordinates(event); // lazy load it when needed

      if(currentCoordinates.x > existingCoordinates.x - HIT_RADIUS &&
         currentCoordinates.x < existingCoordinates.x + HIT_RADIUS &&
         currentCoordinates.y > existingCoordinates.y - HIT_RADIUS &&
         currentCoordinates.y < existingCoordinates.y + HIT_RADIUS) {
        // the current tap coordinates are in the same area as a recent tap
        return existingCoordinates;
      }
    }
  }

  function isScrolledSinceStart(event) {
    // check if this click's coordinates are different than its touchstart/mousedown
    var c = getCoordinates(event);

    // Quick check for 0,0 which could be simulated mouse click for form submission
    if(c.x === 0 && c.y === 0) {
      return false;
    }

    return (c.x > startCoordinates.x + HIT_RADIUS ||
            c.x < startCoordinates.x - HIT_RADIUS ||
            c.y > startCoordinates.y + HIT_RADIUS ||
            c.y < startCoordinates.y - HIT_RADIUS);
  }

  function recordCoordinates(event) {
    var c = getCoordinates(event);
    if(c.x && c.y) {
      var tapId = Date.now();

      // only record tap coordinates if we have valid ones
      tapCoordinates[tapId] = { x: c.x, y: c.y, id: tapId };

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

      if(e) return { x: e.clientX || e.pageX, y: e.clientY || e.pageY };
    }
    return { x:0, y:0 };
  }

  var clickPreventTimerId;
  function removeClickPrevent(e) {
    clearTimeout(clickPreventTimerId);
    clickPreventTimerId = setTimeout(function(){
      var tap = isRecentTap(e);
      if(tap) delete tapCoordinates[tap.id];
      startCoordinates = {};
    }, REMOVE_PREVENT_DELAY);
  }

  function stopEvent(e){
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  function blurActive() {
    var ele = document.activeElement;
    if(ele && (ele.tagName === "INPUT" ||
               ele.tagName === "TEXTAREA")) {
      // using a timeout to prevent funky scrolling while a keyboard hides
      setTimeout(function(){
        ele.blur();
      }, 400);
    }
  }

  function recordStartCoordinates(e) {
    startCoordinates = getCoordinates(e);
  }

  var tapCoordinates = {}; // used to remember coordinates to ignore if they happen again quickly
  var startCoordinates = {}; // used to remember where the coordinates of the start of the tap
  var CLICK_PREVENT_DURATION = 1500; // max milliseconds ghostclicks in the same area should be prevented
  var REMOVE_PREVENT_DELAY = 380; // delay after a touchend/mouseup before removing the ghostclick prevent
  var HIT_RADIUS = 15;

  ionic.Platform.ready(function(){

    if(ionic.Platform.grade === 'c') {
      // low performing phones should have a longer ghostclick prevent
      REMOVE_PREVENT_DELAY = 800;
    }

    // set global click handler and check if the event should stop or not
    document.addEventListener('click', preventGhostClick, true);

    // global release event listener polyfill for HTML elements that were tapped or held
    ionic.on("release", tapPolyfill, document);

    // listeners used to remove ghostclick prevention
    document.addEventListener('touchend', removeClickPrevent, false);
    document.addEventListener('mouseup', removeClickPrevent, false);

    // in the case the user touched the screen, then scrolled, it shouldn't fire the click
    document.addEventListener('touchstart', recordStartCoordinates, false);
    document.addEventListener('mousedown', recordStartCoordinates, false);
  });

})(this, document, ionic);
