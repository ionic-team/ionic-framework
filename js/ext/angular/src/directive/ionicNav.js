(function() {
'use strict';

angular.module('ionic.ui.nav', ['ionic.service.templateLoad', 'ionic.service.gesture', 'ngAnimate'])

.controller('NavCtrl', ['$scope', '$element', '$animate', '$compile', 'TemplateLoader', function($scope, $element, $animate, $compile, TemplateLoader) {
  var _this = this;

  angular.extend(this, ionic.controllers.NavController.prototype);

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

  this.handleDrag = function(e) {
  };

  this.endDrag = function(e) {
  };

  this.pushFromTemplate = function(templateUrl) {
    var childScope = $scope.$new();
    childScope.isVisible = true;

    TemplateLoader.load(templateUrl).then(function(templateString) {
      var el = $compile(templateString)(childScope, function(cloned, scope) {
        angular.element($element[0].children[1].firstElementChild).append(cloned);
      });
    });
  };

  $scope.pushController = function(scope, element) {
    _this.push(scope);

    /*
    var old = angular.element($element[0].children[1]);
    $animate.enter(element, $element, $element[0].firstElementChild, function() {
    });
    $animate.leave(old, function() {
    });
    */
  };

  $scope.navController = this;
}])

.directive('navs', function() {
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
    require: '^navs',
    replace: true,
    scope: true,
    template: '<header class="bar bar-header bar-dark nav-bar" ng-class="{hidden: !navController.navBar.isVisible}">' + 
        '<a href="#" ng-click="goBack()" class="button" ng-if="navController.controllers.length > 1">Back</a>' +
        '<h1 class="title">{{navController.getTopController().title}}</h1>' + 
      '</header>',
    link: function(scope, element, attrs, navCtrl) {
      scope.navController = navCtrl;
      scope.$watch('navController.controllers.length', function(value) {
      });
      scope.goBack = function() {
        navCtrl.pop();
      };
    }
  };
})

.directive('navContent', ['Gesture', '$animate', function(Gesture, $animate) {
  return {
    restrict: 'ECA',
    require: '^navs',
    scope: true,
    transclude: 'element',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, navCtrl) {
        var lastParent, lastIndex, childScope, childElement;

        $scope.title = $attr.title;

        if($attr.navBar === "false") {
          navCtrl.hideNavBar();
        } else {
          navCtrl.showNavBar();
        }

        $scope.pushController($scope, $element);

        
        $scope.$watch('isVisible', function(value) {
          if(childElement) {
            $animate.leave(childElement);
            childElement = undefined;
          }
          if(childScope) {
            childScope.$destroy();
            childScope = undefined;
          }
          if(value) {
            childScope = $scope.$new();
            transclude(childScope, function(clone) {
              childElement = clone;
              Gesture.on('drag', function(e) {
                //navCtrl.handleDrag(e);
                console.log('Content drag', e);
              }, childElement[0]);

              Gesture.on('release', function(e) {
                //navCtrl._endDrag(e);
              }, childElement[0]);

              var title = $element.parent().parent().parent()[0].querySelector('.title');
              $animate.enter(clone, $element.parent(), $element);
              $animate.addClass(angular.element(title), 'slide-left-fade', function() {
                $animate.removeClass(angular.element(title), 'slide-left-fade', function() {
                });
              });
            });
          }
        });
      }
    }
  };
}]);

})();
