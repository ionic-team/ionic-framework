angular.module('ionic.ui.tabs', ['ngAnimate'])

.controller('TabsCtrl', ['$scope', '$element', '$animate', function($scope, $element, $animate) {
  var _this = this;

  angular.extend(this, ionic.controllers.TabBarController.prototype);

  ionic.controllers.TabBarController.call(this, {
    controllerChanged: function(oldC, oldI, newC, newI) {
      $scope.controllerChanged && $scope.controllerChanged({
        oldController: oldC,
        oldIndex: oldI,
        newController: newC,
        newIndex: newI
      });
    },
    tabBar: {
      tryTabSelect: function() {},
      setSelectedItem: function(index) {},
      addItem: function(item) {}
    }
  });

  this.add = function(controller) {
    this.addController(controller);
    this.select(0);
  };

  this.select = function(controllerIndex) {
    //var oldIndex = _this.getSelectedIndex();

    $scope.activeAnimation = $scope.animation;
    /*
    if(controllerIndex > oldIndex) {
    } else if(controllerIndex < oldIndex) {
      $scope.activeAnimation = $scope.animation + '-reverse';
    }
    */
    _this.selectController(controllerIndex);
  };

  $scope.controllers = this.controllers;
}])

.directive('tabs', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      animation: '@',
      controllerChanged: '&',
      tabsType: '@',
      tabsStyle: '@',
    },
    transclude: true,
    controller: 'TabsCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="content"><tab-controller-bar></tab-controller-bar></div>',
    compile: function(element, attr, transclude, tabsCtrl) {
      return function($scope, $element, $attr) {
        $scope.$watch('activeAnimation', function(value) {
          //$element.removeClass($scope.animation + ' ' + $scope.animation + '-reverse');
          $element.addClass($scope.activeAnimation);
        });
        transclude($scope, function(cloned) {
          $element.prepend(cloned);
        });
      };
    }
  };
})

// Generic controller directive
.directive('tab', ['$animate', function($animate) {
  return {
    restrict: 'E',
    replace: true,
    require: '^tabs',
    scope: true,
    transclude: 'element',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, tabsCtrl) {
        var childScope, childElement;

        $scope.title = $attr.title;
        $scope.icon = $attr.icon;
        $scope.iconOn = $attr.iconOn;
        $scope.iconOff = $attr.iconOff;
        tabsCtrl.add($scope);
        
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
              childElement.addClass('view-full');
              $animate.enter(clone, $element.parent(), $element);
            });
          }
        });
      }
    }
  };
}])


.directive('tabControllerBar', function() {
  return {
    restrict: 'E',
    require: '^tabs',
    transclude: true,
    replace: true,
    scope: true,
    template: '<div class="tabs">' + 
      '<tab-controller-item title="{{controller.title}}" icon="{{controller.icon}}" icon-on="{{controller.iconOn}}" icon-off="{{controller.iconOff}}" active="controller.isVisible" index="$index" ng-repeat="controller in controllers"></tab-controller-item>' + 
    '</div>',
    link: function($scope, $element, $attr) {
      $element.addClass($scope.tabsType);
      $element.addClass($scope.tabsStyle);
    }
  };
})

.directive('tabControllerItem', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^tabs',
    scope: {
      title: '@',
      icon: '@',
      iconOn: '@',
      iconOff: '@',
      active: '=',
      tabSelected: '@',
      index: '='
    },
    link: function(scope, element, attrs, tabsCtrl) {
      if(attrs.icon) {
        scope.iconOn = scope.iconOff = attrs.icon;
      }
      scope.selectTab = function(index) {
        tabsCtrl.select(scope.index);
      };
    },
    template: 
      '<a ng-class="{active:active}" ng-click="selectTab()" class="tab-item">' +
        '<i ng-class="{{icon}}" ng-if="icon"></i>' +
        '<i class="{{iconOn}}" ng-if="active"></i>' +
        '<i class="{{iconOff}}" ng-if="!active"></i> {{title}}' +
      '</a>'
  };
})

.directive('tabBar', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="tabs tabs-primary" ng-transclude>' + 
    '</div>'
  }
});

