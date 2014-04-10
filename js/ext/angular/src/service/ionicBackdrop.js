angular.module('ionic')

/**
 * @private
 */
.factory('$ionicBackdrop', [
  '$animate',
  '$document',
  '$q',
function($animate, $document, $q) {

  var el;
  var backdropHolds = 0;
  var showingPromise;

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
      var retainDeferred = $q.defer();
      showingPromise = retainDeferred.promise;
      $animate.removeClass(getElement(), 'ng-hide', function() {
        retainDeferred.resolve(null);
      });
    }
  }
  function release() {
    if ( (--backdropHolds) === 0 ) {
      showingPromise.then(function() {
        $animate.addClass(getElement(), 'ng-hide');
      });
    }
  }
}]);
