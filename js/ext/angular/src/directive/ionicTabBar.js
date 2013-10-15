angular.module('ionic.ui.tabs', [])

.controller('TabsCtrl', function($scope) {
  var _this = this;

  angular.extend(this, ionic.controllers.TabBarController.prototype);

  ionic.controllers.TabBarController.call(this, {
    tabBar: {
      tryTabSelect: function() {},
      setSelectedItem: function(index) {
        console.log('TAB BAR SET SELECTED INDEX', index);
      },
      addItem: function(item) {
        console.log('TAB BAR ADD ITEM', item);
      }
    }
  });

  $scope.controllers = this.controllers;

  $scope.$watch('controllers', function(newV, oldV) {
    console.log("CControlelrs changed", newV, oldV);
    //$scope.$apply();
  });
})

.directive('tabController', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    transclude: true,
    controller: 'TabsCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view"><div ng-transclude></div><tab-bar></tab-bar></div>',
    compile: function(element, attr, transclude, tabsCtrl) {
      return function($scope, $element, $attr) {
      };
    }
  };
})

// Generic controller directive
.directive('tabContent', function() {
  return {
    restrict: 'CA',
    replace: true,
    require: '^tabController',
    scope: true,
    link: function(scope, element, attrs, tabsCtrl) {
      scope.$watch('isVisible', function(value) {
        if(!value) {
          element[0].style.display = 'none';
        } else {
          element[0].style.display = 'block';
        }
      });

      scope.title = attrs.title;
      scope.icon = attrs.icon;
      scope.iconOn = attrs.iconOn;
      scope.iconOff = attrs.iconOff;
      tabsCtrl.addController(scope);
    }
  };
})


.directive('tabBar', function() {
  return {
    restrict: 'E',
    require: '^tabController',
    transclude: true,
    replace: true,
    scope: true,
    template: '<div class="tabs tabs-primary">' + 
      '<tab-item title="{{controller.title}}" icon="{{controller.icon}}" icon-on="{{controller.iconOn}}" icon-off="{{controller.iconOff}}" active="controller.isVisible" index="$index" ng-repeat="controller in controllers"></tab-item>' + 
    '</div>'
  };
})

.directive('tabItem', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^tabController',
    scope: {
      title: '@',
      iconOn: '@',
      iconOff: '@',
      active: '=',
      tabSelected: '@',
      index: '='
    },
    link: function(scope, element, attrs, tabsCtrl) {
      console.log('Linked item', scope);
      scope.selectTab = function(index) {
        tabsCtrl.selectController(scope.index);
      };
    },
    template: 
      '<a href="#" ng-class="{active:active}" ng-click="selectTab()" class="tab-item">' +
        '<i class="{{icon}}" ng-if="icon"></i>' +
        '<i class="{{iconOn}}" ng-if="active"></i>' +
        '<i class="{{iconOff}}" ng-if="!active"></i> {{title}}' +
      '</a>'
  };
});
