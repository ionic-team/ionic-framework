
/**
 * @ngdoc directive
 * @name navClear
 * @module ionic
 * @restrict AC
 *
 * @description
 * nav-clear is an attribute directive which should be used with an element that changes
 * the view on click, for example an `<a href>` or a `<button ui-sref>`.
 *
 * nav-clear will cause the given element, when clicked, to disable the next view transition.
 * This directive is useful, for example, for links within a sideMenu.
 *
 * @usage
 * Below is a link in a side menu, with the nav-clear directive added to it.
 * Tapping this link will disable any animations that would normally occur
 * between views.
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
