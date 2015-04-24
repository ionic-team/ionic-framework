import {raf} from 'ionic2/util/dom'



class GlobalAnimator {

  constructor() {
    console.log('Animator instance', Math.random())

    this.isTicking = false
    this.calls = []
  }

  run(animation) {
    animation.timeStart = null;
    this.calls.push(animation);

    if (!this.isTicking) {
      this.tick()
    }
  }

  /* Note: All calls to Animator are pushed to the this.calls array, which is fully iterated through upon each tick. */
  tick (timestamp) {
    console.log('tick', timestamp)

    /* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
       We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
       the browser's next tick sync time occurs, which results in the first elements subjected to Animator
       calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
       the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
       by the same Animator call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
    if (timestamp) {
        /* We ignore RAF's high resolution timestamp since it can be significantly offset when the browser is
           under high stress; we opt for choppiness over allowing the browser to drop huge chunks of frames. */
        var timeCurrent = (new Date).getTime();

        /********************
           Call Iteration
        ********************/

        var callsLength = this.calls.length;

        /* To speed up iterating over this array, it is compacted (falsey items -- calls that have completed -- are removed)
           when its length has ballooned to a point that can impact tick performance. This only becomes necessary when animation
           has been continuous with many elements over a long period of time; whenever all active calls are completed, completeCall() clears this.calls. */
        if (callsLength > 10000) {
          this.calls = compactSparseArray(this.calls);
        }

        /* Iterate through each active call. */
        for (var i = 0; i < callsLength; i++) {
            /* When a Animator call is completed, its this.calls entry is set to false. Continue on to the next call. */
            if (!this.calls[i]) {
              continue;
            }

            /************************
               Call-Wide Variables
            ************************/

            var animation = this.calls[i];
            var timeStart = animation.timeStart;
            var firstTick = !!timeStart;
            var opts = animation.options();

            /* If timeStart is undefined, then this is the first time that this call has been processed by tick().
               We assign timeStart now so that its value is as close to the real animation start time as possible.
               (Conversely, had timeStart been defined when this call was added to this.calls, the delay
               between that time and now would cause the first few frames of the tween to be skipped since
               percentComplete is calculated relative to timeStart.) */
            /* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the
               first tick iteration isn't wasted by animating at 0% tween completion, which would produce the
               same style value as the element's current value. */
            if (!timeStart) {
              timeStart = timeCurrent - 16;
            }

            /* The tween's completion percentage is relative to the tween's start time, not the tween's start value
               (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
               Accordingly, we ensure that percentComplete does not exceed 1. */
            var percentComplete = Math.min((timeCurrent - timeStart) / opts.duration, 1);


            /**********************
               Element Iteration
            **********************/

            for (var j = 0, elementCount = animation.elements.length; j < elementCount; j++) {
              var element = animation.elements[j];

              /* Check to see if this element has been deleted midway through the animation */
              if (!element.parent) {
                continue;
              }

              var transformPropertyExists = false;


              /**********************************
                 Display & Visibility Toggling
              **********************************/

              /* If the display option is set to non-"none", set it upfront so that the element can become visible before tweening begins.
                 (Otherwise, display's "none" value is set in completeCall() once the animation has completed.) */
              if (opts.display !== undefined && opts.display !== null && opts.display !== "none") {
                if (opts.display === "flex") {

                  for (var x = 0; x < flexValues.length; x++) {
                    setPropertyValue(element, "display", flexValues[x]);
                  }
                }

                setPropertyValue(element, "display", opts.display);
              }

              /* Same goes with the visibility option, but its "none" equivalent is "hidden". */
              if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                setPropertyValue(element, "visibility", opts.visibility);
              }


              /************************
                 Property Iteration
              ************************/

              /* For every element, iterate through each property. */
              for (var property in tweensContainer) {
                  /* Note: In addition to property tween data, tweensContainer contains a reference to its associated element. */
                  if (property !== "element") {
                      var tween = tweensContainer[property],
                          currentValue,
                          /* Easing can either be a pre-genereated function or a string that references a pre-registered easing
                             on the Animator.Easings object. In either case, return the appropriate easing *function*. */
                          easing = Type.isString(tween.easing) ? Animator.Easings[tween.easing] : tween.easing;

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
                      if (property === "tween") {
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
                                  rootPropertyValueCache = Data(element).rootPropertyValueCache[hookRoot];

                              if (rootPropertyValueCache) {
                                  tween.rootPropertyValue = rootPropertyValueCache;
                              }
                          }

                          /*****************
                              DOM Update
                          *****************/

                          /* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
                          /* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
                          var adjustedSetData = setPropertyValue(element, /* SET */
                                                                     property,
                                                                     tween.currentValue + (parseFloat(currentValue) === 0 ? "" : tween.unitType),
                                                                     tween.rootPropertyValue,
                                                                     tween.scrollData);

                          /*******************
                             Hooks: Part II
                          *******************/

                          /* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
                          if (CSS.Hooks.registered[property]) {
                              /* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
                              if (CSS.Normalizations.registered[hookRoot]) {
                                  Data(element).rootPropertyValueCache[hookRoot] = CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
                              } else {
                                  Data(element).rootPropertyValueCache[hookRoot] = adjustedSetData[1];
                              }
                          }

                          /***************
                             Transforms
                          ***************/

                          /* Flag whether a transform property is being animated so that flushTransformCache() can be triggered once this tick pass is complete. */
                          if (adjustedSetData[0] === "transform") {
                              transformPropertyExists = true;
                          }

                      }
                  }
              }

