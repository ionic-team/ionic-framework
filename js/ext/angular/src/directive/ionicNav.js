(function() {
'use strict';

angular.module('ionic.ui.nav', ['ionic.service'])

.controller('NavCtrl', ['$scope', '$element', '$compile', 'TemplateLoader', function($scope, $element, $compile, TemplateLoader) {
  var _this = this;

  angular.extend(this, ionic.controllers.NavController.prototype);

  this.pushFromTemplate = function(tmpl) {
    data = TemplateLoader.load(tmpl).then(function(data) {
      console.log('Nav loaded template', data);

      var childScope = $scope.$new();
      childScope.isVisible = true;
      
      $compile(data)(childScope, function(cloned, scope) {
        $element.append(cloned);
      });
    });
  };

  ionic.controllers.NavController.call(this, {
    content: {
    },
    navBar: {
      shouldGoBack: function() {
      },
      show: function() {
        this.isVisible = true;
      },
      hide: function() {
        this.isVisible = false;
      },
      setTitle: function(title) {
        $scope.navController.title = title;
      },
      showBackButton: function(show) {
      },
    }
  });

  $scope.pushController = function(scope) {
    _this.push(scope);
  };

  $scope.navController = this;
}])

.directive('navCtrl', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'NavCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view" ng-transclude></div>',
  };
})

.directive('navBar', function() {
  return {
    restrict: 'E',
    require: '^navCtrl',
    replace: true,
    scope: true,
    template: '<header class="bar bar-header bar-dark nav-bar" ng-class="{hidden: !navController.navBar.isVisible}">' + 
        '<a href="#" ng-click="goBack()" class="button" ng-if="navController.controllers.length > 1">Back</a>' +
        '<h1 class="title">{{navController.getTopController().title}}</h1>' + 
      '</header>',
    link: function(scope, element, attrs, navCtrl) {
      scope.navController = navCtrl;
      scope.goBack = function() {
        navCtrl.pop();
      };
    }
  };
})

.directive('navContent', function() {
  return {
    restrict: 'ECA',
    require: '^navCtrl',
    scope: true,
    link: function(scope, element, attrs, navCtrl) {
      scope.title = attrs.title;

      if(attrs.navBar === "false") {
        navCtrl.hideNavBar();
      } else {
        navCtrl.showNavBar();
      }

      scope.isVisible = true;
      scope.pushController(scope);

      scope.$watch('isVisible', function(value) {
        console.log('Visiblity changed', value);
        if(value) {
          element[0].classList.remove('hidden');
        } else {
          element[0].classList.add('hidden');
        }
      });
    }
  };
});

})();
