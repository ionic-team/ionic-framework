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
        console.log('Button tapped', button, event);
        var close = button.onTap && button.onTap(event);
        if(close === true) {
          console.log('Closing!');
          $scope.$onClose(button, event);
          //self.remove();
        }
        $scope.$onButtonTap({button: button, event: event});
      }
    },
    template:   '<div class="popup">' +
                  '<div class="popup-head">' +
                    '<h3 class="popup-title">{{title}}</h3>' +
                  '</div>' +
                  '<div class="popup-body" ng-transclude>' +
                  '</div>' +
                  '<div class="popup-buttons row">' +
                    '<button ng-repeat="button in buttons" ng-click="_buttonTapped(button, $event)" class="button button-clear col" ng-class="button.type || \'button-positive\'" ng-bind-html="button.text"></button>' +
                  '</div>' +
                '</div>'
  };
}]);

})();
