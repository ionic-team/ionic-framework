(function() {
'use strict';

angular.module('ionic.ui.toast', [])

/*
 * We don't document the ionToast directive, we instead document
 * the $ionicToast service
 */
.directive('ionToast', ['$document', function($document) {
  return {
    restrict: 'E',
    scope: true,
    replace: true,
    link: function($scope, $element){
      $scope.$on('$destroy', function() {
        $element.remove();
      });
    },
    template: '<div class="toast" ng-class="position">' +
                '<div class="toast-message" ng-click="toastClicked()">{{message}}</div>' +
              '</div>'
  };
}]);

})();
