
/**
 * @ngdoc directive
 * @name navClear
 * @module ionic
 * @restrict AC
 *
 * @description
 * Disables any transition animations between views, along with removing the back
 * button which would normally show on the next view. This directive is useful for
 * links within a sideMenu.
 *
 * @usage
 * Below is an example of a link within a side menu. Tapping this link would disable
 * any animations which would normally occur between views.
 *
 * ```html
 * <a nav-clear menu-close href="#/home" class="item">Home</a>
 * ```
 */
IonicModule
.directive('navClear', [
  '$ionicViewService',
  '$state',
  '$location',
  '$window',
  '$rootScope',
function($ionicViewService, $location, $state, $window, $rootScope) {
  $rootScope.$on('$stateChangeError', function() {
    $ionicViewService.nextViewOptions(null);
  });
  return {
    priority: 100,
    restrict: 'AC',
    compile: function($element) {
      return { pre: prelink };
      function prelink($scope, $element, $attrs) {
        var unregisterListener;
        function listenForStateChange() {
          unregisterListener = $scope.$on('$stateChangeStart', function() {
            $ionicViewService.nextViewOptions({
              disableAnimate: true,
              disableBack: true
            });
            unregisterListener();
          });
          $window.setTimeout(unregisterListener, 300);
        }

        $element.on('click', listenForStateChange);
      }
    }
  };
}]);
