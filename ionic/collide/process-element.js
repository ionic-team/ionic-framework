/* Forked from VelocityJS, MIT License: https://github.com/julianshapiro/velocity | Julian Shapiro http://twitter.com/shapiro */

import * as util from 'ionic/util/util'
import {Collide} from './collide'
import {CSS} from './css'
import {getEasing} from './easing'
import {calculateUnitRatios} from './calculate-unit-ratios'


const data = Collide.data;

/*********************
  Element Processing
*********************/

/* Element processing consists of three parts -- data processing that cannot go stale and data processing that *can* go stale (i.e. third-party style modifications):
   1) Pre-Queueing: Element-wide variables, including the element's data storage, are instantiated. Call options are prepared. If triggered, the Stop action is executed.
   2) Queueing: The logic that runs once this call has reached its point of execution in the element's Collide.queue() stack. Most logic is placed here to avoid risking it becoming stale.
   3) Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
*/

export function processElement(action, animation, elementIndex, clearCache) {
  var elements = animation._ele;
  var elementsLength = elements.length;
  var element = elements[elementIndex];
  var eleData;

  var opts = animation._options;
  var propertiesMap = animation._properties;
  var callUnitConversionData = animation._unitConversion;
  var call = animation._call;
  var resolve = animation._resolve;


  /*************************
    Part I: Pre-Queueing
  *************************/

  /***************************
    Element-Wide Variables
  ***************************/

  /* A container for the processed data associated with each property in the propertyMap.
     (Each property in the map produces its own 'tween'.) */
  var tweensContainer = {};
  var elementUnitConversionData = null;


  /******************
    Element Init
  ******************/

  if (data(element) === undefined) {
    eleData = Collide.initData(element);
  } else {
    eleData = data(element);
  }

  if (animation._addStartClasses.length) eleData.startAddCls = animation._addStartClasses.slice();
  if (animation._removeStartClasses.length) eleData.startRmvCls = animation._removeStartClasses.slice();
  if (animation._addEndClasses.length) eleData.endAddCls = animation._addEndClasses.slice();
  if (animation._removeEndClasses.length) eleData.endRmvCls = animation._removeEndClasses.slice();


  /******************
    Option: Delay
  ******************/

  /* Since queue:false doesn't respect the item's existing queue, we avoid injecting its delay here (it's set later on). */
  if (parseFloat(opts.delay) && opts.queue !== false) {
    Collide.queue(element, opts.queue, function(next) {
      // This is a flag used to indicate to the upcoming completeCall() function that this queue entry was initiated by Collide.
      // See completeCall() for further details.
      Collide.collideQueueEntryFlag = true;

      // The ensuing queue item (which is assigned to the 'next' argument that Collide.queue() automatically passes in) will be triggered after a setTimeout delay.
      // The setTimeout is stored so that it can be subjected to clearTimeout() if this animation is prematurely stopped via Collide's 'stop' command.
      data(element).delayTimer = {
        setTimeout: setTimeout(next, parseFloat(opts.delay)),
        next: next
      };
    });
  }


  /*********************
    Option: Duration
  *********************/

  opts.duration = parseFloat(opts.duration) || 1;


  /*******************
     Option: Easing
  *******************/

  opts.easing = getEasing(opts.easing, opts.duration);


  /**********************
    Option: Callbacks
  **********************/

  /* Callbacks must functions. Otherwise, default to null. */
  if (opts.begin && typeof opts.begin !== 'function') {
    opts.begin = null;
  }

  if (opts.progress && typeof opts.progress !== 'function') {
    opts.progress = null;
  }

  if (opts.complete && typeof opts.complete !== 'function') {
    opts.complete = null;
  }


  /*********************************
     Option: Display & Visibility
  *********************************/

  /* Refer to Collide's documentation (CollideJS.org/#displayAndVisibility) for a description of the display and visibility options' behavior. */
  /* Note: We strictly check for undefined instead of falsiness because display accepts an empty string value. */
  if (opts.display !== undefined && opts.display !== null) {
    opts.display = opts.display.toString().toLowerCase();

    /* Users can pass in a special 'auto' value to instruct Collide to set the element to its default display value. */
    if (opts.display === 'auto') {
      opts.display = CSS.getDisplayType(element);
    }
  }

  if (opts.visibility !== undefined && opts.visibility !== null) {
    opts.visibility = opts.visibility.toString().toLowerCase();
  }


  /***********************
     Part II: Queueing
  ***********************/

  /* When a set of elements is targeted by a Collide call, the set is broken up and each element has the current Collide call individually queued onto it.
     In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Collide call triggered immediately. */
  /* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
     the call array is pushed to Collide.State.calls for live processing by the requestAnimationFrame tick. */
  function buildQueue(next) {

    /*******************
      Option: Begin
    *******************/

    /* The begin callback is fired once per call -- not once per elemenet -- and is passed the full raw DOM element set as both its context and its first argument. */
    if (opts.begin && elementIndex === 0) {
      /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Collide itself. */
      try {
        opts.begin.call(elements, elements);
      } catch (error) {
        setTimeout(function() { throw error; });
      }
    }


    /*****************************************
       Tween Data Construction (for Scroll)
    *****************************************/

    /* Note: In order to be subjected to chaining and animation options, scroll's tweening is routed through Collide as if it were a standard CSS property animation. */
    if (action === 'scroll') {
      /* The scroll action uniquely takes an optional 'offset' option -- specified in pixels -- that offsets the targeted scroll position. */
      var scrollDirection = (/^x$/i.test(opts.axis) ? 'Left' : 'Top'),
          scrollOffset = parseFloat(opts.offset) || 0,
          scrollPositionCurrent,
          scrollPositionCurrentAlternate,
          scrollPositionEnd;

      /* Scroll also uniquely takes an optional 'container' option, which indicates the parent element that should be scrolled --
         as opposed to the browser window itself. This is useful for scrolling toward an element that's inside an overflowing parent element. */
      if (opts.container) {
        /* Ensure that a raw DOM element was passed in. */
        if (opts.container.nodeType) {
          /* Note: Unlike other properties in Collide, the browser's scroll position is never cached since it so frequently changes
             (due to the user's natural interaction with the page). */
          scrollPositionCurrent = opts.container['scroll' + scrollDirection]; /* GET */

          /* CSS.position(element) values are relative to the container's currently viewable area (without taking into
             account the container's true dimensions, for example, if the container was not overflowing). Thus, the scroll end
             value is the sum of the child element's position *and* the scroll container's current scroll position. */
          scrollPositionEnd = (scrollPositionCurrent + CSS.position(element)[scrollDirection.toLowerCase()]) + scrollOffset; /* GET */

        } else {
          /* If a value other than a raw DOM element was passed in, default to null so that this option is ignored. */
          opts.container = null;
        }

      } else {
        /* If the window itself is being scrolled -- not a containing element -- perform a live scroll position lookup using
           the appropriate cached property names (which differ based on browser type). */
        scrollPositionCurrent = Collide.State.scrollAnchor[Collide.State['scrollProperty' + scrollDirection]]; /* GET */

        /* When scrolling the browser window, cache the alternate axis's current value since window.scrollTo() doesn't let us change only one value at a time. */
        scrollPositionCurrentAlternate = Collide.State.scrollAnchor[Collide.State['scrollProperty' + (scrollDirection === 'Left' ? 'Top' : 'Left')]]; /* GET */

        /* Unlike CSS.position(element), CSS.offset(element) values are relative to the browser window's true dimensions
           -- not merely its currently viewable area -- and therefore end values do not need to be compounded onto current values. */
        scrollPositionEnd = CSS.offset(element)[scrollDirection.toLowerCase()] + scrollOffset; /* GET */
      }

      /* Since there's only one format that scroll's associated tweensContainer can take, we create it manually. */
      tweensContainer = {
        scroll: {
          rootPropertyValue: false,
          startValue: scrollPositionCurrent,
          currentValue: scrollPositionCurrent,
          endValue: scrollPositionEnd,
          unitType: '',
          easing: opts.easing,
          scrollData: {
            container: opts.container,
            direction: scrollDirection,
            alternateValue: scrollPositionCurrentAlternate
          }
        },
        element: element
      };

      if (Collide.debug) console.log("tweensContainer (scroll): ", tweensContainer.scroll, element);


    } else if (action === 'start') {

      /****************************
        Start: Value Transferring
      ****************************/

      /* If this queue entry follows a previous Collide-initiated queue entry *and* if this entry was created
         while the element was in the process of being animated by Collide, then this current call is safe to use
         the end values from the prior call as its start values. Collide attempts to perform this value transfer
         process whenever possible in order to avoid requerying the DOM. */
      /* If values aren't transferred from a prior call and start values were not forcefed by the user (more on this below),
         then the DOM is queried for the element's current values as a last resort. */
      /* Note: Conversely, animation reversal (and looping) *always* perform inter-call value transfers; they never requery the DOM. */
      var lastTweensContainer;

      /* The per-element isAnimating flag is used to indicate whether it's safe (i.e. the data isn't stale)
         to transfer over end values to use as start values. If it's set to true and there is a previous
         Collide call to pull values from, do so. */
      eleData = data(element);
      if (clearCache) {
        eleData.tweensContainer = undefined;
      } else if (eleData.tweensContainer && eleData.isAnimating === true) {
        lastTweensContainer = eleData.tweensContainer;
      }


      /********************************
        Start: Tween Data Calculation
      ********************************/

      /* This function parses property data and defaults endValue, easing, and startValue as appropriate. */
      /* Property map values can either take the form of 1) a single value representing the end value,
         or 2) an array in the form of [ endValue, [, easing] [, startValue] ].
         The optional third parameter is a forcefed startValue to be used instead of querying the DOM for
         the element's current value. */
      function parsePropertyValue(valueData, skipResolvingEasing) {
        var endValue = valueData[0];
        var easing = skipResolvingEasing ? valueData[1] : getEasing(valueData[1] || opts.easing, opts.duration);
        var startValue = valueData[2];

        /* Default to the call's easing if a per-property easing type was not defined. */
        if (!skipResolvingEasing) {
          easing = easing || opts.easing;
        }

        /* If functions were passed in as values, pass the function the current element as its context,
           plus the element's index and the element set's size as arguments. Then, assign the returned value. */
        if (typeof endValue === 'function') {
          endValue = endValue.call(element, elementIndex, elementsLength);
        }

        if (typeof startValue === 'function') {
          startValue = startValue.call(element, elementIndex, elementsLength);
        }

        /* Allow startValue to be left as undefined to indicate to the ensuing code that its value was not forcefed. */
        return [ endValue || 0, easing, startValue ];

      } // END: parsePropertyValue()


      /* Cycle through each property in the map, looking for shorthand color properties (e.g. 'color' as opposed to 'colorRed'). Inject the corresponding
         colorRed, colorGreen, and colorBlue RGB component tweens into the propertiesMap (which Collide understands) and remove the shorthand property. */
      for (var property in propertiesMap) {

        /* Find shorthand color properties that have been passed a hex string. */
        if (RegExp('^' + CSS.Lists.colors.join('$|^') + '$').test(property)) {
          /* Parse the value data for each shorthand. */
          var valueData = parsePropertyValue(propertiesMap[property], true),
              endValue = valueData[0],
              easing = valueData[1],
              startValue = valueData[2];

          if (CSS.RegEx.isHex.test(endValue)) {
            /* Convert the hex strings into their RGB component arrays. */
            var colorComponents = [ 'Red', 'Green', 'Blue' ],
                endValueRGB = CSS.Values.hexToRgb(endValue),
                startValueRGB = startValue ? CSS.Values.hexToRgb(startValue) : undefined;

            /* Inject the RGB component tweens into propertiesMap. */
            for (var i = 0; i < colorComponents.length; i++) {
              var dataArray = [ endValueRGB[i] ];

              if (easing) {
                dataArray.push(easing);
              }

              if (startValueRGB !== undefined) {
                dataArray.push(startValueRGB[i]);
              }

              propertiesMap[property + colorComponents[i]] = dataArray;
            }

            /* Remove the intermediary shorthand property entry now that we've processed it. */
            delete propertiesMap[property];
          }
        }
      }


      /* Create a tween out of each property, and append its associated data to tweensContainer. */
      for (var property in propertiesMap) {

        /*********************************************
          parsePropertyValue(), Start Value Sourcing
        *********************************************/

        /* Parse out endValue, easing, and startValue from the property's data. */
        var valueData = parsePropertyValue(propertiesMap[property]),
            endValue = valueData[0],
            easing = valueData[1],
            startValue = valueData[2];

        /* Now that the original property name's format has been used for the parsePropertyValue() lookup above,
           we force the property to its camelCase styling to normalize it for manipulation. */
        property = CSS.Names.camelCase(property);

        /* In case this property is a hook, there are circumstances where we will intend to work on the hook's root property and not the hooked subproperty. */
        var rootProperty = CSS.Hooks.getRoot(property),
            rootPropertyValue = false;

        /* Other than for the dummy tween property, properties that are not supported by the browser (and do not have an associated normalization) will
           inherently produce no style changes when set, so they are skipped in order to decrease animation tick overhead.
           Property support is determined via prefixCheck(), which returns a false flag when no supported is detected. */
        /* Note: Since SVG elements have some of their properties directly applied as HTML attributes,
           there is no way to check for their explicit browser support, and so we skip skip this check for them. */
        if (!eleData.isSVG && rootProperty !== 'tween' && CSS.Names.prefixCheck(rootProperty)[1] === false && CSS.Normalizations.registered[rootProperty] === undefined) {
          if (Collide.debug) console.log('Skipping [' + rootProperty + '] due to a lack of browser support.');
          continue;
        }

        /* If the display option is being set to a non-'none' (e.g. 'block') and opacity (filter on IE<=8) is being
           animated to an endValue of non-zero, the user's intention is to fade in from invisible, thus we forcefeed opacity
           a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
        if (((opts.display !== undefined && opts.display !== null && opts.display !== 'none') || (opts.visibility !== undefined && opts.visibility !== 'hidden')) && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
          startValue = 0;
        }


        /* If values have been transferred from the previous Collide call, extract the endValue and rootPropertyValue
           for all of the current call's properties that were *also* animated in the previous call. */
        /* Note: Value transferring can optionally be disabled by the user via the _cacheValues option. */
        if (opts._cacheValues && lastTweensContainer && lastTweensContainer[property]) {

          if (startValue === undefined) {
            startValue = lastTweensContainer[property].endValue + lastTweensContainer[property].unitType;
          }

          /* The previous call's rootPropertyValue is extracted from the element's data cache since that's the
             instance of rootPropertyValue that gets freshly updated by the tweening process, whereas the rootPropertyValue
             attached to the incoming lastTweensContainer is equal to the root property's value prior to any tweening. */
          rootPropertyValue = eleData.rootPropertyValueCache[rootProperty];

        /* If values were not transferred from a previous Collide call, query the DOM as needed. */
        } else {
          /* Handle hooked properties. */
          if (CSS.Hooks.registered[property]) {
           if (startValue === undefined) {
              rootPropertyValue = CSS.getPropertyValue(element, rootProperty); /* GET */
              /* Note: The following getPropertyValue() call does not actually trigger a DOM query;
                 getPropertyValue() will extract the hook from rootPropertyValue. */
              startValue = CSS.getPropertyValue(element, property, rootPropertyValue);

            /* If startValue is already defined via forcefeeding, do not query the DOM for the root property's value;
               just grab rootProperty's zero-value template from CSS.Hooks. This overwrites the element's actual
               root property value (if one is set), but this is acceptable since the primary reason users forcefeed is
               to avoid DOM queries, and thus we likewise avoid querying the DOM for the root property's value. */
            } else {
              /* Grab this hook's zero-value template, e.g. '0px 0px 0px black'. */
              rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
            }

          /* Handle non-hooked properties that haven't already been defined via forcefeeding. */
          } else if (startValue === undefined) {
            startValue = CSS.getPropertyValue(element, property); /* GET */
          }
        }


        /**********************************************
          parsePropertyValue(), Value Data Extraction
        **********************************************/

        var separatedValue,
            endValueUnitType,
            startValueUnitType,
            operator = false;

        /* Separates a property value into its numeric value and its unit util. */
        function separateValue (property, value) {
          var unitType,
              numericValue;

          numericValue = (value || '0')
              .toString()
              .toLowerCase()
              /* Match the unit type at the end of the value. */
              .replace(/[%A-z]+$/, function(match) {
                  /* Grab the unit util. */
                  unitType = match;

                  /* Strip the unit type off of value. */
                  return '';
              });

          /* If no unit type was supplied, assign one that is appropriate for this property (e.g. 'deg' for rotateZ or 'px' for width). */
          if (!unitType) {
            unitType = CSS.Values.getUnitType(property);
          }

          return [ numericValue, unitType ];
        }

        /* Separate startValue. */
        separatedValue = separateValue(property, startValue);
        startValue = separatedValue[0];
        startValueUnitType = separatedValue[1];

        /* Separate endValue, and extract a value operator (e.g. '+=', '-=') if one exists. */
        separatedValue = separateValue(property, endValue);
        endValue = separatedValue[0].replace(/^([+-\/*])=/, function(match, subMatch) {
          operator = subMatch;

          /* Strip the operator off of the value. */
          return '';
        });
        endValueUnitType = separatedValue[1];

        /* Parse float values from endValue and startValue. Default to 0 if NaN is returned. */
        startValue = parseFloat(startValue) || 0;
        endValue = parseFloat(endValue) || 0;


        /***************************************
           parsePropertyValue, Property-Specific Value Conversion
        ***************************************/

        /* Custom support for properties that don't actually accept the % unit type, but where pollyfilling is trivial and relatively foolproof. */
        if (endValueUnitType === '%') {
          /* A %-value fontSize/lineHeight is relative to the parent's fontSize (as opposed to the parent's dimensions),
             which is identical to the em unit's behavior, so we piggyback off of that. */
          if (/^(fontSize|lineHeight)$/.test(property)) {
            /* Convert % into an em decimal value. */
            endValue = endValue / 100;
            endValueUnitType = 'em';

          /* For scaleX and scaleY, convert the value into its decimal format and strip off the unit util. */
          } else if (/^scale/.test(property)) {
            endValue = endValue / 100;
            endValueUnitType = '';

          /* For RGB components, take the defined percentage of 255 and strip off the unit util. */
          } else if (/(Red|Green|Blue)$/i.test(property)) {
            endValue = (endValue / 100) * 255;
            endValueUnitType = '';
          }
        }


        /****************************************
          parsePropertyValue(), Unit Conversion
        *****************************************/

        /* The * and / operators, which are not passed in with an associated unit, inherently use startValue's unit. Skip value and unit conversion. */
        if (/[\/*]/.test(operator)) {
          endValueUnitType = startValueUnitType;

        /* If startValue and endValue differ in unit type, convert startValue into the same unit type as endValue so that if endValueUnitType
           is a relative unit (%, em, rem), the values set during tweening will continue to be accurately relative even if the metrics they depend
           on are dynamically changing during the course of the animation. Conversely, if we always normalized into px and used px for setting values, the px ratio
           would become stale if the original unit being animated toward was relative and the underlying metrics change during the animation. */
        /* Since 0 is 0 in any unit type, no conversion is necessary when startValue is 0 -- we just start at 0 with endValueUnitutil. */
        } else if ((startValueUnitType !== endValueUnitType) && startValue !== 0) {
          /* Unit conversion is also skipped when endValue is 0, but *startValueUnitType* must be used for tween values to remain accurate. */
          /* Note: Skipping unit conversion here means that if endValueUnitType was originally a relative unit, the animation won't relatively
             match the underlying metrics if they change, but this is acceptable since we're animating toward invisibility instead of toward visibility,
             which remains past the point of the animation's completion. */
          if (endValue === 0) {
            endValueUnitType = startValueUnitType;

          } else {
            /* By this point, we cannot avoid unit conversion (it's undesirable since it causes layout thrashing).
               If we haven't already, we trigger calculateUnitRatios(), which runs once per element per call. */
            elementUnitConversionData = elementUnitConversionData || calculateUnitRatios(element, callUnitConversionData);

            /* The following RegEx matches CSS properties that have their % values measured relative to the x-axis. */
            /* Note: W3C spec mandates that all of margin and padding's properties (even top and bottom) are %-relative to the *width* of the parent element. */
            var axis = (/margin|padding|left|right|width|text|word|letter/i.test(property) || /X$/.test(property) || property === 'x') ? 'x' : 'y';

            /* In order to avoid generating n^2 bespoke conversion functions, unit conversion is a two-step process:
               1) Convert startValue into pixels. 2) Convert this new pixel value into endValue's unit util. */
            switch (startValueUnitType) {
              case '%':
                /* Note: translateX and translateY are the only properties that are %-relative to an element's own dimensions -- not its parent's dimensions.
                   Collide does not include a special conversion process to account for this behavior. Therefore, animating translateX/Y from a % value
                   to a non-% value will produce an incorrect start value. Fortunately, this sort of cross-unit conversion is rarely done by users in practice. */
                startValue *= (axis === 'x' ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                break;

              case 'px':
                /* px acts as our midpoint in the unit conversion process; do nothing. */
                break;

              default:
                startValue *= elementUnitConversionData[startValueUnitType + 'ToPx'];
            }

            /* Invert the px ratios to convert into to the target unit. */
            switch (endValueUnitType) {
              case '%':
                startValue *= 1 / (axis === 'x' ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                break;

              case 'px':
                /* startValue is already in px, do nothing; we're done. */
                break;

              default:
                startValue *= 1 / elementUnitConversionData[endValueUnitType + 'ToPx'];
            }
          }
        }


        /****************************************
          parsePropertyValue(), Relative Values
        ****************************************/

        /* Operator logic must be performed last since it requires unit-normalized start and end values. */
        /* Note: Relative *percent values* do not behave how most people think; while one would expect '+=50%'
           to increase the property 1.5x its current value, it in fact increases the percent units in absolute terms:
           50 points is added on top of the current % value. */
        switch (operator) {
          case '+':
            endValue = startValue + endValue;
            break;

          case '-':
            endValue = startValue - endValue;
            break;

          case '*':
            endValue = startValue * endValue;
            break;

          case '/':
            endValue = startValue / endValue;
            break;
        }

        var currentValue = startValue;

        /*********************************************
          parsePropertyValue(), tweensContainer Push
        *********************************************/

        /* Construct the per-property tween object, and push it to the element's tweensContainer. */
        tweensContainer[property] = {
          rootPropertyValue: rootPropertyValue,
          startValue: startValue,
          currentValue: currentValue,
          endValue: endValue,
          unitType: endValueUnitType,
          easing: easing
        };

        if (Collide.debug) console.log('tweensContainer (' + property + '): ' + JSON.stringify(tweensContainer[property]), element);
      }

      /* Along with its property data, store a reference to the element itself onto tweensContainer. */
      tweensContainer.element = element;

    } // END: parsePropertyValue()


    /*****************
        Call Push
    *****************/

    /* Note: tweensContainer can be empty if all of the properties in this call's property map were skipped due to not
       being supported by the browser. The element property is used for checking that the tweensContainer has been appended to. */
    if (tweensContainer.element) {

      /* The call array houses the tweensContainers for each element being animated in the current call. */
      call.push(tweensContainer);

      /* Store the tweensContainer and options if we're working on the default effects queue, so that they can be used by the reverse command. */
      if (opts.queue === '') {
        eleData.tweensContainer = tweensContainer;
        eleData.opts = opts;
      }
    }

  } // END: buildQueue


  /* When the queue option is set to false, the call skips the element's queue and fires immediately. */
  if (opts.queue === false) {
    /* Since this buildQueue call doesn't respect the element's existing queue (which is where a delay option would have been appended),
       we manually inject the delay property here with an explicit setTimeout. */
    if (opts.delay) {
      setTimeout(buildQueue, opts.delay);
    } else {
      buildQueue();
    }

  /* Otherwise, the call undergoes element queueing as normal. */
  } else {
    Collide.queue(element, opts.queue, function(next, clearQueue) {
      /* If the clearQueue flag was passed in by the stop command, resolve this call's promise. (Promises can only be resolved once,
         so it's fine if this is repeatedly triggered for each element in the associated call.) */
      if (clearQueue === true) {
        /* Do not continue with animation queueing. */
        resolve(elements);
        return true;
      }

      /* This flag indicates to the upcoming completeCall() function that this queue entry was initiated by Collide.
         See completeCall() for further details. */
      Collide.collideQueueEntryFlag = true;

      buildQueue(next);
    });
  }

}
