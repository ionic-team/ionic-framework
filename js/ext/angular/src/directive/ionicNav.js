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

  /**
   * Push a template onto the navigation stack.
   * @param {string} templateUrl the URL of the template to load.
   */
  this.pushFromTemplate = function(templateUrl) {
    var childScope = $scope.$new();
    childScope.isVisible = true;

    // Load the given template
    TemplateLoader.load(templateUrl).then(function(templateString) {

      // Compile the template with the new scrope, and append it to the navigation's content area
      var el = $compile(templateString)(childScope, function(cloned, scope) {
        var content = $element[0].querySelector('.content');
        var title = $element.parent().parent().parent()[0].querySelector('.title');
        var newTitle = angular.element(title.cloneNode());

        $compile(newTitle)(childScope);

        title.parentNode.insertBefore(newTitle[0], title.nextSibling);

        console.log(newTitle);
        $animate.enter(cloned, angular.element(content));
        $animate.addClass(angular.element(newTitle), 'slide-in-left-fade', function() {
          $animate.removeClass(angular.element(newTitle), 'slide-in-left-fade', function() {
            newTitle.scope().$destroy();
            newTitle.remove();
          });
        });
      });
    });
  };

  /**
   * Push a controller to the stack. This is called by the child
   * nav-content directive when it is linked to a scope on the page.
   */
  $scope.pushController = function(scope, element) {
    _this.push(scope);
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
