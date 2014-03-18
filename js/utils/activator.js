(function(document, ionic) {
  'use strict';

  var queueElements = {};   // elements that should get an active state in XX milliseconds
  var activeElements = {};  // elements that are currently active
  var keyId = 0;            // a counter for unique keys for the above ojects

  function onStart(e) {
    // when an element is touched/clicked, it climbs up a few
    // parents to see if it is an .item or .button element

    ionic.requestAnimationFrame(function(){
      var x, ele = e.target;
      for(x=0; x<5; x++) {
        if(!ele || ele.tagName === 'LABEL') break;
        if( ele.classList.contains('item') || ele.classList.contains('button') ) {

          // queue that this element should be set to active
          queueElements[keyId] = ele;

          // in XX milliseconds, set the queued elements to active
          setTimeout(activateElements, 60);

          // add listeners to clear all queued/active elements onMove
          document.body.addEventListener('mousemove', clear, false);
          document.body.addEventListener('touchmove', clear, false);

          keyId = (keyId > 19 ? 0 : keyId + 1);
          break;
        }
        ele = ele.parentElement;
      }
    });
  }

  function activateElements() {
    // activate all elements in the queue
    for(var key in queueElements) {
      if(queueElements[key]) {
        queueElements[key].classList.add('active');
        activeElements[key] = queueElements[key];
      }
    }
    queueElements = {};
  }

  function onEnd(e) {
    // clear out any active/queued elements after XX milliseconds
    setTimeout(clear, 200);
  }

  function clear() {
    // clear out any elements that are queued to be set to active
    queueElements = {};

    // in the next frame, remove the active class from all active elements
    ionic.requestAnimationFrame(function(){
      for(var key in activeElements) {
        if(activeElements[key]) {
          activeElements[key].classList.remove('active');
          delete activeElements[key];
        }
      }
    });

    // remove onMove listeners that clear out active elements
    document.body.removeEventListener('mousemove', clear);
    document.body.removeEventListener('touchmove', clear);
  }

  // use window.onload because this doesn't need to run immediately
  window.addEventListener('load', function(){
    // start an active element
    document.body.addEventListener('touchstart', onStart, false);
    document.body.addEventListener('mousedown', onStart, false);

    // clear all active elements after XX milliseconds
    document.body.addEventListener('touchend', onEnd, false);
    document.body.addEventListener('mouseup', onEnd, false);
    document.body.addEventListener('touchcancel', onEnd, false);
  }, false);

})(document, ionic);
