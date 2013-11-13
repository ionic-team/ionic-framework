(function() {
'use strict';

angular.module('ionic.ui.actionSheet', [])

.directive('actionSheet', function($document) {
  return {
    restrict: 'E',
    scope: true,
    replace: true,
    link: function($scope, $element){
      $scope.$on('$destroy', function() {
        $element.remove();
      });

      $document.bind('keyup', function(e) {
        if(e.which == 27) {
          $scope.cancel();
          $scope.$apply();
        }
      });
    },
    template: '<div class="action-sheet-backdrop">' +
                '<div class="action-sheet slide-in-up">' +
                  '<div class="action-sheet-group">' +
                    '<div class="action-sheet-title" ng-if="titleText">{{titleText}}</div>' +
                    '<button class="button" ng-click="buttonClicked($index)" ng-repeat="button in buttons">{{button.text}}</button>' +
                  '</div>' +
                  '<div class="action-sheet-group" ng-if="destructiveText">' +
                    '<button class="button destructive" ng-click="destructiveButtonClicked()">{{destructiveText}}</button>' +
                  '</div>' +
                  '<div class="action-sheet-group" ng-if="cancelText">' +
                    '<button class="button" ng-click="cancel()">{{cancelText}}</button>' +
                  '</div>' +
                '</div>' +
              '</div>'
  };
});

})();
