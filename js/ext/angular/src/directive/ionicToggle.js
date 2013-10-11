angular.module('ionic.ui.content', [])

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('toggle', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    require: '?ngModel',
    template: '<div class="toggle">' +
              ' <input type="checkbox">'+
              ' <div class="track">' +
              ' <div class="handle"></div>' +
              '</div>',

    link: function($scope, $element, $attr, ngModel) {
      var checkbox;

      $scope.toggle = new ionic.views.Toggle({ el: $element[0] });

      if(!ngModel) { return; }

      checkbox = $element.children()[0];

      if(!checkbox) { return; }

      ngModel.$render = function() {
        checkbox.checked = ngModel.$viewValue;
      };


    }
  }
})
