angular.module('ionic.ui', [])

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

.controller('TabsCtrl', function($scope) {
  var _this = this;

  angular.extend(this, TabBarController.prototype);

  var tab = document.createElement('div');
  tab.className = 'tabs';
  TabBarController.call(this, {
    tabBar: new TabBar({el: tab})
  });

  $scope.controllers = this.controllers;

  /*
  // Controller stuff goes here
  $scope.items = [];

  this.addItem = function(item) {
    console.log('Adding item', item);
    $scope.items.push({
      title: item.title
    });
  };
  */
})

.directive('tabs', function() {
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
  }
})

// Generic controller directive
.directive('tabController', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div ng-transclude></div>',
    require: '^tabs',
    scope: {
      title: '@'
    },
    link: function(scope, element, attrs, tabsCtrl) {
      tabsCtrl.addController(scope);
    }
  }
})


.directive('tabBar', function() {
  return {
    restrict: 'E',
    require: '^tabs',
    transclude: true,
    replace: true,
    template: '<div class="tabs">' + 
      '<a href="#" class="tab-item" ng-repeat="controller in controllers">' +
        '<i class="{{item.icon}}"></i> {{controller.title}}' +
      '</a>' +
    '</div>'
  }
})

.directive('tabItem', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^tabBar',
    scope: {
      text: '@',
      icon: '@',
      active: '=',
      tabSelected: '@',
    },
    compile: function(element, attrs, transclude) {
      return function(scope, element, attrs, tabBarCtrl) {
        var getActive, setActive;

        scope.$watch('active', function(active) {
          console.log('ACTIVE CHANGED', active);
        });
      };
    },
    link: function(scope, element, attrs, tabBarCtrl) {

      // Store the index of this list item, which
      // specifies which tab item it is
      scope.tabIndex = element.index();

      scope.active = true;

      scope.selectTab = function(index) {
        console.log('SELECT TAB', index);
        tabBarCtrl.selectTabAtIndex(index);
      };
      
      tabBarCtrl.addTab(scope);
    },
    template: '<li class="tab-item" ng-class="{active:active}">' + 
        '<a href="#" ng-click="selectTab(tabIndex)">' + 
          '<i class="{{icon}}"></i>' +
          '{{text}}' +
        '</a></li>'
  }
});
