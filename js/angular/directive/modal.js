/*
 * We don't document the ionModal directive, we instead document
 * the $ionicModal service
 */
IonicModule
.directive('ionModal', [function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: [function() {}],
    template: '<div class="modal-backdrop">' +
                '<div class="modal-backdrop-bg"></div>' +
                '<div class="modal-wrapper" ng-transclude></div>' +
              '</div>'
  };
}]);
