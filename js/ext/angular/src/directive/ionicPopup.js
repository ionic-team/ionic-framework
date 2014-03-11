(function() {
'use strict';

angular.module('ionic.ui.popup', [])

.directive('ionPopupBackdrop', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="popup-backdrop"></div>'
  }
})

.directive('ionPopup', ['$ionicBind', function($ionicBind) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: true,
    link: function($scope, $element, $attr) {
      $ionicBind($scope, $attr, {
        title: '@',
        buttons: '=',
        $onButtonTap: '&onButtonTap',
        $onClose: '&onClose'
      });

      $scope._buttonTapped = function(button, event) {
        var close = button.onTap && button.onTap(event);
        if(close === true) {
          $scope.$onClose(button, event);
        }
        $scope.$onButtonTap({button: button, event: event});
      }
    },
    template:   '<div class="popup">' +
                  '<div class="popup-head">' +
                    '<h3 class="popup-title" ng-bind-html="title"></h3>' +
                    '<h5 class="popup-sub-title" ng-bind-html="subTitle" ng-if="subTitle"></h5>' +
                  '</div>' +
                  '<div class="popup-body" ng-transclude>' +
                  '</div>' +
                  '<div class="popup-buttons row">' +
                    '<button ng-repeat="button in buttons" ng-click="_buttonTapped(button, $event)" class="button col" ng-class="button.type || \'button-default\'" ng-bind-html="button.text"></button>' +
                  '</div>' +
                '</div>'
  };
}]);

})();
