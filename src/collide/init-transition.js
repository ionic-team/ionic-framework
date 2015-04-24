/* Ported from Collide.js, MIT License. Julian Shapiro http://twitter.com/shapiro */

import {Collide} from 'ionic2/collide/collide'
import {Animator} from 'ionic2/collide/animator'


export function initTransition(action, elements, options, propertiesMap) {

  elements = elements && !elements.length ? [elements] : elements

  if (!elements) {
    return;
  }

  /* The length of the element set (in the form of a nodeList or an array of elements) is defaulted to 1 in case a
     single raw DOM element is passed in (which doesn't contain a length property). */
  var elementsLength = elements.length;
  var elementsIndex = 0;
  var eleData;


  /*********************
     Action Detection
  *********************/

  switch (action) {

    case 'stop':
      /******************
          Action: Stop
      *******************/

      /* Clear the currently-active delay on each targeted element. */
      for (var x = 0; x < elements.length; x++) {
        eleData = Collide.data(elements[x]);

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
      var activeCall;

      /* When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
         been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
         is stopped, the next item in its animation queue is immediately triggered. */
      /* An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the 'fx' queue)
         or a custom queue string can be passed in. */
      /* Note: The stop command runs prior to Collide's Queueing phase since its behavior is intended to take effect *immediately*,
         regardless of the element's current queue state. */

      /* Iterate through every active call. */
      for (var x = 0, callsLength = Animator.calls.length; x < callsLength; x++) {

        /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
        activeCall = Animator.calls[x];
        if (activeCall) {

          /* Iterate through the active call's targeted elements. */

          $.each(activeCall[1], function(k, activeElement) {
              /* If true was passed in as a secondary argument, clear absolutely all calls on this element. Otherwise, only
                 clear calls associated with the relevant queue. */
              /* Call stopping logic works as follows:
                 - options === true --> stop current default queue calls (and queue:false calls), including remaining queued ones.
                 - options === undefined --> stop current queue:'' call and all queue:false calls.
                 - options === false --> stop only queue:false calls.
                 - options === 'custom' --> stop current queue:'custom' call, including remaining queued ones (there is no functionality to only clear the currently-running queue:'custom' call). */
              var queueName = (options === undefined) ? '' : options;

              if (queueName !== true && (activeCall[2].queue !== queueName) && !(options === undefined && activeCall[2].queue === false)) {
                  return true;
              }

              /* Iterate through the calls targeted by the stop command. */
              $.each(elements, function(l, element) {
                  /* Check that this call was applied to the target element. */
                  if (element === activeElement) {
                      /* Optionally clear the remaining queued calls. */
                      if (options === true || Type.isString(options)) {
                          /* Iterate through the items in the element's queue. */
                          $.each($.queue(element, Type.isString(options) ? options : ''), function(_, item) {
                              /* The queue array can contain an 'inprogress' string, which we skip. */
                              if (Type.isFunction(item)) {
                                  /* Pass the item's callback a flag indicating that we want to abort from the queue call.
                                     (Specifically, the queue will resolve the call's associated promise then abort.)  */
                                  item(null, true);
                              }
                          });

                          /* Clearing the $.queue() array is achieved by resetting it to []. */
                          $.queue(element, Type.isString(options) ? options : '', []);
                      }

                      if (propertiesMap === 'stop') {
                          /* Since 'reverse' uses cached start values (the previous call's endValues), these values must be
                             changed to reflect the final value that the elements were actually tweened to. */
                          /* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
                             object. Also, queue:false animations can't be reversed. */
                          if (Data(element) && Data(element).tweensContainer && queueName !== false) {
                              $.each(Data(element).tweensContainer, function(m, activeTween) {
                                  activeTween.endValue = activeTween.currentValue;
                              });
                          }

                          callsToStop.push(i);
                      } else if (propertiesMap === 'finish') {
                          /* To get active tweens to finish immediately, we forcefully shorten their durations to 1ms so that
                          they finish upon the next rAf tick then proceed with normal call completion logic. */
                          activeCall[2].duration = 1;
                      }
                  }
              });
          });

        }

      } // END: for (var x = 0, l = Animator.calls.length; x < l; x++) {

      /* Prematurely call completeCall() on each matched active call. Pass an additional flag for 'stop' to indicate
         that the complete callback and display:none setting should be skipped since we're completing prematurely. */
      if (propertiesMap === 'stop') {
          $.each(callsToStop, function(i, j) {
              completeCall(j, true);
          });

          if (promiseData.promise) {
              /* Immediately resolve the promise associated with this stop call since stop runs synchronously. */
              promiseData.resolver(elements);
          }
      }

      /* Since we're stopping, and not proceeding with queueing, exit out of Collide. */
      return getChain();

    case 'start':
        /* Treat a non-empty plain object as a literal properties map. */
        if ($.isPlainObject(propertiesMap) && !Type.isEmptyObject(propertiesMap)) {
            action = 'start';

        /****************
            Redirects
        ****************/

        /* Check if a string matches a registered redirect (see Redirects above). */
        } else if (Type.isString(propertiesMap) && Collide.Redirects[propertiesMap]) {
            var opts = $.extend({}, options),
                durationOriginal = opts.duration,
                delayOriginal = opts.delay || 0;

            /* If the backwards option was passed in, reverse the element set so that elements animate from the last to the first. */
            if (opts.backwards === true) {
                elements = $.extend(true, [], elements).reverse();
            }

            /* Individually trigger the redirect for each element in the set to prevent users from having to handle iteration logic in their redirect. */
            $.each(elements, function(elementIndex, element) {
                /* If the stagger option was passed in, successively delay each element by the stagger value (in ms). Retain the original delay value. */
                if (parseFloat(opts.stagger)) {
                    opts.delay = delayOriginal + (parseFloat(opts.stagger) * elementIndex);
                } else if (Type.isFunction(opts.stagger)) {
                    opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elementsLength);
                }

                /* If the drag option was passed in, successively increase/decrease (depending on the presense of opts.backwards)
                   the duration of each element's animation, using floors to prevent producing very short durations. */
                if (opts.drag) {
                    /* Default the duration of UI pack effects (callouts and transitions) to 1000ms instead of the usual default duration of 400ms. */
                    opts.duration = parseFloat(durationOriginal) || (/^(callout|transition)/.test(propertiesMap) ? 1000 : DURATION_DEFAULT);

                    /* For each element, take the greater duration of: A) animation completion percentage relative to the original duration,
                       B) 75% of the original duration, or C) a 200ms fallback (in case duration is already set to a low value).
                       The end result is a baseline of 75% of the redirect's duration that increases/decreases as the end of the element set is approached. */
                    opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex/elementsLength : (elementIndex + 1) / elementsLength), opts.duration * 0.75, 200);
                }

                /* Pass in the call's opts object so that the redirect can optionally extend it. It defaults to an empty object instead of null to
                   reduce the opts checking logic required inside the redirect. */
                Collide.Redirects[propertiesMap].call(element, element, opts || {}, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
            });

            /* Since the animation logic resides within the redirect's own code, abort the remainder of this call.
               (The performance overhead up to this point is virtually non-existant.) */
            /* Note: The jQuery call chain is kept intact by returning the complete element set. */
            return getChain();
        } else {
            var abortError = 'Collide: First argument (' + propertiesMap + ') was not a property map, a known action, or a registered redirect. Aborting.';

            if (promiseData.promise) {
                promiseData.rejecter(new Error(abortError));
            } else {
                console.log(abortError);
            }

            return getChain();
        }
  }

  /**************************
      Call-Wide Variables
  **************************/

  /* A container for CSS unit conversion ratios (e.g. %, rem, and em ==> px) that is used to cache ratios across all elements
     being animated in a single Collide call. Calculating unit ratios necessitates DOM querying and updating, and is therefore
     avoided (via caching) wherever possible. This container is call-wide instead of page-wide to avoid the risk of using stale
     conversion metrics across Collide animations that are not immediately consecutively chained. */
  var callUnitConversionData = {
          lastParent: null,
          lastPosition: null,
          lastFontSize: null,
          lastPercentToPxWidth: null,
          lastPercentToPxHeight: null,
          lastEmToPx: null,
          remToPx: null,
          vwToPx: null,
          vhToPx: null
      };

  /* A container for all the ensuing tween data and metadata associated with this call. This container gets pushed to the page-wide
     Collide.State.calls array that is processed during animation ticking. */
  var call = [];

};
