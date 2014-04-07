angular.module('ionic')

/**
 * @private
 */
.factory('$ionicBackdrop', [
  '$animate',
  '$document',
function($animate, $document) {

  var el;
  var backdropHolds = 0;

  return {
    retain: retain,
    release: release,
    _getElement: getElement
  };

  function getElement() {
    if (!el) {
      el = angular.element('<div class="backdrop ng-hide">');
      $document[0].body.appendChild(el[0]);
    }
    return el;
  }
  function retain() {
    if ( (++backdropHolds) === 1 ) {
      $animate.removeClass(getElement(), 'ng-hide');
    }
  }
  function release() {
    if ( (--backdropHolds) === 0 ) {
      $animate.addClass(getElement(), 'ng-hide');
    }
  }
}]);
