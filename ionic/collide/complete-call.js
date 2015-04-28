/* Forked from VelocityJS, MIT License: https://github.com/julianshapiro/velocity | Julian Shapiro http://twitter.com/shapiro */

import {Collide} from './collide'
import {CSS} from './css'


/***************************
   Call Completion
***************************/

/* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
export function completeCall(callIndex, isStopped) {

  /* Ensure the call exists. */
  if (!Collide.State.calls[callIndex]) {
    return false;
  }

  /* Pull the metadata from the call. */
  var call = Collide.State.calls[callIndex][0],
      elements = Collide.State.calls[callIndex][1],
      opts = Collide.State.calls[callIndex][2],
      resolve = Collide.State.calls[callIndex][4];

  var remainingCallsExist = false;


  /*************************
     Element Finalization
  *************************/

  for (var i = 0, callLength = call.length; i < callLength; i++) {
    var element = call[i].element;
    var eleData = Collide.data(element);

    /* If the user set display to 'none' (intending to hide the element), set it now that the animation has completed. */
    /* Note: display:none isn't set when calls are manually stopped (via Collide('stop'). */
    /* Note: Display gets ignored with 'reverse' calls and infinite loops, since this behavior would be undesirable. */
    if (!isStopped && !opts.loop) {
      if (opts.display === 'none') {
        CSS.setPropertyValue(element, 'display', opts.display);
      }

      if (opts.visibility === 'hidden') {
        CSS.setPropertyValue(element, 'visibility', opts.visibility);
      }
    }

    /* If the element's queue is empty (if only the 'inprogress' item is left at position 0) or if its queue is about to run
       a non-Collide-initiated entry, turn off the isAnimating flag. A non-Collide-initiatied queue entry's logic might alter
       an element's CSS values and thereby cause Collide's cached value data to go stale. To detect if a queue entry was initiated by Collide,
       we check for the existence of our special Collide.queueEntryFlag declaration, which minifiers won't rename since the flag
       is assigned to's global object and thus exists out of Collide's own scope. */
    if (opts.loop !== true && (Collide.queue(element)[1] === undefined || !/\.collideQueueEntryFlag/i.test(Collide.queue(element)[1]))) {
      /* The element may have been deleted. Ensure that its data cache still exists before acting on it. */

      if (eleData) {
        eleData.isAnimating = false;

        /* Clear the element's rootPropertyValueCache, which will become stale. */
        eleData.rootPropertyValueCache = {};

        /* If any 3D transform subproperty is at its default value (regardless of unit type), remove it. */
        for (var j = 0, jj = CSS.Lists.transforms3D.length; j < jj; j++) {
          var transformName = CSS.Lists.transforms3D[j];
          var defaultValue = /^scale/.test(transformName) ? 1 : 0;
          var currentValue = eleData.transformCache[transformName];

          if (currentValue !== undefined && new RegExp('^\\(' + defaultValue + '[^.]').test(currentValue)) {
            delete eleData.transformCache[transformName];
          }
        }

        /* Flush the subproperty removals to the DOM. */
        CSS.flushTransformCache(element);
      }
    }


    /*********************
       Option: Complete
    *********************/

    /* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
    /* Note: Callbacks aren't fired when calls are manually stopped (via Collide('stop'). */
    if (!isStopped && opts.complete && !opts.loop && (i === callLength - 1)) {
      /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Collide itself. */
      try {
        opts.complete.call(elements, elements);
      } catch (error) {
        setTimeout(function() { throw error; });
      }
    }


    /**********************
       Promise Resolving
    **********************/

    /* Note: Infinite loops don't return promises. */
    if (resolve && opts.loop !== true) {
      resolve(elements);
    }


    /****************************
       Option: Loop (Infinite)
    ****************************/

    if (eleData && opts.loop === true && !isStopped) {
      /* If a rotateX/Y/Z property is being animated to 360 deg with loop:true, swap tween start/end values to enable
         continuous iterative rotation looping. (Otherise, the element would just rotate back and forth.) */

      for (var propertyName in eleData.tweensContainer) {
        var tweenContainer = eleData.tweensContainer[propertyName]

        if (/^rotate/.test(propertyName) && parseFloat(tweenContainer.endValue) === 360) {
          tweenContainer.endValue = 0;
          tweenContainer.startValue = 360;
        }

        if (/^backgroundPosition/.test(propertyName) && parseFloat(tweenContainer.endValue) === 100 && tweenContainer.unitType === '%') {
          tweenContainer.endValue = 0;
          tweenContainer.startValue = 100;
        }
      }

      //TODO!!! FIXME!!!
      //Collide(element, 'reverse', { loop: true, delay: opts.delay });
    }


    /***************
       Dequeueing
    ***************/

    /* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
       which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
       Collide.dequeue() must still be called in order to completely clear animation queue. */
    if (opts.queue !== false) {
      Collide.dequeue(element, opts.queue);
    }

  } // END: for (var i = 0, callLength = call.length; i < callLength; i++)


  /***********************
     Calls Array Cleanup
  ************************/

  /* Since this call is complete, set it to false so that the rAF tick skips it. This array is later compacted via compactSparseArray().
    (For performance reasons, the call is set to false instead of being deleted from the array: http://www.html5rocks.com/en/tutorials/speed/v8/) */
  Collide.State.calls[callIndex] = false;

  /* Iterate through the calls array to determine if this was the final in-progress animation.
     If so, set a flag to end ticking and clear the calls array. */
  for (var j = 0, jj = Collide.State.calls.length; j < jj; j++) {
    if (Collide.State.calls[j] !== false) {
      remainingCallsExist = true;
      break;
    }
  }

  if (remainingCallsExist === false) {
    /* tick() will detect this flag upon its next iteration and subsequently turn itself off. */
    Collide.State.isTicking = false;

    /* Clear the calls array so that its length is reset. */
    delete Collide.State.calls;
    Collide.State.calls = [];
  }
}