              /****************
                  mobileHA
              ****************/

              /* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration.
                 It's safe to override this property since Animator doesn't actually support its animation (hooks are used in its place). */
              if (opts.mobileHA) {
                  /* Don't set the null transform hack if we've already done so. */
                  if (Data(element).transformCache.translate3d === undefined) {
                      /* All entries on the transformCache object are later concatenated into a single transform string via flushTransformCache(). */
                      Data(element).transformCache.translate3d = "(0px, 0px, 0px)";

                      transformPropertyExists = true;
                  }
              }

              if (transformPropertyExists) {
                  CSS.flushTransformCache(element);
              }
          }

          /* The non-"none" display value is only applied to an element once -- when its associated call is first ticked through.
             Accordingly, it's set to false so that it isn't re-processed by this call in the next tick. */
          if (opts.display !== undefined && opts.display !== "none") {
              this.calls[i][2].display = false;
          }
          if (opts.visibility !== undefined && opts.visibility !== "hidden") {
              this.calls[i][2].visibility = false;
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
        }
    }

    /* Note: completeCall() sets the isTicking flag to false when the last call on this.calls has completed. */
    if (this.isTicking) {
      raf(tick);
    }

  }

}


const flexValues = [ "-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex" ];


/* Array compacting. Copyright Lo-Dash. MIT License: https://github.com/lodash/lodash/blob/master/LICENSE.txt */
function compactSparseArray (array) {
    var index = -1,
        length = array ? array.length : 0,
        result = [];

    while (++index < length) {
        var value = array[index];

        if (value) {
            result.push(value);
        }
    }

    return result;
}

function setPropertyValue(element, property, propertyValue, rootPropertyValue, scrollData) {
    var propertyName = property;

    /* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
    if (property === "scroll") {
        /* If a container option is present, scroll the container instead of the browser window. */
        if (scrollData.container) {
            scrollData.container["scroll" + scrollData.direction] = propertyValue;
        /* Otherwise, Velocity defaults to scrolling the browser window. */
        } else {
            if (scrollData.direction === "Left") {
                window.scrollTo(propertyValue, scrollData.alternateValue);
            } else {
                window.scrollTo(scrollData.alternateValue, propertyValue);
            }
        }
    } else {
        /* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache().
           Thus, for now, we merely cache transforms being SET. */
        if (CSS.Normalizations.registered[property] && CSS.Normalizations.registered[property]("name", element) === "transform") {
            /* Perform a normalization injection. */
            /* Note: The normalization logic handles the transformCache updating. */
            CSS.Normalizations.registered[property]("inject", element, propertyValue);

            propertyName = "transform";
            propertyValue = Data(element).transformCache[property];
        } else {
            /* Inject hooks. */
            if (CSS.Hooks.registered[property]) {
                var hookName = property,
                    hookRoot = CSS.Hooks.getRoot(property);

                /* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
                rootPropertyValue = rootPropertyValue || CSS.getPropertyValue(element, hookRoot); /* GET */

                propertyValue = CSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
                property = hookRoot;
            }

            /* Normalize names and values. */
            if (CSS.Normalizations.registered[property]) {
                propertyValue = CSS.Normalizations.registered[property]("inject", element, propertyValue);
                property = CSS.Normalizations.registered[property]("name", element);
            }

            /* Assign the appropriate vendor prefix before performing an official style update. */
            propertyName = CSS.Names.prefixCheck(property)[0];

            /* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width.
               Try/catch is avoided for other browsers since it incurs a performance overhead. */
            if (IE <= 8) {
                try {
                    element.style[propertyName] = propertyValue;
                } catch (error) { if (Velocity.debug) console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]"); }
            /* SVG elements have their dimensional properties (width, height, x, y, cx, etc.) applied directly as attributes instead of as styles. */
            /* Note: IE8 does not support SVG elements, so it's okay that we skip it for SVG animation. */
            } else if (Data(element) && Data(element).isSVG && CSS.Names.SVGAttribute(property)) {
                /* Note: For SVG attributes, vendor-prefixed property names are never used. */
                /* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
                element.setAttribute(property, propertyValue);
            } else {
                element.style[propertyName] = propertyValue;
            }

            if (Velocity.debug >= 2) console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
        }
    }

    /* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
    return [ propertyName, propertyValue ];
}


export let Animator = new GlobalAnimator()
