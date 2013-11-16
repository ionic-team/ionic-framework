(function() {
'use strict';

angular.module('ionic.ui.checkbox', [])


.directive('checkbox', function() {
  return {
    restrict: 'EA',
    replace: true,
    require: '?ngModel',
    scope: {},
    transclude: true,
    template: '<label ng-click="tapHandler($event)" class="checkbox"><input type="checkbox"><div ng-transclude></div></label>',
  

    link: function($scope, $element, $attr, ngModel) {
      var checkbox;

      if(!ngModel) { return; }

      checkbox = $element.children().eq(0);

      if(!checkbox.length) { return; }

      $scope.tapHandler = function(e) {
        if(e.type != 'click') {
          checkbox[0].checked = !checkbox[0].checked;
        }
        ngModel.$setViewValue(checkbox[0].checked);
        e.alreadyHandled = true;
      };

      var clickHandler = function(e) {
        checkbox[0].checked = !checkbox[0].checked;
        $scope.$apply(function() {
          ngModel.$setViewValue(checkbox[0].checked);
        });
      };

      if(ngModel) {
        ngModel.$render = function() {
          checkbox[0].checked = ngModel.$viewValue;
        };
      }
    }
  };
});

})();
