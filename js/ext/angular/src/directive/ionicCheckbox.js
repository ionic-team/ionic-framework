(function() {
'use strict';

angular.module('ionic.ui.checkbox', [])


.directive('checkbox', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {},
    template: '<label class="checkbox"><input type="checkbox"></label>',
  

    link: function($scope, $element, $attr, ngModel) {
      var checkbox;

      if(!ngModel) { return; }

      checkbox = $element.children().eq(0);

      if(!checkbox.length) { return; }

      var tapHandler = function(e) {
        checkbox[0].checked = !checkbox[0].checked;
        $scope.$apply(function() {
          ngModel.$setViewValue(checkbox[0].checked);
        });
        e.preventDefault();
      };

      var clickHandler = function(e) {
        checkbox[0].checked = !checkbox[0].checked;
        $scope.$apply(function() {
          ngModel.$setViewValue(checkbox[0].checked);
        });
      };

      $scope.$on('$destroy', function() {
        $element.unbind('tap', tapHandler);
        $element.unbind('click', clickHandler);
      });

      if(ngModel) {
        $element.bind('tap', tapHandler);
        $element.bind('click', clickHandler);

        ngModel.$render = function() {
          console.log('checkbox redern', ngModel.$viewValue);
          checkbox[0].checked = ngModel.$viewValue;
        };
      }
    }
  };
});

})();
