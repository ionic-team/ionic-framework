angular.module('ionic.ui', ['ngTouch'])

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

.controller('NavCtrl', function($scope) {
  var _this = this;

  angular.extend(this, NavController.prototype);

  NavController.call(this, {
    content: {
    },
    navBar: {
      shouldGoBack: function() {
      },
      setTitle: function(title) {
      },
      showBackButton: function(show) {
      },
    }
  });
})

.directive('navController', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    transclude: true,
    controller: 'NavCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view"><div ng-transclude></div></div>',
    compile: function(element, attr, transclude, tabsCtrl) {
      return function($scope, $element, $attr) {
      };
    }
  }
})

.directive('navBar', function() {
  return {
    restrict: 'E',
    require: '^navController',
    transclude: true,
    replace: true,
    template: '<header id="nav-bar" class="bar bar-header bar-dark">' +
        '<h1 class="title">{{title}}</h1>' +
      '</header>'
  }
})

.directive('navContent', function() {
  return {
    restrict: 'E',
    require: '^navController',
    scope: {
      title: '='
    },
    transclude: true,
    replace: true,
    template: '<div ng-transclude></div>',
    link: function(scope, element, attrs, tabsCtrl) {
      scope.$watch('title', function(value) {
        console.log('Title chnaged', value);
      });
    }
  }
});
