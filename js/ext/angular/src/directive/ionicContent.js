angular.module('ionic.ui.content', {})

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: true,
    template: '<div class="content" ng-class="{\'has-header\': hasHeader, \'has-tabs\': hasTabs}"></div>',
    compile: function(element, attr, transclude, navCtrl) {
      return function($scope, $element, $attr) {
        $scope.hasHeader = attr.hasHeader;
        $scope.hasTabs = attr.hasTabs;

        var newScope = $scope.$parent.$new();

        $element.append(transclude(newScope));
      };
    }
  }
})
