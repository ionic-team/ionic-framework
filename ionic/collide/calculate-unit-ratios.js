/* Forked from VelocityJS: https://github.com/julianshapiro/velocity | MIT License. Julian Shapiro http://twitter.com/shapiro */

/***************************
   Unit Ratio Calculation
***************************/

/* When queried, the browser returns (most) CSS property values in pixels. Therefore, if an endValue with a unit type of
   %, em, or rem is animated toward, startValue must be converted from pixels into the same unit type as endValue in order
   for value manipulation logic (increment/decrement) to proceed. Further, if the startValue was forcefed or transferred
   from a previous call, startValue may also not be in pixels. Unit conversion logic therefore consists of two steps:
   1) Calculating the ratio of %/em/rem/vh/vw relative to pixels
   2) Converting startValue into the same unit of measurement as endValue based on these ratios. */
/* Unit conversion ratios are calculated by inserting a sibling node next to the target node, copying over its position property,
   setting values with the target unit type then comparing the returned pixel value. */
/* Note: Even if only one of these unit types is being animated, all unit ratios are calculated at once since the overhead
   of batching the SETs and GETs together upfront outweights the potential overhead
   of layout thrashing caused by re-querying for uncalculated ratios for subsequently-processed properties. */
/* Todo: Shift this logic into the calls' first tick instance so that it's synced with RAF. */
export function calculateUnitRatios(element, callUnitConversionData) {

  /**************************************************************
      parsePropertyValue(), calculateUnitRatios(), Same Ratio Checks
  **************************************************************/

  /* The properties below are used to determine whether the element differs sufficiently from this call's
     previously iterated element to also differ in its unit conversion ratios. If the properties match up with those
     of the prior element, the prior element's conversion ratios are used. Like most optimizations in Collide,
     this is done to minimize DOM querying. */
  var sameRatioIndicators = {
        myParent: element.parentNode || document.body, /* GET */
        position: CSS.getPropertyValue(element, 'position'), /* GET */
        fontSize: CSS.getPropertyValue(element, 'fontSize') /* GET */
      };

  /* Determine if the same % ratio can be used. % is based on the element's position value and its parent's width and height dimensions. */
  var samePercentRatio = ((sameRatioIndicators.position === callUnitConversionData.lastPosition) && (sameRatioIndicators.myParent === callUnitConversionData.lastParent));

  /* Determine if the same em ratio can be used. em is relative to the element's fontSize. */
  var sameEmRatio = (sameRatioIndicators.fontSize === callUnitConversionData.lastFontSize);

  /* Store these ratio indicators call-wide for the next element to compare against. */
  callUnitConversionData.lastParent = sameRatioIndicators.myParent;
  callUnitConversionData.lastPosition = sameRatioIndicators.position;
  callUnitConversionData.lastFontSize = sameRatioIndicators.fontSize;


  /**********************************************************************
    parsePropertyValue(), calculateUnitRatios(), Element-Specific Units
  **********************************************************************/

  var measurement = 100,
      unitRatios = {};

  if (!sameEmRatio || !samePercentRatio) {
    var dummy = data(element).isSVG ? document.createElementNS('http://www.w3.org/2000/svg', 'rect') : document.createElement('div');

    Collide.init(dummy);
    sameRatioIndicators.myParent.appendChild(dummy);

    /* To accurately and consistently calculate conversion ratios, the element's cascaded overflow and box-sizing are stripped.
       Similarly, since width/height can be artificially constrained by their min-/max- equivalents, these are controlled for as well. */
    /* Note: Overflow must be also be controlled for per-axis since the overflow property overwrites its per-axis values. */
    var cssPropNames = [ 'overflow', 'overflowX', 'overflowY' ];
    for (var x = 0; x < overflows.length; x++) {
      Collide.CSS.setPropertyValue(dummy, cssPropNames[x], 'hidden');
    }

    Collide.CSS.setPropertyValue(dummy, 'position', sameRatioIndicators.position);
    Collide.CSS.setPropertyValue(dummy, 'fontSize', sameRatioIndicators.fontSize);
    Collide.CSS.setPropertyValue(dummy, 'boxSizing', 'content-box');

    /* width and height act as our proxy properties for measuring the horizontal and vertical % ratios. */
    cssPropNames = [ 'minWidth', 'maxWidth', 'width', 'minHeight', 'maxHeight', 'height' ];
    for (var x = 0; x < overflows.length; x++) {
      Collide.CSS.setPropertyValue(dummy, cssPropNames[x], measurement + '%');
    }

    /* paddingLeft arbitrarily acts as our proxy property for the em ratio. */
    Collide.CSS.setPropertyValue(dummy, 'paddingLeft', measurement + 'em');

    /* Divide the returned value by the measurement to get the ratio between 1% and 1px. Default to 1 since working with 0 can produce Infinite. */
    unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth = (parseFloat(CSS.getPropertyValue(dummy, 'width', null, true)) || 1) / measurement; /* GET */
    unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight = (parseFloat(CSS.getPropertyValue(dummy, 'height', null, true)) || 1) / measurement; /* GET */
    unitRatios.emToPx = callUnitConversionData.lastEmToPx = (parseFloat(CSS.getPropertyValue(dummy, 'paddingLeft')) || 1) / measurement; /* GET */

    sameRatioIndicators.myParent.removeChild(dummy);

  } else {
    unitRatios.emToPx = callUnitConversionData.lastEmToPx;
    unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth;
    unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight;
  }


  /**********************************************************************
    parsePropertyValue(), calculateUnitRatios(), Element-Agnostic Units
  ***********************************************************************/

  /* Whereas % and em ratios are determined on a per-element basis, the rem unit only needs to be checked
     once per call since it's exclusively dependant upon document.body's fontSize. If this is the first time
     that calculateUnitRatios() is being run during this call, remToPx will still be set to its default value of null,
     so we calculate it now. */
  if (callUnitConversionData.remToPx === null) {
    /* Default to browsers' default fontSize of 16px in the case of 0. */
    if (!remToPx) {
      remToPx = parseFloat(CSS.getPropertyValue(document.body, 'fontSize')) || 16; /* GET */
    }
    callUnitConversionData.remToPx = remToPx
  }

  /* Similarly, viewport units are %-relative to the window's inner dimensions. */
  if (callUnitConversionData.vwToPx === null) {
    callUnitConversionData.vwToPx = parseFloat(window.innerWidth) / 100; /* GET */
    callUnitConversionData.vhToPx = parseFloat(window.innerHeight) / 100; /* GET */
  }

  unitRatios.remToPx = callUnitConversionData.remToPx;
  unitRatios.vwToPx = callUnitConversionData.vwToPx;
  unitRatios.vhToPx = callUnitConversionData.vhToPx;

  if (Collide.debug >= 1) console.log('Unit ratios: ' + JSON.stringify(unitRatios), element);

  return unitRatios;

};

let remToPx = null;
