/**
 * @ngdoc service
 * @name $ionicBackdrop
 * @module ionic
 * @description
 * Shows and hides a backdrop over the UI.  Appears behind popups, loading,
 * and other overlays.
 *
 * Often, multiple UI components require a backdrop, but only one backdrop is
 * ever needed in the DOM at a time.
 *
 * Therefore, each component that requires the backdrop to be shown calls
 * `$ionicBackdrop.retain()` when it wants the backdrop, then `$ionicBackdrop.release()`
 * when it is done with the backdrop.
 *
 * For each time `retain` is called, the backdrop will be shown until `release` is called.
 *
 * For example, if `retain` is called three times, the backdrop will be shown until `release`
 * is called three times.
 *
 * **Notes:**
 * - The backdrop service will broadcast 'backdrop.shown' and 'backdrop.hidden' events from the root scope,
 * this is useful for alerting native components not in html.
 *
 * @usage
 *
 * ```js
 * function MyController($scope, $ionicBackdrop, $timeout, $rootScope) {
 *   //Show a backdrop for one second
 *   $scope.action = function() {
 *     $ionicBackdrop.retain();
 *     $timeout(function() {
 *       $ionicBackdrop.release();
 *     }, 1000);
 *   };
 *
 *   // Execute action on backdrop disappearing
 *   $scope.$on('backdrop.hidden', function() {
 *     // Execute action
 *   });
 *
 *   // Execute action on backdrop appearing
 *   $scope.$on('backdrop.shown', function() {
 *     // Execute action
 *   });
 *
 * }
 * ```
 */
IonicModule
.factory('$ionicBackdrop', [
  '$document', '$timeout', '$$rAF', '$rootScope',
function($document, $timeout, $$rAF, $rootScope) {

  var el = jqLite('<div class="backdrop">');
  var backdropHolds = 0;

  $document[0].body.appendChild(el[0]);

  return {
    /**
     * @ngdoc method
     * @name $ionicBackdrop#retain
     * @description Retains the backdrop.
     */
    retain: retain,
    /**
     * @ngdoc method
     * @name $ionicBackdrop#release
     * @description
     * Releases the backdrop.
     */
    release: release,

    getElement: getElement,

    // exposed for testing
    _element: el
  };

  function retain() {
    backdropHolds++;
    if (backdropHolds === 1) {
      el.addClass('visible');
      $rootScope.$broadcast('backdrop.shown');
      $$rAF(function() {
        // If we're still at >0 backdropHolds after async...
        if (backdropHolds >= 1) el.addClass('active');
      });
    }
  }
  function release() {
    if (backdropHolds === 1) {
      el.removeClass('active');
      $rootScope.$broadcast('backdrop.hidden');
      $timeout(function() {
        // If we're still at 0 backdropHolds after async...
        if (backdropHolds === 0) el.removeClass('visible');
      }, 400, false);
    }
    backdropHolds = Math.max(0, backdropHolds - 1);
  }

  function getElement() {
    return el;
  }

}]);
