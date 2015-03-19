/**
 * @ngdoc service
 * @name $ionicPosition
 * @module ionic
 * @description
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers, etc.).
 *
 * Adapted from [AngularUI Bootstrap](https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js),
 * ([license](https://github.com/angular-ui/bootstrap/blob/master/LICENSE))
 */
IonicModule
.factory('$ionicPosition', ['$document', '$window', function($document, $window) {

  function getStyle(el, cssprop) {
    if (el.currentStyle) { //IE
      return el.currentStyle[cssprop];
    } else if ($window.getComputedStyle) {
      return $window.getComputedStyle(el)[cssprop];
    }
    // finally try and get inline style
    return el.style[cssprop];
  }

  /**
   * Checks if a given element is statically positioned
   * @param element - raw DOM element
   */
  function isStaticPositioned(element) {
    return (getStyle(element, 'position') || 'static') === 'static';
  }

  /**
   * returns the closest, non-statically positioned parentOffset of a given element
   * @param element
   */
  var parentOffsetEl = function(element) {
    var docDomEl = $document[0];
    var offsetParent = element.offsetParent || docDomEl;
    while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || docDomEl;
  };

  return {
    /**
     * @ngdoc method
     * @name $ionicPosition#position
     * @description Get the current coordinates of the element, relative to the offset parent.
     * Read-only equivalent of [jQuery's position function](http://api.jquery.com/position/).
     * @param {element} element The element to get the position of.
     * @returns {object} Returns an object containing the properties top, left, width and height.
     */
    position: function(element) {
      var elBCR = this.offset(element);
      var offsetParentBCR = { top: 0, left: 0 };
      var offsetParentEl = parentOffsetEl(element[0]);
      if (offsetParentEl != $document[0]) {
        offsetParentBCR = this.offset(jqLite(offsetParentEl));
        offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
        offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
      }

      var boundingClientRect = element[0].getBoundingClientRect();
      return {
        width: boundingClientRect.width || element.prop('offsetWidth'),
        height: boundingClientRect.height || element.prop('offsetHeight'),
        top: elBCR.top - offsetParentBCR.top,
        left: elBCR.left - offsetParentBCR.left
      };
    },

    /**
     * @ngdoc method
     * @name $ionicPosition#offset
     * @description Get the current coordinates of the element, relative to the document.
     * Read-only equivalent of [jQuery's offset function](http://api.jquery.com/offset/).
     * @param {element} element The element to get the offset of.
     * @returns {object} Returns an object containing the properties top, left, width and height.
     */
    offset: function(element) {
      var boundingClientRect = element[0].getBoundingClientRect();
      return {
        width: boundingClientRect.width || element.prop('offsetWidth'),
        height: boundingClientRect.height || element.prop('offsetHeight'),
        top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
        left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
      };
    }

  };
}]);
