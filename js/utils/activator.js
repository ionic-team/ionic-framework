(function(document, ionic) {
  'use strict';

  var queueElements = {};   // elements that should get an active state in XX milliseconds
  var activeElements = {};  // elements that are currently active
  var keyId = 0;            // a counter for unique keys for the above ojects
  var ACTIVATED_CLASS = 'activated';

  ionic.activator = {

    start: function(e) {
      // when an element is touched/clicked, it climbs up a few
      // parents to see if it is an .item or .button element
      ionic.requestAnimationFrame(function(){
        var ele = e.target;
        var eleToActivate;

        for(var x=0; x<4; x++) {
          if(!ele) break;
          if(eleToActivate && ele.classList.contains('item')) {
            eleToActivate = ele;
            break;
          }
          if( ele.tagName == 'A' || ele.tagName == 'BUTTON' || ele.getAttribute('ng-click') ) {
            eleToActivate = ele;
          }
          if( ele.classList.contains('button') ) {
            eleToActivate = ele;
            break;
          }
          ele = ele.parentElement;
        }

        if(eleToActivate) {
          // queue that this element should be set to active
          queueElements[keyId] = eleToActivate;

          // in XX milliseconds, set the queued elements to active
          // add listeners to clear all queued/active elements onMove
          if(e.type === 'touchstart') {
            document.body.removeEventListener('mousedown', ionic.activator.start);
            document.body.addEventListener('touchmove', clear, false);
            setTimeout(activateElements, 85);
          } else {
            document.body.addEventListener('mousemove', clear, false);
            ionic.requestAnimationFrame(activateElements);
          }

          keyId = (keyId > 19 ? 0 : keyId + 1);
        }

      });
    }
  };

  function activateElements() {
    // activate all elements in the queue
    for(var key in queueElements) {
      if(queueElements[key]) {
        queueElements[key].classList.add(ACTIVATED_CLASS);
        activeElements[key] = queueElements[key];
      }
    }
    queueElements = {};
  }

  function deactivateElements() {
    for(var key in activeElements) {
      if(activeElements[key]) {
        activeElements[key].classList.remove(ACTIVATED_CLASS);
        delete activeElements[key];
      }
    }
  }

  function onEnd(e) {
    // clear out any active/queued elements after XX milliseconds
    setTimeout(clear, 200);
  }

  function clear() {
    // clear out any elements that are queued to be set to active
    queueElements = {};

    // in the next frame, remove the active class from all active elements
    ionic.requestAnimationFrame(deactivateElements);

    // remove onMove listeners that clear out active elements
    document.body.removeEventListener('mousemove', clear);
    document.body.removeEventListener('touchmove', clear);
  }

  // use window.onload because this doesn't need to run immediately
  window.addEventListener('load', function(){
    // start an active element
    document.body.addEventListener('touchstart', ionic.activator.start, false);
    document.body.addEventListener('mousedown', ionic.activator.start, false);

    // clear all active elements after XX milliseconds
    document.body.addEventListener('touchend', onEnd, false);
    document.body.addEventListener('mouseup', onEnd, false);
    document.body.addEventListener('touchcancel', onEnd, false);
  }, false);

})(document, ionic);
