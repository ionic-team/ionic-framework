angular.module('ionic.ui', ['ngTouch'])

.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: true,
    template: '<div class="full-section menu-animated" ng-class="{\'has-header\': hasHeader, \'has-tabs\': hasTabs}" ng-transclude></div>',
    compile: function(element, attr, transclude, navCtrl) {
      return function($scope, $element, $attr) {
        $scope.hasHeader = attr.hasHeader;
      };
    }
  }
})

.controller('SideMenuCtrl', function($scope) {
})

.directive('sideMenuController', function() {
  return {
    restrict: 'E',
    controller: 'SideMenuCtrl',
    replace: true,
    transclude: true,
    template: '<div class="view"><div ng-transclude></div></div>',
  }
})

.directive('menu', function() {
  return {
    restrict: 'E',
    require: '^sideMenuController',
    replace: true,
    transclude: true,
    scope: true,
    template: '<div class="menu menu-{{side}}" ng-transclude></div>',
    compile: function(element, attr, transclude, navCtrl) {
      return function($scope, $element, $attr) {
        $scope.side = attr.side;
      };
    }
  }
})
