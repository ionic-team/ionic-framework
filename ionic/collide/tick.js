/* Forked from Collide.js, MIT License. Julian Shapiro http://twitter.com/shapiro */

import {dom} from 'ionic/util'
import {Collide} from './collide'
import {CSS} from './css'
import {completeCall} from './complete-call'


/************
    Tick
************/

export function startTick() {
  if (!Collide.State.isTicking && Collide.State.calls && Collide.State.calls.length) {
    Collide.State.isTicking = true;
    tick();
  }
}

/* Note: All calls to Collide are pushed to the Collide.State.calls array, which is fully iterated through upon each tick. */
function tick(timestamp) {
  /* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
     We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
     the browser's next tick sync time occurs, which results in the first elements subjected to Collide
     calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
     the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
     by the same Collide call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
  if (timestamp) {
    /* We ignore RAF's high resolution timestamp since it can be significantly offset when the browser is
       under high stress; we opt for choppiness over allowing the browser to drop huge chunks of frames. */
    var timeCurrent = (new Date).getTime();


    /********************
       Call Iteration
    ********************/

    var callsLength = Collide.State.calls.length;

    /* To speed up iterating over this array, it is compacted (falsey items -- calls that have completed -- are removed)
       when its length has ballooned to a point that can impact tick performance. This only becomes necessary when animation
       has been continuous with many elements over a long period of time; whenever all active calls are completed, completeCall() clears Collide.State.calls. */
    if (callsLength > 10000) {
      Collide.State.calls = compactSparseArray(Collide.State.calls);
    }

    /* Iterate through each active call. */
    for (var i = 0; i < callsLength; i++) {

      /* When a Collide call is completed, its Collide.State.calls entry is set to false. Continue on to the next call. */
      if (!Collide.State.calls[i]) {
        continue;
      }


      /************************
         Call-Wide Variables
      ************************/

      var callContainer = Collide.State.calls[i],
          call = callContainer[0],
          opts = callContainer[2],
          timeStart = callContainer[3],
          firstTick = !!timeStart,
          tweenDummyValue = null;

      /* If timeStart is undefined, then this is the first time that this call has been processed by tick().
         We assign timeStart now so that its value is as close to the real animation start time as possible.
         (Conversely, had timeStart been defined when this call was added to Collide.State.calls, the delay
         between that time and now would cause the first few frames of the tween to be skipped since
         percentComplete is calculated relative to timeStart.) */
      /* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the
         first tick iteration isn't wasted by animating at 0% tween completion, which would produce the
         same style value as the element's current value. */
      if (!timeStart) {
        timeStart = Collide.State.calls[i][3] = timeCurrent - 16;
      }

      /* The tween's completion percentage is relative to the tween's start time, not the tween's start value
         (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
         Accordingly, we ensure that percentComplete does not exceed 1. */
      var percentComplete = Math.min((timeCurrent - timeStart) / opts.duration, 1);


      /**********************
         Element Iteration
      **********************/

      /* For every call, iterate through each of the elements in its set. */
      for (var j = 0, callLength = call.length; j < callLength; j++) {
        var tweensContainer = call[j],
            element = tweensContainer.element;

        /* Check to see if this element has been deleted midway through the animation by checking for the
           continued existence of its data cache. If it's gone, skip animating this element. */
        if (!Collide.data(element)) {
          continue;
        }

        var transformPropertyExists = false;


        /**********************************
           Display & Visibility Toggling
        **********************************/

        /* If the display option is set to non-'none', set it upfront so that the element can become visible before tweening begins.
           (Otherwise, display's 'none' value is set in completeCall() once the animation has completed.) */
        if (opts.display !== undefined && opts.display !== null && opts.display !== 'none') {
          if (opts.display === 'flex') {
            var flexValues = [ '-webkit-box', '-moz-box', '-ms-flexbox', '-webkit-flex' ];

            for (var f = 0; f < flexValues.length; f++) {
              CSS.setPropertyValue(element, 'display', flexValues[f]);
            }
          }

          CSS.setPropertyValue(element, 'display', opts.display);
        }

        /* Same goes with the visibility option, but its 'none' equivalent is 'hidden'. */
        if (opts.visibility !== undefined && opts.visibility !== 'hidden') {
          CSS.setPropertyValue(element, 'visibility', opts.visibility);
        }


        /************************
           Property Iteration
        ************************/

        /* For every element, iterate through each property. */
        for (var property in tweensContainer) {

          /* Note: In addition to property tween data, tweensContainer contains a reference to its associated element. */
          if (property !== 'element') {
            var tween = tweensContainer[property],
                currentValue,
                /* Easing can either be a pre-genereated function or a string that references a pre-registered easing
                   on the Collide.Easings object. In either case, return the appropriate easing *function*. */
                easing = typeof tween.easing === 'string' ? Collide.Easings[tween.easing] : tween.easing;

            /******************************
               Current Value Calculation
            ******************************/

            /* If this is the last tick pass (if we've reached 100% completion for this tween),
               ensure that currentValue is explicitly set to its target endValue so that it's not subjected to any rounding. */
            if (percentComplete === 1) {
                currentValue = tween.endValue;

            /* Otherwise, calculate currentValue based on the current delta from startValue. */
            } else {
              var tweenDelta = tween.endValue - tween.startValue;
              currentValue = tween.startValue + (tweenDelta * easing(percentComplete, opts, tweenDelta));

              /* If no value change is occurring, don't proceed with DOM updating. */
              if (!firstTick && (currentValue === tween.currentValue)) {
                continue;
              }
            }

            tween.currentValue = currentValue;

            /* If we're tweening a fake 'tween' property in order to log transition values, update the one-per-call variable so that
               it can be passed into the progress callback. */
            if (property === 'tween') {
              tweenDummyValue = currentValue;

            } else {

              /******************
                 Hooks: Part I
              ******************/

              /* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used
                 for subsequent hooks in this call that are associated with the same root property. If we didn't cache the updated
                 rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's
                 updates to rootPropertyValue prior to injection. A nice performance byproduct of rootPropertyValue caching is that
                 subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
              if (CSS.Hooks.registered[property]) {
                var hookRoot = CSS.Hooks.getRoot(property),
                    rootPropertyValueCache = Collide.data(element).rootPropertyValueCache[hookRoot];

                if (rootPropertyValueCache) {
                  tween.rootPropertyValue = rootPropertyValueCache;
                }
              }


              /*****************
                  DOM Update
              *****************/

              /* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
              /* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
              var adjustedSetData = CSS.setPropertyValue(element, /* SET */
                                                         property,
                                                         tween.currentValue + (parseFloat(currentValue) === 0 ? '' : tween.unitType),
                                                         tween.rootPropertyValue,
                                                         tween.scrollData);


              /*******************
                 Hooks: Part II
              *******************/

              /* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
              if (CSS.Hooks.registered[property]) {
                /* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
                if (CSS.Normalizations.registered[hookRoot]) {
                  Collide.data(element).rootPropertyValueCache[hookRoot] = CSS.Normalizations.registered[hookRoot]('extract', null, adjustedSetData[1]);
                } else {
                  Collide.data(element).rootPropertyValueCache[hookRoot] = adjustedSetData[1];
                }
              }

              /***************
                 Transforms
              ***************/

              /* Flag whether a transform property is being animated so that flushTransformCache() can be triggered once this tick pass is complete. */
              if (adjustedSetData[0] === 'transform') {
                transformPropertyExists = true;
              }

            }

          } // END: if (property !== 'element')

        } // END: for (var property in tweensContainer)

        if (transformPropertyExists) {
          CSS.flushTransformCache(element);
        }

      } // END: for (var j = 0, callLength = call.length; j < callLength; j++)


      /* The non-'none' display value is only applied to an element once -- when its associated call is first ticked through.
         Accordingly, it's set to false so that it isn't re-processed by this call in the next tick. */
      if (opts.display !== undefined && opts.display !== 'none') {
        Collide.State.calls[i][2].display = false;
      }
      if (opts.visibility !== undefined && opts.visibility !== 'hidden') {
        Collide.State.calls[i][2].visibility = false;
      }

      /* Pass the elements and the timing data (percentComplete, msRemaining, timeStart, tweenDummyValue) into the progress callback. */
      if (opts.progress) {
        opts.progress.call(callContainer[1],
                           callContainer[1],
                           percentComplete,
                           Math.max(0, (timeStart + opts.duration) - timeCurrent),
                           timeStart,
                           tweenDummyValue);
      }

      /* If this call has finished tweening, pass its index to completeCall() to handle call cleanup. */
      if (percentComplete === 1) {
        completeCall(i);
      }

    } // END: for (var i = 0; i < callsLength; i++)

  } // END: if (timestamp)

  /* Note: completeCall() sets the isTicking flag to false when the last call on Collide.State.calls has completed. */
  if (Collide.State.isTicking) {
    dom.raf(tick);
  }

};
