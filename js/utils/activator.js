(function(document, ionic) {
  'use strict';

  var queueElements = {};   // elements that should get an active state in XX milliseconds
  var activeElements = {};  // elements that are currently active
  var keyId = 0;            // a counter for unique keys for the above ojects

  function onStart(e) {
    // when an element is touched/clicked, it climbs up a few
    // parents to see if it is an .item or .button element
    var x, ele = e.target;

    ionic.requestAnimationFrame(function(){
      for(x=0; x<5; x++) {
        if(!ele || ele.tagName === 'LABEL') break;
        if( ele.classList.contains('item') || ele.classList.contains('button') ) {
          keyId = (keyId > 99 ? 0 : keyId + 1);

          // queue that this element should be set to active
          queueElements[keyId] = ele;
          setTimeout(activateElements, 32);
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
    // clear out any active/queued elements immediately
    queueElements = {};
    for(var key in activeElements) {
      activeElements[key] && activeElements[key].classList.remove('active');
      delete activeElements[key];
    }
  }

  // use window.onload because this doesn't need to run immediately
  window.addEventListener('load', function(){
    // start an active element
    document.body.addEventListener('touchstart', onStart, false);
    document.body.addEventListener('mousedown', onStart, false);

    // clear all active elements after XX milliseconds
    document.body.addEventListener('touchend', onEnd, false);
    document.body.addEventListener('mouseup', onEnd, false);

    // clear all active immediately
    document.body.addEventListener('mousemove', clear, false);
    document.body.addEventListener('touchmove', clear, false);
    document.body.addEventListener('touchcancel', clear, false);
  }, false);

})(document, ionic);
