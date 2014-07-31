/*
 * We don't document the ionPopover directive, we instead document
 * the $ionicPopover service
 */
IonicModule
.directive('ionPopover', [function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: [function(){}],
    template: '<div class="popover-backdrop">' +
                '<div class="popover-wrapper" ng-transclude></div>' +
              '</div>'
  };
}]);
