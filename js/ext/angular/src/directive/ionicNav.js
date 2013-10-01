angular.module('ionic.ui.nav', [])

.controller('NavCtrl', function($scope, $element, $compile) {
  var _this = this;

  angular.extend(this, ionic.controllers.NavController.prototype);

  ionic.controllers.NavController.call(this, {
    content: {
    },
    navBar: {
      shouldGoBack: function() {
      },
      setTitle: function(title) {
        $scope.title = title;
      },
      showBackButton: function(show) {
      },
    }
  });

  $scope.controllers = this.controllers;

  $scope.getTopController = function() {
    return $scope.controllers[$scope.controllers.length-1];
  }

  $scope.pushController = function(controller) {
    _this.push(controller);
  }

  $scope.navController = this;
})

.directive('navController', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'NavCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view"><div ng-transclude></div></div>',
    compile: function(element, attr, transclude, navCtrl) {
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
    template: '<header class="bar bar-header bar-dark nav-bar">' + 
        '<a href="#" ng-click="goBack()" class="button" ng-if="controllers.length > 1">Back</a>' +
        '<h1 class="title">{{getTopController().title}}</h1>' + 
      '</header>',
    link: function(scope, element, attrs, navCtrl) {
      scope.goBack = function() {
        navCtrl.pop();
      }
    }
  }
})

.directive('navContent', function() {
  return {
    restrict: 'ECA',
    scope: true,
    link: function(scope, element, attrs) {
      scope.title = attrs.title;
      scope.isVisible = true;
      scope.pushController(scope);
    }
  }
});
