(function() {
'use strict';

angular.module('ionic.ui.checkbox', [])


.directive('checkbox', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {},
    transclude: true,
    template: '<li class="item item-checkbox">\
                <label class="checkbox">\
                  <input type="checkbox">\
                </label>\
                <div class="item-content" ng-transclude>\
                </div>\
              </li>',

    link: function($scope, $element, $attr, ngModel) {
      var checkbox;

      if(!ngModel) { return; }

      checkbox = angular.element($element[0].querySelector('input[type="checkbox"]'));

      if(!checkbox.length) { return; }

      checkbox.bind('change', function(e) {
        ngModel.$setViewValue(checkbox[0].checked);
        $scope.$apply(function() {
          e.alreadyHandled = true;
        });
      });

      if(ngModel) {
        ngModel.$render = function() {
          checkbox[0].checked = ngModel.$viewValue;
        };
      }
    }
  };
});

})();
