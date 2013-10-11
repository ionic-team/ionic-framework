angular.module('ionic.ui.checkbox', [])


.directive('checkbox', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: true,
    template: '<div class="checkbox"><input type="checkbox"><div class="handle"></div></div>',

    link: function($scope, $element, $attr, ngModel) {
      var checkbox, handle;

      if(!ngModel) { return; }

      checkbox = $element.children().eq(0);
      handle = $element.children().eq(1);

      if(!checkbox.length || !handle.length) { return; }

      $scope.checkbox = new ionic.views.Checkbox({ 
        el: $element[0],
        checkbox: checkbox[0],
        handle: handle[0]
      });

      $element.bind('click', function(e) {
        $scope.checkbox.tap(e);
        $scope.$apply(function() {
          ngModel.$setViewValue(checkbox[0].checked);
        });
      });

      ngModel.$render = function() {
        $scope.checkbox.val(ngModel.$viewValue);
      };
    }
  }
})