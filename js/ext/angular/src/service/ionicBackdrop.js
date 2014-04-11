angular.module('ionic')

/**
 * @private
 */
.factory('$ionicBackdrop', [
  '$document',
function($document) {

  var el = angular.element('<div class="backdrop">');
  var backdropHolds = 0;

  $document[0].body.appendChild(el[0]);

  return {
    retain: retain,
    release: release,
    // exposed for testing
    _element: el
  };

  function retain() {
    if ( (++backdropHolds) === 1 ) {
      el.addClass('visible');
      ionic.requestAnimationFrame(function() {
        backdropHolds && el.addClass('active');
      });
    }
  }
  function release() {
    if ( (--backdropHolds) === 0 ) {
      el.removeClass('active');
      setTimeout(function() {
        !backdropHolds && el.removeClass('visible');
      }, 100);
    }
  }
}]);
