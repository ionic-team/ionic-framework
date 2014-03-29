(function() {
'use strict';

angular.module('ionic.ui.modal', [])

/*
 * We don't document the ionModal directive, we instead document
 * the $ionicModal service
 */
.directive('ionModal', [function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div class="modal-backdrop">' +
                '<div class="modal-wrapper" ng-transclude></div>' +
              '</div>'
  };
}]);

})();
