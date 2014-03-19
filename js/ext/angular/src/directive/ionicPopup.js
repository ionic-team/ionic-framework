(function() {
'use strict';

angular.module('ionic.ui.popup', [])

/**
 * @private
 */
.directive('ionPopupBackdrop', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="popup-backdrop"></div>'
  }
})

/**
 * @private
 */
.directive('ionPopup', ['$ionicBind', function($ionicBind) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: true,
    template:
      '<div class="popup">' +
        '<div class="popup-head">' +
          '<h3 class="popup-title" ng-bind-html="title"></h3>' +
          '<h5 class="popup-sub-title" ng-bind-html="subTitle" ng-if="subTitle"></h5>' +
        '</div>' +
        '<div class="popup-body" ng-transclude>' +
        '</div>' +
        '<div class="popup-buttons row">' +
          '<button ng-repeat="button in buttons" ng-click="_buttonTapped(button, $event)" class="button col" ng-class="button.type || \'button-default\'" ng-bind-html="button.text"></button>' +
        '</div>' +
      '</div>',
    link: function($scope, $element, $attr) {
      $ionicBind($scope, $attr, {
        title: '@',
        buttons: '=',
        $onButtonTap: '&onButtonTap',
        $onClose: '&onClose'
      });

      $scope._buttonTapped = function(button, event) {
        var result = button.onTap && button.onTap(event);

        // A way to return false
        if(event.defaultPrevented) {
          return $scope.$onClose({button: button, result: false, event: event });
        }

        // Truthy test to see if we should close the window
        if(result) {
          return $scope.$onClose({button: button, result: result, event: event });
        }
        $scope.$onButtonTap({button: button, event: event});
      }
    }
  };
}]);

})();
