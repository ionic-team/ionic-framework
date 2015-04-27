/* Forked from VelocityJS, MIT License: https://github.com/julianshapiro/velocity | Julian Shapiro http://twitter.com/shapiro */

import {Collide} from './collide'


export function animationStop(elements, action) {

  var customQueue = undefined;
  var elementsLength = elements.length;

  /******************
      Action: Stop
  *******************/

  /* Clear the currently-active delay on each targeted element. */
  for (var i = 0; i < elementsLength; i++) {
    var eleData = Collide.data(elements[i]);

    if (eleData && eleData.delayTimer) {
      /* Stop the timer from triggering its cached next() function. */
      clearTimeout(eleData.delayTimer.setTimeout);

      /* Manually call the next() function so that the subsequent queue items can progress. */
      if (eleData.delayTimer.next) {
        eleData.delayTimer.next();
      }

      delete eleData.delayTimer;
    }
  }


  var callsToStop = [];

  /* When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
     been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
     is stopped, the next item in its animation queue is immediately triggered. */
  /* An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the 'fx' queue)
     or a custom queue string can be passed in. */
  /* Note: The stop command runs prior to Collide's Queueing phase since its behavior is intended to take effect *immediately*,
     regardless of the element's current queue state. */

  /* Iterate through every active call. */
  for (var i = 0, callLength = Collide.State.calls.length; i < callLength; i++) {

    /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
    var activeCall = Collide.State.calls[i];
    if (activeCall) {

      /* Iterate through the active call's targeted elements. */
      var activeElements = activeCall[1];

      for (var j = 0, activeElementsLength = activeElements.length; j < activeElementsLength; j++) {
        /* If true was passed in as a secondary argument, clear absolutely all calls on this element. Otherwise, only
           clear calls associated with the relevant queue. */
        /* Call stopping logic works as follows:
           - customQueue === true --> stop current default queue calls (and queue:false calls), including remaining queued ones.
           - customQueue === undefined --> stop current queue:'' call and all queue:false calls.
           - customQueue === false --> stop only queue:false calls.
           - customQueue === 'custom' --> stop current queue:'custom' call, including remaining queued ones (there is no functionality to only clear the currently-running queue:'custom' call). */

        var queueName = (customQueue === undefined) ? '' : customQueue;
        if (queueName !== true && (activeCall[2].queue !== queueName) && !(customQueue === undefined && activeCall[2].queue === false)) {
          return true;
        }

        var activeElement = activeElements[j];

        /* Iterate through the calls targeted by the stop command. */
        for (var k = 0; k < elementsLength; k++) {
          var element = elements[k];

          /* Check that this call was applied to the target element. */
          if (element === activeElement) {

            /* Optionally clear the remaining queued calls. */
            if (customQueue === true || typeof customQueue === 'string') {

              /* Iterate through the items in the element's queue. */

              var eleQueueName = typeof customQueue === 'string' ? customQueue : '';
              var eleQueue = Collide.queue(element, eleQueueName);
              for (var l = 0; l < eleQueue.length; l++) {
                /* The queue array can contain an 'inprogress' string, which we skip. */
                if (typeof eleQueue[l] === 'function') {
                  /* Pass the item's callback a flag indicating that we want to abort from the queue call.
                     (Specifically, the queue will resolve the call's associated promise then abort.)  */
                  eleQueue[l](null, true);
                }
              }

              /* Clearing the queue() array is achieved by resetting it to []. */
              Collide.queue(element, eleQueueName, []);
            }

            if (action === 'stop') {
              /* Since 'reverse' uses cached start values (the previous call's endValues), these values must be
                 changed to reflect the final value that the elements were actually tweened to. */
              /* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
                 object. Also, queue:false animations can't be reversed. */
              var eleData = Collide.data(element);
              if (eleData && eleData.tweensContainer && queueName !== false) {
                for (var tweenName in eleData.tweensContainer) {
                  eleData.tweensContainer[tweenName].endValue = eleData.tweensContainer[tweenName].currentValue;
                }
              }

              callsToStop.push(i);

            } else if (action === 'finish') {
              /* To get active tweens to finish immediately, we forcefully shorten their durations to 1ms so that
              they finish upon the next rAf tick then proceed with normal call completion logic. */
              activeCall[2].duration = 1;
            }

          }

        }

      }

    }

  } // END: for (var i = 0, l = Collide.State.calls.length; x < l; x++) {

  /* Prematurely call completeCall() on each matched active call. Pass an additional flag for 'stop' to indicate
     that the complete callback and display:none setting should be skipped since we're completing prematurely. */
  if (action === 'stop') {
    for (var i = 0; i < callsToStop.length; i++) {
      completeCall(i, true);
    }
  }

};
