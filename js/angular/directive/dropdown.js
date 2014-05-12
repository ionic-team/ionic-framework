/*
 * We don't document the ionDropdown directive, we instead document
 * the $ionDropdown service
 */
IonicModule
.directive('ionDropdown', [function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div class="dropdown-backdrop">' +
                '<div class="dropdown-wrapper" ng-transclude></div>' +
                '</div>'
  };
}]);
