angular.module('ionic')

/**
 * @private
 */
.factory('$ionicBackdrop', [
  '$animate',
  '$document',
  '$animateClassToggler',
function($animate, $document, $animateClassToggler) {

  var el = angular.element('<div class="backdrop ng-hide">');
  var backdropHolds = 0;
  var toggler = $animateClassToggler(el, 'ng-hide');

  $document[0].body.appendChild(el[0]);

  return {
    retain: retain,
    release: release,
    // exposed for testing
    _element: el
  };

  function retain() {
    if ( (++backdropHolds) === 1 ) {
      toggler.removeClass();
    }
  }
  function release() {
    if ( (--backdropHolds) === 0 ) {
      toggler.addClass();
    }
  }
}]);
