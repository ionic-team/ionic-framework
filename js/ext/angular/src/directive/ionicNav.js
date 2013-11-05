(function() {
'use strict';

angular.module('ionic.ui.nav', ['ionic.service.templateLoad', 'ionic.service.gesture', 'ionic.service.platform', 'ngAnimate'])

.controller('NavCtrl', ['$scope', '$element', '$animate', '$compile', 'TemplateLoader', 'Platform', function($scope, $element, $animate, $compile, TemplateLoader, Platform) {
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

  // Support Android hardware back button (native only, not mobile web)
  var onHardwareBackButton = function(e) {
    $scope.$apply(function() {
      _this.pop();
    });
  }
  Platform.onHardwareBackButton(onHardwareBackButton);


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
        $animate.enter(cloned, angular.element(content));
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

  $scope.$on('$destroy', function() {
    // Remove back button listener
    Platform.offHardwareBackButton(onHardwareBackButton);
  });
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

.directive('navContent', ['Gesture', '$animate', '$compile', function(Gesture, $animate, $compile) {

  // We need to animate the new controller into view.
  var animatePushedController = function(childScope, clone, $element) {
    var parent = angular.element($element.parent().parent().parent());
    
    var title = angular.element(parent[0].querySelector('.title'));

    // Clone the old title and insert it so we can animate it back into place for the new controller
    var newTitle = angular.element(title.clone());

    $compile(newTitle)(childScope);
    title.after(newTitle);

    // Grab the button so we can slide it in
    var button = angular.element(parent[0].querySelector('.button'));

    clone.addClass(childScope.slideInAnimation);

    // Slide the button in
    $animate.addClass(button, childScope.slideButtonInAnimation, function() {
      $animate.removeClass(button, childScope.slideButtonInAnimation, function() {});
    })

    // Slide the new title in
    $animate.addClass(newTitle, childScope.slideTitleInAnimation, function() {
      $animate.removeClass(newTitle, childScope.slideTitleInAnimation, function() {
        newTitle.scope().$destroy();
        newTitle.remove();
      });
    });

    // Grab the old title and slide it out
    var title = $element.parent().parent().parent()[0].querySelector('.title');
    $animate.enter(clone, $element.parent(), $element);
    $animate.addClass(angular.element(title), childScope.slideTitleOutAnimation, function() {
      $animate.removeClass(angular.element(title), childScope.slideTitleOutAnimation, function() {
      });
    });
  };

  return {
    restrict: 'ECA',
    require: '^navs',
    transclude: 'element',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, navCtrl) {
        var lastParent, lastIndex, childScope, childElement;


        $scope.title = $attr.title;
        $scope.slideInAnimation = $attr.slideAnimation || 'content-slide-in';
        $scope.slideTitleInAnimation = $attr.slideTitleInAnimation || 'bar-title-in';
        $scope.slideTitleOutAnimation = $attr.slideTitleOutAnimation || 'bar-title-out';
        $scope.slideButtonInAnimation = $attr.slideButtonInAnimation || 'bar-button-in';
        $scope.slideButtonOutAnimation = $attr.slideButtonOutAnimation || 'bar-button-out';

        if($attr.navBar === "false") {
          navCtrl.hideNavBar();
        } else {
          navCtrl.showNavBar();
        }

        // Push this controller onto the stack
        $scope.pushController($scope, $element);

        $scope.$watch('isVisible', function(value) {
          // Taken from ngIf
          if(childElement) {
            $animate.leave(childElement);
            childElement = undefined;
          }
          if(childScope) {
            childScope.$destroy();
            childScope = undefined;
          }

          // Check if this is visible, and if so, create it and show it
          if(value) {
            childScope = $scope.$new();

            transclude(childScope, function(clone) {
              childElement = clone;

              animatePushedController(childScope, clone, $element);
            });
          } 
        });
      }
    }
  };
}]);

})();
