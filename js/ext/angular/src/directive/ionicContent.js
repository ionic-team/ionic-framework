angular.module('ionic.ui.content', {})

/*
.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="content"></div>'
  }
});
*/

/*
.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      hasHeader: '@',
      hasTabs: '@'
    },
    template: '<div class="content" ng-class="{\'has-header\': hasHeader, \'has-tabs\': hasTabs}" ng-transclude></div>'
  }
})
*/

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
