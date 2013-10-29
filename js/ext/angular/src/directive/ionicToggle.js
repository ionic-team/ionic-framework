angular.module('ionic.ui.toggle', [])

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('toggle', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: true,
    template: '<div class="toggle"><input type="checkbox"><div class="handle"></div></div>',

    link: function($scope, $element, $attr, ngModel) {
      var checkbox, handle;

      if(!ngModel) { return; }

      checkbox = $element.children().eq(0);
      handle = $element.children().eq(1);

      if(!checkbox.length || !handle.length) { return; }

      $scope.toggle = new ionic.views.Toggle({ 
        el: $element[0],
        checkbox: checkbox[0],
        handle: handle[0]
      });

      $element.bind('click', function(e) {
        $scope.toggle.tap(e);
        $scope.$apply(function() {
          ngModel.$setViewValue(checkbox[0].checked);
        });
      });

      ngModel.$render = function() {
        $scope.toggle.val(ngModel.$viewValue);
      };
    }
  };
});
