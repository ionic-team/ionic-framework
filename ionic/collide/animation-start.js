/* Forked from Collide.js, MIT License. Julian Shapiro http://twitter.com/shapiro */

import {Collide} from './collide'
import {animationProcess} from './animation-process'


export function animationStart(elements, options, propertiesMap) {

  if (!elements || !elements.length) {
    return Promise.resolve();
  }

  /* The length of the element set (in the form of a nodeList or an array of elements) is defaulted to 1 in case a
     single raw DOM element is passed in (which doesn't contain a length property). */
  var elementsLength = elements.length;
  var elementsIndex = 0;
  var eleData;


  /**********************************
      Animation Call-Wide Variables
  **********************************/

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


  /**************************
     Element Set Iteration
  **************************/

  var promises = [];

  if (elements && elements.length) {
    for (var i = 0, l = elements.length; i < l; i++) {
      if (elements[i] && elements[i].parentElement) {

        promises.push(
          animationProcess('start', elements, i, options, propertiesMap, callUnitConversionData, call)
        );

      }
    }
  }

  return Promise.all(promises);
};
